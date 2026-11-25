<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/08a-Logistische-Regression.pdf -->

Logistische Regression
ArnoHollosi
Contents
Motivation 1
GeneralizedLinearModel(GLM) 2
LogistischeRegression 2
Beispiel: Strahlendosis . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2
Beispiel: Herzinfarkt-Risiko . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
ProblemefürdieBerechnungderRegression 7
WeitereAnforderungen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
TestendesModells 8
Istlogit()diepassendeFunktion? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
EinflussreicheBeobachtungenundLOO-Diagnostik . . . . . . . . . . . . . . . . . . . . . . . . 8
Modellgüte 9
ModellvergleichundVorhersageleistung . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
Genauigkeit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
UnterscheidungzwischenGruppen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
Zusammenfassung 16
Anhang: logit 17
Motivation
DaslineareModellberuhtaufderGleichung𝑦 = 𝛼+𝛽 𝑥 +𝜖. Dabeiist𝑦dieabhängigeVariable,welche
𝑖 𝑖
durchdieunabhängigenVariablen𝑥 “erklärt”wird,𝛼istderIntercept(Offsetbei𝑥 = 0),𝛽 sinddie
𝑖 𝑖 𝑖
Koeﬀizienten und 𝜖 ist der Fehlerterm (= Residuen). Dem linearen Modell liegt typischerweise eine
NormalverteilungderResiduenzuGrunde. ZudemsetztdaslineareModellvoraus,dassdieabhängige
Variable eine metrische Variable ist, also beliebige Werte einnehmen kann, addiert, multipliziert und
dividiertwerdenkann1.
InvielenFällenhataberdiezuuntersuchendeabhängigeVariableabernurzweidiskreteWerte: 0oder
1. Beispiel: SterblichkeitbeiKrankheit,Bundespräsidentenwahl,WahlzwischenzweiAlternativen(z.B.
beimMarketing),Infektion,FehlerimProduktionsprozessetc. DaslineareModellistfürsolcheWerte
ungeeignet:
1UnabhängigeVariablemüssennichtunbedingtmetrischsein. SiekönnenbeispielsweiseauchkategorischeVariablesein,
welchedannineinemDummy-CodingaufmehrereVariable,welchenurdenWert0oder1annehmen,aufgeteiltwerden.
1

LOGISTISCHEREGRESSION
• eskannkeinediskreteAusgangswertemodellieren,nurkontinuierlicheWerte
• diskreteWertesind(imRegelfall)nichtnormalverteilt
• bei Interpretation des Wertebereichs als Wahrscheinlichkeit: die Regressionslinie kann 0
unterschreiten bzw. 1 überschreiten. Selbst wenn wir bei diesen Grenzen die Werte kappen,
bedeutet das, dass keine Änderung/Verbesserung der unabhängigen Variable mehr eine
Änderungin𝑦hervorruft–inderPraxisrechtunrealistisch.
Generalized Linear Model (GLM)
Das Generalized Linear Model (GLM) setzt genau in diesem Punkt an: es erlaubt (a) unterschiedliche
VerteilungenderZielvariablen𝑦und(b)einesogenannteLink-Funktion𝑔(),diedenErwartungswertvon
𝑦 transformiert, damiterdurchdieunabhängigenVariablenerklärtwerdenkann. DieGrundstruktur
desModellslautet:
𝑔(𝐸(𝑦)) = 𝛼+∑𝛽 𝑥
𝑖 𝑖
DieVariabilitätderDatenwirddirektdurcheinegewählteVerteilungmodelliert. Dieglm()-Funktionin
RunterstütztbeispielsweisefolgendeVerteilungen: Binomial,Gamma,Poisson,Quasi-Binomial,Quasi-
PoissonundinversenGauß. JedeVerteilunghatbestimmteEinsatzzwecke.
WirwendenunsderlogistischenRegressionzu: ihrliegteineBinomial-VerteilungzuGrunde. Sieeignet
sich,umRegressionenzurechnen,welchenurzweidiskreteZielwertehaben.
Logistische Regression
Die logistische Regression verwendet als Link-Funktion die sogenannte Logit-Funktion. Anstelle 𝑦
direkt zu berechnen, werden Wahrscheinlichkeiten 𝑝 = 𝑃(𝑦 = 1) berechnet, welche angeben, wie
wahrscheinlich𝑦 = 1ist. EinWert𝑝 = 1entsprichtalsoeinerWahrscheinlichkeitvon100%,dass𝑦 = 1,
ein𝑝 = 0.33entsprichteinerWahrscheinlichkeitvon33%,dass𝑦 = 1. DieRegressionsgleichungsieht
beimlogistischenModellsoaus:
𝑝
𝑙𝑜𝑔( ) = 𝛼+∑𝛽 𝑥
1−𝑝 𝑖 𝑖
Die Link-Funktion 𝑔() ist also 𝑙𝑜𝑔𝑖𝑡(𝑝) = 𝑙𝑜𝑔( 𝑝 ). Der Erwartungswert der binomialverteilten
1−𝑝
Zielvariablen𝑦 ∼ Binomial(1,𝑝)istdabeigenaudieseWahrscheinlichkeit𝐸(𝑦) = 𝑝 = 𝑃(𝑦 = 1).
Beispiel: Strahlendosis
AmBeispieleinesStrahlendosis-ExperimentswollenwirunsdielogistischeRegressionveranschaulichen:
bei dem Experiment werden Zellen mit einer variablen Dosis bestrahlt und dann getestet, ob (0/1)
SchädenimZellkernentstandensind. DieDatenkönntenwiefolgtaussehen:
LVDAA,ArnoHollosi 2

| Beispiel: | Strahlendosis  |     |     |     | LOGISTISCHEREGRESSION |     |     |
| --------- | -------------- | --- | --- | --- | --------------------- | --- | --- |
|           | Gesunde Zellen |     |     |     | Beschädigte Zellen    |     |     |
02
51
| ycneuqerF |     |     |     | ycneuqerF |     |     |     |
| --------- | --- | --- | --- | --------- | --- | --- | --- |
01
01
5
5
| 0   |               |           |     | 0   |      |               |       |
| --- | ------------- | --------- | --- | --- | ---- | ------------- | ----- |
|     | 0 20          | 40 60     | 80  |     | 0 20 | 40            | 60 80 |
|     | Strahlendosis |           |     |     |      | Strahlendosis |       |
|     |               | Vergleich |     |     |      | Scatterplot   |       |
)1/0( tgidähcseB
| 06  |     |     |     | 8.0 |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
04
4.0
02
0.0
0
|     | Gesund | Beschädigt |     | 0   | 20  | 40  | 60  |
| --- | ------ | ---------- | --- | --- | --- | --- | --- |
Strahlendosis
WirverwendenwiederdieFunktionstan_glm(),umdieRegressionsrechnungdurchzuführen:
| # beachten | Sie den Parameter | "family" |     |     |     |     |     |
| ---------- | ----------------- | -------- | --- | --- | --- | --- | --- |
modell = stan_glm(schaden ~ dosis, data=df, family=binomial(link="logit"),
seed=1234, refresh=0)
AnstattgleichaufdieKoeﬀizienteneinzugehen,schauenwirunseinDiagramman:Schadenswahrscheinlichkeit
inAbhängigkeitvonderDosis.
Scatterplot + Regression
0.1
8.0
)1/0( tgidähcseB
6.0
4.0
2.0
0.0
|     | 0 10 | 20  | 30  | 40  | 50  | 60  | 70  |
| --- | ---- | --- | --- | --- | --- | --- | --- |
Strahlendosis
LVDAA,ArnoHollosi 3

| Beispiel: Strahlendosis |     |     |     |     | LOGISTISCHEREGRESSION |
| ----------------------- | --- | --- | --- | --- | --------------------- |
Der Verlauf der Regressionslinie für die Wahrscheinlichkeit, zeigt uns deutlich das Muster dieser
Regression: in den Bereichen, wo die Experimentdaten eindeutig sind (Strahlendosis kleiner 20
bzw. größer 60) gibt auch die Regression ein nahezu eindeutiges Ergebnis. Im Übergangsbereich
(Strahlendosis 30..50) nimmt die Anzahl der geschädigten Zellen zu und die Anzahl der gesunden
Zellenab,dementsprechendzeigtauchhierdieRegressionslinieeinestetigsteigendeWahrscheinlichkeit
fürZellschäden.
Diese S-Kurve ist charakteristisch für die logistische Regression. Sie hat auch zur Folge, dass eine
Veränderung der Strahlendosis eine nicht-lineare Änderung der Schadenswahrscheinlichkeit zur Folge
hat. DiefolgendeTabellezeigtist–obwohlsichdieStrahlendosisimmerum10ändert–istdieDifferenz
(derZuwachs)derWahrscheinlichkeiteinesZellschadenssehrunterschiedlich.
|     | Strahlendosis |     | Wahrscheinlichkeit |       | Differenz |
| --- | ------------- | --- | ------------------ | ----- | --------- |
|     |               | 10  |                    | 0.001 | -         |
|     |               | 20  |                    | 0.005 | 0.005     |
|     |               | 30  |                    | 0.053 | 0.047     |
|     |               | 40  |                    | 0.396 | 0.343     |
|     |               | 50  |                    | 0.888 | 0.492     |
|     |               | 60  |                    | 0.988 | 0.101     |
WiekannmandieseÄnderungandersbeschreiben? WennwirdieWahrscheinlichkeitalsodds(d.h. als
ChancenimSinnevonWettchancen)ausdrücken,siehtesgleichbesseraus. Chancenwerdenals𝑥 ∶ 𝑦
ausgedrückt. Beispiel: eineChancevon1:1(sprich“1zu1”)entspricht50%Wahrscheinlichkeit;wenn
dieChancen2:1(“2zu1”)stehenentsprichtdaseiner66%Wahrscheinlichkeit; wenndieChancen1:2
(“1zu2”)stehenentsprichtdas33%Wahrscheinlichkeit. EinigeweitereBeispielewerdeninderTabelle
gezeigt:
|     |     | Chance | Wahrscheinlichkeit |     |     |
| --- | --- | ------ | ------------------ | --- | --- |
|     |     | 1:1    | 50%                |     |     |
|     |     | 3:1    | 75%                |     |     |
|     |     | 10:1   | 91%                |     |     |
|     |     | 2:3    | 40%                |     |     |
|     |     | 1:5    | 17%                |     |     |
DieUmrechnungvonChancen(odds)zuWahrscheinlichkeit(p)bzw. umgekehrtgehtwiefolgt:
|     |         | 𝑝   |         |        | 𝑜𝑑𝑑𝑠(𝑝)   |
| --- | ------- | --- | ------- | ------ | --------- |
|     | 𝑜𝑑𝑑𝑠(𝑝) | =   | 𝑝 = 𝑃(𝑦 | = 1) = |           |
|     |         | 1−𝑝 |         |        | 1+𝑜𝑑𝑑𝑠(𝑝) |
Schauen wir uns nochmal die Vorhersagen des Modells zu Strahlendosis und Zellschaden an, dieses
MalalsChancen:
Strahlendosis Wahrscheinlichkeit Differenz Chancen(odds) Verhältnis(oddsratio)
| 10  |     | 0.001 | -     |     | 0.000 -     |
| --- | --- | ----- | ----- | --- | ----------- |
| 20  |     | 0.005 | 0.005 |     | 0.004 13.11 |
LVDAA,ArnoHollosi 4

| Beispiel: Herzinfarkt-Risiko |     |     |     |     |     | LOGISTISCHEREGRESSION |
| ---------------------------- | --- | --- | --- | --- | --- | --------------------- |
Strahlendosis Wahrscheinlichkeit Differenz Chancen(odds) Verhältnis(oddsratio)
|     | 30  |     | 0.053 | 0.047 |     | 0.050 13.11   |
| --- | --- | --- | ----- | ----- | --- | ------------- |
|     | 40  |     | 0.396 | 0.343 |     | 0.650 13.11   |
|     | 50  |     | 0.888 | 0.492 |     | 8.567 13.11   |
|     | 60  |     | 0.988 | 0.101 |     | 110.596 13.11 |
Wiewirsehen,istdasVerhältnisderChancen,diesogenannteoddsratio,immerkonstant. D.h. beider
logistischenRegressionmultiplizierensichdieChancenmitjederDifferenzin𝑥auf. Schauenwiruns
nundieKoeﬀizientendesModellsan:
stan_glm
| family:       |     | binomial | [logit] |     |     |     |
| ------------- | --- | -------- | ------- | --- | --- | --- |
| formula:      |     | schaden  | ~ dosis |     |     |     |
| observations: |     | 200      |         |     |     |     |
| predictors:   |     | 2        |         |     |     |     |
------
|             |     | Median MAD_SD |      |     |     |     |
| ----------- | --- | ------------- | ---- | --- | --- | --- |
| (Intercept) |     | -10.68        | 1.72 |     |     |     |
| dosis       |     | 0.26          | 0.04 |     |     |     |
------
| * For | help interpreting |            | the printed | output                 | see ?print.stanreg |     |
| ----- | ----------------- | ---------- | ----------- | ---------------------- | ------------------ | --- |
| * For | info on           | the priors | used see    | ?prior_summary.stanreg |                    |     |
EineÄnderungderDosisum+1bewirktalsoeineÄnderungderlogit-Wertevon0.26. Wiesollenwirdas
DieLink-FunktionderlogistischenRegression(wiealso𝑦fürdasModelltransformiert
interpretieren?
wird)istdielogarithmierteChance(log-oddsoderlogit). Wiekommenwiralsovon𝑑𝑜𝑠𝑖𝑠 = 0.26auf
dasVerhältnisvon13.11? UmdenLogarithmusderlog-odds“aufzuheben”müssenwirdenKoeﬀizienten
exponenzieren𝑒0.26
= 1.29unddawireineSchrittweitevon10haben(Strahlendosiserhöhtsichinder
Tabelleimmerum10Einheiten)müssenwirdenFaktorzehnmalmitsichselbstmultiplizieren2–voila:
|     |     |     | 1⏟.2⏟9⏟×⏟1.2⏟9×⏟⋯⏟×⏟1.2⏟9 |     | = 1.2910 | ≈ 13.11 |
| --- | --- | --- | ------------------------- | --- | -------- | ------- |
10-mal
| Beispiel: | Herzinfarkt-Risiko |     |     |     |     |     |
| --------- | ------------------ | --- | --- | --- | --- | --- |
Die Framingham Heart Study erfasst seit vielen Jahren das Herzinfarkt-Risiko. Wir wollen nun ein
Modellrechnen,dasunsdieGrößeverschiedenerRisikofaktorenbestimmt.
# https://www.kaggle.com/dileep070/heart-disease-prediction-using-logistic-regression/
heart = read.csv('daten/framingham-clean.csv', stringsAsFactors = T)
| heart$herzinfarkt   |                      | = as.numeric(heart$TenYearCHD) |                |                          | - 1       |            |
| ------------------- | -------------------- | ------------------------------ | -------------- | ------------------------ | --------- | ---------- |
| split_random(heart, |                      | 2500,                          | "heart_train", | "heart_test")            |           |            |
| # Logistisches      |                      | Regressionsmodell              |                |                          |           |            |
| herz1 =             | stan_glm(herzinfarkt |                                | ~ age          | + sex, data=heart_train, |           |            |
|                     |                      | family=binomial(link="logit"), |                |                          | seed=456, | refresh=0) |
SchauenwirunsalsersteswiedereinenEffektplotan,umeinerstesGefühlfürdasRisikozuerhalten.
WirzeichnenzweiLinienein,einefürFrauen(Referenzgruppe),einefürMänner.
2Alternativ10xdenKoeﬀizienten,dannexponenzieren,da:𝑒10×0.26=(𝑒0.26)10=1.2910≈13.1
LVDAA,ArnoHollosi 5

| Beispiel: Herzinfarkt-Risiko |     |     |     | LOGISTISCHEREGRESSION |     |     |
| ---------------------------- | --- | --- | --- | --------------------- | --- | --- |
Herzinfarktrisiko (innerhalb von 10 Jahren)
0.5
0.4
sex
okisiR 0.3
female
male
0.2
0.1
0.0
| 30  | 40  |     | 50  | 60  | 70  |     |
| --- | --- | --- | --- | --- | --- | --- |
Alter (Jahre)
DasDiagrammzeigtwiedereinennicht-linearenZusammenhang3: mitzunehmendenAlternimmtdas
Risikozu,einenHerzinfarktinnerhalbvonzehnJahrenzuerleiden. Wirsehenauch,dassderAbstand
zwischenMännerundFrauenmitdemAlterzunimmt. DienachfolgendeTabellegibtunswiedereinen
Überblick:
Alter p(F) p(M) odds(F) odds(M) ratio(F) ratio(M) ratio(Mvs.F)
| 30 0.024 | 0.048 | 0.024 | 0.051 -    | -    |     | 2.08 |
| -------- | ----- | ----- | ---------- | ---- | --- | ---- |
| 40 0.050 | 0.099 | 0.053 | 0.110 2.16 | 2.16 |     | 2.08 |
| 50 0.103 | 0.192 | 0.114 | 0.237 2.16 | 2.16 |     | 2.07 |
| 60 0.198 | 0.339 | 0.247 | 0.512 2.16 | 2.16 |     | 2.07 |
| 70 0.348 | 0.526 | 0.535 | 1.109 2.16 | 2.16 |     | 2.07 |
Wir sehen, dass sich die Chance (nicht die Wahrscheinlichkeit!) eines Herzinfarkts alle zehn Jahre
mehr als verdoppelt. Auch haben Männer offensichtlich eine doppelte so hohe Chance (nicht
| Wahrscheinlichkeit!) | alsFraueneinenHerzinfarktzuerleiden. |     |     |     |     |     |
| -------------------- | ------------------------------------ | --- | --- | --- | --- | --- |
WiesehendieKoeﬀizientendesModellsaus?
coef(herz1)
| (Intercept) | age    | sexmale |     |     |     |     |
| ----------- | ------ | ------- | --- | --- | --- | --- |
| -6.0300     | 0.0772 | 0.7321  |     |     |     |     |
𝑦
Der Koeﬀizient sexmale gibt den Gruppenunterschied an. Wegen der logit-Transformation von
müssen wir in exponenzieren: 𝑒0.73 ≈ 2.08 welches genau dem Chancenverhältnis (odds-ratio)
zwischenMännernundFrauenentspricht. BeimAltergehenwirähnlichvor: 𝑒0.08 ≈ 1.08; undweil
wir(analogzumerstenBeispiel)beimAlterinderTabelleimmerSchrittevon10Jahremachen,müssen
|     |     | 1.0810 | ≈ 2.16 |     |     |     |
| --- | --- | ------ | ------ | --- | --- | --- |
wir das 10-mal multiplizieren bzw. rechnen. Unser Modell hat nur einen einzigen
KoeﬀizientenfürdasAlter,weshalbdasVerhältnis(dieodds-ratiofürdasAlter)fürFrauenundMänner
dasselbeist–wieauchschoninderTabelleersichtlich.
3WirsehendiesesMalnurdenerstenTeilderS-Kurve.Siebeginntabca.110Jahrenwiederdeutlichabzuflachen.
| LVDAA,ArnoHollosi |     |     |     |     |     | 6   |
| ----------------- | --- | --- | --- | --- | --- | --- |

PROBLEMEFÜRDIEBERECHNUNGDERREGRESSION
Probleme für die Berechnung der Regression
Ein Problemfall entsteht für die Berechnung des Regressionsmodells, wenn beide Datengruppen
vollständigsepariertsind(Wertebereicheüberschneidensichnicht),wieinfolgendemDiagrammzu
sehen. WelchedereingezeichnetenRegressionslinienistdierichtige? Dierote? Dieviolette? Dieblaue
oderdiegrüne?
0 20 40 60 80
8.0
4.0
0.0
Welche Linie ist die richtige?
)1/0(
tgidähcseB
Wir haben im Übergangsbereich (Dosis 30..50) keine Werte an denen sich die Regression orientieren
könnte. Dementsprechend unklar ist, welche Form die Regressionslinie annehmen soll: flacher
Übergang,sowiedieroteLinie,odersteilerÜbergangsowiedievioletteLinie?
WährendeineModellberechnungmitklassischenVerfahrenineinemsolchenFallfehlschlägt, werden
dankderPriorsbeimBayes-VerfahrendieParameteraufsinnvolleWerteeingeschränkt:
modell2 = stan_glm(schaden ~ dosis, data=df_separated, family=binomial(link="logit"),
seed=456, refresh=0)
coef(modell2)
(Intercept) dosis
-7.910 0.199
se(modell2) # Standardfehler
(Intercept) dosis
1.7334 0.0359
AnalogergibtsicheineAnforderungfürkategorischeunabhängigeVariable(z.B.Geschlecht,Gruppe,
Beruf): sind in einer der Kategorien nicht ausreichend Werte enthalten (Empfehlungen reichen von
min. 10-30), dann beginnt die logistische Regression instabil zu werden bzw. der Standardfehler
zuzunehmen;dieKoeﬀizientenkönnendannnichtmehrgenauodergarnichtmehrbestimmtwerden.
WeitereAnforderungen
Die Anforderungen bzw. Voraussetzungen für eine logistische Regression ähneln sich ansonsten der
linearenRegression:
1. DieabhängigeVariabledarfnurzweiWerte,nämlich0oder1annehmen
2. DieunabhängigenVariablenmüsseneineVarianzaufweisen.
3. Beobachtungen(Messwerte)derabhängigenVariablesindunabhängigvoneinander.
LVDAA,ArnoHollosi 7

TESTENDESMODELLS
4. FallsmehrereunabhängigeVariableinderRegressionsgleichungenthaltensind,dürfendiesesich
nichtgegenseitiglinearberechnenlassen(engl. multicollinearity).
5. Der Logit-Wert der Wahrscheinlichkeit 𝑃(𝑦 = 1) muss durch eine lineare Kombination der
Modelltermebeschriebenwerdenkönnen.
Testen des Modells
EsgibteinigeTests,welchemessen,obdaslogistischeRegressionsmodellerfolgreichwarbzw. fürdas
Datenset überhaupt angemessen ist. Wir greifen hier exemplarisch zwei einfach zu rechnende Tests
heraus,diestatistischeLiteraturhälteinreichhaltigesArsenalanweiterenTestsbereit.
Istlogit()diepassendeFunktion?
EinTest(basierendaufeinerIdeevonHinkley(1985)bzw. Tukey(1949))prüft,obdieLogit-Funktion
passend für unser Modell ist bzw. ob wir wesentliche Variablen vergessen haben. Er beruht auf der
einfachenIdee,mitdenvorhergesagtenWertendesModellseineneueRegressionanzusetzen. Zudem
wird noch das Quadrat der Werte aufgenommen. Wir erwarten, dass das Quadrat nicht signifikant
ist(sonstdeutetdasauffehlendeVariable, logit()alsunpassendeFunktionoderandereProblemeim
Modellhin).
# hinkley() macht Folgendes:
# y_hat = predict(modell)
# y2_hat = y_hat^2
# modell_test = glm(modell$y ~ y_hat + y2_hat, family = binomial(link = "logit"))
hinkley(modell)
Estimate Pr(>|z|)
y.hat 1.14 0.000
y.hat^2 -0.04 0.511 ok
Hinweis:derKoeﬀizientfürdiefittedvaluesselbst(𝑦̂bzw. y_hat)mussnichtnotwendigerweise
signifikant sein. Zwar würde man das erwarten (schließlich ist y_hat die Vorhersage des
Modells) aber 𝑦̂und 𝑦2̂ können eine starke Korrelation aufweisen weshalb der Koeﬀizient
für𝑦̂nichtsignifikantseinkann.
DieseBedingungistbeiunseremStrahlendosis-Beispielerfüllt. FallsderTestfehlschlägthabenwiraber
leiderkeinenHinweisdarauf,warum.
EinflussreicheBeobachtungenundLOO-Diagnostik
Auch in einer logistischen Regression kann es einflussreiche Beobachtungen geben. Das sind Punkte,
welche beispielsweise eine 0-Antwort haben, aber weit von anderen 0-Antworten entfernt sind und
mitten im typischen 1-Antwort-Wertebereich liegen (und umgekehrt). Wir können über den Umweg
der loo()-Funktion auf einflussreiche Werte testen. Wenn alle “Pareto k estimates” kleiner 0.7 sind,
liegenkeineeinflussreichenWertevor4:
mloo = loo(modell, save_psis = TRUE)
mloo
4Genauer:GroßeWertekönnenaufBeobachtungenhinweisen,derenWeglassendasModellstarkverändert. NiedrigeWerte
beweisenabernicht, dasskeineAusreißervorliegen. Pareto-kistinersterLinieeinDiagnosemaßfürdieZuverlässigkeitder
Importance-Sampling-ApproximationbeiPSIS-LOO–keinDiagnosetoolfürAusreißer,obwohlsichdashäufigdeckt.
LVDAA,ArnoHollosi 8

MODELLGÜTE
| Computed | from 4000 by | 200 log-likelihood |     | matrix. |     |     |
| -------- | ------------ | ------------------ | --- | ------- | --- | --- |
|          | Estimate     | SE                 |     |         |     |     |
| elpd_loo | -24.3 5.9    |                    |     |         |     |     |
| p_loo    | 1.6 0.6      |                    |     |         |     |     |
| looic    | 48.7 11.8    |                    |     |         |     |     |
------
| MCSE of                         | elpd_loo is   | 0.0.               |              |                  |     |     |
| ------------------------------- | ------------- | ------------------ | ------------ | ---------------- | --- | --- |
| MCSE and                        | ESS estimates | assume independent |              | draws (r_eff=1). |     |     |
| All Pareto                      | k estimates   | are good           | (k < 0.7).   |                  |     |     |
| See help('pareto-k-diagnostic') |               |                    | for details. |                  |     |     |
In unserem Datenset befindet sich (laut diesem Test) kein Outlier. Wir können uns auch einen
detailliertenPlotfüranzeigenlassen. Wertekleiner0.7sindgut,0.7bis1isteineGrauzoneundgrößer
| 1bedeutetHandlungsbedarf. |     | Hieristallesok. |     |     |     |     |
| ------------------------- | --- | --------------- | --- | --- | --- | --- |
plotpkiv(mloo)
8.0
vip
4.0
0.0
|     | 0   | 50  |     | 100 | 150 | 200 |
| --- | --- | --- | --- | --- | --- | --- |
Index
Modellgüte
Bisher haben wir untersucht, wie die logistische Regression funktioniert, wie wir die Ergebnisse
interpretierenundunterwelchenVoraussetzungenwirihrvertrauenkönnen. Aber: Wiegutistunser
Modelleigentlich? Undworanerkennenwir, obeinanderesModellbesserwäre? DreiFragendienen
unsalsOrientierung:
• WiegutpasstdasModellzudenbeobachtetenDaten?
• WiegenausindseinevorhergesagtenWahrscheinlichkeiten?
• WiegutkanndasModellzwischendenbeidenGruppenunterscheiden?
FürdenVergleichverwendenwirzweiHerzinfarkt-Modelle:
| formula(herz1)    | # unser | ursprüngliches | Modell |     |     |     |
| ----------------- | ------- | -------------- | ------ | --- | --- | --- |
| herzinfarkt       | ~ age + | sex            |        |     |     |     |
| LVDAA,ArnoHollosi |         |                |        |     |     | 9   |

| ModellvergleichundVorhersageleistung |                  |     |     | MODELLGÜTE |
| ------------------------------------ | ---------------- | --- | --- | ---------- |
| formula(herz2)                       | # mehr Variablen |     |     |            |
herzinfarkt ~ age + BMI + sex + diabetes + cigarettes + hypertension
ModellvergleichundVorhersageleistung
BeiderLinearen-RegressionhabenwirfürdenFitMaßzahlenwie𝑅2,AICetc.
|     |     |     | verwendet. | Auchfürdie |
| --- | --- | --- | ---------- | ---------- |
Pseudo-𝑅2,
logistische Regression gibt es ein das wir berechnen können. Besser ist es jedoch auf den
ELPDWertvonLOOzurückzugreifen.
| r2_m1 = bayes_R2(herz1) |                                                  |           |            |      |
| ----------------------- | ------------------------------------------------ | --------- | ---------- | ---- |
| r2_m2 = bayes_R2(herz2) |                                                  |           |            |      |
| R² (herz1)              |                                                  |           | R² (herz2) |      |
|                         | =                                                |           | =          |      |
| median                  | 0.0711                                           | median    | 0.0974     |      |
| 95% HDI                 |                                                  | 95% HDI   |            |      |
| 0.0506                  | 0.0926                                           | 0.0732    | 0.122      |      |
| 0.04 0.06               | 0.08 0.10                                        | 0.06 0.08 | 0.10 0.12  | 0.14 |
| Miteinem𝑅2              | < 0.1sindbeideModellenichtsonderlichberauschend. |           |            |      |
loo1 = loo(herz1)
loo2 = loo(herz2)
| loo_compare(loo1, | loo2) |     |     |     |
| ----------------- | ----- | --- | --- | --- |
elpd_diff se_diff
| herz2 0.0   | 0.0 |     |     |     |
| ----------- | --- | --- | --- | --- |
| herz1 -15.1 | 7.1 |     |     |     |
Wirsehen,dasszwischenbeidenModellennureingeringerUnterschiedist,wobeidieELPD-Differenz
vonloo_compare()zeigt,dassdaszweiteModelldieNase(knapp)vornehat.
Genauigkeit
DiezweiteFrageist,wiegenausinddievorhergesagtenWahrscheinlichkeitendesModells. Wirschauen
unsdazudenBrier-Scorean: ermisstdieAbweichungdervorhergesagtenWahrscheinlichkeitenzuden
echten Antworten. Je kleiner also der Score ist, desto besser das Modell, 𝐵𝑟𝑖𝑒𝑟 = 0 wären perfekte
| Vorhersagen. DiedaatoolshabeneineentsprechendeFunktion: |     |     |     |     |
| ------------------------------------------------------- | --- | --- | --- | --- |
b1 = brier(herz1)
b2 = brier(herz2)
LVDAA,ArnoHollosi 10

Genauigkeit MODELLGÜTE
herz1 herz2
Modell 0.120 0.117
Null-Modell 0.129 0.129
Ist𝐵𝑟𝑖𝑒𝑟 = 0.12(Modell1)bzw. 𝐵𝑟𝑖𝑒𝑟 = 0.117(Modell2)nungutoderschlecht? Wirsehen,dass
unsdieFunktionaucheinenWertfürdassogenannteNullmodellausgibt. DasNullmodellsagteinfach
den Mittelwert der Wahrscheinlichkeit vorher, ist also ein sehr einfaches Modell. Beispiel: Bei einem
1
Datensatzmit500Zeilen,vondenen100xderpositive(=1)Fallvorkommt,istderMittelwert unddas
5
Nullmodell würde immer 20% Wahrscheinlichkeit vorhersagen. In unserem Fall hat das Nullmodell
einenWertvon𝐵𝑟𝑖𝑒𝑟 = 0.129. Nichtallzuweitentfernt. Esscheintalso,alswürdedasModellnicht
vielerklären.
Wir könnten noch einen Skill-Wert berechnen: 𝐵𝑆𝑆 = 1 − 𝐵𝑟𝑖𝑒𝑟 𝑀𝑜𝑑𝑒𝑙𝑙 . Der ist positiv, wenn das
𝐵𝑟𝑖𝑒𝑟
𝑁𝑢𝑙𝑙𝑚𝑜𝑑𝑒𝑙𝑙
Modell besser als das Nullmodell ist und wir maximal 1. Bei uns ergäbe das einen Skill-Score von ca.
0.06fürModell1undca. 0.09fürModell2. AuchdaskeineberauschendenWerte.
WiesiehtesmitderGenauigkeitaufeinenneuenTest-Datensatzaus?
b1n = brier(herz1, newdata = heart_test)
b2n = brier(herz2, newdata = heart_test)
herz1 herz2
Modell 0.120 0.117
Null-Modell 0.129 0.129
NewData 0.123 0.118
Wir sehen, dass auf dem vorhergesagten Datensatz – mit Werten von 0.123 (Modell 1) bzw. 0.118
(Modell2)–derBrier-Scoreleichtschlechterist. Dasistaberzuerwarten. Gutist,dasssichderScore
nichtdeutlichverschlechterthat.
In Summe, da die Verbesserung gegenüber dem Null-Modell so gering ist, attestieren wir unserem
ModellkeineguteGenauigkeit. DieserBefundstimmtalsomitdemPseudo-𝑅2ausdemvorhergehenden
Schrittüberein.
KalibrierungdervorhergesagtenWahrscheinlichkeiten
Der Brier-Score gibt uns also eine Maßzahl für die Qualität der vorhergesagten Wahrscheinlichkeiten.
Wir können auch grafisch überprüfen, ob unser Modell die Wahrscheinlichkeiten richtig einschätzt.
DazuverwendenwireinensogenanntenKalibrierungsplot:
pred_heart = predict(herz2, newdata=heart_test, type="response")
rms::val.prob(pred_heart, heart_test$herzinfarkt, statloc=FALSE)
LVDAA,ArnoHollosi 11

UnterscheidungzwischenGruppen MODELLGÜTE
0.0 0.2 0.4 0.6 0.8 1.0
0.1
8.0
6.0
4.0
2.0
0.0
Predicted Probability
ytilibaborP
lautcA
Ideal
Logistic calibration
Nonparametric
Auf der X-Achse sehen wir die vom Modell vorhergesagte Wahrscheinlichkeit, auf der Y-Achse die
tatsächlich beobachtete Häufigkeit. Wenn unser Modell beispielsweise für eine Gruppe von Personen
ein Herzinfarktrisiko von 20 % vorhersagt, sollten ungefähr 20 % dieser Personen tatsächlich einen
Herzinfarkterleiden.
Die hellgraue Diagonale (Ideal) zeigt uns eine perfekte Kalibrierung. Die Kurve Nonparametric
(gestrichelt) schätzt den tatsächlichen Zusammenhang aus unseren Daten, ohne eine bestimmte
Kurvenform vorzugeben. Die Logistic calibration (durchgezogene Linie) verwendet dagegen eine
logistischeFunktion,umdiesenZusammenhangzubeschreiben.
JenäherdieKurvenanderDiagonaleliegen,destobessersindunserevorhergesagtenWahrscheinlichkeiten
kalibriert. Liegt eine Kurve unterhalb der Diagonale, überschätzt unser Modell das Risiko; liegt sie
oberhalb,unterschätztesdasRisiko.
Wichtigist,dasswirhierdieTestdatenverwenden: Wirwollenschließlichwissen,wiegutunserModell
Wahrscheinlichkeitenfürneue,bisherunbekanntePersonenvorhersagt. InsbesondereinBereichenmit
wenigenBeobachtungenkönnendieKalibrierungskurvenallerdingsrechtunsichersein.
UnterscheidungzwischenGruppen
Selbst wenn unser Modell keine gute Vorhersage der (absoluten) Wahrscheinlichkeit liefert, könnte
es immer noch so sein, dass es gut in der Lage ist zwischen negativen und positiven Antworten zu
unterscheiden (zu diskriminieren). Denn wenn bspw. die negativen Fälle (also kein Herzinfarkt)
überwiegend mit einer Wahrscheinlichkeit <10% und die positiven Fälle überwiegend im Bereich
20..30%vorhergesagtwürden,dannkönntenwirdieGruppenjasaubertrennen.
EinhilfreichesDiagrammistdieReceiverOperatingCharacteristic(ROC-Kurve):
LVDAA,ArnoHollosi 12

UnterscheidungzwischenGruppen MODELLGÜTE
ROC−Kurve
False positive rate
etar
evitisop
eurT
0.0 0.2 0.4 0.6 0.8 1.0
0.1
8.0
6.0
4.0
2.0
0.0
15.0
72.0
20.0
AUC: 0.728
Die Fläche unter der Kurve stellt ein Maß für die Diskriminierungsfähigkeit unseres Modells dar: je
größer die Fläche unter der Kurve, desto besser ist das Modell. Der Wert AUC (area under curve;
Wertebereich0..1)gibtunseineMaßzahldafür. AUC=0.73bedeutet,dassdasModellbeieinemzufällig
ausgewählten Paar aus einer Person mit und einer ohne Herzinfarkt mit 73 % Wahrscheinlichkeit der
PersonmitHerzinfarktdiehöhereRisikoprognosezuordnet. ZumVergleich: Modell1hat𝐴𝑈𝐶 = 0.7.
Wie entsteht diese Kurve? Wie eingangs erwähnt, geht es um Diskriminierung zwischen den beiden
Gruppen. Wenn wir also Vorhersagen bzw. Entscheidungen auf Basis der Regression treffen wollen,
müssen wir einen Schwellwert festlegen, ab dem wir das Ergebnis dem 0- bzw. 1-Fall zuschlagen.
TypischerweisewirddazuderWert0.5verwendet: 𝑝 ≥ 0.5wirdals𝑦 = 1interpretiert,𝑝 < 0.5wird
als 𝑦 = 0 interpretiert. Aber je nach Modell und Aufgabenstellung, kann ein anderer Schwellenwert
bessersein.
Auf dieser Basis können wir auch eine einfache Tabelle erstellen, wie gut unser Modell die Gruppen
trennt (kritisch/unauffällig ist die Vorhersage unseres Modells, Infarkt/Gesund der tatsächliche Wert
im Datenset). Die Tabelle zeigt die Ergebnisse für die Schwellwerte 0.1, 0.25, 0.5 und 0.7 für den
Testdatensatz5:
Schwellwert=0.1 Schwellwert=0.25 Schwellwert=0.5 Schwellwert=0.7
kritisch unauffällig kritisch unauffällig kritisch unauffällig kritisch unauffällig
Infarkt 152 26 81 97 8 170 0 178
Gesund 572 406 150 828 5 973 0 978
DieersteZeile(Infarkt)zeigtunsdieVerteilungfürPersonen,dietatsächlicheinenHerzinfarkterlitten
haben. BeieinemSchwellwertvon0.1weisenwirdieModellvorhersagenebenfalls152xeinemInfarkt
zu, 26x sagen wir den Infarkt nicht vorher (“sicher”). Je höher der Schwellwert, desto weniger echte
Infarktesagenwirvorher,biswirletztlichkeinenInfarktmehrrichtigvorhersagen.
Analog zeigt uns die zweite Zeile (Gesund) die Verteilung für Personen, die in Wirklichkeit keinen
Herzinfarkt hatten. Bei einem Schwellwert von 0.1 weisen wir noch 572x fälschlicherweise einen
Herzinfarktaus(“kritisch”),406xordnenwirrichtigerweisekeinenInfarktzu. JehöherderSchwellwert,
destobesserunsereVorhersage,biswirletztlichalleGesundenalsgesundvorhersagen.
5TestdatensindindiesemZusammenhangaussagekräftigeralsTrainingsdaten
LVDAA,ArnoHollosi 13

| UnterscheidungzwischenGruppen |     |     |     |     |     |     |     | MODELLGÜTE |     |
| ----------------------------- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- |
WirkönnendasauchalsDiagrammefüralleSchwellwerteaufzeichnen. IstderSchwellwertkleinsagen
wiralleechtenInfarkterichtigvorher(“Infarkt/kritisch”). Leidersagenwirdannauchallegesunden
Personen als Infarkte vorher (“Gesund/kritisch”). Je höher der Schwellwert, desto besser unsere
Vorhersage der Gesunden (“Gesund/sicher”), weil bei hohem Schwellwert letztlich alle Vorhersagen
unterhalb liegen und als gesund vorhergesagt werden. Leider trifft das dann auch auf die echten
Infarktezu: auchdortsagenwirvorher,dasssiegesundbleiben(“Infarkt/sicher”). Wiewirerkennen
können, sind die Diagramme auf der linken Seite komplementär zu den Diagrammen der rechten
Seite: das ist nur logisch, denn es gilt immer Infarkt + Infarkt = Infarkt und
|        |          |         |                  |          |        | 𝑘𝑟𝑖𝑡𝑖𝑠𝑐ℎ | 𝑠𝑖𝑐ℎ𝑒𝑟              | 𝑔𝑒𝑠𝑎𝑚𝑡 |     |
| ------ | -------- | ------- | ---------------- | -------- | ------ | -------- | ------------------- | ------ | --- |
| Gesund |          | +Gesund |                  | = Gesund | .      |          |                     |        |     |
|        | 𝑘𝑟𝑖𝑡𝑖𝑠𝑐ℎ |         | 𝑠𝑖𝑐ℎ𝑒𝑟           |          | 𝑔𝑒𝑠𝑎𝑚𝑡 |          |                     |        |     |
|        |          |         | Infarkt/kritisch |          |        |          | Infarkt/unauffällig |        |     |
|        | 150      |         |                  |          |        | 150      |                     |        |     |
|        | 100      |         |                  |          |        | 100      |                     |        |     |
|        | 50       |         |                  |          |        | 50       |                     |        |     |
|        | 0        |         |                  |          |        | 0        |                     |        |     |
lhaznA
|     |      |     | Gesund/kritisch |     |     |      | Gesund/unauffällig |     |     |
| --- | ---- | --- | --------------- | --- | --- | ---- | ------------------ | --- | --- |
|     | 1000 |     |                 |     |     | 1000 |                    |     |     |
|     | 750  |     |                 |     |     | 750  |                    |     |     |
|     | 500  |     |                 |     |     | 500  |                    |     |     |
|     | 250  |     |                 |     |     | 250  |                    |     |     |
|     | 0    |     |                 |     |     | 0    |                    |     |     |
|     | 0.0  | 0.2 |                 | 0.4 | 0.6 | 0.0  | 0.2                | 0.4 | 0.6 |
Schwellwert
Wir sehen also, dass bei der Wahl eines Schwellwerts immer ein Trade-off vorhanden ist: Nämlich ob
wir die Risikopatient*innen richtig vorhersagen wollen oder ob wir möglichst die Gesunden richtig
vorhersagen wollen. Je besser unser Modell, umso besser gelingt uns diese Trennung. Wenn wir
uns nun nochmal die ROC-Kurve von oben ansehen, dann sehen wir, dass die true positive rate (TPR,
Sensitivität), die Y-Achse, unseren Infarkt/kritisch-Werten entspricht (normiert auf den Bereich 0..1);
diefalsepositiverate(FPR,KomplementzurSpezifität),dieX-Achse,entsprichtunserenGesund/kritisch-
Werten(ebenfallsnormiertaufdenBereich0..1). DieROCkombiniertalsoSchwellwert(überFarben)
undQualitätderDiskriminierungunseresModellsperTPRundFPR.
| Beispiel: | SchulerfolginPortugal |     |     |     |     |     |     |     |     |
| --------- | --------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
Am Beispiel eines Datensatzes zu Schulerfolg von Cortez & Silva (2008) wollen wir uns eine weitere
ROC-Kurve ansehen. Es handelt sich um einen Datensatz von 649 Schüler*innen, von denen 549 die
Abschlussprüfunggeschaffthaben,100leidernicht6
# https://archive.ics.uci.edu/dataset/320/student+performance
school = read.csv("daten/student-por.csv", sep=";", stringsAsFactors = TRUE)
# Y=Fehlversuch, damit ähnlich wie bei Herzinfarkt, der "böse" Fall gleich 1 ist.
| school$failed |     | = ifelse(school$G3 |     |     | < 10, 1, 0) |     |     |     |     |
| ------------- | --- | ------------------ | --- | --- | ----------- | --- | --- | --- | --- |
6WirverwendenbeidiesemBeispieldieTrainingsdaten,nichtdieTestdatenfürdieAnalyse,weilwirkeinenTrain-/Test-Split
durchführen. ImAllgemeinenistesbesser,dieseAnalysenaufdenTestdatendurchzuführen,esseidenn,manwilldasModell
nurbeschreiben,nichtbewerten.
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     | 14  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

| UnterscheidungzwischenGruppen |     |     |     | MODELLGÜTE |     |
| ----------------------------- | --- | --- | --- | ---------- | --- |
fehlversuch = stan_glm(failed ~ school + failures + higher + absences + guardian + age,
|     | data=school, | family=binomial, | seed=1234, | refresh=0) |     |
| --- | ------------ | ---------------- | ---------- | ---------- | --- |
Wirverwendenwieder“kritisch&sicher”fürdieModellvorhersagenundfürdierealenErgebnisseim
Datensatzverwendenwir“Fehlversuch&Erfolg”. UntensehenwirwiederdievierDiagrammeunddie
ROC.Miteiner𝐴𝑈𝐶 = 0.85istdasModellrechtbrauchbar: in85%allerFälleweistesdemFehlversuch
ineinemErfolg-&Fehlversuch-PaardiehöhereWahrscheinlichkeitfüreinenFehlversuchzu.
Wir haben einen Punkt eingezeichnet, als Lesebeispiel: wenn 0.42 TPR gefordert ist (Modell sagt
richtigerweise 42 von 100 Fehlschläge als kritisch vorher [rote Linie]), dann ergibt das ca. 0.05 FPR
(Modell sagt falsch 25 von 549 Erfolge als kritisch vorher [blaue Linie]). Die Farbe entspricht dem
| Schwellwert(Cutoff)vonca. | 0.42[grüneLinie]. |      |           |                    |      |
| ------------------------- | ----------------- | ---- | --------- | ------------------ | ---- |
|                           | Erfolg/kritisch   |      |           | Erfolg/sicher      |      |
| 400                       |                   |      | 400       |                    |      |
| 200                       |                   |      | 200       |                    |      |
| lhaznA 0                  |                   |      | 0         |                    |      |
| Fehlversuch/kritisch      |                   |      |           | Fehlversuch/sicher |      |
| 100                       |                   |      | 100       |                    |      |
| 75                        |                   |      | 75        |                    |      |
| 50                        |                   |      | 50        |                    |      |
| 25                        |                   |      | 25        |                    |      |
| 0                         |                   |      | 0         |                    |      |
| 0.00 0.25                 | 0.50              | 0.75 | 0.00 0.25 | 0.50               | 0.75 |
Schwellwert
ROC−Kurve
0.1
67.0
8.0
etar evitisop eurT
6.0
| 4.0 |     |     |     |     | 83.0 |
| --- | --- | --- | --- | --- | ---- |
2.0
AUC: 0.854
10.0
0.0
| 0.0 | 0.2 | 0.4 | 0.6 | 0.8 | 1.0 |
| --- | --- | --- | --- | --- | --- |
False positive rate
GenaueZahlenkönnenmitderFunktionlogistic_rates()berechnetwerden:
| LVDAA,ArnoHollosi |     |     |     |     | 15  |
| ----------------- | --- | --- | --- | --- | --- |

ZUSAMMENFASSUNG
logrates = logistic_rates(fehlversuch)
| logrates[sum(logrates$true.positive.rate |                     | <= 0.42)+(-1:1),1:3] |
| ---------------------------------------- | ------------------- | -------------------- |
| cutoff true.positive.rate                | false.positive.rate |                      |
| 61 0.413                                 | 0.42                | 0.0510               |
| 62 0.412                                 | 0.42                | 0.0528               |
| 63 0.394                                 | 0.43                | 0.0528               |
dasModellhatein𝑅2
DerVollständigkeithalber: = 0.29undeinenBrier-Scorevon0.097(Nullmodell:
0.13). DerHinkley-Testistnegativ→damüsstenwirgenauernachsehen,warum.
Zusammenfassung
DasGeneralizedLinearModelerweitertdieMöglichkeitenderRegression: binäreabhängigeVariablemit
derlogistischenRegressionundZählvariablen(z.B.AnzahlderGoldmedaillenbeiderOlympiade)mit
derPoisson-RegressionsindzweitypischeRegressionendiemitdemGLMgerechnetwerdenkönnen.
BeideRegressionsartengehörenzumStandard-RepertoirederStatistikundsindvielfältigeinsetzbar.
Dennoch: wenn Sie die Wahl haben, eine metrische Variable zu erfassen, dann sollten Sie dieser
Variante den Vorzug geben. Wenn Sie nämlich eine metrische Variable auf eine binäre Entscheidung
reduzieren, gehen Informationen verloren. Am Schulerfolg-Beispiel: besser die Punkteanzahl bei der
Abschlussprüfungvorhersagen,alsaufdieEntscheidungBestandenja/neinmitlogistischerRegression
zureduzieren.
LVDAA,ArnoHollosi 16

ANHANG:LOGIT
| Anhang: | logit |     |     |     |     |     |     |     |
| ------- | ----- | --- | --- | --- | --- | --- | --- | --- |
DieWahrscheinlichkeitdeckteinenWertebereichvon0..100%ab. DieChancen(odds)deckendagegen
einen Wertebereich von 0..+Inf ab. Beispiel: eine Wahrscheinlichkeit von 99.999% entspricht einer
Chance von 99999:1. Nimmt man nun den Logarithmus der Chance, den “Log-Odds” oder Logit, ist
derWertebereich-Inf..+Inf.
𝑝(𝑦)
|     |     |     |     | 𝑙𝑜𝑔𝑖𝑡(𝑦) | = 𝑙𝑜𝑔( | )   |     |     |
| --- | --- | --- | --- | -------- | ------ | --- | --- | --- |
1−𝑝(𝑦)
Beispiel: ein𝑝(𝑦) = 0.333entsprichteinem𝑜𝑑𝑑𝑠(𝑦) = 1/2undeinem𝑙𝑜𝑔𝑖𝑡(𝑦) = −0.69;ein𝑝(𝑦) =
| 0.8entsprichteinem𝑜𝑑𝑑𝑠(𝑦) |     |     | = 4/1undeinem𝑙𝑜𝑔𝑖𝑡(𝑦) |     | =   | 1.39. |     |     |
| ------------------------- | --- | --- | --------------------- | --- | --- | ----- | --- | --- |
𝑝(𝑦) = 0.5
Die Logit-Funktion hat zwei wesentliche Eigenschaften: (1) sie hat bei ihren Nullpunkt
|     | 𝑙𝑜𝑔𝑖𝑡(𝑦) | = −𝑙𝑜𝑔𝑖𝑡(1 | −   | 𝑦), |     |     |     |     |
| --- | -------- | ---------- | --- | --- | --- | --- | --- | --- |
und (2) d.h. die Funktion ist symmetrisch. Die folgenden Diagramme
veranschaulichennochmaldieZusammenhänge:
|      |     | Lineares Modell |     |     |      | Odds / (Wett−)Chance |     |     |
| ---- | --- | --------------- | --- | --- | ---- | -------------------- | --- | --- |
|      | 8.0 |                 |     |     | 8.0  |                      |     |     |
| )y(p |     |                 |     |     | )y(p |                      |     |     |
|      | 4.0 |                 |     |     | 4.0  |                      |     |     |
+Inf
|     | 0.0     |     |     |     | 0.0 |      |           |        |
| --- | ------- | --- | --- | --- | --- | ---- | --------- | ------ |
|     | 0.0 0.2 | 0.4 | 0.6 | 0.8 | 1.0 | 0 20 | 40 ( ) 60 | 80 100 |
p y
1- ( )
|     |     |     | p(y) |     |     |     | p y |     |
| --- | --- | --- | ---- | --- | --- | --- | --- | --- |
Logit / log(odds)
p(y) ... Wahrscheinlichkeit (in %), dass y=1
−Inf
|     | 8.0 |     |     |     |     | p ( y | )   |     |
| --- | --- | --- | --- | --- | --- | ----- | --- | --- |
( )=
|      |     |     |     |     |     | odds y | [0..+Inf] |     |
| ---- | --- | --- | --- | --- | --- | ------ | --------- | --- |
|      |     |     |     |     |     | 1-     | ( )       |     |
| )y(p |     |     |     |     |     | p      | y         |     |
|      | 4.0 |     |     |     | AN  |        |           |     |
( )
p y
|     |     |     |     | +Inf |     | ( )=log ( | )            |     |
| --- | --- | --- | --- | ---- | --- | --------- | ------------ | --- |
|     |     |     |     |      |     | logit y   | [−Inf..+Inf] |     |
1- p ( y )
0.0
|     | −4  | −2  | p ( y ) | 2 4 |     |     |     |     |
| --- | --- | --- | ------- | --- | --- | --- | --- | --- |
|     |     |     | (       | )   |     |     |     |     |
log
|     |     |     | 1- ( ) |     |     |     |     |     |
| --- | --- | --- | ------ | --- | --- | --- | --- | --- |
|     |     |     | p y    |     |     |     |     |     |
WieausdemdrittenDiagrammersichtlich,istdieLogit-Funktionnichtlinear: eineÄnderungum1auf
der X-Achse hat nicht überall dieselbe Änderung auf der Y-Achse zur Folge. Zum Beispiel bei einer
Änderungvon𝑥 = −0.5auf𝑥 = 0.5istΔ ≈ 0.25,aberbeieinerÄnderungvon𝑥 NA = 3auf𝑥 = 4
𝑝(𝑦)
| istΔ | ≈ 0.03. |     |     |     |     |     |     |     |
| ---- | ------- | --- | --- | --- | --- | --- | --- | --- |
𝑝(𝑦)
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     | 17  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- |