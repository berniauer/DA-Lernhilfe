library(dplyr)
library(ggplot2)
library(rstanarm)
library(daatools)

# Datensatz laden, Spalten filtern und zentrieren
body = read.csv("daten/body-dimensions.csv", stringsAsFactors = TRUE) |>
  select(Gender, Weight, Height, Age) |>
  mutate(Age30 = Age - 30,
         Height170 = Height - 170)

# Split in zwei Teile (Training und Test)
split_random(body, 350, "body_train", "body_test")

# Erste Übersicht
info(body)

# Erstes Modell: Gewicht in Abhängigkeit von Geschlecht, Alter und Größe.
m1 = stan_glm(Weight ~ Gender + Age30 + Height170, data=body_train)

# Interpretation wie vorher. Basisfall ist eine Frau, 170 cm groß und 30 Jahre alt.
print(m1, digits=2)

# Standardfehler: 95%-Intervall= +-2sd
7.35 + 2*1.35
7.35 - 2*1.35

# Koeffizienten wie bspw. GenderMale haben nicht nur einen Punktwert sondern
# eine vollständige Wahrscheinlichkeitsverteilung. Das 95%-HDI (Highest Density Intervall),
# zeigt uns den Bereich, in dem sich mit 95% Wahrscheinlichkeit der wahre Wert befindet.
plothist(m1, "GenderMale")

# Vorhersage manuell durchgerechnet: wir setzen einfach die Koeffizienten und
# Werte der Person direkt in die Regressionsformel ein:
frau1 = data.frame(Age30=-3, Gender="Female", Height170=-2)
# Weight ~ Intercept + Gender + Age30     + Height170
             64.4    + 0*7.35 + (-3)*0.19 + (-2)*0.79
# 62kg

mann1 = data.frame(Age30=24, Gender="Male", Height170=25)
# Weight ~ Intercept + Gender + Age30     + Height170
             64.4    + 1*7.35 + (24)*0.19 + (25)*0.79
# 96kg

# Punktvorhersagen: mit predict()
predict(m1, newdata=frau1)
predict(m1, newdata=mann1)

# y ~ a + b*x + e

# Intervall-Vorhersage mit individuellen Abweichungen: posterior_predict()
# Das heißt, hier geht zusätzlich zur Unsicherheit der Bestimmung der Koeffizienten
# (Intercept, Gender, Height, Age) auch Epsilon ein, also die individuellen
# Abweichungen, die dadurch entstehen, dass unser Modell nicht die vollständige
# Wirklichkeit abbildet.
fr1 = posterior_predict(m1, newdata = frau1)
plothist(fr1)

ma1 = posterior_predict(m1, newdata = mann1)
plothist(ma1)

# Intervall-Vorhersage OHNE individuellen Abweichungen,
# d.h. eine Schätzung des Mittelwerts aller Personen mit diesen Eigenschaften
# Funktion: posterior_epred()
fr1e = posterior_epred(m1, newdata = frau1)
plothist(fr1e)

ma1e = posterior_epred(m1, newdata = mann1)
plothist(ma1e)

# Da wir nun volle Wahrscheinlichkeitsverteilungen haben, können wir auch
# weitere Fragen recht einfach beantworten, bspw.:
# Wie wahrscheinlich ist einzelner Mann (195cm, 54 Jahre) schwerer als 100kg?
mean(ma1 > 100)
plothist(ma1, compVal = 100)
# ... und genau zwischen 80 & 85kg schwer?
mean(ma1 > 80 & ma1 < 85)

## Vergleiche
# Nehmen wir zwei neue Personen:
# Eine Frau 27 Jahre, 173cm groß; und ein Mann 35 Jahre, 185cm groß
frau2 = data.frame(Age30=-3, Gender="Female", Height170=3)
mann2 = data.frame(Age30=5, Gender="Male", Height170=15)
# Punktvorhersagen
predict(m1, newdata=frau2)
predict(m1, newdata=mann2)

# Intervall-Vorhersage
fra2 = posterior_predict(m1, newdata=frau2)
ma2 = posterior_predict(m1, newdata=mann2)

# Die Intervalle überschneiden sich offensichtlich.
plothist(fra2)
plothist(ma2)
plotcoef(data.frame(Frau=fra2[,1], Mann=ma2[,1]))

# Wenn uns die Differenz zwischen dieser Frau und diesem Mann interessiert,
# dann können wir natürlich einerseits die Punktwerte voneinander abziehen.
predict(m1, newdata=mann2) - predict(m1, newdata=frau2)
# Besser/genauer ist es, die Verteilung der Differenz sich anzusehen:
diff2 = ma2 - fra2
# Wir sehen, dass es zu 93 Prozent wahrscheinlich ist, dass der Mann schwerer als die Frau ist.
# Mit 7 Prozent Wahrscheinlichkeit ist die Frau schwerer als der Mann. Im 95%-HDI geht das
# Intervall von ca. -6 kg bis +42 kg. In einem 95%-Signifikanzniveau ist der Unterschied
# zwischen diesen beiden also konsistent mit "der Mann ist schwerer", "die Frau ist schwerer"
# oder "sie sind beide ungefähr gleich schwer". D.h. auf diesem 95%-Niveau können wir keine
# eindeutige Aussage treffen (klassisch formuliert: die Differenz ist "nicht signifikant").
plothist(diff2, compVal=0)

##################

# Fluggesellschaft
# Flugzeuge: 100 Passagiere

# Wir wählen zufällig 100 Passagiere aus dem Testdatenset ab.
set.seed(1234)
passagiere = slice_sample(body_test, n=100)

# Vorhersage des Gewichts für diese 100 Personen.
p100 = predict(m1, newdata=passagiere)
p100
# Gesamtgewicht
sum(p100)

# Errechnen wir die Verteilung des Gesamtgewichts, indem wir im ersten Schritt
# die Gewichtsverteilung für jede einzelne Person berechnen
ppred = posterior_predict(m1, newdata=passagiere)
dim(ppred) # 4000 Zeilen (=Samples) mit 100 Spalten (=Passagiere)
# Dann berechnen wir für die 4000 Samples das Gesamtgewicht aller Passagiere...
gesamtgewicht = rowSums(ppred)
# und lassen uns die Verteilung anzeigen
plothist(gesamtgewicht)

# Kostenfunktion:
# Wenn wir zu viel Gewicht der Passagiere einplanen, dann entgeht uns Gewinn,
# weil wir stattdessen zusätzliche Fracht hätten laden können (Opportunitätskosten).
# Wenn wir zu wenig Gewicht der Passagiere einplanen, dann entsteht zusätzlicher
# Aufwand, weil wir Fracht die ursprünglich für diesen Flug geplant war, auf andere
# Flüge verteilen müssen.
# Kosten:
# zu viel: 5€/kg
# zu wenig: 15€/kg

# Wir schauen uns einfach den gesamten Wertebereich an.
# Die Sequenz gewicht_seq steht dabei für das Gesamtgewicht, das wir für den Flug einplanen.
gewicht_seq = seq(min(gesamtgewicht), max(gesamtgewicht), length.out=200)

# Wir nehmen nun das Plangewicht und vergleichen es mit der Modellvorhersage.
# Das Modell ist unsere beste Schätzung für das wirkliche Gewicht der Passagiere.
erwartete_kosten = sapply(gewicht_seq, function(gewicht) {
  kosten = ifelse(gesamtgewicht > gewicht,
                  (gesamtgewicht - gewicht) * 15,
                  (gewicht - gesamtgewicht) * 5
  )
  mean(kosten)
})
# Es ergibt sich eine Kostenkurve.
# Die minimalen Kosten enstehen bei einem Plangewicht, das etwas höher als der Median
# der Modellvorhersage ist, weil unsere Kosten asymmetrisch verteilt sind.
plot(gewicht_seq, erwartete_kosten, type='l',
     xlab='Eingeplantes Gesamtgewicht', ylab='Erwartete Kosten',
     main='Welche Entscheidung minimiert unsere Kosten?')

# Wir entscheiden uns in der Planung also davon auszugehen, dass die Passagiere
# circa 6950 Kilogramm wiegen.
entscheidung = gewicht_seq[which.min(erwartete_kosten)]
entscheidung

# Da wir das reale Gewicht der Passagiere kennen,
# können wir so die realen entstandenen Kosten errechnen.
gewicht_real = sum(passagiere$Weight)
gewicht_real
diff = entscheidung - gewicht_real
diff
kosten_real = ifelse(diff < 0, -diff * 15, diff * 5)
c(entscheidung=entscheidung,
  gewicht_real=gewicht_real,
  kosten_real=kosten_real)


### 500 Flüge

# Machen wir nun eine wiederholte Berechnung für 500 Flüge, um zu sehen, welche
# reale Kosten entstehen bzw. welche Verteilung diese haben. Wir vergleichen
# dabei auch unsere bisherige Regel, bei der wir einfach von einem Mittelwert
# von 69kg je Person ausgegangen sind.

n_fluege = 500
kosten_modell = numeric(n_fluege)
kosten_alt = numeric(n_fluege)

set.seed(1234)
for (i in 1:n_fluege) {
  # 150 Personen für diesen Flug auswählen
  passagiere_i = slice_sample(body_test, n=100, replace=TRUE)
  gewicht_real_i = sum(passagiere_i$Weight)
  
  # optimale Entscheidung bei unserer Kostenfunktion
  ppred_i = posterior_predict(m1, newdata=passagiere_i, draws=1000)
  gesamtgewicht_i = rowSums(ppred_i)
  gewicht_seq_i = seq(min(gesamtgewicht_i), max(gesamtgewicht_i), length.out=200)
  erwartete_kosten_i = sapply(gewicht_seq_i, function(gewicht) {
    kosten = ifelse(gesamtgewicht_i > gewicht, 
                    (gesamtgewicht_i - gewicht) * 15,
                    (gewicht - gesamtgewicht_i) * 5)
    mean(kosten)
  })
  entscheidung_i = gewicht_seq_i[which.min(erwartete_kosten_i)]
  diff_i = entscheidung_i - gewicht_real_i
  kosten_modell[i] = ifelse(diff_i < 0, -diff_i * 15, diff_i * 5)
  
  # Entscheidung mit der alten 69-kg-Regel
  entscheidung_alt_i = 69 * 100
  diff_alt_i = entscheidung_alt_i - gewicht_real_i
  kosten_alt[i] = ifelse(diff_alt_i < 0, -diff_alt_i * 15, diff_alt_i * 5)
}

# Bei unserem Modell entstehen durchschnittliche Kosten je Flug von 760 Euro.
# Bei der alten 69kg Regel entstehen durchschnittliche Kosten von 1065 Euro pro Flug.
c(
  Modell = mean(kosten_modell),
  `69kg-Regel` = mean(kosten_alt)
)
# Im Durchschnitt spart unser Modell also 300 Euro je Flug.
mean(kosten_modell - kosten_alt)
# Wir sehen, dass die Verteilung recht breit gestreut ist.
# In 60% aller Flüge ist das Modell besser als die alte Regel; die alte Regel ist
# aber in 40% der Flüge besser als das Modell. Leider wissen wir im Vorhinein nicht,
# wann welcher Fall zutrifft :o) Im Durchschnitt erzielt das Modell Einpsarungen von 300 Euro.
# Für den einzelnen Flug können wir von Einsparungen von bis zu über 3000 Euro haben,
# aber auch Mehrkosten (im Vergleich zur alten Regel) von über 2000 Euro.
# Das 95%-Intervall bewegt sich von Einsparungen von 2800 Euro bis Mehrkosten von ca. 1370 Euro.
plothist(kosten_modell - kosten_alt, cenTend = "mean", compVal = 0)
