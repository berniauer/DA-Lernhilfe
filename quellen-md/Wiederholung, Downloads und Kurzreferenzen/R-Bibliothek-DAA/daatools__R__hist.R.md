# daatools/R/hist.R

```r
hist.tbl_df = function(x, include=NULL, exclude=NULL, ...) {
  hist.data.frame(x, include=include, exclude=exclude, ...)
}

hist.data.frame = function(x, include=NULL, exclude=NULL, ...) {
  rlang::check_dots_empty()
  df = .filter.columns(x, include=include, exclude=exclude)
  rows = ifelse(ncol(df)>4, 3, 2)
  cols = ifelse(ncol(df)>6, 3, 2)

  oldpar = par(mfrow=c(rows, cols), mar=c(2.5, 2.5, 2, 1))
  on.exit(par(oldpar))

  plot_x = function(p) { usr[1]+(usr[2]-usr[1])*p }
  plot_y = function(p) { usr[3]+(usr[4]-usr[3])*p }

  for (i in 1:ncol(df)) {
    if (inherits(df[[i]], c('integer', 'numeric'))) {
      mi = min(df[[i]], na.rm = TRUE)
      ma = max(df[[i]], na.rm = TRUE)
      hist(df[[i]], main=colnames(df)[i], xlab="", col='lightblue')
      usr = par()$usr
      text(x=plot_x(0.95), y=plot_y(0.9), labels=bquote("min:" ~ .(mi)), adj=1)
      text(x=plot_x(0.95), y=plot_y(0.8), labels=bquote("max:" ~ .(ma)), adj=1)
      if (mi <= 0) {
        text(x=plot_x(0.98), y=plot_y(0.9), labels="!", col="darkred")
      }
      if (sum(is.na(df[[i]])) > 0) {
        text(x=plot_x(0.95), y=plot_y(0.7), labels=bquote("na:" ~ .(sum(is.na(df[[i]])))), adj=1, col='darkred')
      }
    }
    else if (inherits(df[[i]], c('logical', 'character'))) {
      plot(as.factor(df[[i]]), main=colnames(df)[i], xlab="", col='lightgreen')
    }
    else {
      plot(df[[i]], main=colnames(df)[i], xlab="", col='lightgreen')
    }
  }
}
```
