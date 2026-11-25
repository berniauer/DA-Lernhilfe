# daatools/man/predict.Rd

```
\name{predict.stanreg}
\alias{predict.stanreg}
\title{Vorhersagen für rstanarm-GLMs mit Offset}
\description{
  Erweitert \code{predict()} für rstanarm-GLMs und generalisierte lineare
  gemischte Modelle um die Berücksichtigung expliziter Offsets.
  Verwendet die öffentlichen Funktionen \code{rstanarm::posterior_linpred()}
  und \code{rstanarm::posterior_epred()}.
}
\usage{
  \method{predict}{stanreg}(object, ..., newdata=NULL,
    type=c("link", "response"), se.fit=FALSE, offset=NULL)
}
\arguments{
  \item{object}{rstanarm-GLM oder generalisiertes lineares gemischtes Modell,
  beispielsweise mit Gauß-, Binomial- oder Poisson-Verteilung.
  Beta- und ordinale Modelle einschließlich Scobit werden nicht unterstützt.}
  \item{...}{Derzeit nicht verwendet.}
  \item{newdata}{Optionaler Dataframe oder Tibble mit neuen Prädiktorwerten.
  Bei \code{NULL} werden die ursprünglichen Modelldaten verwendet.}
  \item{type}{\code{"link"} für Vorhersagen auf der Skala des linearen Prädiktors,
  \code{"response"} für Vorhersagen auf der Antwortskala.}
  \item{se.fit}{Zusätzlich die Standardabweichung der Posterior-Vorhersagen
  des linearen Prädiktors bzw. des bedingten Erwartungswerts zurückgeben.}
  \item{offset}{Optionaler numerischer Offset-Vektor auf der Link-Skala,
  mit einem endlichen Wert pro Beobachtung. Bei Poisson-Modellen mit Log-Link
  beispielsweise \code{log(exposure)}. Für neue Daten muss der Offset
  ausdrücklich angegeben werden, auch wenn beim Fit ein Offset in der
  Formel stand. Ein expliziter Offset ersetzt den gespeicherten Offset.}
}
\value{
  Ein Vektor mit einer Vorhersage pro Beobachtung. Bei \code{se.fit=TRUE}
  eine Liste mit den Vektoren \code{fit} und \code{se.fit}.
}
\details{
  Vorhersagen sind Mittelwerte der Posterior-Draws; sie enthalten keine
  zusätzliche Zufallsstreuung neuer Beobachtungen. Für ein nicht gemischtes
  Modell ohne \code{newdata}, ohne expliziten \code{offset} und mit
  \code{se.fit=FALSE} werden wie bisher die gespeicherten Punktvorhersagen
  des Modells zurückgegeben.

  Der explizite Offset wird auch bei Vorhersagen für die ursprünglichen
  Daten und bei gemischten Modellen berücksichtigt.
}
```
