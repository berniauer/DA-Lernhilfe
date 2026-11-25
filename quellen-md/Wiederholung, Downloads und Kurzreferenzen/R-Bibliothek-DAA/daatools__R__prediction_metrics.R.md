# daatools/R/prediction_metrics.R

```r
prediction_metrics = function(model, newdata, re.form=NULL) {
  stan = inherits(model, 'stanreg')
  mixed = inherits(model, 'merMod') || (stan && inherits(model, 'lmerMod'))
  if ((!stan && !mixed && !inherits(model, 'lm')) ||
      inherits(model, c('betareg', 'polr', 'gamm4'))) {
    stop('Supported models are lm, glm, lmer, glmer and their RStanARM equivalents')
  }
  if (!is.data.frame(newdata) || nrow(newdata) == 0) {
    stop('newdata must be a non-empty data frame')
  }
  newdata = as.data.frame(newdata)
  frame = model.frame(model)
  train.y = model.response(frame)
  response = formula(model)[[2]]
  if (!all(all.vars(response) %in% names(newdata))) {
    stop('newdata must contain the outcome variables from the model formula')
  }
  test.y = eval(response, newdata, environment(formula(model)))
  binary = family(model)$family %in% c('binomial', 'quasibinomial')
  if (binary && is.factor(train.y)) {
    levels = levels(train.y)
    if (length(levels) != 2) stop('Binary outcomes must have exactly two levels')
    if (!is.factor(test.y) && !is.character(test.y)) {
      stop('newdata must use the training outcome labels for a factor response')
    }
    test.y = match(as.character(test.y), levels) - 1
    train.y = as.numeric(train.y) - 1
  }
  validate = function(y, n) {
    if ((!is.numeric(y) && !is.logical(y)) || !is.null(dim(y)) ||
        length(y) != n || any(!is.finite(y))) {
      stop('Outcomes must be finite numeric vectors; grouped binomial outcomes are not supported')
    }
    if (binary && any(!y %in% c(0, 1))) stop('Binary outcomes must be 0 or 1')
  }
  validate(train.y, nrow(frame))
  validate(test.y, nrow(newdata))

  predict.mean = function(data=NULL) {
    if (stan) {
      # posterior_epred requires new offsets explicitly, including formula offsets.
      offset = NULL
      if (!is.null(data)) {
        trm = terms(model)
        exprs = as.list(attr(trm, 'variables'))[-1]
        offsets = exprs[attr(trm, 'offset')]
        if (!is.null(model$call$offset)) offsets = c(offsets, list(model$call$offset))
        if (length(offsets)) {
          offset = Reduce(`+`, lapply(offsets, function(expr) {
            eval(expr, data, environment(formula(model)))
          }))
          if (length(offset) == 1) offset = rep(offset, nrow(data))
          if (length(offset) != nrow(data) || any(!is.finite(offset))) {
            stop('Cannot evaluate model offsets on newdata')
          }
        }
      }
      return(colMeans(rstanarm::posterior_epred(model, newdata=data,
                                                re.form=re.form, offset=offset)))
    }
    if (mixed) return(predict(model, newdata=data, type='response', re.form=re.form))
    # Stored fitted values contain only fitted rows, even with na.exclude.
    if (is.null(data)) return(model$fitted.values)
    if (inherits(model, 'glm')) return(predict(model, newdata=data, type='response'))
    predict(model, newdata=data)
  }
  baseline = mean(train.y)
  score = function(y, prediction) {
    if (length(prediction) != length(y) || any(!is.finite(prediction))) {
      stop('Predictions must be finite and available for every observation')
    }
    mse = mean((y - prediction)^2)
    baseline.mse = mean((y - baseline)^2)
    skill = if (baseline.mse == 0) NA_real_ else 1 - mse / baseline.mse
    if (binary) {
      if (any(prediction < 0 | prediction > 1)) stop('Predicted probabilities must lie in [0, 1]')
      loss = mean(ifelse(y == 1, -log(prediction), -log1p(-prediction)))
      data.frame(n=length(y), Brier=mse, LogLoss=loss, Skill=skill)
    } else {
      data.frame(n=length(y), RMSE=sqrt(mse), MAE=mean(abs(y-prediction)), Skill=skill)
    }
  }
  result = rbind(score(train.y, predict.mean()), score(test.y, predict.mean(newdata)))
  data.frame(Dataset=c('Training', 'New data'), result, row.names=NULL)
}
```
