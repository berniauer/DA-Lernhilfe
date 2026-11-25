# daatools/R/check_sampling.R

```r
check_sampling = function(x, include=NULL, exclude=NULL,
                          neff_min=400, mcse_max=0.05, rhat_max=1.01,
                          credMass=0.95, n=10) {
  if (!is.numeric(n) || length(n) != 1 || !is.finite(n) ||
      n < 1 || n != floor(n)) {
    stop("n must be a positive finite integer")
  }
  limits = list(neff_min=neff_min, mcse_max=mcse_max, rhat_max=rhat_max,
                credMass=credMass)
  for (nm in names(limits)) {
    value = limits[[nm]]
    if (!is.numeric(value) || length(value) != 1 ||
        !is.finite(value) || value <= 0) {
      stop(nm, " must be a positive finite number")
    }
  }
  if (credMass >= 1) stop("credMass must be less than 1")

  s = as.matrix(x$stanfit)
  summary = x$stan_summary
  vars = rownames(summary)[.filter.names(rownames(summary), include, exclude)]
  dt = data.frame(n_eff=summary[vars, 'n_eff'],
                  mcse_mad=summary[vars, 'se_mean'] /
                    apply(s[, vars, drop=FALSE], 2, mad),
                  Rhat=summary[vars, 'Rhat'], row.names=vars)
  checks = c(n_eff=all(is.finite(dt$n_eff) & dt$n_eff >= neff_min),
             mcse=all(is.finite(dt$mcse_mad) & dt$mcse_mad < mcse_max),
             Rhat=all(is.finite(dt$Rhat) & dt$Rhat <= rhat_max))
  labels = c(paste0("n_eff >= ", neff_min),
             paste0("MCSE < ", 100 * mcse_max, "% of MAD"),
             paste0("Rhat <= ", rhat_max))
  for (i in seq_along(checks)) {
    cat(labels[i], ": Check ", if (checks[i]) "OK" else "failed", ".\n", sep="")
  }
  cat("\nSampling diagnostics (sorted by n_eff, ascending):\n")
  rows = utils::head(order(dt$n_eff), min(n, nrow(dt)))
  output = round(dt[rows, , drop=FALSE], 3)
  output$n_eff = round(dt$n_eff[rows])
  print(output)
  if (nrow(output) < nrow(dt)) {
    cat("Showing ", nrow(output), " of ", nrow(dt), " coefficients.\n", sep="")
  }

  ppd = c(mean_PPD=NA_real_, mean_y=NA_real_, lower=NA_real_, upper=NA_real_)
  checks = c(checks, mean_PPD=FALSE)
  y = x$y
  if ('mean_PPD' %in% colnames(s) && is.numeric(y) &&
      is.null(dim(y)) && length(y) > 0 && all(is.finite(y)) &&
      all(is.finite(s[, 'mean_PPD']))) {
    interval = quantile(s[, 'mean_PPD'], c((1-credMass)/2, (1+credMass)/2),
                        names=FALSE)
    ppd[] = c(mean(s[, 'mean_PPD']), mean(y), interval)
    checks['mean_PPD'] = ppd['mean_y'] >= ppd['lower'] &&
                         ppd['mean_y'] <= ppd['upper']
    cat("\nmean_PPD vs. mean(y): Check ",
        if (checks['mean_PPD']) "OK" else "failed", ".\n",
        "mean(y) must lie within the ", 100 * credMass,
        "% interval of mean_PPD.\n", sep="")
    print(round(ppd, 3))
  } else {
    cat("\nmean_PPD vs. mean(y): Check unavailable.\n",
        "Requires finite mean_PPD draws and a finite numeric response vector.\n", sep="")
  }
  invisible(list(checks=checks, diagnostics=dt, mean_PPD=ppd))
}
```
