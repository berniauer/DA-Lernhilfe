# Kapitel 1: Schlussfolgern mit Bayes

> Quelle: Arbeitsblatt 01 „Schlussfolgern mit Bayes“ · Verständnisaufgaben 01–03

## Lernziele
- Satz von Bayes anwenden (Test-/Alarm-Beispiel), Bedeutung der **Basisrate**
- Prior, Likelihood, Posterior, Evidenz erklären
- verstehen, warum der Posterior nicht dem beobachteten Anteil entsprechen muss
- Rolle und Rechtfertigung von Priors; schwach-informative Priors

## 1. Satz von Bayes

$$p(A|B) = \frac{p(B|A)\cdot p(A)}{p(B)}$$

### Beispiel Krankheitstest (aus der LV)
- p(positiv | krank) = 0.90 (Sensitivität)
- p(positiv | gesund) = 0.05 (Fehlalarmrate)
- p(krank) = 0.01 (**Basisrate**)

p(positiv) = 0.9·0.01 + 0.05·0.99 = 0.009 + 0.0495 = 0.0585
**p(krank | positiv) = 0.009 / 0.0585 ≈ 0.154** → nur ca. **1 von 7** positiv Getesteten ist wirklich krank!

**Mit Personen rechnen (natürliche Häufigkeiten)** ist anschaulicher: Von 10 000 Personen sind 100 krank → 90 positiv; 9 900 gesund → 495 positiv. Von 585 Positiven sind 90 krank ≈ 15 %. (Genau Verständnisaufgabe 01.)

**Kernaussage:** Wie viel ein Alarm bedeutet, hängt stark von der **Basisrate** ab. Bei höherer Defektquote in einer Lieferung steigt der Anteil echter Alarme, obwohl die Maschine gleich gut ist.

## 2. Bayessche Schlussfolgerung über Parameter

$$\underbrace{p(\theta|\mathbb{Y})}_{\text{Posterior}} = \frac{\overbrace{p(\mathbb{Y}|\theta)}^{\text{Likelihood}} \cdot \overbrace{p(\theta)}^{\text{Prior}}}{\underbrace{p(\mathbb{Y})}_{\text{Evidenz}}}$$

| Begriff | Bedeutung |
|---|---|
| **θ** | Modellparameter (z. B. Anteil zufriedener Kunden, Regressionskoeffizient) |
| **Prior** p(θ) | Vorwissen/Annahme über θ **vor** den Daten |
| **Likelihood** p(Y\|θ) | Wie gut passen die Daten zu einem bestimmten θ? |
| **Posterior** p(θ\|Y) | aktualisiertes Wissen über θ **nach** den Daten, eine ganze Verteilung |
| **Evidenz** p(Y) | Normierungsfaktor (damit die Summe 1 ist) |

**Frequentistisch** fragt man p(Daten | Hypothese). **Bayes** fragt p(Parameter | Daten). Das ist meist die eigentlich interessante Frage.

### Beispiel Filmkritik (aus der LV)
- Prior: optimistisch (Freund\*innen fanden den Film toll), beta(12, 2).
- Daten: 30 von 50 Personen finden ihn gut → Likelihood-Maximum bei 0.6.
- Posterior: liegt **zwischen** Prior und Likelihood (leicht nach rechts verschoben) und ist **schmaler**, weil mehr Information vorliegt.
- 2. Vorführung (80/100): Posterior von vorher = neuer Prior → Modus ≈ 0.75 statt 0.8.

```r
theta = seq(0, 1, 0.01)
prior = dbeta(theta, 12, 2); prior = prior/sum(prior)
likelihood = dbinom(30, size=50, prob=theta)
posterior = prior * likelihood; posterior = posterior/sum(posterior)
theta[which.max(posterior)]   # Modus
```

## 3. Priors: Macht und Verantwortung
- Mathematisch kann ein sehr enger Prior **jedes** Ergebnis erzwingen. In der Praxis muss ein Prior **fachlich begründet** werden (z. B. frühere vergleichbare Studien).
- Üblich sind **schwach-informative Priors**: Sie schließen unmögliche Werte aus (niemand ist 35 cm oder 350 cm groß) und stabilisieren die Berechnung, ohne das Ergebnis zu dominieren.
- In der LV werden die **Default-Priors von `rstanarm`** verwendet (normal(0, 2.5) auf z-Skala, intern umskaliert). `prior_summary(modell)` zeigt sie.
- Sinnvoll: Ergebnis unter **mehreren vertretbaren Priors** vergleichen (Sensitivitätsanalyse).

## 4. Wichtige Denkfehler (Verständnisaufgaben 02 und 03)
- **„Der Posterior muss 80 % sein, wenn 80 % zugestimmt haben“**: falsch. Der Posterior kombiniert Prior und Likelihood. Bei 20 Personen hat ein starker Prior großes Gewicht.
- **Prior nach Wunschergebnis wählen**: unzulässig.
- **Dieselben Daten zweimal einlesen** (Posterior als Prior, gleiche 50 Antworten nochmal): Das Intervall wird enger, aber es gibt **kein neues Wissen**. Das täuscht falsche Präzision vor. Nur **neue, unabhängige** Daten (andere Personen) rechtfertigen ein Update.

## ⚠️ Typische Fallen
- Sensitivität (p(Alarm|defekt)) mit Vorhersagewert (p(defekt|Alarm)) verwechseln.
- Basisrate ignorieren.
- Glauben, mehr Rechenschritte = mehr Information.

➡️ Quiz: [quiz/01-Grundlagen-Bayes.md](../quiz/01-Grundlagen-Bayes.md)
