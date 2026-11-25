# daatools/R/crplot.R

```r
crPlot.stanreg = function(model, variable, ...) {
  rlang::check_dots_empty()
  data = .crplot_data(model, variable)
  if (is.numeric(data$x)) {
    plot(data$x, data$partial, xlab=variable, ylab='Component+Residual', type='n')
    grid(lty=1)
    points(data$x, data$partial)
    order = order(data$x)
    lines(data$x[order], data$component[order], col='blue', lty=2, lwd=2)
    car::loessLine(data$x, data$partial, col='green')
  } else {
    plot(data$x, data$partial, xlab=variable, ylab='Component+Residual')
  }
  invisible(data)
}

.crplot_data = function(model, variable) {
  if (!is.character(variable) || length(variable) != 1 || is.na(variable)) {
    stop("variable must name one predictor")
  }
  if (inherits(model, c('betareg', 'polr', 'gamm4'))) {
    stop("C+R plots support ordinary GLMs and generalized linear mixed models.")
  }
  model.terms = terms(model)
  labels = attr(model.terms, 'term.labels')
  variables = lapply(labels, function(label) all.vars(str2lang(label)))
  selected = which(vapply(variables, function(x) variable %in% x, logical(1)))
  if (length(selected) == 0) stop("Predictor not found in model terms: ", variable)
  if (any(attr(model.terms, 'order')[selected] > 1) ||
      any(vapply(variables[selected], function(x) {
        length(intersect(x, names(model$data))) > 1
      }, logical(1)))) {
    stop("C+R plots not available for predictors involved in interactions.")
  }

  frame = model.frame(model)
  vdata = frame[[variable]]
  if (is.null(vdata)) {
    # A spline model frame contains ns(x, df), not x. Match the retained rows
    # to the original data so omitted observations do not shift the plot.
    rows = match(rownames(frame), rownames(model$data))
    if (anyNA(rows)) stop("Cannot align predictor values with fitted observations")
    vdata = model$data[[variable]][rows]
  }
  if (is.character(vdata)) vdata = as.factor(vdata)
  if ((!is.numeric(vdata) && !is.factor(vdata)) || !is.null(dim(vdata)) ||
      length(vdata) != nrow(frame) || anyNA(vdata)) {
    stop("Predictor must be a numeric vector or factor available in the fitted data")
  }

  design = model.matrix(model)
  columns = which(attr(design, 'assign') %in% selected)
  # Use posterior means consistently for the term and full linear predictor.
  coefficients = colMeans(as.matrix(model)[, colnames(design)[columns], drop=FALSE])
  component = as.vector(design[, columns, drop=FALSE] %*% coefficients)
  eta = colMeans(posterior_linpred(model))
  fam = family(model)
  mu = fam$linkinv(eta)
  y = model$y
  if (fam$family == 'binomial') {
    if (is.matrix(y)) y = y[, 1] / rowSums(y)
    if (is.factor(y)) y = as.numeric(y != levels(y)[1])
  }
  # GLM working residuals are on the same link scale as the component.
  residual = (y - mu) / fam$mu.eta(eta)
  if (length(residual) != length(component) || any(!is.finite(residual))) {
    stop("Cannot compute finite working residuals for this model")
  }
  partial = residual + component
  center = mean(partial)
  data.frame(x=vdata, partial=partial-center, component=component-center)
}
```
