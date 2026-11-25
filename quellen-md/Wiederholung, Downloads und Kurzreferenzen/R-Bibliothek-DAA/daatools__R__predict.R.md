# daatools/R/predict.R

```r
# Keep an offset-aware predict() method for rstanarm GLMs and mixed models.
# rstanarm 2.32.2's predict() ignores offset supplied through ... and does not
# support mixed models. The public posterior APIs handle both cases.
predict.stanreg = function(object, ..., newdata=NULL,
                          type=c("link", "response"), se.fit=FALSE, offset=NULL) {
  type = match.arg(type)
  if (inherits(object, c("betareg", "polr"))) {
    stop("This predict() method supports GLMs and generalized linear mixed models, not beta or ordinal/scobit regression.")
  }

  if (!is.null(offset)) {
    n = if (is.null(newdata)) nrow(model.frame(object)) else nrow(newdata)
    if (!is.numeric(offset) || length(n) != 1L || length(offset) != n ||
        any(!is.finite(offset))) {
      stop("offset must contain one finite numeric value per observation")
    }
  }

  # Preserve stored in-sample point predictions unless an offset is supplied.
  if (!inherits(object, "lmerMod") && !se.fit &&
      is.null(newdata) && is.null(offset)) {
    return(if (type == "link") object$linear.predictors else object$fitted.values)
  }

  if (type == "link") {
    draws = posterior_linpred(object, newdata=newdata, offset=offset)
  } else {
    draws = posterior_epred(object, newdata=newdata, offset=offset)
  }
  fit = colMeans(draws)
  if (se.fit) {
    list(fit=fit, se.fit=apply(draws, 2, sd))
  } else {
    fit
  }
}
```
