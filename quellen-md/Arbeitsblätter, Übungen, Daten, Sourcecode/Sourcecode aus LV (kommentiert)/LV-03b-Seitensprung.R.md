# LV-03b-Seitensprung.R

```r
library(rstanarm)
library(daatools)

# Datensatz laden und erste Übersicht
df = read.csv('daten/Fair-JPE-1978_PsychToday.csv', stringsAsFactors = TRUE)

info(df)
hist(df)

# Wir interessieren uns nur dafür, ob ein Seitensprung stattgefunden hat (0/1)
df$had_affair = ifelse(df$affairs > 0, 1, 0)

# Erstes Modell
m1 = stan_glm(
  had_affair ~ gender + age + married + happy,
  data=df,
  family = binomial(link = "logit"))

# Einige Vorhersagen
predict(m1, newdata=data.frame(
  gender = 1,
  age = 53,
  married = 15,
  happy = 4
), type="response") # type="response" liefert uns Wahrscheinlichkeiten

predict(m1, newdata=data.frame(
  gender = 1,
  age = 53,
  married = 15,
  happy = 2
), type="response")

# Diagramm für Verlauf über Alter
pred_alter_m = predict(m1, newdata=data.frame(
  gender = 1,
  age = 30:60,
  married = 10,
  happy = 3
), type="response")

reset_gfx()
plot(30:60, pred_alter_m, type='l')

# Auch Kurve für Frauen hinzunehmen
pred_alter_f = predict(m1, newdata=data.frame(
  gender = 0,
  age = 30:60,
  married = 10,
  happy = 3
), type="response")

plot(30:60, pred_alter, type='l', ylim=c(0.1, 0.45))
lines(30:60, pred_alter_f, col='purple')

# Diagramm für Happiness

seq_happy = seq(1, 5, length.out=100)

pred_happy_m = predict(m1, newdata=data.frame(
  gender = 1,
  age = 30,
  married = 7,
  happy = seq_happy
), type="response")

pred_happy_f = predict(m1, newdata=data.frame(
  gender = 0,
  age = 30,
  married = 7,
  happy = seq_happy
), type="response")

plot(seq_happy, pred_happy_m, 'l', ylim=c(0.1, 0.6))
lines(seq_happy, pred_happy_f, col='purple')

# Nur die 5 Level der Happiness
pred_happy_5 = predict(m1, newdata=data.frame(
  gender = 0,
  age = 30,
  married = 7,
  happy = 1:5
), type="response")
pred_happy_5

# Wahrscheinlichkeiten vs. Odds
inv_odds(3 / 2) # odds=1.5, prob=60%
inv_odds(2 / 3) # odds=0.667, prob=40%

inv_odds(10 / 1) # odds = 10, prob=90.91%
inv_odds(1000 / 1) # odds = 1000, prob=99.9%

odds(0.6666) # prob=66.66%, odds=2  --- 2 : 1
odds(0.3333) # prob=33.33%, odds=0.5 --- 1 : 2

# Differenz der Wahrscheinlichkeiten
# von einem Happiness-Level zum nächsten
# Differenz variiert
pred_happy_5[2:5] - pred_happy_5[1:4]

# .. aber Verhältnis der Chancen ist konstant
odds(pred_happy_5[2:5]) / odds(pred_happy_5[1:4])

print(m1, digits=3)
# und Verhältnis entspricht exp() des Koeffizienten
round(exp(coef(m1)), 3)

# Chancen verzehnfachen sich -> Wahrscheinlichkeit nähert sich in immer
# kleineren Schritten 100% an
inv_odds(1 / 1)
inv_odds(10 / 1)
inv_odds(100 / 1)
inv_odds(1000 / 1)

# Logistische Regressionsformel:
# logit(p(y)) ~ a + b*x

# logit() entspricht log(odds):
# log(odds(p(y))) ~ a + b*x   // exp

# beide Seiten exp()
# odds(p(y)) ~ exp(a) * exp(b*x)

# nutzlos (Werte sind nur 0 oder 1)
diagnose_density(m1)

# Brier-Score
brier(m1)
# Nullmodel sagt immer Mittelwert von y als Wahrscheinlichkeit
mean(df$had_affair)

# R² geht auch für logistische Regression
mean(bayes_R2(m1))
```
