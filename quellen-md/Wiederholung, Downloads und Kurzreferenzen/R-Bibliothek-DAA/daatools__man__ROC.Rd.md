# daatools/man/ROC.Rd

```
\name{ROC}
\alias{ROC}
\alias{logistic_rates}
\alias{cutoff_index}
\alias{plotlogrates}
\title{ROC-Kurve}
\usage{
  ROC(model, newdata=NULL, main="ROC-Kurve")
  logistic_rates(model, newdata=NULL)
  cutoff_index(logrates, cutoff)
  plotlogrates(model, newdata=NULL, count=FALSE,
               groups=c("true positive", "false negative", "false positive", "true negative"))
}
\description{
  \command{ROC()} zeichnet die ROC-Kurve für die zugehörige logistische Regression inkl. dem AUC-Wert (area under curve).

  \command{logistic_rates()} retourniert einen data.frame mit Liste von cutoff-Werten und den zugehörigen \emph{true positive}-, \emph{false positive}-, \emph{true negative}- und \emph{false negative}-Raten.

  \command{cutoff_index()} liefert für einen gegebenen cutoff-Wert den passenden Zeilen-Index für den logistic_rates()-Dataframe.
  \command{plotlogrates()} zeichnet vier Diagramme für TPR, FPR, FNR, und TNR.
}
\arguments{
  \item{main}{Titel der ROC-Grafik.}
  \item{model}{Logistisches Modell}
  \item{newdata}{Neue Daten für die Vorhersagen berechnet werden sollen; muss auch Y für Vergleich enthalten}
  \item{logrates}{Data-Frame: Ergebnis von logistic_rates()}
  \item{cutoff}{Schwellwert für 0/1-Interpretation}
  \item{count}{Ob die Rate (0..1) oder die Anzahl angezeigt werden soll}
  \item{groups}{Bezeichnung für die vier Gruppen bei plotlogrates() -- Reihenfolge beibehalten!}
}
```
