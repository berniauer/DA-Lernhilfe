# daatools/man/logisticR2.Rd

```
\name{logisticR2}
\alias{logisticR2}
\title{R² für logistische Regression}
\usage{
  logisticR2(model)
}

\description{
Gibt vier R²-Werte für ein logistisches Modell aus.
}

\arguments{
  \item{model}{Logistisches Modell}
}

\value{
data.frame mit vier Werten für R²: McFadden, Cox & Snell, Nagelkerke und Tjur.

Wertebereich von Cox & Snell geht nicht von 0..1 sondern ist eingeschränkt
(obere Schranke hängt von Datensatz ab)! Nagelkerkes R² wird gleich berechnet
wie Cox & Snell, allerdings auf Obergrenze=1 normiert.

Während McFadden, Cox & Snell und Nagelkerke alle auf Deviance des Modells
beruhen, bildet Tjur einfach die Differenz der Mittelwerte der Modellvorhersagen
für y=0 und y=1.
}

\references{
Allison, P. (2013) What’s the Best R-Squared for Logistic Regression?
http://statisticalhorizons.com/r2logistic

McFadden, D.  (1974) “Conditional logit analysis of qualitative choice behavior.”  Pp. 105-142 in P. Zarembka (ed.), Frontiers in Econometrics.  Academic Press.

Cox, D.R. and E.J. Snell (1989) Analysis of Binary Data. Second Edition. Chapman & Hall.

Nagelkerke, N.J.D. (1991) “A note on a general definition of the coefficient of determination.” Biometrika 78: 691-692.

Tjur, T. (2009) “Coefficients of determination in logistic regression models—A new proposal: The coefficient of discrimination.” The American Statistician 63: 366-372.
}
```
