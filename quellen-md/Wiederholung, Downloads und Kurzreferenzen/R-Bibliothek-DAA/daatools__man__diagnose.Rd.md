# daatools/man/diagnose.Rd

```
\name{diagnose_density}
\alias{diagnose_density}
\alias{diagnose_distribution}
\alias{diagnose_fit}
\alias{diagnose_y_vs_yhat}
\alias{diagnose_residual}
\alias{diagnose_residual_dist}
\title{Diagnose-Tools von Bayesschen Modellen}
\usage{
  diagnose_density(model, prediction=NULL, newdata=NULL, n=10, rows=NULL, main=NULL, xlim=NULL)
  diagnose_distribution(model, prediction=NULL, newdata=NULL, rows=NULL)
  diagnose_fit(model, prediction=NULL, newdata=NULL, low=0.025, high=0.975, credMass=0.95, rows=NULL)
  diagnose_y_vs_yhat(model, prediction=NULL, newdata=NULL, alpha=0.25, rows=NULL, samples=TRUE, main=NULL)
  diagnose_residual(model, prediction=NULL, newdata=NULL, type=c('fitted', 'y'), alpha=0.25, rows=NULL, samples=TRUE, main=NULL)
  diagnose_residual_dist(model, prediction=NULL, newdata=NULL, rows=NULL, samples=TRUE, main=NULL)
}
\description{
  Diagnosefunktionen für Bayes-Modelle (STAN-Modelle)
}
\arguments{
  \item{model}{rstanarm-Modell}
  \item{prediction}{Modell-Vorhersage für Modelldaten selbst ("fitted values"); optional}
  \item{newdata}{Daten für neue Modell-Vorhersagen (z.B. Testdaten)}
  \item{low}{Unteres Vergleichsquantil}
  \item{high}{Oberes Vergleichsquantil}
  \item{credMass}{"Masse" des HD-Intervall}
  \item{alpha}{Transparenz der Punkte des Scatterplots}
  \item{samples}{Bei \code{TRUE} (Standard) werden neben dem Plot der Durchschnittswerte acht Samples angezeigt. Bei \code{FALSE} wird nur der Plot der Durchschnittswerte angezeigt.}
  \item{type}{"y"...Plot vs. realen y-Werten der Daten; "fitted"...Plot vs. vorhergesagten y-Werten}
  \item{rows}{Vektor für welche Daten behandelt werden sollen & welche nicht}
  \item{n}{Anzahl der Vergleichskurven}
  \item{main}{Titel des Diagramms}
  \item{xlim}{zu zeigender Bereich der X-Achse}
}
```
