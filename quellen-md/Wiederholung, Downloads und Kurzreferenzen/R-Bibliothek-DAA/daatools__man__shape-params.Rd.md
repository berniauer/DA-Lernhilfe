# daatools/man/shape-params.Rd

```
\name{shape.params}
\alias{betaABfromMeanSD}
\alias{betaABfromMeanKappa}
\alias{betaABfromModeKappa}
\alias{gammaShRaFromMeanSD}
\alias{gammaShRaFromModeSD}
\title{Shape-Parameter}
\usage{
  betaABfromMeanSD(mean, sd)
  betaABfromMeanKappa(mean, kappa)
  betaABfromModeKappa(mode, kappa)

  gammaShRaFromMeanSD(mean, sd)
  gammaShRaFromModeSD(mode, sd)
}
\author{John K. Kruschke, http://www.indiana.edu/~kruschke/}
\description{
Shape-Parameter aus Mean+sd bzw. anderen Werten errechnen.
}

\arguments{
  \item{mean}{Gewünschter Mittelwert. Für die Beta-Verteilung strikt zwischen 0 und 1,
  für die Gamma-Verteilung strikt positiv.}
  \item{sd}{Gewünschte Standardabweichung, strikt positiv. Bei der Beta-Verteilung muss
  zusätzlich \code{sd^2 < mean * (1 - mean)} gelten.}
  \item{kappa}{Konzentration der Beta-Verteilung, also die Summe ihrer beiden
  Formparameter. Bei Vorgabe des Mittelwerts strikt positiv, bei Vorgabe des Modus größer als 2.}
  \item{mode}{Gewünschter Modus. Für die Beta-Verteilung strikt zwischen 0 und 1,
  für die Gamma-Verteilung strikt positiv.}
}
```
