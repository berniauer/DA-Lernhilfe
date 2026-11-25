# daatools/tests/info-date.R

```r
library(daatools)
same = function(x, y) stopifnot(isTRUE(all.equal(x, y)))
x = as.Date(c("2024-01-05", NA, "2024-01-01", "2024-01-03"))
expected = data.frame(min=as.Date("2024-01-01"), median=as.Date("2024-01-03"),
                      max=as.Date("2024-01-05"), na=1L)
same(info(x), expected)
for (empty in list(as.Date(character()), as.Date(c(NA_character_, NA_character_)))) {
  result = info(empty)
  stopifnot(all(is.na(result[1:3])), result$na==length(empty),
            all(vapply(result[1:3], inherits, logical(1), what="Date")))
}
same(info(x[1]), data.frame(min=x[1], median=x[1], max=x[1], na=0L))
for (df in list(data.frame(date=x),
                data.frame(date=x, other=x+10, number=1:4, category=factor(c("a","b","a","b"))))) {
  for (long in c(FALSE, TRUE)) {
    a = info(df, long=long)
    b = info(tibble::as_tibble(df), long=long)
    same(a, b)
    same(attr(a, "params")$dates["date", , drop=FALSE],
         `rownames<-`(expected, "date"))
    output = capture.output(print(a))
    same(output, capture.output(print(b)))
    stopifnot(any(grepl("2024-01-01", output, fixed=TRUE)),
              any(grepl("2024-01-05", output, fixed=TRUE)))
  }
}
```
