<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/02a-Lineare-Regression-mit-Bayes.pdf -->

Lineare Regression mit Bayes
ArnoHollosi
Contents
Motivation 1
Hintergrund: BerechnungenbeiBayes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1
LineareRegression 2
Beispiel: EisflächederArktis 2
Beispiel: Körpermaße 5
Koeﬀizienten . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
Intervalle . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
Regressionsgerade . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
Priors . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
Motivation
WirwollennunRegressionsmodelleaufstellen,welchedieBayesscheStatistikalsGrundlagehaben. Als
LibraryverwendenwirMC-Stan(https://mc-stan.org/). DadieseLibraryeineC-Compilerbenötigt,
verwendenwirstattdesseneinR-Paket,welchesvordefinierte,generischeModellebereithalt(rstanarm),
damitwirnichtselberkompilierenmüssen.
Hintergrund: BerechnungenbeiBayes
Der Satz von Bayes 𝑝(𝐴|𝐵) = 𝑝(𝐵|𝐴)×𝑝(𝐴) erlaubt es uns, eine Wahrscheinlichkeit (=Koeﬀizienten
𝑝(𝐵)
des Modells) anhand von Daten/Messreihen und eines Priors (Vorwissen) zu berechnen. Die zu
lösende Fragelautet: Welche Koeﬀizientensind bei einem gegebenenModell wahrscheinlich, wenndie
gemessenenDatenvorliegen1?
Bei Regressionsmodellen ist im allgemeinen Fall die Bayes-Formel nicht analytisch lösbar, d.h. nicht
direkt berechenbar. Abhilfe: man löst die Formel numerisch, d.h. man nimmt Proben (Samples)
an bestimmten Stellen und errechnet so näherungsweise das Ergebnis (vgl. auch Arbeitsblatt
01a-Schlussfolgern-mit-Bayes).
MC-Stan verwendet für das Sampling ein MCMC-Verfahren (Markov Chain Monte Carlo). Damit
können mit wenigen Samples (Standard: 4000 Samples) die Koeﬀizienten von Regressionsmodellen
gutvorhergesagtwerden. DadasSamplingZufallverwendet,unterscheidensichdieErgebnisseimmer
leichtvoneinander(2-3%).
1Beiderherkömlichen(frequentistischen)StatistikistdasErgebnisnichtdieWahrscheinlichkeitdesModells, sonderndie
WahrscheinlichkeitdassdievorliegendenDatenzuerwartensind,unterAnnahmedassdasModellstimmt.Dasisttypischerweise
nichtdieFrage,dieunsinteressiert.
1

BEISPIEL:EISFLÄCHEDERARKTIS
| Lineare |     | Regression |     |     |     |     |     |
| ------- | --- | ---------- | --- | --- | --- | --- | --- |
Die lineare Regression (wie im Arbeitsblatt Wiederholung-Basiswissen beschrieben) versucht folgende
Gleichungmöglichstoptimal(d.h. mitkleinstmöglichenAbweichungen(Residuen))zulösen:
|     |     |     |     |     |     | 𝑦 ∼ 𝛼+𝛽𝑥+𝜖 |     |
| --- | --- | --- | --- | --- | --- | ---------- | --- |
|     | 𝑦   |     |     |     | 𝛼   |            | 𝛽𝑥  |
Wobei eine metrische Variable ist, für den Intercept steht und für die unabhängige Variable
𝑥 mit Koeﬀizient 𝛽. 𝑥 muss weder metrisch, noch normalverteilt sein. Der Fehler 𝜖 beschreibt jene
Umwelteinflüsse,dievomModellnichterfasstwerdenoderfehlendeunabhängigeVariableetc.
Dieklassiche(frequentistische)Regressionberechnet𝑝(𝕐|𝜃),d.h. wiewahrscheinlichdievorliegende
Datenreihe 𝕐 = (𝑦,𝑥) zu erwarten ist, unter der Annahme, dass die Koeﬀizienten des Modells
|     |     | 𝜃 = (𝛼,𝛽) |     |     |     |     |     |
| --- | --- | --------- | --- | --- | --- | --- | --- |
den Wert haben. Die p-Werte, welche bei der summary() eines mit lm() berechneten
Modellsausgegebenwerden(unddiedarausabgeleitetenSternchen), gehenvon𝜃 = 0aus, alsovon
der Nullhypothese. Nur wenn die tatsächlichen Koeﬀizienten so stark von Null abweichen, dass die
Wahrscheinlichkeit,dievorliegende(oderextremere)Datenreihezusehen,unter5%(0.05)sinkt,spricht
manklassicherweisevonstatistischsignifikant. Unteranderemschließtdanndas95%-Konfidenzintervall
desKoeﬀizientendenNullwertselbstnichtmehrein.
AllerdingsistdastypischerweisenichtdieFrage,dieunsinteressiert! Vieleherwollenwir𝑝(𝜃|𝕐)wissen:
wie wahrscheinlich sind unsere Koeﬀizienten 𝜃 des Modells auf Basis der vorliegenden Datenreihe 𝕐.
Mit der Bayes-Formel lässt sich diese Wahrscheinlichkeit ableiten, allerdings müssen wir einen Prior
wählen–alsoeineWahrscheinlichkeitsverteilungfürunserVorwissenmitinsModellaufnehmen.
| Beispiel: |     | Eisfläche |     | der | Arktis |     |     |
| --------- | --- | --------- | --- | --- | ------ | --- | --- |
DassdasarktischeEisschmilzt,istdurchvieleMessungenbestätigtworden. DervorliegendeDatensatz
gibtdieGesamtflächedesarktischenEisesinMiokm²an,gemessenimSeptemberdesjeweiligenJahres.
Eineinfaches(frequentistisches)linearesRegressionsmodellsähewiefolgtaus:
arctic_ice = read.csv('daten/arctic-sea-ice-extent.csv', stringsAsFactors = TRUE)
| arctic_ice$year2k |     |           | =   | arctic_ice$year  |     | - 2000 |     |
| ----------------- | --- | --------- | --- | ---------------- | --- | ------ | --- |
| lm(extent         |     | ~ year2k, |     | data=arctic_ice) |     |        |     |
Call:
| lm(formula |     | =   | extent | ~ year2k, | data | = arctic_ice) |     |
| ---------- | --- | --- | ------ | --------- | ---- | ------------- | --- |
Coefficients:
| (Intercept) |         |     |          | year2k |     |     |     |
| ----------- | ------- | --- | -------- | ------ | --- | --- | --- |
|             | 6.01723 |     | -0.09205 |        |     |     |     |
ProJahrgehen(lautModell)92.000km²Eisverloren. DamitderInterceptaussagekräftigist,habenwir
dasJahr2000alsReferenzgenommen(year2k=0).
DanngibtderInterceptdieAusdehnungdesEises
zurJahrtausendwendean,nämlich6.02Miokm².2
MiteinemBayes-ModellwäreunserPosteriornunzweidimensional: 1xfürdenInterceptund1xfürden
Koeﬀizientenvonyear2k. DerPosteriordesModellssiehtnachden34Datensätzensoaus(alsHeatmap
bzw. 3D-Darstellung):
2Die6.02Miokm²stimmenallerdingsnichtmitdertatsächlichenAusdehnungimJahr2000lautDatensatzüberein(6.32Mio
km²). Grundist,dassdieRegressionsgeradedenWegderminimalenAbweichungsuchtunddasJahr0(bzw. Jahr2000)nicht
speziellbehandelt.
LVDAA,ArnoHollosi 2

BEISPIEL:EISFLÄCHEDERARKTIS
Figure1: 3D-AnsichtdesPosteriors
LVDAA,ArnoHollosi 3

BEISPIEL:EISFLÄCHEDERARKTIS
Um an die Verteilung für die beiden Werte (Intercept und year2k) zu kommen, müssen wir die
sogenanntemarginaldistributionberechnen,alsoeineAufsummierungentlangderAchsendurchführen:
| intercept | = rowSums(posterior) |           |     |     |     |     |     |     |        |     |     |
| --------- | -------------------- | --------- | --- | --- | --- | --- | --- | --- | ------ | --- | --- |
| year_coef | = colSums(posterior) |           |     |     |     |     |     |     |        |     |     |
|           |                      | Intercept |     |     |     |     |     |     | year2k |     |     |
tpecretni feoc_raey
|     | 95.1% HDI |     |       |     |     |     |     |        | 95.2% HDI |        |     |
| --- | --------- | --- | ----- | --- | --- | --- | --- | ------ | --------- | ------ | --- |
|     | 5.949     |     | 6.086 |     |     |     |     | −0.098 |           | −0.086 |     |
−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−− −−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−−
| 5.85 | 5.95 |     | 6.05 | 6.15 |     | −0.110 |     | −0.100 |     | −0.090 | −0.080 |
| ---- | ---- | --- | ---- | ---- | --- | ------ | --- | ------ | --- | ------ | ------ |
UnserModellsagtalsovorher, dassimJahr20005.9..6.1Miokm²Eisflächevorhandenwar(Intercept,
|     |     | alpha_seq |     |     |     |     |     |     | beta_seq |     |     |
| --- | --- | --------- | --- | --- | --- | --- | --- | --- | -------- | --- | --- |
mityear2k=0)undproJahr86000..98000km²Eisflächeverlorengehen.
BerechnungmitMC-Stan
SetzenwirobigesBeispielfort,alsodieAusdehnungdesarktischenEises.
| # Alle  | möglichen     | Parameter | einmal  | voll | ausgeschrieben |     |     |     |     |     |     |
| ------- | ------------- | --------- | ------- | ---- | -------------- | --- | --- | --- | --- | --- | --- |
| modell1 | = stan_glm(   |           |         |      |                |     |     |     |     |     |     |
| formula | = extent      | ~         | year2k, |      |                |     |     |     |     |     |     |
| data    | = arctic_ice, |           |         |      |                |     |     |     |     |     |     |
family = gaussian(link='identity'), # Art der Regression bzw. der Residuen
| chains          | = 4,        |                   |             |     | # wir       | lassen               | vier  | Sampling-Durchläufe  |              |             | berechnen |
| --------------- | ----------- | ----------------- | ----------- | --- | ----------- | -------------------- | ----- | -------------------- | ------------ | ----------- | --------- |
| iter            | = 2000,     |                   |             |     | # es        | werden               | 2000  | Samples              | je Durchlauf |             | genommen  |
| warmup          | = 1000,     |                   |             |     | # die       | Hälfte               | davon | als                  | Warmup       |             |           |
| thin            | = 1,        |                   |             |     | # jedes     | Sample               |       | wird für             | Posterior    | hergenommen |           |
| seed            | = 1234,     |                   |             |     | # Startwert |                      | für   | den Zufallsgenerator |              |             |           |
| prior_intercept |             | =                 | normal(5.5, | 1), | # Prior     | für                  | den   | Intercept            |              |             |           |
| prior           | = normal(0, |                   | 0.2),       |     | # Prior     | für                  | die   | Koeffizienten        |              |             |           |
| prior_aux       | =           | exponential(3/1), |             |     | # Prior     | für                  | sigma |                      |              |             |           |
| refresh         | = 0         |                   |             |     | # Ohne      | Sampling-Fortschritt |       |                      | anzuzeigen   |             |           |
)
| summary(modell1, |     | digits=2) |     |     |     |     |     |     |     |     |     |
| ---------------- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 4

BEISPIEL:KÖRPERMASSE
| Model         | Info: |          |                       |            |        |       |     |     |     |
| ------------- | ----- | -------- | --------------------- | ---------- | ------ | ----- | --- | --- | --- |
| function:     |       | stan_glm |                       |            |        |       |     |     |     |
| family:       |       | gaussian |                       | [identity] |        |       |     |     |     |
| formula:      |       | extent   |                       | ~ year2k   |        |       |     |     |     |
| algorithm:    |       | sampling |                       |            |        |       |     |     |     |
| sample:       |       | 4000     | (posterior            |            | sample | size) |     |     |     |
| priors:       |       | see      | help('prior_summary') |            |        |       |     |     |     |
| observations: |       | 34       |                       |            |        |       |     |     |     |
| predictors:   |       | 2        |                       |            |        |       |     |     |     |
Estimates:
|             |     | mean  | sd   | 10%   |       | 50% 90% |     |     |     |
| ----------- | --- | ----- | ---- | ----- | ----- | ------- | --- | --- | --- |
| (Intercept) |     | 6.01  | 0.11 | 5.87  | 6.01  | 6.15    |     |     |     |
| year2k      |     | -0.09 | 0.01 | -0.11 | -0.09 | -0.08   |     |     |     |
| sigma       |     | 0.58  | 0.07 | 0.49  | 0.57  | 0.68    |     |     |     |
Fit Diagnostics:
|          |      | mean | sd   | 10%  | 50% | 90%  |     |     |     |
| -------- | ---- | ---- | ---- | ---- | --- | ---- | --- | --- | --- |
| mean_PPD | 6.43 | 0.14 | 6.24 | 6.43 |     | 6.61 |     |     |     |
The mean_ppd is the sample average posterior predictive distribution of the outcome variable (for details see help('summary.stanreg')).
MCMC diagnostics
|               |     | mcse | Rhat | n_eff |     |     |     |     |     |
| ------------- | --- | ---- | ---- | ----- | --- | --- | --- | --- | --- |
| (Intercept)   |     | 0.00 | 1.00 | 3788  |     |     |     |     |     |
| year2k        |     | 0.00 | 1.00 | 3680  |     |     |     |     |     |
| sigma         |     | 0.00 | 1.00 | 3385  |     |     |     |     |     |
| mean_PPD      |     | 0.00 | 1.00 | 4030  |     |     |     |     |     |
| log-posterior |     | 0.03 | 1.00 | 1706  |     |     |     |     |     |
For each parameter, mcse is Monte Carlo standard error, n_eff is a crude measure of effective sample size, and Rhat is the potential scale reduction factor on split chains (at convergence Rhat=1).
Das Ergebnis sind wieder ähnliche Werte für Intercept und year2k wie in unseren vorherigen
Berechnungen.
| Beispiel: | Körpermaße |     |     |     |     |     |     |     |     |
| --------- | ---------- | --- | --- | --- | --- | --- | --- | --- | --- |
SehenwirunsalsweiteresBeispieldenKörpermaß-Datensatzesan:
# Daten von: Heinz et al.: Exploring Relationships in Body Dimensions,
| #   |     |     |     | Journal |     | of Statistics | Education | Volume 11, | Number 2 (2003) |
| --- | --- | --- | --- | ------- | --- | ------------- | --------- | ---------- | --------------- |
# http://ww2.amstat.org/publications/jse/v11n2/datasets.heinz.html
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)
| # reduzieren  |     | der Daten   | auf | verwendete |     | Spalten           |     |     |     |
| ------------- | --- | ----------- | --- | ---------- | --- | ----------------- | --- | --- | --- |
| body = body[, |     | c('Weight', |     | 'Height',  |     | 'Age', 'Gender')] |     |     |     |
info(body)
|        | mean   |       | sd median |       | min  | max na neg0 |     |     |     |
| ------ | ------ | ----- | --------- | ----- | ---- | ----------- | --- | --- | --- |
| Weight | 69.15  | 13.35 |           | 68.2  | 42.0 | 116.4 0     | 0   |     |     |
| Height | 171.14 | 9.41  | 170.3     | 147.2 |      | 198.1 0     | 0   |     |     |
LVDAA,ArnoHollosi 5

| Koeﬀizienten |       |      |     |           |      |     |     | BEISPIEL:KÖRPERMASSE |     |
| ------------ | ----- | ---- | --- | --------- | ---- | --- | --- | -------------------- | --- |
| Age          | 30.18 | 9.61 |     | 27.0 18.0 | 67.0 | 0   | 0   |                      |     |
Gender
| Female: | 260 |     |     |     |     |     |     |     |     |
| ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Male:   | 247 |     |     |     |     |     |     |     |     |
WirinteressierenunsfürdasKörpergewichtinAbhängigkeitderanderenVariablen. Dabeizentrieren
wir wieder die metrischen Variablen, sodass der Basisfall eine sinnvolle Bedeutung hat. Das lineare
ModellmitdreiunabhängigenVariablensiehtdannsoaus:
| body$Height170 |                   | = body$Height |            | - 170       |     |            |           |     |     |
| -------------- | ----------------- | ------------- | ---------- | ----------- | --- | ---------- | --------- | --- | --- |
| body$Age30     | =                 | body$Age      | -          | 30          |     |            |           |     |     |
| modell2        | = stan_glm(Weight |               |            | ~ Height170 | +   | Age30      | + Gender, |     |     |
|                |                   |               | data=body, | seed=123,   |     | refresh=0) |           |     |     |
| print(modell2, |                   | digits=2)     |            |             |     |            |           |     |     |
stan_glm
| family:       |     | gaussian |     | [identity]  |         |     |        |     |     |
| ------------- | --- | -------- | --- | ----------- | ------- | --- | ------ | --- | --- |
| formula:      |     | Weight   |     | ~ Height170 | + Age30 | +   | Gender |     |     |
| observations: |     | 507      |     |             |         |     |        |     |     |
| predictors:   |     | 4        |     |             |         |     |        |     |     |
------
|             |     | Median        | MAD_SD |     |     |     |     |     |     |
| ----------- | --- | ------------- | ------ | --- | --- | --- | --- | --- | --- |
| (Intercept) |     | 64.57         | 0.63   |     |     |     |     |     |     |
| Height170   |     | 0.73          | 0.06   |     |     |     |     |     |     |
| Age30       |     | 0.18          | 0.04   |     |     |     |     |     |     |
| GenderMale  |     | 7.65          | 1.05   |     |     |     |     |     |     |
| Auxiliary   |     | parameter(s): |        |     |     |     |     |     |     |
Median MAD_SD
| sigma | 8.65 | 0.27 |     |     |     |     |     |     |     |
| ----- | ---- | ---- | --- | --- | --- | --- | --- | --- | --- |
------
| * For | help | interpreting |        | the printed | output                 |     | see ?print.stanreg |     |     |
| ----- | ---- | ------------ | ------ | ----------- | ---------------------- | --- | ------------------ | --- | --- |
| * For | info | on the       | priors | used see    | ?prior_summary.stanreg |     |                    |     |     |
DerKopfderAusgabegibtunsallgemeineInformationzumModell:
• family: gaussian [identity]: eshandeltsichumeinegewöhnlichelineareRegression,beider
wirdavonausgehen,dassderModellfehler𝜖inetwanormalverteilt(gaussian)ist.
| observations: |     |     | 507:                |     |     |     |     |     |     |
| ------------- | --- | --- | ------------------- | --- | --- | --- | --- | --- | --- |
| •             |     |     | AnzahlderDatensätze |     |     |     |     |     |     |
• predictors: 4: AnzahlderKoeﬀizienten(Height170,Age30,GenderMaleundIntercept)
Koeﬀizienten
Wird das Modell mit print anstelle mit summary ausgegeben, werden die Koeﬀizienten nicht als
Mittelwerte mit Standardabweichung angegeben, sondern als Median plus MAD_SD; das steht für den
MedianderabsolutenAbweichung(medianabsolutedeviation)vommittlerenMedian3. Hintergrundfür
dieWahlvonMedian+MADist,dassderMedian“stabiler”alsderMittelwertist(insbesonderewas
kleineDatensätzeundschieflastigeVerteilungenbetrifft).
3MedianderabsoluteAbweichungvomMedian:
|     |     |     |     |     | 𝑀   | = 𝑚𝑒𝑑𝑖𝑎𝑛(𝑧 | 𝑖 )und𝑀𝐴𝐷_𝑆𝐷 | = 1.48∗𝑚𝑒𝑑𝑖𝑎𝑛(|𝑧 | 𝑖 −𝑀|) |
| --- | --- | --- | --- | --- | --- | ---------- | ------------ | ---------------- | ------ |
füreineDatenreihe𝑧
𝑖. DerFaktor1.48kommtdaher,dassdasresultierendeMAD-IntervallderStandardabweichungbeieiner
Normalverteilungentsprechensoll.
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     | 6   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Intervalle BEISPIEL:KÖRPERMASSE
InunseremBeispielhatalsoderIntercepteinenWertvon64.6kgmiteinemMAD_SDvon0.63kg. D.h.
95%allerwahrscheinlichenWerteliegeninetwaimBereich64.6±2×0.63kg.
Der Intercept ist der Basisfall, wenn alle unabhängigen Variablen gleich Null sind bzw. bei Faktoren
derReferenzfallsind. InunseremFallalsoHeight170=0(entsprichtHeight=170),Age30=0(entspricht
Age=30)undGender=Female(ersteGruppeimGender-Faktor). DerBasisfallistalsoeine170cmgroße,
30JahrealteFrau. Siewiegt64.6kg.
DieKoeﬀizientenfürHeightundAgegebendie“SteigungderGeraden”an. Height170=0.73bedeutet,
dassje1cmUnterschieddasGewichtum0.73kgzunimmt. Bzw. genauer: beizweiansonstengleichen
Personen,derenGrößesichum1cmunterscheidet,unterscheidetsichdasGewichtum0.73±0.12kg.
AnalogbeiAge30=0.18: je1JahrAltersunterschiednimmtdasGewichtum0.18±0.08kgzu.
Für Gruppen geben die Koeﬀizienten die Differenz zum Basisfall (= zur Referenzgruppe) an. Bei
GenderistfemaledieReferenzgruppe(sieistimInterceptenthalten). BleibtalsoeinKoeﬀizientfürdie
male-Gruppe, GenderMale=7.65. Interpretation: imVergleichzuFrauen(=dieReferenzgruppe) sind
ansonstengleicheMänner(gleichesAlter,gleicheGröße)um7.65±2.1kgschwerer.
Derauxiliaryparameter𝜎 gibtdieStandardabweichungderResiduenan. DaderenMittelwertNullist,
kannmandarausdiedurchschnittlicheGrößederResiduenableiten;einzelneVorhersagenweichenim
Schnittalsoca. 8kgvomwirklichenGewichtab.
DieAussagengeltenalleaufBasisdesvorliegendenDatensatzes,derausCollege-Studierendeninden
USAbesteht,alsonichtrepräsentativfürdiegesamteBevölkerungist.
Intervalle
Genaue Intervalle können entweder mit posterior_interval(modell) berechnet werden (berechnet
Quantillen der Verteilung) oder (in der LV bevorzugt) Highest Density Interval, das Interval der
wahrscheinlichsten Werte, berechnet mit hdi(modell). Die Intervalle weichen typischerweise nur
geringfügigvoneinanderab:
HDI:lwr HDI:upr PI:2.5% PI:97.5%
(Intercept) 63.34 65.67 63.38 65.71
Height170 0.62 0.84 0.62 0.84
Age30 0.10 0.26 0.10 0.26
GenderMale 5.55 9.66 5.52 9.66
sigma 8.13 9.19 8.15 9.21
Bzw. können wir mithilfe von plothist() (einem erweiterten Histogramm aus daatools) die genau
VerteilungunddasHDIanzeigen. Standardmäßigwirdein95%-IntervallgenommenundderMedian
derVerteilung(kannmitParameterngeändertwerden):
par(mfrow=c(2,2), mar=c(2,4,4,4))
plothist(modell2, '(Intercept)')
plothist(modell2, 'Height170')
plothist(modell2, 'Age30')
plothist(modell2, 'GenderMale')
LVDAA,ArnoHollosi 7

| Intervalle |                          |     |       |     |                         |         | BEISPIEL:KÖRPERMASSE |         |     |
| ---------- | ------------------------ | --- | ----- | --- | ----------------------- | ------- | -------------------- | ------- | --- |
|            | Histogram of (Intercept) |     |       |     | Histogram of Height170  |         |                      |         |     |
|            |                          |     | =     |     |                         |         | =                    |         |     |
|            | median                   |     | 64.6  |     |                         | median  | 0.727                |         |     |
|            | 95% HDI                  |     |       |     |                         | 95% HDI |                      |         |     |
|            | 63.3                     |     | 65.7  |     | 0.617                   |         |                      | 0.842   |     |
|            | 63                       | 64  | 65 66 |     |                         | 0.6 0.7 |                      | 0.8 0.9 |     |
|            | Histogram of Age30       |     |       |     | Histogram of GenderMale |         |                      |         |     |
|            |                          | =   |       |     |                         |         | =                    |         |     |
|            | median                   |     | 0.179 |     |                         | median  |                      | 7.65    |     |
|            | 95% HDI                  |     |       |     |                         | 95% HDI |                      |         |     |
|            | 0.102                    |     | 0.258 |     |                         | 5.55    |                      | 9.66    |     |
| 0.05       | 0.15                     |     | 0.25  |     | 4                       | 6       | 8                    | 10      |     |
Alternativkönnenwirmitplotcoef()einenraschenÜberblicküberdieWertederKoeﬀizientensowie
deren95%-HDIerhalten:
plotcoef(modell2, "beta") # nur Koeffizienten ohne Intercept und Sigma
Height170
netneiziffeoK
Age30
GenderMale
|                   |     | 0.0 |     | 2.5 | 5.0 |     |     | 7.5 | 10.0 |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | ---- |
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     | 8    |

Regressionsgerade BEISPIEL:KÖRPERMASSE
Regressionsgerade
WirkönnendieentstandeneRegressionsgeradebeispielsweiseimScatterplottanzeigen:
cf = coef(modell2)
# Basiswert für eine 29-jährige Frau (~mittleres Alter von Frauen im Datensatz)
female = cf['(Intercept)'] + cf['Age30']*(28-30)
# Basiswert eines 32-jährigen Mannes (~mittleres Alter von Männer im Datensatz)
male = cf['(Intercept)'] + cf['Age30']*(32-30) + cf['GenderMale']
# Frauen=rot, Männer=türkis
ggplot(body, aes(Height170, Weight, color=Gender, group=Gender)) +
geom_point(alpha=0.3) +
theme_minimal() +
geom_abline(aes(intercept=female, slope=cf['Height170'], color='Female')) +
geom_abline(aes(intercept=male, slope=cf['Height170'], color='Male'))
120
100
80
60
40
−20 −10 0 10 20 30
Height170
thgieW
Gender
Female
Male
Bzw. wennX-AchsedasAlterist:
LVDAA,ArnoHollosi 9

Priors BEISPIEL:KÖRPERMASSE
120
100
80
60
40
−10 0 10 20 30
Age30
thgieW
Gender
Female
Male
BeibeidenDarstellungenistklarzusehen,dassGruppendieLiniennurparallelverschieben,alsonicht
dieSteigungändern.
LassenSiesichabernichtvonderDarstellungtäuschen: fürdieLinienhabenwirjanurdieMittelwerte
derKoeﬀizientengenommen(diePunktwerte),nichteinevolleVerteilung. Wennmanbspw. jeweils25
Samplesauswählt,ergebensichfolgende25leichtunterschiedlicheRegressionsgeradenjeGruppe:
120
100
80
60
40
−20 −10 0 10 20 30
Height170
thgieW
Gender
Female
Male
Priors
WiesiehtesmitdenPriorsaus? UmeinErgebnis(Posterior)zuerhalten,müssenjanichtnurDatenund
deren Likelihood vorhanden bzw. berechnet werden, sondern auch ein Vorwissen (Prior) einfließen.
LVDAA,ArnoHollosi 10

| Priors |     |     |     | BEISPIEL:KÖRPERMASSE |     |     |
| ------ | --- | --- | --- | -------------------- | --- | --- |
Bisherhabenwiraberkeinesangegeben…stan_glm()hatDefault-Priorsverwendet,welcheunsinnige
Werteausschließen:
prior_summary(modell2)
| Priors | for model 'modell2' |     |     |     |     |     |
| ------ | ------------------- | --- | --- | --- | --- | --- |
------
| Intercept         | (after predictors | centered)   |        |     |     |     |
| ----------------- | ----------------- | ----------- | ------ | --- | --- | --- |
| Specified         | prior:            |             |        |     |     |     |
| ~ normal(location |                   | = 69, scale | = 2.5) |     |     |     |
| Adjusted          | prior:            |             |        |     |     |     |
| ~ normal(location |                   | = 69, scale | = 33)  |     |     |     |
Coefficients
| Specified          | prior:  |            |         |                      |     |     |
| ------------------ | ------- | ---------- | ------- | -------------------- | --- | --- |
| ~ normal(location  |         | = [0,0,0], | scale = | [2.5,2.5,2.5])       |     |     |
| Adjusted           | prior:  |            |         |                      |     |     |
| ~ normal(location  |         | = [0,0,0], | scale = | [ 3.55, 3.47,66.68]) |     |     |
| Auxiliary          | (sigma) |            |         |                      |     |     |
| Specified          | prior:  |            |         |                      |     |     |
| ~ exponential(rate |         | = 1)       |         |                      |     |     |
| Adjusted           | prior:  |            |         |                      |     |     |
| ~ exponential(rate |         | = 0.075)   |         |                      |     |     |
------
| See help('prior_summary.stanreg') |     |     | for more | details |     |     |
| --------------------------------- | --- | --- | -------- | ------- | --- | --- |
DiePriorssindinderReihenfolgederRegressionsformelbzw. derKoeﬀizientenangegebenundzwar
alsspecifiedandadjustedangegeben. InbeidenFällenhandeltessichumNormalverteilungen.
Beim specified prior werden z-transformierte Werte verwendet. Coefficients, Specified prior:
| ~ normal(location | = [0,0,0], | scale | = [2.5,2.5,2.5]) |                |          |           |
| ----------------- | ---------- | ----- | ---------------- | -------------- | -------- | --------- |
|                   |            |       |                  | bedeutet also, | dass für | alle drei |
Koeﬀizienten (Height170, Age30, GenderMale) eine Normalverteilung mit Mittelwert 0 (location)
und Standardabweichung 2.5 (scale) verwendet wird. Typischerweise können Koeﬀizienten (wenn
alle Variablen z-skaliert sind) nur zwischen -1 und 1 liegen4. Mit dem angegebenen Prior lassen wir
Werte zwischen -5..+5 (~95%-Intervall) für die Koeﬀizienten zu. D.h. das Vorwissen hat so gut wie
keinen Einfluss auf die Koeﬀizienten, sondern schließt nur unsinnige Werte (bei instabilem Verhalten
desModells)aus.
DieadjustedpriorsskalierendiespecifiedpriorszurückaufdieOriginalskaladerjeweiligenVariable. Die
| BerechnungsiehtfüralleVariablen5soaus: |     |     | 𝜎 = 𝜎 | 𝑠𝑑(𝑦) |     |     |
| -------------------------------------- | --- | --- | ----- | ----- | --- | --- |
. Beispiel: beimGenderlässtderStandardprior
𝑧𝑠𝑑(𝑥)
demnacheinenKoeﬀizientenzwischen-133..+133kgzu,beimAlterca. -7..+7kgjeJahr,beiderGröße
| ebenfallsca. | -7..+7kgjeZentimer. |     |     |     |     |     |
| ------------ | ------------------- | --- | --- | --- | --- | --- |
Im Rahmen der Lehrveranstaltung spezifizieren wir typischerweise keine eigenen Priors, sondern
verwendenimmerdieschwachinformativenStandard-Priors.
4wennzweiVariablesehrstarkkorrelierensindauchKoeﬀizientengrößer1möglich.DasistaberdieAusnahme.
5DiesgiltauchfürnominaleVariablen:IndiesemFalldividiertrstanarmdurchdieStandardabweichungderdummy-codierten
Variable(n).
| LVDAA,ArnoHollosi |     |     |     |     |     | 11  |
| ----------------- | --- | --- | --- | --- | --- | --- |