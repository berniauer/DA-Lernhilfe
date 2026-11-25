# daatools/R/plotcoef.R

```r
plotcoef = function(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=TRUE, ...) {
  UseMethod("plotcoef", obj)
}

.natural_order = function(x, decreasing=FALSE) {
  # nimmt an, dass Zahlen nur 1x am Ende stehen (sonst unerwartete Sortierung)
  str = gsub('[0-9]', '', x)
  num = suppressWarnings(as.numeric(gsub('[^0-9]','', x)))
  num[is.na(num)] = 0
  order(str, num, decreasing=decreasing)
}

plotcoef.lm = function(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=TRUE, ...) {
  cnfint = confint(obj, level = credMass)
  summ = data.frame(c.mean = coef(obj), c.low = cnfint[,1], c.high = cnfint[,2])
  summ$Coef = rownames(summ)
  keep = .filter.names(summ$Coef, include=include, exclude=exclude)
  summ = summ[keep,]
  if (sort) {
    summ$Coef.f = factor(summ$Coef, levels = summ$Coef[.natural_order(summ$Coef, decreasing=TRUE)])
  } else {
    summ$Coef.f = factor(summ$Coef, levels = rev(summ$Coef))
  }
  summ[c("c.mean", "c.low", "c.high")] = lapply(summ[c("c.mean", "c.low", "c.high")], transform)
  ggplot2::ggplot(summ, ggplot2::aes(y=.data$Coef.f, x=.data$c.mean)) +
    ggplot2::geom_point() +
    ggplot2::geom_errorbar(ggplot2::aes(xmin=.data$c.low, xmax=.data$c.high, width=0.3), orientation = 'y') +
    ggplot2::geom_vline(xintercept=0, linetype=3) +
    ggplot2::xlab("") +
    ggplot2::ylab("Koeffizienten") +
    ggplot2::ggtitle(title)
}

.plotcoef = function(summaries, include=NULL, exclude=NULL, title=NULL, sort=TRUE) {
  keep = .filter.names(summaries$Coef, include=include, exclude=exclude)
  summaries = summaries[keep, ]

  if (sort) {
    summaries$Coef.f = factor(summaries$Coef,
                              levels = summaries$Coef[.natural_order(summaries$Coef, decreasing=TRUE)])
  } else {
    summaries$Coef.f = factor(summaries$Coef, levels = rev(summaries$Coef))
  }
  ggplot2::ggplot(summaries, ggplot2::aes(y=.data$Coef.f, x=.data$Median)) +
    ggplot2::geom_point() +
    ggplot2::geom_errorbar(ggplot2::aes(xmin=.data$Lower95, xmax=.data$Upper95, width=0.3), orientation='y') +
    ggplot2::geom_vline(xintercept=0, linetype=3) +
    ggplot2::xlab("") +
    ggplot2::ylab("Koeffizienten") +
    ggplot2::ggtitle(title)
}


plotcoef.stanreg = function(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=FALSE, ...) {
  m = transform(as.matrix(obj))
  hdis = hdi(m, credMass=credMass)
  cf = apply(m, 2, median)
  summ = data.frame(Coef = names(cf), Median = cf,
                    Lower95 = hdis[, 'lwr'],
                    Upper95 = hdis[, 'upr'])
  .plotcoef(summ, include=include, exclude=exclude, title=title, sort=sort)
}


plotcoef.matrix = function(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=FALSE, ...) {
  m = .filter.columns(obj, include=include, exclude=exclude)
  m = transform(m)
  hdis = apply(m, 2, function(co) hdi(co, credMass=credMass))
  summ = data.frame(Coef = colnames(m),
                    Median = apply(m, 2, median),
                    Lower95 = hdis[1,],
                    Upper95 = hdis[2,])
  .plotcoef(summ, title = title, sort=sort)
}

plotcoef.data.frame = function(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=FALSE, ...) {
  df = .filter.columns(obj, include=include, exclude=exclude, only.numeric=TRUE)
  df = transform(df)
  hdis = apply(df, 2, function(co) hdi(co, credMass=credMass))
  summ = data.frame(Coef = colnames(df),
                    Median = apply(df, 2, median),
                    Lower95 = hdis[1,],
                    Upper95 = hdis[2,])
  .plotcoef(summ, title = title, sort=sort)
}
```
