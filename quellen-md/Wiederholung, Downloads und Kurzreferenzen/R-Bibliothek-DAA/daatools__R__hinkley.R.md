# daatools/R/hinkley.R

```r
hinkley = function(model) {
  y.hat = predict(model)
  y2.hat = y.hat^2
  model.test = glm(model$y ~ y.hat + y2.hat, family = binomial(link="logit"))
  cf = coef(summary(model.test))
  res = data.frame(e = round(cf[2:3,1], 3), pr=round(cf[2:3,4], 3),
                   sig = c('', ifelse(cf[3,4]<0.05, 'not ok', 'ok')))
  colnames(res) = c('Estimate', 'Pr(>|z|)', '')
  rownames(res) = c('y.hat', 'y.hat^2')
  res
}
```
