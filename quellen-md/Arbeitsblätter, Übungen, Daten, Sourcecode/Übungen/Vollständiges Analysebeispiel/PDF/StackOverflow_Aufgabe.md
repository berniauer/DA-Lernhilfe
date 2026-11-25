<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Übungen/Vollständiges Analysebeispiel/PDF/StackOverflow_Aufgabe.pdf -->

Stack Overflow: Tabs, Spaces und Jahresgehalt
ArnoHollosi
Contents
DatensatzundFragestellung 1
1. Vorbereitung 2
2. Datenladenundsichten 2
3. Datenaufbereiten 6
4. BeschreibendeAuswertung 9
5. Trainings-undTestdaten 12
6. Modell1 13
7. Modell2 14
8. Modell3 16
9. Modell4 18
10. Modell5 21
11. Modelldiagnostik 25
12. Modellkennzahlen 34
13. VorhersageninUSD 37
14. DiagnostikmitTestdaten 38
15. ModellmitallenAnalysedaten 43
16. Posterior-Auswertung 53
17. WeitereGehaltsgrenzen 56
18. Resümee 57
Datensatz und Fragestellung
StackOverflow-survey.csventhälteinenAuszugauseinerweltweitenStack-Overflow-Umfragemit6543Personen
aus 18 Ländern. Die Datei enthält nur Vollzeitbeschäftigte. Jede Zeile beschreibt eine Person. Die Angaben
stammenausSelbstauskünftenundwerdenzunächstunveränderteingelesen.
Variablen
• Country: LandderbefragtenPerson.
1

| Aufgabe         |                                         |     |     |                     | 2. DATENLADENUNDSICHTEN |
| --------------- | --------------------------------------- | --- | --- | ------------------- | ----------------------- |
| • YearsProgram: | ProgrammiererfahrunginJahresintervallen |     |     |                     |                         |
| • TabSpaces:    | angegebeneEinrückungspraxis:            |     |     | Tabs,SpacesoderBoth |                         |
| • CompanySize:  | AnzahlderBeschäftigtendesUnternehmens   |     |     |                     |                         |
• LearningNewTech: ZustimmungzurBedeutungdesErlernensneuerTechnologien
• StackOverflowCopiedCode: berichteteHäufigkeitdesKopierensvonCodevonStackOverflow.
| • Salary: | angegebenesJahresgehaltinUS-Dollar,nichtMonatsgehalt! |     |     |     |     |
| --------- | ----------------------------------------------------- | --- | --- | --- | --- |
• Lang.*: zwölf Indikatoren für verwendete Programmiersprachen; 1 steht für verwendet, 0 für nicht
| verwendet. | Mehrfachnennungensindmöglich. |     |     |     |     |
| ---------- | ----------------------------- | --- | --- | --- | --- |
Hinweis
Im Skript entstehen zusätzlich LogSalary (Logarithmus des Jahresgehalts), Erfahrung und Firmengroesse
(metrischeNäherungenderKategorien)sowieErfahrung20plus(IndikatorfürdieoffeneOberkategorie).
Aufgabe
Untersuchen Sie mit den Rechenschritten, ob ein Zusammenhang zwischen Einrückungspraxis und Gehalt
besteht. Begründen Sie Ihre Antworten anhand der Ausgaben und Diagramme. Trennen Sie Beobachtung,
InterpretationundBeurteilung;nennenSiebeiZahlenjeweilsSkalaundVergleichsgruppe.
1. Vorbereitung
library(dplyr)
library(ggplot2)
library(rstanarm)
library(bayesplot)
library(daatools)
set.seed(2026)
theme_set(theme_minimal())
| 2. Daten | laden | und sichten |     |     |     |
| -------- | ----- | ----------- | --- | --- | --- |
Leitfragen
• WelcheDatentypen,HäufigkeitenoderWertebereichefallenIhnenauf?
• Wie beurteilen Sie die Gehaltsangaben und ihre Darstellung auf den beiden Skalen? Welche Angaben
würdenSienäherprüfen?
| # Arbeitsverzeichnis: |     | Ordner mit | CSV-Datei |     |     |
| --------------------- | --- | ---------- | --------- | --- | --- |
roh = read.csv("StackOverflow-survey.csv", stringsAsFactors = FALSE, na.strings = c("", "NA"))
colnames(roh)
| [1] "Country"    |     |     | "YearsProgram"            |     | "LearningNewTech" |
| ---------------- | --- | --- | ------------------------- | --- | ----------------- |
| [4] "TabSpaces"  |     |     | "StackOverflowCopiedCode" |     | "CompanySize"     |
| [7] "Salary"     |     |     | "Lang.JavaScript"         |     | "Lang.Java"       |
| [10] "Lang.PHP"  |     |     | "Lang.CSharp"             |     | "Lang.Python"     |
| [13] "Lang.R"    |     |     | "Lang.Cpp"                |     | "Lang.VBNet"      |
| [16] "Lang.Ruby" |     |     | "Lang.Perl"               |     | "Lang.ObjectiveC" |
[19] "Lang.C"
dim(roh)
| [1] 6543 | 19  |     |     |     |     |
| -------- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 2

2. DATENLADENUNDSICHTEN
str(roh)
'data.frame': 6543 obs. of 19 variables:
$ Country : chr "United Kingdom" "United Kingdom" "United States" "United States" ...
$ YearsProgram : chr "20 or more years" "20 or more years" "20 or more years" "20 or more years" ...
$ LearningNewTech : chr "Strongly agree" "Agree" "Strongly agree" "Strongly agree" ...
$ TabSpaces : chr "Spaces" "Spaces" "Spaces" "Spaces" ...
$ StackOverflowCopiedCode: chr "Haven't done at all" "Once or twice" "At least once each week" "Once or twice" ...
$ CompanySize : chr "10,000 or more employees" "5,000 to 9,999 employees" "1,000 to 4,999 employees" "10,000 or more employees" ...
$ Salary : num 113750 100000 130000 175000 118280 ...
$ Lang.JavaScript : int 0 0 1 0 1 1 1 1 1 1 ...
$ Lang.Java : int 1 0 0 1 1 1 0 1 0 0 ...
$ Lang.PHP : int 1 0 0 0 0 1 0 0 0 0 ...
$ Lang.CSharp : int 0 0 0 0 1 0 1 1 0 1 ...
$ Lang.Python : int 1 0 0 0 0 0 0 0 0 0 ...
$ Lang.R : int 0 0 0 0 0 0 0 0 0 0 ...
$ Lang.Cpp : int 0 1 0 0 0 0 0 1 0 0 ...
$ Lang.VBNet : int 0 0 0 0 0 0 0 0 0 0 ...
$ Lang.Ruby : int 0 0 0 0 0 1 0 0 0 0 ...
$ Lang.Perl : int 0 0 0 0 0 0 0 0 0 0 ...
$ Lang.ObjectiveC : int 0 0 0 0 0 0 0 0 0 0 ...
$ Lang.C : int 0 1 1 0 0 0 0 1 0 0 ...
info(roh)
mean sd median min max na neg0
Salary 63065.85 39527.45 56625 0.01 195000 0 0
Lang.JavaScript 0.67 0.47 1 0.00 1 0 2148
Lang.Java 0.38 0.48 0 0.00 1 0 4076
Lang.PHP 0.23 0.42 0 0.00 1 0 5009
Lang.CSharp 0.38 0.49 0 0.00 1 0 4041
Lang.Python 0.29 0.46 0 0.00 1 0 4615
Lang.R 0.03 0.18 0 0.00 1 0 6331
Lang.Cpp 0.19 0.39 0 0.00 1 0 5324
Lang.VBNet 0.06 0.24 0 0.00 1 0 6159
Lang.Ruby 0.11 0.31 0 0.00 1 0 5840
Lang.Perl 0.04 0.19 0 0.00 1 0 6300
Lang.ObjectiveC 0.07 0.25 0 0.00 1 0 6092
Lang.C 0.20 0.40 0 0.00 1 0 5257
Country YearsProgram LearningNewTech TabSpaces
Australia: 170 1 to 2 years: 96 Agree: 2597 Both: 955
Austria: 85 10 to 11 years: 361 Disagree: 67 Spaces: 3006
Brazil: 148 11 to 12 years: 225 Somewhat agree: 626 Tabs: 2582
Canada: 416 12 to 13 years: 244 Strongly agree: 3246
France: 284 13 to 14 years: 191 Strongly disagree: 7
Germany: 635 14 to 15 years: 332
India: 439 15 to 16 years: 294
Israel: 89 16 to 17 years: 162
Italy: 124 17 to 18 years: 184
Netherlands: 139 18 to 19 years: 106
Poland: 197 19 to 20 years: 187
Romania: 81 2 to 3 years: 186
Russian Federation: 114 20 or more years: 1431
Spain: 157 3 to 4 years: 307
LVDAA,ArnoHollosi 3

2. DATENLADENUNDSICHTEN
Sweden: 129 4 to 5 years: 376
Switzerland: 91 5 to 6 years: 380
United Kingdom: 856 6 to 7 years: 328
United States: 2389 7 to 8 years: 346
8 to 9 years: 286
9 to 10 years: 491
StackOverflowCopiedCode CompanySize
At least once each day: 139 1,000 to 4,999 employees: 682
At least once each week: 656 10 to 19 employees: 624
Haven't done at all: 1769 10,000 or more employees: 1035
Once or twice: 2132 100 to 499 employees: 1400
Several times: 1847 20 to 99 employees: 1479
5,000 to 9,999 employees: 271
500 to 999 employees: 430
Fewer than 10 employees: 520
I don't know: 83
I prefer not to answer: 19
Note: Some factors have too many levels (max: 21) -- only 20 most popular levels shown.
Use 'n_levels=...' parameter in order to change number of levels shown.
Gehaltnäheransehen
quantile(roh$Salary, c(0, .01, .05, .25, .5, .75, .95, .99, 1))
0% 1% 5% 25% 50% 75%
1.468213e-02 7.034859e+02 4.404640e+03 3.548387e+04 5.662500e+04 8.733154e+04
95% 99% 100%
1.380000e+05 1.700000e+05 1.950000e+05
head(roh[order(roh$Salary), c("Country", "Salary", "TabSpaces")], 15)
Country Salary TabSpaces
1171 India 0.01468213 Tabs
3666 India 0.04404640 Tabs
3788 India 0.04404640 Tabs
3596 India 0.05872853 Both
5869 India 0.10277492 Tabs
454 India 0.11745705 Tabs
6349 India 0.14682132 Both
5411 India 15.00000000 Spaces
5888 Russian Federation 18.04511278 Tabs
4416 France 44.08602151 Both
2296 Italy 45.16129032 Tabs
2862 France 47.31182796 Spaces
651 Sweden 48.64253394 Tabs
LVDAA,ArnoHollosi 4

2. DATENLADENUNDSICHTEN
| 729 United           | Kingdom 51.25000000  | Spaces  |     |     |
| -------------------- | -------------------- | ------- | --- | --- |
| 2929                 | France 53.76344086   | Tabs    |     |     |
| plothist(roh$Salary, | main = "Jahresgehalt | [USD]") |     |     |
Jahresgehalt [USD]
median = 56600
95% HDI
| 0.044 |       | 138000 |        |        |
| ----- | ----- | ------ | ------ | ------ |
| 0     | 50000 | 100000 | 150000 | 200000 |
LVDAA,ArnoHollosi 5

|                      |           |       |     |          |                 |     |                   |     |     | 3.  | DATENAUFBEREITEN |     |
| -------------------- | --------- | ----- | --- | -------- | --------------- | --- | ----------------- | --- | --- | --- | ---------------- | --- |
| # nur                | Bereich   | >1000 | USD | anzeigen |                 |     |                   |     |     |     |                  |     |
| plothist(roh$Salary, |           |       |     | main     | = "Jahresgehalt |     | (logarithmiert)", |     |     |     |                  |     |
|                      | transform |       | =   | log10,   | xlim=c(3,       |     | 6))               |     |     |     |                  |     |
Jahresgehalt (logarithmiert)
|     |     |     |     |     |     |     |     | median |     | = 4.75 |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | --- | ------ | --- | --- |
95% HDI
|          |     |             |     |     | 3.64 |     |     |     |     | 5.27 |     |     |
| -------- | --- | ----------- | --- | --- | ---- | --- | --- | --- | --- | ---- | --- | --- |
|          |     | 3.0         |     |     | 3.5  |     | 4.0 |     | 4.5 | 5.0  | 5.5 | 6.0 |
| 3. Daten |     | aufbereiten |     |     |      |     |     |     |     |      |     |     |
Leitfragen
• WelcheZeilenwerdenauswelchenGründenausgeschlossen,undwieverändernsichdadurchUmfangund
ZusammensetzungderStichprobe?
• Welche Annahmen stecken in den Referenzgruppen, der Gehaltsuntergrenze und der metrischen
| UmrechnungderKategorien? |       |     |           |     | BeurteilenSiediese. |     |     |     |     |     |     |     |
| ------------------------ | ----- | --- | --------- | --- | ------------------- | --- | --- | --- | --- | --- | --- | --- |
| daten0                   | = roh |     |           |     |                     |     |     |     |     |     |     |     |
| # Unbekannt              |       | als | NA setzen |     |                     |     |     |     |     |     |     |     |
daten0$CompanySize[daten0$CompanySize %in% c("I don't know", "I prefer not to answer")] = NA
| # Faktoren             |     | erzeugen |     |                                  |     |     |     |     |     |     |     |     |
| ---------------------- | --- | -------- | --- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| daten0$LearningNewTech |     |          |     | = factor(daten0$LearningNewTech) |     |     |     |     |     |     |     |     |
daten0$StackOverflowCopiedCode = factor(daten0$StackOverflowCopiedCode)
| # Faktoren |     | in passende |     | Reihenfolge |     | bringen |     |     |     |     |     |     |
| ---------- | --- | ----------- | --- | ----------- | --- | ------- | --- | --- | --- | --- | --- | --- |
jahre_stufen = c("Less than a year", paste(1:19, "to", 2:20, "years"),
|     |     |     | "20 | or more | years") |     |     |     |     |     |     |     |
| --- | --- | --- | --- | ------- | ------- | --- | --- | --- | --- | --- | --- | --- |
daten0$YearsProgram = factor(daten0$YearsProgram, levels = jahre_stufen)
firma_stufen = c("Fewer than 10 employees", "10 to 19 employees",
|     |     |     | "20    | to 99  | employees", |             | "100 to 499 | employees", |                     |     |     |     |
| --- | --- | --- | ------ | ------ | ----------- | ----------- | ----------- | ----------- | ------------------- | --- | --- | --- |
|     |     |     | "500   | to 999 | employees", |             | "1,000      | to 4,999    | employees",         |     |     |     |
|     |     |     | "5,000 | to     | 9,999       | employees", | "10,000     |             | or more employees") |     |     |     |
daten0$CompanySize = factor(daten0$CompanySize, levels = firma_stufen)
daten0$TabSpaces = factor(daten0$TabSpaces, levels = c("Tabs", "Spaces", "Both"))
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     |     |     | 6   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

3. DATENAUFBEREITEN
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
Basis-Datensatz: nurvollständigemitpositivemSalary
vollstaendig = complete.cases(daten0)
positiv = is.finite(daten0$Salary) & daten0$Salary > 0
basis = droplevels(daten0[vollstaendig & positiv, ])
basis$LogSalary = log(basis$Salary)
Datensatz: Mindestgehalt: 5000USD/Jahr
untergrenze = 5000
daten = droplevels(basis[basis$Salary >= untergrenze, ])
daten$LogSalary = log(daten$Salary)
Übersicht
print(data.frame(
Schritt = c("Eingelesen", "Vollständige Angaben", "Zusätzlich Salary > 0",
"Zusätzlich Salary >= 5000"),
Anzahl = c(nrow(roh), sum(vollstaendig), nrow(basis), nrow(daten))))
Schritt Anzahl
1 Eingelesen 6543
2 Vollständige Angaben 6441
3 Zusätzlich Salary > 0 6441
4 Zusätzlich Salary >= 5000 6098
perLand: GehaltkleinerUntergrenze?
with(daten0, table(Country, Salary < untergrenze))
Country FALSE TRUE
United States 2382 7
Australia 169 1
Austria 81 4
Brazil 121 27
Canada 415 1
France 275 9
Germany 611 24
India 290 149
LVDAA,ArnoHollosi 7

3. DATENAUFBEREITEN
| Israel         |                           |      | 84  | 5      |                 |
| -------------- | ------------------------- | ---- | --- | ------ | --------------- |
| Italy          |                           |      | 123 | 1      |                 |
| Netherlands    |                           |      | 135 | 4      |                 |
| Poland         |                           |      | 150 | 47     |                 |
| Romania        |                           |      | 61  | 20     |                 |
| Russian        | Federation                |      | 80  | 34     |                 |
| Spain          |                           |      | 156 | 1      |                 |
| Sweden         |                           |      | 117 | 12     |                 |
| Switzerland    |                           |      | 90  | 1      |                 |
| United         | Kingdom                   |      | 855 | 1      |                 |
| perEinrückung: | GehaltkleinerUntergrenze? |      |     |        |                 |
| with(daten0,   | table(TabSpaces,          |      |     | Salary | < untergrenze)) |
| TabSpaces      | FALSE                     | TRUE |     |        |                 |
| Tabs           | 2416                      | 166  |     |        |                 |
| Spaces         | 2903                      | 103  |     |        |                 |
| Both           | 876                       | 79   |     |        |                 |
EinrückungperLand
| with(daten, | table(Country, |     | TabSpaces)) |     |     |
| ----------- | -------------- | --- | ----------- | --- | --- |
TabSpaces
| Country     |            | Tabs | Spaces |      | Both |
| ----------- | ---------- | ---- | ------ | ---- | ---- |
| United      | States     |      | 837    | 1187 | 313  |
| Australia   |            |      | 57     | 90   | 18   |
| Austria     |            |      | 37     | 30   | 14   |
| Brazil      |            |      | 53     | 46   | 20   |
| Canada      |            |      | 176    | 179  | 55   |
| France      |            |      | 105    | 125  | 42   |
| Germany     |            |      | 230    | 308  | 68   |
| India       |            |      | 149    | 58   | 80   |
| Israel      |            |      | 34     | 35   | 12   |
| Italy       |            |      | 54     | 46   | 21   |
| Netherlands |            |      | 47     | 70   | 18   |
| Poland      |            |      | 52     | 79   | 17   |
| Romania     |            |      | 29     | 20   | 12   |
| Russian     | Federation |      | 16     | 55   | 8    |
| Spain       |            |      | 79     | 61   | 15   |
| Sweden      |            |      | 43     | 55   | 19   |
| Switzerland |            |      | 34     | 41   | 15   |
| United      | Kingdom    |      | 337    | 385  | 112  |
EinrückungjeErfahrung
| with(daten, | table(YearsProgram, |     |     | TabSpaces)) |     |
| ----------- | ------------------- | --- | --- | ----------- | --- |
TabSpaces
| YearsProgram |             | Tabs | Spaces | Both |     |
| ------------ | ----------- | ---- | ------ | ---- | --- |
| 20 or        | more years  | 426  |        | 754  | 205 |
| Less         | than a year | 11   |        | 3    | 7   |
| 1 to         | 2 years     | 44   |        | 23   | 13  |
| 2 to         | 3 years     | 85   |        | 41   | 29  |
| 3 to         | 4 years     | 139  |        | 90   | 41  |
| 4 to         | 5 years     | 149  |        | 125  | 51  |
LVDAA,ArnoHollosi 8

4. BESCHREIBENDEAUSWERTUNG
| 5 to             | 6 years  |     | 162        | 120 | 58  |     |     |     |     |     |     |     |
| ---------------- | -------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 6 to             | 7 years  |     | 138        | 115 | 47  |     |     |     |     |     |     |     |
| 7 to             | 8 years  |     | 122        | 139 | 52  |     |     |     |     |     |     |     |
| 8 to             | 9 years  |     | 117        | 106 | 46  |     |     |     |     |     |     |     |
| 9 to             | 10 years |     | 187        | 211 | 59  |     |     |     |     |     |     |     |
| 10 to            | 11 years |     | 119        | 178 | 37  |     |     |     |     |     |     |     |
| 11 to            | 12 years |     | 79         | 112 | 23  |     |     |     |     |     |     |     |
| 12 to            | 13 years |     | 91         | 106 | 37  |     |     |     |     |     |     |     |
| 13 to            | 14 years |     | 63         | 101 | 17  |     |     |     |     |     |     |     |
| 14 to            | 15 years |     | 111        | 167 | 42  |     |     |     |     |     |     |     |
| 15 to            | 16 years |     | 112        | 145 | 27  |     |     |     |     |     |     |     |
| 16 to            | 17 years |     | 53         | 80  | 19  |     |     |     |     |     |     |     |
| 17 to            | 18 years |     | 63         | 100 | 17  |     |     |     |     |     |     |     |
| 18 to            | 19 years |     | 35         | 59  | 9   |     |     |     |     |     |     |     |
| 19 to            | 20 years |     | 63         | 95  | 23  |     |     |     |     |     |     |     |
| 4. Beschreibende |          |     | Auswertung |     |     |     |     |     |     |     |     |     |
Leitfragen
• WelcheGehaltsunterschiedezeigendieGruppenvergleicheinsgesamtundinnerhalbderLänder?
• WelcheAussagenlassendieseVergleichezurFragestellungbereitszu,undwelcheFragenbleibenoffen?
| daten |> | group_by(TabSpaces) |     |     | |>  |     |     |     |     |     |     |     |     |
| -------- | ------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
summarise(n = n(), Mittelwert = mean(Salary), Median = median(Salary),
|                          | Q25   | = quantile(Salary, |            |             | .25), | Q75    | = quantile(Salary, |     |     | .75)) |     |     |
| ------------------------ | ----- | ------------------ | ---------- | ----------- | ----- | ------ | ------------------ | --- | --- | ----- | --- | --- |
| # A tibble:              | 3     | x 6                |            |             |       |        |                    |     |     |       |     |     |
| TabSpaces                |       | n                  | Mittelwert | Median      |       | Q25    | Q75                |     |     |       |     |     |
| <fct>                    | <int> |                    | <dbl>      | <dbl>       |       | <dbl>  | <dbl>              |     |     |       |     |     |
| 1 Tabs                   |       | 2369               | 59149.     | 52856.      |       | 34409. | 78452              |     |     |       |     |     |
| 2 Spaces                 |       | 2870               | 74155.     | 64516.      |       | 45000  | 100000             |     |     |       |     |     |
| 3 Both                   |       | 859                | 61377.     | 55682.      |       | 36325  | 83333.             |     |     |       |     |     |
| WohabenwirwievieleDaten? |       |                    |            | (inProzent) |       |        |                    |     |     |       |     |     |
round(prop.table(with(daten, table(TabSpaces, Country)), margin = 1), 3)*100
Country
TabSpaces United States Australia Austria Brazil Canada France Germany India Israel Italy
| Tabs   |     |     | 35.3 | 2.4 |     | 1.6 | 2.2 | 7.4 | 4.4 | 9.7  | 6.3 1.4 | 2.3 |
| ------ | --- | --- | ---- | --- | --- | --- | --- | --- | --- | ---- | ------- | --- |
| Spaces |     |     | 41.4 | 3.1 |     | 1.0 | 1.6 | 6.2 | 4.4 | 10.7 | 2.0 1.2 | 1.6 |
| Both   |     |     | 36.4 | 2.1 |     | 1.6 | 2.3 | 6.4 | 4.9 | 7.9  | 9.3 1.4 | 2.4 |
Country
TabSpaces Netherlands Poland Romania Russian Federation Spain Sweden Switzerland
| Tabs   |     |     | 2.0 2.2 |     | 1.2 |     |     | 0.7 | 3.3 | 1.8 | 1.4 |     |
| ------ | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Spaces |     |     | 2.4 2.8 |     | 0.7 |     |     | 1.9 | 2.1 | 1.9 | 1.4 |     |
| Both   |     |     | 2.1 2.0 |     | 1.4 |     |     | 0.9 | 1.7 | 2.2 | 1.7 |     |
Country
| TabSpaces | United | Kingdom |      |     |     |     |     |     |     |     |     |     |
| --------- | ------ | ------- | ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tabs      |        |         | 14.2 |     |     |     |     |     |     |     |     |     |
| Spaces    |        |         | 13.4 |     |     |     |     |     |     |     |     |     |
| Both      |        |         | 13.0 |     |     |     |     |     |     |     |     |     |
GehaltalsBoxplots
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     |     |     | 9   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

4. BESCHREIBENDEAUSWERTUNG
| ggplot(daten, | aes(TabSpaces,  | Salary))          | + geom_boxplot() | +       |     |
| ------------- | --------------- | ----------------- | ---------------- | ------- | --- |
| labs(x        | = "Einrückung", | y = "Jahresgehalt |                  | [USD]") |     |
200000
150000
]DSU[ tlahegserhaJ
100000
50000
0
|     | Tabs |     |     | Spaces | Both |
| --- | ---- | --- | --- | ------ | ---- |
Einrückung
LVDAA,ArnoHollosi 10

4. BESCHREIBENDEAUSWERTUNG
| ggplot(daten,   |     | aes(TabSpaces, | Salary)) | + geom_boxplot() |     | +   |     |     |     |
| --------------- | --- | -------------- | -------- | ---------------- | --- | --- | --- | --- | --- |
| scale_y_log10() |     | +              |          |                  |     |     |     |     |     |
| facet_wrap(~    |     | Country, ncol  | = 5) +   |                  |     |     |     |     |     |
labs(x = "Einrückung", y = "Jahresgehalt [USD, logarithmisch]")
|     |     | United States | Australia |     | Austria |     | Brazil |     | Canada |
| --- | --- | ------------- | --------- | --- | ------- | --- | ------ | --- | ------ |
1e+05
3e+04
1e+04
|     |     | France | Germany |     | India |     | Israel |     | Italy |
| --- | --- | ------ | ------- | --- | ----- | --- | ------ | --- | ----- |
1e+05
3e+04
]hcsimhtiragol ,DSU[ tlahegserhaJ
1e+04
|     |     | Netherlands | Poland |     | Romania |     | Russian Federation |     | Spain |
| --- | --- | ----------- | ------ | --- | ------- | --- | ------------------ | --- | ----- |
1e+05
3e+04
1e+04
|     |     |        |             |     |                |     | Tabs Spaces | Both Tabs | Spaces Both |
| --- | --- | ------ | ----------- | --- | -------------- | --- | ----------- | --------- | ----------- |
|     |     | Sweden | Switzerland |     | United Kingdom |     |             |           |             |
1e+05
3e+04
1e+04
|     | Tabs | Spaces Both | Tabs Spaces | Both | Tabs Spaces | Both |     |     |     |
| --- | ---- | ----------- | ----------- | ---- | ----------- | ---- | --- | --- | --- |
Einrückung
LVDAA,ArnoHollosi 11

5. TRAININGS-UNDTESTDATEN
| ggplot(daten, |     | aes(Erfahrung, |     |     | LogSalary)) | +   |     |     |     |     |     |     |
| ------------- | --- | -------------- | --- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- |
geom_point(alpha = .1, position = position_jitter(width = .15, height = 0)) +
| geom_smooth(method |     |     | =          | "loess", | formula | = y | ~ x) | +   |     |     |     |     |
| ------------------ | --- | --- | ---------- | -------- | ------- | --- | ---- | --- | --- | --- | --- | --- |
| facet_wrap(~       |     |     | TabSpaces) | +        |         |     |      |     |     |     |     |     |
labs(x = "Programmiererfahrung [Näherung, Jahre]", y = "log(Jahresgehalt / USD)")
|     |     |     | Tabs |     |     |     |     | Spaces |     |     | Both |     |
| --- | --- | --- | ---- | --- | --- | --- | --- | ------ | --- | --- | ---- | --- |
12
)DSU / tlahegserhaJ(gol
11
10
9
|     | 0   | 5   | 10  | 15  | 20  | 0   | 5   | 10 15 | 20  | 0 5 | 10 15 | 20  |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | ----- | --- |
Programmiererfahrung [Näherung, Jahre]
| 5.  | Trainings- |     | und | Testdaten |     |     |     |     |     |     |     |     |
| --- | ---------- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
Leitfragen
• WozuwerdendieDatenaufgeteilt,undwelcheGrößenhabendieTeilmengen?
• WelcheFolgenhätteeineunterschiedlicheGruppenanzahl?
| split_random(daten, |      |                   | 5000, | "training", |        | "test",     | seed | = 2026) |     |     |     |     |
| ------------------- | ---- | ----------------- | ----- | ----------- | ------ | ----------- | ---- | ------- | --- | --- | --- | --- |
| c(Training          |      | = nrow(training), |       |             | Test = | nrow(test)) |      |         |     |     |     |     |
| Training            |      |                   | Test  |             |        |             |      |         |     |     |     |     |
|                     | 5000 |                   | 1098  |             |        |             |      |         |     |     |     |     |
HabendieTrain-undTestdatendieselbenGruppen?
for (variable in c("Country", "YearsProgram", "CompanySize", "LearningNewTech",
|               |     |     | "StackOverflowCopiedCode",                      |     |     |     | "TabSpaces")) |     | {   |     |     |     |
| ------------- | --- | --- | ----------------------------------------------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- |
| cat(variable, |     |     | ": ")                                           |     |     |     |               |     |     |     |     |     |
| group_diff    |     | =   | setdiff(unique(as.character(test[[variable]])), |     |     |     |               |     |     |     |     |     |
unique(as.character(training[[variable]])))
cat(ifelse(length(group_diff) > 0, group_diff, "Keine Differenz\n"))
}
| Country           |     | : Keine | Differenz       |           |     |     |     |     |     |     |     |     |
| ----------------- | --- | ------- | --------------- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
| YearsProgram      |     |         | : Keine         | Differenz |     |     |     |     |     |     |     |     |
| CompanySize       |     | :       | Keine Differenz |           |     |     |     |     |     |     |     |     |
| LearningNewTech   |     |         | : Keine         | Differenz |     |     |     |     |     |     |     |     |
| LVDAA,ArnoHollosi |     |         |                 |           |     |     |     |     |     |     |     | 12  |

6. MODELL1
| StackOverflowCopiedCode |     |         |           | : Keine | Differenz |     |     |     |     |
| ----------------------- | --- | ------- | --------- | ------- | --------- | --- | --- | --- | --- |
| TabSpaces               |     | : Keine | Differenz |         |           |     |     |     |     |
| 6. Modell               |     | 1       |           |         |           |     |     |     |     |
Leitfragen
• WasbedeutenIntercept,TabSpaces-KoeﬀizientenundsigmaindiesemModell?
• WelcheAnnahmenüberdasGehaltverwendetdasModell?
• WarSamplingok? WiebeurteilenSiedieBerechnunganhandvonRhat,n_eff,MCSE,Traceplots?
• WassagtdiePrüfungvonmean_PPDaus,undwelcheAussagenüberdieEignungeinesModellssinddurch
gutesSamplingalleinnichtgedeckt?
modell1 = stan_glm(Salary ~ TabSpaces, data = training, seed=2026, refresh=0)
check_sampling(modell1)
| n_eff               | >=  | 400:         | Check OK.       |                        |              |             |           |       |     |
| ------------------- | --- | ------------ | --------------- | ---------------------- | ------------ | ----------- | --------- | ----- | --- |
| MCSE                | <   | 5% of MAD:   | Check           | OK.                    |              |             |           |       |     |
| Rhat                | <=  | 1.01:        | Check OK.       |                        |              |             |           |       |     |
| Sampling            |     | diagnostics  |                 | (sorted                | by n_eff,    | ascending): |           |       |     |
|                     |     |              | n_eff           | mcse_mad               | Rhat         |             |           |       |     |
| TabSpacesSpaces     |     |              | 4551            | 0.015                  | 1            |             |           |       |     |
| TabSpacesBoth       |     |              | 4622            | 0.015                  | 1            |             |           |       |     |
| mean_PPD            |     | vs. mean(y): |                 | Check                  | OK.          |             |           |       |     |
| mean(y)             |     | must lie     | within          | the                    | 95% interval | of          | mean_PPD. |       |     |
| mean_PPD            |     | mean_y       |                 | lower                  | upper        |             |           |       |     |
| 66362.19            |     | 66372.25     | 64862.37        |                        | 67811.91     |             |           |       |     |
| mcmc_trace(modell1, |     |              | pars            | = c("TabSpacesSpaces", |              |             | "sigma")) |       |     |
|                     |     |              | TabSpacesSpaces |                        |              |             |           | sigma |     |
18000
16000
Chain
38000
1
14000 2
3
37000
4
12000
10000
36000
|     | 0   | 200 | 400 | 600 | 800 1000 |     | 0 200 | 400 600 | 800 1000 |
| --- | --- | --- | --- | --- | -------- | --- | ----- | ------- | -------- |
modell1
stan_glm
| family:       |     |     | gaussian | [identity]  |     |     |     |     |     |
| ------------- | --- | --- | -------- | ----------- | --- | --- | --- | --- | --- |
| formula:      |     |     | Salary   | ~ TabSpaces |     |     |     |     |     |
| observations: |     |     | 5000     |             |     |     |     |     |     |
| predictors:   |     |     | 3        |             |     |     |     |     |     |
------
|     |     |     | Median | MAD_SD |     |     |     |     |     |
| --- | --- | --- | ------ | ------ | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 13

7. MODELL2
(Intercept) 59253.1 860.6
TabSpacesSpaces 13972.9 1135.8
TabSpacesBoth 3814.1 1646.7
Auxiliary parameter(s):
Median MAD_SD
sigma 37216.7 369.0
------
* For help interpreting the printed output see ?print.stanreg
* For info on the priors used see ?prior_summary.stanreg
7. Modell 2
Leitfragen
• Wie unterscheidet sich die Bedeutung der Koeﬀizienten von Modell 1, und wie erhalten Sie einen
prozentuellenGruppenunterschied?
• WelcheFolgenhatdieTransformationfürdieVerteilungsannahmeunddieInterpretationderGehaltsvorhersagen?
modell2 = stan_glm(LogSalary ~ TabSpaces, data = training, seed = 2026, refresh = 0)
check_sampling(modell2)
n_eff >= 400: Check OK.
MCSE < 5% of MAD: Check OK.
Rhat <= 1.01: Check OK.
Sampling diagnostics (sorted by n_eff, ascending):
n_eff mcse_mad Rhat
log-posterior 1627 0.028 1.003
TabSpacesBoth 3725 0.016 1.000
(Intercept) 3877 0.016 0.999
mean_PPD 4079 0.016 1.000
TabSpacesSpaces 4256 0.015 0.999
sigma 4518 0.015 1.000
mean_PPD vs. mean(y): Check OK.
mean(y) must lie within the 95% interval of mean_PPD.
mean_PPD mean_y lower upper
10.907 10.908 10.880 10.933
mcmc_trace(modell2, pars = c("TabSpacesSpaces", "sigma"))
LVDAA,ArnoHollosi 14

7. MODELL2
|     |     |     | TabSpacesSpaces |     |     |     |     |     | sigma |     |
| --- | --- | --- | --------------- | --- | --- | --- | --- | --- | ----- | --- |
0.70
0.30
0.69 Chain
1
| 0.26 |     |     |     |     |     |     | 0.68 |     |     |     |
| ---- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | --- |
2
3
0.67
4
0.22
0.66
0.18
|                | 0   | 200 | 400    | 600  |     | 800 | 1000 | 0 200 | 400 600 | 800 1000 |
| -------------- | --- | --- | ------ | ---- | --- | --- | ---- | ----- | ------- | -------- |
| print(modell2, |     |     | digits | = 3) |     |     |      |       |         |          |
stan_glm
|     | family:       |     | gaussian  | [identity] |           |     |     |     |     |     |
| --- | ------------- | --- | --------- | ---------- | --------- | --- | --- | --- | --- | --- |
|     | formula:      |     | LogSalary | ~          | TabSpaces |     |     |     |     |     |
|     | observations: |     | 5000      |            |           |     |     |     |     |     |
|     | predictors:   |     | 3         |            |           |     |     |     |     |     |
------
|     |                 |               | Median | MAD_SD |     |     |     |     |     |     |
| --- | --------------- | ------------- | ------ | ------ | --- | --- | --- | --- | --- | --- |
|     | (Intercept)     |               | 10.781 | 0.015  |     |     |     |     |     |     |
|     | TabSpacesSpaces |               | 0.254  | 0.021  |     |     |     |     |     |     |
|     | TabSpacesBoth   |               | 0.047  | 0.029  |     |     |     |     |     |     |
|     | Auxiliary       | parameter(s): |        |        |     |     |     |     |     |     |
|     |                 | Median        | MAD_SD |        |     |     |     |     |     |     |
|     | sigma           | 0.678         | 0.007  |        |     |     |     |     |     |     |
------
|                           | * For          | help interpreting |                 | the     | printed   |                        | output see    | ?print.stanreg |     |     |
| ------------------------- | -------------- | ----------------- | --------------- | ------- | --------- | ---------------------- | ------------- | -------------- | --- | --- |
|                           | * For          | info on           | the priors      | used    | see       | ?prior_summary.stanreg |               |                |     |     |
| round(exp(coef(modell2)), |                |                   |                 | 2)      |           |                        |               |                |     |     |
|                           | (Intercept)    |                   | TabSpacesSpaces |         |           | TabSpacesBoth          |               |                |     |     |
|                           |                | 48121.07          |                 |         | 1.29      |                        | 1.05          |                |     |     |
| #                         | Hilfsfunktion: |                   | umrechnen       | in      | Prozent   |                        |               |                |     |     |
| to_percent                |                | = function(x)     |                 | (exp(x) |           | - 1)*100               |               |                |     |     |
| plotcoef(modell2,         |                |                   | "TabSpaces",    |         | transform |                        | = to_percent) |                |     |     |
LVDAA,ArnoHollosi 15

8. MODELL3
TabSpacesSpaces
netneizffieoK
TabSpacesBoth
|           |     |     | 0   |     |     | 10  |     | 20  | 30  |
| --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 8. Modell | 3   |     |     |     |     |     |     |     |     |
Leitfragen
• WieistderSpaces-KoeﬀizientunterBerücksichtigungderzusätzlichenVariablenzuinterpretieren?
• Wie verändert sich die Schätzung gegenüber Modell 2, und wie erklären und beurteilen Sie diese
Veränderung?
modell3 = stan_glm(LogSalary ~ TabSpaces + Country + YearsProgram,
|     |     | data | = training, |     | seed | = 2026, | refresh | = 0) |     |
| --- | --- | ---- | ----------- | --- | ---- | ------- | ------- | ---- | --- |
check_sampling(modell3)
| n_eff >=            | 400:        | Check            | OK.       |                      |          |             |           |     |     |
| ------------------- | ----------- | ---------------- | --------- | -------------------- | -------- | ----------- | --------- | --- | --- |
| MCSE <              | 5% of       | MAD:             | Check OK. |                      |          |             |           |     |     |
| Rhat <=             | 1.01:       | Check            | OK.       |                      |          |             |           |     |     |
| Sampling            | diagnostics |                  | (sorted   | by                   | n_eff,   | ascending): |           |     |     |
|                     |             |                  |           | n_eff                | mcse_mad |             | Rhat      |     |     |
| log-posterior       |             |                  |           | 1467                 | 0.027    | 1.002       |           |     |     |
| (Intercept)         |             |                  |           | 3912                 | 0.016    | 1.000       |           |     |     |
| YearsProgram3       |             | to 4             | years     | 4350                 | 0.015    | 1.000       |           |     |     |
| YearsProgram5       |             | to 6             | years     | 4621                 | 0.015    | 1.001       |           |     |     |
| YearsProgram4       |             | to 5             | years     | 4823                 | 0.014    | 1.000       |           |     |     |
| YearsProgram16      |             | to               | 17 years  | 5020                 | 0.014    | 1.000       |           |     |     |
| YearsProgram9       |             | to 10            | years     | 5032                 | 0.014    | 1.000       |           |     |     |
| YearsProgram12      |             | to               | 13 years  | 5063                 | 0.014    | 1.000       |           |     |     |
| YearsProgram10      |             | to               | 11 years  | 5151                 | 0.014    | 1.000       |           |     |     |
| YearsProgram14      |             | to               | 15 years  | 5193                 | 0.014    | 1.000       |           |     |     |
| Showing             | 10 of       | 43 coefficients. |           |                      |          |             |           |     |     |
| mean_PPD            | vs.         | mean(y):         | Check     | OK.                  |          |             |           |     |     |
| mean(y)             | must        | lie within       | the       | 95%                  | interval | of          | mean_PPD. |     |     |
| mean_PPD            | mean_y      |                  | lower     | upper                |          |             |           |     |     |
| 10.908              | 10.908      |                  | 10.892    | 10.923               |          |             |           |     |     |
| mcmc_trace(modell3, |             |                  | pars =    | c("TabSpacesSpaces", |          |             | "sigma")) |     |     |
LVDAA,ArnoHollosi 16

8. MODELL3
|     | TabSpacesSpaces |     |     |     | sigma |     |     |
| --- | --------------- | --- | --- | --- | ----- | --- | --- |
0.40
0.14
Chain
| 0.12 |     |     | 0.39 |     |     |     | 1   |
| ---- | --- | --- | ---- | --- | --- | --- | --- |
2
| 0.10 |     |     |     |     |     |     | 3   |
| ---- | --- | --- | --- | --- | --- | --- | --- |
4
0.38
0.08
| 0 200          | 400      | 600 800 | 1000 | 0 200 | 400 600 | 800 1000 |     |
| -------------- | -------- | ------- | ---- | ----- | ------- | -------- | --- |
| print(modell3, | digits = | 3)      |      |       |         |          |     |
stan_glm
| family:       | gaussian  | [identity]  |           |                |     |     |     |
| ------------- | --------- | ----------- | --------- | -------------- | --- | --- | --- |
| formula:      | LogSalary | ~ TabSpaces | + Country | + YearsProgram |     |     |     |
| observations: | 5000      |             |           |                |     |     |     |
| predictors:   | 40        |             |           |                |     |     |     |
------
|                    |             | Median        | MAD_SD |     |     |     |     |
| ------------------ | ----------- | ------------- | ------ | --- | --- | --- | --- |
| (Intercept)        |             | 11.573        | 0.015  |     |     |     |     |
| TabSpacesSpaces    |             | 0.112         | 0.012  |     |     |     |     |
| TabSpacesBoth      |             | 0.044         | 0.017  |     |     |     |     |
| CountryAustralia   |             | -0.308        | 0.033  |     |     |     |     |
| CountryAustria     |             | -0.659        | 0.050  |     |     |     |     |
| CountryBrazil      |             | -1.494        | 0.038  |     |     |     |     |
| CountryCanada      |             | -0.494        | 0.023  |     |     |     |     |
| CountryFrance      |             | -0.761        | 0.027  |     |     |     |     |
| CountryGermany     |             | -0.612        | 0.019  |     |     |     |     |
| CountryIndia       |             | -1.823        | 0.027  |     |     |     |     |
| CountryIsrael      |             | -0.472        | 0.051  |     |     |     |     |
| CountryItaly       |             | -1.100        | 0.040  |     |     |     |     |
| CountryNetherlands |             | -0.709        | 0.038  |     |     |     |     |
| CountryPoland      |             | -1.276        | 0.036  |     |     |     |     |
| CountryRomania     |             | -1.241        | 0.055  |     |     |     |     |
| CountryRussian     | Federation  | -1.406        | 0.051  |     |     |     |     |
| CountrySpain       |             | -1.026        | 0.038  |     |     |     |     |
| CountrySweden      |             | -0.613        | 0.039  |     |     |     |     |
| CountrySwitzerland |             | 0.007         | 0.046  |     |     |     |     |
| CountryUnited      | Kingdom     | -0.577        | 0.018  |     |     |     |     |
| YearsProgramLess   | than        | a year -0.538 | 0.095  |     |     |     |     |
| YearsProgram1      | to 2 years  | -0.613        | 0.047  |     |     |     |     |
| YearsProgram2      | to 3 years  | -0.573        | 0.038  |     |     |     |     |
| YearsProgram3      | to 4 years  | -0.547        | 0.028  |     |     |     |     |
| YearsProgram4      | to 5 years  | -0.483        | 0.027  |     |     |     |     |
| YearsProgram5      | to 6 years  | -0.492        | 0.026  |     |     |     |     |
| YearsProgram6      | to 7 years  | -0.428        | 0.027  |     |     |     |     |
| YearsProgram7      | to 8 years  | -0.392        | 0.027  |     |     |     |     |
| YearsProgram8      | to 9 years  | -0.400        | 0.031  |     |     |     |     |
| YearsProgram9      | to 10 years | -0.324        | 0.023  |     |     |     |     |
| LVDAA,ArnoHollosi  |             |               |        |     |     |     | 17  |

9. MODELL4
| YearsProgram10 |        |               | to 11  | years |     | -0.291 | 0.026 |     |     |     |     |
| -------------- | ------ | ------------- | ------ | ----- | --- | ------ | ----- | --- | --- | --- | --- |
| YearsProgram11 |        |               | to 12  | years |     | -0.262 | 0.031 |     |     |     |     |
| YearsProgram12 |        |               | to 13  | years |     | -0.259 | 0.030 |     |     |     |     |
| YearsProgram13 |        |               | to 14  | years |     | -0.178 | 0.034 |     |     |     |     |
| YearsProgram14 |        |               | to 15  | years |     | -0.089 | 0.027 |     |     |     |     |
| YearsProgram15 |        |               | to 16  | years |     | -0.112 | 0.028 |     |     |     |     |
| YearsProgram16 |        |               | to 17  | years |     | -0.143 | 0.035 |     |     |     |     |
| YearsProgram17 |        |               | to 18  | years |     | -0.074 | 0.034 |     |     |     |     |
| YearsProgram18 |        |               | to 19  | years |     | -0.083 | 0.044 |     |     |     |     |
| YearsProgram19 |        |               | to 20  | years |     | -0.078 | 0.033 |     |     |     |     |
| Auxiliary      |        | parameter(s): |        |       |     |        |       |     |     |     |     |
|                | Median |               | MAD_SD |       |     |        |       |     |     |     |     |
| sigma          | 0.387  |               | 0.004  |       |     |        |       |     |     |     |     |
------
| *                              | For help    | interpreting |                 |     | the printed |                            | output | see ?print.stanreg |     |     |     |
| ------------------------------ | ----------- | ------------ | --------------- | --- | ----------- | -------------------------- | ------ | ------------------ | --- | --- | --- |
| *                              | For info    | on           | the priors      |     | used        | see ?prior_summary.stanreg |        |                    |     |     |     |
| round(exp(coef(modell3)[1:3]), |             |              |                 |     |             | 2)                         |        |                    |     |     |     |
|                                | (Intercept) |              | TabSpacesSpaces |     |             | TabSpacesBoth              |        |                    |     |     |     |
|                                | 106179.80   |              |                 |     | 1.12        |                            |        | 1.04               |     |     |     |
| plotcoef(modell3,              |             |              | "TabSpaces",    |     |             | transform                  | =      | to_percent)        |     |     |     |
TabSpacesSpaces
netneizffieoK
TabSpacesBoth
|     |     |     |     | 0   |     |     |     | 5   |     | 10  | 15  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
print(compare_coef(modell2, modell3, transform = to_percent, include="TabSpaces"))
|                 |        |     | modell2 |         |     |        | modell3 |                |     |     |     |
| --------------- | ------ | --- | ------- | ------- | --- | ------ | ------- | -------------- | --- | --- | --- |
| TabSpacesSpaces |        |     | 28.91   | [23.61, |     | 34.41] | 11.82   | [ 9.05, 14.44] |     |     |     |
| TabSpacesBoth   |        |     | 4.86    | [-1.22, |     | 10.81] | 4.50    | [ 1.09, 8.18]  |     |     |     |
| 9.              | Modell | 4   |         |         |     |        |         |                |     |     |     |
Leitfragen
• Wie verändert sich der geschätzte Zusammenhang gegenüber Modell 3, und welche Grenzen hat seine
Interpretation?
| modell4           | =               | stan_glm( |           |                         |         |                |     |               |     |     |     |
| ----------------- | --------------- | --------- | --------- | ----------------------- | ------- | -------------- | --- | ------------- | --- | --- | --- |
| LogSalary         |                 | ~         | TabSpaces | +                       | Country | + YearsProgram |     | + CompanySize | +   |     |     |
|                   | LearningNewTech |           | +         | StackOverflowCopiedCode |         |                |     | +             |     |     |     |
| LVDAA,ArnoHollosi |                 |           |           |                         |         |                |     |               |     |     | 18  |

9. MODELL4
Lang.JavaScript + Lang.Java + Lang.PHP + Lang.CSharp + Lang.Python + Lang.R +
Lang.Cpp + Lang.VBNet + Lang.Ruby + Lang.Perl + Lang.ObjectiveC + Lang.C,
| data | =   | training, |     | seed | = 2026, | refresh | = 0) |     |     |     |     |
| ---- | --- | --------- | --- | ---- | ------- | ------- | ---- | --- | --- | --- | --- |
check_sampling(modell4)
| n_eff               | >=     | 400:        | Check           | OK.           |                        |              |                |           |       |       |     |
| ------------------- | ------ | ----------- | --------------- | ------------- | ---------------------- | ------------ | -------------- | --------- | ----- | ----- | --- |
| MCSE                | <      | 5% of       | MAD:            | Check         | OK.                    |              |                |           |       |       |     |
| Rhat                | <=     | 1.01:       | Check           | OK.           |                        |              |                |           |       |       |     |
| Sampling            |        | diagnostics |                 | (sorted       |                        | by n_eff,    | ascending):    |           |       |       |     |
|                     |        |             |                 |               |                        |              | n_eff mcse_mad |           | Rhat  |       |     |
| log-posterior       |        |             |                 |               |                        |              | 1521           | 0.026     | 1.000 |       |     |
| (Intercept)         |        |             |                 |               |                        |              | 2780           | 0.020     | 1.000 |       |     |
| CompanySize100      |        |             | to              | 499           | employees              |              | 2938           | 0.018     | 1.000 |       |     |
| CompanySize10,000   |        |             |                 | or more       | employees              |              | 3097           | 0.018     | 1.000 |       |     |
| CompanySize10       |        |             | to              | 19 employees  |                        |              | 3132           | 0.018     | 0.999 |       |     |
| Lang.C              |        |             |                 |               |                        |              | 3209           | 0.017     | 1.000 |       |     |
| Lang.ObjectiveC     |        |             |                 |               |                        |              | 3746           | 0.016     | 1.000 |       |     |
| CompanySize1,000    |        |             |                 | to 4,999      | employees              |              | 3763           | 0.016     | 1.000 |       |     |
| YearsProgram9       |        |             | to              | 10 years      |                        |              | 3867           | 0.016     | 1.000 |       |     |
| YearsProgram10      |        |             | to              | 11 years      |                        |              | 3976           | 0.015     | 1.001 |       |     |
| Showing             |        | 10 of       | 70              | coefficients. |                        |              |                |           |       |       |     |
| mean_PPD            |        | vs.         | mean(y):        |               | Check                  | OK.          |                |           |       |       |     |
| mean(y)             |        | must        | lie             | within        | the                    | 95% interval | of             | mean_PPD. |       |       |     |
| mean_PPD            |        | mean_y      |                 | lower         |                        | upper        |                |           |       |       |     |
|                     | 10.908 | 10.908      |                 | 10.894        |                        | 10.922       |                |           |       |       |     |
| mcmc_trace(modell4, |        |             |                 | pars          | = c("TabSpacesSpaces", |              |                | "sigma")) |       |       |     |
|                     |        |             | TabSpacesSpaces |               |                        |              |                |           |       | sigma |     |
0.380
0.125
0.375
Chain
0.100
1
0.370
2
0.075
3
0.365
4
0.050
0.360
|                | 0   | 200 |        | 400 | 600 | 800 | 1000 |     | 0 200 | 400 600 | 800 1000 |
| -------------- | --- | --- | ------ | --- | --- | --- | ---- | --- | ----- | ------- | -------- |
| print(modell4, |     |     | digits | =   | 3)  |     |      |     |       |         |          |
stan_glm
|     | family: |     | gaussian |     | [identity] |     |     |     |     |     |     |
| --- | ------- | --- | -------- | --- | ---------- | --- | --- | --- | --- | --- | --- |
formula: LogSalary ~ TabSpaces + Country + YearsProgram + CompanySize +
|     | LearningNewTech |     |            | +   | StackOverflowCopiedCode |             |               | +   | Lang.JavaScript | +   |     |
| --- | --------------- | --- | ---------- | --- | ----------------------- | ----------- | ------------- | --- | --------------- | --- | --- |
|     | Lang.Java       |     | + Lang.PHP |     | +                       | Lang.CSharp | + Lang.Python |     | + Lang.R        | +   |     |
Lang.Cpp + Lang.VBNet + Lang.Ruby + Lang.Perl + Lang.ObjectiveC +
Lang.C
|     | observations: |     | 5000 |     |     |     |     |     |     |     |     |
| --- | ------------- | --- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 19

9. MODELL4
| predictors: | 67  |     |     |
| ----------- | --- | --- | --- |
------
Median MAD_SD
| (Intercept)             |                 |                | 11.591 0.023 |
| ----------------------- | --------------- | -------------- | ------------ |
| TabSpacesSpaces         |                 |                | 0.080 0.012  |
| TabSpacesBoth           |                 |                | 0.035 0.016  |
| CountryAustralia        |                 |                | -0.263 0.031 |
| CountryAustria          |                 |                | -0.604 0.048 |
| CountryBrazil           |                 |                | -1.471 0.038 |
| CountryCanada           |                 |                | -0.469 0.022 |
| CountryFrance           |                 |                | -0.709 0.026 |
| CountryGermany          |                 |                | -0.574 0.018 |
| CountryIndia            |                 |                | -1.823 0.027 |
| CountryIsrael           |                 |                | -0.448 0.048 |
| CountryItaly            |                 |                | -1.013 0.039 |
| CountryNetherlands      |                 |                | -0.664 0.036 |
| CountryPoland           |                 |                | -1.274 0.034 |
| CountryRomania          |                 |                | -1.177 0.055 |
| CountryRussian          | Federation      |                | -1.391 0.046 |
| CountrySpain            |                 |                | -0.989 0.036 |
| CountrySweden           |                 |                | -0.593 0.038 |
| CountrySwitzerland      |                 |                | 0.040 0.044  |
| CountryUnited           | Kingdom         |                | -0.542 0.017 |
| YearsProgramLess        | than            | a year         | -0.537 0.090 |
| YearsProgram1           | to 2 years      |                | -0.618 0.047 |
| YearsProgram2           | to 3 years      |                | -0.546 0.037 |
| YearsProgram3           | to 4 years      |                | -0.529 0.027 |
| YearsProgram4           | to 5 years      |                | -0.474 0.026 |
| YearsProgram5           | to 6 years      |                | -0.477 0.024 |
| YearsProgram6           | to 7 years      |                | -0.419 0.027 |
| YearsProgram7           | to 8 years      |                | -0.381 0.026 |
| YearsProgram8           | to 9 years      |                | -0.385 0.028 |
| YearsProgram9           | to 10 years     |                | -0.320 0.023 |
| YearsProgram10          | to 11           | years          | -0.269 0.026 |
| YearsProgram11          | to 12           | years          | -0.254 0.030 |
| YearsProgram12          | to 13           | years          | -0.247 0.027 |
| YearsProgram13          | to 14           | years          | -0.161 0.033 |
| YearsProgram14          | to 15           | years          | -0.082 0.026 |
| YearsProgram15          | to 16           | years          | -0.111 0.027 |
| YearsProgram16          | to 17           | years          | -0.150 0.036 |
| YearsProgram17          | to 18           | years          | -0.071 0.033 |
| YearsProgram18          | to 19           | years          | -0.103 0.040 |
| YearsProgram19          | to 20           | years          | -0.087 0.034 |
| CompanySizeFewer        | than            | 10 employees   | -0.155 0.022 |
| CompanySize10           | to 19 employees |                | -0.069 0.021 |
| CompanySize100          | to 499          | employees      | 0.048 0.016  |
| CompanySize500          | to 999          | employees      | 0.038 0.024  |
| CompanySize1,000        | to 4,999        | employees      | 0.074 0.020  |
| CompanySize5,000        | to 9,999        | employees      | 0.023 0.028  |
| CompanySize10,000       | or              | more employees | 0.117 0.018  |
| LearningNewTechDisagree |                 |                | -0.037 0.051 |
| LearningNewTechSomewhat |                 | agree          | 0.007 0.019  |
| LearningNewTechStrongly |                 | agree          | 0.004 0.011  |
| LearningNewTechStrongly |                 | disagree       | -0.030 0.163 |
LVDAA,ArnoHollosi 20

10. MODELL5
| StackOverflowCopiedCodeAt      |        |               |        |     | least | once  | each day  | -0.051 | 0.042 |     |
| ------------------------------ | ------ | ------------- | ------ | --- | ----- | ----- | --------- | ------ | ----- | --- |
| StackOverflowCopiedCodeAt      |        |               |        |     | least | once  | each week | -0.041 | 0.019 |     |
| StackOverflowCopiedCodeHaven't |        |               |        |     |       | done  | at all    | 0.019  | 0.014 |     |
| StackOverflowCopiedCodeSeveral |        |               |        |     |       | times |           | -0.019 | 0.014 |     |
| Lang.JavaScript                |        |               |        |     |       |       |           | 0.021  | 0.012 |     |
| Lang.Java                      |        |               |        |     |       |       |           | -0.006 | 0.011 |     |
| Lang.PHP                       |        |               |        |     |       |       |           | -0.162 | 0.013 |     |
| Lang.CSharp                    |        |               |        |     |       |       |           | -0.067 | 0.012 |     |
| Lang.Python                    |        |               |        |     |       |       |           | 0.013  | 0.012 |     |
| Lang.R                         |        |               |        |     |       |       |           | -0.024 | 0.031 |     |
| Lang.Cpp                       |        |               |        |     |       |       |           | -0.040 | 0.016 |     |
| Lang.VBNet                     |        |               |        |     |       |       |           | -0.070 | 0.023 |     |
| Lang.Ruby                      |        |               |        |     |       |       |           | 0.089  | 0.017 |     |
| Lang.Perl                      |        |               |        |     |       |       |           | 0.037  | 0.027 |     |
| Lang.ObjectiveC                |        |               |        |     |       |       |           | 0.141  | 0.026 |     |
| Lang.C                         |        |               |        |     |       |       |           | -0.058 | 0.019 |     |
| Auxiliary                      |        | parameter(s): |        |     |       |       |           |        |       |     |
|                                | Median |               | MAD_SD |     |       |       |           |        |       |     |
| sigma                          | 0.369  |               | 0.004  |     |       |       |           |        |       |     |
------
| *                              | For help    | interpreting |                 | the  | printed   |                        | output see    | ?print.stanreg |     |     |
| ------------------------------ | ----------- | ------------ | --------------- | ---- | --------- | ---------------------- | ------------- | -------------- | --- | --- |
| *                              | For info    | on           | the priors      | used | see       | ?prior_summary.stanreg |               |                |     |     |
| round(exp(coef(modell4)[1:3]), |             |              |                 |      | 2)        |                        |               |                |     |     |
|                                | (Intercept) |              | TabSpacesSpaces |      |           | TabSpacesBoth          |               |                |     |     |
|                                | 108068.87   |              |                 |      | 1.08      |                        | 1.04          |                |     |     |
| plotcoef(modell4,              |             |              | "TabSpaces",    |      | transform |                        | = to_percent) |                |     |     |
TabSpacesSpaces
netneizffieoK
TabSpacesBoth
|     |     |     | 0   |     |     |     | 3   |     | 6   | 9   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
print(compare_coef(modell2, modell3, modell4, transform = to_percent, include="TabSpaces"))
|     |     |     | modell2 |     |     |     | modell3 |     | modell4 |     |
| --- | --- | --- | ------- | --- | --- | --- | ------- | --- | ------- | --- |
TabSpacesSpaces 28.91 [23.61, 34.41] 11.82 [ 9.05, 14.44] 8.31 [ 5.97, 11.00]
TabSpacesBoth 4.86 [-1.22, 10.81] 4.50 [ 1.09, 8.18] 3.60 [ 0.30, 6.91]
| 10. | Modell |     | 5   |     |     |     |     |     |     |     |
| --- | ------ | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Leitfragen
LVDAA,ArnoHollosi 21

10. MODELL5
• Welche Zusammenhänge unterstellt das Modell durch log1p(Erfahrung), Erfahrung20plus und
log2(Firmengroesse)?
• WelcheVor-undNachteilehatdieseKodierunggegenüberModell4,insbesonderebeioffenenKategorien?
| modell5 | =   | stan_glm( |     |     |     |     |     |     |     |     |
| ------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- |
LogSalary ~ TabSpaces + Country + log1p(Erfahrung) + Erfahrung20plus +
log2(Firmengroesse) + LearningNewTech + StackOverflowCopiedCode +
Lang.JavaScript + Lang.Java + Lang.PHP + Lang.CSharp + Lang.Python + Lang.R +
Lang.Cpp + Lang.VBNet + Lang.Ruby + Lang.Perl + Lang.ObjectiveC + Lang.C,
| data | =   | training, | seed | = 2026, | refresh | = 0) |     |     |     |     |
| ---- | --- | --------- | ---- | ------- | ------- | ---- | --- | --- | --- | --- |
check_sampling(modell5)
| n_eff                          | >=     | 400:         | Check OK.        |                        |              |             |           |       |       |     |
| ------------------------------ | ------ | ------------ | ---------------- | ---------------------- | ------------ | ----------- | --------- | ----- | ----- | --- |
| MCSE                           | <      | 5% of MAD:   | Check            | OK.                    |              |             |           |       |       |     |
| Rhat                           | <=     | 1.01:        | Check OK.        |                        |              |             |           |       |       |     |
| Sampling                       |        | diagnostics  |                  | (sorted                | by n_eff,    | ascending): |           |       |       |     |
|                                |        |              |                  |                        |              | n_eff       | mcse_mad  | Rhat  |       |     |
| log-posterior                  |        |              |                  |                        |              | 1512        | 0.026     | 1.003 |       |     |
| log1p(Erfahrung)               |        |              |                  |                        |              | 4426        | 0.015     | 1.000 |       |     |
| Lang.C                         |        |              |                  |                        |              | 4441        | 0.015     | 1.000 |       |     |
| Erfahrung20plus                |        |              |                  |                        |              | 4559        | 0.015     | 1.000 |       |     |
| sigma                          |        |              |                  |                        |              | 4671        | 0.015     | 1.000 |       |     |
| CountryGermany                 |        |              |                  |                        |              | 5060        | 0.014     | 1.000 |       |     |
| Lang.ObjectiveC                |        |              |                  |                        |              | 5112        | 0.014     | 1.000 |       |     |
| mean_PPD                       |        |              |                  |                        |              | 5160        | 0.014     | 1.000 |       |     |
| StackOverflowCopiedCodeSeveral |        |              |                  |                        | times        | 5518        | 0.013     | 1.000 |       |     |
| (Intercept)                    |        |              |                  |                        |              | 5630        | 0.013     | 1.000 |       |     |
| Showing                        |        | 10 of        | 46 coefficients. |                        |              |             |           |       |       |     |
| mean_PPD                       |        | vs. mean(y): |                  | Check                  | OK.          |             |           |       |       |     |
| mean(y)                        |        | must lie     | within           | the                    | 95% interval | of          | mean_PPD. |       |       |     |
| mean_PPD                       |        | mean_y       |                  | lower                  | upper        |             |           |       |       |     |
|                                | 10.908 | 10.908       | 10.893           |                        | 10.923       |             |           |       |       |     |
| mcmc_trace(modell5,            |        |              | pars             | = c("TabSpacesSpaces", |              |             | "sigma")) |       |       |     |
|                                |        |              | TabSpacesSpaces  |                        |              |             |           |       | sigma |     |
0.385
0.380
0.100
Chain
0.375 1
0.075 2
0.370
3
4
| 0.050 |     |     |     |     |     | 0.365 |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- |
0.360
|                | 0   | 200    | 400 | 600 | 800 | 1000 | 0   | 200 | 400 600 | 800 1000 |
| -------------- | --- | ------ | --- | --- | --- | ---- | --- | --- | ------- | -------- |
| print(modell5, |     | digits | =   | 3)  |     |      |     |     |         |          |
stan_glm
|     | family: |     | gaussian | [identity] |     |     |     |     |     |     |
| --- | ------- | --- | -------- | ---------- | --- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 22

10. MODELL5
formula: LogSalary ~ TabSpaces + Country + log1p(Erfahrung) + Erfahrung20plus +
log2(Firmengroesse) + LearningNewTech + StackOverflowCopiedCode +
Lang.JavaScript + Lang.Java + Lang.PHP + Lang.CSharp + Lang.Python +
| Lang.R          | + Lang.Cpp | + Lang.VBNet | + Lang.Ruby | + Lang.Perl | +   |
| --------------- | ---------- | ------------ | ----------- | ----------- | --- |
| Lang.ObjectiveC |            | + Lang.C     |             |             |     |
| observations:   | 5000       |              |             |             |     |
| predictors:     | 43         |              |             |             |     |
------
Median MAD_SD
| (Intercept)                    |            |          |                | 10.491 0.036 |     |
| ------------------------------ | ---------- | -------- | -------------- | ------------ | --- |
| TabSpacesSpaces                |            |          |                | 0.081 0.012  |     |
| TabSpacesBoth                  |            |          |                | 0.038 0.016  |     |
| CountryAustralia               |            |          |                | -0.272 0.031 |     |
| CountryAustria                 |            |          |                | -0.603 0.047 |     |
| CountryBrazil                  |            |          |                | -1.474 0.037 |     |
| CountryCanada                  |            |          |                | -0.469 0.022 |     |
| CountryFrance                  |            |          |                | -0.717 0.026 |     |
| CountryGermany                 |            |          |                | -0.570 0.019 |     |
| CountryIndia                   |            |          |                | -1.835 0.027 |     |
| CountryIsrael                  |            |          |                | -0.428 0.047 |     |
| CountryItaly                   |            |          |                | -1.009 0.038 |     |
| CountryNetherlands             |            |          |                | -0.668 0.036 |     |
| CountryPoland                  |            |          |                | -1.275 0.033 |     |
| CountryRomania                 |            |          |                | -1.180 0.054 |     |
| CountryRussian                 | Federation |          |                | -1.391 0.045 |     |
| CountrySpain                   |            |          |                | -0.988 0.035 |     |
| CountrySweden                  |            |          |                | -0.586 0.037 |     |
| CountrySwitzerland             |            |          |                | 0.026 0.045  |     |
| CountryUnited                  | Kingdom    |          |                | -0.540 0.017 |     |
| log1p(Erfahrung)               |            |          |                | 0.292 0.012  |     |
| Erfahrung20plus                |            |          |                | 0.083 0.015  |     |
| log2(Firmengroesse)            |            |          |                | 0.018 0.002  |     |
| LearningNewTechDisagree        |            |          |                | -0.039 0.052 |     |
| LearningNewTechSomewhat        |            | agree    |                | 0.007 0.019  |     |
| LearningNewTechStrongly        |            | agree    |                | 0.001 0.011  |     |
| LearningNewTechStrongly        |            | disagree |                | -0.024 0.172 |     |
| StackOverflowCopiedCodeAt      |            | least    | once each day  | -0.048 0.041 |     |
| StackOverflowCopiedCodeAt      |            | least    | once each week | -0.042 0.019 |     |
| StackOverflowCopiedCodeHaven't |            |          | done at all    | 0.021 0.013  |     |
| StackOverflowCopiedCodeSeveral |            |          | times          | -0.018 0.014 |     |
| Lang.JavaScript                |            |          |                | 0.022 0.012  |     |
| Lang.Java                      |            |          |                | -0.010 0.012 |     |
| Lang.PHP                       |            |          |                | -0.167 0.014 |     |
| Lang.CSharp                    |            |          |                | -0.061 0.012 |     |
| Lang.Python                    |            |          |                | 0.010 0.012  |     |
| Lang.R                         |            |          |                | -0.020 0.032 |     |
| Lang.Cpp                       |            |          |                | -0.042 0.016 |     |
| Lang.VBNet                     |            |          |                | -0.074 0.024 |     |
| Lang.Ruby                      |            |          |                | 0.096 0.017  |     |
| Lang.Perl                      |            |          |                | 0.041 0.028  |     |
| Lang.ObjectiveC                |            |          |                | 0.146 0.025  |     |
| Lang.C                         |            |          |                | -0.063 0.018 |     |
| Auxiliary parameter(s):        |            |          |                |              |     |
LVDAA,ArnoHollosi 23

10. MODELL5
|       | Median |     | MAD_SD |     |     |     |     |     |     |     |
| ----- | ------ | --- | ------ | --- | --- | --- | --- | --- | --- | --- |
| sigma | 0.372  |     | 0.004  |     |     |     |     |     |     |     |
------
| *                              | For help    | interpreting |                 | the  | printed   |                        | output | see ?print.stanreg |     |     |
| ------------------------------ | ----------- | ------------ | --------------- | ---- | --------- | ---------------------- | ------ | ------------------ | --- | --- |
| *                              | For info    | on           | the priors      | used | see       | ?prior_summary.stanreg |        |                    |     |     |
| round(exp(coef(modell5)[1:3]), |             |              |                 |      | 2)        |                        |        |                    |     |     |
|                                | (Intercept) |              | TabSpacesSpaces |      |           | TabSpacesBoth          |        |                    |     |     |
|                                | 35999.58    |              |                 |      | 1.08      |                        |        | 1.04               |     |     |
| plotcoef(modell5,              |             |              | "TabSpaces",    |      | transform |                        | =      | to_percent)        |     |     |
TabSpacesSpaces
netneizffieoK
TabSpacesBoth
|     |     |     | 0   |     |     |     | 3   |     | 6   | 9   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
print(compare_coef(modell4, modell5, transform = to_percent, include="TabSpaces"))
|                 |     |     | modell4 |         |        |       | modell5 |                |     |     |
| --------------- | --- | --- | ------- | ------- | ------ | ----- | ------- | -------------- | --- | --- |
| TabSpacesSpaces |     |     | 8.31    | [ 5.97, | 11.00] |       | 8.45    | [ 6.00, 10.88] |     |     |
| TabSpacesBoth   |     |     | 3.60    | [ 0.30, |        | 6.91] | 3.90    | [ 0.74, 7.40]  |     |     |
LVDAA,ArnoHollosi 24

11. MODELLDIAGNOSTIK
11. Modelldiagnostik
Leitfragen
• Welche Eigenschaften der Daten reproduzieren die einzelnen Modelle laut Dichte-, Kennzahlen- und
Vorhersageplots?
• WelcheMusterzeigendieResidueninsgesamtsowienachErfahrungundLand? WiebeurteilenSiedamit
dieModellannahmen?
par(mfrow=c(2,3))
| diagnose_density(modell1, |     | main="Modell | 1") |     |     |
| ------------------------- | --- | ------------ | --- | --- | --- |
| diagnose_density(modell2, |     | main="Modell | 2") |     |     |
| diagnose_density(modell3, |     | main="Modell | 3") |     |     |
| diagnose_density(modell4, |     | main="Modell | 4") |     |     |
| diagnose_density(modell5, |     | main="Modell | 5") |     |     |
reset_gfx()
|     | Modell 1 |     | Modell 2 |     | Modell 3 |
| --- | -------- | --- | -------- | --- | -------- |
-100000 0 50000 150000 250000 8 9 10 11 12 13 14 8 9 10 11 12 13
|     | Modell 4   |     | Modell 5 |          |     |
| --- | ---------- | --- | -------- | -------- | --- |
| 8   | 9 10 11 12 | 13  | 8 9 10   | 11 12 13 |     |
LVDAA,ArnoHollosi 25

11. MODELLDIAGNOSTIK
diagnose_fit(modell1)
|     |               | min(y)           |        |                    | max(y)  |        |     |                       | mean(y)      |       |
| --- | ------------- | ---------------- | ------ | ------------------ | ------- | ------ | --- | --------------------- | ------------ | ----- |
|     | median=-71300 |                  |        | median=204000      |         |        |     |                       | median=66400 |       |
|     |               | 100% < 5090 < 0% |        | 17% < 195000 < 83% |         |        |     | 50.4% < 66400 < 49.6% |              |       |
|     |               | 95% HDI          |        |                    | 95% HDI |        |     |                       | 95% HDI      |       |
|     | -96600        | -51400           | 184000 |                    |         | 227000 |     | 64900                 |              | 67700 |
-120000 -80000 -40000 0 180000 200000 220000 240000 64000 65000 66000 67000 68000 69000
|              |         | 2.5%(y)          |     |               | 97.5%(y) |                    |                   |     | 50%(y)       |         |
| ------------ | ------- | ---------------- | --- | ------------- | -------- | ------------------ | ----------------- | --- | ------------ | ------- |
| median=-7700 |         |                  |     | median=140000 |          |                    |                   |     | median=66400 |         |
|              |         | 100% < 8810 < 0% |     |               |          | 100% < 150000 < 0% | 0% < 59100 < 100% |     |              |         |
|              | 95% HDI |                  |     | 95% HDI       |          |                    |                   |     |              | 95% HDI |
| -10800       |         | -4350            |     | 137000        |          | 143000             |                   |     | 64900        | 67900   |
-10000 -5000 0 5000 135000 140000 145000 150000 60000 62000 64000 66000 68000
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     | 26  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

11. MODELLDIAGNOSTIK
diagnose_fit(modell2)
|     | min(y)           |             |      |                  |             | max(y)  |      | mean(y)              |      |
| --- | ---------------- | ----------- | ---- | ---------------- | ----------- | ------- | ---- | -------------------- | ---- |
|     |                  | median=8.41 |      |                  | median=13.4 |         |      | median=10.9          |      |
|     | 75% < 8.54 < 25% |             |      | 0% < 12.2 < 100% |             |         |      | 49.9% < 10.9 < 50.1% |      |
|     |                  | 95% HDI     |      |                  |             | 95% HDI |      | 95% HDI              |      |
|     | 7.97             |             | 8.77 |                  | 13          | 13.9    | 10.9 |                      | 10.9 |
7.5 8.0 8.5 12.5 13.0 13.5 14.0 14.5 10.86 10.88 10.90 10.92 10.94 10.96
|                  | 2.5%(y) |             |      |                  |     | 97.5%(y)    |             | 50%(y)  |                |
| ---------------- | ------- | ----------- | ---- | ---------------- | --- | ----------- | ----------- | ------- | -------------- |
|                  |         | median=9.56 |      |                  |     | median=12.3 | median=10.9 |         |                |
| 0% < 9.08 < 100% |         |             |      | 0% < 11.9 < 100% |     |             |             |         | 100% < 11 < 0% |
|                  |         | 95% HDI     |      |                  |     | 95% HDI     |             | 95% HDI |                |
|                  |         | 9.5         | 9.63 |                  |     | 12.2 12.3   | 10.9        |         | 10.9           |
9.1 9.2 9.3 9.4 9.5 9.6 12.0 12.1 12.2 12.3 10.86 10.90 10.94 10.98
LVDAA,ArnoHollosi 27

11. MODELLDIAGNOSTIK
diagnose_fit(modell3)
|     |      | min(y)              |      |                  | max(y)      |      |     |                      | mean(y)     |      |
| --- | ---- | ------------------- | ---- | ---------------- | ----------- | ---- | --- | -------------------- | ----------- | ---- |
|     |      | median=8.26         |      |                  | median=12.9 |      |     |                      | median=10.9 |      |
|     |      | 98.7% < 8.54 < 1.3% |      | 0% < 12.2 < 100% |             |      |     | 50.2% < 10.9 < 49.8% |             |      |
|     |      | 95% HDI             |      |                  | 95% HDI     |      |     |                      | 95% HDI     |      |
|     | 7.94 |                     | 8.53 |                  | 12.6        | 13.1 |     | 10.9                 |             | 10.9 |
7.6 7.8 8.0 8.2 8.4 8.6 12.2 12.4 12.6 12.8 13.0 13.2 13.4 10.89 10.90 10.91 10.92 10.93
|                  | 2.5%(y) |             |      |                  | 97.5%(y) |             |      |     | 50%(y)            |     |
| ---------------- | ------- | ----------- | ---- | ---------------- | -------- | ----------- | ---- | --- | ----------------- | --- |
|                  |         | median=9.33 |      |                  |          | median=12.1 |      |     | median=11         |     |
| 0% < 9.08 < 100% |         |             |      | 0% < 11.9 < 100% |          |             |      |     | 94.5% < 11 < 5.5% |     |
|                  |         | 95% HDI     |      |                  |          | 95% HDI     |      |     | 95% HDI           |     |
|                  |         | 9.27        | 9.39 |                  |          | 12.1        | 12.1 | 11  |                   | 11  |
9.10 9.15 9.20 9.25 9.30 9.35 9.40 11.95 12.00 12.05 12.10 12.15 10.94 10.96 10.98 11.00
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     | 28  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

11. MODELLDIAGNOSTIK
diagnose_fit(modell4)
|     |      | min(y)          |      |                  |             | max(y)  |      |      | mean(y)              |      |
| --- | ---- | --------------- | ---- | ---------------- | ----------- | ------- | ---- | ---- | -------------------- | ---- |
|     |      | median=8.24     |      |                  | median=12.9 |         |      |      | median=10.9          |      |
|     |      | 99% < 8.54 < 1% |      | 0% < 12.2 < 100% |             |         |      |      | 49.1% < 10.9 < 50.9% |      |
|     |      | 95% HDI         |      |                  |             | 95% HDI |      |      | 95% HDI              |      |
|     | 7.89 |                 | 8.51 |                  | 12.7        |         | 13.2 | 10.9 |                      | 10.9 |
7.4 7.6 7.8 8.0 8.2 8.4 8.6 12.2 12.4 12.6 12.8 13.0 13.2 13.4 10.89 10.90 10.91 10.92 10.93
|                  |     | 2.5%(y)     |      |                  |     | 97.5%(y)    |         |     | 50%(y)            |     |
| ---------------- | --- | ----------- | ---- | ---------------- | --- | ----------- | ------- | --- | ----------------- | --- |
|                  |     | median=9.33 |      |                  |     | median=12.1 |         |     | median=11         |     |
| 0% < 9.08 < 100% |     |             |      | 0% < 11.9 < 100% |     |             |         |     | 94.4% < 11 < 5.6% |     |
|                  |     | 95% HDI     |      |                  |     |             | 95% HDI |     | 95% HDI           |     |
|                  |     | 9.27        | 9.38 |                  |     | 12          | 12.1    |     | 11                | 11  |
9.10 9.15 9.20 9.25 9.30 9.35 9.40 11.95 12.00 12.05 12.10 12.15 10.94 10.95 10.96 10.97 10.98 10.99 11.00
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     | 29  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

11. MODELLDIAGNOSTIK
diagnose_fit(modell5)
|      | min(y)              |      |                  |             | max(y)  |      | mean(y)              |      |
| ---- | ------------------- | ---- | ---------------- | ----------- | ------- | ---- | -------------------- | ---- |
|      | median=8.19         |      |                  | median=12.9 |         |      | median=10.9          |      |
|      | 99.6% < 8.54 < 0.4% |      | 0% < 12.2 < 100% |             |         |      | 52.7% < 10.9 < 47.3% |      |
|      | 95% HDI             |      |                  |             | 95% HDI |      | 95% HDI              |      |
| 7.81 |                     | 8.49 |                  | 12.6        | 13.1    | 10.9 |                      | 10.9 |
7.4 7.6 7.8 8.0 8.2 8.4 8.6 12.2 12.4 12.6 12.8 13.0 13.2 13.4 10.89 10.90 10.91 10.92 10.93
|                  | 2.5%(y)     |      |                  | 97.5%(y) |             |     | 50%(y)        |     |
| ---------------- | ----------- | ---- | ---------------- | -------- | ----------- | --- | ------------- | --- |
|                  | median=9.33 |      |                  |          | median=12.1 |     | median=11     |     |
| 0% < 9.08 < 100% |             |      | 0% < 11.9 < 100% |          |             |     | 96% < 11 < 4% |     |
|                  | 95% HDI     |      |                  |          | 95% HDI     |     | 95% HDI       |     |
|                  | 9.28        | 9.39 |                  |          | 12 12.1     | 11  |               | 11  |
9.10 9.15 9.20 9.25 9.30 9.35 9.40 11.95 12.00 12.05 12.10 12.15 10.94 10.95 10.96 10.97 10.98 10.99 11.00
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     | 30  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- |

11. MODELLDIAGNOSTIK
par(mfrow=c(2,3))
diagnose_y_vs_yhat(modell1, samples = FALSE, main = "Modell 1")
diagnose_y_vs_yhat(modell2, samples = FALSE, main = "Modell 2")
diagnose_y_vs_yhat(modell3, samples = FALSE, main = "Modell 3")
diagnose_y_vs_yhat(modell4, samples = FALSE, main = "Modell 4")
diagnose_y_vs_yhat(modell5, samples = FALSE, main = "Modell 5")
reset_gfx()
|     | Modell 1 |     |     | Modell 2 |     | Modell 3 |
| --- | -------- | --- | --- | -------- | --- | -------- |
000002
|     |     | 21  |     |     | 21  |     |
| --- | --- | --- | --- | --- | --- | --- |
000051
|     |     | 11  |     |     | 11  |     |
| --- | --- | --- | --- | --- | --- | --- |
000001
| y   |     | y   |     |     | y   |     |
| --- | --- | --- | --- | --- | --- | --- |
|     |     | 01  |     |     | 01  |     |
00005
|     |     | 9   |     |     | 9   |     |
| --- | --- | --- | --- | --- | --- | --- |
0
50000 60000 70000 80000 10.7 10.8 10.9 11.0 11.1 11.2 9.0 9.5 10.0 10.5 11.0 11.5
|         | Modell 4       |           |         | Modell 5       |           |     |
| ------- | -------------- | --------- | ------- | -------------- | --------- | --- |
| 21      |                | 21        |         |                |           |     |
| 11      |                | 11        |         |                |           |     |
| y       |                | y         |         |                |           |     |
| 01      |                | 01        |         |                |           |     |
| 9       |                | 9         |         |                |           |     |
| 9.0 9.5 | 10.0 10.5 11.0 | 11.5 12.0 | 9.0 9.5 | 10.0 10.5 11.0 | 11.5 12.0 |     |
LVDAA,ArnoHollosi 31

11. MODELLDIAGNOSTIK
par(mfrow=c(2,3))
| diagnose_residual(modell1, |     | samples | = FALSE, | main = "Modell | 1") |     |
| -------------------------- | --- | ------- | -------- | -------------- | --- | --- |
| diagnose_residual(modell2, |     | samples | = FALSE, | main = "Modell | 2") |     |
| diagnose_residual(modell3, |     | samples | = FALSE, | main = "Modell | 3") |     |
| diagnose_residual(modell4, |     | samples | = FALSE, | main = "Modell | 4") |     |
| diagnose_residual(modell5, |     | samples | = FALSE, | main = "Modell | 5") |     |
reset_gfx()
|     | Modell 1 |     |     | Modell 2 |     | Modell 3 |
| --- | -------- | --- | --- | -------- | --- | -------- |
2
1
000001
1
0
| )slaudiser(gva 00005 |     | )slaudiser(gva |     |     | )slaudiser(gva |     |
| -------------------- | --- | -------------- | --- | --- | -------------- | --- |
0
1-
| 0      |     |     |     |     | 1-  |     |
| ------ | --- | --- | --- | --- | --- | --- |
| 00005- |     |     | 2-  |     |     |     |
2-
60000 64000 68000 72000 10.80 10.85 10.90 10.95 11.00 9.5 10.0 10.5 11.0 11.5
|     | Modell 4 |     |     | Modell 5 |     |     |
| --- | -------- | --- | --- | -------- | --- | --- |
2
2
| 1              |                |                | 1   |                    |           |     |
| -------------- | -------------- | -------------- | --- | ------------------ | --------- | --- |
| )slaudiser(gva |                | )slaudiser(gva |     |                    |           |     |
| 0              |                |                | 0   |                    |           |     |
| 1-             |                |                | 1-  |                    |           |     |
| 2-             |                |                | 2-  |                    |           |     |
| 9.0 9.5        | 10.0 10.5 11.0 | 11.5 12.0      | 9.0 | 9.5 10.0 10.5 11.0 | 11.5 12.0 |     |
LVDAA,ArnoHollosi 32

11. MODELLDIAGNOSTIK
ResiduennachProgrammiererfahrung
| #   | Residuen | nach | anderen | Variablen |     | sortieren |     |     |     |     |     |
| --- | -------- | ---- | ------- | --------- | --- | --------- | --- | --- | --- | --- | --- |
residuen4 = training$LogSalary - colMeans(posterior_epred(modell4))
residuen5 = training$LogSalary - colMeans(posterior_epred(modell5))
| residuen         |                           | = rbind(                |                |            |             |              |      |                     |          |     |     |
| ---------------- | ------------------------- | ----------------------- | -------------- | ---------- | ----------- | ------------ | ---- | ------------------- | -------- | --- | --- |
|                  | data.frame(training,      |                         |                | Residuum   |             | = residuen4, |      | Modell              | = "M4"), |     |     |
|                  | data.frame(training,      |                         |                | Residuum   |             | = residuen5, |      | Modell              | = "M5")) |     |     |
| ggplot(residuen, |                           |                         | aes(Erfahrung, |            |             | Residuum,    |      | colour = Modell))   |          | +   |     |
|                  | geom_point(color="black", |                         |                |            | alpha=0.1)  |              | +    | facet_wrap(~Modell) |          | +   |     |
|                  | geom_smooth(method        |                         |                | = "loess", |             | formula      | =    | y ~ x) +            |          |     |     |
|                  | geom_hline(yintercept     |                         |                | =          | 0, linetype |              | = 2) | +                   |          |     |     |
|                  | labs(x                    | = "Programmiererfahrung |                |            |             | [Näherung,   |      | Jahre]")            |          |     |     |
|                  |                           |                         |                | M4         |             |              |      |                     |          | M5  |     |
2
1
muudiseR Modell
0
M4
M5
-1
-2
|     | 0   |     | 5   | 10  |     | 15  |     | 20 0 | 5   | 10  | 15 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | --- | --- | ----- |
Programmiererfahrung [Näherung, Jahre]
LVDAA,ArnoHollosi 33

12. MODELLKENNZAHLEN
ResiduennachLand
ggplot(residuen, aes(Country, Residuum)) + geom_boxplot() +
facet_wrap(~ Modell) + coord_flip() + labs(x = "Land")
M4 M5
United Kingdom
Switzerland
Sweden
Spain
Russian Federation
Romania
Poland
Netherlands
Italy
Israel
India
Germany
France
Canada
Brazil
Austria
Australia
United States
-2 -1 0 1 2 -2 -1 0 1 2
Residuum
dnaL
12. Modellkennzahlen
Leitfragen
• Welche R²-, RMSE- und MAE-Werte dürfen Sie direkt miteinander vergleichen, und welche Bedeutung
habendiejeweiligenSkalen?
• WiebeurteilenSiedieModelleanhandderTrainings-undTestkennzahlen? WelcheHinweiseerhaltenSie
zurGeneralisierungundzurModellwahl?
modelle = list(M1 = modell1, M2 = modell2, M3 = modell3,
M4 = modell4, M5 = modell5)
r2 = data.frame()
for (name in names(modelle)) {
LVDAA,ArnoHollosi 34

12. MODELLKENNZAHLEN
r2 = rbind(r2, data.frame(Modell = name, Median = median(bayes_R2(modelle[[name]]))))
}
r2
Modell Median
1 M1 0.03052221
2 M2 0.03127380
3 M3 0.68549746
4 M4 0.71394691
5 M5 0.70903350
prediction_metrics(modell1, newdata=test)
Dataset n RMSE MAE Skill
1 Training 5000 37193.75 29968.6 0.03038547
2 New data 1098 37379.13 29747.3 0.05958483
prediction_metrics(modell2, newdata=test)
Dataset n RMSE MAE Skill
1 Training 5000 0.6775465 0.5182561 0.03101878
2 New data 1098 0.6803412 0.5152325 0.05654782
prediction_metrics(modell3, newdata=test)
Dataset n RMSE MAE Skill
1 Training 5000 0.3853863 0.2800520 0.6865058
2 New data 1098 0.3754438 0.2772404 0.7126864
prediction_metrics(modell4, newdata=test)
Dataset n RMSE MAE Skill
1 Training 5000 0.3669262 0.2658745 0.7158194
2 New data 1098 0.3638685 0.2687894 0.7301296
prediction_metrics(modell5, newdata=test)
Dataset n RMSE MAE Skill
1 Training 5000 0.3705440 0.2679626 0.7101878
2 New data 1098 0.3643816 0.2667401 0.7293680
LOO
mloo = list()
for (name in names(modelle)) {
mloo[[name]] = loo(modelle[[name]])
}
Warning: Found 1 observation(s) with a pareto_k > 0.7. We recommend calling 'loo' again with argument 'k_threshold = 0.7' in order to calculate the ELPD without the assumption that these observations are negligible. This will refit the model 1 times to compute the ELPDs for the problematic observations directly.
LVDAA,ArnoHollosi 35

12. MODELLKENNZAHLEN
plotpkiv(mloo[["M1"]])
0 1000 2000 3000 4000 5000
0.1
6.0
2.0
2.0-
Index
vip
plotpkiv(mloo[["M2"]])
0 1000 2000 3000 4000 5000
0.1
6.0
2.0
2.0-
Index
vip
plotpkiv(mloo[["M3"]])
0 1000 2000 3000 4000 5000
0.1
6.0
2.0
2.0-
Index
vip
LVDAA,ArnoHollosi 36

13. VORHERSAGENINUSD
plotpkiv(mloo[["M4"]])
0.1
6.0
vip
2.0
2.0-
|     | 0   | 1000 | 2000 | 3000 | 4000 | 5000 |
| --- | --- | ---- | ---- | ---- | ---- | ---- |
Index
plotpkiv(mloo[["M5"]])
0.1
6.0
vip
2.0
2.0-
|     | 0   | 1000 | 2000 | 3000 | 4000 | 5000 |
| --- | --- | ---- | ---- | ---- | ---- | ---- |
Index
| # Ohne | Modell 1, da anderes | Y in Modell |     |     |     |     |
| ------ | -------------------- | ----------- | --- | --- | --- | --- |
loo_compare(mloo[-1])
| elpd_diff | se_diff |     |     |     |     |     |
| --------- | ------- | --- | --- | --- | --- | --- |
| M4        | 0.0 0.0 |     |     |     |     |     |
M5 -23.4 9.8
M3 -215.1 24.9
M2 -2995.3 86.7
| 13. Vorhersagen | in  | USD |     |     |     |     |
| --------------- | --- | --- | --- | --- | --- | --- |
Leitfragen
• Wie bewerten Sie die Modelle auf der gemeinsamen USD-Skala, und was bedeuten die Fehlergrößen für
VorhersageneinzelnerGehälter?
| metriken_usd      | = data.frame()          |         |         |     |     |     |
| ----------------- | ----------------------- | ------- | ------- | --- | --- | --- |
| for (name         | in names(modelle))      | {       |         |     |     |     |
| modell            | = modelle[[name]]       |         |         |     |     |     |
| mu =              | posterior_epred(modell, | newdata | = test) |     |     |     |
| if (name          | == "M1") {              |         |         |     |     |     |
| vorhersage        | = colMeans(mu)          |         |         |     |     |     |
| } else            | {                       |         |         |     |     |     |
| LVDAA,ArnoHollosi |                         |         |         |     |     | 37  |

14. DIAGNOSTIKMITTESTDATEN
| sigma = | as.matrix(modell)[, | "sigma"] |     |
| ------- | ------------------- | -------- | --- |
# Ein bloßes exp(mu) wäre der bedingte Median, nicht der arithmetische Erwartungswert.
| vorhersage | = colMeans(exp(sweep(mu, | 1, sigma^2 | / 2, "+"))) |
| ---------- | ------------------------ | ---------- | ----------- |
}
| metriken_usd | = rbind(metriken_usd, | data.frame( |     |
| ------------ | --------------------- | ----------- | --- |
Modell = name, RMSE_USD = sqrt(mean((test$Salary - vorhersage)^2)),
| MAE_USD | = mean(abs(test$Salary | - vorhersage)))) |     |
| ------- | ---------------------- | ---------------- | --- |
}
metriken_usd
| Modell         | RMSE_USD MAE_USD  |     |     |
| -------------- | ----------------- | --- | --- |
| 1 M1           | 37379.13 29747.30 |     |     |
| 2 M2           | 37248.13 30111.08 |     |     |
| 3 M3           | 22815.17 16728.52 |     |     |
| 4 M4           | 22294.53 16127.86 |     |     |
| 5 M5           | 22241.84 16035.89 |     |     |
| 14. Diagnostik | mit Testdaten     |     |     |
Leitfragen
• WelcheGemeinsamkeitenundUnterschiedezeigendieDiagnosenfürTrainings-undTestdaten?
• WelcheSchlussfolgerungenziehenSiedarausfürdieVerwendbarkeitderModellebeiweiterenPersonen?
LVDAA,ArnoHollosi 38

14. DIAGNOSTIKMITTESTDATEN
Originalvs.Test
| diagnose_density(modell4, | main = | "M4: Trainingsdaten") |     |     |     |
| ------------------------- | ------ | --------------------- | --- | --- | --- |
M4: Trainingsdaten
| 8   | 9   | 10  | 11  | 12  | 13  |
| --- | --- | --- | --- | --- | --- |
diagnose_density(modell4,
|     | newdata | = test, main | = "M4: Testdaten") |     |     |
| --- | ------- | ------------ | ------------------ | --- | --- |
M4: Testdaten
| 8   | 9   | 10  | 11  | 12  | 13  |
| --- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 39

14. DIAGNOSTIKMITTESTDATEN
diagnose_residual(modell4, samples = FALSE, main = "M4: Trainingsdaten")
9.0 9.5 10.0 10.5 11.0 11.5 12.0
2
1
0
1-
2-
M4: Trainingsdaten
)slaudiser(gva
diagnose_residual(modell4, newdata = test, samples = FALSE, main = "M4: Testdaten")
9.0 9.5 10.0 10.5 11.0 11.5 12.0
0.1
5.0
0.0
5.0-
0.1-
5.1-
0.2-
M4: Testdaten
)slaudiser(gva
LVDAA,ArnoHollosi 40

14. DIAGNOSTIKMITTESTDATEN
| diagnose_density(modell5, |     | main = "M5: | Trainingsdaten") |     |     |     |
| ------------------------- | --- | ----------- | ---------------- | --- | --- | --- |
M5: Trainingsdaten
|     | 8   | 9   | 10  | 11  | 12  | 13  |
| --- | --- | --- | --- | --- | --- | --- |
diagnose_density(modell5, newdata = test, main = "M5: Testdaten")
M5: Testdaten
| 8   |     | 9   | 10  | 11  | 12  | 13  |
| --- | --- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 41

14. DIAGNOSTIKMITTESTDATEN
diagnose_residual(modell5, samples = FALSE, main = "M5: Trainingsdaten")
9.0 9.5 10.0 10.5 11.0 11.5 12.0
2
1
0
1-
2-
M5: Trainingsdaten
)slaudiser(gva
diagnose_residual(modell5, newdata = test, samples = FALSE, main = "M5: Testdaten")
9.0 9.5 10.0 10.5 11.0 11.5 12.0
0.1
5.0
0.0
5.0-
0.1-
5.1-
0.2-
M5: Testdaten
)slaudiser(gva
LVDAA,ArnoHollosi 42

15. MODELLMITALLENANALYSEDATEN
| 15. Modell | mit | allen Analysedaten |     |     |     |
| ---------- | --- | ------------------ | --- | --- | --- |
Leitfragen
• Welchen Zweck erfüllt die erneute Berechnung mit allen Analysedaten, und wie ist die vorherige
Testauswertungdanacheinzuordnen?
• Wie beurteilen Sie die replizierten USD-Kennzahlen im Vergleich zu den beobachteten Werten und zur
AuswahlderAnalysedaten?
modell_final = update(modell4, data = daten, seed = 2028, refresh = 0)
| print(modell_final, |     | digits = 3) |     |     |     |
| ------------------- | --- | ----------- | --- | --- | --- |
stan_glm
| family: | gaussian | [identity] |     |     |     |
| ------- | -------- | ---------- | --- | --- | --- |
formula: LogSalary ~ TabSpaces + Country + YearsProgram + CompanySize +
| LearningNewTech |            | + StackOverflowCopiedCode |               | + Lang.JavaScript | +   |
| --------------- | ---------- | ------------------------- | ------------- | ----------------- | --- |
| Lang.Java       | + Lang.PHP | + Lang.CSharp             | + Lang.Python | + Lang.R          | +   |
Lang.Cpp + Lang.VBNet + Lang.Ruby + Lang.Perl + Lang.ObjectiveC +
Lang.C
| observations: | 6098 |     |     |     |     |
| ------------- | ---- | --- | --- | --- | --- |
| predictors:   | 67   |     |     |     |     |
------
Median MAD_SD
| (Intercept)        |            |             |     | 11.590 0.022 |     |
| ------------------ | ---------- | ----------- | --- | ------------ | --- |
| TabSpacesSpaces    |            |             |     | 0.079 0.011  |     |
| TabSpacesBoth      |            |             |     | 0.018 0.015  |     |
| CountryAustralia   |            |             |     | -0.286 0.029 |     |
| CountryAustria     |            |             |     | -0.617 0.041 |     |
| CountryBrazil      |            |             |     | -1.436 0.035 |     |
| CountryCanada      |            |             |     | -0.455 0.020 |     |
| CountryFrance      |            |             |     | -0.703 0.024 |     |
| CountryGermany     |            |             |     | -0.567 0.017 |     |
| CountryIndia       |            |             |     | -1.827 0.024 |     |
| CountryIsrael      |            |             |     | -0.456 0.041 |     |
| CountryItaly       |            |             |     | -1.006 0.035 |     |
| CountryNetherlands |            |             |     | -0.657 0.033 |     |
| CountryPoland      |            |             |     | -1.273 0.031 |     |
| CountryRomania     |            |             |     | -1.185 0.050 |     |
| CountryRussian     | Federation |             |     | -1.409 0.043 |     |
| CountrySpain       |            |             |     | -1.006 0.030 |     |
| CountrySweden      |            |             |     | -0.579 0.035 |     |
| CountrySwitzerland |            |             |     | 0.002 0.038  |     |
| CountryUnited      | Kingdom    |             |     | -0.545 0.015 |     |
| YearsProgramLess   |            | than a year |     | -0.532 0.080 |     |
| YearsProgram1      | to         | 2 years     |     | -0.624 0.042 |     |
| YearsProgram2      | to         | 3 years     |     | -0.564 0.031 |     |
| YearsProgram3      | to         | 4 years     |     | -0.529 0.024 |     |
| YearsProgram4      | to         | 5 years     |     | -0.486 0.023 |     |
| YearsProgram5      | to         | 6 years     |     | -0.469 0.023 |     |
| YearsProgram6      | to         | 7 years     |     | -0.419 0.024 |     |
| YearsProgram7      | to         | 8 years     |     | -0.378 0.023 |     |
| YearsProgram8      | to         | 9 years     |     | -0.380 0.026 |     |
| YearsProgram9      | to         | 10 years    |     | -0.322 0.020 |     |
| YearsProgram10     | to         | 11 years    |     | -0.276 0.022 |     |
| YearsProgram11     | to         | 12 years    |     | -0.241 0.027 |     |
LVDAA,ArnoHollosi 43

15. MODELLMITALLENANALYSEDATEN
YearsProgram12 to 13 years -0.263 0.026
YearsProgram13 to 14 years -0.173 0.028
YearsProgram14 to 15 years -0.083 0.022
YearsProgram15 to 16 years -0.111 0.025
YearsProgram16 to 17 years -0.138 0.033
YearsProgram17 to 18 years -0.082 0.029
YearsProgram18 to 19 years -0.103 0.036
YearsProgram19 to 20 years -0.094 0.029
CompanySizeFewer than 10 employees -0.139 0.019
CompanySize10 to 19 employees -0.060 0.019
CompanySize100 to 499 employees 0.051 0.014
CompanySize500 to 999 employees 0.050 0.021
CompanySize1,000 to 4,999 employees 0.084 0.017
CompanySize5,000 to 9,999 employees 0.035 0.026
CompanySize10,000 or more employees 0.127 0.016
LearningNewTechDisagree -0.048 0.048
LearningNewTechSomewhat agree 0.010 0.017
LearningNewTechStrongly agree 0.002 0.010
LearningNewTechStrongly disagree 0.058 0.152
StackOverflowCopiedCodeAt least once each day -0.037 0.037
StackOverflowCopiedCodeAt least once each week -0.036 0.017
StackOverflowCopiedCodeHaven't done at all 0.020 0.012
StackOverflowCopiedCodeSeveral times -0.014 0.013
Lang.JavaScript 0.022 0.011
Lang.Java -0.008 0.010
Lang.PHP -0.154 0.012
Lang.CSharp -0.065 0.010
Lang.Python 0.012 0.011
Lang.R -0.018 0.026
Lang.Cpp -0.033 0.014
Lang.VBNet -0.080 0.021
Lang.Ruby 0.080 0.016
Lang.Perl 0.007 0.025
Lang.ObjectiveC 0.139 0.024
Lang.C -0.054 0.016
Auxiliary parameter(s):
Median MAD_SD
sigma 0.368 0.003
------
* For help interpreting the printed output see ?print.stanreg
* For info on the priors used see ?prior_summary.stanreg
round(exp(coef(modell_final)[1:3]), 2)
(Intercept) TabSpacesSpaces TabSpacesBoth
108016.04 1.08 1.02
print(compare_coef(modell4, modell_final, include="TabSpaces", transform=to_percent))
modell4 modell_final
TabSpacesSpaces 8.31 [ 5.97, 11.00] 8.21 [ 5.76, 10.39]
TabSpacesBoth 3.60 [ 0.30, 6.91] 1.81 [-1.15, 4.75]
LVDAA,ArnoHollosi 44

15. MODELLMITALLENANALYSEDATEN
check_sampling(modell_final)
| n_eff >=          | 400:        | Check            | OK.           |              |                |       |
| ----------------- | ----------- | ---------------- | ------------- | ------------ | -------------- | ----- |
| MCSE <            | 5% of       | MAD:             | Check OK.     |              |                |       |
| Rhat <=           | 1.01:       | Check            | OK.           |              |                |       |
| Sampling          | diagnostics |                  | (sorted       | by n_eff,    | ascending):    |       |
|                   |             |                  |               |              | n_eff mcse_mad | Rhat  |
| log-posterior     |             |                  |               |              | 1360 0.028     | 1.002 |
| YearsProgram5     |             | to 6             | years         |              | 3648 0.016     | 0.999 |
| (Intercept)       |             |                  |               |              | 3791 0.016     | 1.000 |
| Lang.C            |             |                  |               |              | 3897 0.016     | 1.001 |
| CompanySize100    |             | to               | 499 employees |              | 3902 0.016     | 1.001 |
| mean_PPD          |             |                  |               |              | 4047 0.016     | 1.000 |
| YearsProgram9     |             | to 10            | years         |              | 4141 0.016     | 1.000 |
| YearsProgram4     |             | to 5             | years         |              | 4143 0.016     | 1.000 |
| CompanySize10,000 |             |                  | or more       | employees    | 4170 0.015     | 1.000 |
| YearsProgram11    |             | to               | 12 years      |              | 4338 0.015     | 0.999 |
| Showing           | 10 of       | 70 coefficients. |               |              |                |       |
| mean_PPD          | vs.         | mean(y):         | Check         | OK.          |                |       |
| mean(y)           | must        | lie within       | the           | 95% interval | of mean_PPD.   |       |
| mean_PPD          | mean_y      |                  | lower         | upper        |                |       |
| 10.909            | 10.909      |                  | 10.896        | 10.922       |                |       |
LVDAA,ArnoHollosi 45

15. MODELLMITALLENANALYSEDATEN
| diagnose_density(modell_final, | main | = "Gesamte Analysedaten") |     |     |     |
| ------------------------------ | ---- | ------------------------- | --- | --- | --- |
Gesamte Analysedaten
| 8                 | 9   | 10  | 11  | 12  | 13  |
| ----------------- | --- | --- | --- | --- | --- |
| LVDAA,ArnoHollosi |     |     |     |     | 46  |

15. MODELLMITALLENANALYSEDATEN
diagnose_fit(modell_final)
|     |      | min(y)              |      |     |                  |             | max(y)  |      |     |                      | mean(y)     |      |
| --- | ---- | ------------------- | ---- | --- | ---------------- | ----------- | ------- | ---- | --- | -------------------- | ----------- | ---- |
|     |      | median=8.22         |      |     |                  | median=12.9 |         |      |     |                      | median=10.9 |      |
|     |      | 99.7% < 8.52 < 0.3% |      |     | 0% < 12.2 < 100% |             |         |      |     | 51.9% < 10.9 < 48.1% |             |      |
|     |      | 95% HDI             |      |     |                  |             | 95% HDI |      |     |                      | 95% HDI     |      |
|     | 7.89 |                     | 8.47 |     |                  | 12.7        |         | 13.2 |     | 10.9                 |             | 10.9 |
7.6 7.8 8.0 8.2 8.4 8.6 12.2 12.6 13.0 13.4 10.89 10.90 10.91 10.92 10.93
|                  |     | 2.5%(y)     |         |     |                  |     | 97.5%(y)    |      |     |                   | 50%(y)    |     |
| ---------------- | --- | ----------- | ------- | --- | ---------------- | --- | ----------- | ---- | --- | ----------------- | --------- | --- |
|                  |     | median=9.32 |         |     |                  |     | median=12.1 |      |     |                   | median=11 |     |
| 0% < 9.08 < 100% |     |             |         |     | 0% < 11.9 < 100% |     |             |      |     | 93.3% < 11 < 6.7% |           |     |
|                  |     |             | 95% HDI |     |                  |     | 95% HDI     |      |     |                   | 95% HDI   |     |
|                  |     | 9.26        | 9.37    |     |                  |     | 12.1        | 12.1 |     |                   | 11        | 11  |
9.10 9.20 9.30 9.40 11.95 12.00 12.05 12.10 12.15 10.94 10.96 10.98 11.00
| diagnose_residual(modell_final, |     |     |     |     | samples | =   | FALSE) |     |     |     |     |     |
| ------------------------------- | --- | --- | --- | --- | ------- | --- | ------ | --- | --- | --- | --- | --- |
avg(residuals) vs  fitted
2
1
)slaudiser(gva
0
1-
2-
|                   |     |     | 9.0 | 9.5 |     | 10.0 |     | 10.5 | 11.0 |     | 11.5 | 12.0 |
| ----------------- | --- | --- | --- | --- | --- | ---- | --- | ---- | ---- | --- | ---- | ---- |
| LVDAA,ArnoHollosi |     |     |     |     |     |      |     |      |      |     |      | 47   |

15. MODELLMITALLENANALYSEDATEN
modell_metrisch = update(modell5, data = daten, seed = 2028, refresh = 0)
| print(modell_metrisch, |     | digits | = 3) |     |     |
| ---------------------- | --- | ------ | ---- | --- | --- |
stan_glm
| family: | gaussian | [identity] |     |     |     |
| ------- | -------- | ---------- | --- | --- | --- |
formula: LogSalary ~ TabSpaces + Country + log1p(Erfahrung) + Erfahrung20plus +
log2(Firmengroesse) + LearningNewTech + StackOverflowCopiedCode +
Lang.JavaScript + Lang.Java + Lang.PHP + Lang.CSharp + Lang.Python +
| Lang.R          | + Lang.Cpp | + Lang.VBNet | + Lang.Ruby | + Lang.Perl | +   |
| --------------- | ---------- | ------------ | ----------- | ----------- | --- |
| Lang.ObjectiveC |            | + Lang.C     |             |             |     |
| observations:   | 6098       |              |             |             |     |
| predictors:     | 43         |              |             |             |     |
------
Median MAD_SD
| (Intercept)                    |            |          |                | 10.490 0.032 |     |
| ------------------------------ | ---------- | -------- | -------------- | ------------ | --- |
| TabSpacesSpaces                |            |          |                | 0.081 0.011  |     |
| TabSpacesBoth                  |            |          |                | 0.020 0.015  |     |
| CountryAustralia               |            |          |                | -0.294 0.029 |     |
| CountryAustria                 |            |          |                | -0.619 0.041 |     |
| CountryBrazil                  |            |          |                | -1.441 0.034 |     |
| CountryCanada                  |            |          |                | -0.454 0.019 |     |
| CountryFrance                  |            |          |                | -0.708 0.023 |     |
| CountryGermany                 |            |          |                | -0.564 0.018 |     |
| CountryIndia                   |            |          |                | -1.838 0.025 |     |
| CountryIsrael                  |            |          |                | -0.442 0.041 |     |
| CountryItaly                   |            |          |                | -0.997 0.035 |     |
| CountryNetherlands             |            |          |                | -0.658 0.033 |     |
| CountryPoland                  |            |          |                | -1.277 0.031 |     |
| CountryRomania                 |            |          |                | -1.187 0.047 |     |
| CountryRussian                 | Federation |          |                | -1.410 0.042 |     |
| CountrySpain                   |            |          |                | -1.007 0.031 |     |
| CountrySweden                  |            |          |                | -0.576 0.034 |     |
| CountrySwitzerland             |            |          |                | -0.011 0.039 |     |
| CountryUnited                  | Kingdom    |          |                | -0.543 0.015 |     |
| log1p(Erfahrung)               |            |          |                | 0.293 0.011  |     |
| Erfahrung20plus                |            |          |                | 0.084 0.014  |     |
| log2(Firmengroesse)            |            |          |                | 0.018 0.001  |     |
| LearningNewTechDisagree        |            |          |                | -0.052 0.048 |     |
| LearningNewTechSomewhat        |            | agree    |                | 0.010 0.017  |     |
| LearningNewTechStrongly        |            | agree    |                | 0.000 0.010  |     |
| LearningNewTechStrongly        |            | disagree |                | 0.045 0.146  |     |
| StackOverflowCopiedCodeAt      |            | least    | once each day  | -0.037 0.037 |     |
| StackOverflowCopiedCodeAt      |            | least    | once each week | -0.037 0.018 |     |
| StackOverflowCopiedCodeHaven't |            |          | done at all    | 0.020 0.012  |     |
| StackOverflowCopiedCodeSeveral |            |          | times          | -0.014 0.012 |     |
| Lang.JavaScript                |            |          |                | 0.023 0.010  |     |
| Lang.Java                      |            |          |                | -0.012 0.010 |     |
| Lang.PHP                       |            |          |                | -0.158 0.012 |     |
| Lang.CSharp                    |            |          |                | -0.062 0.011 |     |
| Lang.Python                    |            |          |                | 0.007 0.011  |     |
| Lang.R                         |            |          |                | -0.016 0.027 |     |
| Lang.Cpp                       |            |          |                | -0.035 0.014 |     |
| Lang.VBNet                     |            |          |                | -0.083 0.021 |     |
LVDAA,ArnoHollosi 48

15. MODELLMITALLENANALYSEDATEN
| Lang.Ruby       |        |               |     |     |     |     | 0.085  | 0.016 |
| --------------- | ------ | ------------- | --- | --- | --- | --- | ------ | ----- |
| Lang.Perl       |        |               |     |     |     |     | 0.007  | 0.025 |
| Lang.ObjectiveC |        |               |     |     |     |     | 0.142  | 0.023 |
| Lang.C          |        |               |     |     |     |     | -0.058 | 0.017 |
| Auxiliary       |        | parameter(s): |     |     |     |     |        |       |
|                 | Median | MAD_SD        |     |     |     |     |        |       |
| sigma           | 0.370  | 0.004         |     |     |     |     |        |       |
------
| * For                                  | help        | interpreting    |        | the printed | output                     | see  | ?print.stanreg |     |
| -------------------------------------- | ----------- | --------------- | ------ | ----------- | -------------------------- | ---- | -------------- | --- |
| * For                                  | info        | on the          | priors | used        | see ?prior_summary.stanreg |      |                |     |
| round(exp(coef(modell_metrisch)[1:3]), |             |                 |        |             | 2)                         |      |                |     |
|                                        | (Intercept) | TabSpacesSpaces |        |             | TabSpacesBoth              |      |                |     |
|                                        | 35938.05    |                 |        | 1.08        |                            | 1.02 |                |     |
print(compare_coef(modell5, modell_metrisch, include="TabSpaces", transform=to_percent))
|                 |     | modell5 |     |       |        | modell_metrisch |                |     |
| --------------- | --- | ------- | --- | ----- | ------ | --------------- | -------------- | --- |
| TabSpacesSpaces |     | 8.45    | [   | 6.00, | 10.88] | 8.44            | [ 6.08, 10.71] |     |
| TabSpacesBoth   |     | 3.90    | [   | 0.74, | 7.40]  | 2.00            | [-0.82, 5.00]  |     |
check_sampling(modell_metrisch)
| n_eff                          | >= 400:     | Check               | OK.     |         |           |             |            |       |
| ------------------------------ | ----------- | ------------------- | ------- | ------- | --------- | ----------- | ---------- | ----- |
| MCSE                           | < 5%        | of MAD:             | Check   | OK.     |           |             |            |       |
| Rhat                           | <= 1.01:    | Check               | OK.     |         |           |             |            |       |
| Sampling                       | diagnostics |                     | (sorted |         | by n_eff, | ascending): |            |       |
|                                |             |                     |         |         |           | n_eff       | mcse_mad   | Rhat  |
| log-posterior                  |             |                     |         |         |           |             | 1497 0.026 | 1.001 |
| sigma                          |             |                     |         |         |           |             | 4249 0.015 | 1.000 |
| Lang.C                         |             |                     |         |         |           |             | 4321 0.015 | 1.001 |
| Erfahrung20plus                |             |                     |         |         |           |             | 4413 0.015 | 1.000 |
| log1p(Erfahrung)               |             |                     |         |         |           |             | 4429 0.015 | 1.001 |
| StackOverflowCopiedCodeSeveral |             |                     |         |         | times     |             | 4631 0.015 | 1.001 |
| mean_PPD                       |             |                     |         |         |           |             | 4852 0.014 | 0.999 |
| (Intercept)                    |             |                     |         |         |           |             | 4940 0.014 | 1.000 |
| Lang.ObjectiveC                |             |                     |         |         |           |             | 4963 0.014 | 1.000 |
| StackOverflowCopiedCodeHaven't |             |                     |         |         | done at   | all         | 5196 0.014 | 1.000 |
| Showing                        | 10          | of 46 coefficients. |         |         |           |             |            |       |
| mean_PPD                       | vs.         | mean(y):            | Check   | OK.     |           |             |            |       |
| mean(y)                        | must        | lie within          |         | the 95% | interval  | of          | mean_PPD.  |       |
| mean_PPD                       |             | mean_y              | lower   |         | upper     |             |            |       |
| 10.909                         |             | 10.909              | 10.896  |         | 10.923    |             |            |       |
diagnose_density(modell_metrisch, main = "Gesamte Analysedaten")
LVDAA,ArnoHollosi 49

15. MODELLMITALLENANALYSEDATEN
Gesamte Analysedaten
| 8   | 9   | 10  | 11  | 12  | 13  |
| --- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 50

|     |     |     |     |     |     |     | 15. MODELLMITALLENANALYSEDATEN |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | --- |
diagnose_fit(modell_metrisch)
|     |      | min(y)              |      |                  |             | max(y)  |      |     |                      | mean(y) |      |
| --- | ---- | ------------------- | ---- | ---------------- | ----------- | ------- | ---- | --- | -------------------- | ------- | ---- |
|     |      | median=8.19         |      |                  | median=12.9 |         |      |     | median=10.9          |         |      |
|     |      | 99.8% < 8.52 < 0.2% |      | 0% < 12.2 < 100% |             |         |      |     | 49.2% < 10.9 < 50.8% |         |      |
|     |      | 95% HDI             |      |                  |             | 95% HDI |      |     |                      | 95% HDI |      |
|     | 7.82 |                     | 8.43 |                  | 12.7        |         | 13.2 |     | 10.9                 |         | 10.9 |
7.6 7.8 8.0 8.2 8.4 12.2 12.6 13.0 13.4 10.89 10.90 10.91 10.92 10.93
|                  |     | 2.5%(y)     |      |                  |     | 97.5%(y)    |      |     |                   | 50%(y)    |     |
| ---------------- | --- | ----------- | ---- | ---------------- | --- | ----------- | ---- | --- | ----------------- | --------- | --- |
|                  |     | median=9.32 |      |                  |     | median=12.1 |      |     |                   | median=11 |     |
| 0% < 9.08 < 100% |     |             |      | 0% < 11.9 < 100% |     |             |      |     | 93.6% < 11 < 6.4% |           |     |
|                  |     | 95% HDI     |      |                  |     | 95% HDI     |      |     |                   | 95% HDI   |     |
|                  |     | 9.26        | 9.37 |                  |     | 12          | 12.1 |     | 11                |           | 11  |
9.10 9.20 9.30 9.40 11.95 12.00 12.05 12.10 12.15 10.95 10.97 10.99
| diagnose_residual(modell_metrisch, |     |     |     | samples |     | = FALSE) |     |     |     |     |     |
| ---------------------------------- | --- | --- | --- | ------- | --- | -------- | --- | --- | --- | --- | --- |
avg(residuals) vs  fitted
2
1
)slaudiser(gva
0
1-
2-
|                   |     |     | 9.0 | 9.5 |     | 10.0 | 10.5 | 11.0 |     | 11.5 | 12.0 |
| ----------------- | --- | --- | --- | --- | --- | ---- | ---- | ---- | --- | ---- | ---- |
| LVDAA,ArnoHollosi |     |     |     |     |     |      |      |      |     |      | 51   |

15. MODELLMITALLENANALYSEDATEN
R²undLOO
print(c(R2_modell_final = mean(bayes_R2(modell_final)),
R2_modell_metrisch = mean(bayes_R2(modell_metrisch))))
R2_modell_final R2_modell_metrisch
0.7176342 0.7133601
loo_final = loo(modell_final)
plotpkiv(loo_final)
0 1000 2000 3000 4000 5000 6000
0.1
8.0
6.0
4.0
2.0
2.0-
Index
vip
loo_metrisch = loo(modell_metrisch)
plotpkiv(loo_metrisch)
0 1000 2000 3000 4000 5000 6000
0.1
6.0
2.0
2.0-
Index
vip
LVDAA,ArnoHollosi 52

Ergänzung: replizierteKennzahleninUSD 16. POSTERIOR-AUSWERTUNG
loo_compare(loo_final, loo_metrisch)
elpd_diff se_diff
modell_final 0.0 0.0
modell_metrisch -28.0 10.1
Ergänzung: replizierteKennzahleninUSD
yrep_usd = exp(posterior_predict(modell_final, draws = 500, seed = 2030))
pruefung_usd = rbind(
Minimum = quantile(apply(yrep_usd, 1, min), c(.025, .5, .975)),
Mittelwert = quantile(rowMeans(yrep_usd), c(.025, .5, .975)),
Maximum = quantile(apply(yrep_usd, 1, max), c(.025, .5, .975)))
print(cbind(Beobachtet = c(min(daten$Salary), mean(daten$Salary), max(daten$Salary)), pruefung_usd))
Beobachtet 2.5% 50% 97.5%
Minimum 5000.00 2623.191 3688.93 4690.476
Mittelwert 66525.35 66732.055 67665.73 68692.653
Maximum 195000.00 318383.105 383425.08 528092.377
16. Posterior-Auswertung
Leitfragen
• WiebeantwortenSiedieGehaltsfrageanhandderposteriorenSchätzungen,HDIsundWahrscheinlichkeiten
fürdieverschiedenenGruppenvergleiche?
samples = as.matrix(modell_final)
beta_spaces = samples[, "TabSpacesSpaces"]
beta_both = samples[, "TabSpacesBoth"]
prozent_spaces = 100 * (exp(beta_spaces) - 1)
prozent_both = 100 * (exp(beta_both) - 1)
prozent_diff_spaces_both = 100 * (exp(beta_spaces - beta_both) - 1)
plothist(prozent_spaces, main = "Spaces gegenüber Tabs [%]")
LVDAA,ArnoHollosi 53

16. POSTERIOR-AUSWERTUNG
Spaces gegenüber Tabs [%]
median 8.21
=
95% HDI
| 5.76              |     |     | 10.4 |     |
| ----------------- | --- | --- | ---- | --- |
| 4                 | 6   | 8   | 10   | 12  |
| LVDAA,ArnoHollosi |     |     |      | 54  |

16. POSTERIOR-AUSWERTUNG
plothist(prozent_both, compVal = 0, main = "Both gegenüber Tabs [%]")
Both gegenüber Tabs [%]
|     |     |     | median | = 1.79 |     |     |     |
| --- | --- | --- | ------ | ------ | --- | --- | --- |
11.4% < 0 < 88.6%
95% HDI
|     | -1.15 |     |     |     |     | 4.75 |     |
| --- | ----- | --- | --- | --- | --- | ---- | --- |
|     | -2    |     | 0   | 2   | 4   |      | 6   |
plothist(prozent_diff_spaces_both, main = "Spaces gegenüber Both [%]")
Spaces gegenüber Both [%]
|     |     |     | median | = 6.3 |     |     |     |
| --- | --- | --- | ------ | ----- | --- | --- | --- |
95% HDI
|           | 3.2            |             |        |     | 9.26 |     |     |
| --------- | -------------- | ----------- | ------ | --- | ---- | --- | --- |
|           | 2              | 4           |        | 6   | 8    | 10  | 12  |
| vergleich | = data.frame() |             |        |     |      |     |     |
| for (name | in c("M2",     | "M3", "M4", | "M5")) | {   |      |     |     |
LVDAA,ArnoHollosi 55

17. WEITEREGEHALTSGRENZEN
effekt = 100 * (exp(as.matrix(modelle[[name]])[, "TabSpacesSpaces"]) - 1)
| intervall   |     | = hdi(effekt)      |     |                 |     |                  |     |
| ----------- | --- | ------------------ | --- | --------------- | --- | ---------------- | --- |
| vergleich   |     | = rbind(vergleich, |     | data.frame(     |     |                  |     |
| Modell      | =   | name, Median       | =   | median(effekt), |     |                  |     |
| Untergrenze |     | = intervall[1],    |     | Obergrenze      |     | = intervall[2])) |     |
}
| print(vergleich, |        | digits=3)      |       |            |      |     |     |
| ---------------- | ------ | -------------- | ----- | ---------- | ---- | --- | --- |
| Modell           | Median | Untergrenze    |       | Obergrenze |      |     |     |
| 1                | M2     | 28.90          | 23.61 |            | 34.4 |     |     |
| 2                | M3     | 11.80          | 9.05  |            | 14.4 |     |     |
| 3                | M4     | 8.28           | 5.97  |            | 11.0 |     |     |
| 4                | M5     | 8.44           | 6.00  |            | 10.9 |     |     |
| 17. Weitere      |        | Gehaltsgrenzen |       |            |      |     |     |
Leitfragen
• WieverändernsichStichprobe,SchätzungundUnsicherheitzwischendenVarianten,undwiestabilistIhre
AntwortaufdieFragestellung?
• WelcheBereinigungs-undModellierungsentscheidungenwürdenSievertreten,undwelcheGrenzendieser
Sensitivitätsprüfungbleibenbestehen?
UnterschiedlicheGrenzenfürGehalt
| daten_positiv |     | = basis                         |     |     |     |           |     |
| ------------- | --- | ------------------------------- | --- | --- | --- | --------- | --- |
| daten_10000   |     | = droplevels(basis[basis$Salary |     |     |     | >= 10000, | ])  |
| daten_20000   |     | = droplevels(basis[basis$Salary |     |     |     | >= 20000, | ])  |
# daten_alle_5000 enthält auch unbekannte Firmengrößen (die bisher ausgeschlossen wurden)
daten_alle_5000 = roh |> filter(Salary >= 5000) |> mutate(LogSalary = log(Salary))
Modelle
modell_positiv = update(modell_final, data = daten_positiv, seed = 2029, refresh = 0)
modell_10000 = update(modell_final, data = daten_10000, seed = 2029, refresh = 0)
modell_20000 = update(modell_final, data = daten_20000, seed = 2029, refresh = 0)
modell_alle_5000 = update(modell_final, data = daten_alle_5000, seed = 2029, refresh = 0)
Warning: Bulk Effective Samples Size (ESS) is too low, indicating posterior means and medians may be unreliable.
| Running | the | chains | for more | iterations |     | may help. | See |
| ------- | --- | ------ | -------- | ---------- | --- | --------- | --- |
https://mc-stan.org/misc/warnings.html#bulk-ess
Variantendurchrechnen
varianten = list(Positiv = modell_positiv, Ab_5000 = modell_final,
|               |                     | Ab_10000          | =   | modell_10000,       |                    | Ab_20000 | = modell_20000, |
| ------------- | ------------------- | ----------------- | --- | ------------------- | ------------------ | -------- | --------------- |
|               |                     | Metrisch_ab_5000  |     |                     | = modell_metrisch, |          |                 |
|               |                     | Alle_ab_5000      |     | = modell_alle_5000) |                    |          |                 |
| sensitivitaet |                     | = data.frame()    |     |                     |                    |          |                 |
| for (name     | in                  | names(varianten)) |     | {                   |                    |          |                 |
| modell        | = varianten[[name]] |                   |     |                     |                    |          |                 |
effekt = 100 * (exp(as.matrix(modell)[, "TabSpacesSpaces"]) - 1)
| intervall     |     | = hdi(effekt)          |                   |            |     |                  |                 |
| ------------- | --- | ---------------------- | ----------------- | ---------- | --- | ---------------- | --------------- |
| sensitivitaet |     | = rbind(sensitivitaet, |                   |            |     | data.frame(      |                 |
| Variante      |     | = name,                | n = nobs(modell), |            |     | Median =         | median(effekt), |
| Untergrenze   |     | = intervall[1],        |                   | Obergrenze |     | = intervall[2])) |                 |
LVDAA,ArnoHollosi 56

18. RESÜMEE
}
| print(sensitivitaet, |          | digits=3)            |            |       |
| -------------------- | -------- | -------------------- | ---------- | ----- |
|                      | Variante | n Median Untergrenze | Obergrenze |       |
| 1                    | Positiv  | 6441 8.38            | 3.76       | 13.32 |
| 2                    | Ab_5000  | 6098 8.21            | 5.76       | 10.39 |
| 3                    | Ab_10000 | 5905 7.26            | 5.18       | 9.22  |
| 4                    | Ab_20000 | 5567 6.99            | 5.07       | 8.77  |
| 5 Metrisch_ab_5000   |          | 6098 8.44            | 6.08       | 10.71 |
| 6 Alle_ab_5000       |          | 6195 6.29            | 3.29       | 9.43  |
18. Resümee
Leitfragen
• Wie lautet Ihr abschließendes, begründetes Fazit zum Zusammenhang zwischen Einrückung und Gehalt,
einschließlichUnsicherheit,ModellgrenzenundmöglicherkausalerInterpretation?
LVDAA,ArnoHollosi 57