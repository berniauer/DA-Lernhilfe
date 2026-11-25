# daatools/tests/tibble-bayesian.R

```r
library(rstanarm)
library(daatools)
set.seed(32)
df = data.frame(x=rnorm(60), group=factor(rep(c("a", "b", "c"),20)))
df$y = 1 + df$x + rnorm(60)
tbl = tibble::as_tibble(df)
model = rstanarm::stan_glm(y ~ x + group, data=tbl, chains=1, iter=2000,
                           seed=32, refresh=0)
same = function(a,b) stopifnot(isTRUE(all.equal(a,b)))
for (type in c("link", "response")) {
  for (se in c(TRUE,FALSE)) {
    same(predict(model, newdata=df, type=type, se.fit=se),
         predict(model, newdata=tbl, type=type, se.fit=se))
  }
}
same(hdi(model, NULL, NULL, 0.8), hdi(model, credMass=0.8))
same(hdi(model, "x|group", "group", 0.8),
     hdi(model, include="x|group", exclude="group", credMass=0.8))
same(hdi(model, include="x|group", add=c(median, foo=mean)),
     hdi(as.matrix(model), include="x|group", add=c(median, foo=mean)))
same(info(model, "x|group", "group", 0.8, 3),
     info(model, include="x|group", exclude="group", credMass=0.8, digits=3))
same(ggplot2::ggplot_build(plotcoef(model, "x|group", "group", 0.8))$data,
     ggplot2::ggplot_build(plotcoef(model, include="x|group", exclude="group", credMass=0.8))$data)
stopifnot(inherits(try(car::crPlot(model, "x", unsupported=TRUE), silent=TRUE), "try-error"))
model_df = model
model_df$data = as.data.frame(model$data)
same(effectsize(model), effectsize(model_df))
plot_file = tempfile(fileext=".pdf")
pdf(plot_file)
# Public draw extraction must preserve the chains and the selected parameter.
acf_plot = mcmc_acf_overlay(model, pars="x", lags=10)
expected_acf = stats::acf(as.array(model)[, 1, "x"], lag.max=10, plot=FALSE)
same(acf_plot$data$AC, as.numeric(expected_acf$acf))
print(acf_plot)
car::crPlot(model, 'x')
car::crPlot(model, 'group')
for (fun in list(diagnose_density, diagnose_distribution, diagnose_fit,
                 diagnose_y_vs_yhat, diagnose_residual, diagnose_residual_dist)) {
  set.seed(32)
  fun(model)
}
diagnose_fit(model, prediction=posterior_predict(model, draws=100), rows=1)
dev.off()
unlink(plot_file)
cat('Bayesian tibble prediction and diagnostic checks passed.\n')

# Marginal curves summarize draw-wise averages on the response scale.
original = tbl
values = c(-1, 0, 1)
curve = margin_curve(model, tbl, "x", values, draws=NULL)
stopifnot(tibble::is_tibble(curve), nrow(curve)==length(values))
same(names(curve), c("value", "estimate", "se", "lower", "upper"))
for (i in seq_along(values)) {
  expected_data = df
  expected_data$x = values[i]
  m = rowMeans(posterior_epred(model, newdata=expected_data, re.form=NA))
  same(as.numeric(unlist(curve[i, -1])),
       c(mean(m), sd(m), unname(quantile(m, c(0.025, 0.975)))))
}
same(curve$value, values)
same(tbl, original)
set.seed(321)
a = margin_curve(model, df, "x", values, draws=40)
set.seed(321)
b = margin_curve(model, tbl, "x", values, draws=40)
same(a, b)
```
