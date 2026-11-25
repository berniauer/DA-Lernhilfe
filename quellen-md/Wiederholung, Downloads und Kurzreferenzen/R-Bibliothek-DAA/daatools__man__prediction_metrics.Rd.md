# daatools/man/prediction_metrics.Rd

```
\name{prediction_metrics}
\alias{prediction_metrics}
\encoding{UTF-8}
\title{Vorhersagefehler auf Trainingsdaten und neuen Daten}
\usage{
prediction_metrics(model, newdata, re.form=NULL)
}
\arguments{
  \item{model}{Ein lm-, glm-, lmer-, glmer- oder entsprechendes RStanARM-Modell.}
  \item{newdata}{Nicht leerer Data Frame mit Zielvariable, Prädiktoren und
  gegebenenfalls Gruppierungs- und Offset-Variablen. Tibbles werden unterstützt.}
  \item{re.form}{Auswahl der zufälligen Effekte für Mischmodelle.
  \code{NULL} berücksichtigt sie, \code{NA} schließt sie aus.
  Wird an die Vorhersagemethode weitergegeben.}
}
\description{
Vergleicht Vorhersagefehler auf den beim Fit verwendeten Trainingsbeobachtungen
und neuen Daten. Die Zielvariable wird anhand der Modellformel ausgelesen;
Transformationen der Zielvariable bestimmen auch die Skala der Fehlermaße.
Spline-Basen und deren Knoten werden durch die Vorhersagemethode des Modells
beibehalten.
}
\details{
Numerische Zielvariablen werden mit RMSE und MAE bewertet. Für binomiale
Modelle mit einzelnen binären Beobachtungen werden Brier-Score (mittlerer
quadratischer Fehler der Wahrscheinlichkeit) und LogLoss (mit natürlichem
Logarithmus) ausgegeben. Bei Faktoren ist die zweite Trainingsstufe das Ereignis;
neue Daten müssen dieselben Labels verwenden. Gruppierte Binomialdaten und
Anteile werden nicht unterstützt. LogLoss kann bei einer sicher falschen
Vorhersage unendlich sein.

\code{Skill = 1 - MSE / MSE_baseline}. Die konstante Baseline ist für beide
Datensätze der Mittelwert der Trainingszielvariable, bei binären Zielvariablen
die Trainingsereignisrate. Skill 1 bedeutet perfekte Vorhersage, 0 entspricht
der Baseline, negative Werte bedeuten schlechtere Vorhersagen. Ist der
Baseline-Fehler null, wird Skill als \code{NA} ausgegeben.

RStanARM-Vorhersagen verwenden den Mittelwert von \code{posterior_epred()}
über alle verfügbaren Ziehungen; die übrigen Modelle verwenden Vorhersagen auf
der Antwortskala. Bei Mischmodellen gilt die gleiche \code{re.form}-Einstellung
für beide Zeilen. \code{re.form=NA} setzt zufällige Effekte auf null und ist
keine Integration über ihre Verteilung. Für neue Gruppen gilt das Verhalten
der jeweiligen Vorhersagemethode.

Alle Beobachtungen erhalten beim Berechnen der Metriken gleiches Gewicht,
unabhängig von etwaigen Fit-Gewichten. Fehlende oder nicht endliche Zielwerte
und Vorhersagen führen zu einem Fehler. Bereits beim Fit ausgelassene Zeilen
zählen nicht zu den Trainingsdaten. Offset-Ausdrücke müssen auf den neuen
Daten auswertbar sein; hierfür sollten Spaltennamen statt externer Vektoren
verwendet werden.

Trainingsfehler sind optimistisch. Die Zeile für neue Daten misst die
Generalisierung nur, wenn diese Daten nicht zur Modellanpassung verwendet wurden.
}
\value{
Ein Data Frame mit zwei Zeilen (\code{Training}, \code{New data}) und den Spalten
\code{Dataset}, \code{n}, \code{RMSE}, \code{MAE}, \code{Skill} bzw.
\code{Dataset}, \code{n}, \code{Brier}, \code{LogLoss}, \code{Skill}.
}
\examples{
fit = lm(mpg ~ splines::ns(wt, 3), data=mtcars[1:24, ])
prediction_metrics(fit, mtcars[25:32, ])
}
```
