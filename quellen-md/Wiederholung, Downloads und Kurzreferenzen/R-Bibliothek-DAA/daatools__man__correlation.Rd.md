# daatools/man/correlation.Rd

```
\name{plotcorr}
\alias{plotcorr}
\alias{plotpairs}
\alias{plotcorr.data.frame}
\alias{plotcorr.matrix}
\alias{plotcorr.stanreg}
\alias{plotpairs.data.frame}
\alias{plotpairs.matrix}
\alias{plotpairs.stanreg}
\title{Korrelation-Plots}
\description{
Plots für Korrelation von rstanarm-Modellen, Dataframes und Matrizen
}
\usage{
  plotcorr(x, ...)
  \method{plotcorr}{data.frame}(x, include=NULL, exclude=NULL,
    addCoef.col="white", addCoefasPercent=TRUE, diag=FALSE,
    tl.cex=0.8, number.cex=0.7, method="color", ...)
  \method{plotcorr}{matrix}(x, include=NULL, exclude=NULL,
    addCoef.col="white", addCoefasPercent=TRUE, diag=FALSE,
    tl.cex=0.8, number.cex=0.7, method="color", ...)
  \method{plotcorr}{stanreg}(x, include=NULL, exclude=NULL,
    addCoef.col="white", addCoefasPercent=TRUE, diag=FALSE,
    tl.cex=0.8, number.cex=0.7, method="color", ...)
  plotpairs(x, ...)
  \method{plotpairs}{data.frame}(x, include=NULL, exclude=NULL, n=500, ...)
  \method{plotpairs}{matrix}(x, include=NULL, exclude=NULL, n=500, ...)
  \method{plotpairs}{stanreg}(x, include=NULL, exclude=NULL, n=500, ...)
}
\arguments{
  \item{x}{Dataframe, Tibble, Matrix oder rstanarm-Modell.}
  \item{include, exclude}{Reguläre Ausdrücke zur Auswahl bzw. zum Ausschluss von Spalten.}
  \item{addCoef.col}{Farbe der angezeigten Korrelationskoeffizienten.}
  \item{addCoefasPercent}{Koeffizienten als Prozentwerte anzeigen.}
  \item{diag}{Diagonale der Korrelationsmatrix anzeigen.}
  \item{tl.cex, number.cex}{Schriftgrößen für Variablennamen bzw. Koeffizienten.}
  \item{method}{Darstellungsmethode für \code{corrplot::corrplot()}.}
  \item{n}{Maximale Anzahl der Zeilen bzw. Posterior-Samples für \code{plotpairs()}.}
  \item{...}{Weitere Argumente für die Methoden. Bei \code{plotcorr()} werden sie an
  \code{corrplot::corrplot()} weitergegeben; bei \code{plotpairs()} derzeit nicht verwendet.}
}
```
