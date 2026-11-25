# daatools/man/hinkley.Rd

```
\name{hinkley}
\alias{hinkley}
\title{Hinkley-Test für logistische Regression}
\usage{
  hinkley(model)
}
\description{
Führt einen einfachen Test für logistische Regression aus:
Es wird ein Modell aufgesetzt, welches die vorhergesagten Werte und deren Quadrate enthält. Der Koeffizient für die Quadrate (y.hat^2) sollte nicht signifikant sein.

Falls doch, ist das ein Indiz dafür, dass entweder logit() eine unpassende Link-Funktion ist (und damit die logistische Regression unpassend ist) oder dass Variable fehlen bzw. in einem nicht-linearen Zusammenhang mit der abhängigen Variable stehen.
}
\arguments{
  \item{model}{Logistisches Modell}
}
```
