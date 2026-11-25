# daatools/R/plotfactor.R

```r
.fixef = function(model) {
  if (inherits(model, "stanreg")) {
    rstanarm::fixef(model)
  } else if (inherits(model, "merMod")) {
    lme4::fixef(model)
  } else if (inherits(model, "lm")) {
    stats::coef(model)
  } else {
    stop("Unsupported model class: ", paste(class(model), collapse = ", "))
  }
}

.confint = function(model, params, credMass = 0.95) {
  if (inherits(model, "stanreg")) {
    rstanarm::posterior_interval(
      model,
      prob = credMass,
      pars = params
    )
  } else {
    stats::confint(model, parm = params, level = credMass)
  }
}

plotfactor = function(model, parameter, main = NULL, credMass = 0.95, type = "b") {
  mf = model.frame(model)
  lev = levels(mf[[parameter]])

  cf_all = .fixef(model)
  cf_names = paste0(parameter, lev)
  cf_names = cf_names[cf_names %in% names(cf_all)]

  cf = cf_all[cf_names]
  cfi = .confint(model, cf_names, credMass)

  if (is.null(main))
    main = paste("Faktor:", parameter)

  plot(c(0, cf), ylim = range(0, cfi), type = type,
       main = main, ylab = "", xlab = "", xaxt = "n")
  axis(1, seq_along(lev), lev)
  abline(h = 0, lty = 2, col = "darkgrey")
  cf.seq = seq_along(cf) + 1
  arrows(cf.seq, cfi[, 1],
         cf.seq, cfi[, 2],
         angle = 90, length = 0.05, code = 3)
}
```
