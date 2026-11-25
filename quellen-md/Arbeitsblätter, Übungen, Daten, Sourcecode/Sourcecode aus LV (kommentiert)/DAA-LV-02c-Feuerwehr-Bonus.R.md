# DAA-LV-02c-Feuerwehr-Bonus.R

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

m3 = stan_glm(einsaetze ~ bevoelkerung1000 + eu1000 + andere1000 + bezirk + jahr2010, data=df)
plotcoef(m3, "1000")

# Zerlegung nach Mundlak in 
# a) Differenz zwischen Bezirke (Mittelwert über die Jahre)
# b) Veränderung innerhalb Bezirk (Differenz zu Mittelwert für jedes Jahr)
m4 = stan_glm(einsaetze ~ 
                bevoelkerung1000_mean + bevoelkerung1000_within +
                eu1000_mean + eu1000_within +
                andere1000_mean + andere1000_within +
                jahr2010, data=df)
m4
plotcoef(m4, "mean")

df |> select(eu1000_mean, einsaetze_mean, name) |> unique() |>
  ggplot(aes(eu1000_mean, einsaetze_mean, label=name)) +
  geom_point() + ggrepel::geom_text_repel() + theme_minimal()

plotcoef(m4, "within")
effectsize(m4)

m5 = stan_glm(einsaetze ~ 
                bevoelkerung1000_mean + bevoelkerung1000_within +
                eu1000_mean + eu1000_within +
                andere1000_mean + andere1000_within +
                jahr2010 + dichte,
              data=df)
m5

plotcoef(m5, "mean")
plotcoef(m5, "within")

effectsize(m5)
```
