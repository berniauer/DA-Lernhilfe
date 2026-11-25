# R-Output lesen 2: Sampling-Diagnose & Diagnoseplots

## `check_sampling(modell)` (daatools)
Prüft automatisch alle Parameter gegen die Grenzwerte und gibt Warnungen aus, z. B.:
```
All Rhat values are below 1.1          ✔
All n_eff values are above 2000         ✔   (sonst: "n_eff low for: x1, x2")
All mcse values are below 5% of mad     ✔
```
Gibt es Warnungen → zuerst Berechnung reparieren (mehr Iterationen `iter=4000`, zentrieren/skalieren, Modell vereinfachen, `adapt_delta` erhöhen bei Divergenzen). **Erst dann** Koeffizienten interpretieren.

## Typische problematische `info`-Zeile
```
             median   mad   lwr   upr  mcse n_eff Rhat
x1            2.31  1.80 -0.90  5.70  0.35    78 1.15
```
→ n_eff 78 (< 400), Rhat 1.15 (> 1.1), mcse 0.35 ≈ 19 % von mad → **Sampling gescheitert**, Werte nicht vertrauenswürdig.

## Traceplot (`mcmc_trace(modell)`)
| Bild | Bedeutung |
|---|---|
| 4 farbige Linien überlagern sich als dichtes „Rauschen“ um ein konstantes Niveau | ✔ gut |
| eine Chain liegt auf anderem Niveau | ✘ Chains nicht konvergiert (Rhat hoch) |
| langsame Wellen/Trends | ✘ hohe Autokorrelation (n_eff niedrig) |

## Diagnoseplots
| Funktion | Gut | Problem |
|---|---|---|
| `diagnose_density(m)` | dunkle Datenkurve liegt im Bündel der hellen Simulationen | Form passt nicht (z. B. Daten schief, Modell symmetrisch → log?) |
| `diagnose_fit(m)` | grüne Linie (echter Wert) jeweils mitten im Histogramm | Linie am Rand oder außerhalb (z. B. min wird nicht reproduziert) |
| `diagnose_y_vs_yhat(m)` | Punkte um die Diagonale | Banane → Nichtlinearität |
| `diagnose_residual(m)` | Wolke gleichmäßig um 0 | Banane / Trichter / Cluster |
| `plotcorr(m)` | Koeffizienten wenig korreliert | starke Korrelation → zentrieren |

Alle Funktionen akzeptieren `newdata=df_test`, um die Prüfung auf Testdaten durchzuführen.

## Übung: Was ist hier los?
Ein Modell für Lieferzeiten hat Rhat = 1.00, n_eff > 3000, aber `diagnose_residual` zeigt einen Fächer, der nach rechts breiter wird.

<details><summary>Lösung</summary>

Sampling ok (Frage 1 ✔), aber Frage 3 ✘: Die Residuenstreuung ist nicht konstant. Für große Vorhersagen (lange Lieferungen) sind die predict-Intervalle zu eng. Abhilfe: log(y) oder Modell mit variabler Streuung. Mehr Samples helfen nicht.
</details>
