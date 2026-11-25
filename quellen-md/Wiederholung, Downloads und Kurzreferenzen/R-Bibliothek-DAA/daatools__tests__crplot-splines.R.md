# daatools/tests/crplot-splines.R

```r
library(daatools)
library(splines)
same = function(a, b) stopifnot(isTRUE(all.equal(a, b, tolerance=1e-8,
                                              check.attributes=FALSE)))
expect_error = function(expr) stopifnot(inherits(try(expr, silent=TRUE), 'try-error'))
set.seed(48)
d = data.frame(x=runif(100), z=rnorm(100),
                f=factor(rep(c('a', 'b'), 50)), g=factor(rep(1:10, each=10)))
d$y = sin(5*d$x) + d$z + rnorm(100)
d$b = rbinom(100, 1, plogis(sin(5*d$x) + d$z))
d$x[c(2, 9)] = NA
fit = function(formula, family=gaussian(), mixed=FALSE) {
  fun = if (mixed) rstanarm::stan_glmer else rstanarm::stan_glm
  fun(formula, data=d, family=family, chains=1, iter=1000, seed=48, refresh=0)
}
plot_file = tempfile(fileext='.pdf')
pdf(plot_file)
verify = function(model, variable, term) {
  actual = car::crPlot(model, variable)
  design = model.matrix(model)
  idx = attr(design, 'assign') %in% match(term, attr(terms(model), 'term.labels'))
  draws = as.matrix(model)
  # Independently average the draw-wise contribution of the entire term.
  contribution = colMeans(draws[, colnames(design)[idx], drop=FALSE] %*%
                           t(design[, idx, drop=FALSE]))
  eta = colMeans(rstanarm::posterior_linpred(model))
  fam = family(model)
  residual = (model$y - fam$linkinv(eta)) / fam$mu.eta(eta)
  center = mean(contribution + residual)
  same(actual$partial, contribution + residual - center)
  same(actual$component, contribution - center)
  same(actual$x, d[[variable]][match(rownames(model.frame(model)), rownames(d))])
}
m = fit(y ~ ns(x, 3) + z + f)
verify(m, 'x', 'ns(x, 3)')
verify(m, 'z', 'z')
verify(m, 'f', 'f')
expect_error(car::crPlot(m, 'absent'))
expect_error(car::crPlot(m, 'x', unused=TRUE))
m = fit(b ~ splines::ns(x, 3) + z + f + offset(z/10), binomial())
verify(m, 'x', 'splines::ns(x, 3)')
verify(m, 'z', 'z')
verify(m, 'f', 'f')
m = fit(y ~ ns(x, 3) * z + f)
expect_error(car::crPlot(m, 'x'))
expect_error(car::crPlot(m, 'z'))
verify(m, 'f', 'f')
m = fit(y ~ ns(x, 3) + z + (1|g), mixed=TRUE)
verify(m, 'x', 'ns(x, 3)')
dev.off()
unlink(plot_file)
```
