# daatools/tests/acf-overlay.R

```r
library(daatools)
plot_file = tempfile(fileext=".pdf")
pdf(plot_file)
same = function(a, b) stopifnot(isTRUE(all.equal(a, b)))
expect_error = function(expr) stopifnot(inherits(try(expr, silent=TRUE), 'try-error'))

# These alternating sequences have known ACFs and distinct chain correlations.
n = 60L
x = array(0, c(n, 2, 3), dimnames=list(NULL, NULL, c('beta[2]', 'alpha', 'beta[1]')))
x[, 1, ] = rep(c(1, -1), n/2)
x[, 2, ] = rep(c(1, 1, -1, -1), n/4)
p = mcmc_acf_overlay(x, lags=2)
stopifnot(nrow(p$data)==18L)
same(p$data$AC[p$data$Chain==1 & p$data$Parameter=='alpha'], c(1, -59/60, 58/60))
same(p$data$AC[p$data$Chain==2 & p$data$Parameter=='alpha'], c(1, 1/60, -58/60))
same(levels(p$data$Parameter), dimnames(x)[[3]])
selected = mcmc_acf_overlay(x, pars=c('alpha', 'alpha'), regex_pars=c('beta', 'alpha'))
same(levels(selected$data$Parameter), c('alpha', 'beta[2]', 'beta[1]'))
same(levels(mcmc_acf_overlay(x, pars=c('beta[1]', 'alpha'))$data$Parameter),
     c('beta[1]', 'alpha'))
same(levels(mcmc_acf_overlay(x, regex_pars='^alpha$')$data$Parameter), 'alpha')

# Subsetting must not collapse single chains or parameters.
for (chains in list(1L, 1:2)) {
  for (parameters in list(1L, 1:3)) {
    for (lag in c(0L, 1L, n-2L)) {
      plot = mcmc_acf_overlay(x[, chains, parameters, drop=FALSE], lags=lag, size=0.8)
      stopifnot(nrow(plot$data)==length(chains)*length(parameters)*(lag+1),
                nlevels(plot$data$Chain)==length(chains),
                nlevels(plot$data$Parameter)==length(parameters))
      built = ggplot2::ggplot_build(plot)
      same(unique(built$data[[2]]$linewidth), 0.8)
      stopifnot(length(unique(built$data[[2]]$PANEL))==length(parameters))
      ggplot2::ggplotGrob(plot)
    }
  }
}
expect_error(mcmc_acf_overlay(x, pars='unknown'))
expect_error(mcmc_acf_overlay(x, regex_pars='unknown'))
expect_error(mcmc_acf_overlay(x, pars='alpha', regex_pars='unknown'))
for (lag in list(-1, 0.5, NA, Inf, c(1,2), n-1, n)) {
  expect_error(mcmc_acf_overlay(x, lags=lag))
}
bad = x
bad[1,1,1] = NA
expect_error(mcmc_acf_overlay(bad))
expect_error(mcmc_acf_overlay(x[FALSE,,,drop=FALSE]))
expect_error(mcmc_acf_overlay(matrix(1:60, ncol=2)))
dev.off()
unlink(plot_file)
cat('ACF overlay numerical, selection and rendering checks passed.\n')
```
