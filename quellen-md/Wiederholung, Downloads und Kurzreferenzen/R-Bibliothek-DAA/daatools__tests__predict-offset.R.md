# daatools/tests/predict-offset.R

```r
# Load rstanarm first so predict() dispatches to daatools' registered method.
library(rstanarm)
library(daatools)
same = function(a, b) stopifnot(isTRUE(all.equal(a, b)))
expect_error = function(expr) stopifnot(inherits(try(expr, silent=TRUE), 'try-error'))
set.seed(913)
n = 160L
dat = data.frame(x=rnorm(n), g=factor(rep(1:8, each=20)), exposure=runif(n, 1, 5))
group_effect = rep(seq(-0.8, 0.8, length.out=8), each=20)
dat$count = rpois(n, exp(0.2 + 0.3*dat$x + group_effect)*dat$exposure)
dat$binary = rbinom(n, 1, plogis(-0.2 + 0.5*dat$x + group_effect + log(dat$exposure)))

fit_model = function(fun, formula, family, formula_offset=FALSE, optimizing=FALSE) {
  args = list(formula=formula, data=dat, family=family, seed=913, refresh=0)
  if (!formula_offset) args$offset = log(dat$exposure)
  if (optimizing) {
    args$algorithm = 'optimizing'
  } else {
    args$chains = 1
    args$iter = 1200
    args$adapt_delta = 0.99
  }
  do.call(fun, args)
}

check_predictions = function(model) {
  samples = as.matrix(model)
  mixed = inherits(model, 'lmerMod')
  # Independent calculation from posterior coefficients and known design matrix.
  reference = function(newdata, offset) {
    design = model.matrix(~x, newdata)
    eta = samples[, c('(Intercept)', 'x'), drop=FALSE] %*% t(design)
    if (mixed) {
      random_names = paste0('b[(Intercept) g:', newdata$g, ']')
      eta = eta + samples[, random_names, drop=FALSE]
    }
    sweep(eta, 2, offset, '+')
  }
  for (input in list(dat, dat[c(9, 2, 100), ], dat[1, , drop=FALSE])) {
    for (newdata in list(input, tibble::as_tibble(input))) {
      offset = log(newdata$exposure)
      eta = reference(newdata, offset)
      for (type in c('link', 'response')) {
        draws = if (type=='link') eta else family(model)$linkinv(eta)
        expected = list(fit=colMeans(draws), se.fit=apply(draws, 2, sd))
        actual = predict(model, newdata=newdata, type=type, offset=offset, se.fit=TRUE)
        # Tibbles reset row names; the returned values and observation order must agree.
        same(unname(actual$fit), unname(expected$fit))
        same(unname(actual$se.fit), unname(expected$se.fit))
        same(predict(model, newdata=newdata, type=type, offset=offset), actual$fit)
        stopifnot(length(actual$fit)==nrow(newdata))
      }
      base = predict(model, newdata=newdata, offset=offset, se.fit=TRUE)
      shifted = predict(model, newdata=newdata, offset=offset+log(2), se.fit=TRUE)
      same(shifted$fit, base$fit+log(2))
      same(shifted$se.fit, base$se.fit)
      if (family(model)$family=='poisson') {
        base = predict(model, newdata=newdata, type='response', offset=offset, se.fit=TRUE)
        doubled = predict(model, newdata=newdata, type='response', offset=offset+log(2), se.fit=TRUE)
        same(doubled$fit, 2*base$fit)
        same(doubled$se.fit, 2*base$se.fit)
      }
    }
  }
  if (!mixed) {
    same(predict(model), model$linear.predictors)
    same(predict(model, type='response'), model$fitted.values)
  }
  for (type in c('link', 'response')) {
    # Explicit offsets must also work without newdata, bypassing cached predictions.
    for (offset in list(log(dat$exposure), log(dat$exposure)+log(2))) {
      same(predict(model, type=type, offset=offset, se.fit=TRUE),
           predict(model, newdata=dat, type=type, offset=offset, se.fit=TRUE))
      same(predict(model, type=type, offset=offset),
           predict(model, newdata=dat, type=type, offset=offset))
    }
    same(predict(model, type=type, se.fit=TRUE),
         predict(model, newdata=dat, type=type, offset=log(dat$exposure), se.fit=TRUE))
  }
  expect_error(predict(model, newdata=dat[1:3, ], offset=c(1, 2)))
  expect_error(predict(model, offset=c(1, 2)))
  expect_error(predict(model, newdata=dat[1:3, ], offset=c(0, NA, 0)))
}

check_predictions(fit_model(stan_glm, count ~ x, poisson()))
check_predictions(fit_model(stan_glm, count ~ x + offset(log(exposure)), poisson(), formula_offset=TRUE))
check_predictions(fit_model(stan_glm, binary ~ x, binomial()))
check_predictions(fit_model(stan_glmer, count ~ x + (1|g), poisson()))
check_predictions(fit_model(stan_glmer, binary ~ x + (1|g), binomial()))
check_predictions(fit_model(stan_glm, count ~ x, poisson(), optimizing=TRUE))

# Unsupported model classes should fail explicitly before returning cached results.
for (cls in c('betareg', 'polr')) {
  model = structure(list(), class=c('stanreg', cls))
  expect_error(predict(model))
  expect_error(predict(model, newdata=dat, type='response'))
}
cat('GLM and stan_glmer prediction/offset checks passed.\n')
```
