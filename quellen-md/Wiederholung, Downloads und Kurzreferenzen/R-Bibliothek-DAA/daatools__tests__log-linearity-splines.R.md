# daatools/tests/log-linearity-splines.R

```r
library(daatools)
library(splines)
set.seed(95)
d = data.frame(x=runif(200), z=runif(200, 1, 4), w=runif(200, 1, 3))
d$y = rbinom(200, 1, plogis(sin(5*d$x) + log(d$z) - 1))
verify = function(fit, data, parameters=c('z', 'w')) {
  actual = log_linearity_test(fit, parameters=parameters)
  ref = update(fit, ~ . + z:log(z) + w:log(w), data=data)
  expected = coef(summary(ref))[c('z:log(z)', 'w:log(w)'), c(1,4), drop=FALSE]
  stopifnot(isTRUE(all.equal(unname(as.matrix(actual[, 1:2])), unname(expected))),
            identical(rownames(actual), rownames(expected)))
  automatic = log_linearity_test(fit)
  stopifnot(isTRUE(all.equal(actual, automatic)))
}
verify(glm(y ~ ns(x, 3) + z + w, binomial(), d), d)
verify(glm(y ~ splines::ns(x, 3) * z + w, binomial(), d), d)
verify(glm(y ~ ns(x, 3) + z + w + offset(log(w)), binomial(), d), d)
verify(glm(y ~ z + w, binomial(), d), d)
fit = local({
  private_data = d
  fit = glm(y ~ ns(x, 3) + z + w, binomial(), private_data)
  rm(private_data)
  fit
})
verify(fit, d)
d$x[1:5] = NA
verify(glm(y ~ ns(x, 3) + z + w, binomial(), d), d[complete.cases(d), ])
fit = glm(y ~ ns(x, 3), binomial(), d)
stopifnot(inherits(try(log_linearity_test(fit), silent=TRUE), 'try-error'))
```
