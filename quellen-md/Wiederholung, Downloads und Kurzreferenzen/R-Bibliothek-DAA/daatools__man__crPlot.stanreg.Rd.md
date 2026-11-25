# daatools/man/crPlot.stanreg.Rd

```
\name{crPlot.stanreg}
\alias{crPlot.stanreg}
\encoding{UTF-8}
\title{Komponenten-plus-Residuen-Plots für RStanARM-Modelle}
\usage{
\method{crPlot}{stanreg}(model, variable, ...)
}
\arguments{
  \item{model}{Ein mit RStanARM geschätztes GLM oder generalisiertes lineares Mischmodell.}
  \item{variable}{Name eines ursprünglichen numerischen Prädiktors oder Faktors,
  z.B. \code{"x"} für einen Term \code{splines::ns(x, 3)}.}
  \item{...}{Zusätzliche Argumente werden nicht unterstützt.}
}
\description{
Zeigt den Beitrag eines Prädiktors plus Arbeitsresiduen auf der Link-Skala.
Für Spline-Terme werden alle Basiskoeffizienten zu einem Beitrag zusammengefasst.
Numerische Prädiktoren werden mit dem geschätzten Beitrag (blau) und einer
LOESS-Kurve (grün) dargestellt; Faktoren als Boxplots.
}
\details{
Der Beitrag und der gesamte lineare Prädiktor verwenden Posterior-Mittelwerte.
Die Arbeitsresiduen sind \code{(y - mu) / mu.eta(eta)}, wobei \code{mu} durch
Anwendung der inversen Link-Funktion auf den mittleren linearen Prädiktor entsteht.
Bei Gauß-Modellen mit Identity-Link sind dies gewöhnliche Residuen.
Beitrag und partielle Residuen werden um denselben Wert zentriert.
Bei mehreren additiven Termen für denselben Prädiktor werden deren Beiträge
summiert. Interaktionen mit dem ausgewählten Prädiktor werden nicht unterstützt.
Beim Modellfit ausgelassene Beobachtungen werden auch im Plot ausgelassen.
}
\value{
Unsichtbar ein Data Frame mit \code{x} (Prädiktorwerten), \code{partial}
(zentrierten partiellen Residuen) und \code{component} (zentriertem Modellbeitrag).
}
\seealso{\code{car::crPlot}}
```
