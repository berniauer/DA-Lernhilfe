# daatools/R/logisticR2.R

```r
logisticR2 = function(model) {
  dev = model$deviance
  nulldev = model$null.deviance
  if (is.null(nulldev)) {
    stop("logisticR2 geht nur mit klassischen Modellen. F\u00FCr Bayes: bayes_R2(), loo_R2()")
  }
  n = length(model$y)
  yh = predict(model, type='response')
  r2 = data.frame(R2=c(
    (nulldev - dev) / nulldev, # McFadden
    1 - exp((dev - nulldev) / n), # r² cox & snell
    (1 - exp((dev - nulldev) / n)) / (1 - exp(-nulldev/n)), # r² nagelkerke
    mean(yh[model$y==1]) - mean(yh[model$y==0])  # Tjur
  ))
  row.names(r2) = c('McFadden (1974)', 'Cox & Snell (1989)', 'Nagelkerke (1991)', 'Tjur (2009)')
  r2
}
```
