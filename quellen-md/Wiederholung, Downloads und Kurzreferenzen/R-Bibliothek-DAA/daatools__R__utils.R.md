# daatools/R/utils.R

```r
.filter.columns = function(x, include=NULL, exclude=NULL, only.numeric=FALSE) {
  if (!inherits(x, c("data.frame", "matrix"))) {
    stop("data needs to be a data frame or matrix")
  }

  if (only.numeric) {
    x = x[, sapply(x, is.numeric), drop=FALSE]
  }
  if(ncol(x) == 0) {
    stop("No numeric columns found")
  }

  if (is.null(colnames(x))) {
    x  # cannot filter anything, if there are no colnames
  } else {
    cols = .filter.names(colnames(x), include=include, exclude=exclude)
    x[ ,cols, drop=FALSE]
  }
}


.filter.names = function(names, include=NULL, exclude=NULL) {
  if (is.null(names)) {
    return(NULL)
  }
  if (length(include) == 1 && include == 'beta') {
    exclude = c(exclude, '^\\(Intercept\\)', '^[Ss]igma($|\\[)', '^mean_PPD$', '^log-posterior$')
    include = NULL
  }
  if (!is.null(include)) {
    incl_names = Reduce(`|`, lapply(include, function(str) grepl(str, names)),
                        init=rep(FALSE, length(names)))
  } else {
    incl_names = rep(TRUE, length(names))
  }
  if (!is.null(exclude)) {
    excl_names = Reduce(`|`, lapply(exclude, function(str) grepl(str, names)),
                        init=rep(FALSE, length(names)))
  } else {
    excl_names = rep(FALSE, length(names))
  }
  names = incl_names & !excl_names
  if (!any(names)) {
    stop("There are no columns selected -- did you specify the columns to include/exclude correctly?")
  }
  names
}

.model_get_y = function(model, newdata=NULL, rows=NULL) {
  if (is.null(newdata)) {
    if (is.matrix(model$y))
      y = model$y[,1]
    else
      y = model$y
  } else {
    y_name = deparse(formula(model)[[2]])
    y = newdata[[y_name]]
  }
  if (!is.null(rows)) {
    y = y[rows]
  }
  y
}

.stan_get_y_yhat = function(model, prediction=NULL, newdata=NULL,
                            rows=NULL, draws=NULL, type=c('predict', 'epred')) {
  type = match.arg(type)
  pred_fun = getExportedValue("rstanarm", paste0("posterior_", type))
  y = .model_get_y(model, newdata, rows)
  if (is.null(newdata)) {
    if (is.null(prediction))
      yhat = do.call(pred_fun, list(model, draws=draws))
    else
      yhat = prediction
  } else {
    yhat = do.call(pred_fun, list(model, newdata=newdata, draws=draws))
  }
  if (!is.null(rows)) {
    yhat = yhat[, rows, drop=FALSE]
  }
  list(y=y, yhat=yhat)
}

.model_get_y_yhat = function(model, newdata=NULL, rows=NULL, type=c('predict', 'epred')) {
  type = match.arg(type)
  if (inherits(model, "stanreg")) {
    ys = .stan_get_y_yhat(model, newdata=newdata, type=type)
    ys$yhat = colMeans(ys$yhat)
    ys
  } else {
    y = .model_get_y(model, newdata, rows)
    if (is.null(newdata)) {
      yhat = model$fitted.values
    } else {
      yhat = predict(model, newdata=newdata, type="response")
    }
    list(y=y, yhat=yhat)
  }
}
```
