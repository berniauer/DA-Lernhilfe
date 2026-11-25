<!-- Quelle: Wiederholung, Downloads und Kurzreferenzen/Voraussetzung (statistisches Basiswissen)/Sourcecode/00b-Wiederholung-Wahrscheinlichkeitsverteilungen.Rmd (R Markdown, Code-Chunks = ```{r}) -->

---
title: 'Wahrscheinlichkeitsverteilungen'
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

# Wahrscheinlichkeitsverteilungen

Es gibt in der Mathematik/Statistik viele Verteilungen, die eine Zahlenreihe annehmen kann. Für uns von besonderem Interesse: uniforme Verteilung, Normalverteilung und Binomialverteilung.

# Uniforme Verteilung

Uniformer Zufall ist das, was man sich gewöhnlich unter Zufall vorstellt: alle Zahlen haben die selbe Wahrscheinlichkeit vorzukommen. Ein Beispiel:

```{r}
# Zufallszahlen mit runif(n, min = 0, max = 1) erzeugen
# Name steht für Random UNIForm
# Wir erzeugen 2000 Zahlen zwischen 0 und 10
x = runif(2000, 0, 10)
hist(x, main="Histogramm: Uniformer Zufall", col="lightgreen", breaks=20, xlab="")
```

Für Wahrscheinlichkeitsverteilungen gibt es auch stetige **Wahrscheinlichkeitsdichtefunktionen**. Beim uniformen Zufall ist das (wie zu erwarten) eine gerade Linie: alle Zahlen haben die selbe Wahrscheinlichkeit, gezogen zu werden:

```{r}
# Dichtefunktion mit dunif(x, min = 0, max = 1) für Punkt x
# Name steht für Density UNIForm
curve(dunif(x, 0, 10), xlim=c(-2,12), col="darkblue", xlab="",
      main="Dichtefunktion uniformen Zufalls (0-10)", frame.plot=FALSE)
```

Die Fläche unter der Kurve ist **1** (schließlich muss sich die Gesamtwahrscheinlichkeit auf 100% summieren).

Wie groß ist die Chance, dass eine Zahl kleiner 2 herauskommt? Die erste Intuition stimmt: 20%.
Wir können das auch mit einer R-Funktion abfragen:

```{r}
# Verteilungsfunktion mit punif(x, min = 0, max = 1) für Werte kleiner x
# Name steht für Probability UNIForm
punif(2, 0, 10)
# Wir können auch einen ganzen Graphen zeichnen
curve(punif(x, 0, 10), xlim=c(-2,12), col="darkblue", frame.plot=FALSE,
      main="Verteilungsfunktion uniformen Zufalls (0-10)")
```

Aus dem Diagramm sehen wir, dass z.B. Zahlen kleiner 4 mit 40% Wahrscheinlichkeit vorkommen und Zahlen kleiner 9 mit 90% Wahrscheinlichkeit. Ergibt auch Sinn, da ja alle Zahlen gleich häufig vorkommen -- je größer der erlaubte Bereich, umso größer die Summenwahrscheinlichkeit.

Es gibt auch eine inverse Funktion: wenn ich eine Chance von 30% haben will, wo soll die Grenze gezogen werden? Antwort: bei allen Zahlen kleiner 3:

```{r}
# Quantilfunktion mit qunif(p, min = 0, max = 1) für Wahrscheinlichkeit p
# Name steht für Quantile UNIForm
qunif(0.3, 0, 10)
```


# Normalverteilung

Die Normal- oder Gauß-Verteilung ist eine der wichtigsten Wahrscheinlichkeitsverteilungen. Die Abweichungen vieler natur- und wirtschaftswissenschaftlicher Vorgänge vom Mittelwert lassen sich durch die Normalverteilung in sehr guter Näherung beschreiben. Die Normalverteilung ist durch einen Mittelwert $\mu$ und die Standardabweichung $\sigma$ beschrieben:

```{r echo=FALSE}
par(mar=c(2,5,3,0))
curve(dnorm(x,-2,0.5),-4,4, col="red", lwd=2, frame.plot=FALSE,
      ylab="", xlab="", main="Normalverteilung", axes=FALSE)
axis(1)
curve(dnorm(x,0,1),-4,4, col="blue", lwd=2, add=TRUE)
curve(dnorm(x,2,2),-4,4, col="darkgreen", lwd=2, add=TRUE)
text(1.5, 0.7, bquote(paste("N ~ (", mu==-2, ", ", sigma==0.5, ")")), col="red", adj=0)
text(1.5, 0.62, bquote(paste("N ~ (", mu==0, ", ", sigma==1, ")")), col="blue", adj=0)
text(1.5, 0.54, bquote(paste("N ~ (", mu==2, ", ", sigma==2, ")")), col="darkgreen", adj=0)
```

Innerhalb von $\pm 2 \sigma$ liegen 95.45% aller Werte der Normalverteilung, innerhalb von $\pm 3 \sigma$ liegen 99.73%:

```{r echo=FALSE}
par(mar=c(2,2,3,0))
curve(dnorm(x),-3.5,3.5, col="blue", lwd=2, ann=FALSE, axes=FALSE, ylim=c(0,0.42))
axis(1,at=-4:4)
title(main="Normalverteilung (2)")
x = c(-2:2,qnorm(0.75),qnorm(0.25),qnorm(0.05),qnorm(0.95))
points(x,dnorm(x),type="h", lty="dashed")
par(cex=0.75)
for (x in c(-2:2,qnorm(c(0.05,0.25,0.75,0.95)))) {
  text(x, dnorm(x)+0.02, sprintf("%.2f%%", pnorm(x)*100), adj=(1-sign(x))/2)
}
for (x in c(1,2,qnorm(0.75),qnorm(0.95))) {
  arrows(-x,dnorm(-x),x,dnorm(x),code=3, length=0.1)
  text(0.05, dnorm(x)+0.01, sprintf("%.2f%%", (1-pnorm(-x)*2)*100), adj=0)
  sz = signif(x,3)
  text(-0.05, dnorm(x)+0.01, bquote(phantom(0) %+-% .(sz)*sigma), adj=1)
}
```


## Normalverteilte Zufallszahlen

In R können Sie folgende Funktionen verwenden, um die Normalverteilung zu berechnen:

* `rnorm(n, mean = 0, sd = 1)`, um $n$ Zufallswerte entsprechend einer Normalverteilung zu erhalten
* `dnorm(x, mean = 0, sd = 1)`, um den Wert am Punkt x zu berechnen
* `pnorm(p, mean = 0, sd = 1)`, um das Integral (=Anzahl der Werte/Fläche) bis zum  Punkt $p$ zu berechnen
* `qnorm(q, mean = 0, sd = 1)`, um den Punkt zu erhalten, bei dem die Fläche unter der Kurve $q$ entspricht

```{r}
# Zufallszahlen mit rnorm(n, mean = 0, sd = 1) erzeugen
# Name steht für Random NORMal
# Wir erzeugen 2000 Zahlen mit Mittelwert 10 und Std.abweichung 3
x = rnorm(2000, 10, 3)
hist(x, main="Histogramm: Normalverteilter Zufall", xlab="",
     col="lightgreen", breaks=20)

# Dichtefunktion mit dnorm(x, mean = 0, sd = 1) für Punkt x
# Name steht für Density NORMal
# z.B. für eine Zufallsfunktion mit Mittelwert 10 und Std.abweichung 3
curve(dnorm(x, 10, 3), xlim=c(0,20), xlab="", col="darkblue", frame.plot=FALSE,
      main="Dichtefunktion Normalverteilung N(10,3)")
```

Die Fläche (Integral) unter der Kurve ist wieder **1**.

Wie groß ist die Chance, dass eine Zahl kleiner 2 herauskommt?

```{r}
# Verteilungsfunktion mit pnorm(x, mean = 0, sd = 1) für Werte kleiner x
# Name steht für Probability NORMal
pnorm(2, 10, 3)
```

Die Wahrscheinlichkeit, bei der Normalverteilung $N(10,3)$ eine Zahl kleiner 2 zu erhalten ist also 0.3%. Nicht verwunderlich, wenn man bedenkt, dass der Wert über 2.5 Standardabweichungen vom Mittelwert entfernt liegt.

```{r echo=FALSE}
# Wir können auch einen ganzen Graphen zeichnen
curve(pnorm(x, 10, 3), xlim=c(0,20), col="darkblue", frame.plot=FALSE, xlab="",
      main="Verteilungsfunktion Normalverteilung N(10,3)")
```

Aus dem Diagramm sehen wir, dass z.B. Zahlen kleiner 10 mit 50% Wahrscheinlichkeit vorkommen -- der Mittelwert ist also gleichzeitig der Median einer Normalverteilung. (Sollte uns nicht verwundern, da die Funktion symmetrisch ist.)

Inverse Funktion: wenn ich eine Chance von 30% haben will, wo soll die Grenze gezogen werden? Antwort: bei allen Zahlen kleiner 8.43:

```{r}
# Quantilfunktion mit qnorm(p, mean = 0, sd = 1) für Wahrscheinlichkeit p
# Name steht für Quantile NORMal
qnorm(0.3, 10, 3)
```

## Normalverteilung: Zusammenhang mit uniformen Zufall

Die Normalverteilung ist in der Natur häufig anzutreffen, weil sie aus einer Summe zufälliger, kleiner Schritte entsteht. Fast alle Wachstumsprozesse in der Natur sind eine solche Summe kleiner Schritte: z.B. die Körpergröße. Siehe dazu auch Übungsblatt.

Deshalb funktioniert eine Logarithmus-Transformation auch so gut bei multiplikativem Wachstum (bzw. Abhängigkeiten): die Multiplikation wird auf der Logarithmus-Skala zur Addition und die Addition zufälliger Zahlen hat inhärent eine Normalverteilung.


# Binomialverteilung

Die Unterscheidung in zwei Fälle (z.B. Kopf/Zahl bei Münzen) tritt in vielen Forschungsfragen auf und gehört auch zu den Basisaufgabenstellungen der Statistik.

## Bernoulli

Typischerweise weisen wir den beiden Fällen die Zahlen $0$ und $1$ zu. Der zu untersuchende Prozess hat eine bestimmte Tendenz, z.B. zu 70% erhalten wir beim Münzwurf die Kopfseite (zu 70% wirkt ein Medikament, zu 70% ist ein Verkaufsgespräch erfolgreich etc.). Wir geben dieser Tendenz den Wert $\theta$, (Theta) welcher im Bereich $0..1$ liegt. Das führt zu folgender Eigenschaft:

$$ p(y=1|\theta) = \theta$$
$$ p(y=0|\theta) = 1 - \theta$$

Gelesen als: die bedingte Wahrscheinlichkeit ist $\theta$, dass $y=1$ (z.B. Kopfseite) eintritt, wenn die Münze eine "Tendenz" $\theta$ hat. Und: die bedingte Wahrscheinlichkeit ist $1-\theta$, dass $y=0$ (z.B. Zahlseite) eintritt, wenn die Münze eine "Tendenz" $\theta$ hat. Am Beispiel: die bedingte Wahrscheinlichkeit, dass $y=0$ eintritt ist 30% ($1-0.7$), wenn die Münze eine Tendenz von 70% hat.

Fasst man beide Aussagen in einer einzigen Gleichung zusammen, erhält man die **Bernoulli-Gleichung**:
$$p(y|\theta) = \theta^y (1 - \theta)^{(1-y)}$$

Bei $y=1$ ist der zweite Hälfte des Ausdrucks $1$ (kürzt sich weg), da $1-y=0$ (und $(1-\theta)^0=1$), wenn $y=0$, dann ist die erste Hälfte des Ausdrucks $1$ (und kürzt sich weg).

## Reihe von Versuchen

Wenn wir eine Reihe von Untersuchungen machen (d.h. eine Reihe von Münzwürfen), wie groß ist die Wahrscheinlichkeit, dass eine *bestimmte* Abfolge von Zahl- & Kopfseiten auftaucht? 

Jeder Münzwurf ist unabhängig $\to$ die Wahrscheinlichkeiten der einzelnen Würfe multiplizieren sich auf.
Damit ergibt sich aus Wahrscheinlichkeit für einen Münzwurf $p(y|\theta) = \theta^y (1 - \theta)^{(1-y)}$ durch Multiplikation die Wahrscheinlichkeit für eine Serie $\mathbb Y = \{y_0,y_1,y_2...y_n\}$ von $n$ Würfen $p(\mathbb Y|\theta) = \prod_i p(y_i|\theta) = \prod_{i=0}^n{\theta^{y_i} (1 - \theta)^{(1-y_i)}}$. Wenn wir für die Anzahl der geworfenen Kopfseiten $z$ setzen, dann wird daraus durch umformen:

$$p(\mathbb Y|\theta) = \theta^z (1 - \theta)^{(n-z)}$$

### Beispiel

Eine Münze hat $\theta = 0.75$ und wir machen 5 Würfe. Wie groß ist die Wahrscheinlichkeit, dass wir die Serie $\mathbb Y = \{0,1,1,1,0\}$ werfen?

```{r}
N = 5
z = 3
theta = 0.75
theta^z * (1-theta)^(N-z) # = p({0,1,1,1,0}|theta)
```


## Binomial-Verteilung

Die Binomial-Verteilung entsteht, wenn wir ein Experiment, das nur zwei Ausgänge hat, also mit Bernoulli-Verteilung, n-mal wiederholen und dabei die positiven Ergebnisse ($y=1$) zählen, die wir $z$ nennen. Dabei ist uns die Reihenfolge der Würfe egal (jede Permutation möglich). Die Verteilung für $z$ positive Ergebnisse bei $n$ Versuchen mit zu Grunde liegender Tendenz $\theta$ ist dann eine Binomial-Verteilung[^1]:

$$p(z | n, \theta) = \binom nz \theta^z (1 - \theta)^{(n-z)}$$

[^1]: Der Term $\binom nz$ entspricht der Anzahl der Permutationen von $z$ Einsern bei $n$ Zahlen.

R bietet eine einfache Funktion, um zufällige binomial-verteilte Experimente durchzuführen:

```{r}
# 20 ... Anzahl an "Experimenten"
# 10 ... n = Versuche (Münzwürfe) pro Experiment
# 0.7 ... Theta (wie häufig zeigt die Münze Kopf)
# Ergebnis: z = Vektor mit Anzahl der "Kopfseiten" pro Experiment (y=1)
rbinom(20, 10, 0.7)
```

Wie schon bei der Normalverteilung gibt es in R auch hier eine Reihe weiterer Funktionen rund um die Binomial-Verteilung:

- `rbinom(exp, size, prob)`, um $exp$ Experimente mit $size=n$ Versuchen durchzuführen
- `dbinom(x, size, prob)`, um den Wert am Punkt x zu berechnen, $size=n$, $prob=\theta$
- `pbinom(q, size, prob, lower.tail = TRUE)`, um das Integral bis zum  Punkt $q$ zu berechnen
- `qbinom(p, size, prob, lower.tail = TRUE)`, um jenen Punkt zu errechnen, bei dem die Fläche unter der Kurve gleich $p$ ist.

## Beispiel

Eine Klausur mit 20 Multiple-Choice-Fragen, bei denen jede Frage 4 Antworten hat, von denen nur eine richtig ist. Wie hoch ist die Chance, positiv zu sein, wenn zufällig angekreuzt wird? Am häufigsten (Modus) sind 5 Antworten richtig, mehr als 10 Antworten richtig zu haben, hat nur eine Wahrscheinlichkeit von 0.4%.

```{r}
# n ... Anzahl an Fragen
# z ... Anzahl richtiger Antworten
# theta ... Wahrscheinlichkeit richtig zu liegen
n = 20
z = 0:n # Liste der Zahlen 0..n
theta = 0.25 # 1 von 4

# Diagramm erstellen
plot(z, dbinom(z, n, theta), frame.plot=FALSE, main="Chance, #z Fragen richtig zu haben")
abline(v=10.5, lty="dashed")
arrows(10.5,0.18,7.5,0.18,length=0.1)
arrows(10.5,0.18,13.5,0.18,length=0.1)
pKleiner11 = pbinom(10, n, theta) # pbinom ... Summe aller Wahrscheinlichkeiten z < 11
text(9,0.19,sprintf("%.1f%%", 100*pKleiner11))
text(12,0.19,sprintf("%.2f%%", 100*(1-pKleiner11)))
```


# Andere Verteilungen

R kennt auch noch eine Reihe weiterer Verteilungen, einige davon werden wir noch in der LV kennen lernen und verwenden:

- **Student-t-Verteilung**, Funktionen: `rt(), dt(), pt(), qt()`
- **Gammaverteilung**, Funktionen: `rgamma(), dgamma(), pgamma(), qgamma()`
- **Beta-Vertailung**, Funktionen: `rbeta(), dbeta(), pbeta(), qbeta()`
- **Poisson-Verteilung**, Funktionen:  `rpois(), dpois(), ppois(), qpois()`
- **Logistic-Verteilung**, Funktionen:  `rlogis(), dlogis(), plogis(), qlogis()`
- **Cauchy-Verteilung**, Funktionen:  `rcauchy(), dcauchy(), pcauchy(), qcauchy()`
- **Exponentielle Verteilung**, Funktionen: `rexp(), dexp(), pexp(), qexp()`
