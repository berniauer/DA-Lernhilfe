# R-Output lesen 4: `loo()` und `loo_compare()`

## `loo(modell)`
```
Computed from 4000 by 3500 log-likelihood matrix.

         Estimate   SE
elpd_loo  -1113.4 27.1     ← Vorhersagegüte (größer = besser)
p_loo        16.2  0.9     ← effektive Parameterzahl (≈ Anzahl Koeffizienten → ok)
looic      2226.8 54.2     ← = −2 · elpd_loo
------
All Pareto k estimates are good (k < 0.7).     ← LOO verlässlich
```
Variante mit Problemen:
```
Pareto k diagnostic values:
                         Count  Pct.
(-Inf, 0.7]   (good)     3490  99.7%
   (0.7, 1]   (bad)         8   0.2%
   (1, Inf)   (very bad)    2   0.1%
```
→ Einige einflussreiche Beobachtungen; ansehen (`which(pareto_k_values(loo1) > 0.7)`), bei vielen `kfold()`.

**Warnsignal:** p_loo viel größer als die Anzahl der Parameter → Modell fehlspezifiziert oder sehr einflussreiche Punkte.

## `loo_compare(loo1, loo2)`
```
   elpd_diff se_diff
m2     0.0     0.0     ← bestes Modell
m1  -222.8    24.0     ← 222.8 schlechter; 222.8 / 24.0 ≈ 9.3 Standardfehler
```
**Entscheidungsregel:** |elpd_diff| > 2 · se_diff → klarer Unterschied.

| Beispiel | Bewertung |
|---|---|
| −222.8 (se 24.0) | 9 se → klar |
| −42.6 (se 9.3) | 4.6 se → klar |
| −4.1 (se 3.0) | 1.4 se → nicht überzeugend, einfacheres Modell ok |
| −109.6 (se 15.4) | 7 se → klar |

**Voraussetzungen:** gleiche Zielvariable, gleiche Zeilen. Bei Zeit-/Gruppenabhängigkeit ist LOO zu optimistisch.

## Übung
Drei Modelle: `m3 0.0 / m2 −3.0 (se 2.2) / m1 −40.0 (se 8.0)`. Welches nimmst du, wenn m3 deutlich mehr Datenerhebung kostet als m2?

<details><summary>Lösung</summary>

m2: Der Unterschied zu m3 ist nicht überzeugend (3.0 < 4.4), m1 ist klar schlechter (40 > 16). Wegen der Kosten ist das einfachere m2 vernünftig.
</details>
