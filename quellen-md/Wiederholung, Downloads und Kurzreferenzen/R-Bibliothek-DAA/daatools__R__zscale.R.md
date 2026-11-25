# daatools/R/zscale.R

```r
zscale = function(x, mode=c("z", "center", "2sd")) {
  mode = match.arg(mode)
  if (mode == "center") {
    z = x - mean(x)
    stddev = 1
  } else {
    x_sd = ifelse(mode == "2sd", 2, 1) * sd(x)
    z = (x - mean(x)) / x_sd
    stddev = x_sd
  }
  attr(z, "mean") = mean(x)
  attr(z, "sd") = stddev
  return(z)
}

inv_zscale = function(z) {
  if (is.null(attr(z, "sd")) | is.null(attr(z, "mean"))) {
    stop("vector has no mean or sd attribute")
  }
  x = z * attr(z, "sd") + attr(z, "mean")
  attr(x, "mean") = NULL
  attr(x, "sd") = NULL
  return(x)
}

zscale_other = function(x, scaled.var) {
  if (is.null(attr(scaled.var, "sd")) | is.null(attr(scaled.var, "mean"))) {
    stop("scaled.var vector has no mean or sd attribute")
  }
  z = (x - attr(scaled.var, "mean")) / attr(scaled.var, "sd")
  attr(z, "mean") = attr(scaled.var, "mean")
  attr(z, "sd") = attr(scaled.var, "sd")
  return(z)
}

inv_zscale_other = function(z, scaled.var) {
  if (is.null(attr(scaled.var, "sd")) | is.null(attr(scaled.var, "mean"))) {
    stop("scaled.var vector has no mean or sd attribute")
  }
  x = z * attr(scaled.var, "sd") + attr( scaled.var, "mean")
  attr(x, "mean") = NULL
  attr(x, "sd") = NULL
  return(x)
}


zscale_df = function(df, include=NULL, exclude=NULL, mode=c("z","center","2sd"), drop.originals=TRUE) {
  mode = match.arg(mode)
  to_scale = .filter.columns(df, include=include, exclude=exclude, only.numeric=TRUE)
  new.cols = lapply(to_scale, function(x) zscale(x, mode=mode))
  col.names = names(new.cols)
  if (drop.originals) {
    df = df[, !(colnames(df) %in% col.names), drop=FALSE]
  } else {
    names(new.cols) = paste0(col.names, ".z")
  }
  # Assign vectors directly to preserve the table class and scaling attributes.
  for (cn in names(new.cols)) {
    df[[cn]] = new.cols[[cn]]
  }
  df
}


zscale_df_other = function(df, other.df, include=NULL, exclude=NULL, drop.originals=TRUE) {
  to_scale = .filter.columns(df, include=include, exclude=exclude, only.numeric=TRUE)
  new.cols = list()
  for (cn in colnames(to_scale)) {
    cz = paste0(cn, ".z")
    if (cz %in% colnames(other.df))
      new.cols[[cn]] = zscale_other(df[[cn]], other.df[[cz]])
    else if (cn %in% colnames(other.df))
      new.cols[[cn]] = zscale_other(df[[cn]], other.df[[cn]])
    else
      stop(paste("Cannot scale column", cn, ": no reference column found"))
  }
  col.names = names(new.cols)
  if (drop.originals) {
    df = df[, !(colnames(df) %in% col.names), drop=FALSE]
  } else {
    names(new.cols) = paste0(col.names, ".z")
  }
  # Assign vectors directly to preserve the table class and scaling attributes.
  for (cn in names(new.cols)) {
    df[[cn]] = new.cols[[cn]]
  }
  df
}

# Zentrieren statt z-Skalierung

center = function(x) {
  zscale(x, mode="center")
}

center_df = function(df, include=NULL, exclude=NULL, drop.originals=TRUE) {
  zscale_df(df=df, include=include, exclude=exclude, mode="center", drop.originals=drop.originals)
}

# aliases
inv_center = inv_zscale
center_other = zscale_other
inv_center_other = inv_zscale_other
center_df_other = zscale_df_other
```
