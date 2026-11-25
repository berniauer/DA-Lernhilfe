# daatools/man/plotcoef.Rd

```
\name{plotcoef}
\alias{plotcoef}
\alias{plotcoef.lm}
\alias{plotcoef.stanreg}
\alias{plotcoef.matrix}
\alias{plotcoef.data.frame}
\title{Plots von Koeffizienten und Samples}
\usage{
  plotcoef(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=TRUE, ...)
  \method{plotcoef}{lm}(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=TRUE, ...)
  \method{plotcoef}{stanreg}(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=FALSE, ...)
  \method{plotcoef}{matrix}(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=FALSE, ...)
  \method{plotcoef}{data.frame}(obj, include=NULL, exclude=NULL, credMass=0.95, transform=identity, title=NULL, sort=FALSE, ...)
}
\description{
plotcoef() funktioniert für lm()-, rstanarm-Modelle und Dataframes und Matrizen.
}
\arguments{
  \item{obj}{lm- oder rstanarm-Modell, Dataframe, Tibble oder Matrix mit Samples.}
  \item{include, exclude}{Reguläre Ausdrücke zur Auswahl bzw. zum Ausschluss von Koeffizienten.
  Mit \code{include="beta"} werden Intercept und Hilfsparameter ausgeschlossen.}
  \item{transform}{Funktion, mit der Werte vor Anzeige transformiert werden sollen.}
  \item{title}{Titel der Grafik.}
  \item{sort}{Koeffizienten nach Namen sortieren. Standardmäßig \code{TRUE} für
  lm-Modelle und \code{FALSE} für die übrigen Methoden.}
  \item{credMass}{Konfidenzniveau bzw. Wahrscheinlichkeitsmasse des Intervalls.}
  \item{...}{Zusätzliche Argumente für Methoden; derzeit nicht verwendet.}
}
\examples{
  lm.model = lm(mpg ~ wt + hp, data=mtcars)
  plotcoef(lm.model, include=c("wt", "hp"), title="Gewicht und Leistung")
}
```
