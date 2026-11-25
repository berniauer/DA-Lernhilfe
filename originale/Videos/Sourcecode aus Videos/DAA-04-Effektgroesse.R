library(dplyr)
library(ggplot2)
library(rstanarm)
library(daatools)

# Body-Datensatz einlesen
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE) |>
  select(Weight, Height, Age, Gender)

# Kurzer Überblick
hist(body)

# Modell: Gewicht in Abhängigkeit von Größe, Geschlecht und Alter
modell1 = stan_glm(Weight ~ Height + Gender + Age, data=body, seed=123)
modell1

# Größe des Koeffizienten != Effektstärke
body$Height_m = body$Height / 100
modell1m = stan_glm(Weight ~ Height_m + Gender + Age, data=body)
modell1m

# R² berechnen
r2_m1 = bayes_R2(modell1)
mean(r2_m1)

# Idee: Variablen rausnehmen und schauen, wie sich R² verändert
modell2 = stan_glm(Weight ~ Height + Age, data=body)
modell3 = stan_glm(Weight ~ Gender + Age, data=body)

r2_m2 = bayes_R2(modell2)
r2_m3 = bayes_R2(modell3)

# bei modell3 (Height entfernt) fällt R² deutlich stärker ab
# als bei modell2 (Gender entfernt)
# → Height trägt stärker zur Erklärung der Varianz bei, hat also
# einen größeren Effekt
mean(r2_m2)
mean(r2_m3)

# Cohens f²:
#
#             zusätzlich erklärte Varianz
# f² = ------------------------------------------
#      unerklärte Varianz im vollständigen Modell

f2_height = (mean(r2_m1) - mean(r2_m3)) / (1 - mean(r2_m1))
f2_height

# f² ~= 0.02 gilt als kleiner Effekt
# f² ~= 0.15 gilt als mittlerer Effekt
# f² ~= 0.35 gilt als großer Effekt

f2_gender = (mean(r2_m1) - mean(r2_m2)) / (1 - mean(r2_m1))
f2_gender

# Effektgröße und R² sind unabhängig von Einheit der Variable,
# da sich ja die Personen nicht verändert haben.
effectsize(modell1)
effectsize(modell1m)
