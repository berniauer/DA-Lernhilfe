# daatools/man/brier.Rd

```
\name{brier}
\alias{brier}
\title{Brier-Score für logistische Regression}
\usage{
  brier(model, newdata=NULL)
}
\description{
Berechnet den Brier-Score zur Bewertung probabilistischer Vorhersagen.
Der Score misst die mittlere quadratische Abweichung zwischen vorhergesagten Wahrscheinlichkeiten und tatsächlichen Ereignissen (0/1). Kleinere Werte sind besser. Wertebereich 0..1, 0=perfekte Vorhersage, >0.25 ist Warnsignal (sollte nicht passieren).
}
\arguments{
  \item{model}{Logistisches Modell}
  \item{newdata}{Neue Daten für die Brier-Score berechnet werden soll; muss auch Y enthalten}
}
```
