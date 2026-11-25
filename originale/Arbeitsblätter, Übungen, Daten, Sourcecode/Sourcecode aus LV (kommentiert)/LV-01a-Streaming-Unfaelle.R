# Laden der Hilfsfunktionen
source('patel-utils.R')

# Daten von FARS (tödliche Unfälle):
# https://www.nhtsa.gov/research-data/fatality-analysis-reporting-system-fars 
# Daten von FHWA (Verkehraufkommen):
# https://www.fhwa.dot.gov/policyinformation/travel_monitoring/tvt.cfm
# Spotify-Charts: https://charts.spotify.com/ von USA,
# z.B. https://charts.spotify.com/charts/view/regional-us-daily/2024-05-22

# Datenset
daily = get_daily_data()

# Erste Übersicht mit Histogram
hist(daily$streams_m)
hist(daily$streams_m, breaks = 30)

hist(daily$fatalities)
mean(daily$fatalities)
median(daily$fatalities)

# Behauptung des Papers: Streaming hängt mit Unfällen zusammen
# Zumindest im direkten Plot ist kein Zusammenhang zu erkennen
plot(daily$streams_m, daily$fatalities)

### Einschub: Korrelation
set.seed(123)

# Beispiel-Daten (rnorm() erzeugt Zufallszahlen, die normalverteilt sind)
df = data.frame(x = rnorm(100))
df$y = 2*df$x # y ist zu 100% durch x erklärt
cor(df$x, df$y) # 1
plot(df$x, df$y)
abline(a=0, b=2, col="blue")

df$y = 2*df$x + rnorm(100, 0, 0.2)
cor(df$x, df$y) # 0.99: y ist immer noch größtenteils durch x erklärt
plot(df$x, df$y)
abline(a=0, b=2, col="blue")

df$y = 2*df$x + rnorm(100, 0, 1)
cor(df$x, df$y) # 0.87: y hat immer noch sehr starke Korrelation mit x
plot(df$x, df$y)
abline(a=0, b=2, col="blue")

df$y = 2*df$x + rnorm(100, 0, 3)
cor(df$x, df$y) # 0.48: y hat Korrelation mit x,
# einzelne Punkte weichen schon stark ab
plot(df$x, df$y)
abline(a=0, b=2, col="blue")

df$y = 2*df$x + rnorm(100, 0, 5)
cor(df$x, df$y) # 0.18: y hat schwache Korrelation mit x
# in der Realität sieht man viele schwache Korrelationen
plot(df$x, df$y)
abline(a=0, b=2, col="blue")

###

# Korrelation praktisch gar nicht vorhanden...
# Wie kann Paper dann etwas finden?
cor(daily$fatalities, daily$streams_m)

# Wochende deutlich mehr Unfälle als unter der Woche
boxplot(fatalities ~ dow, data=daily)
# Im Sommer mehr Unfälle als im Winter
boxplot(fatalities ~ week, data=daily)

# Alternative Darstellung der Wochen
library(ggplot2)

ggplot(daily, aes(as.numeric(week), fatalities)) + 
  geom_point(alpha=0.1) + geom_smooth() +
  theme_minimal()

summary(daily)

# Setzen wir nun ein erstes Regressionsmodell auf

library(rstanarm)

# Wir fangen mit einem ganz einfachen Modell an:
# Todesfälle in Abhängigkeit vom Wochentag
m1 = stan_glm(fatalities ~ dow, data = daily)
m1
# Bei Grupenvariablen (Faktoren) ist der Referenzfall im Intercept
# enthalten. Deshalb gibt es keinen Koeffizienten für Sonntag (Tag 0)
# Intercept=118: Basisfall, alle Variable=0 bzw. bei Faktoren der Referenzfall
# hier also: 118 Todesfälle an einem Sonntag (Referenz für Wochentag)
# Bsp. dow2 (Dienstag) -23: an einem Dienstag gibt es im Vergleich zu einem
# Sonntag um 23 Todsfälle weniger
# Bsp. dow6 (Samstag) +13: an einem Samstag gibt es im Vergleich zu einem
# Sonntag um 13 Todsfälle mehr

# Fügen wir streams hinzu bzw. um es einfacher interpretierbar zu machen,
# skalieren wir Streams auf eine Einheit von 100 Millionen
daily$streams_m100 = daily$streams_m / 100

m2 = stan_glm(fatalities ~ dow + streams_m100, data = daily)
m2
print(m2, digits=2)
# Intercept = Basisfall: 0 Streams, Sonntag -> 121 Tote
# Bsp dow2 (Dienstag): an einem Dienstag gibt es im Vgl. zu einem Sonntag
# (bei gleicher Anzahl an Streams) um 23 Tote weniger
# streams_m100 = -4.8: an anonsten vergleichbaren Tagen gibt es je 100M Streams
# um ca. 5 Tote weniger.

# Hm. Das widerspricht recht deutlich dem Paper. Was könnte da los sein?
# Wie gut erklärt unser Modell den Datensatz?
mean(bayes_R2(m2))
# 33% der Varianz der Todesfälle wird von unserem Modell erklärt.
# Im Umkehrschluss: fast 70% der Varianz bleibt unerklärt.
# Das Modell lässt also noch viel aus.

# Fügen wir ein paar weitere Variablen hinzu.
# Das Modell versucht die Koeffizienten wieder so zu berechnen,
# dass die Daten möglichst gut erklärt werden
m3 = stan_glm(fatalities ~ dow + streams_m100 + holiday + year, data = daily)
m3
# Basisfall (intercept): Sonntag, 2017, kein Feiertag, 0 Streams -> 110 Tote
# holiday=7: im Schnitt gibt es an Feiertagen um 7 Tote mehr am Tag
# year2022=14: im Vergleich zu 2017 (=Referenzfall für year-Faktor), gab es
# 2022 um 14 Tote mehr pro Tag.
# Aber! streams_m100=3.5: je 100M Streams gibt es um 3-4 Tote mehr!
# Vorher war es noch negativ. Wie kann das sein?
# Grund ist, dass offensichtlich einige der Information von Jahr & Feiertag
# in m2 sich hinter streams_m100 "versteckt" hat.

# Im vergleich sehen wir, dass Fatalities und Streams sich nicht
# "synchron" entwickeln..
boxplot(streams_m100 ~ year, data=daily)
boxplot(fatalities ~ year, data=daily)

# Anders dargestellt
daily |>
  group_by(year) |>
  summarize(fatalities = sum(fatalities), streams_m100=sum(streams_m100)) |>
  ggplot(aes(streams_m100, fatalities, label=year)) +
  geom_point() + geom_text(vjust=-1) + theme_minimal()
# Offensichtlich war der "Zusammenhang" Streams<>Todesfälle über die Jahe
# sehr unterschiedlich. In m2 wurde das alles durch einen einzigen
# Koeffizienten dargestellt. In m3 können wir nun den Effekt besser
# unterscheiden und deshalb ist streams_m100 in m3 wohl eine bessere Erklärung
# als es streams_m100 in m2 war.

library(daatools)

### Einschub
# Nehmen wir auch noch die Woche mit auf, um Sommer & Winter zu unterscheiden
# Wie wir weiter oben gesehen haben, ist der Zusammenhang nicht linear
# (sieht wie ein "Hügel" aus). Wir modellieren diesen Zusammenhang mithilfe
# von Splines ("Kurven")

# die Library müssen Sie vlt erst mit install.packages("splines") installieren 
library(splines)

daily$week_n = as.numeric(daily$week)
m3b = stan_glm(fatalities ~ dow + streams_m100 + holiday + year + ns(week_n, 5),
               data = daily)
print(m3b, digits=3)
# streams_m100 ist leicht abgeschwächt, auf +3 Tote je 100M Streams

# so sieht die errechnete Wochenkurve des Modells aus
# (vgl. mit Grafiken bzw. Boxplot weiter oben)

week_seq = 1:52
marginw = margin_curve(m3b, daily, "week_n", week_seq, draws=1000)
ggplot(marginw, aes(value, estimate)) +
  geom_line() + ylim(0, 125) +
  geom_ribbon(aes(x=value, ymin=lower, ymax=upper), alpha=0.2) +
  xlab("Woche") + ylab("Todesfälle") + theme_minimal()
#####


# Greifen wir die Idee des Papers auf: neue Tracks sind für mehr Todesfälle
# verantwortlich. Hypothese: ungewohnte (neue) Musik zieht mehr Aufmerksamkeit
# auf sich. Im Datensatz verwenden wir dazu old_streams & new_streams.
# Skalieren wir wieder auf 100M Streams
daily$old_streams_m100 = daily$old_streams_m / 100
daily$new_streams_m100 = daily$new_streams_m / 100

m4 = stan_glm(fatalities ~ dow + new_streams_m100 + old_streams_m100 + holiday + year,
              data = daily)
print(m4, digits=3)
# new_streams_m100=17.7: je 100M Streams "neuer" Tracks sterben fast 18 Personen mehr
# Anzahl alter Streams hat hingegen fast keinen Einfluss.

plotcoef(m4, "beta")

# vollständige Wahrscheinlichkeitsverteilung des Holiday-Koeffizienten
plothist(m4, "holiday")

# selbes für new_streams
# Mit 95% Wahrscheinlichkeit gibt es je 100M neuer Streams zwischen +3.8 bis +31
# mehr Verkehrstote
plothist(m4, "new_streams_m100")

# Bei old_streams sind wir im Unklaren: der Wert kann sowohl positiv als auch
# negativ sein. D.h. unsere Daten bzw. unser Modell sind konsistent mit
# "keinem Effekt"
plothist(m4, "old_streams_m100")

# Das Modell erklärt inzwischen 44% der Varianz in den Todesfällen
mean(bayes_R2(m4))

### Einschub:
# Wenn wir wieder Wochen mit aufnehmen
m4b = stan_glm(fatalities ~ dow + new_streams_m100 + old_streams_m100 +
                 holiday + year + ns(week_n, 5), 
               data = daily)
print(m4b, digits=3)
plothist(m4b, "new_streams_m100", compVal = 0)
# Im Median sind je 100M neuer Streams 10 Tote mehr zu beklagen.
# Im 95%-Signifikanzniveau ist das Ergebnis aber nicht mehr eindeutig, denn
# das 95%-HDI reicht von -1 .. +21. Mit 96% Wahrscheinlichkeit ist der
# Einfluss positiv (sehr starke Tendenz).

# Dank der Wochen erklärt das Modell nun 62% der Varianz in den Todesfällen.
mean(bayes_R2(m4b))
###