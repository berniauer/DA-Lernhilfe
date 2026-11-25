# LV-02b-Feuerwehr-live.R

```r
library(dplyr)
library(ggplot2)
library(rstanarm)
library(daatools)

# https://data.graz.gv.at/graz/feuerwehreinsaetze-in-graz-3/
# https://data.graz.gv.at/graz/die-grazer-bevoelkerung-nach-bezirk-und-staatsangehoerigkeit/

bezirke = read.csv('daten/graz-bezirksflaeche.csv')
einsaetze = read.csv("daten/Graz-Einsaetze.csv")
df = left_join(einsaetze, bezirke, by="bezirk") |>
  mutate(
    bevoelkerung1000 = bevoelkerung / 1000,
    aut1000 = aut / 1000,
    eu1000 = eu /1000,
    andere1000 = andere / 1000,
    jahr2010 = jahr - 2010,
    bezirk = factor(bezirk),
    dichte = bevoelkerung1000 / flaeche) |>
  group_by(bezirk) |>
  mutate(
    einsaetze_mean = mean(einsaetze),
    bevoelkerung1000_mean = mean(bevoelkerung1000),
    aut1000_mean = mean(aut1000),
    eu1000_mean = mean(eu1000),
    andere1000_mean = mean(andere1000),
    bevoelkerung1000_within = bevoelkerung1000 - bevoelkerung1000_mean,
    aut1000_within = aut1000 - aut1000_mean,
    eu1000_within = eu1000 - eu1000_mean,
    andere1000_within = andere1000 - andere1000_mean
  ) |>
  ungroup()

# Erster Überblick über die Daten
hist(df$einsaetze)
hist(df$bevoelkerung)
table(df$jahr)

# Erstes Modell: Anzahl der Einsätze in Abhängigkeit von der Bevölkerung.
m1 = stan_glm(einsaetze ~ bevoelkerung1000, data=df)
# Basisfall: Bei 0 Bevölkerung gibt es pro Bezirk und Jahr 17 Einsätze.
# Hinweis: "pro Bezirk und Jahr" ergibt sich nicht aus dem Modell, sondern ist
#   die Gruppierung im Datensatz. Wenn wir uns den Datensatz ansehen, dann sehen wir,
#   dass für jeden Bezirk und für jedes Jahr die Anzahl der Einsätze angegeben ist.
#   Unsere Y-Variable gibt also die Einsätze pro Bezirk und Jahr an. Genau aus
#   diesem Grund ist auch der Basisfall "pro Bezirk und Jahr". 
# Bewohner*innen: die Anzahl der Einsätze nimmt je 1000 Bewohner*innen um 19 zu. 
m1

# Dieses Modell ist noch keine gute Beschreibung des Datensatzes, wie man aus
# dem Vergleich der Verteilung der Daten (dunkelblau) und der vorhergesagten
# Verteilung laut Modell (hellblaue Samples) sehen kann. 
diagnose_density(m1)
# Obwohl R² recht hoch ist...
mean(bayes_R2(m1))

# Zweites Modell: Nehmen wir die Zusammensetzung nach Nationalität mit auf. 
m2 = stan_glm(einsaetze ~ bevoelkerung1000 + eu1000 + andere1000, data=df)
# Basisfall: Ein Bezirk mit 0 Bevölkerung, 0 EU-Personen und 0 Anderen hat pro Jahr 82 Einsätze.
# Beachten wir wieder, dass die einzelnen Koeffizienten nun aussagen, dass wir
# für die anderen Variablen "kontrollieren", also dass die anderen Variablen 
# vergleichbar sind.
# Bei ansonsten vergleichbaren Bezirken heißt 1000 Personen Bevölkerung mehr, 10 Einsätze pro Jahr mehr.
# "Ansonsten vergleichbar": gleiche Anzahl an EU und Andere. Wenn also Bevölkerung steigt,
# dann heißt real "1000 Österreicher*innnen" mehr.
# Analog: Bei ansonsten vergleichbaren Bezirken sind bei 1000 anderen Personen mehr, 
# 61 Einsätze pro Jahr mehr zu verzeichnen. "Ansonsten vergleichbar" heißt hier also
# gleiche Anzahl an Bevölkerung und EU-Personen. Implizit bedeutet das 1000 Österreicher*innen
# weniger.
# Die Koeffizienten sind also ein statistischer Vergleich von Zusammensetzungen im Bezirk,
# keine Aussage über das individuelle Verhalten von Bevölkerungsgruppen.
m2

# Ein schneller Blick zeigt, dass die Koffizienten für Bevölkerung und Andere signifikant sind,
# während der Koffizient für EU-Staatsbürger*innen kein eindeutiges Vorzeichen hat (kann
# sowohl positiv als auch negativ sein).
plotcoef(m2, "1000")

# M2 bildet den Datensatz schon ein wenig besser nach als M1, aber noch nicht gut.
diagnose_density(m2)

# Es kann natürlich sein, dass der Anteil verschiedener Nationalitäten je Bezirk
# unterschiedlich ist. Dadurch würden Nationalitäten stellvertretend für unbeobachtete
# Eigenschaften der Bezirke stehen bzw. diese mit "einbauen". Aus diesem Grund nehmen
# wir nun eine Variable für den Bezirk ins Modell mit auf. Dadurch sind wir in der Lage,
# Effekte der Nationalitäten von den Bezirkseffekten zu trennen. Zumindest die
# (über den Beobachtungszeitraum) zeitlich konstanten Unterschiede zwischen den Bezirken.
# Wenn bspw. Bautätigkeit Bezirke strukturell verändert und parallel dazu sich auch die
# Bevölkerungsanteile sich ändern, dann bildet das Modell das nicht ab.
m3 = stan_glm(einsaetze ~ bevoelkerung1000 + eu1000 + andere1000 + bezirk + jahr2010, data=df)
# Basisfall: 1. Bezirk, Jahr 2010, 0 Bevölkerung/EU/andere: 443 Einsätze
# Nun sind also die Koeffizienten um Bezirkseffekte "bereinigt" bzw. "kontrolliert".
# z.B. eu1000: Bei ansonsten vergleichbaren Bedingungen sind um je 1000 EU-Personen mehr,
# acht Einsätze pro Jahr im Bezirk weniger zu verzeichnen. Vergleichbare Bedingungen:
# Bevölkerung gleich, Andere gleich, Jahr gleich, Bezirk gleich.
# Der Koeffizient beschreibt nun den statistischen Zusammenhang zwischen Veränderungen
# der Bevölkerungszusammensetzung und der Anzahl der Einsätze innerhalb desselben Bezirks,
# unter Berücksichtigung der übrigen Modellvariablen. Das bedeutet nicht, dass ein
# "ursächlicher"/kausaler Zusammenhang nachgewiesen wurde. Dafür müssten wir ausschließen
# können, dass weitere, unbeobachtete Faktoren beide Größen beeinflussen.
m3

# Je Jahr und Bezirk im Schnitt 3 Einsätze weniger. Allerdings ist das Ergebnis auch
# konsistent mit "mehr Einsätzen". D.h. keine eindeutige Aussage möglich.
plothist(m3, "jahr2010")
# Bei den Bezirken ähnlich: nur wenige Bezirke unterscheiden sich im 95%-Niveau
# eindeutig von Bezirk 1, bspw. Bezirke 10, 11 und 17. Bei allen anderen ist das
# Ergebnis sowohl konsistent mit weniger als auch mehr Einsätzen als im Bezirk 1.
plotcoef(m3, "bezirk")

# Dafür beschreibt unser Modell jetzt den Datensatz ausserordentlich gut
diagnose_density(m3)
# R² ist auf 95% gestiegen!
# (Heißt: Modell beschreibt Daten gut, nicht dass Modell kausale Zusammenhänge aufzeigt.)
mean(bayes_R2(m3))

# Wenn wir nur auf die Punktwerte schauen und nicht auch das Intervall kommunizieren,
# ist leicht zu übersehen, dass die +23 (andere1000) nicht eindeutig sind und auch
# konsistent mit negativem Effekt wären.
plotcoef(m3, "1000")
# 95%-HDI von ca/ -60 bis +100.
plothist(m3, "andere1000", compVal = 0)
# Man sollte also Intervalle nicht unterschlagen, vor allem, wenn Sie zeigen, dass
# der Effekt sowohl positiv als auch negativ sein kann (und daher nicht eindeutig
# durch das Modell bestimmt ist.)

# Sieht man sich die Effektgröße an, ist eindeutig, dass der Bezirk den Großteil
# der Varianz der Anzahl der Einsätze erklärt. mit f²=3.9 ist der Effekt der Bezirke
# riesig. Im Vergleich dazu ist die Effektgröße von andere1000 (f²=0.002)
# verschwindend klein.
effectsize(m3)

# Wir haben nun ein Modell mit 95% R². Was wissen wir nun wirklich über die
# Ursachen von Feuerwehreinsätzen? Was wissen wir noch nicht?
```
