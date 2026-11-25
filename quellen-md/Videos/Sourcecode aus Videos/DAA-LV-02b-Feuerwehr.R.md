# DAA-LV-02b-Feuerwehr.R

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
m1

diagnose_density(m1)
mean(bayes_R2(m1))

# Zweites Modell: Nehmen wir die Zusammensetzung nach Nationalität mit auf. 
m2 = stan_glm(einsaetze ~ bevoelkerung1000 + eu1000 + andere1000, data=df)
m2

predict(m2, newdata=data.frame(
  bevoelkerung1000 = 20, # 13 aut
  eu1000 = 2,
  andere1000 = 5
)) # 597

predict(m2, newdata=data.frame(
  bevoelkerung1000 = 20, # 12 aut
  eu1000 = 2,
  andere1000 = 6
)) # 658

predict(m2, newdata=data.frame(
  bevoelkerung1000 = 21, # 13 aut
  eu1000 = 2,
  andere1000 = 6
)) # 668


plotcoef(m2, "1000")

diagnose_density(m2)

m3 = stan_glm(einsaetze ~ bevoelkerung1000 + eu1000 + andere1000 + bezirk + jahr2010, data=df)
m3

plothist(m3, "jahr2010")
plotcoef(m3, "bezirk")

diagnose_density(m3)
mean(bayes_R2(m3))

plotcoef(m3, "1000")
plothist(m3, "andere1000", compVal = 0)

effectsize(m3)

predict(m3, newdata=data.frame(
  bevoelkerung1000 = 20, # 13 aut
  eu1000 = 2,
  andere1000 = 5,
  bezirk = "3",
  jahr2010 = 2
)) # 726

predict(m3, newdata=data.frame(
  bevoelkerung1000 = 25, # 18 aut
  eu1000 = 2,
  andere1000 = 5,
  bezirk = "3",
  jahr2010 = 2
)) # 695

dat25 = posterior_predict(m3, newdata=data.frame(
  bevoelkerung1000 = 25, # 18 aut
  eu1000 = 2,
  andere1000 = 5,
  bezirk = "3",
  jahr2010 = 2))
plothist(dat25, cenTend = "mean")

dat20 = posterior_predict(m3, newdata=data.frame(
  bevoelkerung1000 = 20, # 13 aut
  eu1000 = 2,
  andere1000 = 5,
  bezirk = "3",
  jahr2010 = 2))
plothist(dat20, cenTend = "mean")

plothist(dat20 - dat25, compVal = 0, cenTend = "mean")

effectsize(m3)
```
