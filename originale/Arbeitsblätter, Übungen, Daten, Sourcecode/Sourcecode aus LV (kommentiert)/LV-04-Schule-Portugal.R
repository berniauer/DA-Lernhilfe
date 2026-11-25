library(rstanarm)
library(daatools)

# Datensatz laden
df = read.csv('daten/student-por.csv', sep=';', stringsAsFactors = TRUE)
info(df)

# G3: Punkte bei Abschlussprüfung, weniger als 10? -> nicht bestanden
df$failed = ifelse(df$G3 < 10, 1, 0)
table(df$failed)

# Modell für Vorhersage, ob Schüler:innen durchfallen
m1 = stan_glm(
  failed ~ school + failures + higher + absences + guardian + age,
  data = df,
  family = binomial(link = 'logit'))

round(exp(coef(m1)), 2)
hist(df$age)
table(df$guardian)

# Im Vergleich zu Guardian=Vater sind sowohl Mutter als auch "Other"
# konsistent mit positivem oder negativem Effekt. Bei Mutter gibt es
# allerdings eine klare Tendenz (98% Wahrscheinlichkeit, dass bei
# Guardian=Mutter das Risiko durchzufallen höher ist.)
plothist(m1, 'guardianmother', transform=exp, compVal = 1)
plothist(m1, 'guardianother', transform=exp, compVal = 1)

formula(m1)

# Einige Vorhersagen, um zu sehen, wie sich Verdoppelung der Chance
# von Vater vs Mutter auf absolute Wahrscheinlichkeit auswirkt
predict(m1, newdata=data.frame(
  age = 20,
  higher = 'yes',
  absences = 0,
  failures = 0,
  school = 'GP',
  guardian = c('father', 'mother')
), type='response')

predict(m1, newdata=data.frame(
  age = 20,
  higher = 'yes',
  absences = 0,
  failures = 1,
  school = 'MS',
  guardian = c('father', 'mother')
), type='response')

predict(m1, type='response', newdata=data.frame(
  age = 20,
  higher = 'no',
  absences = 10,
  failures = 1,
  school = 'MS',
  guardian = c('father', 'mother')
))

# Brier-Score sieht ok aus (25% unterhalb Null-Modell)
brier(m1)
# R²=0.3 ist für dieses einfache Modell gar nicht so schlecht
mean(bayes_R2(m1))

# Differnzierung zwischen 1er und 0er
# AUC (area under curve, Wertebereich 0..1) ist eine Maßzahl dafür.
# AUC = 0.85 bedeutet, dass das Modell bei einem zufällig ausgewählten Paar aus
# einer Person die durchfällt (Wert=1) und einer Person die besteht (Wert=0)
# mit 85 % Wahrscheinlichkeit der durchfallenden Person eine höheres
# Risiko vorhersagt als der anderen Person.
ROC(m1)

# Wenn wir nicht nur von Wahrscheinlichkeiten reden, müssen wir letztlich
# die Werte diskretisieren, d.h. 1 oder 0 zuweisen
pred = predict(m1, newdata=df, type='response')
# Typischer ("natürlicher") Schwelltwert: 0.5
binary_50 = ifelse(pred >= 0.5, 1, 0)
table(binary_50)

# Wir sagen nur 33 von 100 1er richtig vorher
sum(binary_50 == 1 & df$failed == 1)
sum(df$failed)

# Bei anderem Schwelltwert...
binary_40 = ifelse(pred >= 0.4, 1, 0)
# sagen wir 42 von 100 1ern richtig vorher
sum(binary_40 == 1 & df$failed == 1)

# (leider aber mehr 0er fälschlicherweise als 1er)
sum(binary_50 == 1 & df$failed == 0)
sum(binary_40 == 1 & df$failed == 0)

# Schauen wir uns alle möglichen Schwellwerte in einem Diagramm an
cut_off = seq(0, 1, length.out=200)

richtig = numeric(200)
for (i in 1:200) {
  binary = ifelse(pred >= cut_off[i], 1, 0)
  richtig[i] = sum(binary == 1 & df$failed == 1)
}
# je höher der Schwellwert, umso weniger 1er sagen wir richtig als 1er vorher
# (True positives nehmen ab)
plot(cut_off, richtig, type='l')

# Wie sieht es mit falsch vorhergesagten 0er aus (false positives)?
fp = numeric(200)
for (i in 1:200) {
  binary = ifelse(pred >= cut_off[i], 1, 0)
  fp[i] = sum(binary == 1 & df$failed == 0)
}
# Auch die nehmen ab
plot(cut_off, fp, type='l')

# FPR und TPR bilden X&Y-Achse der ROC
ROC(m1)

# Kostenfunktion
# Zusatzschulung: 100,- EUR
# Nicht erfasste Kritische: 400,- EUR

# Modell: 1 (Risiko), wirklich 1 (fällt durch): 100,-
# Modell: 1 (Risiko), wirklich 0 (besteht): 100,-
# Modell: 0 (unauffällig), wirklich 1 (fällt durch): 400,-
# Modell: 0 (unauffällig), wirklich 0 (besteht): 0,-

kosten = numeric(200)
for (i in 1:200) {
  binary = ifelse(pred >= cut_off[i], 1, 0)
  tp = sum(binary == 1 & df$failed == 1)
  fp = sum(binary == 1 & df$failed == 0)
  tn = sum(binary == 0 & df$failed == 0)
  fn = sum(binary == 0 & df$failed == 1)
  kosten[i] = 100*tp + 100*fp + 0*tn + 400*fn
}

# Kosten sind bei Schwellwert von 0.2 am geringsten
plot(cut_off, kosten, type='l')

min(kosten) # 27100 EUR
cut_off[which.min(kosten)] # bei Schwellwert 0.2
