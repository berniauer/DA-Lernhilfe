# daatools/tests/prediction-metrics-stan.R

```r
library(daatools)
same = function(a, b) stopifnot(isTRUE(all.equal(a, b, check.attributes=FALSE)))
set.seed(109)
d = data.frame(x=runif(100), z=rnorm(100), g=factor(rep(1:10, each=10)),
                exposure=runif(100, 1, 3))
d$y = sin(5*d$x) + d$z + log(d$exposure) + rnorm(100)
d$b = rbinom(100, 1, plogis(d$x+d$z+log(d$exposure)))
train = d[rep(c(TRUE, TRUE, TRUE, FALSE), 25), ]
test = d[rep(c(FALSE, FALSE, FALSE, TRUE), 25), ]
verify = function(model, response, re.form=NULL) {
  result = prediction_metrics(model, test, re.form=re.form)
  p.train = colMeans(rstanarm::posterior_epred(model, re.form=re.form))
  p.test = colMeans(rstanarm::posterior_epred(model, newdata=test,
                   re.form=re.form, offset=log(test$exposure)))
  y.train = train[[response]]
  y.test = test[[response]]
  mse = c(mean((y.train-p.train)^2), mean((y.test-p.test)^2))
  baseline = mean(y.train)
  same(result$n, c(nrow(train), nrow(test)))
  same(result$Skill, 1-mse/c(mean((y.train-baseline)^2), mean((y.test-baseline)^2)))
  if (response == 'b') {
    same(result$Brier, mse)
    same(result$LogLoss,
         c(-mean(y.train*log(p.train)+(1-y.train)*log1p(-p.train)),
           -mean(y.test*log(p.test)+(1-y.test)*log1p(-p.test))))
  } else {
    same(result$RMSE, sqrt(mse))
    same(result$MAE, c(mean(abs(y.train-p.train)), mean(abs(y.test-p.test))))
  }
}
m = rstanarm::stan_glm(y ~ splines::ns(x, 3) + z + offset(log(exposure)),
                       data=train, chains=1, iter=1000, seed=109, refresh=0)
verify(m, 'y')
# Offset arguments as well as formula offsets must be evaluated on newdata.
m = rstanarm::stan_glmer(b ~ splines::ns(x, 3) + z + (1|g),
                         data=train, family=binomial(), offset=log(exposure),
                         chains=1, iter=1000, seed=109, refresh=0)
verify(m, 'b')
verify(m, 'b', re.form=NA)
```
