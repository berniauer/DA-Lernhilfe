# daatools/man/logistic_costs.Rd

```
\name{logistic_costs}
\alias{logistic_costs}
\alias{plotlogcosts}
\title{Kostenfunktion für logistische Regression}
\usage{
  logistic_costs(model, newdata=NULL, tp=1, fn=1, fp=1, tn=1)
  plotlogcosts(model, newdata=NULL, tp=1, fn=1, fp=1, tn=1, type=c('min', 'max'))
}
\description{
  \command{logistic_costs()} Retourniert Dataframe für Kosten abhängig vom Schwellwert
  \command{plotlogcosts()} Zeichnet Diagramm für Kosten abhängig vom Schwellwert
}
\arguments{
  \item{model}{Logistisches Modell}
  \item{newdata}{Neue Daten für die Vorhersagen berechnet werden sollen; muss auch Y für Vergleich enthalten}
  \item{tp}{Kosten für den "true positive"-Fall}
  \item{fn}{Kosten für den "false negative"-Fall}
  \item{fp}{Kosten für den "false positive"-Fall}
  \item{tn}{Kosten für den "true negative"-Fall}
  \item{type}{Ob Minimum oder Maximum der Kosten im Graph markiert werden soll}
}
```
