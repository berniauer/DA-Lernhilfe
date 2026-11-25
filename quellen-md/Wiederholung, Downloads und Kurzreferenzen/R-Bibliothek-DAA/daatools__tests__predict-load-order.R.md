# daatools/tests/predict-load-order.R

```r
# Attaching rstanarm later must not replace the offset-aware predict() method.
library(daatools)
library(rstanarm)
stopifnot(identical(environment(getS3method('predict', 'stanreg')),
                    asNamespace('daatools')))
```
