# daatools/R/log-linearity-test.R

```r
log_linearity_test = function(model, parameters=NULL, warnings=TRUE) {
  model.data = model.frame(model)
  dependent = attr(terms(model), 'term.labels')
  if (is.null(parameters)) {
    parameters = dependent[vapply(dependent, function(x) {
      value = model.data[[x]]
      is.numeric(value) && is.null(dim(value))
    }, logical(1))]
  }
  pos.numerics = character()
  for (i in parameters) {
    if (is.numeric(model.data[[i]]) && is.null(dim(model.data[[i]]))) {
      if (min(model.data[[i]]) > 0) {
        pos.numerics = c(pos.numerics, i)
      } else if (warnings) {
        warning('column ', i, ' has zeros or negative values. No log() interaction added.\n')
      }
    } else if (warnings) {
      warning('column ', i, ' is not of class numeric or integer. No log() interaction added.\n')
    }
  }
  if (length(pos.numerics) > 0) {
    interaction = sapply(pos.numerics, function(x) paste0(x,':log(',x,')'))
    new.formula = update(formula(model),
                         as.formula(paste('~ . +', paste(interaction, collapse=' + '))))
    new.model = .refit_model_frame(model, new.formula)
    # Locate added terms explicitly: interactions need not be the last columns.
    added = attr(terms(reformulate(interaction)), 'term.labels')
    design = model.matrix(new.model)
    term.ids = match(added, attr(terms(new.model), 'term.labels'))
    columns = colnames(design)[attr(design, 'assign') %in% term.ids]
    cf = coef(summary(new.model))
    cf = cf[match(columns, rownames(cf)), , drop=FALSE]
    rownames(cf) = columns
    res = data.frame(cf[,c(1,4), drop=FALSE], res=ifelse(cf[,4]<0.05, 'not ok', 'ok'))
    colnames(res)[2:3] = c('Pr(>|z|)', '')
    res
  } else {
    stop('no columns found to test for linearity')
  }
}
```
