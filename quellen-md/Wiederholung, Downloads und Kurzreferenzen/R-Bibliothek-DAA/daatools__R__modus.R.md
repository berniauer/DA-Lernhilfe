# daatools/R/modus.R

```r
modus = function(x) {
  dens = density(x)
  dens$x[which.max(dens$y)]
}
```
