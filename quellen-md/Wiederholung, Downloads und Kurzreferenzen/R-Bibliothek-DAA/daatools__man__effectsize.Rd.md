# daatools/man/effectsize.Rd

```
\name{effectsize}
\alias{effectsize}
\title{effectsize}
\usage{
  effectsize(model)
}
\description{
  Erweitert drop1() und sortiert Einträge nach Effektgröße.
  Lineare Modelle werden um die Spalten r2 (R²) und f2 (Cohens f²) erweitert.
  Bayes-Modelle werden (der Geschwindigkeit wegen) auf gewöhnliche frequentistische Modelle umgerechnet.
  D.h. Effektgröße ist nur eine Schätzung der echten Effektgröße des Bayes-Modell.
  Spline-Terme (z.B. \code{splines::ns(x, 3)}) werden als Ganzes entfernt,
  einschließlich ihrer Interaktionen. Verbleibende Terme verwenden die bereits
  ausgewerteten Modellspalten, sodass Spline-Basen und Beobachtungen erhalten bleiben.
}
\arguments{
  \item{model}{stan_glm/stan_glmer/lm/glm-Modell}
}
```
