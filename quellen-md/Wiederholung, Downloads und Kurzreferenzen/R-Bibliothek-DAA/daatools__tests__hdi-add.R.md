# daatools/tests/hdi-add.R

```r
library(daatools)
same = function(a, b) stopifnot(isTRUE(all.equal(a, b)))
expect_error = function(expr) stopifnot(inherits(try(expr, silent=TRUE), 'try-error'))
x = seq_len(100)
same(hdi(x, add=median), c(lwr=1, upr=96, median=50.5))
same(hdi(x, add=c(median, foo=mean)), c(lwr=1, upr=96, median=50.5, foo=50.5))
same(hdi(x, add=list(median, foo=mean)), hdi(x, add=c(median, foo=mean)))
same(hdi(x, add=stats::median), hdi(x, add=median))
same(hdi(x, add=NULL), hdi(x))
same(hdi(x, add=list()), hdi(x))
summaries = list(mid=median, average=mean)
same(names(hdi(x, add=summaries)), c('lwr', 'upr', 'mid', 'average'))
same(hdi(x, add=list(q=function(x) quantile(x, 0.5))), c(lwr=1, upr=96, q=50.5))
for (input in list(cbind(x=x, z=2*x), data.frame(x=x, z=2*x),
                   tibble::tibble(x=x, z=2*x))) {
  actual = hdi(input, add=c(median, foo=mean))
  same(colnames(actual), c('lwr', 'upr', 'median', 'foo'))
  same(actual[, 1:2], hdi(input))
  same(unname(actual[, 3:4]), rbind(c(50.5, 50.5), c(101, 101)))
  same(rownames(hdi(input, include='x', add=median)), 'x')
}
wide = rbind(x=x, z=2*x)
same(hdi(wide, margin=1, add=median), hdi(t(wide), add=median))
named = cbind(x=x, z=2*x)
names(dimnames(named)) = c('draw', 'variable')
stopifnot(is.null(names(dimnames(hdi(named, add=median)))))
missing = c(x, NA_real_)
stopifnot(is.na(hdi(missing, add=mean)['mean']))
same(unname(hdi(missing, add=list(avg=function(x) mean(x, na.rm=TRUE)))['avg']), 50.5)
expect_error(hdi(x, add='median'))
expect_error(hdi(x, add=list(median, 1)))
expect_error(hdi(x, add=list(lwr=mean)))
expect_error(hdi(x, add=c(median, median)))
expect_error(hdi(x, add=range))
expect_error(hdi(x, add=function(x) 'text'))
```
