# daatools/R/check_mcse.R

```r
check_mcse = function(x, include="beta", exclude=NULL) {
  s = as.matrix(x$stanfit)
  dt = data.frame(mad = apply(s, 2, mad),
                  mcse = x$stan_summary[,'se_mean'])
  vars = .filter.names(row.names(dt), include=include, exclude=exclude)
  dt = dt[vars, ]
  check = dt$mcse / dt$mad
  names(check) = row.names(dt)
  if (sum(check >= 0.05) > 0) {
    cat("Check failed.\nSome coefficients an MCSE larger than 5% of MAD.\n")
  } else {
    cat("Check OK.\nAll coefficients have an MCSE less than 5% of MAD.\n")
  }
  cat("\nMCSE as percentage of MAD (sorted):\n")
  print(round(sort(check, decreasing = TRUE), 3))
}
```
