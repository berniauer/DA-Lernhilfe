<!-- Quelle: Wiederholung, Downloads und Kurzreferenzen/Voraussetzung (statistisches Basiswissen)/Arbeitsblätter (PDF)/00a-Wiederholung-Basiswissen.pdf -->

Statistik-Grundlagen
ArnoHollosi
Contents
Grundlagen 1
Prozentrechnung . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1
Logarithmus . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2
Wahrscheinlichkeit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2
UnabhängigeEreignisse . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
AbhängigeEreignisse. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Marginal-bzw. Randverteilung . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Mittelwert,Standardabweichung,VarianzundStichproben . . . . . . . . . . . . . . . . . . . . 4
Median,ModusundQuantile . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
Z-Transformation(Fisher) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
ZentralerGrenzwertsatz . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
LineareRegression 7
GrafischeInspektion . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
LinearesRegressionsmodell . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
Vorhersage(Prediction)vonWerten . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
Z-Transformation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
Grundlagen
Prozentrechnung
1% = 1 , d.h. 1 Prozent ist ein Hundertstel. Beispiele: 5% = 0.05, 17% = 0.17, 1.34 = 134%,
100
2 = 200%und5%von500sind25.
WennsicheinWertum𝑥%erhöht,dannistdasidentischmiteinerMultiplikationvon(1+𝑥%). Beispiel:
500um5%erhöhenergibt525,da500∗(1+5%) = 500∗1.05 = 525.
Im Umkehrschluss: eine Multiplikation mit 𝑥 >= 1 entspricht einer Erhöhung um (𝑥 − 1) ∗ 100%.
Beispiel:300∗2.5 = 750entsprichteinerErhöhungum150%,da(2.5−1)∗100% = 1.5∗100% = 150%
und300+300∗150% = 750ist.
Wenn sich ein Wert um 𝑥% verringert, also beispielsweise eine Verringerung um 5% (also einer
“Erhöhung”von−5%)entsprichtdaseinerMultiplikationvon(1+(−5%)) = 1−0.05 = 0.95.
AnalogimUmkehrschluss: eineMultiplikationmit𝑥 < 1entsprichteinerVerringerungum(1−𝑥)∗
100%. Beispiel: Multiplikationmit0.65entsprichteinerVerringerungvon(1−0.65)∗100% = 35%.
1

| Logarithmus |     |     |     |     |     | GRUNDLAGEN |     |
| ----------- | --- | --- | --- | --- | --- | ---------- | --- |
Logarithmus
DerLogarithmusistdieinverseFunktionzumExponenzieren(Potenzieren). EinLogarithmushateine
Basis,dernatürlicheLogarithmushatdieBasis𝑒. DerLogarithmusistnurfürpositiveZahlendefiniert
| undhateineNullstellebei𝑥 |     | = 1: |     |     |     |     |     |
| ------------------------ | --- | ---- | --- | --- | --- | --- | --- |
y=log(x)
3
2
| )x(gol 1 |     |     |     |     |     |     |     |
| -------- | --- | --- | --- | --- | --- | --- | --- |
0
|     | 1   | 5   |     | 10  | 15  |     | 20  |
| --- | --- | --- | --- | --- | --- | --- | --- |
1−
2−
Formeln:
| • 𝑙𝑜𝑔(1) | = 0und𝑙𝑜𝑔(0) | = −∞ |     |     |     |     |     |
| -------- | ------------ | ---- | --- | --- | --- | --- | --- |
𝑎𝑥dannist𝑙𝑜𝑔
| • Wenn𝑦 | =   | (𝑦) = 𝑥. |     |     |     |     |     |
| ------- | --- | -------- | --- | --- | --- | --- | --- |
𝑎
| 𝑙𝑜𝑔(𝑎×𝑏) | = 𝑙𝑜𝑔(𝑎)+𝑙𝑜𝑔(𝑏) |     |     |     |     |     |     |
| -------- | --------------- | --- | --- | --- | --- | --- | --- |
•
| • 𝑙𝑜𝑔(𝑎𝑏) | = 𝑏×𝑙𝑜𝑔(𝑎) |     |     |     |     |     |     |
| --------- | ---------- | --- | --- | --- | --- | --- | --- |
• AndereBasisistnurmultiplikativerFaktor: 𝑙𝑜𝑔 (𝑥) = 𝑐×𝑙𝑜𝑔 (𝑥)mit𝑐 = 𝑙𝑜𝑔 (𝑏)
|     |     |     |     | 𝑎   | 𝑏   | 𝑎   |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
Wahrscheinlichkeit
𝑝(𝐴): wiegewiss/wiesichertrittEreignis𝐴ein?
| 𝑝 = | AnzahldergewünschtenEreignisse |     |     |     |     |     |     |
| --- | ------------------------------ | --- | --- | --- | --- | --- | --- |
Auch:
AnzahlallermöglichenEreignisse
0 ≤ 𝑝(𝐴) ≤ 1,d.h. wenn𝑝(𝐴) = 0danntrittEreignis𝐴nieein,wenn𝑝(𝐴) = 1dann
Wertebereich:
trittEreignis𝐴immer/absolutsicherein(zu100%).
Beispiel: Wird eine Münze geworfen, dann gehen wir typischerweise von 𝑝(𝐾𝑜𝑝𝑓) = 0.5 und
| 𝑝(𝑍𝑎ℎ𝑙) =                         | 0.5aus. |      |          |     |     |     |     |
| --------------------------------- | ------- | ---- | -------- | --- | --- | --- | --- |
| KomplementäresEreignis(“nicht𝐴”): |         | 𝑝(𝐴) | = 1−𝑝(𝐴) |     |     |     |     |
1
Beispiel: BeieinemWürfelistdieChanceeineDreizuwürfeln𝑝(3) = , unddieWahrscheinlichkeit
6
| nichteineDreizuwürfeln𝑝(3) |     | = 1−𝑝(3) | = 1− | 1 = 5 |     |     |     |
| -------------------------- | --- | -------- | ---- | ----- | --- | --- | --- |
.
|                   |     |     |     | 6 6 |     |     |     |
| ----------------- | --- | --- | --- | --- | --- | --- | --- |
| LVDAA,ArnoHollosi |     |     |     |     |     |     | 2   |

UnabhängigeEreignisse GRUNDLAGEN
UnabhängigeEreignisse
Sind zwei Ereignisse 𝐴 und 𝐵 unabhängig, dann ist die Wahrscheinlichkeit, dass beide Ereignisse
eintreffen:
|     |     | 𝑝(𝐴∩𝐵) | = 𝑝(𝐴)×𝑝(𝐵) |     |
| --- | --- | ------ | ----------- | --- |
Beispiele:
• Chance, dass zweimal bei einer Münze Kopf geworfen wird: 𝑝(𝐾𝑜𝑝𝑓 ∩ 𝐾𝑜𝑝𝑓) = 𝑝(𝐾𝑜𝑝𝑓) ×
| 𝑝(𝐾𝑜𝑝𝑓) | = 1 × 1 = 1 |     |     |     |
| ------- | ----------- | --- | --- | --- |
2 2 4
• Chance,dassbeizweiWürfenzuersteineDreiunddanneineVieroderFünfgewürfeltwird: 𝑝(3∩
|                            | 1 2    | 1        |     |     |
| -------------------------- | ------ | -------- | --- | --- |
| 45) = 𝑝(3)×𝑝(45)           | = ×    | =        |     |     |
|                            | 6 6    | 18       |     |     |
| Reihenfolgeunwichtig,d.h.: | 𝑝(𝐴∩𝐵) | = 𝑝(𝐵∩𝐴) |     |     |
AbhängigeEreignisse
SindzweiEreignissevoneinanderabhängig,dannberechnetsichdieWahrscheinlichkeitwiefolgt:
• 𝑝(𝐴)…Wahrscheinlichkeit,dassEreigniss𝐴eintritt.
𝑝(𝐴∩𝐵)
• 𝑝(𝐵|𝐴) = …bedingteWahrscheinlichkeit,dassEreignis𝐵eintritt,falls𝐴eingetretenist
𝑝(𝐴)
Beispiel
Wir haben einen Sack in dem 35 rote Kugeln, 35 grüne Kugeln, 20 rote Würfel und 10 grüne Würfel
enthaltensind. WennicheinenWürfelziehe,wiegroßistdieWahrscheinlichkeit,dassdiesergrünist?
|     |     | 𝑝(Grün∩Würfel) |     | 0.10 |
| --- | --- | -------------- | --- | ---- |
0.33̇
|     | 𝑝(Grün|Würfel) | =   |           | = =  |
| --- | -------------- | --- | --------- | ---- |
|     |                |     | 𝑝(Würfel) | 0.30 |
WiegroßistdieWahrscheinlichkeit,dassicheinenWürfelgezogenhabe,wenndasObjektgrünist?
|               |                | 𝑝(Würfel∩Grün) |         | 0.10      |
| ------------- | -------------- | -------------- | ------- | --------- |
|               | 𝑝(Würfel|Grün) | =              |         | = = 0.22̇ |
|               |                |                | 𝑝(Grün) | 0.45      |
| Marginal-bzw. | Randverteilung |                |         |           |
AlsMarginalverteilungbzeichnetmaneineVerteilungübereineTeilmengevonZufallsvariablen. Am
einfachstenanhandeinesBeispielszuerklären. Nehmenwiran,eswirdeinemedizinischeStudiemit
𝑁 = 1000Teilnehmer*innenzurWirksamkeiteinesTestesaufeinebestimmteKrankheitdurchgeführt.
FolgendeTabellegibtAuskunftüberdasErgebnis,“Testpositiv”heißt,dassderTestvermeintlicheine
Krankheit identifiziert hat, “Test negativ”, dass der Test nichts gefunden hat. Die Summenwerte für
Spalten/ZeilennenntmanindiesemKontextauchRandhäufigkeit.
|     |                | Testpositiv | Testnegativ | Randhäufigkeit |
| --- | -------------- | ----------- | ----------- | -------------- |
|     | Krank          | 90          | 10          | 100            |
|     | Gesund         | 100         | 800         | 900            |
|     | Randhäufigkeit | 190         | 810         | 1000           |
InrelativenWahrscheinlichkeitswertenausgedrückt,siehtdieTabellesoaus:
LVDAA,ArnoHollosi 3

Mittelwert,Standardabweichung,VarianzundStichproben GRUNDLAGEN
|     |     |                    |     | Testpositiv |     | Testnegativ | Marginalverteilung |
| --- | --- | ------------------ | --- | ----------- | --- | ----------- | ------------------ |
|     |     | Krank              |     | 9%          |     | 1%          | 10%                |
|     |     | Gesund             |     | 10%         |     | 80%         | 90%                |
|     |     | Marginalverteilung |     | 19%         |     | 81%         | 100%               |
DieMarginalverteilunglässtsichalsSummeausdenWertenimKernberechnen,zumBeispiel:
|     |     | 𝑝(𝐾𝑟𝑎𝑛𝑘) | =   | ∑   |     | 𝑝(𝐺𝑒𝑠𝑢𝑛𝑑ℎ𝑒𝑖𝑡∩𝑇𝑒𝑠𝑡𝑒𝑟𝑔𝑒𝑏𝑛𝑖𝑠) |     |
| --- | --- | -------- | --- | --- | --- | -------------------------- | --- |
𝑇𝑒𝑠𝑡𝑒𝑟𝑔𝑒𝑏𝑛𝑖𝑠,𝐾𝑟𝑎𝑛𝑘
= 𝑝(𝐾𝑟𝑎𝑛𝑘∩𝑃𝑜𝑠𝑖𝑡𝑖𝑣)+𝑝(𝐾𝑟𝑎𝑛𝑘∩𝑁𝑒𝑔𝑎𝑡𝑖𝑣)
= 0.09+0.01
= 0.1
Achtung: da die beiden Variable (Gesundheit & Testergebnis) nicht unabhängig voneinander sind,
könnendieeinzelnenWerte𝑝(𝐺𝑒𝑠𝑢𝑛𝑑ℎ𝑒𝑖𝑡∩𝑇𝑒𝑠𝑡𝑒𝑟𝑔𝑒𝑏𝑛𝑖𝑠)nichteinfachalsMultiplikationderbeiden
Marginalwahrscheinlichkeitenerrechnetwerden.
Mittelwert,Standardabweichung,VarianzundStichproben
InderStatistikmussbeieinigenBerechnungenzwischenderGesamtpopulationundeinerStichprobe
ausderGesamtpopulationunterschiedenwerden. FolgendeFormelngeltenfürMittelwert,Varianzund
Standardabweichung:
|            | Gesamtpopulation |       |       | Stichprobe |     |       | R-Funktion |
| ---------- | ---------------- | ----- | ----- | ---------- | --- | ----- | ---------- |
| Anzahl     | N                |       |       | n          |     |       |            |
|            |                  |       | 𝑁     |            |     | 𝑛     |            |
| Mittelwert | 𝜇                | = 1 ∑ | 𝑥     | 𝑥̄=        | 1 ∑ | 𝑥     | mean(x)    |
|            |                  | 𝑁     | 𝑖=1 𝑖 |            | 𝑛   | 𝑖=1 𝑖 |            |
|            |                  |       | 𝑁     |            |     | 𝑛     |            |
Varianz 𝜎2 = 1 ∑ (𝑥 −𝜇)2 𝑠2 = 1 ∑ (𝑥 −𝑥)̄ 2 sd(x)/var(x)(fürStichprobe)
|     |     | 𝑁   | 𝑖   |     | 𝑛−1 | 𝑖   |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     | 𝑖=1 |     |     | 𝑖=1 |     |
Hinweis: indiesenUnterlagenwerdeninFolgeauchfürStichproben(wirhabenessogutwieniemit
𝜎2
etwas anderes zu tun) für den Mittelwert 𝜇, für die Standardabweichung 𝜎 und für die Varianz
verwendet.
Median,ModusundQuantile
DerMedianunterteiltdieDateninzweiTeile: 50%sindkleineralsderMedian,50%sindgrößeralsder
Median. VerallgemeinertsprichtmaneinemQuantil: 𝑥%derWertesindkleineralsderSchwellenwert,
1 − 𝑥%
sind größer als der Schwellenwert. Das folgende Beispiel veranschaulicht das anhand einer
| Zahlenreihe: | 25%derZahlensindz.B.kleinerals4.75: |     |     |     |     |     |     |
| ------------ | ----------------------------------- | --- | --- | --- | --- | --- | --- |
# Beispiel: eine Zahlen mit einem Ausreißer (der den Mittelwert stark nach oben zieht)
x = c(2,4,5,6,9,11,15,100)
| list(mean | = mean(x), |               |         |     |              |     |     |
| --------- | ---------- | ------------- | ------- | --- | ------------ | --- | --- |
| quantile  |            | = quantile(x, | c(0.25, |     | 0.5, 0.75))) |     |     |
$mean
[1] 19
LVDAA,ArnoHollosi 4

| Z-Transformation(Fisher) |     |     |     |     | GRUNDLAGEN |
| ------------------------ | --- | --- | --- | --- | ---------- |
$quantile
| 25%       | 50% 75% |     |     |     |     |
| --------- | ------- | --- | --- | --- | --- |
| 4.75 7.50 | 12.00   |     |     |     |     |
BeieinerWahrscheinlichkeitsverteilunggibteszusätzlichnocheinenModus: derWertmitdergrößten
Wahrscheinlichkeit (der am häufigsten (am wahrscheinlichsten) vorkommende Wert). Das folgende
Beispiel zeigt die Quantile 2.5%, 25%, 50% (=Median), 75% und 97.5% (blau strichliert) sowie den
Modus(violett):
Quantile und Modus einer Wahrscheinlichkeitsverteilung
Modus
|     |     |     | 2.5 | 25 50 | 75 97.5 |
| --- | --- | --- | --- | ----- | ------- |
50%
95%
| 0.0 | 0.2 | 0.4 | 0.6 | 0.8 | 1.0 |
| --- | --- | --- | --- | --- | --- |
Z-Transformation(Fisher)
DieZ-Transformation(bzw. auchFisher-Transformation)einerDatenreihewirdwiefolgtberechnet:
𝑥 −𝜇
𝑖
𝑧 =
𝑖 𝜎
| …mit𝜇 = | 𝑚𝑒𝑎𝑛(𝑥)und𝜎 | = 𝑠𝑑(𝑥). |     |     |     |
| ------- | ----------- | -------- | --- | --- | --- |
DieTransformationhatfolgendeEigenschaften:
| • 𝑚𝑒𝑎𝑛(𝑧) | = 0und𝑠𝑑(𝑧) | = 1 |     |     |     |
| --------- | ----------- | --- | --- | --- | --- |
• HistogrammverändertnichtdieForm(nurSkalaändertsich)
• ScatterplotmitandererVariableverändertnichtdieForm(nurSkaladerAchseändertsich)
|                                                 |     |     | 𝑐𝑜𝑟(𝑥,𝑦) | = 𝑐𝑜𝑟(𝑧,𝑦). |     |
| ----------------------------------------------- | --- | --- | -------- | ----------- | --- |
| • KorrelationmitandererVariableändertsichnicht. |     |     | D.h.     |             |     |
• Dieinversez-Transformationist𝑥 = 𝑧 𝜎+𝜇(ergibtsichausUmformung)
|     |     | 𝑖 𝑖 |     |     |     |
| --- | --- | --- | --- | --- | --- |
• Da viele natürliche Maße normalverteilt sind, sind z-Werte größer 3 recht selten (nur 0.27%
WahrscheinlichkeitsmasseliegtbeiderNormalverteilungimBereich|𝑧| > 3,d.h. beieinerReihe
|     |     | 2-3Zahlenmit|𝑧| | > 3) |     |     |
| --- | --- | --------------- | ---- | --- | --- |
mit1000Zahlenerwartenwirnurca.
ZentralerGrenzwertsatz
Der Zentrale Grenzwertsatz sagt aus, dass der Mittelwert einer großen Zahl von unabhängigen
StichprobenauseinerGesamtpopulationeinerNormalverteilungumdentatsächlichenMittelwertder
| Populationfolgt. | EgalwelcheVerteilungdiePopulationselbsthat! |     |     |     |     |
| ---------------- | ------------------------------------------- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 5

ZentralerGrenzwertsatz GRUNDLAGEN
Ein Beispiel soll das illustrieren: gehen wir von einer stark von der Normalverteilung abweichenden
Verteilungaus,wiez.B.derGamma-Verteilung:
0 2 4 6 8 10
5.0
4.0
3.0
2.0
1.0
0.0
Population: Gammaverteilung
)5.1
,x(ammagd
Nehmen wir nun 5000x eine Stichprobe mit jeweils 200 Werten und berechnen den Mittelwert jeder
Stichprobe. Dann entspricht das Histogramm einer Normalverteilung (rot eingezeichnet), der echte
MittelwertderPopulationistalso1.5±0.087𝑠𝑑:
1.2 1.3 1.4 1.5 1.6 1.7 1.8
5
4
3
2
1
0
Mittelwerte der Stichproben
Mittelwert
LVDAA,ArnoHollosi 6

LINEAREREGRESSION
| Lineare |     | Regression |     |     |     |     |     |     |     |     |     |     |
| ------- | --- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Am Beispiel des Körpermaß-Datensatzes wollen wir uns die lineare Regression in R ein wenig näher
ansehen.
GrafischeInspektion
Datensatz
# Daten von: Heinz et al.: Exploring Relationships in Body Dimensions,
| #   |     |     |     | Journal | of  | Statistics | Education |     | Volume | 11, | Number | 2 (2003) |
| --- | --- | --- | --- | ------- | --- | ---------- | --------- | --- | ------ | --- | ------ | -------- |
# http://ww2.amstat.org/publications/jse/v11n2/datasets.heinz.html
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)
| # reduzieren |          | der         | Daten | auf verwendete |        | Spalten    |     |     |     |     |     |     |
| ------------ | -------- | ----------- | ----- | -------------- | ------ | ---------- | --- | --- | --- | --- | --- | --- |
| body         | = body[, | c('Weight', |       | 'Height',      | 'Age', | 'Gender')] |     |     |     |     |     |     |
summary(body)
|     | Weight   |         |        | Height    |        | Age       |     | Gender     |      |     |     |     |
| --- | -------- | ------- | ------ | --------- | ------ | --------- | --- | ---------- | ---- | --- | --- | --- |
|     | Min.     | : 42.00 | Min.   | :147.2    | Min.   | :18.00    |     | Female:260 |      |     |     |     |
|     | 1st Qu.: | 58.40   | 1st    | Qu.:163.8 | 1st    | Qu.:23.00 |     | Male       | :247 |     |     |     |
|     | Median   | : 68.20 | Median | :170.3    | Median | :27.00    |     |            |      |     |     |     |
|     | Mean     | : 69.15 | Mean   | :171.1    | Mean   | :30.18    |     |            |      |     |     |     |
|     | 3rd Qu.: | 78.85   | 3rd    | Qu.:177.8 | 3rd    | Qu.:36.00 |     |            |      |     |     |     |
|     | Max.     | :116.40 | Max.   | :198.1    | Max.   | :67.00    |     |            |      |     |     |     |
HistogrammdermetrischenVariablen
|     |     | Gewicht (kg) |     |     |     | Größe (cm) |     |     |     |     | Alter (Jahren) |     |
| --- | --- | ------------ | --- | --- | --- | ---------- | --- | --- | --- | --- | -------------- | --- |
001
|     | 021 |     |     |     |     |     |     |     | 051 |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | 001 |     |     |     | 08  |     |     |     |     |     |     |     |
|     | 08  |     |     |     |     |     |     |     | 001 |     |     |     |
06
| ycneuqerF |     |     |     |     | ycneuqerF |     |     |     | ycneuqerF |     |     |     |
| --------- | --- | --- | --- | --- | --------- | --- | --- | --- | --------- | --- | --- | --- |
06
04
|     | 04  |     |     |     |     |     |     |     | 05  |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
02
02
|     | 0   |             |     |     | 0   |             |     |     | 0   |     |          |             |
| --- | --- | ----------- | --- | --- | --- | ----------- | --- | --- | --- | --- | -------- | ----------- |
|     | 40  | 60 80       | 100 | 120 |     | 150 170     | 190 |     |     | 20  | 30       | 40 50 60 70 |
|     |     | body$Weight |     |     |     | body$Height |     |     |     |     | body$Age |             |
Scatterplot
Wir interessieren uns für das Verhältnis zwischen dem Gewicht und der Körpergröße. Dafür können
wireinenScatterplotzeichnen,derdiebeidenVariablejeweilseinerAchsedesDiagrammszuweist:
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     |     |     | 7   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

| LinearesRegressionsmodell |     |     |     |     |     |     |     |     |     |     | LINEAREREGRESSION |     |
| ------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- |
Gewicht vs. Körpergröße
001
)gk( thciweG
08
06
04
|     |     |     | 150 |     | 160 |     |     | 170 |     | 180 | 190 | 200 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Größe (cm)
LinearesRegressionsmodell
Lineare Regression liefert jene Linie (Schnittpunkt und Steigung), welche den geringsten Abstand zu
allenPunktenimScatterplothat. AlsBeispielwollenwirbestimmen,wiedasGewichteinerPersonmit
ihrerKörpergrößezusammenhängt.
| # lm()  | rechnet   |     | die lineare |         | Regression |     |     |     |     |     |     |     |
| ------- | --------- | --- | ----------- | ------- | ---------- | --- | --- | --- | --- | --- | --- | --- |
| # ("lm" | steht     | für | "linear     |         | model")    |     |     |     |     |     |     |     |
|         | lm(Weight |     | ~           |         |            |     |     |     |     |     |     |     |
| model   | =         |     |             | Height, | data=body) |     |     |     |     |     |     |     |
summary(model)
Call:
| lm(formula |     | =   | Weight | ~ Height, |     | data | = body) |     |     |     |     |     |
| ---------- | --- | --- | ------ | --------- | --- | ---- | ------- | --- | --- | --- | --- | --- |
Residuals:
|         | Min |        | 1Q Median |     |       | 3Q  | Max    |     |     |     |     |     |
| ------- | --- | ------ | --------- | --- | ----- | --- | ------ | --- | --- | --- | --- | --- |
| -18.743 |     | -6.402 | -1.231    |     | 5.059 |     | 41.103 |     |     |     |     |     |
Coefficients:
|             |     |            | Estimate |     | Std.    | Error | t value | Pr(>|t|) |     |     |     |     |
| ----------- | --- | ---------- | -------- | --- | ------- | ----- | ------- | -------- | --- | --- | --- | --- |
| (Intercept) |     | -105.01125 |          |     | 7.53941 |       | -13.93  | <2e-16   |     | *** |     |     |
| Height      |     |            | 1.01762  |     | 0.04399 |       | 23.14   | <2e-16   |     | *** |     |     |
---
| Signif.      |     | codes:     | 0     | '***'   | 0.001 | '**'     | 0.01        | '*' 0.05 | '.'        | 0.1 ' ' 1 |     |     |
| ------------ | --- | ---------- | ----- | ------- | ----- | -------- | ----------- | -------- | ---------- | --------- | --- | --- |
| Residual     |     | standard   |       | error:  | 9.308 | on       | 505 degrees |          | of freedom |           |     |     |
| Multiple     |     | R-squared: |       | 0.5145, |       | Adjusted | R-squared:  |          |            | 0.5136    |     |     |
| F-statistic: |     |            | 535.2 | on 1    | and   | 505 DF,  | p-value:    |          | < 2.2e-16  |           |     |     |
Interpretation: Estimate für Steigung bei Height ist 1.02 mit Standardfehler +/- 0.04. D.h. jeder
zusätzliche Zentimeter Körpergröße verändert das Gewicht im Schnitt um 1.02 Kilogramm. Dieser
| Koeﬀizientiststatistischsignifikantmit𝑃𝑟(> |     |     |     |     |     |     | |𝑡|) | < 0.001. |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | --- | --- | --- | ---- | -------- | --- | --- | --- | --- |
| LVDAA,ArnoHollosi                          |     |     |     |     |     |     |      |          |     |     |     | 8   |

LinearesRegressionsmodell LINEAREREGRESSION
Signifikanzmitp-Wertenwirdmeistwiefolgteingestuft: statistischsignifikantab𝑝 < 0.05
(wirdmit“*”markiert),𝑝 < 0.01(wirdmit“**”markiert)undsehrsignifikantab𝑝 < 0.001
(wirdmit“***”markiert.). Diep-WertetäuscheneineGenauigkeitvor,diesonichtexistiert,
und,obwohlimmernochweitverbreitet,inzwischenzunehmendinVerrufgeraten.
Das Multiple R-squared gibt an, wieviel der Varianz des Gewichts durch die Körpergröße erklärbar ist,
hier 𝑅2 = 0.51 und 𝑎𝑑𝑗𝑅2 = 0.51, d.h. die Körpergröße erklärt 51% der Streuung/Varianz des
Gewichts.
Residuen
DerScatterplotveranschaulichtdieRegressionslinieunddieResiduen(AbstandzurRegressionslinie),
welcheminimiertwerden(PlotfürLesbarkeitauf20Punktereduziert):
175 180 185 190
59
58
57
56
Gewicht vs. Größe
Körpergröße (cm)
)gk(
thciweG
StandardfehlerderKoeﬀizienten
Die Koeﬀizienten haben alle einen Standardfehler, d.h. sie sind keine punktgenauen Ergebnisse,
sondern – wenn von der Stichprobe auf die Gesamtpopulation geschlossen wird – unterliegen die
Koeﬀizienten noch einer gewissen Schwankungsbreite. Das folgende Diagramm veranschaulicht
möglicheSchwankungen(hellblau):
LVDAA,ArnoHollosi 9

| Vorhersage(Prediction)vonWerten |     |     |     |     | LINEAREREGRESSION |     |
| ------------------------------- | --- | --- | --- | --- | ----------------- | --- |
Mögliche Regressionsgeraden
001
)gk( thciweG
08
06
04
|     | 150 | 160 | 170 | 180 | 190 | 200 |
| --- | --- | --- | --- | --- | --- | --- |
Körpergröße (cm)
Interpretation: die Punktwerte der Koeﬀizienten -105 und 1.02 gelten für die aktuell vorliegende
Stichprobe. Es gibt keine andere Gerade, welche geringere (quadratische) Abstände zu den
vorliegenden 507 Punkten hat. Was genau sagt also der Standardfehler (“Std. Error”) bei den
Wertenaus?
Dem Standardfehler liegt die Annahme zugrunde, dass die 507 Personen eine Stichprobe einer
größeren Gesamtpopulation sind. Würden wir dieselbe Messung an einer anderen Stichprobe von
Personen durchführen, erhielten wir mit Sicherheit andere Werte für die beiden Koeﬀizienten
(Intercept und Height). Der Standardfehler ist die (aus der vorliegenden Stichprobe hochgerechnete)
StandardabweichungdieserKoeﬀizienten. (->VergleichbarmitzentralemGrenzwertsatz: dortweicht
derMittelwerteinerStichprobeauchumdenechtenMittelwertderPopulationab.)
Typischerweise wird ein 95%-Konfidenz-Intervall angegeben (ca. +/- 2*Standardfehler). R bietet uns
dafürdiepassendeFunktionan:
confint(model)
|             | 2.5          | % 97.5 %   |     |     |     |     |
| ----------- | ------------ | ---------- | --- | --- | --- | --- |
| (Intercept) | -119.8237251 | -90.198783 |     |     |     |     |
| Height      | 0.9311971    | 1.104036   |     |     |     |     |
Die Bedeutung und Interpretation eines Konfidenz-Intervalls ist extrem tükisch. Wir werden darauf
später noch genauer eingehen. Wenn das Konfidenz-Intervall den Null-Wert nicht einschließt, dann
istderKoeﬀizientstatistischsignifikant. GenaudassagtauchPr(>|t|)aus: wennderechteWertdes
KoeﬀizienteninderGesamtpopulationgleichNullwäre,wiegroßistdanndieChance,dievorliegenden
DatenderStichprobe(oderextremere)erhaltenzuhaben? InunseremBeispiel: nahezu0%Chancefür
denHeight-Koeﬀizientenundebenfalls0%ChancefürdenIntercept.
Vorhersage(Prediction)vonWerten
WennwirdieRegressionsgeradehaben, dannkönnenwirinFolgeauchfürbeliebigeneueWerteden
Zielwertvorhersagen,indemwirdieGeradengleichunganwenden:
| # Koeffizienten | des Modells |     |     |     |     |     |
| --------------- | ----------- | --- | --- | --- | --- | --- |
| modelCoef =     | coef(model) |     |     |     |     |     |
# Neuer Punkt
| LVDAA,ArnoHollosi |     |     |     |     |     | 10  |
| ----------------- | --- | --- | --- | --- | --- | --- |

Z-Transformation LINEAREREGRESSION
new.height = 172
# Vorhersage (ignorieren Sie die "Intercept"-Überschrift)
modelCoef[1] + modelCoef[2]*new.height
(Intercept)
70.01883
RbietetaucheineFunktion,umdieVorhersageautomatischzuberechnen:
predict(model, newdata=list(Height = 172))
1
70.01883
# und mit Angabe des Konfidenz-Intervalls:
# "lwr" ... lower bound (2.5%)
# "upr" ... upper bound (97.5%)
predict(model, newdata=list(Height = 172), interval="confidence")
fit lwr upr
1 70.01883 69.2033 70.83436
Z-Transformation
WerdendieVariablenz-skaliertändernsichauchdieKoeﬀizienten. BeidereinfachenRegression𝑦 ∼
𝛼+𝛽𝑥ändernsichdieKoeﬀizienten𝛽beiderz-Transformationvon𝑦und𝑥wiefolgt: 𝛽 = 𝛽𝜎 𝑥 bzw.
𝑧 𝜎
𝑦
𝜎
dieinverseTransformation: 𝛽 = 𝛽 𝑦. BeinominalenVariablengibteskein𝜎 ,d.h. dortvereinfachen
𝑧𝜎 𝑥
𝑥
sichdieFormelnzu𝛽 = 𝛽 1 und𝛽 = 𝛽 𝜎 . DenInterceptberücksichtigenwirnichtweiter: wenn
𝑧 𝜎 𝑧 𝑦
𝑦
alle𝑥numerischsind,dannistderIntercept𝛼 = 0.
AmBeispieleinesRegressionsmodellsmiteinernumerischenundeinernominalenVariable:
model2 = lm(Weight ~ Gender + Height, data=body)
coef(model2)
(Intercept) GenderMale Height
-56.9494889 8.3659935 0.7129752
# Wir erwarten daher folgende Koeffizienten für transformierte Variable:
sd_y = sd(body$Weight)
sd_x = sd(body$Height)
beta_z_gender = coef(model2)["GenderMale"] / sd_y
beta_z_height = coef(model2)["Height"] / sd_y * sd_x
c(beta_z_gender, beta_z_height)
GenderMale Height
0.6268652 0.5025643
# Regression mit z-transformierten Variablen:
body$Weight.z = zscale(body$Weight)
body$Height.z = zscale(body$Height)
model2_z = lm(Weight.z ~ Gender + Height.z, data=body)
# Anm.: Intercept != 0, da wir nominale Variable "Gender" haben
coef(model2_z)
LVDAA,ArnoHollosi 11

Z-Transformation LINEAREREGRESSION
| (Intercept) | GenderMale | Height.z  |
| ----------- | ---------- | --------- |
| -0.3053958  | 0.6268652  | 0.5025643 |
Interpretation: beizweiPersonen,diesichnurinihrerGrößeunterscheiden(ansonstenidentischsind),
ändert sich das Gewichtje Standardabweichungin der Größe (9.4cm) um 0.5 Standardabweichungen
(alsoum0.5*13.3=6.7kg). EinMannistbeisonstgleichenEigenschaftenum0.63Standardabweichungen
schwereralseineFrau(alsoum0.63*13.3=8.4kg).
LVDAA,ArnoHollosi 12