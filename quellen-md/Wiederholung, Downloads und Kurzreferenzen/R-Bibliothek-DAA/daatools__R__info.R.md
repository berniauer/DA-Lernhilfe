# daatools/R/info.R

```r
info = function(x, ...) {
  UseMethod("info")
}

.print_helper = function(x, attrs="digits", ...) {
  info_params = attr(x, "params")
  attr(x, "params") = NULL
  params = utils::modifyList(info_params, list(...))
  result = list(mtx = unclass(x))
  for (a in attrs) {
    result[a] = list(params[[a]])
    params[[a]] = NULL
  }
  result$params = params
  result
}


info.numeric = function(x, long=FALSE, ...) {
  result = c(mean=mean(x, na.rm = TRUE),
             sd=sd(x, na.rm = TRUE),
             median=median(x, na.rm = TRUE),
             min=min(x, na.rm = TRUE),
             max=max(x, na.rm = TRUE),
             na=sum(is.na(x)),
             neg0=sum(na.omit(x) <= 0))
  if (long) {
    presult = psych::describe(x)
    result = c(result, skew=presult$skew[1], kurt=presult$kurtosis[1])
  }
  return(result)
}

info.integer = info.numeric

info.Date = function(x, ...) {
  observed = x[!is.na(x)]
  if (length(observed) == 0L) {
    limits = rep(as.Date(NA_character_), 3)
  } else {
    limits = c(min(observed), median(observed), max(observed))
  }
  data.frame(min=limits[1], median=limits[2], max=limits[3], na=sum(is.na(x)))
}

info.character = function(x, ...) {
  info(factor(x))
}

info.factor = function(x, ...) {
  t = table(x)
  dimnames(t) = list(dimnames(t)$x) # make dimname anonymous
  return(t)
}

info.logical = info.factor

info.lm = function(x, credMass=0.95, digits=2, ...) {
  cf = summary(x)$coefficients
  # summary.lm omits aliased coefficients, whereas confint.lm retains them.
  coefficient_names = names(coef(x))
  cf = cf[match(coefficient_names, rownames(cf)), , drop=FALSE]
  rownames(cf) = coefficient_names
  intervals = confint(x, level=credMass)[coefficient_names, , drop=FALSE]
  result = cbind(cf[,1:2, drop=FALSE], intervals, cf[,4])
  colnames(result)[5] = 'p-value'
  attr(result, "params") = list(digits=digits, ...)
  class(result) = c("daa_info_lm", class(result))
  result
}

print.daa_info_lm = function(x, ...) {
  with(.print_helper(x, ...), {
    mtx[,5] = round(mtx[,5], max(3, digits))
    mtx[,1:4] = round(mtx[,1:4], digits)
    do.call(print, c(list(x=mtx), params))
  })
}

info.data.frame = function(x, digits=2, long=FALSE, n_levels=20, ...) {
  col_info = list()
  for (col in colnames(x)) {
    col_info[[col]] = info(x[[col]], long)
  }

  n = col_info[vapply(col_info, inherits, logical(1), what="numeric")]
  date_columns = vapply(x, inherits, logical(1), what="Date")
  result = matrix(nrow=0, ncol=0)
  if (length(n) > 0) {
    result = t(as.data.frame(n))
  }
  attr(result, "params") = list(
    factors = col_info[vapply(col_info, inherits, logical(1), what="table")],
    dates = if (any(date_columns)) do.call(rbind, col_info[date_columns]) else NULL,
    n_levels = n_levels,
    digits = digits,
    ...)
  class(result) = c("daa_info_df", class(result))
  result
}

print.daa_info_df = function(x, ...) {
  with(.print_helper(x, attrs=c("digits", "factors", "dates", "n_levels"), ...), {
    # print numerics
    if (nrow(mtx) > 0) {
      do.call(print, c(list(x=round(mtx, digits)), params))
    }

    if (!is.null(dates)) {
      cat("\n")
      do.call(print, c(list(x=dates), params))
    }

    # print factors (and characters)
    if (length(factors) > 0) {
      # convert into matrix/data.frame for pretty printing
      real_rows = max(as.numeric(lapply(factors, length)))
      rows = min(real_rows, n_levels)
      m = matrix(nrow=rows, ncol=length(factors))
      for (i in 1:length(factors)) {
        tble = factors[[i]]
        if (nrow(tble) > rows) {
          by_cnt = tble[order(-tble)][1:rows]
          tble = by_cnt[order(names(by_cnt))]
        }
        vr = paste0(rownames(tble), ": ", tble)
        if (length(vr) < rows) {
          vr = c(vr, rep('', rows - length(vr)))
        }
        m[,i] = vr
      }
      colnames(m) = names(factors)
      cat("\n")
      print(as.data.frame(m), row.names = FALSE)
      if (real_rows > rows) {
        cat(sprintf(
          "\nNote: Some factors have too many levels (max: %d) -- only %d most popular levels shown.\n",
          real_rows, n_levels))
        cat("Use 'n_levels=...' parameter in order to change number of levels shown.\n")
      }
    }
  })
}


info.matrix = function(x, ...) {
  info(as.data.frame(x), ...)
}

info.stanreg = function(x, include=NULL, exclude=NULL, credMass=0.95, digits=2, ...) {
  s = as.matrix(x$stanfit)
  result = cbind(
    median = apply(s, 2, median),
    mad = apply(s, 2, mad),
    hdi(s, credMass = credMass),
    mcse = x$stan_summary[,'se_mean'],
    n_eff = round(x$stan_summary[,'n_eff']),
    Rhat = x$stan_summary[, 'Rhat']
  )
  rows = .filter.names(row.names(result), include=include, exclude=exclude)
  result = result[rows, , drop=FALSE]
  attr(result, "params") = list(digits=digits, ...)
  class(result) = c("daa_info_stanreg", class(result))
  result
}

print.daa_info_stanreg = function(x, ...) {
  with(.print_helper(x, ...), {
    mtx = round(mtx, digits)
    do.call(print, c(list(x=mtx), params))
  })
}
```
