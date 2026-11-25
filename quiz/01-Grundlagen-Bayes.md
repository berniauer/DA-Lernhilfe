# Quiz 01: Grundlagen & Bayes

> Zugehöriges Kapitel: [kapitel/01-Bayes-Schlussfolgern.md](../kapitel/01-Bayes-Schlussfolgern.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Prior</b></summary>

Verteilung, die das Wissen bzw. die Annahme über einen Parameter θ VOR Betrachtung der Daten beschreibt.

</details>

<details><summary><b>Likelihood</b></summary>

p(Daten | θ): wie gut die beobachteten Daten zu einem bestimmten Parameterwert passen.

</details>

<details><summary><b>Posterior</b></summary>

p(θ | Daten): aktualisierte Verteilung des Parameters nach den Daten; kombiniert Prior und Likelihood (Posterior ∝ Likelihood × Prior).

</details>

<details><summary><b>Evidenz p(Y)</b></summary>

Normierungskonstante im Satz von Bayes, damit der Posterior sich zu 1 summiert.

</details>

<details><summary><b>Basisrate</b></summary>

Grundhäufigkeit eines Ereignisses (z. B. 1 % krank). Bestimmt stark, wie viel ein positiver Test bedeutet.

</details>

<details><summary><b>Satz von Bayes</b></summary>

p(A|B) = p(B|A)·p(A) / p(B)

</details>

<details><summary><b>Schwach-informativer Prior</b></summary>

Prior, der unplausible Werte ausschließt und die Berechnung stabilisiert, aber das Ergebnis kaum beeinflusst (rstanarm-Default normal(0, 2.5) auf z-Skala).

</details>

<details><summary><b>Prozentpunkte vs. Prozent</b></summary>

10 % → 15 % sind +5 Prozentpunkte, aber +50 %.

</details>

<details><summary><b>z-Transformation</b></summary>

z = (x − Mittelwert)/SD → Mittelwert 0, SD 1; macht Variablen vergleichbar.

</details>

<details><summary><b>Zentrieren</b></summary>

Einen Referenzwert (oft den Mittelwert) abziehen, damit x = 0 ein sinnvoller Basisfall wird.

</details>

<details><summary><b>pnorm / qnorm</b></summary>

pnorm(x) = P(X ≤ x) (Verteilungsfunktion); qnorm(p) = Quantil (Umkehrung), z. B. qnorm(0.975) ≈ 1.96.

</details>

<details><summary><b>p-Wert</b></summary>

Wahrscheinlichkeit, solche oder extremere Daten zu beobachten, WENN die Nullhypothese stimmt. Nicht: Wahrscheinlichkeit, dass die Hypothese stimmt.

</details>

## Teil 2: Multiple Choice

**1. Ein Test erkennt 90 % der Kranken, schlägt bei 5 % der Gesunden falsch an, 1 % sind krank. Wie groß ist p(krank | positiv) ungefähr?**

- A) 90 %
- B) 50 %
- C) 15 %
- D) 1 %

<details><summary>Lösung</summary>

**C) 15 %**: 0.9·0.01 / (0.9·0.01 + 0.05·0.99) = 0.009/0.0585 ≈ 0.154. Die niedrige Basisrate dominiert.

</details>

**2. Was passiert mit dem Anteil echter Alarme, wenn die Basisrate (Defektquote) steigt, die Prüfmaschine aber gleich bleibt?**

- A) Er sinkt
- B) Er steigt
- C) Er bleibt gleich
- D) Er wird 50 %

<details><summary>Lösung</summary>

**B) Er steigt**: Mehr echte Defekte → mehr TP relativ zu FP → p(defekt|Alarm) steigt.

</details>

**3. 80 % von 20 Befragten stimmen zu. Ein starker Prior liegt bei 50 %. Wo liegt der Posterior-Modus typischerweise?**

- A) genau bei 80 %
- B) zwischen 50 % und 80 %
- C) genau bei 50 %
- D) über 80 %

<details><summary>Lösung</summary>

**B) zwischen 50 % und 80 %**: Der Posterior ist ein Kompromiss aus Prior und Likelihood; bei wenigen Daten hat der Prior Gewicht.

</details>

**4. Man verwendet den Posterior als Prior und füttert DIESELBEN 50 Antworten noch einmal ein. Was ist richtig?**

- A) Das ist ein legitimes Update
- B) Das Intervall wird enger, aber es täuscht Präzision vor – keine neue Information
- C) Der Posterior bleibt unverändert
- D) Das Intervall wird breiter

<details><summary>Lösung</summary>

**B) Das Intervall wird enger, aber es täuscht Präzision vor – keine neue Information**: Daten doppelt zu verwenden erzeugt falsche Sicherheit (Verständnisaufgabe 03).

</details>

**5. Welche Aussage über Priors ist korrekt?**

- A) Priors dürfen nach dem gewünschten Ergebnis gewählt werden
- B) Priors müssen fachlich begründet sein; in der LV werden schwach-informative Defaults verwendet
- C) Priors haben nie Einfluss
- D) Bayes funktioniert ohne Prior

<details><summary>Lösung</summary>

**B) Priors müssen fachlich begründet sein; in der LV werden schwach-informative Defaults verwendet**: Ein Prior ist eine Modellannahme, die man rechtfertigen muss.

</details>

**6. Eine Quote steigt von 20 % auf 30 %. Wie lautet die korrekte Beschreibung?**

- A) +10 %
- B) +10 Prozentpunkte bzw. +50 %
- C) +50 Prozentpunkte
- D) +30 %

<details><summary>Lösung</summary>

**B) +10 Prozentpunkte bzw. +50 %**: Differenz 10 Prozentpunkte; relativ 10/20 = +50 %.

</details>

**7. Was beschreibt der Posterior im Unterschied zum frequentistischen p-Wert?**

- A) p(Daten | Hypothese)
- B) p(Parameter | Daten)
- C) die Stichprobengröße
- D) die Likelihood allein

<details><summary>Lösung</summary>

**B) p(Parameter | Daten)**: Bayes liefert direkt eine Verteilung über plausible Parameterwerte gegeben die Daten.

</details>

**8. Etwa welcher Anteil einer Normalverteilung liegt innerhalb ±2 SD?**

- A) 68 %
- B) 95 %
- C) 99.7 %
- D) 50 %

<details><summary>Lösung</summary>

**B) 95 %**: Faustregel 68–95–99.7.

</details>
