# daatools/man/check_mcse.Rd

```
\name{check_mcse}
\alias{check_mcse}
\title{Überprüft MCSE eines RStan-Modells}
\usage{
  check_mcse(x, include="beta", exclude=NULL)
}
\arguments{
  \item{x}{RStanARM-Modell.}
  \item{include, exclude}{Reguläre Ausdrücke zur Auswahl bzw. zum Ausschluss von Koeffizienten.
  Mit \code{include="beta"} werden Intercept und Hilfsparameter ausgeschlossen.}
}
\description{Vergleicht den Monte-Carlo-Standardfehler der Koeffizienten mit ihrer MAD.}
```
