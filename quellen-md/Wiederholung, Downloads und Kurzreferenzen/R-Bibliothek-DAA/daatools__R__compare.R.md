# daatools/R/compare.R

```r
compare_coef = function(...,
                        include=NULL, exclude=NULL, na.omit=TRUE,
                        transform=identity,
                        uncertainty=c("ci", "se", "none"), credMass=0.95) {
  models = list(...)
  uncertainty = match.arg(uncertainty)

  if (!length(models)) stop("Keine Modelle angegeben.")
  if (credMass <= 0 || credMass >= 1) stop("credMass muss zwischen 0 und 1 liegen.")

  extract = function(m) {
    b = coef(m)
    terms = names(b)
    result = data.frame(row.names=terms)
    if (inherits(m, "stanreg")) {
      samples = as.matrix(m)[, terms, drop=FALSE]
      samples = transform(samples)
      result$coef = colMeans(samples)
      if (uncertainty == "se") {
        result$se = apply(samples, 2, sd)
      } else if (uncertainty == "ci") {
        shdi = hdi(samples, credMass=credMass)
        result$lwr = shdi[, 1]
        result$upr = shdi[, 2]
      }
    } else {
      result$coef = transform(b)
      if (uncertainty == "se") {
        se = sqrt(diag(vcov(m)))[terms]
        h = sqrt(.Machine$double.eps) * pmax(1, abs(b))
        deriv = (transform(b+h) - transform(b-h)) / (2*h)
        result$se = abs(deriv) * se
      } else if (uncertainty == "ci") {
        ci = confint(m, level=credMass)[terms, , drop=FALSE]
        result$lwr = transform(ci[, 1])
        result$upr = transform(ci[, 2])
      }
    }
    result
  }

  results = lapply(models, extract)
  terms = unique(unlist(lapply(results, rownames)))

  names = names(models)
  if (is.null(names)) names = rep("", length(models))
  exprs = as.list(substitute(list(...)))[-1L]
  missing = names == ""
  names[missing] = vapply(exprs[missing], deparse1, character(1))

  out = data.frame(row.names=terms)
  for (i in seq_along(results)) {
    r = results[[i]]
    for (col in colnames(r)) {
      x = rep(NA_real_, length(terms))
      names(x) = terms
      x[rownames(r)] = r[[col]]
      out[[paste0(names[i], ".", col)]] = unname(x)
    }
  }

  out = out[.filter.names(rownames(out), include=include, exclude=exclude), ]
  if (na.omit)
    out = out[complete.cases(out), ]

  class(out) = c("daa_compare_coefs", class(out))
  attr(out, "uncertainty") = uncertainty
  attr(out, "model_names") = names
  attr(out, "credMass") = credMass
  out
}


print.daa_compare_coefs = function(x, digits=2, ...) {
  uncertainty = attr(x, "uncertainty")
  models = attr(x, "model_names")

  fmt = function(v, width) {
    ifelse(is.na(v), strrep(" ", width),
           sprintf(paste0("%", width, ".", digits, "f"), v))
  }

  out = lapply(models, function(m) {
    cols = switch(uncertainty,
                  none = "coef",
                  se   = c("coef", "se"),
                  ci   = c("coef", "lwr", "upr")
    )

    values = lapply(cols, function(col) x[[paste0(m, ".", col)]])

    # Gemeinsame Breite aller Zahlen dieses Modells
    all_values = unlist(values)
    width = max(nchar(sprintf(paste0("%.", digits, "f"),
                              all_values[!is.na(all_values)])),
                1)
    formatted = lapply(values, fmt, width=width)

    result = switch(uncertainty,
                    none = formatted[[1]],
                    se   = paste0(formatted[[1]], " (", formatted[[2]], ") "),
                    ci   = paste0(formatted[[1]], " [",
                                  formatted[[2]], ", ", formatted[[3]], "] ")
    )
    result[is.na(values[[1]])] = NA_character_
    result
  })

  out = as.data.frame(out, optional=TRUE)
  names(out) = models
  rownames(out) = rownames(x)
  print(out, quote=FALSE, right=FALSE, na.print="", ...)
}
```
