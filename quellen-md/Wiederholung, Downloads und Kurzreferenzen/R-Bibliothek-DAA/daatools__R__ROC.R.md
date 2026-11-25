# daatools/R/ROC.R

```r
logistic_rates = function(model, newdata=NULL) {
  ys = .model_get_y_yhat(model, newdata=newdata, type='epred')
  pred = ROCR::prediction(ys$yhat, ys$y)
  perf = ROCR::performance(pred, measure = 'tpr', 'fpr')
  data.frame(cutoff = perf@alpha.values[[1]],
             true.positive.rate = perf@y.values[[1]],
             false.positive.rate = perf@x.values[[1]],
             true.negative.rate = 1 - perf@x.values[[1]],
             false.negative.rate = 1 - perf@y.values[[1]])
}

cutoff_index = function(logrates, cutoff) {
    search = function (cf) {
      if (cf > logrates$cutoff[2])
        1
      else if (cf < logrates$cutoff[nrow(logrates)])
        nrow(logrates)
      else {
        p = Position(function(x) x <= cf, logrates$cutoff)
        # get closest one
        if (cf-logrates$cutoff[p] < logrates$cutoff[p-1]-cf)
          p
        else
          p-1
      }
    }
    sapply(cutoff, search)
}

ROC = function(model, newdata=NULL, main="ROC-Kurve") {
  ys = .model_get_y_yhat(model, newdata=newdata, type='epred')
  pred = ROCR::prediction(ys$yhat, ys$y)
  perf = ROCR::performance(pred, measure = 'tpr', 'fpr')
  ROCR::plot(perf, colorize=TRUE, main=main)
  abline(0,1, lty=2)
  auc = ROCR::performance(pred, measure = 'auc')
  text(x=0.95, y=0.1, labels=paste("AUC:", round(auc@y.values[[1]],3)), adj=1)
}

plotlogrates = function(model, newdata=NULL, count=FALSE,
                        groups=c("true positive", "false negative", "false positive", "true negative")) {
  lr = logistic_rates(model, newdata)
  if (count) {
    y = .model_get_y(model, newdata)
    pos_sum = sum(y)
    neg_sum = sum(1 - y)
  } else {
    pos_sum = 1;
    neg_sum = 1;
  }
  rates = data.frame(
    Schwellwert = lr$cutoff,
    Rate = c(
      lr$true.positive.rate * pos_sum,
      lr$false.negative.rate * pos_sum,
      lr$false.positive.rate * neg_sum,
      lr$true.negative.rate * neg_sum
    ),
    Typ = factor(rep(groups, each=nrow(lr)), levels = groups))
  ggplot2::ggplot(rates, ggplot2::aes(x=.data$Schwellwert, y=.data$Rate, color=.data$Typ)) +
    ggplot2::geom_line() +
    ggplot2::facet_wrap(~Typ, scales="free_y") +
    ggplot2::theme_minimal() + ggplot2::theme(legend.position="none") +
    ggplot2::labs(y=ifelse(count, "Anzahl", "Rate"))
}
```
