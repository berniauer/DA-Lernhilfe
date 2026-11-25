# StackOverflow_Lösung.R

```r
# Stack Overflow: Tabs, Spaces und Jahresgehalt

# Datensatz und Fragestellung
# ===========================
#
# StackOverflow-survey.csv enthält einen Auszug aus einer weltweiten
# Stack-Overflow-Umfrage mit 6543 Personen aus 18 Ländern. Die Datei
# enthält nur Vollzeitbeschäftigte. Jede Zeile beschreibt eine Person.
# Die Angaben stammen aus Selbstauskünften und werden zunächst unverändert
# eingelesen.
# 
# **Variablen**
# 
# - `Country`: Land der befragten Person.
# - `YearsProgram`: Programmiererfahrung in Jahresintervallen
# - `TabSpaces`: angegebene Einrückungspraxis: Tabs, Spaces oder Both
# - `CompanySize`: Anzahl der Beschäftigten des Unternehmens
# - `LearningNewTech`: Zustimmung zur Bedeutung des Erlernens neuer Technologien
# - `StackOverflowCopiedCode`: berichtete Häufigkeit des Kopierens von Code von Stack Overflow.
# - `Salary`: angegebenes Jahresgehalt in US-Dollar, nicht Monatsgehalt!
# - `Lang.*`: zwölf Indikatoren für verwendete Programmiersprachen; 1 steht
#           für verwendet, 0 für nicht verwendet. Mehrfachnennungen sind möglich.
# 
# **Hinweis**
# 
# Im Skript entstehen zusätzlich LogSalary (Logarithmus des Jahresgehalts),
# Erfahrung und Firmengroesse (metrische Näherungen der Kategorien) sowie
# Erfahrung20plus (Indikator für die offene Oberkategorie).

# **Aufgabe**
#
# Untersuchen Sie mit den Rechenschritten, ob ein Zusammenhang zwischen
# Einrückungspraxis und Gehalt besteht. Begründen Sie Ihre Antworten anhand
# der Ausgaben und Diagramme. Trennen Sie Beobachtung, Interpretation und
# Beurteilung; nennen Sie bei Zahlen jeweils Skala und Vergleichsgruppe.


# 1. Vorbereitung
# ===============

library(dplyr)
library(ggplot2)
library(rstanarm)
library(bayesplot)
library(daatools)

set.seed(2026)
theme_set(theme_minimal())

## Anmerkungen und (mögliche) Antworten
# 
# `dplyr` dient der Datenaufbereitung, `ggplot2` der Darstellung, `rstanarm`
# der Bayes-Regression, `bayesplot` den Traceplots und `daatools` den
# Zusammenfassungen und Diagnosen. `set.seed()` legt den Zufallsstart fest;
# Split und Modellaufrufe haben zusätzlich eigene Seeds. Gleiche Seeds
# unterstützen die Wiederholbarkeit innerhalb derselben Softwareumgebung.
# 
# Untersucht wird die berichtete Einrückungspraxis, während die verwendeten
# Sprachen eigene Merkmale sind. Die Daten erlauben Aussagen über einen
# Zusammenhang; eine **kausale** Wirkung des Einrückungsstils auf das Gehalt ist damit
# nicht nachgewiesen. Das liegt in der Art der Daten begründet: sie sind eine
# einmalige Erhebung, wir haben also keine "vorher/nachher"-Daten, bei der
# Personen von einer Einrückung auf die andere gewechselt sind. Auch wissen
# wir wenig darüber, wie repräsentativ das StackOverflow-Sample ist. In
# Summe können wir also nur eine beobachtete Korrelation beschreiben,
# aber keinen kausalen Zusammenhang ableiten.



# 2. Daten laden und sichten
# ==========================
#
# **Leitfragen**
# 
# - Welche Datentypen, Häufigkeiten oder Wertebereiche fallen Ihnen auf?
# - Wie beurteilen Sie die Gehaltsangaben und ihre Darstellung auf den
#   beiden Skalen? Welche Angaben würden Sie näher prüfen?

# Arbeitsverzeichnis: Ordner mit CSV-Datei
roh = read.csv("StackOverflow-survey.csv", stringsAsFactors = FALSE, na.strings = c("", "NA"))
colnames(roh)
dim(roh)
str(roh)
info(roh)

# **Gehalt näher ansehen**

quantile(roh$Salary, c(0, .01, .05, .25, .5, .75, .95, .99, 1))
head(roh[order(roh$Salary), c("Country", "Salary", "TabSpaces")], 15)

plothist(roh$Salary, main = "Jahresgehalt [USD]")
# nur Bereich >1000 USD anzeigen
plothist(roh$Salary, main = "Jahresgehalt (logarithmiert)",
         transform = log10, xlim=c(3, 6))


## Anmerkungen und (mögliche) Antworten
# 
# **1. Datentypen, Häufigkeiten und Wertebereiche.** Die Datei enthält
# 6543 Personen, 19 Variablen und 18 Länder. Land, Erfahrung, Einrückung,
# Firmengröße, Lernhaltung und Kopierhäufigkeit sind Strings (Kategorien).
# Salary ist numerisch, die zwölf Sprachvariablen sind 0/1-Indikatoren
# (Mehrfachnennungen möglich). Es gibt beim Einlesen keine NA-Werte. 
# Die Angaben zur Firmengröße enthalten jedoch „weiß nicht“ und verweigerte
# Antworten, die inhaltlich fehlen.
# 
# **2. Gehaltsangaben und Darstellung.** Die Spanne von etwa 0,015 bis
# 195.000 USD enthält offensichtlich ungeeignete Jahresgehälter. Auf der
# Originalskala ist die Verteilung rechtsschief; die logarithmische Darstellung
# macht relative Abstände besser sichtbar. Der hier gewählte Ausschnitt
# `xlim = c(3, 6)` zeigt ausschließlich 1.000 bis 1.000.000 USD und blendet
# kleinere (unsinnige?) Angaben aus.
# 
# Bei kleinen positiven Beträgen ist die Fehlerursache nicht bekannt:
#   Monatsangabe, Tausender-Einheit oder Eingabefehler bzw. -verweigerung sind
# mögliche Erklärungen. Eine automatische Korrektur ist nicht möglich.



# 3. Daten aufbereiten
# ====================
#
# **Leitfragen**
# 
# - Welche Zeilen werden aus welchen Gründen ausgeschlossen, und wie
#   verändern sich dadurch Umfang und Zusammensetzung der Stichprobe?
# - Welche Annahmen stecken in den Referenzgruppen, der Gehaltsuntergrenze
#   und der metrischen Umrechnung der Kategorien? Beurteilen Sie diese.

# Führen Sie einfach alle Umwandlungen bis "Umwandlungen-Ende" aus.

daten0 = roh
# Unbekannt als NA setzen
daten0$CompanySize[daten0$CompanySize %in% c("I don't know", "I prefer not to answer")] = NA

# Faktoren erzeugen
daten0$LearningNewTech = factor(daten0$LearningNewTech)
daten0$StackOverflowCopiedCode = factor(daten0$StackOverflowCopiedCode)

# Faktoren in passende Reihenfolge bringen
jahre_stufen = c("Less than a year", paste(1:19, "to", 2:20, "years"),
                 "20 or more years")
daten0$YearsProgram = factor(daten0$YearsProgram, levels = jahre_stufen)

firma_stufen = c("Fewer than 10 employees", "10 to 19 employees",
                 "20 to 99 employees", "100 to 499 employees",
                 "500 to 999 employees", "1,000 to 4,999 employees",
                 "5,000 to 9,999 employees", "10,000 or more employees")
daten0$CompanySize = factor(daten0$CompanySize, levels = firma_stufen)
daten0$TabSpaces = factor(daten0$TabSpaces, levels = c("Tabs", "Spaces", "Both"))

# Referenzgruppen manuell setzen
daten0$YearsProgram = relevel(daten0$YearsProgram, ref = "20 or more years")
daten0$CompanySize = relevel(daten0$CompanySize, ref = "20 to 99 employees")
daten0$Country = relevel(factor(daten0$Country), ref = "United States")
daten0$StackOverflowCopiedCode = relevel(daten0$StackOverflowCopiedCode, ref = "Once or twice")

# Erfahrung auch als Zahl statt Faktor
daten0$Erfahrung = c(0.5, seq(1.5, 19.5, 1), 20)[
  match(daten0$YearsProgram, jahre_stufen)]
# Eigener Indikator, ob Erfahrung größer 20 Jahre (0/1)
daten0$Erfahrung20plus = as.integer(daten0$YearsProgram == "20 or more years")
# Auch Firmengröße als Zahl statt Faktor
daten0$Firmengroesse = c(5, 14.5, 59.5, 299.5, 749.5, 2999.5, 7499.5, 15000)[
  match(daten0$CompanySize, firma_stufen)]

# einige Hilfsvariablen
sprachen = names(roh)[startsWith(names(roh), "Lang.")]
# Umwandlungen-Ende

# **Basis-Datensatz: nur vollständige mit positivem Salary**
vollstaendig = complete.cases(daten0)
positiv = is.finite(daten0$Salary) & daten0$Salary > 0
basis = droplevels(daten0[vollstaendig & positiv, ])
basis$LogSalary = log(basis$Salary)

# **Datensatz: Mindestgehalt: 5000 USD/Jahr**
untergrenze = 5000
daten = droplevels(basis[basis$Salary >= untergrenze, ])
daten$LogSalary = log(daten$Salary)

# **Übersicht**
print(data.frame(
  Schritt = c("Eingelesen", "Vollständige Angaben", "Zusätzlich Salary > 0",
              "Zusätzlich Salary >= 5000"),
  Anzahl = c(nrow(roh), sum(vollstaendig), nrow(basis), nrow(daten))))

# **per Land: Gehalt kleiner Untergrenze?**
with(daten0, table(Country, Salary < untergrenze))

# **per Einrückung: Gehalt kleiner Untergrenze?**
with(daten0, table(TabSpaces, Salary < untergrenze))

# **Einrückung per Land**
with(daten, table(Country, TabSpaces))

# **Einrückung je Erfahrung**
with(daten, table(YearsProgram, TabSpaces))


## Anmerkungen und (mögliche) Antworten
# 
# **1. Ausschlüsse und Zusammensetzung.** 83 unbekannte und 19 verweigerte
# Angaben zur Firmengröße behandeln wir als fehlend (NA). Es ist eine erste *kontroverse*
# Entscheidung. Es ist nicht zwingend notwendig, dass wir das tun. Denn die beiden Werte
# stellen valide Gruppen bzw. Antworten dar. Fachlich gibt es keinen zwingenden Grund,
# die fehlende Firmengröße auszuschließen. Für eine folgende Umwandlung in metrische
# Form, also Firmengröße als Zahl, können wir mit diesen Angaben aber nichts anfangen.
# Damit wir in Folge das metrische Modell vergleichen können, haben wir uns
# entschlossen, diese 102 Personen aus der Analyse auszuschließen.
# 
# Die vollständige Ausgangsbasis umfasst danach 6441 Personen. Als Grenze für das
# Jahresgehalt legen wir (willkürlich!) 5.000 USD fest. Diese zusätzliche Grenze 
# entfernt weitere 343 Zeilen; es bleiben 6098 Personen übrig. Die Ausschlüsse haben
# einen Bias: in den Rohdaten liegen bspw. 149 indische Angaben unter dieser Grenze.
# Länder mit niedrigerem Gehaltsniveau und die Einrückungsgruppen sind unterschiedlich
# betroffen. Man könnte also argumentieren, dass es sich nicht um eine unverzerrte
# Stichprobe handelt.
# 
# **2. Annahmen der Kodierung und Bereinigung.** 5.000 USD ist (wie erwähnt) eine
# willkürlich gewählte Arbeitsgrenze. Sie entfernt zweifelhafte Angaben und
# möglicherweise auch korrekte sehr niedrige Gehälter. (Wir werden deshalb später
# auch andere Grenzen prüfen.) Eine Obergrenze ist anhand der vorhandenen Werte
# (vorerst) nicht begründet.
# 
# Mit Ausnahme von "Strongly Disagree" in "LearningNewTech", welche nur 6 Antworten
# hat, haben alle anderen Variablen und Gruppen ausreichend viele Antworten, so
# dass wir von einer stabilen Schätzung des Intercepts und der Gruppenunterschiede
# ausgehen können.
# 
# Aus Interesse ergänzen wir Erfahrung und Firmengröße um deren metrischen Varianten
# (näherungsweise durch Mittelpunkte; 0,5 Jahre sowie 5 bzw. 15.000 Beschäftigte
# sind angenommene Vertreter der offenen Kategorien.) Da die Kategorie
# „20 or more years“ mindestens 20 Jahre umfasst, geben wir hier noch einen zusätzlichen
# Indikator hinzu.



# 4. Beschreibende Auswertung
# ===========================
#
# **Leitfragen**
# 
# - Welche Gehaltsunterschiede zeigen die Gruppenvergleiche insgesamt
#   und innerhalb der Länder?
# - Welche Aussagen lassen diese Vergleiche zur Fragestellung bereits zu,
#   und welche Fragen bleiben offen?

daten |> group_by(TabSpaces) |>
  summarise(n = n(), Mittelwert = mean(Salary), Median = median(Salary),
            Q25 = quantile(Salary, .25), Q75 = quantile(Salary, .75))

# **Wo haben wir wie viele Daten? (in Prozent)**
round(prop.table(with(daten, table(TabSpaces, Country)), margin = 1), 3)*100

# **Gehalt als Boxplots**
gplot(daten, aes(TabSpaces, Salary)) + geom_boxplot() +
  labs(x = "Einrückung", y = "Jahresgehalt [USD]")

ggplot(daten, aes(TabSpaces, Salary)) + geom_boxplot() +
  scale_y_log10() +
  facet_wrap(~ Country, ncol = 5) +
  labs(x = "Einrückung", y = "Jahresgehalt [USD, logarithmisch]")

ggplot(daten, aes(Erfahrung, LogSalary)) +
  geom_point(alpha = .1, position = position_jitter(width = .15, height = 0)) +
  geom_smooth(method = "loess", formula = y ~ x) +
  facet_wrap(~ TabSpaces) +
  labs(x = "Programmiererfahrung [Näherung, Jahre]", y = "log(Jahresgehalt / USD)")


## Anmerkungen und (mögliche) Antworten
# 
# **1. Gruppenvergleiche insgesamt und nach Land.** Die bereinigten Daten
# enthalten 2.369 Tabs-, 2.870 Spaces- und 859 Both-Angaben. Die arithmetischen
# Mittelwerte betragen ungefähr 59.100, 74.200 und 61.400 USD; die Mediane
# 52.900, 64.500 und 55.700 USD. Ein erstes Indiz, dass Spaces insgesamt höher
# liegen. Zugleich zeigen die Länderdiagramme sehr unterschiedliche Gehaltsniveaus;
# auch Gruppenabstände sind nicht überall gleich groß. Die Verteilung der Länder
# innerhalb der Gruppen ist unterschiedlich.
# 
# **2. Aussagekraft.** Die beschreibenden Vergleiche belegen zunächst einen
# rein bivariaten Zusammenhang -- lässt also andere Variablen unberücksichtigt. Sie
# beantworten also noch nicht, wie viel davon bei vergleichbarem Land, Erfahrung und
# weiteren Merkmalen verbleibt. Nebenbei bemerkt: internationale Gehälter (in USD
# umgerechnet) enthalten keine Kaufkraftbereinigung.
# 
# Die log-Skala ist für relative Vergleiche sinnvoll; sie garantiert aber noch
# keine passenden Modellresiduen.



# 5. Trainings- und Testdaten
# ===========================
#
# **Leitfragen**
# 
# - Wozu werden die Daten aufgeteilt, und welche Größen haben die Teilmengen?
# - Welche Folgen hätte eine unterschiedliche Gruppenanzahl?

split_random(daten, 5000, "training", "test", seed = 2026)
c(Training = nrow(training), Test = nrow(test))

# **Haben die Train- und Testdaten die selben Gruppen?**

for (variable in c("Country", "YearsProgram", "CompanySize", "LearningNewTech",
                   "StackOverflowCopiedCode", "TabSpaces")) {
  cat(variable, ": ")
  group_diff = setdiff(unique(as.character(test[[variable]])),
                       unique(as.character(training[[variable]])))
  cat(ifelse(length(group_diff) > 0, group_diff, "Keine Differenz\n"))
}

## Anmerkungen und (mögliche) Antworten
# 
# **1. Zweck und Größen.** 5.000 Personen werden zum Trainieren der fünf
# Vergleichsmodelle verwendet; 1098 bleiben für die Testauswertung zurück. Alle
# Modelle nutzen dieselben Trainings- bzw. Testzeilen; die Modelle sind also
# vergleichbar. Ein einzelner zufälliger Split liefert allerdings nur eine
# begrenzte Beurteilung; für stabilere Aussagen müssten wir mehrere Splits
# rechnen, um zu sehen, wie sensitiv, Koeffizienten und andere Effekte gegenüber
# der Split-Auswahl sind. 
# 
# **2. Gruppen im Training und Test.** Beide Datensets enthalten alle Gruppen.
# Eine im Training unbekannte Testgruppe hat keinen geschätzten Parameter und
# die Vorhersage würde fehlschlagen. Eine Trainingsgruppe, die im Test fehlt,
# verhindert Vorhersagen nicht, wird dort aber auch nicht überprüft.
# Das ist der Sinn des Tests, ob alle Gruppen in beiden Datensets vorhanden sind.



# 6. Modell 1
# ===========
#
# **Leitfragen**
# 
# - Was bedeuten Intercept, TabSpaces-Koeffizienten und sigma in diesem Modell?
# - Welche Annahmen über das Gehalt verwendet das Modell?
# - War Sampling ok? Wie beurteilen Sie die Berechnung anhand von Rhat, n_eff, MCSE,
#   Traceplots?
# - Was sagt die Prüfung von mean_PPD aus, und welche Aussagen über die
#   Eignung eines Modells sind durch gutes Sampling allein nicht gedeckt?

modell1 = stan_glm(Salary ~ TabSpaces, data = training, seed=2026, refresh=0)

check_sampling(modell1)
mcmc_trace(modell1, pars = c("TabSpacesSpaces", "sigma"))

modell1

## Anmerkungen und (mögliche) Antworten
# 
# **1. Parameter und Vergleichsgruppe.** Der Intercept beträgt knapp über 59.000 USD
# und bezeichnet das mittlere Jahresgehalt der Tabs-Gruppe (=Referenzgruppe). Der
# Spaces-Koeffizient von ca. 14.000 USD ist die Differenz gegenüber Tabs; analog der 
# Both-Koeffizient (ca. 3.800 USD mehr als Tabs). Sigma beträgt in etwa 37.000 USD und
# beschreibt die verbleibende Streuung einzelner Gehälter um ihren Gruppenmittelwert;
# 95% der Werte liegen also im Intervall $\pm 2 \sigma \approx \pm 74.000$ USD um die
# Gruppenmittelwerte.
# 
# **2. Annahmen.** Unterstellt werden bedingt normalverteilte Gehälter mit
# gleicher Residuenstreuung in allen Gruppen sowie unabhängige Beobachtungen.
# Die Normalverteilung erlaubt dabei auch negative Gehälter! (Ein weiterer Grund,
# warum die Log-Transformation hier sinnvoll ist.) Weitere Variablen werden noch
# nicht berücksichtigt. Wir verwenden die voreingestellten, automatisch
# skalierten, schwach informativen Priors.
# 
# **3. Sampling.** Die mit `check_sampling()` geprüften Regressionskoeffizienten
# bestehen die Grenzen für Rhat, effektive Stichprobengröße und MCSE.
# Die Traceplots von Spaces und sigma zeigen gut überlappende Ketten ohne
# erkennbaren Trend. Rhat nahe 1, ausreichend große n_eff und ein kleiner
# MCSE sprechen für eine hinreichend genaue numerische Berechnung.
# 
# **4. mean_PPD und Modellgüte.** Der beobachtete Mittelwert der Daten liegt
# im Intervall der replizierten Mittelwerte des Modells. Gutes Sampling und ein
# passender Mittelwert garantieren zwar weder eine passende Verteilung noch
# brauchbare Einzelvorhersagen; umgekehrt wären sie allerdings Warnsignale.



# 7. Modell 2
# ===========
# 
# **Leitfragen**
# 
# - Wie unterscheidet sich die Bedeutung der Koeffizienten von Modell 1,
#   und wie erhalten Sie einen prozentuellen Gruppenunterschied?
# - Welche Folgen hat die Transformation für die Verteilungsannahme und
#   die Interpretation der Gehaltsvorhersagen?

modell2 = stan_glm(LogSalary ~ TabSpaces, data = training, seed = 2026, refresh = 0)

check_sampling(modell2)
mcmc_trace(modell2, pars = c("TabSpacesSpaces", "sigma"))

print(modell2, digits = 3)
round(exp(coef(modell2)), 2)

# Hilfsfunktion: umrechnen in Prozent
to_percent = function(x) (exp(x) - 1)*100

plotcoef(modell2, "TabSpaces", transform = to_percent)

## Anmerkungen und (mögliche) Antworten
# 
# **1. Bedeutung der Koeffizienten.** M2 beschreibt den natürlichen
# Logarithmus des Gehalts. Ein Koeffizient `beta` bedeutet einen additiven
# Log-Unterschied bzw. ein Verhältnis `exp(beta)` der Gehälter (Mediane).
# Wir rechnen $100 \times (e^\beta - 1)$ damit wir den Unterschied in Prozent
# erhalten (ist einfacher kommunizierbar.) Für Spaces gegenüber Tabs ergibt sich
# ca. 29% mehr Gehalt. `Both` hat im Median 5% mehr Gehalt als Tabs, ist aber im
# 95%-Niveau nicht eindeutig (schließt 0 mit ein, wäre also auch konsistent mit
# negativem Effekt).
# 
# **2. Transformation und Vorhersage.** Normalverteilung und konstante Streuung
# gelten nun für die Log-Skala. Die Rücktransformation $e^\text{LogSalary}$
#   beschreibt ihren Median; für das arithmetische Mittel benötigten wir auch *sigma*.
# Modell 2 erfasst die Mischung aus Ländern und Erfahrungsgruppen nicht.



# 8. Modell 3
# ===========
# 
# **Leitfragen**
# 
# - Wie ist der Spaces-Koeffizient unter Berücksichtigung der zusätzlichen
#   Variablen zu interpretieren?
# - Wie verändert sich die Schätzung gegenüber Modell 2, und wie erklären
#   und beurteilen Sie diese Veränderung?

modell3 = stan_glm(LogSalary ~ TabSpaces + Country + YearsProgram, 
                   data = training, seed = 2026, refresh = 0)

check_sampling(modell3)
mcmc_trace(modell3, pars = c("TabSpacesSpaces", "sigma"))

print(modell3, digits = 3)
round(exp(coef(modell3)[1:3]), 2)

plotcoef(modell3, "TabSpaces", transform = to_percent)
print(compare_coef(modell2, modell3, transform = to_percent, include="TabSpaces"))

## Anmerkungen und (mögliche) Antworten
# 
# **1. Adjustierter Koeffizient.** Modell 3 vergleicht die Einrückungsgruppen
# bei *gleichem Land* und *gleicher Erfahrung*. Länder und Erfahrungsgruppen
# erhalten eigene Niveauunterschiede; der Spaces-Koeffizient ist für alle
# (Erfahrungs- und Länder-)Gruppen der gleiche.
# 
# **2. Veränderung und Beurteilung.** Der geschätzte Unterschied zwischen Tab und
# Spaces (kontrolliert für Erfahrung und Land) sinkt auf ca. 12%. Im Vergleich zu
# M2 (29%) ist das deutlich weniger → ein erheblicher Teil des Zusammenhangs hängt
# also mit der Verteilung von Land und Erfahrung zusammen. Hinweis: das ist keine
# exakte kausale Zerlegung der Ursachen, denn M3 schließt nach wie vor nicht alle
# Variablen ein. Zudem gibt es unbekannte Variablen, die weder in den Modellen noch
# im Datensatz aufscheinen.



# 9. Modell 4
# ===========
# 
# **Leitfragen**
# 
# - Wie verändert sich der geschätzte Zusammenhang gegenüber Modell 3,
#   und welche Grenzen hat seine Interpretation?

modell4 = stan_glm(
  LogSalary ~ TabSpaces + Country + YearsProgram + CompanySize +
    LearningNewTech + StackOverflowCopiedCode +
    Lang.JavaScript + Lang.Java + Lang.PHP + Lang.CSharp + Lang.Python + Lang.R +
    Lang.Cpp + Lang.VBNet + Lang.Ruby + Lang.Perl + Lang.ObjectiveC + Lang.C,
  data = training, seed = 2026, refresh = 0)
check_sampling(modell4)
mcmc_trace(modell4, pars = c("TabSpacesSpaces", "sigma"))

print(modell4, digits = 3)
round(exp(coef(modell4)[1:3]), 2)
plotcoef(modell4, "TabSpaces", transform = to_percent)

print(compare_coef(modell2, modell3, modell4, transform = to_percent, include="TabSpaces"))

## Anmerkungen und (mögliche) Antworten
# 
# Der Spaces-Unterschied sinkt gegenüber M3 auf ca. 8.3 %. Berücksichtigt werden
# zusätzlich Firmengröße, Lernhaltung, Kopierhäufigkeit, und zwölf Sprachindikatoren.
# Eine Person kann mehrere Sprachindikatoren mit Wert 1 haben; Mehrfachnennungen
# werden nicht in eine einzige Sprachkategorie gezwungen.
# 
# Die Koeffzienten beschreiben Personen mit *gleichen* erfassten Merkmalen.
# Erfahrung und Firmengröße bleiben kategorial. Seltene Antwortgruppen
# haben breite Parameterintervalle. Auch mit diesen zusätzlichen Variablen
# ist eine Kausalität nicht belegt! Tätigkeit, Seniorität, Verantwortung und
# weitere Unterschiede fehlen; zudem ist der Fragebogen ein Selbstbericht (mit
# entsprechenden Problemen), es liegt ihm auch kein experimentelles Setting zu
# Grunde ("Gehalt vor/nach Umstellen" bzw. "randomized trial" bei denen
# Programmierer*innen zufällig einer Einrückung zugeteilt werden und man sich
# dann das Gehalt ansieht).



# 10. Modell 5
# ============ 
# 
# **Leitfragen**
# 
# - Welche Zusammenhänge unterstellt das Modell durch log1p(Erfahrung),
#   Erfahrung20plus und log2(Firmengroesse)?
# - Welche Vor- und Nachteile hat diese Kodierung gegenüber Modell 4,
#   insbesondere bei offenen Kategorien?

modell5 = stan_glm(
  LogSalary ~ TabSpaces + Country + log1p(Erfahrung) + Erfahrung20plus +
    log2(Firmengroesse) + LearningNewTech + StackOverflowCopiedCode +
    Lang.JavaScript + Lang.Java + Lang.PHP + Lang.CSharp + Lang.Python + Lang.R +
    Lang.Cpp + Lang.VBNet + Lang.Ruby + Lang.Perl + Lang.ObjectiveC + Lang.C,
  data = training, seed = 2026, refresh = 0)

check_sampling(modell5)
mcmc_trace(modell5, pars = c("TabSpacesSpaces", "sigma"))

print(modell5, digits = 3)
round(exp(coef(modell5)[1:3]), 2)
plotcoef(modell5, "TabSpaces", transform = to_percent)

print(compare_coef(modell4, modell5, transform = to_percent, include="TabSpaces"))

## Anmerkungen und (mögliche) Antworten
# 
# **1. Unterstellte Zusammenhänge.** `log1p(Erfahrung)` erlaubt bei einem
# positiven Koeffizienten einen abnehmenden Zuwachs des Log-Gehalts je weiterem
# Jahr. `Erfahrung20plus` gibt der offenen Obergruppe ein eigenes Niveau;
# ihr Platzhalter in der metrischen Variable wird somit nicht als exakt gemessene
# Erfahrung interpretiert. `log2(Firmengroesse)` unterstellt einen konstanten
# Unterschied des Log-Gehalts je Verdopplung der angenäherten Beschäftigtenzahl.
# 
# **2. Vor- und Nachteile.** M5 hat weniger Parameter und bündelt Information
# über die Kategorien. Dafür werden bestimmte Formen des Zusammenhangs angenommen;
# vor allem 15.000 Beschäftigte in der offenen Obergruppe ist keine beobachtete
# Größe. M4 ist flexibler, benötigt aber mehr Parameter. Der Spaces-Unterschied
# liegt auch in M5 bei ungefähr 8.4 Prozent. Für die Hauptinterpretation bleibt
# die kategoriale Variante M4 zweckmäßig; das vergleichbare Modell mit metrischen
# Variablen prüft die Abhängigkeit von der Kodierung.



# 11. Modelldiagnostik
# ====================
# 
# **Leitfragen**
# 
# - Welche Eigenschaften der Daten reproduzieren die einzelnen Modelle
#   laut Dichte-, Kennzahlen- und Vorhersageplots?
# - Welche Muster zeigen die Residuen insgesamt sowie nach Erfahrung und
#   Land? Wie beurteilen Sie damit die Modellannahmen?

par(mfrow=c(2,3))
diagnose_density(modell1, main="Modell 1")
diagnose_density(modell2, main="Modell 2")
diagnose_density(modell3, main="Modell 3")
diagnose_density(modell4, main="Modell 4")
diagnose_density(modell5, main="Modell 5")
reset_gfx()

diagnose_fit(modell1)
diagnose_fit(modell2)
diagnose_fit(modell3)
diagnose_fit(modell4)
diagnose_fit(modell5)

par(mfrow=c(2,3))
diagnose_y_vs_yhat(modell1, samples = FALSE, main = "Modell 1")
diagnose_y_vs_yhat(modell2, samples = FALSE, main = "Modell 2")
diagnose_y_vs_yhat(modell3, samples = FALSE, main = "Modell 3")
diagnose_y_vs_yhat(modell4, samples = FALSE, main = "Modell 4")
diagnose_y_vs_yhat(modell5, samples = FALSE, main = "Modell 5")
reset_gfx()

par(mfrow=c(2,3))
diagnose_residual(modell1, samples = FALSE, main = "Modell 1")
diagnose_residual(modell2, samples = FALSE, main = "Modell 2")
diagnose_residual(modell3, samples = FALSE, main = "Modell 3")
diagnose_residual(modell4, samples = FALSE, main = "Modell 4")
diagnose_residual(modell5, samples = FALSE, main = "Modell 5")
reset_gfx()

# **Residuen nach Programmiererfahrung**
#
# Residuen nach anderen Variablen sortieren
residuen4 = training$LogSalary - colMeans(posterior_epred(modell4))
residuen5 = training$LogSalary - colMeans(posterior_epred(modell5))
residuen = rbind(
  data.frame(training, Residuum = residuen4, Modell = "M4"),
  data.frame(training, Residuum = residuen5, Modell = "M5"))

ggplot(residuen, aes(Erfahrung, Residuum, colour = Modell)) +
  geom_point(color="black", alpha=0.1) + facet_wrap(~Modell) +
  geom_smooth(method = "loess", formula = y ~ x) +
  geom_hline(yintercept = 0, linetype = 2) +
  labs(x = "Programmiererfahrung [Näherung, Jahre]")

# **Residuen nach Land**
ggplot(residuen, aes(Country, Residuum)) + geom_boxplot() +
  facet_wrap(~ Modell) + coord_flip() + labs(x = "Land")

## Anmerkungen und (mögliche) Antworten
#   
# **1. Reproduktion der Daten.** M1 bildet die rechtsschiefe Verteilung
# unzureichend ab und erzeugt auch negative Gehälter. M2 verbessert die Skala,
# reproduziert aber die Verteilung noch nicht ausreichend. Die Modelle M3 bis
# M5 treffen den zentralen Bereich deutlich besser. Die Fit-Diagramme zeigen
# weiterhin Abweichungen bei Randquantilen und besonders beim Maximum.
# Die Zielvariable in den Fit-Diagrammen von M2 bis M5 ist Log-Salary.
# 
# **2. Residuen und Modellannahmen.** Bei M1/M2 entstehen drei senkrechte
# Punktwolken, weil es nur drei X-Werte gibt (Modelle enthalten nur Variable `TabSpaces`
# welche 3 Werte hat). Die dafür verwendete (rote) LOESS-Linie ist wenig
# aussagekräftig. Residuenboxplots je Gruppe wären hier geeigneter.
# Bei M4/M5 bleiben einzelne große Residuen, unterschiedliche Streuungen und
# leichte Muster sichtbar. Auch innerhalb der Länder ist die Streuung nicht
# einheitlich. Ein gemeinsames $\sigma$ aller Gruppen ist daher eine Vereinfachung
# (In `rstanarm` kann man leider nicht pro Gruppe unterschiedliche Streuung zulassen,
# in purem MC-Stan aber schon; dafür benötigt man aber einen C++-Compiler, weshalb
# wir das hier nicht verwenden.)
# 
# Die Modelle sind nützliche Näherungen, aber keine vollständig passenden generativen
# Modelle der gesamten Gehaltsverteilung. Unter solchen Modellabweichungen können auch
# die Unsicherheitsintervalle der Koeffizienten zu optimistisch sein.  



# 12. Modellkennzahlen
# ====================
# 
# **Leitfragen**
# 
# - Welche R²-, RMSE- und MAE-Werte dürfen Sie direkt miteinander vergleichen,
#   und welche Bedeutung haben die jeweiligen Skalen?
# - Wie beurteilen Sie die Modelle anhand der Trainings- und Testkennzahlen?
#   Welche Hinweise erhalten Sie zur Generalisierung und zur Modellwahl?

modelle = list(M1 = modell1, M2 = modell2, M3 = modell3,
               M4 = modell4, M5 = modell5)

r2 = data.frame()
for (name in names(modelle)) {
  r2 = rbind(r2, data.frame(Modell = name, Median = median(bayes_R2(modelle[[name]]))))
}
r2

prediction_metrics(modell1, newdata=test)
prediction_metrics(modell2, newdata=test)
prediction_metrics(modell3, newdata=test)
prediction_metrics(modell4, newdata=test)
prediction_metrics(modell5, newdata=test)

# **LOO**

mloo = list()
for (name in names(modelle)) {
  mloo[[name]] = loo(modelle[[name]])
}

plotpkiv(mloo[["M1"]])
plotpkiv(mloo[["M2"]])
plotpkiv(mloo[["M3"]])
plotpkiv(mloo[["M4"]])
plotpkiv(mloo[["M5"]])

# Ohne Modell 1, da anderes Y in Modell
loo_compare(mloo[-1])


## Anmerkungen und (mögliche) Antworten
# 
# **1. Vergleichbare Kennzahlen und Skalen.** R² misst hier erklärte
# Varianz jeweils auf der Zielskala. Salary und LogSalary haben andere
# Varianzen; R² aus M1 und den Logmodellen darf daher nicht als direkt
# gleichartiger Gütewert gelesen werden. Dasselbe gilt für RMSE und MAE:
#   M1 wird zunächst in USD, M2 bis M5 in Log-USD bewertet. Alle Modelle nutzen
# dieselben Zeilen; innerhalb M2 bis M5 sind die Zielvariable und die
# Fallauswahl identisch. Genau deshalb wird M1 auch beim direkten LOO-Vergleich
# ausgeschlossen.
# 
# **2. Generalisierung und Modellwahl.** R² auf der Logskala steigt von etwa
# 0,03 über 0,69 auf etwa 0,71. Der Test-Log-RMSE liegt ungefähr bei
# 0,680 (M2), 0,375 (M3), 0,364 (M4) und 0,364 (M5).
# Trainings- und Testfehler liegen ähnlich; ein Overfitting-Signal
# ergibt sich daher nicht. M4/M5 sind gegenüber den einfacheren
# Varianten deutlich besser. Ihre Testdaten-Ergebnisse liegen nahe beieinander;
# kleine Rangunterschiede wechseln zudem mit der betrachteten Fehlermetrik.
# 
# **LOO und die Einflussdiagnostik.** LOO beurteilt die Vorhersage des jeweils
# weggelassenen Datensatzes anhand aller restlichen Daten. Höheres `elpd_loo`
# bedeutet bessere Vorhersage; `elpd_diff` in `loo_compare()` ist relativ zum
# besten Modell angegeben und daher für die anderen Modelle negativ.
# `se_diff` beschreibt die Unsicherheit der paarweisen Differenz.
# `plotpkiv()` zeigt Pareto-k-Influenzwerte. Hohe Werte kennzeichnen Personen,
# bei denen das Weglassen einen starken Einfluss hat und die
# loo-Näherung problematisch werden kann.
# 
# Bei M4 liegt in der ursprünglichen Berechnung ein k-Wert bei etwa 0,80
# (Trainingszeile 1231), oberhalb der hier verwendeten Grenze 0,7.
# Die Nachrechnung mit `k_threshold = 0.7` berechnet das Modell für diesen Fall
# ohne die betreffende Person neu. Die Person bleibt
# inhaltlich einflussreich; sie wird aber nicht aus der Analyse entfernt.
# 
# Der kontrollierte Vergleich bevorzugt M4 gegenüber M5 um ungefähr
# `r zahl(abs(loo_vergleich_geprueft["M5","elpd_diff"]))` elpd-Einheiten
# bei einer Unsicherheit von `r zahl(loo_vergleich_geprueft["M5","se_diff"])`.
# Das ist ein Hinweis zugunsten M4 und passt zur Wahl des kategorialen
# Hauptmodells; die Unterschiede zu M2/M3 sind wesentlich größer.



# 13. Vorhersagen in USD
# ======================
#
# **Leitfragen**
# 
# - Wie bewerten Sie die Modelle auf der gemeinsamen USD-Skala, und was
#   bedeuten die Fehlergrößen für Vorhersagen einzelner Gehälter?

metriken_usd = data.frame()
for (name in names(modelle)) {
  modell = modelle[[name]]
  mu = posterior_epred(modell, newdata = test)
  if (name == "M1") {
    vorhersage = colMeans(mu)
  } else {
    sigma = as.matrix(modell)[, "sigma"]
    # Ein bloßes exp(mu) wäre der bedingte Median, nicht der arithmetische Erwartungswert.
    vorhersage = colMeans(exp(sweep(mu, 1, sigma^2 / 2, "+")))
  }
  metriken_usd = rbind(metriken_usd, data.frame(
    Modell = name, RMSE_USD = sqrt(mean((test$Salary - vorhersage)^2)),
    MAE_USD = mean(abs(test$Salary - vorhersage))))
}
metriken_usd

## Anmerkungen und (mögliche) Antworten
# 
# **Gemeinsame USD-Skala und Fehlergrößen.** Unter der Lognormal-Annahme
# ist der bedingte Erwartungswert je Posterior-Ziehung $exp(\mu + \sigma^2/2)$.
# Deshalb wird zunächst je Sample korrigiert und erst anschließend über alle
# Samples gemittelt.
# 
# Auf derselben Teststichprobe sinkt der RMSE von ungefähr 37.379 USD (M1)
# über 22.815 USD (M3) auf 22.295 USD (M4) bzw. 22.242 USD (M5).
# Die MAEs von M4/M5 betragen noch etwa 16.128 bzw. 16.036 USD.
# Das ist eine deutliche Verbesserung gegenüber dem Ausgangsmodell, lässt
# aber erhebliche Fehler bei individuellen Gehältern übrig. Die minimale
# Differenz zwischen M4 und M5 steht einer moderaten
# LOO-Präferenz für M4 nicht entgegen: RMSE und LOO bewerten unterschiedliche
# Aspekte der Vorhersage.



# 14. Diagnostik mit Testdaten
# ============================
# 
# **Leitfragen**
# 
# - Welche Gemeinsamkeiten und Unterschiede zeigen die Diagnosen für
#   Trainings- und Testdaten?
# - Welche Schlussfolgerungen ziehen Sie daraus für die Verwendbarkeit
#   der Modelle bei weiteren Personen?

# **Original vs. Test**

diagnose_density(modell4, main = "M4: Trainingsdaten")
diagnose_density(modell4, newdata = test, main = "M4: Testdaten")
diagnose_residual(modell4, samples = FALSE, main = "M4: Trainingsdaten")
diagnose_residual(modell4, newdata = test, samples = FALSE, main = "M4: Testdaten")

diagnose_density(modell5, main = "M5: Trainingsdaten")
diagnose_density(modell5, newdata = test, main = "M5: Testdaten")
diagnose_residual(modell5, samples = FALSE, main = "M5: Trainingsdaten")
diagnose_residual(modell5, newdata = test, samples = FALSE, main = "M5: Testdaten")

## Anmerkungen und (mögliche) Antworten
# 
# **1. Training gegenüber Test.** Die Testdiagnosen zeigen ein ähnliches
# Gesamtbild wie die Trainingsdiagnosen. Die Modelle reproduzieren den
# zentralen Bereich vergleichbar, während am Rand Abweichungen und auffällige
# Residuen bestehen bleiben. Die Kennzahlen aus Abschnitt 12 stützen diese
# Beurteilung; die Testfehler steigen nicht grundsätzlich stark an.
# 
# **2. Weitere Personen.** Für Personen mit ähnlichen Merkmalen und aus
# ähnlicher Auswahl ist eine grobe Vorhersage vertretbar. Die verbleibenden
# Fehler sind für genaue individuelle Gehaltsprognosen groß. Eine zufällige
# Testmenge aus derselben Umfrage belegt zudem keine Übertragbarkeit auf
# andere Jahre, Länder oder Auswahlverfahren. Das Selektionsproblem wird also
# durch ähnliche Trainings- und Testfehler nicht beseitigt.



# 15. Modell mit allen Analysedaten
# =================================
# 
# **Leitfragen**
# 
# - Welchen Zweck erfüllt die erneute Berechnung mit allen Analysedaten,
#   und wie ist die vorherige Testauswertung danach einzuordnen?
# - Wie beurteilen Sie die replizierten USD-Kennzahlen im Vergleich zu
#   den beobachteten Werten und zur Auswahl der Analysedaten?

modell_final = update(modell4, data = daten, seed = 2028, refresh = 0)

print(modell_final, digits = 3)
round(exp(coef(modell_final)[1:3]), 2)
print(compare_coef(modell4, modell_final, include="TabSpaces", transform=to_percent))

check_sampling(modell_final)
diagnose_density(modell_final, main = "Gesamte Analysedaten")
diagnose_fit(modell_final)
diagnose_residual(modell_final, samples = FALSE)

modell_metrisch = update(modell5, data = daten, seed = 2028, refresh = 0)

print(modell_metrisch, digits = 3)
round(exp(coef(modell_metrisch)[1:3]), 2)
print(compare_coef(modell5, modell_metrisch, include="TabSpaces", transform=to_percent))

check_sampling(modell_metrisch)
diagnose_density(modell_metrisch, main = "Gesamte Analysedaten")
diagnose_fit(modell_metrisch)
diagnose_residual(modell_metrisch, samples = FALSE)

# **R² und LOO**

print(c(R2_modell_final = mean(bayes_R2(modell_final)),
        R2_modell_metrisch = mean(bayes_R2(modell_metrisch))))

loo_final = loo(modell_final)
plotpkiv(loo_final)

loo_metrisch = loo(modell_metrisch)
plotpkiv(loo_metrisch)

loo_compare(loo_final, loo_metrisch)

# Ergänzung: replizierte Kennzahlen in USD
yrep_usd = exp(posterior_predict(modell_final, draws = 500, seed = 2030))
pruefung_usd = rbind(
  Minimum =  quantile(apply(yrep_usd, 1, min), c(.025, .5, .975)),
  Mittelwert = quantile(rowMeans(yrep_usd), c(.025, .5, .975)),
  Maximum = quantile(apply(yrep_usd, 1, max), c(.025, .5, .975)))
print(cbind(Beobachtet = c(min(daten$Salary), mean(daten$Salary), max(daten$Salary)), pruefung_usd))

## Anmerkungen und (mögliche) Antworten
# 
# **1. Zweck der Neuberechnung und Rolle des Tests.** Nach der Beurteilung
# der Modellvarianten werden M4 und M5 nun mit *allen* 6.098 Analysedaten neu
# berechnet, um die vorhandene Information vollständig zu nutzen.
# Der frühere Test (mit Train/Test-Split) ist zwar "eng verwandt" und wir erwarten
# uns keine grobe Überraschung, aber er ist keine 1:1 Güteprüfung der jetzt auf
# allen Daten berechneten Modelle. Deshalb sehen wir uns alle typischen Tests
# nochmal für die Modelle mit allen Daten an.
# 
# **2. Replizierte Kennzahlen in USD.** Die zusätzliche Tabelle ergänzt die
# vorhandenen Log-Skalen-Diagnosen für diese Leitfrage. Der beobachtete
# Mittelwert beträgt rund 66.525 USD; die replizierten Mittelwerte liegen
# typischerweise etwas höher. Besonders deutlich ist die Abweichung beim
# Maximum: Replizierte Datensätze erreichen typischerweise deutlich mehr als
# die beobachteten 195.000 USD. Zugleich entstehen Vorhersagen unter der
# Filtergrenze von 5.000 USD. Ein passender Mittelwert auf der Logskala
# impliziert daher keinen passenden Mittelwert oder Randbereich in USD.
# 
# **Ergänzung zu R² und LOO.** Die R²-Werte auf allen Analysedaten liegen bei
# ungefähr 0,718 (kategorial) und 0,713 (metrisch). Beide vollständigen
# LOO-Auswertungen haben keine Pareto-k-Werte über 0.7. LOO bevorzugt die
# kategoriale Variante um ungefähr 28 elpd (se: 10). Eine Präferenz für M4.
# Die weiterhin sichtbaren Modellmängel werden dadurch aber nicht aufgehoben.



# 16. Posterior-Auswertung
# ========================
# 
# **Leitfragen**
# 
# - Wie beantworten Sie die Gehaltsfrage anhand der posterioren Schätzungen,
#   HDIs und Wahrscheinlichkeiten für die verschiedenen Gruppenvergleiche?

samples = as.matrix(modell_final)
beta_spaces = samples[, "TabSpacesSpaces"]
beta_both = samples[, "TabSpacesBoth"]

prozent_spaces = 100 * (exp(beta_spaces) - 1)
prozent_both = 100 * (exp(beta_both) - 1)
prozent_diff_spaces_both = 100 * (exp(beta_spaces - beta_both) - 1)

plothist(prozent_spaces, main = "Spaces gegenüber Tabs [%]")
plothist(prozent_both, compVal = 0, main = "Both gegenüber Tabs [%]")
plothist(prozent_diff_spaces_both, main = "Spaces gegenüber Both [%]")

vergleich = data.frame()
for (name in c("M2", "M3", "M4", "M5")) {
  effekt = 100 * (exp(as.matrix(modelle[[name]])[, "TabSpacesSpaces"]) - 1)
  intervall = hdi(effekt)
  vergleich = rbind(vergleich, data.frame(
    Modell = name, Median = median(effekt),
    Untergrenze = intervall[1], Obergrenze = intervall[2]))
}
print(vergleich, digits=3)

## Anmerkungen und (mögliche) Antworten
# 
# **Antwort aus den Posteriorverteilungen.** Im kategorialen Hauptmodell
# liegt der Spaces-Unterschied gegenüber Tabs bei
# **`r zahl(median(prozent_spaces))` Prozent** mit einem 95%-HDI von ungefähr
# **`r zahl(hdi(prozent_spaces)[1])` bis `r zahl(hdi(prozent_spaces)[2])` Prozent**.
# Both gegenüber Tabs: rund `r zahl(median(prozent_both))` Prozent, HDI etwa
# `r zahl(hdi(prozent_both)[1])` bis `r zahl(hdi(prozent_both)[2])` Prozent.
# Dieses Intervall enthält null, sodass ein klar positiver Unterschied für
# Both gegenüber Tabs nicht belegt ist. Spaces gegenüber Both: rund
# `r zahl(median(prozent_diff_spaces_both))` Prozent, HDI etwa
# `r zahl(hdi(prozent_diff_spaces_both)[1])` bis
# `r zahl(hdi(prozent_diff_spaces_both)[2])` Prozent.
# 
# Die Modelle zeigen die Abschwächung nach Hinzunehmen weiterer Variablen:
#   "roh" etwa 28,9 Prozent, mit Land/Erfahrung 11,8 Prozent und in M4
# 8,3 Prozent. Die metrische Kodierung (M5) liefert ein ähnliches Ergebnis.
# 
# Der Unterschied Both zu Tabs ist allerdings nicht eindeutig im 95%-Niveau,
# da null im Intervall enthalten ist. Das heißt, hier ist das Ergebnis des Modells
# sowohl konsistent mit einem positiven als auch negativen Effekt. 



# 17. Weitere Gehaltsgrenzen
# ==========================
# 
# **Leitfragen**
# 
# - Wie verändern sich Stichprobe, Schätzung und Unsicherheit zwischen
#   den Varianten, und wie stabil ist Ihre Antwort auf die Fragestellung?
# - Welche Bereinigungs- und Modellierungsentscheidungen würden Sie vertreten,
#   und welche Grenzen dieser Sensitivitätsprüfung bleiben bestehen?

# **Unterschiedliche Grenzen für Gehalt**

daten_positiv = basis
daten_10000 = droplevels(basis[basis$Salary >= 10000, ])
daten_20000 = droplevels(basis[basis$Salary >= 20000, ])
# daten_alle_5000 enthält auch unbekannte Firmengrößen (die bisher ausgeschlossen wurden)
daten_alle_5000 = roh |> filter(Salary >= 5000) |> mutate(LogSalary = log(Salary))

# **Modelle**

modell_positiv = update(modell_final, data = daten_positiv, seed = 2029, refresh = 0)
modell_10000 = update(modell_final, data = daten_10000, seed = 2029, refresh = 0)
modell_20000 = update(modell_final, data = daten_20000, seed = 2029, refresh = 0)
modell_alle_5000 = update(modell_final, data = daten_alle_5000, seed = 2029, refresh = 0)

# **Varianten durchrechnen**

varianten = list(Positiv = modell_positiv, Ab_5000 = modell_final,
                 Ab_10000 = modell_10000, Ab_20000 = modell_20000,
                 Metrisch_ab_5000 = modell_metrisch,
                 Alle_ab_5000 = modell_alle_5000)
sensitivitaet = data.frame()
for (name in names(varianten)) {
  modell = varianten[[name]]
  effekt = 100 * (exp(as.matrix(modell)[, "TabSpacesSpaces"]) - 1)
  intervall = hdi(effekt)
  sensitivitaet = rbind(sensitivitaet, data.frame(
    Variante = name, n = nobs(modell), Median = median(effekt),
    Untergrenze = intervall[1], Obergrenze = intervall[2]))
}
print(sensitivitaet, digits=3)

## Anmerkungen und (mögliche) Antworten
# 
# **1. Stabilität und Unsicherheit.** In der vollständigen Ausgangsbasis
# mit beliebig kleinen positiven Gehältern ergibt sich etwa +8,4 Prozent
# (HDI +3,8 bis +13,3). Ab 5.000 USD sind es +8,2 Prozent (+5,8 bis +10,4),
# ab 10.000 USD +7,3 Prozent (+5,2 bis +9,2) und ab 20.000 USD +7,0 Prozent
# (+5,1 bis +8,8). Die metrische Variante ab 5.000 USD liefert +8,4 Prozent
# (+6,1 bis +10,7). Das Vorzeichen bleibt bei diesen Entscheidungen stabil;
# die Größe und Unsicherheit verändern sich ab 5000 nur geringfügig; nur wenn
# Untergrenze null USD ist, ist ein deutlich größeres Intervall zu erkennen.
# 
# Interessant ist das Ergebnis des letzten Modells, welche zwar als Schwellwert
# für das Gehalt 5.000 USD nimmt, aber auch jene Datensätze enthält, bei denen
# die Firmengröße keine Angabe Angabe enthält. Hier schrumpft der Space-Vorteil
# auf +6.3 Prozent. Es kann also durchaus argumentiert werden, dass wir die
# knapp 100 zusätzlichen Datensätze nicht vorschnell hätten ausschließen dürfen.
# In Summe ist der Space-vs-Tabs-Vorteil aber immer noch klar positiv.
# 
# **2. Vertretbare Entscheidungen und Grenzen.** Für die Hauptanalyse sind
# die transparent dokumentierte Arbeitsgrenze von 5.000 USD und die
# kategoriale Modellierung vertretbare, aber nicht zwingende Entscheidungen.
# Die vollständig positive Variante enthält offensichtlich
# unbrauchbare Kleinstwerte. Höhere Grenzen entfernen zunehmend möglicherweise
# korrekte Gehälter und verändern damit die Zielpopulation. Die Abweichung hier
# ist also nicht verwunderlich.
# 
# Diese Sensitivitätsprüfung zeigt, dass die Modelle recht robust gegenüber
# der Schwellwert-Entscheidung sind. Die Prüfung sagt aber nichts
# über allgemeine Robustheit gegenüber Messfehlern,
# Selektion oder fehlenden Variablen. Weil die Varianten unterschiedliche
# Zeilen umfassen, handelt es sich nicht um einen direkten LOO-Modellvergleich
# auf gleicher Datenbasis. Die ergänzende Samplingprüfung unten bestätigt
# die numerische Berechnung, beseitigt aber keine dieser Grenzen.



# 18. Resümee
# ===========
# 
# **Leitfragen**
# 
# - Wie lautet Ihr abschließendes, begründetes Fazit zum Zusammenhang
#   zwischen Einrückung und Gehalt, einschließlich Unsicherheit, Modellgrenzen
#   und möglicher kausaler Interpretation?


## Anmerkungen und (mögliche) Antworten
# 
# In dieser ausgewählten Stichprobe besteht ein positiver Zusammenhang
# zwischen der Angabe Spaces und Gehalt. Nach Berücksichtigung der erfassten
# Merkmale liegt die Hauptschätzung bei ungefähr **+8,2 Prozent**, mit einem
# modellbedingten 95%-HDI von etwa **+5,8 bis +10,4 Prozent**. Bereinigte
# Varianten ergeben ungefähr +6.3 bis +8,4 Prozent.
# 
# Die Modellfolge und Testauswertung zeigen den Nutzen von Land, Erfahrung
# und weiteren Merkmalen. LOO stützt die kategoriale Hauptvariante. Residuen und PPCs
# zeigen zugleich Grenzen bei Streuung, Randwerten und der abgeschnittenen
# Datenbasis. Die Modelle erlauben eine vorsichtige Beschreibung des zentralen
# Zusammenhangs, aber keine besonders präzisen Einzelprognosen.
# 
# **Eine Gehaltserhöhung durch einen Wechsel von Tabs auf Spaces ist nicht
# nachgewiesen.** Tätigkeit, Seniorität, Verantwortung, Ausbildung,
# Arbeitszeitumfang, regionale Unterschiede innerhalb der Länder und weitere
# Arbeitgebermerkmale fehlen. Zudem wird ein gemeinsamer Spaces-Unterschied
# über Länder, Erfahrung und Sprachkombinationen unterstellt. Umfrage-(Selbst)selektion,
# fehlende Antworten, Gehaltsfilter und mögliche Vorfilter begrenzen die
# Übertragbarkeit. Ein statistisch klarer Zusammenhang liefert deshalb
# keine sachliche Grundlage für eine Einrückungsregel zur Gehaltssteigerung.
```
