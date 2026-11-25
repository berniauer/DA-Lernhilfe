# daatools/tests/check-sampling.R

```r
library(daatools)

# Deterministic draws exercise thresholds without requiring a new Stan fit.
draws = cbind('(Intercept)'=1:100, slope=1:100, mean_PPD=seq(4, 6, length.out=100))
summary = cbind(se_mean=c(100, mad(1:100)*0.04, 0.01),
                n_eff=c(1, 400, 1000), Rhat=c(2, 1.01, 1))
rownames(summary) = colnames(draws)
model = list(stanfit=draws, stan_summary=summary, y=c(4, 6))
run = function(x, ...) {
  output = capture.output(result <- check_sampling(x, ...))
  result
}
result = run(model, include="beta")
stopifnot(all(result$checks), identical(rownames(result$diagnostics), 'slope'),
          result$mean_PPD['mean_y']==5)
stopifnot(!all(run(model, include=NULL)$checks))
stopifnot(all(run(model, include=NULL, exclude='Intercept')$checks))

bad = model
bad$stan_summary['slope', ] = c(mad(1:100)*0.05, 399, 1.011)
bad$y = c(10, 12)
stopifnot(!any(run(bad)$checks))
bad$stan_summary['slope', ] = NA_real_
stopifnot(!any(run(bad)$checks))
bad = model
bad$stanfit[, 'slope'] = 1
stopifnot(!run(bad)$checks['mcse'])

# Match summary and draw columns by name, not by position.
model$stanfit = model$stanfit[, c('mean_PPD', 'slope', '(Intercept)')]
stopifnot(isTRUE(all.equal(result, run(model, include="beta"))))
for (args in list(list(neff_min=NA), list(mcse_max=0), list(rhat_max=Inf),
                  list(credMass=1), list(include='absent'))) {
  stopifnot(inherits(try(do.call(run, c(list(model), args)), silent=TRUE), 'try-error'))
}
```
