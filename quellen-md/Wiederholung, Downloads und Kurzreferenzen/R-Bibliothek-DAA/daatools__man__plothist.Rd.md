# daatools/man/plothist.Rd

```
\name{posterior}
\alias{plothist}
\title{Posterior-Histogramm}
\description{
Funktionen, um Werte des Posteriors eines Bayes-Modells zu visualisieren.
}
\usage{
plothist(paramSampleVec, parName=NULL, cenTend=c("median", "mean", "mode")[1],
         compVal=NULL, ROPE=NULL, credMass=0.95, HDItextPlace=0.7,
         xlab=NULL , xlim=NULL , yaxt=NULL , ylab=NULL ,
         main=NULL , cex=NULL , cex.lab=NULL ,
         col=NULL , border=NULL , showCurve=FALSE , breaks=NULL ,
         returnSummary = FALSE , transform = identity,
         ...)
}
\author{John K. Kruschke, http://www.indiana.edu/~kruschke/}

\arguments{
  \item{paramSampleVec}{Numerischer Sample-Vektor, Matrix oder rstanarm-Modell.}
  \item{parName}{Parametername, bei rstanarm-Modellen Name des darzustellenden Koeffizienten.}
  \item{cenTend}{Angezeigte zentrale Tendenz: Median, Mittelwert oder Modus.}
  \item{compVal}{Optionaler Vergleichswert.}
  \item{ROPE}{Optionaler Vektor mit unterer und oberer Grenze der Äquivalenzregion.}
  \item{credMass}{Wahrscheinlichkeitsmasse des HD-Intervalls.}
  \item{HDItextPlace}{Position der Beschriftung der Intervallgrenzen.}
  \item{xlab, ylab}{Achsenbeschriftungen.}
  \item{xlim}{Grenzen der x-Achse.}
  \item{yaxt}{Darstellung der y-Achse, siehe \code{par()}.}
  \item{main}{Titel der Grafik.}
  \item{cex, cex.lab}{Schriftgrößen für Text bzw. Achsenbeschriftungen.}
  \item{col, border}{Füll- bzw. Randfarbe.}
  \item{showCurve}{Dichtekurve statt Histogramm anzeigen.}
  \item{breaks}{Klassengrenzen des Histogramms.}
  \item{returnSummary}{Zusammenfassende Statistiken als Matrix zurückgeben.}
  \item{transform}{Optionale Funktion zur Transformation der Samples.}
  \item{...}{Weitere Grafikargumente für Histogramm bzw. Dichteplot.}
}
```
