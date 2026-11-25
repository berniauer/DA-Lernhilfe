# daatools/R/margin_curve.R

```r
margin_curve = function(fit, data, variable, values, samples=250, draws=4000) {
  samples = min(samples, nrow(data))
  d = data[sample.int(nrow(data), samples), ]
  draws = min(draws, nrow(as.matrix(fit)))
  purrr::map_dfr(values, function(v) {
    d[[variable]] = v
    # Posterior draws by observations; omit group-specific effects.
    p = rstanarm::posterior_epred(fit, newdata=d, draws=draws, re.form=NA)

    # Average over observations separately for each posterior draw.
    m = rowMeans(p)
    tibble::tibble(
      value = v,
      estimate = mean(m),
      se = sd(m),
      lower = unname(quantile(m, 0.025)),
      upper = unname(quantile(m, 0.975))
    )
  })
}
```
