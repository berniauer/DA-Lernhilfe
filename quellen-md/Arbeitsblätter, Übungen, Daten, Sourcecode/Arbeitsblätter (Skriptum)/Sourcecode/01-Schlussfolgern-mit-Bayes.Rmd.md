<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Sourcecode/01-Schlussfolgern-mit-Bayes.Rmd (R Markdown, Code-Chunks = ```{r}) -->

---
title: "Satz von Bayes"
author: "Arno Hollosi"
lang: de
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
library(daatools)
knitr::opts_chunk$set(echo = TRUE, fig.width=7, fig.height=3.8)
```

# Bayes Formel

Wir haben mit der bedingten Wahrscheinlichkeit $p(A|B) = \frac{p(A \cap B)}{p(B)}$ und der kommutativen Eigenschaft $p(A \cap B) = p(B \cap A)$ bereits die notwendigen Grundlagen für den **Satz von Bayes**:

$$p(A|B) = \frac{p(B|A) \times p(A)}{p(B)}$$

(Ergibt sich durch Einsetzen und Umformen der obigen Formeln.)

Wir sind nun in der Lage, bedingte Wahrscheinlichkeiten von anderen abzuleiten!


## Beispiel: Test auf Krankheit

Greifen wir nochmal das Beispiel aus dem Grundlagen-Auffrischungsarbeitsblatt auf:

> Ein Test identifiziert die Krankheit zu 90% falls sie vorhanden ist
> und zu 5% werden Gesunde als krank eingestuft.
> Die Krankheit tritt nur bei 1% der Population auf.
> Wie wahrscheinlich ist dann jemand bei positivem Test wirklich krank?

Dieser Text beschreibt bedingte Wahrscheinlichkeiten: **wenn** jemand krank ist (Bedingung), wie wahrscheinlich zeigt der Test dann ein positives Ergebnis (identifziert also die Krankheit richtig)? Antwort: 90%. Formulieren wir den Text als Wahrscheinlichkeiten:

```{r}
p_positiv_wenn_krank  = 0.9      # p(positiv|krank)
p_positiv_wenn_gesund = 0.05     # p(positiv|gesund)
p_krank = 0.01                   # p(krank)
p_gesund = 1 - p_krank           # ergibt sich automatisch
```

Wir können uns also ausrechnen, wie hoch die Wahrscheinlichkeit ist, dass ein Test positiv ausfällt:

```{r}
p_positiv = p_positiv_wenn_krank * p_krank +
            p_positiv_wenn_gesund * p_gesund
```

Nun können wir die Frage beantworten, wie wahrscheinlich jemand bei positivem Test wirklich krank ist. Wir verwenden dazu die Formel von Bayes:

```{r}
# p(A|B) = p(B|A) * p(A) / p(B)
p_krank_wenn_positiv = p_positiv_wenn_krank * p_krank / p_positiv
p_krank_wenn_positiv
```

Nur 1 von 7 positiv getesten Personen hat die Krankheit wirklich!

Sie können sich von der Richtigkeit dieses Werts überzeugen, wenn Sie dieselbe Rechnung anstatt mit Wahrscheinlichkeiten mit Personen rechnen:

```{r}
# Population in Österreich
pop = 8000000
# davon gesund (99%) bzw. krank (1%)
pop_krank = pop * 0.01
pop_gesund = pop * (1 - 0.01)
# bei den Kranken hat der Test 0.9 Chance
pop_positiv_wenn_krank = pop_krank * 0.9
# Gesunde werden zu 5% falsch identifiziert
pop_positiv_wenn_gesund = pop_gesund * 0.05
# Summe der positiven Tests
pop_positiv = pop_positiv_wenn_krank + pop_positiv_wenn_gesund
# Anteil der wirklich Kranken
pop_positiv_wenn_krank / pop_positiv
```


# Bayessche Schlussfolgerung

In der Forschung wird häufig von Messreihen auf Parameter-Werte in einem Modell geschlossen. In unserem Kontext zum Beispiel: Wie groß ist die Wahrscheinlichkeit, dass bei einer Münze $\theta = 0.75$ ist, wenn wir die Serie $\Bbb Y = \{0,1,1,1,0\}$ an Münzwürfen sehen? Diese Art der Fragestellung ist der **Kern** aller wissenschaftlicher Forschung. Anders formuliert: was können wir über $\theta$ -- unseren zu untersuchenden Modellparameter -- sagen, wenn wir eine Messreihe (Menge $\Bbb Y$) vorliegen haben? Der Satz von Bayes gibt Auskunft:

$$p(\theta|\Bbb Y) = \frac{p(\Bbb Y|\theta) \times p(\theta)}{p(\Bbb Y)}$$

Was bedeuten die einzelnen Teile der Gleichung in diesem Zusammenhang?

* $p(\theta|\Bbb Y)$ ... **Posterior**, Wahrscheinlichkeit für unser Modell ($\theta$) wenn die Daten ($\Bbb Y$) miteinbezogen werden
* $p(\Bbb Y|\theta)$ ... **Likelihood**, Maß dafür, wie gut bestimmte Modellannahmen zu den beobachteten Daten passen.
* $p(\theta)$ ... **Prior**, Vorwissen/Annahme über die Wahrscheinlichkeit, dass unser Modell (und die Modellparameter) stimmen
* $p(\Bbb Y)$ ... **Evidenz**, Normierungsfaktor

In Bayesscher Statistik gehen wir also immer von einem Vorwissen/einer Annahme aus und korrigieren/erweitern unser Wissen anhand der Daten der Messreihe. Effektiv werden dadurch Wahrscheinlichkeiten für die Modellparameter (hier: $\theta$) verteilt bzw. neu gewichtet.

## Beispiel: Filmkritik

Angenommen, wir wollen überprüfen, wie gut ein Film beim Publikum ankommt. Wir zeigen den Film im Rahmen einer Versuchsreihe 50 Personen. Wir selbst sind sehr überzeugt, dass der Film Anklang findet: unsere Freund*innen haben ihn alle sehr gut gefunden :o)

Unser Prior $p(\theta)$ (Vorwissen) könnte z.B. also so aussehen (0=Film gefällt nicht, 1=Film gefällt gut):

```{r echo=FALSE, fig.height=4}
kritik = seq(0, 1, 0.01)
pKritik = dbeta(kritik, 12, 2)
pKritik = pKritik / sum(pKritik) # normieren auf Sum=1
plot(kritik, pKritik, type="h",
     frame.plot=FALSE, main="Prior (Filmkritik)",
     ylab="p(Kritk)", xlab="Kritik",
     ylim=c(0,max(pKritik)), cex.lab=1.2, col="steelblue")
```

Nach der Vorstellung befragen wir das Publikum mit einer einfachen Ja/Nein-Frage: hat euch der Film gefallen? Von den 50 Personen erhalten wir 30x ein Ja, 20x ein Nein. Für sich alleine, ergibt das eine Likelihood $p(\Bbb Y|\theta)$, die so aussieht (das Maximum ist genau bei $30 \div 50 = 0.6$):


```{r echo=FALSE}
publikum = dbinom(30, size=50, prob=kritik)
plot(kritik, publikum,
     col="steelblue",
     type="h", cex.lab=1.2, frame.plot=FALSE,
     main="Likelihood der Publikumsantworten",
     xlab="Kritik",
     ylab=bquote("p(Y|"*theta*")"))
```

Nach Anwenden der Bayes-Regel entsteht unser neues, aktualisiertes Wissen über die Qualität des Films. Der Posterior kombiniert Vorwissen (Prior) und Daten (bzw. genauer: die daraus abgeleitete Likelihood). Das Ergebnis sieht so aus:


```{r echo=FALSE}
prior = pKritik
likelihood = publikum
posterior = prior * likelihood
posterior = posterior / sum(posterior) # Normieren auf 1
plot(kritik, posterior, type="h",
     frame.plot=FALSE, main="Posterior (Filmkritik)",
     ylab=bquote("p("*theta*"|Y)"),
     xlab="Kritik",
     cex.lab=1.2, col="steelblue")
```

Zwei Punkte fallen auf: (1) im Vergleich zur Likelihood hat sich das Ergebnis wegen unserem Prior etwas nach rechts verschoben; (2) das Intervall ist enger geworden. Der Grund dafür ist, dass wir mehr Daten haben: Publikum + Vorwissen (Freunde) lassen eine genauere Bestimmung zu.

Würden wir eine weitere Probevorstellung des Films geben und dort wären z.B. 100 Personen, von denen wir 80x Ja und 20x Nein erhalten, dann könnten wir den Posterior von oben nun als Vorwissen nützen und mit den neuen Daten aktualisieren. Das Ergebnis sähe dann wie folgt aus:

```{r echo=FALSE}
prior2 = posterior # Vorwissen ist nun Ergebnis von oben 
publikum2 = dbinom(80, size=100, prob=kritik)
likelihood2 = publikum2
posterior2 = prior2 * likelihood2
posterior2 = posterior2 / sum(posterior2) # Normieren auf 1
plot(kritik, posterior2, type="h",
     frame.plot=FALSE, main="Posterior (nach 2. Vorführung)",
     ylab=bquote("p("*theta*"|Y)"),
     xlab="Kritik",
     cex.lab=1.2, col="steelblue")
```

Die 2. Vorstellung alleine hätte eine Kritik von 0.8 ($80_{(ja)} \div 100_{(gesamt)} = 0.8$). Wegen unseres Vorwissens (der Posterior nach der ersten Vorstellung) ist nun der Modus (=max. Wert) bei $0.75$. Wieder greift dasselbe Prinzip der Bayes-Regel, dass wir alles Wissen (Freunde, 1. Vorstellung, 2. Vorstellung) in das Ergebnis haben einfließen lassen und so zu einem besseren Ergebnis kommen, als wenn wir nur die 2. Vorstellung alleine betrachten.

Das Beispiel zeigt auch, dass wir mit Bayesscher Statistik nicht nur Punktwerte für Koeffizienten oder Intervalle angeben können, sondern gleich eine komplette Wahrscheinlichkeitsverteilungen.

## Ergebnis beliebig?

Eine Frage, die sich in diesem Zusammenhang aufdrängt: können wir also jedes beliebige Ergebnis erzeugen bzw. erzwingen? Wenn wir bspw. unser Vorwissen nur "stark genug" machen? Aus mathematischer Sicht: ja. Aus praktischer Sicht: nein. Mathematisch brauchen wir unseren Prior nur eng genug machen, so dass er jede Likelihood der Messreihe dominiert. Wir wollen, dass ein Medikament die Zulassung besteht? Einfach den passenden Prior wählen!

In der Praxis muss man die Wahl des Priors rechtfertigen. Zudem werden meist nur **schwach-informative Priors** verwendet. Deren Aufgabe ist nicht das Ergebnis stark zu beeinflussen, sondern unmögliche Werte auszuschließen und so die Berechnung stabiler zu machen. Beispiel: Körpergröße liegt bei Erwachsenen zu 95% im Bereich 150..194cm. Kein erwachsener Mensch war je 35cm klein oder 350cm groß. Das könnten wir als Prior für Körpergröße verwenden.


# Zusammenfassung

Die Bayes-Formel eröffnet uns das Tor zu einer neuen Statistikwelt. Mit ihr wird es möglich, direkt von Daten auf das Modell zu schließen ($p(\theta|\Bbb Y)$). Wir erkaufen uns diesen Vorteil durch die Einführung eines Priors. Die Wahl des Priors muss fachlich gut begründet sein, anderenfalls können starke Prior-Verteilungen zu falschen Schlüssen führen. Ein weiterer Nachteil ist, dass wir für realistische Aufgabenstellung ein Vielfaches der Rechenpower der frequentistischen Statistik benötigen.

Als Ergebnis erhalten wir für die gesuchten Modellparameter nicht nur Werte oder Konfidenzintervalle sondern eine vollständige Wahrscheinlichkeitsverteilung, den Posterior.
