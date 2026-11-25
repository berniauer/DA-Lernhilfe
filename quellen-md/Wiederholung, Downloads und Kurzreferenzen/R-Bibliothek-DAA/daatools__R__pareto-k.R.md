# daatools/R/pareto-k.R

```r
plotpkiv = function(model_loo) {
  piv = loo::pareto_k_influence_values(model_loo)
  pivm = max(c(piv,1))
  plot(piv, ylim=c(min(piv),pivm), type='h',
       col=ifelse(piv>1,  'red',
           ifelse(piv>0.7,'purple',
           ifelse(piv>0.5,'blue', 'black'))))
  abline(h=c(0.5,0.7,1),
         col=c('blue','purple','red'), lty=3)
}

top_pareto_k_influence_values = function (model_loo, n=10) {
  piv = loo::pareto_k_influence_values(model_loo)
  n = min(n, length(piv))
  res = cbind(row=1:length(piv), pkiv=piv)
  res[order(res[,'pkiv'], decreasing = TRUE),][1:n,]
}
```
