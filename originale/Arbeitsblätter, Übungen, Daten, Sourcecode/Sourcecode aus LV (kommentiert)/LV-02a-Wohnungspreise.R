library(dplyr)
library(ggplot2)
library(rstanarm)
library(daatools)

# Laden des Datensatzes (synthetisch erzeugter Datensatz zu Wohnungspreisen)
df = read.csv("daten/wohnungspreise.csv")

# Erster Überblick
info(df)
hist(df)

# Preis hängt sowohl vom Wohnungsfläche als auch Anzahl der Zimmer ab.
plot(df$wohnflaeche, df$preis)
boxplot(preis ~ zimmer, data=df)

# Erstes Modell
m1 = stan_glm(preis ~ wohnflaeche, data=df)
# Basisfall: Wohnung mit 0m² Fläche → 92000€
# Je m² Unterschied, um 3100€ mehr
m1

# Basisfall ist schwer kommunizierbar, daher zentrieren wir die
# Wohnungsfläche auf einen sinnvolleren Wert.
# wohnflaeche95==0 ist identisch mit wohnflaeche==95
df$wohnflaeche95 = df$wohnflaeche - 95

m2 = stan_glm(preis ~ wohnflaeche95, data=df)
# Nun ist der Basisfall wohnflaeche95=0, das heißt Wohnfläche = 95 Quadratmeter.
# Also: Im Schnitt kostet eine 95m² Wohnung 387.000€.
# Je m² Unterschied, um 3100€ mehr (Steigung ändert sich nicht!)
m2

# Vollständige Verteilung
plothist(m2, "wohnflaeche95")

# Check, ob das Sampling funktioniert hat
info(m2)
check_sampling(m2) # alle Checks ok
bayesplot::mcmc_trace(m2) # auch hier keine Auffälligkeiten

# posterior-Predictive-Check: bildet unser Modell die Daten gut ab bzw.
# erfasst unser Modell die Eigenschaften des Datensatzes gut?
diagnose_density(m2) # fast schon zu perfekt :o)
diagnose_fit(m2)

# gibt es systematische Abweichungen?
diagnose_y_vs_yhat(m2) # nichts zu sehen
diagnose_residual(m2)


# Einschub: Zentrieren
#
# Wenn Sie die beiden Plotts vergleichen, sollte Ihnen folgendes auffallen:
# 1) Die Punktewolke sieht in beiden Fällen völlig identisch aus. 
# 2) Auch die Y-Achse ist dieselbe.
# 3) Die Steigung der Regressionsgerade, d.h. der Zusammenhang zwischen
#    Wohnfläche und Preis, hat sich auch nicht verändert. 
# 4) Auch die Vorhersagen, Residuen und die Modellgüte bleiben unverändert.
# 5) Es hat sich nur der Wert der X-Achse verändert.
#    Genau das hat die Transformation auf wohnflaeche95 bewirkt.
#    Wir haben also nur den Bezugspunkt der Interpretation verschoben.
# 6) Deshalb ist in Folge der Intercept anders.

plot(df$wohnflaeche, df$preis, xlim=c(0, 160), ylim=c(0,6.5e5))
abline(92100, 3105, col="red") # m1
abline(v=0, lty=2, col='grey') # Null-Linie == Basisfall
abline(h=92100, lty=2, col='grey') # Intercept

plot(df$wohnflaeche95, df$preis, xlim=c(-95, 160-95), ylim=c(0,6.5e5))
abline(387000, 3105, col="red") # m2
abline(v=0, lty=2, col='grey') # Null-Linie == Basisfall
abline(h=387000, lty=2, col='grey') # Intercept
##

# Zweites Modell, Preis in Abhängigkeit von Anzahl der Zimmer.
m3 = stan_glm(preis ~ zimmer, data=df)
# Auch hier ist die Kommunikation des Basisfalls schlecht:eine Wohnung mit 0 Zimmern.
m3

# Daher zentrieren wir die Variable wieder etwas.
# zimmer4==0 bedeutet also vier Zimmer
df$zimmer4 = df$zimmer - 4

m4 = stan_glm(preis ~ zimmer4, data=df)
# Basisfall: Wohnung mit vier Zimmern hat einen Preis von ca. 370.000 Euro.
# Je Zimmer Unterschied kostet eine vergleichbare Wohnung um 31.000 Euro mehr. 
m4

# Nehmen wir nun beide Variablen in das Modell auf
# und sehen uns die Abhängigkeit zum Preis an. 
m5 = stan_glm(preis ~ wohnflaeche95 + zimmer4, data=df)
# Der Basisfall ist nun eine 95 Quadratmeter Wohnung mit vier Zimmern.
# Sie kostet ca. 390.000 Euro.
# Bei gleicher Zimmeranzahl sind Wohnungen je 1m² mehr um 3.450 Euro teurer.
# (In unserem Modell heißt das also "Wohnungen mit gleicher Anzahl an Zimmern". )
# Der Koeffizient für Zimmer ist nun negativ!
# Interpretation: bei vergleichbaren Wohnungen (im Modell: gleiche Wohnungsfläche) ist
# je Zimmer mehr der Preis um circa 9.000 Euro niedriger.
m5

# Wie kann das sein?
# Eine Hypothese: Käufer*innen bevorzugen Wohnungen mit großen (dafür weniger) Zimmern
# gegenüber Wohnungen mit vielen kleinen Zimmern.
# Das Modell zeigt uns diesen Zusammenhang, erklärt aber nicht, warum er besteht.
# Die Vorliebe für größere Zimmer ist eine mögliche Erklärung, die wir anhand dieser
# Daten allein nicht bestätigen (oder widerlegen) können.

# Die beiden Modelle beschreiben unterschiedliche Fragestellungen:
# Modell 4 fragt: Wie hängt der Preis von Anzahl der Zimmer ab?
# Modell 5 fragt: Welchen Einfluss hat die Anzahl der Zimmer bei Wohnungen mit vergleichbarer Wohnungsfläche?

# Man kann übrigens sogar in den Daten den Zusammenhang sehen, wenn wir uns 
# ein kleines Stück aus den Daten herausschneiden, also die Wohnungsfläche
# vergleichbar machen (alle Wohnungen [fast] gleich groß). 
boxplot(preis ~ zimmer, data = filter(df, wohnflaeche>=95, wohnflaeche<105))
