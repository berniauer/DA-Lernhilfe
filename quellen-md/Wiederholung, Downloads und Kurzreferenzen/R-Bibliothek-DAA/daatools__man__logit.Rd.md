# daatools/man/logit.Rd

```
\name{inv_logit}
\alias{inv_logit}
\alias{odds}
\alias{inv_odds}
\title{Logit & Odds}
\usage{
  inv_logit(lgt)
  odds(x)
  inv_odds(o)
}
\description{
Transformiert Variable nach Logit bzw. Chance (Odds) und wieder zurück.
logit() ist bereits in den Bibliothekn car und rstanarm definiert.
}
\arguments{
  \item{x}{Variable, die transformiert werden soll (Wertebereich 0-1)}
  \item{lgt}{Logit-transformierte Variable (Wertebereich -Inf - +Inf)}
  \item{o}{Odds-transformierte Variable (Wertebereich 0-Inf)}
}
\examples{
  lgt = car::logit(0.8)
  inv_logit(lgt)
  o = odds(0.75)
  inv_odds(o)
}
```
