# daatools/tests/prediction-metrics.R

```r
library(daatools)
same = function(a, b) stopifnot(isTRUE(all.equal(a, b, check.attributes=FALSE)))
expect_error = function(expr) stopifnot(inherits(try(expr, silent=TRUE), 'try-error'))
set.seed(103)
d = data.frame(x=runif(120), z=rnorm(120), g=factor(rep(1:12, each=10)))
d$y = sin(5*d$x) + d$z + rep(rnorm(12), each=10) + rnorm(120)
d$b = rbinom(120, 1, plogis(d$x+d$z))
train = d[rep(c(TRUE, TRUE, TRUE, FALSE), 30), ]
test = d[rep(c(FALSE, FALSE, FALSE, TRUE), 30), ]
verify = function(model, train.y, test.y, train.pred, test.pred, ...) {
  result = prediction_metrics(model, test, ...)
  same(result$Dataset, c('Training', 'New data'))
  same(result$n, c(length(train.y), length(test.y)))
  for (i in 1:2) {
    y = list(train.y, test.y)[[i]]
    p = list(train.pred, test.pred)[[i]]
    mse = mean((y-p)^2)
    same(result$Skill[i], 1-mse/mean((y-mean(train.y))^2))
    if ('RMSE' %in% names(result)) {
      same(result$RMSE[i], sqrt(mse))
      same(result$MAE[i], mean(abs(y-p)))
    } else {
      same(result$Brier[i], mse)
      same(result$LogLoss[i], -mean(y*log(p)+(1-y)*log1p(-p)))
    }
  }
  same(result, prediction_metrics(model, tibble::as_tibble(test), ...))
}
m = lm(y ~ splines::ns(x, 3) + z, train)
verify(m, train$y, test$y, fitted(m), predict(m, test))
expect_error(prediction_metrics(m, test[, c('x', 'z')]))
bad = test; bad$y[1] = NA
expect_error(prediction_metrics(m, bad))
bad = test; bad$x[1] = NA
expect_error(prediction_metrics(m, bad))
expect_error(prediction_metrics(m, test[FALSE, ]))
m = glm(b ~ splines::ns(x, 3) + z, train, family=binomial())
verify(m, train$b, test$b, fitted(m), predict(m, test, type='response'))
train$label = factor(ifelse(train$b, 'yes', 'no'), levels=c('no', 'yes'))
test$label = factor(ifelse(test$b, 'yes', 'no'), levels=c('yes', 'no'))
m = glm(label ~ x + z, train, family=binomial())
verify(m, train$b, test$b, fitted(m), predict(m, test, type='response'))
bad = test; bad$label = 'unknown'
expect_error(prediction_metrics(m, bad))

for (binary in c(FALSE, TRUE)) {
  m = if (binary) {
    lme4::glmer(b ~ splines::ns(x, 3) + z + (1|g), train, family=binomial())
  } else lme4::lmer(y ~ splines::ns(x, 3) + z + (1|g), train)
  for (re in list(NULL, NA)) {
    verify(m, if (binary) train$b else train$y, if (binary) test$b else test$y,
           predict(m, type='response', re.form=re),
           predict(m, test, type='response', re.form=re), re.form=re)
  }
}
# Missing training rows, including na.exclude, do not pad the training scores.
train$x[2] = NA
m = lm(y ~ splines::ns(x, 3) + z, train, na.action=na.exclude)
verify(m, train$y[-2], test$y, m$fitted.values, predict(m, test))
m = lm(I(y^2) ~ x, train)
verify(m, train$y[-2]^2, test$y^2, m$fitted.values, predict(m, test))
constant = data.frame(y=rep(2, 5))
stopifnot(all(is.na(prediction_metrics(lm(y~1, constant), constant)$Skill)))
```
