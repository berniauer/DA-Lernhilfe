# daatools/R/foreach.R

```r
foreach_row = function(x, fun) {
  if (is.vector(x)) {
    stop("Variable ist ein Vektor keine Matrix oder Dataframe")
  }
  if (nrow(x) == 1) {
    warning("Hinweis: Variable hat nur eine Zeile! Richtige Variable?")
  }
  result = apply(x, 1, fun)
  if (is.vector(result)) {
    result
  } else {
    t(result)
  }
}

foreach_column = function(x, fun) {
  if (is.vector(x)) {
    stop("Variable ist ein Vektor keine Matrix oder Dataframe")
  }
  if (ncol(x) == 1) {
    warning("Hinweis: Variable hat nur eine Spalte! Richtige Variable?")
  }
  apply(x, 2, fun)
}
```
