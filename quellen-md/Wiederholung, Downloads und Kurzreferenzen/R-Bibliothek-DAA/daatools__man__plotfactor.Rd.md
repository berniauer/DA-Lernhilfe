# daatools/man/plotfactor.Rd

```
\name{plotfactor}
\alias{plotfactor}
\title{Diagramm eines einzelnen Faktors eines Regression-Modells}
\usage{
  plotfactor(model, parameter, main=NULL, credMass = 0.95, type='b')
}
\description{
Zeichnet ein Diagram für alle Werte (level) eines nominalen Faktors eines Regressionsmodells inkl. des Konfidenzintervalls. Der Referenzlevel wird als Null angesetzt und ohne Konfidenzintervall eingezeichnet.
}
\arguments{
  \item{model}{Regressionsmodell}
  \item{parameter}{Name der Faktor-Variable, die angezeigt werden soll}
  \item{main}{Titel des Diagramms}
  \item{credMass}{Konfidenzniveau bzw. Wahrscheinlichkeitsmasse des Posterior-Intervalls bei rstanarm-Modellen.}
  \item{type}{Analog zu plot.default(type=...) - siehe Hilfe dort}
}
```
