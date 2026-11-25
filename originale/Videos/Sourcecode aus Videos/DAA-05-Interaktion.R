library(ggplot2)
library(dplyr)
library(rstanarm)
library(daatools)

# Datensatz erzeugen
set.seed(42)
n = 90
lernen = data.frame(
  stunden = rep(runif(n, 1, 10), 2),
  format = factor(rep(c("Selbststudium", "Betreuung"), each=n),
                  levels=c("Selbststudium", "Betreuung"))) |>
  mutate(punkte = 35 + 2 * stunden + (format == "Betreuung") * (3 + 3 * stunden) + rnorm(2*n, sd=5)
  )

# Scatterplot zur Übersicht
ggplot(lernen, aes(stunden, punkte, color=format)) +
  geom_point(alpha=.5) +
  labs(x="Lernstunden", y="Testpunkte", color="Kursformat") +
  theme_minimal()

# Erstes Modell: wie üblich
modell1 = stan_glm(punkte ~ stunden + format, data=lernen)
modell1

# Regressionslinien
ggplot(lernen, aes(stunden, punkte, color=format)) +
  geom_point(alpha=.25) +
  geom_line(aes(y=predict(modell1)), linewidth=1) +
  labs(x="Lernstunden", y="Testpunkte", color="Kursformat") +
  theme_minimal()

# Reproduziert den Datensatz nicht gut
diagnose_residual(modell1)

# Zweites Modell: Interaktionsterm aufnehmen
modell2 = stan_glm(punkte ~ stunden + format + stunden:format, data=lernen)
modell2

# Nun erlaubt das Modell unterschiedliche Steigungen je Gruppe
ggplot(lernen, aes(stunden, punkte, color=format)) +
  geom_point(alpha=.25) +
  geom_line(aes(y=predict(modell1)), linetype=2) +
  geom_line(aes(y=predict(modell2)), linewidth=1) +
  labs(subtitle="modell2: unterschiedliche Steigungen; zum Vergleich modell1 gestrichelt",
       x="Lernstunden", y="Testpunkte") +
  theme_minimal()

# Was passiert, wenn wir zentrieren?
lernen$stunden5 = lernen$stunden - 5
# "stunden5 * format" ist identisch mit
# "stunden5 + format + stunden5:format"
modell3 = stan_glm(punkte ~ stunden5 * format, data=lernen)
modell3

compare_coef(modell2, modell3)

# Regrewssionslinien sind genau gleich -- sie sind nur an anderem Referenzpunkt "verankert"
ggplot(lernen, aes(stunden, punkte, color=format)) +
  geom_point(alpha=.25) +
  geom_line(aes(y=predict(modell1)), linetype=2) +
  geom_line(aes(y=predict(modell3)), linewidth=1) +
  labs(subtitle="modell2: unterschiedliche Steigungen; zum Vergleich modell1 gestrichelt",
       x="Lernstunden", y="Testpunkte") +
  theme_minimal()


# Folge: abhängig vom Referenzwert kann man jeden beliebigen Gruppenkoeffizienten erzeugen
# -> der Koeffizient ist also nur "Ankerpunkt", sagt nichts über Stärke aus
# Bsp.: bei passender Wahl sogar Null möglich
lernen$stunden_neg = lernen$stunden - (- 1.415)
modell3b = stan_glm(punkte ~ stunden_neg * format, data=lernen)

# Haupteffekt formatBetreuung nun ~0:
print(modell3b, digits=2)

# Grund ist, dass wir den Referenzpunkt so gewählt haben, dass sich Linien überschneiden
cf3b = coef(modell3b)
ggplot(lernen, aes(stunden_neg, punkte, color=format, group=format)) +
  geom_point(alpha=.25) +
  geom_abline(intercept=cf3b["(Intercept)"],
              slope=cf3b["stunden_neg"],
              linetype = 2) +
  geom_abline(intercept=cf3b["(Intercept)"] + cf3b["formatBetreuung"],
              slope=cf3b["stunden_neg"] + cf3b["stunden_neg:formatBetreuung"],
              linetype = 2) +
  annotate("point", x = 0, y = cf3b["(Intercept)"], color = "red", size = 7, shape=1) +
  geom_line(aes(y=predict(modell3)), linewidth=1) +
  labs(subtitle="modell3b: anderer Referenzpunkt", y="Testpunkte") +
  xlim(-1, 12) +
  theme_minimal()

# Was passiert, wenn wir Referenzgruppe tauschen?
lernen$format2 = relevel(lernen$format, ref="Betreuung")
modell4 = stan_glm(punkte ~ stunden5 * format2, data=lernen)
modell4

# Vorzeichen wechseln und Steigung (stunden5) ist nun die der anderen Gruppe
coef(modell3)
coef(modell4)


####

# Der Datensatz airquality ist im R-Package 'datasets' enthalten
# Wind in mph (Meilen pro Stunde), Temperatur in °Fahrenheit, Ozon in ppb (part per billion)
# Wir zentrieren den Datensatz wieder
air = airquality |>
  filter(!is.na(Ozone)) |>
  mutate(temp80 = Temp - 80,
         wind10 = Wind - 10)
hist(air)

# Interaktion zwischen Temperatur & Luft
# (Hinweis: Modell ist in dieser Form keine gute Beschreibung des Datensatzes.)
m_ozon = stan_glm(Ozone ~ temp80 * wind10, data=air)
m_ozon

# Visuelle Darstellung: Ozon in Abhängigkeit von Temperatur bei verschiedenen Windstärken
grid <- expand.grid(
  temp80=seq(55-80, 100-80, length.out=100),
  wind10=c(-5, 0, 5)
)
grid$ozon <- predict(m_ozon, newdata=grid)

ggplot(grid, aes(temp80+80, ozon, color=factor(wind10+10))) +
  geom_line(linewidth=1) +
  labs(x="Temperatur (°F)", y="Ozon (ppb)",
       color="Wind (mph)") +
  theme_minimal()

# Ozon in Abhängigkeit von Wind bei verschiedenen Temperaturen
grid2 <- expand.grid(
  wind10=seq(-8, 11, length.out=100),
  temp80=c(-10, 0, 15)
)
grid2$ozon <- predict(m_ozon, newdata=grid2)

ggplot(grid2, aes(wind10+10, ozon, color=factor(temp80+80))) +
  geom_line(linewidth=1) +
  labs(x="Wind (mph)", y="Ozon (ppb)",
       color="Temperatur (°F)") +
  theme_minimal()

# Darstellung als Konturen- bzw. Rasterplot: Ozon ist nun auf Z-Achse (Farbe)
flaeche <- expand.grid(
  temp80=seq(55-80, 100-80, length.out=80),
  wind10=seq(-10, 11, length.out=80)
)
flaeche$ozon <- predict(m_ozon, newdata=flaeche)

ggplot(flaeche, aes(temp80+80, wind10+10, z=ozon)) +
  geom_raster(aes(fill=ozon)) +
  geom_contour(color="white", linewidth=.35) +
  geom_point(data=air, aes(Temp, Wind), inherit.aes=FALSE, alpha=.35, size=.6) +
  scale_fill_viridis_c(name="Vorhersage") +
  labs(x="Temperatur (°F)", y="Wind (mph)") +
  theme_minimal()
