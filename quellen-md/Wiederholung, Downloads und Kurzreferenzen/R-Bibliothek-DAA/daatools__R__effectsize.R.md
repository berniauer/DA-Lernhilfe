# daatools/R/effectsize.R

```r
effectsize = function(model) {
  UseMethod("effectsize", model)
}


# own function, because of lmer models
.r.squared = function(model) {
  rss = sum(residuals(model)^2)
  data = model.frame(model) # y = first column
  nss = sum((data[[1]] - mean(data[[1]]))^2)
  1 - (rss / nss)
}


# Reuse evaluated model-frame columns, including spline bases. Re-evaluating
# ns(x, df) in the model frame fails because it contains the basis, not raw x.
.effectsize_drop = function(model, dropvars) {
  reduced = update(formula(model),
                   as.formula(paste("~ . -", paste(dropvars, collapse=" - "))))
  .refit_model_frame(model, reduced)
}


.refit_model_frame = function(model, formula) {
  data = model.frame(model)
  variables = as.list(attr(terms(data), "variables"))[-1]
  replace = function(expr) {
    for (i in seq_along(variables)) {
      if (identical(expr, variables[[i]])) {
        column = as.name(names(data)[i])
        if (is.call(expr) && identical(expr[[1]], as.name("offset"))) {
          return(call("offset", column))
        }
        return(column)
      }
    }
    if (is.call(expr)) {
      for (i in seq_along(expr)[-1]) expr[[i]] = replace(expr[[i]])
    }
    expr
  }
  reduced = replace(formula)
  if (inherits(model, c("glm", "glmerMod"))) {
    update(model, reduced, data=data, family=family(model))
  } else {
    update(model, reduced, data=data)
  }
}


effectsize.lm = function(model) {
  full.r2 = .r.squared(model)
  result = data.frame(Df=NA, RSS = sum(residuals(model)^2), AIC = AIC(model), R2=full.r2, f2=NA)
  m.terms = terms(model)
  labels = attr(m.terms, "term.labels")
  factors = attr(m.terms, "factors")
  resrows = character(0)
  for (label in labels) {
    if (label %in% row.names(factors)) {
      dropvars = colnames(factors)[factors[label, ] > 0]
    } else {
      dropvars = label
    }
    drp = .effectsize_drop(model, dropvars)
    r2 = .r.squared(drp)
    result = rbind(result, list(Df = df.residual(drp) - df.residual(model),
                                RSS = sum(residuals(drp)^2),
                                AIC = AIC(drp),
                                R2 = r2,
                                f2 = (full.r2 - r2) / (1 - full.r2)))
    resrows = c(resrows, label)
  }

  n = nrow(result)
  res.order = order(result$f2[2:n])
  result[2:n, ] = result[res.order + 1, ]
  rownames(result) = c("<none>", resrows[res.order])
  attr(result, "heading") = c("Single term deletions (incl. their interactions)",
                              "\nModel:", format(formula(model)), "")
  class(result) = c("anova", "data.frame")
  result
}


effectsize.glm = function(model) {
  result = data.frame(Df=NA, Deviance = deviance(model), AIC = AIC(model))
  m.terms = terms(model)
  labels = attr(m.terms, "term.labels")
  factors = attr(m.terms, "factors")
  resrows = character(0)
  for (label in labels) {
    if (label %in% row.names(factors)) {
      dropvars = colnames(factors)[factors[label, ] > 0]
    } else {
      dropvars = label
    }
    drp = .effectsize_drop(model, dropvars)
    result = rbind(result, list(Df = df.residual(drp) - df.residual(model),
                                Deviance = deviance(drp),
                                AIC = AIC(drp)))
    resrows = c(resrows, label)
  }
  n = nrow(result)
  res.order = order(result$AIC[2:n])
  result[2:n, ] = result[res.order + 1, ]
  rownames(result) = c("<none>", resrows[res.order])
  attr(result, "heading") = c("Single term deletions (incl. their interactions)",
                              "\nModel:", format(formula(model)), "")
  class(result) = c("anova", "data.frame")
  result
}


effectsize.stanreg = function(model) {
  m.family = family(model)
  if (inherits(model, "lmerMod")) { # random effects model
    if (m.family$family == "gaussian" && m.family$link == "identity") {
      return(effectsize.lm(lme4::lmer(formula(model), data=model$data)))
    }
    return(effectsize.glm(lme4::glmer(formula(model), data=model$data,
                                       family=do.call(m.family$family, list(link=m.family$link)))))
  }

  if (m.family$family == "gaussian" && m.family$link == "identity") {
    return(effectsize(lm(formula(model), data=model$data)))
  }

  return(effectsize(glm(formula(model), data=model$data,
                         family=do.call(m.family$family, list(link=m.family$link)))))
}


effectsize.lmerMod = function(model) {
  effectsize.lm(model)
}


effectsize.glmerMod = function(model) {
  effectsize.glm(model)
}
```
