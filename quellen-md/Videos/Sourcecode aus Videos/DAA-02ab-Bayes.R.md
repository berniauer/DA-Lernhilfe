# DAA-02ab-Bayes.R

```r
library(rstanarm)
library(lattice)
library(MASS)
library(daatools)

# Datensatz laden und Jahr zentrieren
arctic_ice = read.csv('daten/arctic-sea-ice-extent.csv', stringsAsFactors = TRUE)
arctic_ice$year2k = arctic_ice$year - 2000

# Kurze Übersicht über den Datensatz
info(arctic_ice)

# Eisausdehnung vs. Jahr
plot(arctic_ice$year2k, arctic_ice$extent)

# erstes Modell
m1 = stan_glm(extent ~ year2k, data=arctic_ice)
print(m1, digits=2)

# Regressionslinie in den Plot einzeichnen
plot(arctic_ice$year2k, arctic_ice$extent)
abline(coef(m1), col="blue")

# MC-Stan verwendet ein Samplingverfahren, um die Koeffizienten zu bestimmen.
# Mit as.matrix() erhalten wir die 4000 Samples.
samples1 = as.matrix(m1)
dim(samples1)       # 4000 Zeilen, 3 Spalten
colnames(samples1)  # Spalten sind Koeffizienten

# Histogramm der Samples entspricht genau dem der Koeffizienten
# (weil im Hintergrund genau dieselbe Berechnung passiert/dieselben Daten verwendet werden.)
plothist(samples1[,1])
plothist(m1, "(Intercept)")

plothist(samples1[,2])
plothist(m1, "year2k")

# Zwei-Dimensionale Darstellung der Wahrscheinlichkeits-"Landschaft"
# Wenn Sie auf die Achsen sehen, dann sehen Sie, dass die "Spitze des Berges"
# genau dort liegt, wo die Histogramme oben ihr Maximum haben.
landscape = kde2d(samples1[, '(Intercept)'], samples1[, 'year2k'], n = 100)
levelplot(landscape$z, row.values = landscape$x, column.values = landscape$y,
          xlab = "Intercept", ylab = "Year2k", aspect = "fill",
          xlim = c(5.5, 6.5),
          ylim=c(-0.05, -0.135))

# Samples "wandern in der Landschaft herum"
plot(samples1[1:30, 1], type="l")   # Erste 30 Schritte
plot(samples1[1:100, 1], type="l")  # Erste 100 Schritte
plot(samples1[1:1000, 1], type="l") # 1000 Schritte (=Chain 1)
plot(samples1[1:4000, 1], type="l") # Alle 4 Chains

# Gibt auch Funktion, die das anzeigt
bayesplot::mcmc_trace(m1)

# mcse, n_eff, Rhat: Metriken, ob das Sampling gut funktioniert hat
info(m1)
# Funktionen, die das automatisch für uns überprüft
check_sampling(m1)

# Mittelwert der Daten muss mit mean_PPD übereinstimmen (check_sampling prüft auch das)
mean(arctic_ice$extent)

# Zusammengefasst: Sampling hat gut funktioniert

# Reproduktion
# Verteilung der Daten ...
plot(density(arctic_ice$extent))

# ... entspricht dunkelblauer Linie, die hellblauen sind Samplverteilungen des Modells
# nicht gut getroffen
diagnose_density(m1)
# dafür treffen wir Minimum, Maximum und Mittelwert der Verteilung
diagnose_fit(m1)

# Zusammengefasst: Modeller reproduziert Datensatz nur eingeschränkt

# Systematischer Fehler
diagnose_y_vs_yhat(m1)
# Es ist deutlich eine systematische Abweichung (hier: eine "Banane") vorhanden
diagnose_residual(m1)

# Zusammengefasst: das Modell enthält systematische Abweichungen, bildet also den Datensatz nicht gut ab.

# Urteil: Unsere Tests haben gezeigt, dass unser Modell kein geeigneter Ansatz ist, 
# die Daten zu modellieren.


#####################
# Körper-Datensatz

# Datensatz einlesen, zentrieren und auf Trainings- und Testdatensatz aufteilen.
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)
body$Height170 = body$Height - 170
body$Age30 = body$Age - 30
split_random(body, 350, "body_train", "body_test")

# Erste Übersicht
info(body)

# Modell: Gewicht in Abhängigkeit von Geschlecht, Größe und Alter.
m2 = stan_glm(Weight ~ Gender + Height170 + Age30,
              data = body_train)

# Intercept ist Basisfall: eine Frau, 170cm groß, 30 Jahre alt: 64kg
# Koeffizienten:
# Height: je 1cm Größenunterschied unterscheidet sich Gewicht um 0.8kg
# Age: je Jahr Altersunterschied unterscheidet sich Gewicht um 0.2kg
# Gender: Männer sind im Schnitt um über 7 kg schwerer als vergleichbare Frauen
info(m2)


# Sampling ok
check_sampling(m2)
bayesplot::mcmc_trace(m2)

# Verteilung ist nicht optimal, aber noch okay.
diagnose_density(m2)
# Minimum und Maximum werden vom Modell nicht gut getroffen.
# Es wird ein kleineres Minimum vorhergesagt und ein kleineres Maximum.
diagnose_fit(m2)
# kein systematischer Fehler erischtlich
diagnose_residual(m2)

# Weitere Test: Vorhersage auf neuen Daten
neu = predict(m2, newdata=body_test)
neu
# Mittlere Abweichung soll dem Idealfall 0 sein
mean(neu - body_test$Weight)
# Mittlerer absoluter Fehler bei der Vorhersage
mean(abs(neu - body_test$Weight)) # MAE
# Quadratische Residuensumme
# (gewichtet große Abweichungen stärker als kleine Abweichungen)
sqrt(mean((neu - body_test$Weight)^2)) # RMSE

# Die Funktion prediction_metrics() zeigt uns diese Werte für den original
# Trainingsdatensatz als auch für den Testdatensatz. So können wir vergleichen,
# ob sich die Eigenschaften wesentlich verändert haben. Bei einem guten Modell
# sollte das nicht der Fall sein.
print(prediction_metrics(m2, body_test), digits=2)

# Wir können uns auch mit den Diagnose-Funktionen ansehen, ob wieder die
# Verteilung den Daten entspricht und ob Residuen ordentlich aussehen (d.h.
# keine systematische Abweichung zeigen).
diagnose_density(m2, newdata=body_test)
diagnose_residual(m2, newdata=body_test)

# Unser Modell erklärt 60% der Varianz, die wir im Datensatz beim Gewicht sehen.
# Das ist für ein Modell mit nur drei Variablen, ein recht guter Wert -- vor allem
# wenn Sie sich überlegen, wie stark Gewicht zwischen Personen variieren kann.
mean(bayes_R2(m2))
```
