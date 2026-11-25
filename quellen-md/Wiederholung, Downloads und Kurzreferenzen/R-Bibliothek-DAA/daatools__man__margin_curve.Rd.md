# daatools/man/margin_curve.Rd

```
\name{margin_curve}
\alias{margin_curve}
\title{Marginale Vorhersagekurve für Bayes-Modelle}
\description{
  Berechnet für vorgegebene Werte einer Variable die über die Beobachtungen
  gemittelte erwartete Antwort und deren posteriore Unsicherheit.
}
\usage{
  margin_curve(fit, data, variable, values, samples=250, draws=4000)
}
\arguments{
  \item{fit}{Ein mit rstanarm geschätztes Modell, etwa aus
  \code{stan_glm} oder \code{stan_glmer}.}
  \item{data}{Dataframe oder Tibble mit den für die Vorhersage benötigten
  Variablen. Jede Zeile erhält bei der Mittelung dasselbe Gewicht.}
  \item{variable}{Name der zu variierenden Spalte als Zeichenkette.}
  \item{values}{Werte, auf die diese Spalte nacheinander für alle
  Beobachtungen gesetzt wird. Die übrigen Spalten bleiben unverändert.}
  \item{samples}{Anzahl der Datensätze die von \code{data} verwendet werden
  sollen, um die Berechnung durchzuführen.}
  \item{draws}{Anzahl verwendeter posteriorer Ziehungen (Standard: 4000).
  Darf die Anzahl verfügbarer Ziehungen nicht überschreiten.
  Mit \code{NULL} werden alle verfügbaren Ziehungen verwendet.}
}
\details{
  Die Vorhersage erfolgt mit \code{rstanarm::posterior_epred} auf der
  Antwortskala. Mit \code{re.form=NA} werden gruppenspezifische Effekte
  auf null gesetzt; über deren Verteilung wird nicht integriert.
  Für jede posteriore Ziehung wird zuerst über die Beobachtungen gemittelt.
  Anschließend werden diese Mittelwerte zusammengefasst. Die Grenzen bilden
  ein zentrales 95\%-Kredibilitätsintervall für den gemittelten Erwartungswert,
  kein Vorhersageintervall für einzelne neue Beobachtungen.
}
\value{
  Ein Tibble mit einer Zeile pro Wert in \code{values} und den Spalten
  \code{value}, \code{estimate} (posteriorer Mittelwert),
  \code{se} (posteriore Standardabweichung), \code{lower} und \code{upper}
  (2,5\%- und 97,5\%-Quantil).
}
\examples{
\dontrun{
  fit = rstanarm::stan_glm(mpg ~ wt + hp, data=mtcars)
  margin_curve(fit, mtcars, "wt", seq(2, 5, by=0.5), draws=NULL)
}
}
```
