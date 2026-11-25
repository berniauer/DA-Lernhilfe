# Cheatsheet Datenanalyse (1 Seite zum Wiederholen vor der Klausur)

## Formeln
| | |
|---|---|
| Bayes | p(A\|B) = p(B\|A)·p(A)/p(B) |
| Odds / Logit | o = p/(1−p) · logit = log o · p = 1/(1+e^−logit) |
| Odds-Ratio | e^β pro Einheit; e^(k·β) für k Einheiten |
| Faustregel | max. Δp ≈ β/4 (bei p ≈ 0.5) |
| f² | (R²_mit − R²_ohne)/(1 − R²_mit) → 0.02 / 0.15 / 0.35 |
| Cohens d | Δ Mittelwert / SD → 0.2 / 0.5 / 0.8 |
| Brier Null | p̄(1 − p̄) (25 % → 0.1875) |
| Skill | 1 − Fehler/Fehler_Null |
| Kostenquantil | c_unter/(c_unter + c_über) |
| Kosten-Cutoff | p > c_FP/(c_FP + c_FN) |
| Scheitelpunkt | x* = c − β₁/(2β₂) bei β₁x + β₂(x−c)² |
| Interaktion | Steigung G = β_x + β_x:G · Unterschied bei x=c: β_G + β_x:G·c |
| looic | −2·elpd · ΔAIC/2 ≈ Δelpd |

## Grenzwerte
| | gut | schlecht |
|---|---|---|
| Rhat | ≈ 1 | > 1.1 |
| n_eff | > 2000 | < 400 |
| mcse | < 5 % mad | |
| Pareto k | < 0.7 | > 1 |
| loo_compare | \|diff\| > 2·se → Unterschied | |
| AUC | 0.7 ok · 0.8 gut · 0.9 sehr gut | 0.5 Zufall |

## daatools / rstanarm
```r
info(df); info(m)                      # Übersicht / Koeffizienten + Diagnose
check_sampling(m)
diagnose_density(m); diagnose_fit(m); diagnose_y_vs_yhat(m); diagnose_residual(m)
split_random(df, n, "train", "test")
prediction_metrics(m, test)            # RMSE/MAE/Skill bzw. Brier/LogLoss/Skill
effectsize(m)                          # f² (lm) bzw. ΔAIC (glm)
hdi(x); plothist(m, "par"); plotcoef(m)
posterior_epred(m, nd); posterior_predict(m, nd); predict(m, nd)
loo(m); loo_compare(l1, l2)
ROC(m, newdata=test); logistic_rates(m, newdata=test); plotlogrates(m, newdata=test)
brier(m, test); hinkley(m); odds(p); inv_odds(o)
```

## Die 4 Prüffragen
1 Sampling ok? · 2 Daten reproduziert? · 3 systematische Fehler? · 4 Generalisierung?

## Formulierungs-Pflicht
„**bei sonst gleichen Werten**“ · „**im Mittel**“ · Einheit nennen · Intervall nennen (0 drin?) · **keine Kausalität** · logistisch: „**Odds**“, nicht „Wahrscheinlichkeit“ · Train vs. Test benennen

## Häufigste Fallen
OR ≠ Wahrscheinlichkeitsverhältnis · Rohkoeffizienten verschiedener Einheiten vergleichen · Haupteffekt bei Interaktion = Gesamteffekt · Accuracy bei 25 % Positiven · `plotlogrates` ohne newdata = Training · mehr Samples ≠ mehr Daten · stabile Gesamtrate ≠ gutes Modell · zufälliger Split bei Zeitdaten · Leakage
