# daatools/R/brier.R

```r
.calc_brier = function(y, yhat) {
  if (is.matrix(y)) { # gruppierte Daten (success, failure)
    successes = y[,1]
    failures  = y[,2]
    score = sum(successes * (1 - yhat)^2 + failures * yhat^2) / sum(successes + failures)
    null = sum(successes) / sum(successes + failures)
    null_score = sum(successes * (1 - null)^2 + failures * null^2) / sum(successes + failures)
  } else {
    score = mean((yhat - y)^2)
    null = mean(y)
    null_score = mean((null - y)^2)
  }
  c(score, null_score)
}

brier = function(model, newdata=NULL) {
  scores = .calc_brier(model$y, model$fitted.values)
  result = data.frame(score=scores, row.names=c("Modell", "Null-Modell"))
  if (!is.null(newdata)) {
    y = model.response(model.frame(formula(model), data=newdata))
    yhat = predict(model, newdata=newdata, type="response")
    dat_scores = .calc_brier(y, yhat)
    result = rbind(result, data.frame(score=dat_scores[1], row.names="NewData"))
  }
  result
}
```
