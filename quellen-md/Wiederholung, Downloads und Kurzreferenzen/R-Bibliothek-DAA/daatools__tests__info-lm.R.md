# daatools/tests/info-lm.R

```r
library(daatools)
same = function(x, y) stopifnot(isTRUE(all.equal(x, y)))
set.seed(84)
d = data.frame(x=rnorm(30), y=rnorm(30))
d$duplicate = 2*d$x
d$zero = 0
models = list(lm(y ~ x, d), lm(y ~ 1, d), lm(y ~ 0 + x, d),
              lm(y ~ x + duplicate + zero, d), lm(y ~ 0 + zero, d))
for (model in models) {
  for (level in c(0.8, 0.95)) {
    result = info(model, credMass=level)
    same(rownames(result), names(coef(model)))
    stopifnot(ncol(result)==5L)
    estimable = names(coef(model))[!is.na(coef(model))]
    cf = summary(model)$coefficients
    same(unname(result[estimable, 1:2, drop=FALSE]), unname(cf[, 1:2, drop=FALSE]))
    same(unname(result[, 3:4, drop=FALSE]), unname(confint(model, level=level)))
    same(unname(result[estimable, 5]), unname(cf[, 4]))
    stopifnot(all(is.na(result[is.na(coef(model)), , drop=FALSE])))
    printed = capture.output(print(result))
    if (anyNA(coef(model))) stopifnot(any(grepl("NA", printed, fixed=TRUE)))
  }
}
```
