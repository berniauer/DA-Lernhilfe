# daatools/tests/effectsize-splines.R

```r
library(daatools)
library(splines)
same = function(a, b) stopifnot(isTRUE(all.equal(a, b, tolerance=1e-7)))
set.seed(74)
d = data.frame(x=runif(120), z=runif(120), g=factor(rep(1:12, each=10)))
d$y = sin(5*d$x) + d$z + rep(rnorm(12), each=10) + rnorm(120)
d$count = rpois(120, exp(0.5 + sin(5*d$x) + d$z))

# Compare every deletion, including interactions, with independent refits.
verify = function(model, data) {
  result = effectsize(model)
  labels = attr(terms(model), 'term.labels')
  factors = attr(terms(model), 'factors')
  for (label in labels) {
    drops = if (label %in% rownames(factors)) {
      colnames(factors)[factors[label, ] > 0]
    } else label
    ref = update(model, as.formula(paste('~ . -', paste(drops, collapse=' - '))),
                 data=data)
    same(result[label, 'Df'], df.residual(ref)-df.residual(model))
    same(result[label, 'AIC'], AIC(ref))
    if ('RSS' %in% names(result)) {
      same(result[label, 'RSS'], sum(residuals(ref)^2))
    } else same(result[label, 'Deviance'], deviance(ref))
  }
}
verify(lm(y ~ ns(x, 3) * z, d), d)
verify(lm(y ~ splines::ns(x, 3) + z, d), d)
verify(glm(count ~ ns(x, 3) * z, poisson(), d), d)
verify(glm(count ~ ns(x, 3) + z + offset(log(z)), poisson(), d), d)
verify(lme4::lmer(y ~ ns(x, 3) * z + (1|g), d), d)
verify(lme4::glmer(count ~ ns(x, 3) + z + (1|g), d, family=poisson()), d)

# Original raw predictors need not be available in the formula environment.
local_fit = local({
  private_data = d
  fit = lm(y ~ ns(x, 3) + z, private_data)
  rm(private_data)
  fit
})
verify(local_fit, d)
# Refits keep the complete-case rows selected by the full model.
d$x[1:4] = NA
fit = lm(y ~ ns(x, 3) + z, d)
verify(fit, d[complete.cases(d), ])
```
