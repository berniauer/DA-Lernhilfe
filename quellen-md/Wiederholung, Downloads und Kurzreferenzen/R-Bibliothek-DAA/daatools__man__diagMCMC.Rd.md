# daatools/man/diagMCMC.Rd

```
\name{diagMCMC}
\alias{diagMCMC}
\alias{mcmc_acf_overlay}
\title{Diagnose-Tools für MCMC}
\description{
Diagnose-Funktionen für rstanarm-Modelle, um den Erfolg des Samplings abschätzen zu können.
}
\usage{
  diagMCMC(model, parName)
  mcmc_acf_overlay(model, pars=character(), regex_pars=character(), lags=25, size=0.5)
}
\author{John K. Kruschke, http://www.indiana.edu/~kruschke/ (JAGS), Arno Hollosi (rstanarm)}

\arguments{
  \item{model}{Mit MCMC-Sampling geschätztes rstanarm-Modell. Für \code{mcmc_acf_overlay()}
  auch ein numerisches Array mit Dimensionen Iterationen, Chains und benannten Parametern.}
  \item{parName}{Name des Parameters, dessen Sampling-Diagnostik angezeigt werden soll.}
  \item{pars}{Vektor der exakten Parameternamen für den Autokorrelationsplot.
  Ohne Namens- oder Regex-Auswahl werden alle verfügbaren Parameter dargestellt.}
  \item{regex_pars}{Reguläre Ausdrücke zur Auswahl von Parametern für den Autokorrelationsplot.
  Treffer werden an die Auswahl in \code{pars} angehängt; doppelte Namen werden entfernt.}
  \item{lags}{Maximale zeitliche Verzögerung für die Berechnung der Autokorrelation,
  als nicht negative ganze Zahl. Pro Chain müssen mindestens \code{lags + 2}
  Iterationen vorliegen.}
  \item{size}{Linienbreite der Autokorrelationskurven.}
}
```
