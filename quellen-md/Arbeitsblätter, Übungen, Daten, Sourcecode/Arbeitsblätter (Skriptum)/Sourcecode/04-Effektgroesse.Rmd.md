<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Sourcecode/04-Effektgroesse.Rmd (R Markdown, Code-Chunks = ```{r}) -->

---
title: "Effektgrößen"
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

```{r include=FALSE}
library(knitr)
knitr::opts_chunk$set(echo = TRUE,
                      fig.width=7, fig.height=4,
                      R.options = list(digits = 2))
library(rstanarm)
library(daatools)
```


# Motivation

Statistische Analysen liefern immer ein (mathematisches) Ergebnis. Ob dieses Ergebnis aber auch *real* ist, d.h. der Wirklichkeit entspricht, verraten die Zahlen selbst meistens nicht. Für die Praxis relevant ist unter anderem die Effektgröße. Nur wenn ein Effekt so groß ist, dass er auch praktische Bedeutung hat, sind statistisch signifikante Ergebnisse relevant.

Nehmen wir als Beispiel die Körpergröße: In Österreich ist die Durchschnittsgröße von Männern 179cm, von Frauen 166cm. Die Größe ist normalverteilt, mit einer Standardabweichung von ca. 7cm. Wir könnten also die abweichende Körpergröße als *Effekt* des Geschlechts sehen. Ist er relevant?

```{r echo=FALSE}
curve(dnorm(x, 179, 7), xlim=c(140, 210),
      col="blue",ylab="Density", xlab="Körpergröße (cm)",
      main="Körpergröße von Erwachsenen in Österreich",
      frame.plot=FALSE)
grid()
curve(dnorm(x, 166, 7), add=T, col="red")
text(155, .05, "Frauen", col="red")
text(190, .05, "Männer", col="blue")
```

Wir können den Effekt als Unterschied der Durchschnittsgrößen berechnen: $179cm-166cm = 13cm$

Während bei der Größe (und anderen physikalischen Messwerten) absolute Zahlen sinnvoll interpretiert werden können, sind viele Konstrukte unklar: was bedeutet ein Effekt von 3.2 bei Fröhlichkeit?

## Standardisierte Effektgröße

Eine standardisierte Effektgröße für metrische Variable ist **Cohens d** und bezieht sich auf die Standardabweichung in einem Sample und berechnet sich als:

$$d = \frac{\mu_x - \mu_y}{\sigma}$$

Am Beispiel der Körpergröße: $d = \frac{179cm - 166cm}{7cm} = 1.86$. Cohen hat folgende Daumenregeln für die Effektgröße aufgestellt:

  * $d \approx 0.2$ gilt als kleiner Effekt
  * $d \approx 0.5$ gilt als mittlerer Effekt
  * $d \approx 0.8$ gilt als großer Effekt

Der Effekt des Geschlechts auf die Körpergröße ist in diesem Schema also ein sehr großer Effekt.

### Beispiel: Facebook-Studie

Eine Studie hat die Auswirkung negativer Kommentare auf Facebook ausgewertet[^1]. Folgendes Ergebnis wurde dort statistisch signifikant gefunden:

[^1]: Kramera, Guillory, and Hancock (2014): *Experimental evidence of massive-scale emotional contagion through social networks*, http://www.pnas.org/content/111/24/8788.full
 
> When positive posts were reduced in the News Feed, [...] the percentage of words that were negative increased by B = 0.04% (t = 2.71, P = 0.007, d = 0.001).

Was bedeutet ein $d = 0.001$? Es heißt, dass bei einer gegebenen Standardabweichung der Effekt nur 0.1% der Standardabweichung ausgemacht hat. Wenn sich beide getesteten Facebook-Nutzergruppen ähnlich verhalten, dann bedeutet das, dass eine Person min. 2500 Wörter tippen muss[^2] bevor (im Schnitt) ein zusätzliches negatives Wort auftaucht (bei der durchschnittlichen Länge eines Facebook-Postings sind das ca. 100 Postings ;o) Ein relevanter Effekt?

[^2]: **Number needed to treat** (siehe z.B. http://rpsychologist.com/d3/cohend/) `NNT = function(CER, d) { return (1 / (pnorm(d + qnorm(CER))-CER)) }`, CER ... event rate, `NNT(0.5, 0.001) ~ 2500`. Alternativ: bei 122 Mio Wörten der Studie gab es einen Unterschied von 0.04% =~ 50.000 Wörter, das ist in etwa jedes 2500ste Wort.


# Effektgrößen bei Regression

Auch bei Regressionsgleichungen können wir die einzelnen Koeffizienten als Effektgrößen interpretieren. Sehen wir uns dazu folgende Variable an:

```{r}
set.seed(4321)
x1 = rnorm(500, 150, 10)
x2 = rnorm(500, 200, 10)
df = data.frame(
  x1 = x1, x2 = x2,
  y1 = x1 + 0.1*x2 + rnorm(500, 10, 10),
  y2 = x1 + 1*x2 + rnorm(500, 10, 10),
  y3 = x1 + 10*x2 + rnorm(500, 50, 50))
```

Der unterschiedlich starke Zusammenhang zwischen $y_i$ und $x_2$ ist im Scatterplot deutlich zu erkennen:

```{r echo=FALSE, fig.height=4.5}
par(mfrow=c(2,2), mar=c(4,5,1,1))
plot(df$x2, df$y1, col=rgb(0,0,0,.3), xlab="X2", ylab="Y1")
plot(df$x2, df$y2, col=rgb(0,0,0,.3), xlab="X2", ylab="Y2")
plot(df$x2, df$y3, col=rgb(0,0,0,.3), xlab="X2", ylab="Y3")
```

Wie sehen die Regressionsgleichungen aus?

```{r cache=TRUE}
m1 = stan_glm(y1 ~ x1 + x2, data=df, seed=123, refresh=0)
m2 = stan_glm(y2 ~ x1 + x2, data=df, seed=123, refresh=0)
m3 = stan_glm(y3 ~ x1 + x2, data=df, seed=123, refresh=0)
```
```{r echo=FALSE}
kable(data.frame(cbind(c("m1", "m2", "m3"),
                       round(rbind(coef(m1), coef(m2), coef(m3)), 2)),
                 row.names = 1),
      col.names=c("", "(Intercept)", "$x_1$", "$x_2$"), escape=FALSE)
```

Sie entsprechen (mit kleinem Fehler) der Wirklichkeit: erhöht sich $x_2$ um 1, dann gibt der Koeffizient an, wie viel sich $y_i$ im Durchschnitt erhöht. Es handelt sich um absolute Zahlen. Die Koeffizienten können in diesem Sinn direkt als *Effekt* interpretiert werden.

## Größe der Koeffizienten != Effektgröße

Es ist ein Trugschluss zu glauben, dass je größer der Koeffizient ist, desto größer auch der Effekt sein muss. Ein einfaches Gegenbeispiel beweist es: für die Regression `Weight ~ Height + Gender + Age` (Größe in cm, Gewicht in kg) kommt ein Größe-Koeffizient von ca. 0.7 heraus (Einheit kg/cm), der kleiner als der Wert des Geschlecht-Koeffizienten ist. Misst man Größe allerdings in Metern statt Zentimetern ist der Koeffizient mit 72 (Einheit kg/m) plötzlich größer als der des Geschlechts.

```{r cache=TRUE}
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)
body$Height_m = body$Height / 100

modell1 = stan_glm(Weight ~ Height + Gender + Age, data=body, seed=123, refresh=0)
modell1m = stan_glm(Weight ~ Height_m + Gender + Age, data=body, seed=123, refresh=0)
```
```{r echo=FALSE}
kable(data.frame(modell1=coef(modell1),
                 modell1m=coef(modell1m)))
```

Der tatsächliche, reale Effekt von Größe auf Gewicht ist aber in beiden Modellen gleich groß. D.h. je nachdem wie die Variablen skaliert sind, ändert sich zwar die Größe der Koeffizienten, aber wie viel die Variable zur Erklärung der Y-Variable beiträgt lässt sich daraus nicht ablesen. Man kann sich diese Eigenschaft zu Nutze machen, in dem bspw. alle Variablen auf dieselbe Größe skaliert werden (z-Skalierung) oder alle Koeffizienten mit der Standardabweichung multipliziert werden.

## Erklärte Varianz eines Modells

$R^2$ gibt die erklärte Varianz eines linearen Modells an und kann mit `bayes_R2()` berechnet werden. Die erklärte Varianz eines Modells kann als Indikator für ein passendes Modell herangezogen werden: je höher $R^2$, desto mehr Varianz im Datensatz wird erklärt. $R^2$ sollte dennoch mit Vorsicht interpretiert werden: $R^2$ sagt nur etwas über den vorliegenden Datensatz aus, nicht aber über die Genauigkeit bei Vorhersagen bzw. der Verallgemeinerung auf die Population.

Wie immer, haben wir bisher nur von Punktwerten gesprochen. Eigentlich ist $R^2$ auch eine Verteilung.

```{r echo=FALSE, fig.height=4.5}
plothist(bayes_R2(modell1))
```

$R^2$ sagt auch nichts darüber aus, ob unser Modell *korrekt* ist: das Modell kann exakt der Wirklichkeit entsprechen und dennoch ein sehr kleines $R^2$ haben, weil die unabhängigen Variablen $x_i$ des Modells eben nur einen kleinen Teil der abhängigen Variable $y$ erklären. Im Umkehrschluss kann ein Modell, das der Wirklichkeit nicht entspricht, ein sehr hohes $R^2$ haben, weil "erklärte Varianz" eben nicht kausaler Zusammenhang bedeutet. $R^2$ sollte daher als Indiz verstanden und gemeinsam mit anderen Diagnose verknüpft werden, anstatt es als ein absolutes Maß für die Qualität eines Modells zu verstehen.

## Effektgröße einzelner Parameter

Man kann sich $R^2$ auch zu Nutze machen, um den Einfluss bzw. die Effektgröße einzelner Parameter zu berechnen. Dazu berechnet man zuerst $R^2$ des vollständigen Modells und entfernt dann eine der Variablen, um zu schauen, wie sich $R^2$ verändert. Wenn $R^2$ stark fällt, dann hat die Variable offensichtlich sehr viel von der Varianz im Datensatz erklärt. Bleibt hingegen $R^2$ beinahe unverändert, dann können wir daraus schließen, dass die Variable nur wenig zur Erklärung der Daten beiträgt.

Berechnen wir nun zwei weitere Modelle:

```{r cache=TRUE}
modell2 = stan_glm(Weight ~ Height + Age, data=body, seed=123, refresh=0)
modell3 = stan_glm(Weight ~ Gender + Age, data=body, seed=123, refresh=0)
```

Und schauen wir uns das $R^2$ aller drei Modelle an:

```{r echo=FALSE}
kable(data.frame(name=c("Modell 1", "Modell 2", "Modell 3"),
                 modell=c("$Weight \\sim Height + Gender + Age$",
                          "$Weight \\sim Height + Age$",
                          "$Weight \\sim Gender + Age$"),
                 r2=c(mean(bayes_R2(modell1)),
                      mean(bayes_R2(modell2)),
                      mean(bayes_R2(modell3)))),
      col.names=c("Name", "Modellformel", "R²"))
```

Wie erwartet erklärt das erste Modell mit seinen drei X-Variablen die meiste Varianz im Datensatz mit 58 Prozent. Bei Modell 2, das *Gender* entfernt hat, fällt $R^2$ auf 54 Prozent. Bei Modell 3, das *Height* entfernt hat, fällt $R^2$ auf 44 Prozent. Das heißt, ohne *Height* erklärt das Modell deutlich weniger Varianz im Datensatz als ohne *Gender* → die Körpergröße hat also einen deutlich stärkeren Effekt -- eine bessere "Erklärungskraft", einen höheren Einfluss -- auf das Körpergewicht als das Geschlecht.

Um diese Erklärungsstärke besser vergleichbar zu machen, ist es möglich, ein standardisiertes Maß zu verwenden: Cohens $f^2$. Es ist das *Verhältnis von erklärter zu unerklärter Varianz* und errechnet sich aus:

$$f^2 = \frac{R_{AB}^2 - R_A^2}{1 - R_{AB}^2}$$

(wobei $R_{AB}^2$ das $R^2$ für jenes Modell ist, das alle Variablen A und Variable B enthält, und $R_A^2$ das $R^2$ für Modell nur mit den Variablen A ist.) Am Beispiel mit den Körpermodellen:

```{r cache=TRUE, R.ptio}
r2_m1 = bayes_R2(modell1)
r2_m2 = bayes_R2(modell2)
r2_m3 = bayes_R2(modell3)

f2_height = (r2_m1 - r2_m3) / (1 - r2_m1)
mean(f2_height)
f2_gender = (r2_m1 - r2_m2) / (1 - r2_m1)
mean(f2_gender)
```

Um den Effekt der Körpergröße zu berechnen, vergleichen wir das vollständige Modell (`modell1`) mit jenem, bei dem die Körpergröße fehlt (`modell3`). Der Unterschied zwischen beiden Modellen muss der Effekt der Körpergröße sein. Analog ist der Vergleich mit `modell2` (bei dem das Geschlecht fehlt) geeignet, die Effektgröße der Geschlecht-Variable herauszufinden.

Mit einem $f^2=0.33$ für die Größe und $f^2=0.11$ für das Geschlecht ist klar, dass Geschlecht einen kleineren Effekt auf das Gewicht einer Person hat als die Körpergröße.

Wie oben erwähnt, erklärt die Körpergröße zusätzliche 14 Prozentpunkte der Varianz des Gewichts, *nachdem* Alter und Geschlecht bereits berücksichtigt wurden. $f^2=0.33$ bedeutet, dass dieser zusätzliche Erklärungsbeitrag rund 33% der im vollständigen Modell noch unerklärten Varianz beträgt. Anders formuliert: 

$$
f^2 = \frac
  {\text{zusätzlich erklärte Varianz}}
  {\text{unerklärte Varianz im vollständigen Modell}}
$$
$f^2$ ist also ein relatives Maß und $f^2=0.33$ bedeutet nicht, dass die Variable 33% der Varianz erklärt. Wenn also bspw. für eine Variable `A` $f^2=0.4$ und für eine Variable `B` $f^2=0.04$ ist, dann ist der *zusätzliche Erklärungsbeitrag* von `A` zehnmal so groß wie jener von `B`, jeweils *relativ zur unerklärten Varianz* desselben vollständigen Modells. Das bedeutet nicht, dass `A` eine zehnmal so große Veränderung von `Y` bewirkt oder zehnmal so wichtig für eine praktische Entscheidung ist.

### Richtwerte für $f^2$

Cohen hat folgende Richtwerte für $f^2$ angegeben:

  * $f^2 \approx 0.02$ gilt als kleiner Effekt
  * $f^2 \approx 0.15$ gilt als mittlerer Effekt
  * $f^2 \approx 0.35$ gilt als großer Effekt

**Hinweis**: die Richtwerte von Cohen sind als Daumenregel zu verstehen. In einem gegebenen Fach bzw. Kontext können bspw. auch wesentlich kleinere Werte höchst bedeutsam sein.

### Effektgröße-Funktion

Die *daatools* haben eine hilfreiche Funktion, welche es erlaubt, die Effektgröße $f^2$ direkt zu berechnen:

```{r cache=TRUE}
effectsize(modell1)
```

Die Funktion berechnet $R^2$ und den darauf aufbauend $f^2$-Wert bei linearen Modellen. "\<none>" ist das Originalmodell mit allen Variablen. Jede weitere Zeile gibt an, welche Variable entfernt worden ist. Interaktionsterme werden gemeinsam mit den Basisvariablen entfernt. Die Funktion verschafft einen direkten Überblick über die Effektgröße der Variablen; sie ist auch für die logistische Regression einsetzbar.
