# Coding 2: Modell prüfen & Train/Test

> Datensätze: `daten/body-dimensions.csv`, `daten/galileo.csv`

## Aufgabe 2.1: Die 4 Prüffragen
Prüfe m1 aus Coding 1 systematisch (Sampling, Reproduktion, systematische Fehler).

<details><summary>Lösung</summary>

```r
check_sampling(m1)               # 1) Rhat, n_eff, mcse
bayesplot::mcmc_trace(m1)
info(m1)                         # mean_PPD ≈ mean(body$Weight)?
diagnose_density(m1)             # 2) Form der Verteilung
diagnose_fit(m1)                 #    min/max/mean/quantile reproduziert?
diagnose_y_vs_yhat(m1)           # 3) Banane?
diagnose_residual(m1)            #    Trichter?
```
</details>

## Aufgabe 2.2: Train/Test
Teile die Daten in 350 Trainings- und 157 Testzeilen. Fitte m1 auf Training und vergleiche die Metriken.

<details><summary>Lösung</summary>

```r
set.seed(42)
split_random(body, 350, "body_train", "body_test")
m1t = stan_glm(Weight ~ Height170 + Age30 + Gender, data=body_train, refresh=0)
prediction_metrics(m1t, body_test)
diagnose_residual(m1t, newdata=body_test)
```
Wenn RMSE/MAE im Test ≈ Training sind und der Skill ähnlich ist → generalisiert gut.
</details>

## Aufgabe 2.3: Galileo, Nichtlinearität erkennen
`galileo.csv` enthält Starthöhe und Flugweite einer Kugel. Fitte ein lineares Modell, erkenne das Problem in den Diagnoseplots und verbessere es.

<details><summary>Lösung</summary>

```r
gal = read.csv("daten/galileo.csv"); info(gal); names(gal)
# Spaltennamen ggf. anpassen (z. B. height / distance)
g1 = stan_glm(distance ~ height, data=gal, refresh=0)
diagnose_y_vs_yhat(g1); diagnose_residual(g1)     # Banane!
g2 = stan_glm(distance ~ height + I(height^2), data=gal, refresh=0)
diagnose_residual(g2)
loo_compare(loo(g1), loo(g2))
```
Lineares Modell → U-förmige Residuen (systematischer Fehler). Der quadratische Term beseitigt das Muster.
</details>

## Aufgabe 2.4: Code erklären
```r
m = stan_glm(y ~ x, data=d, chains=4, iter=400, refresh=0)
info(m)
```
Die Ausgabe zeigt n_eff ≈ 250 und Rhat 1.02. Was ist die Ursache, was tust du?

<details><summary>Lösung</summary>

`iter=400` → nur 200 Samples pro Chain nach Warmup (800 gesamt) → n_eff zu niedrig. Abhilfe: Default `iter=2000` verwenden (oder höher). Erst dann interpretieren.
</details>
