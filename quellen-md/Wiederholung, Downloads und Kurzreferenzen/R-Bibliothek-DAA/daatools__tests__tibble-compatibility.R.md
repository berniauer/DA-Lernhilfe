# daatools/tests/tibble-compatibility.R

```r
library(daatools)
library(tibble)

same = function(x, y) stopifnot(isTRUE(all.equal(x, y)))
same_table = function(x, y) {
  same(names(x), names(y))
  same(nrow(x), nrow(y))
  for (nm in names(x)) same(x[[nm]], y[[nm]])
}
expect_error = function(expr) stopifnot(inherits(try(expr, silent=TRUE), "try-error"))

set.seed(41)
df = data.frame(x=runif(100, 1, 5), z=rnorm(100),
                group=factor(rep(c("a", "b"), 50)),
                text=rep(c("yes", "no"), 50), flag=rep(c(TRUE, FALSE), 50))
tbl = as_tibble(df)
original = tbl

# Scaling must preserve values, column order, attributes, and input table class.
for (mode in c("z", "center", "2sd")) {
  for (drop in c(TRUE, FALSE)) {
    for (selection in list(list(), list(include="^x$"), list(exclude="^z$"))) {
      args = c(selection, list(mode=mode, drop.originals=drop))
      a = do.call(zscale_df, c(list(df=df), args))
      b = do.call(zscale_df, c(list(df=tbl), args))
      same_table(a, b)
      stopifnot(is_tibble(b), identical(class(a), "data.frame"))
      cn = if (drop) "x" else "x.z"
      same(inv_zscale(b[[cn]]), df$x)
      for (input in list(df, tbl)) {
        for (reference in list(a, b)) {
          for (keep in c(TRUE, FALSE)) {
            actual = do.call(zscale_df_other,
                             c(list(df=input, other.df=reference,
                                    drop.originals=keep), selection))
            expected = do.call(zscale_df_other,
                               c(list(df=df, other.df=a,
                                      drop.originals=keep), selection))
            same_table(actual, expected)
            stopifnot(identical(is_tibble(actual), is_tibble(input)))
          }
        }
      }
    }
  }
}
same(tbl, original)
for (input in list(df, tbl)) {
  result = center_df(input, exclude="^z$")
  same(result$z, input$z)
  same(result$x, center(input$x))
  same_table(center_df_other(input, result, include="^x$"),
             zscale_df_other(input, result, include="^x$"))
  expect_error(zscale_df_other(input, input["group"]))
  expect_error(zscale_df(input["group"]))
  expect_error(zscale_df(input, include="absent"))
}
one = df["x"]
same_table(zscale_df(one), zscale_df(as_tibble(one)))
# Non-syntactic names must work with selection and reference scaling too.
odd = data.frame("a b"=df$x, check.names=FALSE)
odd_scaled = zscale_df(as_tibble(odd), drop.originals=FALSE)
same_table(zscale_df_other(odd, odd_scaled), zscale_df(odd))

# Splits retain two dimensions, including empty partitions and one-column data.
get_split = function(input, n) {
  split_random(input, n, "train", "test", seed=19)
  list(train=train, test=test)
}
for (input in list(df, one, df[1, , drop=FALSE], df[FALSE, , drop=FALSE])) {
  for (n in unique(c(0, floor(nrow(input)/2), nrow(input)))) {
    a = get_split(input, n)
    b = get_split(as_tibble(input), n)
    same_table(a$train, b$train)
    same_table(a$test, b$test)
    stopifnot(is_tibble(b$train), is_tibble(b$test),
              is.data.frame(a$train), is.data.frame(a$test),
              nrow(a$train)==n, nrow(a$test)==nrow(input)-n)
  }
}
for (n in list(-1, 101, 1.5, NA, Inf, c(1, 2), "2")) {
  expect_error(get_split(tbl, n))
}

# Existing S3 data.frame methods should dispatch identically for tibbles.
for (input in list(df, one)) {
  tt = as_tibble(input)
  same(daatools::info(input), daatools::info(tt))
  same(capture.output(print(daatools::info(input))), capture.output(print(daatools::info(tt))))
  same(daatools::info(input, long=TRUE), daatools::info(tt, long=TRUE))
  same(hdi(input), hdi(tt))
  same(hdi(input, include="^x$"), hdi(tt, include="^x$"))
  same(foreach_row(input, identity), foreach_row(tt, identity))
  same(suppressWarnings(foreach_column(input, identity)),
       suppressWarnings(foreach_column(tt, identity)))
}
# Numeric HDIs retain credMass second; table methods use include, exclude, credMass.
same(hdi(df$x, 0.8), hdi(df$x, credMass=0.8))
for (input in list(df, tbl, as.matrix(df[c("x", "z")]))) {
  same(hdi(input, NULL, NULL, 0.8), hdi(input, credMass=0.8))
  same(hdi(input, "x|z", "z", 0.8),
       hdi(input, include="x|z", exclude="z", credMass=0.8))
  same(ggplot2::ggplot_build(plotcoef(input, "x|z", "z", 0.8))$data,
       ggplot2::ggplot_build(plotcoef(input, include="x|z", exclude="z", credMass=0.8))$data)
}
numeric_df = df[c("x", "z")]
same(foreach_row(numeric_df, sum), foreach_row(as_tibble(numeric_df), sum))
same(foreach_column(numeric_df, mean), foreach_column(as_tibble(numeric_df), mean))
missing_df = df
missing_df$x[c(2, 7)] = NA
same(daatools::info(missing_df), daatools::info(as_tibble(missing_df)))
same(hdi(missing_df), hdi(as_tibble(missing_df)))

# Render plots to exercise dispatch and column extraction without an interactive device.
plot_file = tempfile(fileext=".pdf")
pdf(plot_file)
for (input in list(df, one, missing_df)) {
  hist(x=input)
  hist(x=as_tibble(input))
  daatools:::hist.data.frame(as_tibble(input))
  for (tabular in list(input, as_tibble(input))) {
    p = plotcoef(tabular, include="^x$", sort=TRUE)
    print(p)
  }
  same(ggplot2::ggplot_build(plotcoef(input))$data,
       ggplot2::ggplot_build(plotcoef(as_tibble(input)))$data)
}
expect_error(hist(x=tbl, unsupported=TRUE))
expect_error(hist(x=df, unsupported=TRUE))
a = plotcorr(df)
b = plotcorr(tbl)
same(a, b)
plotpairs(df)
plotpairs(tbl)

# Model consumers must work when the model was fitted using a tibble.
df$y = 2 + 0.6*df$x + df$z + rnorm(nrow(df))
df$binary = rbinom(nrow(df), 1, plogis(-1 + 0.4*df$x))
tbl = as_tibble(df)
lm_df = lm(y ~ x + z + group, data=df)
lm_tbl = lm(y ~ x + z + group, data=tbl)
glm_df = glm(binary ~ x + group, data=df, family=binomial())
glm_tbl = glm(binary ~ x + group, data=tbl, family=binomial())
same(daatools::info(lm_df), daatools::info(lm_tbl))
same(ggplot2::ggplot_build(plotcoef(lm_tbl, "x|z", "z", 0.8))$data,
     ggplot2::ggplot_build(plotcoef(lm_tbl, include="x|z", exclude="z", credMass=0.8))$data)
same(effectsize(lm_df), effectsize(lm_tbl))
same(effectsize(glm_df), effectsize(glm_tbl))
same(logistic_rates(glm_df), logistic_rates(glm_tbl))
rates = logistic_rates(glm_df)
same(cutoff_index(rates, c(0.1, 0.5, 0.9)),
     cutoff_index(as_tibble(rates), c(0.1, 0.5, 0.9)))
same(logisticR2(glm_df), logisticR2(glm_tbl))
same(hinkley(glm_df), hinkley(glm_tbl))
same(log_linearity_test(glm_df), log_linearity_test(glm_tbl))
same(log_linearity_test(glm_tbl, parameters="x"), log_linearity_test(glm_tbl))
plotfactor(lm_df, "group")
plotfactor(lm_tbl, "group")
ROC(glm_tbl)
# Also exercise model objects that retain a tibble in their model component.
lm_tbl$model = as_tibble(lm_tbl$model)
glm_tbl$model = as_tibble(glm_tbl$model)
same(effectsize(lm_df), effectsize(lm_tbl))
same(log_linearity_test(glm_df), log_linearity_test(glm_tbl))
plotfactor(lm_tbl, "group")
dev.off()
unlink(plot_file)
cat("Data-frame/tibble compatibility checks passed.\n")
```
