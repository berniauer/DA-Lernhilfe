# daatools/man/HDI.Rd

```
\name{HDI}
\alias{hdi}
\alias{hdi_grid}
\alias{showHDI}
\alias{hdi.numeric}
\alias{hdi.matrix}
\alias{hdi.data.frame}
\alias{hdi.stanreg}
\title{Highest Density Interval}
\description{Berechnet das Highest-Density-Intervall für einen Vektor/Datensatz/Modell.}
\usage{
  hdi(obj, ...)
  \method{hdi}{numeric}(obj, credMass=0.95, add=NULL, ...)
  \method{hdi}{matrix}(obj, include=NULL, exclude=NULL, credMass=0.95, margin=2, add=NULL, ...)
  \method{hdi}{data.frame}(obj, include=NULL, exclude=NULL, credMass=0.95, margin=2, add=NULL, ...)
  \method{hdi}{stanreg}(obj, include=NULL, exclude=NULL, credMass=0.95, add=NULL, ...)
  hdi_grid(probMassVec, credMass=0.95)
  showHDI(theta, probMassVec, credMass=0.95)
}
\author{John K. Kruschke, http://www.indiana.edu/~kruschke/}

\arguments{
  \item{obj}{Numerischer Vektor, Matrix, Dataframe, Tibble oder rstanarm-Modell.}
  \item{credMass}{Wahrscheinlichkeitsmasse des Intervalls.}
  \item{include, exclude}{Reguläre Ausdrücke zur Auswahl bzw. zum Ausschluss von Spalten.}
  \item{margin}{1 für zeilenweise, 2 für spaltenweise Berechnung.}
  \item{add}{Eine Funktion oder eine mit \code{list()} bzw. \code{c()} erstellte
  Liste von Funktionen. Jede Funktion erhält denselben Vektor wie die
  HDI-Berechnung und muss einen numerischen Einzelwert liefern.
  Benannte Einträge bestimmen den Ausgabenamen; bei direkt angegebenen
  unbenannten Funktionen wird der Funktionsname verwendet. Ist kein Name
  ableitbar (z.B. bei anonymen Funktionen oder einer unbenannten gespeicherten
  Liste), wird \code{add1}, \code{add2} usw. verwendet. Namen müssen eindeutig
  sein und dürfen nicht \code{lwr} oder \code{upr} lauten.}
  \item{probMassVec}{Vektor der Wahrscheinlichkeitsmassen an den Gitterpunkten.}
  \item{theta}{Gitterpunkte für die Darstellung des Intervalls.}
  \item{...}{Zusätzliche Argumente für Methoden; derzeit nicht verwendet.}
}
\value{
\code{hdi()} liefert für numerische Vektoren einen Vektor, sonst eine Matrix.
Zusätzliche Kennzahlen folgen auf \code{lwr} und \code{upr} in der Reihenfolge
von \code{add}. Ohne zusätzliche Funktionen bleibt das bisherige Ausgabeformat
unverändert. Die Funktionen erhalten auch eventuell vorhandene fehlende Werte;
bei Bedarf kann z.B. \code{function(x) mean(x, na.rm=TRUE)} verwendet werden.
}
\examples{
x = seq_len(100)
hdi(x, add=median)
hdi(cbind(x=x, twice=2*x), add=c(median, avg=mean))
hdi(x, add=list(average=function(x) mean(x, na.rm=TRUE)))
}
```
