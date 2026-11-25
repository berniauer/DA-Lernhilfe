<!-- Quelle: Wiederholung, Downloads und Kurzreferenzen/Voraussetzung (statistisches Basiswissen)/Sourcecode/00a-Wiederholung-Basiswissen.Rmd (R Markdown, Code-Chunks = ```{r}) -->

---
title: 'Statistik-Grundlagen'
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
knitr::opts_chunk$set(echo = TRUE, fig.width=7, fig.height=4)
library(daatools)
```

# Grundlagen

## Prozentrechnung

$1\% = \frac 1 {100}$, d.h. 1 Prozent ist ein Hundertstel. Beispiele: $5\% = 0.05$, $17\% = 0.17$,
$1.34 = 134\%$, $2 = 200\%$ und $5\%$ von 500 sind 25.

Wenn sich ein Wert um $x\%$ erhöht, dann ist das identisch mit einer
Multiplikation von $(1 + x\%)$. Beispiel: $500$ um $5\%$ erhöhen ergibt $525$,
da $500 * (1 + 5\%) = 500 * 1.05 = 525$.

Im Umkehrschluss: eine Multiplikation mit $x>=1$ entspricht einer Erhöhung
um $(x - 1)*100\%$. Beispiel: $300 * 2.5 = 750$ entspricht einer Erhöhung um $150\%$,
da $(2.5 -1)*100\% = 1.5*100\%=150\%$ und $300 + 300*150\% = 750$ ist.

Wenn sich ein Wert um $x\%$ verringert, also beispielsweise eine Verringerung um $5\%$
(also einer "Erhöhung" von $-5\%$) entspricht das einer Multiplikation
von $(1 + (-5\%)) = 1 - 0.05 = 0.95$.

Analog im Umkehrschluss: eine Multiplikation mit $x < 1$ entspricht einer Verringerung
um $(1 - x)*100\%$.
Beispiel: Multiplikation mit $0.65$ entspricht einer Verringerung von $(1-0.65)*100\% = 35\%$.


## Logarithmus

Der Logarithmus ist die inverse Funktion zum Exponenzieren (Potenzieren). Ein Logarithmus hat eine Basis, der natürliche Logarithmus hat die Basis $e$. Der Logarithmus ist nur für positive Zahlen definiert und hat eine Nullstelle bei $x=1$:

```{r echo=FALSE}
curve(log(x), 0, 20, frame.plot=FALSE, main="y=log(x)", ylim=c(-2,3), xlim=c(0.001,21),
      col="darkblue", axes=F, xlab='')
axis(1, pos=0, at=c(0, 21), labels=c('', ''), lwd.ticks=0, col='darkgrey')
axis(1, pos=0, at=c(1, 5, 10, 15, 20), lwd=0, lwd.ticks=1, col='darkgrey')
axis(2, pos=0, at=c(-2.5, 3.5), labels=c('', ''), lwd.ticks=0, col='darkgrey')
axis(2, pos=0, lwd=0, lwd.ticks=1, col='darkgrey')
```

Formeln:

* $log(1) = 0$ und $log(0) = -\infty$
* Wenn $y = a^x$ dann ist $log_a(y) = x$.
* $log(a \times b) = log(a) + log(b)$
* $log(a^b) = b \times log(a)$
* Andere Basis ist nur multiplikativer Faktor: $log_a(x) = c \times log_b(x)$ mit $c = log_a(b)$


## Wahrscheinlichkeit

$p(A)$ : wie gewiss/wie sicher tritt Ereignis $A$ ein?

Auch: $p = \frac {\text{Anzahl der gewünschten Ereignisse}} {\text{Anzahl aller möglichen Ereignisse}}$

Wertebereich: $0 \le p(A) \le 1$,
d.h. wenn $p(A) = 0$ dann tritt Ereignis $A$ **nie** ein, wenn $p(A) = 1$ dann tritt Ereignis $A$ immer/absolut sicher ein (zu 100%).

Beispiel: Wird eine Münze geworfen, dann gehen wir typischerweise von $p(Kopf) = 0.5$ und $p(Zahl) = 0.5$ aus.

Komplementäres Ereignis ("nicht $A$"): $p(\overline A) = 1 - p(A)$

Beispiel: Bei einem Würfel ist die Chance eine Drei zu würfeln $p(3) = \frac 1 6$, und die Wahrscheinlichkeit **nicht** eine Drei zu würfeln $p(\overline 3) = 1 - p(3) = 1 - \frac 1 6 = \frac 5 6$.

\pagebreak
## Unabhängige Ereignisse

Sind zwei Ereignisse $A$ und $B$ unabhängig, dann ist die Wahrscheinlichkeit, dass beide Ereignisse eintreffen:

$$p(A \cap B) = p(A) \times p(B)$$

Beispiele:

* Chance, dass zweimal bei einer Münze Kopf geworfen wird: $p(Kopf \cap Kopf) = p(Kopf) \times p(Kopf) = \frac 1 2 \times \frac 1 2 = \frac 1 4$
* Chance, dass bei zwei Würfen zuerst eine Drei und dann eine Vier oder Fünf gewürfelt wird: $p(3 \cap 45) = p(3) \times p(45) = \frac 1 6 \times \frac 2 6 = \frac 1 {18}$

Reihenfolge unwichtig, d.h.: $p(A \cap B) = p(B \cap A)$

## Abhängige Ereignisse

Sind zwei Ereignisse voneinander abhängig, dann berechnet sich die Wahrscheinlichkeit wie folgt:

* $p(A)$ ... Wahrscheinlichkeit, dass Ereigniss $A$ eintritt.
* $p(B|A) = \frac{p(A \cap B)}{p(A)}$ ... **bedingte** Wahrscheinlichkeit, dass Ereignis $B$ eintritt, falls $A$ eingetreten ist

### Beispiel

Wir haben einen Sack in dem 35 rote Kugeln, 35 grüne Kugeln, 20 rote Würfel und 10 grüne Würfel enthalten sind. Wenn ich einen Würfel ziehe, wie groß ist die Wahrscheinlichkeit, dass dieser grün ist?

$$p(\text{Grün|Würfel}) =
  \frac{p(\text{Grün} \cap \text{Würfel})}{p(\text{Würfel})} =
  \frac{0.10}{0.30} = 0.3\dot3$$

Wie groß ist die Wahrscheinlichkeit, dass ich einen Würfel gezogen habe, wenn das Objekt grün ist?

$$p(\text{Würfel|Grün}) =
  \frac{p(\text{Würfel} \cap \text{Grün})}{p(\text{Grün})} =
  \frac{0.10}{0.45} = 0.2\dot2$$


## Marginal- bzw. Randverteilung

Als Marginalverteilung bzeichnet man eine Verteilung über eine Teilmenge von Zufallsvariablen. Am einfachsten anhand eines Beispiels zu erklären. Nehmen wir an, es wird eine medizinische Studie mit $N=1000$ Teilnehmer*innen zur Wirksamkeit eines Testes auf eine bestimmte Krankheit durchgeführt. Folgende Tabelle gibt Auskunft über das Ergebnis, "Test positiv" heißt, dass der Test vermeintlich eine Krankheit identifiziert hat, "Test negativ", dass der Test nichts gefunden hat. Die Summenwerte für Spalten/Zeilen nennt man in diesem Kontext auch Randhäufigkeit.

               Test positiv Test negativ Randhäufigkeit
-------------- ------------ ------------ --------------
Krank          90           10           100
Gesund         100          800          900
Randhäufigkeit 190          810          1000
-------------- ------------ ------------ --------------

In relativen Wahrscheinlichkeitswerten ausgedrückt, sieht die Tabelle so aus:

                   Test positiv Test negativ Marginalverteilung
------------------ ------------ ------------ ------------------
Krank              9%           1%           10%
Gesund             10%          80%          90%
Marginalverteilung 19%          81%          100%
------------------ ------------ ------------ ------------------

Die Marginalverteilung lässt sich als Summe aus den Werten im Kern berechnen, zum Beispiel:
$$\begin{aligned}
p(Krank) &= \sum_{Testergebnis,Krank}{p(Gesundheit \cap Testergebnis)} \\
&= p(Krank \cap Positiv) + p(Krank \cap Negativ) \\
&= 0.09 + 0.01 \\
&= 0.1
\end{aligned}$$

Achtung: da die beiden Variable (Gesundheit & Testergebnis) **nicht** unabhängig voneinander sind, können die einzelnen Werte $p(Gesundheit \cap Testergebnis)$ nicht einfach als Multiplikation der beiden Marginalwahrscheinlichkeiten errechnet werden.


## Mittelwert, Standardabweichung, Varianz und Stichproben

In der Statistik muss bei einigen Berechnungen zwischen der Gesamtpopulation und einer Stichprobe aus der Gesamtpopulation unterschieden werden. Folgende Formeln gelten für Mittelwert, Varianz und Standardabweichung:

           Gesamtpopulation                                  Stichprobe                                          R-Funktion
---------- ------------------------------------------------- --------------------------------------------------- -----------------------------------
Anzahl     N                                                 n
Mittelwert $\mu = \frac 1 N \sum_{i=1}^N x_i$                $\bar x = \frac 1 n \sum_{i=1}^n x_i$               `mean(x)`
Varianz    $\sigma^2 = \frac 1 N \sum_{i=1}^N (x_i - \mu)^2$ $s^2 = \frac 1 {n-1} \sum_{i=1}^n (x_i - \bar x)^2$ `sd(x)` / `var(x)` (für Stichprobe)
---------- ------------------------------------------------- --------------------------------------------------- -----------------------------------

**Hinweis**: in diesen Unterlagen werden in Folge auch für Stichproben (wir haben es so gut wie nie mit etwas anderes zu tun) für den Mittelwert $\mu$, für die Standardabweichung $\sigma$ und für die Varianz $\sigma^2$ verwendet.


## Median, Modus und Quantile

Der Median unterteilt die Daten in zwei Teile: 50% sind kleiner als der Median, 50% sind größer als der Median. Verallgemeinert spricht man einem Quantil: $x\%$ der Werte sind kleiner als der Schwellenwert, $1-x\%$ sind größer als der Schwellenwert. Das folgende Beispiel veranschaulicht das anhand einer Zahlenreihe: 25% der Zahlen sind z.B. kleiner als 4.75:

```{r}
# Beispiel: eine Zahlen mit einem Ausreißer (der den Mittelwert stark nach oben zieht)
x = c(2,4,5,6,9,11,15,100)
list(mean = mean(x),
     quantile = quantile(x, c(0.25, 0.5, 0.75)))
```

Bei einer Wahrscheinlichkeitsverteilung gibt es zusätzlich noch einen **Modus**: der Wert mit der größten Wahrscheinlichkeit (der am häufigsten (am wahrscheinlichsten) vorkommende Wert). Das folgende Beispiel zeigt die Quantile 2.5%, 25%, 50% (=Median), 75% und 97.5% (blau strichliert) sowie den Modus (violett):

```{r echo=FALSE}
par(mar=c(2,5,3,0))
curve(dbeta(x,9,2), main="Quantile und Modus einer Wahrscheinlichkeitsverteilung",
      ylim=c(0,4), xlab="", ylab="", frame.plot=FALSE, axes=F)
axis(1)
quan_x = c(0.025, 0.25,0.5,0.75, 0.975)
quan = qbeta(quan_x, 9, 2)
x = seq(quan[1], quan[5], length.out = 50)
polygon(c(x[1],x,x[50]),c(0, dbeta(x,9,2), 0), col="lightcyan2", border = NA)
x2 = seq(quan[2], quan[4], length.out = 30)
polygon(c(x2[1],x2,x2[30]),c(0, dbeta(x2,9,2), 0), col="lightcyan", border = NA)
lines(x, dbeta(x,9,2))
abline(v=quan, col="blue", lty=2)
text(quan, 3, labels=quan_x*100, adj=c(-0.2,0))
arrows(quan[1], .7, quan[5], length = .1, code = 3)
arrows(quan[2], 1.2, quan[4], length = .1, code = 3)
text(.8, .8, "95%")
text(.8, 1.3, "50%")
abline(v=0.89, col="purple2")
text(.89, 3.95, "Modus", col="purple2", adj=c(1.05,0))
```


## Z-Transformation (Fisher)

Die Z-Transformation (bzw. auch Fisher-Transformation) einer Datenreihe wird wie folgt berechnet:

$$z_i = \frac {x_i - \mu} {\sigma}$$
... mit $\mu = mean(x)$ und $\sigma = sd(x)$. Die Transformation hat folgende Eigenschaften:

* $mean(z) = 0$ und $sd(z) = 1$
* Histogramm verändert nicht die Form (nur Skala ändert sich)
* Scatterplot mit anderer Variable verändert nicht die Form (nur Skala der Achse ändert sich)
* Korrelation mit anderer Variable ändert sich nicht. D.h. $cor(x, y) = cor(z, y)$.
* Die inverse z-Transformation ist $x_i = z_i \sigma + \mu$ (ergibt sich aus Umformung)
* Da viele natürliche Maße normalverteilt sind, sind z-Werte größer 3 recht selten (nur 0.27% Wahrscheinlichkeitsmasse liegt bei der Normalverteilung im Bereich $|z|>3$, d.h. bei einer Reihe mit 1000 Zahlen erwarten wir nur ca. 2-3 Zahlen mit $|z|>3$)

## Zentraler Grenzwertsatz

Der Zentrale Grenzwertsatz sagt aus, dass der Mittelwert einer großen Zahl von unabhängigen Stichproben aus einer Gesamtpopulation einer Normalverteilung um den tatsächlichen Mittelwert der Population folgt. Egal welche Verteilung die Population selbst hat!

Ein Beispiel soll das illustrieren: gehen wir von einer stark von der Normalverteilung abweichenden Verteilung aus, wie z.B. der Gamma-Verteilung:

```{r echo=FALSE}
par(mar=c(2,5,4,0))
curve(dgamma(x,1.5),-1,10, col="blue", lwd=2, frame.plot=FALSE,
      xlab="", main="Population: Gammaverteilung")
```

Nehmen wir nun 5000x eine Stichprobe mit jeweils 200 Werten und berechnen den Mittelwert jeder Stichprobe. Dann entspricht das Histogramm einer Normalverteilung (rot eingezeichnet), der echte Mittelwert der Population ist also $1.5 \pm 0.087 sd$:

```{r echo=FALSE}
# sapply(X,f) .. Funktion f auf alle Werte in X anwenden, weitere Parameter werden an f übergeben
# rep(200,5000) .. 5000x die Zahl 200
# d.h. sapply(rep(200,5000),rgamma, shape=1.5) ruft nun 5000x rgamma(200, shape=1.5) auf
# Resultat von rgamma() ist nun in den Spalten
# colMeans() bildet den Mittelwert einer Spalte
mu = colMeans(sapply(rep(200, 5000), rgamma, shape=1.5))

histogram = hist(mu, plot=FALSE, breaks=30)
plot(histogram$mids, histogram$density, type="h",
     lwd=4, col="darkblue", frame.plot=FALSE,
     xlab="Mittelwert", ylab="", main="Mittelwerte der Stichproben")
curve(dnorm(x,mean(mu),sd(mu)),1.22,1.82,col="red",add=TRUE, lwd=2)
```


\pagebreak
# Lineare Regression

Am Beispiel des Körpermaß-Datensatzes wollen wir uns die lineare Regression in **R** ein wenig näher ansehen.

## Grafische Inspektion

### Datensatz

```{r}
# Daten von: Heinz et al.: Exploring Relationships in Body Dimensions,
#                          Journal of Statistics Education Volume 11, Number 2 (2003)
# http://ww2.amstat.org/publications/jse/v11n2/datasets.heinz.html
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)

# reduzieren der Daten auf verwendete Spalten
body = body[, c('Weight', 'Height', 'Age', 'Gender')]
summary(body)
```


### Histogramm der metrischen Variablen

```{r echo=FALSE}
par(mfrow=c(1,3))
hist(body$Weight,  col="lightgreen", breaks=8, main="Gewicht (kg)")
hist(body$Height, col="lightgreen", breaks=8, main="Größe (cm)")
hist(body$Age, col="lightgreen", breaks=8, main="Alter (Jahren)")
```

### Scatterplot

Wir interessieren uns für das Verhältnis zwischen dem Gewicht und der Körpergröße. Dafür können wir einen Scatterplot zeichnen, der die beiden Variable jeweils einer Achse des Diagramms zuweist:

```{r echo=FALSE}
plot(body$Height, body$Weight, ylab="Gewicht (kg)", xlab="Größe (cm)", main="Gewicht vs. Körpergröße")
```

## Lineares Regressionsmodell

Lineare Regression liefert jene Linie (Schnittpunkt und Steigung), welche den geringsten Abstand zu allen Punkten im Scatterplot hat. Als Beispiel wollen wir bestimmen, wie das Gewicht einer Person mit ihrer Körpergröße zusammenhängt.

```{r}
# lm() rechnet die lineare Regression
# ("lm" steht für "linear model")
model = lm(Weight ~ Height, data=body)
summary(model)
```

**Interpretation**: *Estimate* für Steigung bei *Height* ist 1.02 mit Standardfehler +/- 0.04. D.h. jeder zusätzliche Zentimeter Körpergröße verändert das Gewicht im Schnitt um 1.02 Kilogramm. Dieser Koeffizient ist statistisch signifikant mit $Pr(>|t|) < 0.001$.

> Signifikanz mit p-Werten wird meist wie folgt eingestuft: statistisch signifikant ab $p < 0.05$ (wird mit "\*" markiert), $p < 0.01$ (wird mit "\*\*" markiert) und sehr signifikant ab $p < 0.001$ (wird mit "\*\*\*" markiert.). Die p-Werte täuschen eine Genauigkeit vor, die so nicht existiert, und, obwohl immer noch weit verbreitet, inzwischen zunehmend in Verruf geraten.

Das *Multiple R-squared* gibt an, wieviel der Varianz des Gewichts durch die Körpergröße erklärbar ist, hier $R^2 = 0.51$ und $adj R^2 = 0.51$, d.h. die Körpergröße erklärt 51% der Streuung/Varianz des Gewichts.


### Residuen

Der Scatterplot veranschaulicht die Regressionslinie und die **Residuen** (Abstand zur Regressionslinie), welche minimiert werden (Plot für Lesbarkeit auf 20 Punkte reduziert):

```{r echo=FALSE}
# Wir nehmen nur die Datensätze 210-235, um den Plot lesbar zu machen
body20 = body[1:20, ]

# Scatterplot + Regressionsgerade
plot(body20$Height, body20$Weight, ylab="Gewicht (kg)", xlab="Körpergröße (cm)", main="Gewicht vs. Größe")
abline(model, col="darkblue")

# Einzeichnen der Residuen (Abstände zur Regressionlinie)
modelCoef <- coef(model)
for (i in 1:nrow(body20)) {
  x <- body20[i, "Height"]
  y <- body20[i, "Weight"]
  arrows(x, y,  # y: tatsächliches Gewicht
         x, modelCoef[1]+modelCoef[2]*x, # Linien-Formel für errechneten Wert
         col="orange3", length=0.1)
}
```

### Standardfehler der Koeffizienten

Die Koeffizienten haben alle einen Standardfehler, d.h. sie sind keine punktgenauen Ergebnisse, sondern -- wenn von der Stichprobe auf die Gesamtpopulation geschlossen wird -- unterliegen die Koeffizienten noch einer gewissen Schwankungsbreite. Das folgende Diagramm veranschaulicht mögliche Schwankungen (hellblau):

```{r echo=FALSE}
plot(body$Height, body$Weight,
     ylab="Gewicht (kg)", xlab="Körpergröße (cm)", main="Mögliche Regressionsgeraden")
xrange = par("usr")[1:2]
height_seq = seq(xrange[1],xrange[2],len=100)
pred = predict(model, new=data.frame(Height=height_seq), interval="conf")
polygon(c(height_seq, rev(height_seq)),
        c(pred[,"lwr"], rev(pred[,"upr"])),
        border=NA, col='skyblue')
points(body$Height, body$Weight, pch=1)
abline(model, col="darkblue", lwd=3)
```

**Interpretation**: die Punktwerte der Koeffizienten `-105` und `1.02` gelten für die aktuell vorliegende Stichprobe. Es gibt **keine** andere Gerade, welche geringere (quadratische) Abstände zu den vorliegenden 507 Punkten hat. Was genau sagt also der Standardfehler ("*Std. Error*") bei den Werten aus?

Dem Standardfehler liegt die Annahme zugrunde, dass die 507 Personen eine *Stichprobe* einer größeren Gesamtpopulation sind. Würden wir *dieselbe* Messung an einer anderen Stichprobe von Personen durchführen, erhielten wir mit Sicherheit andere Werte für die beiden Koeffizienten (*Intercept* und *Height*). Der Standardfehler ist die (aus der vorliegenden Stichprobe hochgerechnete) Standardabweichung dieser Koeffizienten. (-> Vergleichbar mit zentralem Grenzwertsatz: dort weicht der Mittelwert einer Stichprobe auch um den echten Mittelwert der Population ab.)

Typischerweise wird ein 95%-Konfidenz-Intervall angegeben (ca. +/- 2*Standardfehler). R bietet uns dafür die passende Funktion an:

```{r}
confint(model)
```

Die Bedeutung und Interpretation eines Konfidenz-Intervalls ist extrem tükisch. Wir werden darauf später noch genauer eingehen. Wenn das Konfidenz-Intervall den Null-Wert **nicht** einschließt, dann ist der Koeffizient **statistisch signifikant**. Genau das sagt auch `Pr(>|t|)` aus: wenn der echte Wert des Koeffizienten in der Gesamtpopulation gleich Null wäre, wie groß ist dann die Chance, die vorliegenden Daten der Stichprobe (oder extremere) erhalten zu haben? In unserem Beispiel: nahezu 0% Chance für den *Height*-Koeffizienten und ebenfalls 0% Chance für den *Intercept*.


## Vorhersage (Prediction) von Werten

Wenn wir die Regressionsgerade haben, dann können wir in Folge auch für beliebige neue Werte den Zielwert vorhersagen, indem wir die Geradengleichung anwenden:

```{r}
# Koeffizienten des Modells
modelCoef = coef(model)
# Neuer Punkt
new.height = 172
# Vorhersage (ignorieren Sie die "Intercept"-Überschrift)
modelCoef[1] + modelCoef[2]*new.height
```

R bietet auch eine Funktion, um die Vorhersage automatisch zu berechnen:

```{r}
predict(model, newdata=list(Height = 172))

# und mit Angabe des Konfidenz-Intervalls:
# "lwr" ... lower bound (2.5%)
# "upr" ... upper bound (97.5%)
predict(model, newdata=list(Height = 172), interval="confidence")
```


## Z-Transformation

Werden die Variablen z-skaliert ändern sich auch die Koeffizienten. Bei der einfachen Regression $y \sim \alpha + \beta x$ ändern sich die Koeffizienten $\beta$ bei der z-Transformation von $y$ und $x$ wie folgt: $\beta_z = \beta \frac {\sigma_x} {\sigma_y}$ bzw. die inverse Transformation: $\beta = \beta_z \frac {\sigma_y} {\sigma_x}$.  Bei nominalen Variablen gibt es kein $\sigma_x$, d.h. dort vereinfachen sich die Formeln zu $\beta_z = \beta \frac 1 {\sigma_y}$ und $\beta = \beta_z \sigma_y$. Den Intercept berücksichtigen wir nicht weiter: wenn alle $x$ numerisch sind, dann ist der Intercept $\alpha=0$.

Am Beispiel eines Regressionsmodells mit einer numerischen und einer nominalen Variable:

```{r}
model2 = lm(Weight ~ Gender + Height, data=body)
coef(model2)

# Wir erwarten daher folgende Koeffizienten für transformierte Variable:
sd_y = sd(body$Weight)
sd_x = sd(body$Height)
beta_z_gender = coef(model2)["GenderMale"] / sd_y
beta_z_height = coef(model2)["Height"] / sd_y * sd_x
c(beta_z_gender, beta_z_height)

# Regression mit z-transformierten Variablen:
body$Weight.z = zscale(body$Weight)
body$Height.z = zscale(body$Height)
model2_z = lm(Weight.z ~ Gender + Height.z, data=body)
# Anm.: Intercept != 0, da wir nominale Variable "Gender" haben
coef(model2_z)
```

Interpretation: bei zwei Personen, die sich nur in ihrer Größe unterscheiden (ansonsten identisch sind), ändert sich das Gewicht je Standardabweichung in der Größe (`r round(sd_x,1)`cm) um 0.5 Standardabweichungen (also um 0.5 * `r round(sd_y,1)` = `r round(sd_y*beta_z_height,1)`kg). Ein Mann ist bei sonst gleichen Eigenschaften um 0.63 Standardabweichungen schwerer als eine Frau (also um 0.63 * `r round(sd_y,1)` = `r round(0.63*sd_y,1)`kg).
