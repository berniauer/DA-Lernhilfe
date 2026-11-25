# daatools/R/logistic_costs.R

```r
logistic_costs = function(model, newdata=NULL, tp=1, fn=1, fp=1, tn=1) {
  lr = logistic_rates(model, newdata)
  y = .model_get_y(model, newdata)
  pos_sum = sum(y)
  neg_sum = sum(1 - y)
  costs =
    lr$true.positive.rate * pos_sum * tp +
    lr$false.negative.rate * pos_sum * fn +
    lr$false.positive.rate * neg_sum * fp +
    lr$true.negative.rate * neg_sum * tn
  data.frame(
    cutoff = lr$cutoff,
    costs = costs
  )
}

plotlogcosts = function(model, newdata=NULL, tp=1, fn=1, fp=1, tn=1, type=c('min', 'max')) {
  type = match.arg(type)
  costs = logistic_costs(model, newdata, tp, fn, fp, tn)
  if (type == 'min') {
    index = which.min(costs$costs)
    text = "Minimum"
  } else {
    index = which.max(costs$costs)
    text = "Maximum"
  }
  value = costs$costs[index]
  cutoff = costs$cutoff[index]
  ggplot2::ggplot(costs, ggplot2::aes(x=.data$cutoff, y=.data$costs)) +
    ggplot2::geom_line() +
    ggplot2::theme_minimal() +
    ggplot2::annotate("point", x = cutoff, y = value, color = "red3", size = 3, shape=1) +
    ggplot2::labs(caption=sprintf("%s=%.2f bei Schwellwert %.2f", text, value, cutoff),
                  x="Schwellwert", y="Kosten")
}
```
