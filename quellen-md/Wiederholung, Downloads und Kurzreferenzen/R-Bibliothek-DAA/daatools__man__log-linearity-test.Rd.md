# daatools/man/log-linearity-test.Rd

```
\name{log_linearity_test}
\alias{log_linearity_test}
\title{Test auf lineare Abhängigkeit bei logistischer Regression}
\usage{
  log_linearity_test(model, parameters=NULL, warnings=TRUE)
}
\description{
Führt einen einfachen Test für logistische Regression aus:
für alle positive nummerische Variable wird in das Modell eine Interaktion der Form x:log(x) eingefügt. Im so entstehenden neuen Modell sollten die Koeffizient für diese Interaktionen nicht signifikant sein.

Falls doch, ist das ein Indiz dafür, dass die zugehörige unabhängige Variable nicht linear mit dem logit() der abhängigen Variable zusammenhängt.
}
\arguments{
  \item{model}{Logistisches Modell.}
  \item{parameters}{Namen der zu prüfenden Variablen. Bei \code{NULL} werden numerische
  Variablen automatisch ausgewählt. Nur strikt positive Variablen werden getestet.}
  \item{warnings}{Warnungen für nicht numerische oder nicht strikt positive Variablen ausgeben.}
}
\details{
Spline-Terme wie \code{splines::ns(x, 3)} bleiben mit ihrer bereits
ausgewerteten Basis im Modell erhalten. Sie werden nicht selbst auf
Linearität getestet. Getestet werden numerische Vektoren im Modellrahmen;
Matrix-Terme (z.B. Spline-Basen) werden bei der automatischen Auswahl übersprungen.
}
```
