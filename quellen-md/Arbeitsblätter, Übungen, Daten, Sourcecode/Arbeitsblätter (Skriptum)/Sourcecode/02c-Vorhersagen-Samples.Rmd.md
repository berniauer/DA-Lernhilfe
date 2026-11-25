<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Sourcecode/02c-Vorhersagen-Samples.Rmd (R Markdown, Code-Chunks = ```{r}) -->

---
title: 'Vorhersagen mit linearen Modellen'
author: "Arno Hollosi"
lang: "de"
papersize: A4
output:
  pdf_document:
    latex_engine: xelatex
    toc: true
    includes:
      in_header: my-styles.tex
---
  
```{r setup, include=FALSE}
library(knitr)
library(dplyr)
library(rstanarm)
library(daatools)
# options(mc.cores = parallel::detectCores())
knitr::opts_chunk$set(echo = TRUE, fig.width=7, fig.height=4)
options(digits = 3)
```

# Vorhersage

Wenn ein Modell erstellt ist, können wir für neue (oder vorhandene) Datensätze die abhängige Variable vorhersagen. Es gibt in der Gleichung $y \sim \alpha + \beta x + \epsilon$ zwei Arten, wie Ungenauigkeit in die Vorhersage einfließen kann:

1. über die Koeffizienten $\alpha$ und $\beta$: deren Werte könnten zwar für den ursprünglichen Datensatz exakt bestimmt werden, aber bei einer Extrapolation auf die Gesamtpopulation ergeben sich Ungenauigkeiten, weil wir nur ein Sample der Population haben --> das sind die besprochenen Intervalle für die Koeffizienten;

2. über $\epsilon$: das Modell hat einen generellen Fehlerterm, selbst wenn $\alpha$ und $\beta$ exakt bekannt wären. In $\epsilon$ sind alle Umwelteinflüsse enthalten, die nicht im Modell als Variablen repräsentiert sind (z.B. Messfehler, fehlende Variable, ...).[^1]

[^1]: $\epsilon$ entspricht also den Residuen. Der im Regressionsmodell ermittelte Koeffizient $\sigma$ entspricht der Standardabweichung der Verteilung der Residuen. Je größer $\sigma$, um so größere Residuen, um so weniger Erklärungskraft hat das Modell.


## R-Funktionen

Es gibt drei Funktionen, welche für die Vorhersage genützt werden können: `predict()`, für Punktvorhersagen, `posterior_epred()`, wenn nur die Unschärfe von $\alpha$ und $\beta$ eine Rolle spielen soll; und `posterior_predict()`, wenn *zusätzlich* auch $\epsilon$ für die Vorhersage berücksichtigt werden soll. Für neue Daten nimmt man typischerweise letztere Funktion, wenn man am Intervall der Einzelvorhersage interessiert ist. Die beiden letzteren Funktionen liefern eine Matrix retour, welche für jeden Datensatz 4000 Samples (Default) für die Vorhersage erzeugt[^2].

[^2]: basierend auf den 4000 Samples (1000 je Chain, 4 Chains) des Posteriors des Modells.

Wir verwenden wieder das Body-Modell aus dem vorigen Arbeitsblatt, trainieren es aber nur auf die ersten 257 Datensätze, damit wir die letzten 250 Datensätze als dem Modell bislang unbekannte, neue Daten verwenden können.

```{r echo=FALSE, message=FALSE, warning=FALSE}
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)
split_random(body[,c('Weight', 'Height', 'Age', 'Gender')], 257,
             "body_train", "body_test")

modell = stan_glm(Weight ~ Height + Age + Gender,
                  data=body_train, seed=123, refresh=0)
print(modell, digits=2)
```

Verwenden wir nun alle drei Funktionen, um eine Vorhersage für zwei definierte Personen zu machen:

```{r}
# Beispiel: Mann, 48 Jahre, 196cm
#           Frau, 36 Jahre, 171cm

body_new = data.frame(Height=c(171, 196),
                      Age=c(36, 48),
                      Gender=c('Female', 'Male'))

# predict() retourniert die "beste" Schätzung des Modells
point_pred = predict(modell, newdata = body_new)
point_pred

# ohne Epsilon
epred = posterior_epred(modell, newdata = body_new)
hdi(epred, add=median)

# mit Epsilon -- deutlich breiteres Intervall
pred = posterior_predict(modell, newdata = body_new, seed=4567)
hdi(pred, add=median)
```

Man sieht, dass der `fit` der beiden späteren Funktionen ziemlich genau der Punktvorhersage entspricht. Der `fit` ist der Median aller Samples, insoferne ist es nachvollziehbar, dass dieses letztlich mit der Punktvorhersage übereinstimmt.

Das erste Intervall entspricht der Unsicherheit der Koeffizienten, wenn wir auf die Population schließen. Anders ausgedrückt: wenn wir den Mittelwert des Gewichts aller 36 Jahre alter Frauen in der Population, die 171cm groß sind, berechneten, dann würden wir erwarten, dass der *Populationsmittelwert* irgendwo im Intervall von 64kg bis 68kg liegt. Das Intervall beschreibt also einen erwarteten Durchschnittswert, nicht das Intervall für einen einzelnen Fall.

Im zweiten Fall ist das Intervall deutlich breiter, weil es den Fehlerterm $\epsilon$ miteinschließt[^3]. Es beschreibt also das Intervall des Gewichts einer einzelnen Person. Anders ausgedrückt: wenn wir eine beliebige Frau, die 36 Jahre alt und 171cm groß ist, aus der Population wählen würden, dann hat diese (zu 95%) ein Gewicht zwischen 50kg und 81kg.

[^3]: Es kommen etwas weniger als $4 \sigma$ des Modells beim 95%-Intervall dazu: der Sigma-Koeffizient repräsentiert die Größe der Residuen. Im Modell ist $\sigma = 8.8$kg, d.h. die beiden Vorhersagen unterscheiden sich um etwas weniger als $2 \times 8.8 = 17.6$kg in jede Richtung (`lwr` und `upr`).

Gedankenspiel: wenn unser Sample die gesamte Population umfasst, dann sind die Koeffizienten exakt bekannt -- es gibt keine Unsicherheit mehr. Dann würde das Intervall von `posterior_epred()` auf Null schrumpfen, weil es bei den Modellkoeffizienten keine Unsicherheit mehr gibt. Aber das Intervall von `posterior_predict()` würde nicht auf Null sondern auf ca. $4 \sigma$ schrumpfen. Weil eben ein Rest (der Fehlerterm des Modells) vom Modell nicht erfasst wird und der Einzelfall daher nie exakt vorhergesagt wird.


## Wahrscheinlichkeiten

Da wir (dank Bayes-Modell) mit echten Verteilungen arbeiten, können wir diese weiterverwenden, z.B. um weitere Aussagen zu treffen:

```{r}
# Daten von oben
epred_sample_female = epred[,1]
epred_sample_male = epred[,2]
pred_sample_female = pred[,1]
pred_sample_male = pred[,2]

# Wie wahrscheinlich wiegt die Frau (36, 171cm) zwischen 55 und 60kg?
# -> 16% Wahrscheinlichkeit
mean(pred_sample_female >= 55 & pred_sample_female < 60)

# Wie wahrscheinlich ist der Mann (48, 196cm) schwerer als 90kg?
# -> 63% Wahrscheinlichkeit
mean(pred_sample_male > 90)

# Von allen Männern der Population die 48 Jahre alt und 196cm groß sind:
# Welches mittlere Gewicht erwarten wir (mit Angabe von Quartilen)?
quantile(epred_sample_male, c(0.25, 0.5, 0.75))
# Und bei den Frauen (alle 36 Jahre alt, 171cm groß):
quantile(epred_sample_female, c(0.25, 0.5, 0.75))
```


## Unterschied

Ebenfalls möglich ist es, z.B. Unterschiede zu berechnen. Wenn wir nur am Unterschied der Modellvorhersage (ohne Fehlerterm) interessiert sind -- also am durchschnittlichen Unterschied zwischen den gewählten Personen -- dann sollten wir `posterior_epred()` verwenden. Mit den Daten von vorher, was ist der Unterschied laut Modell zwischen den beiden Personen? Nimmt man Epsilon mit hinein (`posterior_predict()`), stellt man sich also die Frage: Wenn ich zwei beliebige Personen mit den genannten Daten aus der Population herauspicke, wie groß ist dann der Unterschied?

```{r}
epred_diff = epred_sample_male - epred_sample_female
pred_diff = pred_sample_male - pred_sample_female

par(mfrow=c(1,2))
plothist(epred_diff, main='Differenz (epred)', xlab='')
plothist(pred_diff, main='Differenz (predict)', xlab='')
```

Es ist deutlich zu sehen, wie sehr der Fehlerterm $\epsilon$ (Einflüsse, die von Modell nicht erfasst sind) das Intervall der Differenz verbreitet. Die durchschnittliche Differenz von 29kg ist aber in beiden Fällen gleich.

Wir könnten uns auch die Frage stellen, wie wahrscheinlich es ist, dass die Differenz kleiner 10kg ist:

```{r}
# die Wahrscheinlichkeit, dass die Differenz zwischen einer
# zufällig ausgewählten Frau (36, 171cm) und einem zufällig
# ausgewählten Mann (38, 196cm) kleiner 10kg ist, beträgt ~8%
mean(pred_diff < 10)
# und dass die Frau schwerer als der Mann ist: ~1.6%
mean(pred_diff < 0)
```

# Entscheidungen

Angenommen, wir sind eine Fluggesellschaft und wollen das maximale Ladegewicht ausnützen. Wir kennen Alter, Geschlecht und Größe unserer Passagiere (haben wir aus Reisepass-Daten), ihr Gewicht kennen wir vor dem Flug aber nicht.

Wenn wir zu viel Gewicht einplanen, lassen wir unnötig Ladung zurück. Planen wir zu wenig Gewicht ein, ist das Flugzeug schwerer als erwartet und bereits eingeplante Ladung kann nicht mitgenommen werden. Wir müssen also eine Entscheidung treffen, mit welchem Gesamtgewicht wir planen.

Als Beispiel-Datensatz verwenden wir den Pool aus 250 Personen aus `body_test`, welche dem Modell bisher unbekannt sind. Unsere Flugzeuge fassen 150 Passagiere, wählen wir also zufällig 150 Personen aus den 250 aus:

```{r}
set.seed(123)
passagiere = slice_sample(body_test, n=150)

# Vorhersage für alle 150 Passagiere
ppred = posterior_predict(modell, newdata=passagiere, seed=9876)

# Jede Zeile entspricht einem möglichen Gesamtgewicht des Fluges
gesamtgewicht = rowSums(ppred)

plothist(gesamtgewicht, credMass=0.9,
         main='Mögliches Gesamtgewicht des Fluges', xlab='')
```

Wir erhalten eine Verteilung möglicher Gesamtgewichte. Das 95%-HDI entspricht in etwa dem Gewicht von $\pm3$ Personen. Für unsere Entscheidung müssen wir nun festlegen, mit welchem Gewicht wir planen.

## Kosten einer Entscheidung

Angenommen, jedes Kilogramm zu viel eingeplantes Gewicht kostet uns 5,- €: wir hätten stattdessen zusätzliche Ladung mitnehmen können. Jedes Kilogramm zu wenig eingeplantes Gewicht kostet dagegen 15,- €, weil bereits geplante Ladung zurückbleiben und auf Folgeflüge verteilt werden muss. Unsere Kostenfunktion sieht damit so aus:

$$
Kosten =
\begin{cases}
15 \times (Gewicht - Entscheidung), & Gewicht > Entscheidung\\
5 \times (Entscheidung - Gewicht), & Gewicht < Entscheidung
\end{cases}
$$
Wir könnten beispielsweise einfach den Mittelwert unserer vorhergesagten Gesamtgewichte verwenden:

```{r}
mean(gesamtgewicht)
```

Aber ist das tatsächlich die beste Entscheidung? Wir können für jede mögliche Entscheidung ausrechnen, welche Kosten über unsere posterior-prädiktiven Samples im Durchschnitt entstehen würden:

```{r}
gewicht_seq = seq(min(gesamtgewicht), max(gesamtgewicht), length.out=200)

erwartete_kosten = sapply(gewicht_seq, function(gewicht) {
  kosten = ifelse(gesamtgewicht > gewicht,
    (gesamtgewicht - gewicht) * 15,
    (gewicht - gesamtgewicht) * 5
  )
  mean(kosten)
})

plot(gewicht_seq, erwartete_kosten, type='l',
     xlab='Eingeplantes Gesamtgewicht', ylab='Erwartete Kosten',
     main='Welche Entscheidung minimiert unsere Kosten?')
```

Die optimale Entscheidung, also das Minimum der erwarteten Kosten, ist bei:[^4]

```{r}
entscheidung = gewicht_seq[which.min(erwartete_kosten)]
entscheidung
```

[^4]: Es gäbe auch einen anderen Weg bei einer solchen asymmetrischen Kostenfunktion: ein bestimmtes Quantil der Vorhersageverteilung ist optimal. Bei uns kostet Unterschätzen: 15€/kg und Überschätzen 5€/kg. Daher liegt die optimale Entscheidung beim $\frac{15}{15+5}=0.75$ Quantil unserer Vorhersageverteilung. Bei gleich hohen Kosten für Über- und Unterschätzen wäre dagegen das 50%-Quantil, also der Median, die optimale Entscheidung.

Da Unterschätzen für uns dreimal so teuer ist wie Überschätzen planen wir also vorsichtiger und verwenden ein Gewicht, das oberhalb der Mitte unserer Vorhersageverteilung liegt.

## Wie gut war unsere Entscheidung?

Bei echten zukünftigen Passagieren kennen wir deren echtes Gewicht natürlich nicht. In unserem Testdatensatz ist uns das tatsächliche Gewicht aber bekannt. Daher können wir nachträglich überprüfen, welche Kosten tatsächlich entstanden wären.

```{r}
gewicht_real = sum(passagiere$Weight)
diff = entscheidung - gewicht_real
kosten_real = ifelse(diff < 0, -diff * 15, diff * 5)
c(entscheidung=entscheidung,
  gewicht_real=gewicht_real,
  kosten_real=kosten_real)
```

Wichtig ist also die Trennung zwischen **Vorhersage** und **Entscheidung**: `posterior_predict()` liefert uns eine Verteilung möglicher Gewichte. Daraus leiten wir dann unter Berücksichtigung der Kostenfunktion in Folge die optimale Entscheidung ab. Die beste Vorhersage (hier: Median) und die beste Entscheidung (hier: Minimum der erwarteten Kosten) müssen also nicht dasselbe sein.

## Wann ist das Modell besser?

Angenommen, wir hätten vor der Entwicklung unseres Modells einfach mit einem durchschnittlichen Gewicht von 69 kg pro Passagier gerechnet (dem Mittelwert des Gewichts im Datensatz). Für 150 Passagiere hätten wir daher immer mit $69 \times 150=10350$ kg geplant. Welche der beiden Entscheidungsregeln ist besser?

1. **Alte Regel:** immer 69 kg pro Passagier annehmen.
2. **Modell:** für die konkreten Passagiere eine Vorhersageverteilung berechnen und deren Minimum verwenden.

Um beide Ansätze fair zu vergleichen, müssen sie auf mehreren Flügen testen. Wir verwenden dafür die 250 Personen aus unserem Testdatensatz und stellen daraus immer wieder Flüge mit 150 Passagieren zusammen:

```{r cache=TRUE}
n_fluege = 500
kosten_modell = numeric(n_fluege)
kosten_alt = numeric(n_fluege)

set.seed(1234)
for (i in 1:n_fluege) {
  # 150 Personen für diesen Flug auswählen
  passagiere_i = slice_sample(body_test, n=150, replace=TRUE)
  gewicht_real_i = sum(passagiere_i$Weight)
  
  # optimale Entscheidung bei unserer Kostenfunktion
  ppred_i = posterior_predict(modell, newdata=passagiere_i, draws=1000)
  gesamtgewicht_i = rowSums(ppred_i)
  gewicht_seq_i = seq(min(gesamtgewicht_i), max(gesamtgewicht_i), length.out=200)
  erwartete_kosten_i = sapply(gewicht_seq_i, function(gewicht) {
    kosten = ifelse(gesamtgewicht_i > gewicht, 
                    (gesamtgewicht_i - gewicht) * 15,
                    (gewicht - gesamtgewicht_i) * 5)
    mean(kosten)
  })
  entscheidung_i = gewicht_seq_i[which.min(erwartete_kosten_i)]
  diff_i = entscheidung_i - gewicht_real_i
  kosten_modell[i] = ifelse(diff_i < 0, -diff_i * 15, diff_i * 5)

  # Entscheidung mit der alten 69-kg-Regel
  entscheidung_alt_i = 69 * 150
  diff_alt_i = entscheidung_alt_i - gewicht_real_i
  kosten_alt[i] = ifelse(diff_alt_i < 0, -diff_alt_i * 15, diff_alt_i * 5)
}
```

Nun können wir die durchschnittlichen Kosten pro Flug vergleichen:

```{r}
c(
  Modell = mean(kosten_modell),
  `69kg-Regel` = mean(kosten_alt)
)
```

Mit unserem Modell sparen wir also im Schnitt pro Flug ca. €310 ein. Die Verteilung der Kostendifferenz zwischen 69kg-Regel und Modell sieht so aus:

```{r echo=FALSE}
ersparnis = kosten_alt - kosten_modell

plothist(ersparnis, compVal=0, cenTend = 'mean',
         main='Kostenersparnis des Modells pro Flug', xlab='')
```

Positive Werte bedeuten, dass unser Modell günstiger war, negative Werte bedeuten, dass die einfache 69kg-Regel bei diesem Flug besser abgeschnitten hätte. Die Bandbreite reicht von -2600..+3800€ und unser Modell schneidet bei über 56% aller Flüge besser ab und im Mittel eben um 310€.

Der Vergleich zeigt: erst die Vorhersage in Kombination mit einer guten Entscheidungsregel (hier: minimieren der bekannten Kostenfunktion) kann ein gutes Ergebnis bringen. Das Histogramm führt uns auch vor Augen, welche Konsequenzen Fehler in die eine oder andere Richtung haben.

Einziger Wermutstropfen: unsere Entscheidungsregel wurde nur auf 250 Testpersonen überprüft. Sind diese Personen wirklich repräsentativ für alle zukünftigen Fluggäste unserer Fluggesellschaft? Das Modell bleibt nur dann eine gute Grundlage für Entscheidungen, wenn auch seine Vorhersageverteilung die zukünftigen Passagiere ausreichend gut beschreibt.
