# daatools/R/logit.R

```r
# logit() ist bereits in car & rstanarm definiert

inv_logit = function(lgt) {
  1 / (1 + exp(-lgt))
}

odds = function(x) {
  x / (1 - x)
}

inv_odds = function(o) {
  o / (1 + o)
}
```
