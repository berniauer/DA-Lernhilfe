# daatools/man/compare.Rd

```
\name{compare_coef}
\alias{compare_coef}
\alias{print.daa_compare_coefs}
\title{Vergleich von Modellkoeffizienten}
\usage{
  compare_coef(..., include=NULL, exclude=NULL, na.omit=TRUE,
               transform=identity,
               uncertainty=c("ci", "se", "none"), credMass=0.95)
}
\description{
  Vergleicht die Koeffizienten mehrerer Modelle, etwa lm-, glm- und
  rstanarm-Modelle, mit optionaler Transformation und Unsicherheitsangaben.
  Die Ausgabe stellt die Modelle nebeneinander dar.
}
\arguments{
  \item{...}{zu vergleichende Modelle. Benannte Argumente
  legen die Modellnamen in der Ausgabe fest; sonst werden die übergebenen
  Ausdrücke als Namen verwendet.}
  \item{include, exclude}{Reguläre Ausdrücke zur Auswahl bzw. zum Ausschluss
  von Koeffizientennamen (Zeilen). Mehrere Ausdrücke können als Vektor angegeben
  werden; Ausschlüsse haben Vorrang. Mit \code{include="beta"} werden
  Intercept und Hilfsparameter ausgeschlossen.}
  \item{na.omit}{Bei \code{TRUE} (Standard) werden Koeffizienten entfernt, die
  nicht in allen Modellen vorhanden sind. Bei \code{FALSE} bleiben Koeffizienten
  erhalten, die nur in einem Teil der Modelle vorkommen.}
  \item{transform}{Funktion zur Transformation der Koeffizienten, bspw.
  \code{exp}. Standardmäßig erfolgt mit \code{identity} keine Transformation.
  Die Funktion muss Vektoren und bei rstanarm-Modellen auch Matrizen
  elementweise transformieren können.}
  \item{uncertainty}{Art der Unsicherheitsangabe: \code{"ci"} (Standard) für
  Konfidenzintervalle bzw. HD-Intervalle, \code{"se"} für Standardfehler bzw.
  Standardabweichungen der Posterior-Samples oder \code{"none"} für die
  alleinige Anzeige der Koeffizienten.}
  \item{credMass}{Konfidenzniveau bzw. Wahrscheinlichkeitsmasse des
  HD-Intervalls; muss zwischen 0 und 1 liegen. Standard ist \code{0.95}.}
}
\details{
  Bei rstanarm-Modellen werden zuerst die Posterior-Samples transformiert.
  Angezeigt werden deren Mittelwerte und je nach \code{uncertainty} die
  Standardabweichungen oder mit \code{\link{hdi}} berechnete HD-Intervalle.

  Bei den übrigen Modellen werden die mit \code{coef} ermittelten
  Koeffizienten transformiert. Für \code{uncertainty="ci"} werden die mit
  \code{confint} berechneten Intervallgrenzen einzeln transformiert;
  dies setzt für eine korrekte Reihenfolge der Grenzen eine monoton steigende
  Transformation voraus. Bei \code{uncertainty="se"} werden die Standardfehler
  aus \code{vcov} mit der Delta-Methode und einer numerischen Ableitung
  der Transformationsfunktion angepasst.

  Die Druckausgabe zeigt je Modell den Koeffizienten, bei \code{"se"} ergänzt
  um den Standardfehler in runden Klammern und bei \code{"ci"} um die
  Intervallgrenzen in eckigen Klammern. Fehlende Werte werden leer dargestellt.
}
\value{
  Ein Dataframe der zusätzlichen Klasse \code{daa_compare_coefs} mit
  Koeffizientennamen als Zeilennamen. Die numerischen Spalten heißen
  \code{<Modellname>.coef} sowie je nach \code{uncertainty}
  \code{<Modellname>.se} oder \code{<Modellname>.lwr} und
  \code{<Modellname>.upr}. Die Attribute \code{uncertainty},
  \code{model_names} und \code{credMass} speichern die Ausgabeoptionen.
}
\examples{
  m1 = lm(mpg ~ wt, data=mtcars)
  m2 = lm(mpg ~ wt + hp, data=mtcars)
  compare_coef(Basis=m1, Erweitert=m2)
  compare_coef(Basis=m1, Erweitert=m2, na.omit=FALSE,
               include="beta", uncertainty="se")

  log_modell = lm(log(mpg) ~ wt + hp, data=mtcars)
  vergleich = compare_coef(log_modell, transform=exp, uncertainty="ci")
  print(vergleich, digits=3)
  compare_coef(m1, m2, exclude="Intercept", uncertainty="none",
               na.omit=FALSE)
}
```
