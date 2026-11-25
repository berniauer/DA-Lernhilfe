<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Beispielklausur WS2627.pdf -->

|     | Beispielklausur |     |     | WS26/27 |     |     |     |     |
| --- | --------------- | --- | --- | ------- | --- | --- | --- | --- |
ArnoHollosi
Ein Halbleiterhersteller untersucht Produktionsfehler in einem kritischen Prozessschritt. Ziel ist es,
fehlerhafteEinheitenfrühzeitigzuerkennen,bevorsieinnachfolgendeProduktionsschrittegelangen.
FolgendeDatenliegenvor:
• defect…obeineEinheitfehlerhaftist(1=ja,0=nein)
pressure…ProzessdruckimkritischenProzessschritt(mTorr)
•
• temperature…TemperaturamkritischenProzessschritt(°C)
• humidity…relativeLuftfeuchtigkeitimrelevantenProduktionsbereich(%)
• exposure_time…Belichtungs-bzw. BearbeitungszeitimProzessschritt(Sekunden)
line_speed…Transport-/Liniengeschwindigkeit(mm/s)
•
• machine…verwendeteProduktionsanlage
• shift…Produktionsschicht
| 1. Übersicht     | über Datensatz |           |       |         |      |     |     |     |
| ---------------- | -------------- | --------- | ----- | ------- | ---- | --- | --- | --- |
|                  | mean           | sd median | min   | max na  | neg0 |     |     |     |
| defect           | 0.25 0.43      | 0.00      | 0.00  | 1.0 0   | 2622 |     |     |     |
| pressure         | 75.47 8.28     | 75.70     | 46.60 | 102.9 0 | 0    |     |     |     |
| temperature      | 22.65 1.13     | 22.60     | 18.40 | 27.1 0  | 0    |     |     |     |
| humidity         | 44.62 4.59     | 44.50     | 30.00 | 60.0 0  | 0    |     |     |     |
| exposure_time    | 1.05 0.07      | 1.05      | 0.79  | 1.3 0   | 0    |     |     |     |
| line_speed       | 110.06 15.58   | 110.20    | 70.00 | 160.0 0 | 0    |     |     |     |
| machine          | shift          |           |       |         |      |     |     |     |
| M1: 738          | Day: 1768      |           |       |         |      |     |     |     |
| M2: 849 Evening: | 1143           |           |       |         |      |     |     |     |
| M3: 683          | Night: 589     |           |       |         |      |     |     |     |
M4: 674
M5: 556
Korrelation:
|               | defect pressure | temperature |        | humidity | exposure_time |        | line_speed |        |
| ------------- | --------------- | ----------- | ------ | -------- | ------------- | ------ | ---------- | ------ |
| defect        | 1.00            | 0.407       | 0.238  | 0.154    |               | -0.331 |            | 0.339  |
| pressure      | 0.41            | 1.000       | 0.627  | 0.068    |               | -0.276 |            | 0.316  |
| temperature   | 0.24            | 0.627       | 1.000  | -0.357   |               | -0.088 |            | 0.056  |
| humidity      | 0.15            | 0.068       | -0.357 | 1.000    |               | -0.079 |            | 0.050  |
| exposure_time | -0.33 -0.276    |             | -0.088 | -0.079   |               | 1.000  |            | -0.680 |
| line_speed    | 0.34            | 0.316       | 0.056  | 0.050    |               | -0.680 |            | 1.000  |
• WelcheInformationenüberdieEntstehungundAuswahlderDatenbenötigenSie,umbeurteilen
zukönnen,obderDatensatzfürdenProduktionsbetriebrepräsentativist?
1

2. ERSTESMODELL
• Warum könnte ein Modell, das auf diesen Daten gute Ergebnisse erzielt, bei einer neuen
ProduktionsanlageschlechteVorhersagenliefern?
• WelcheKonsequenzenhättees,wenneineVariableerstnachdemVorhersagezeitpunktgemessen
wurde?
• DieDatenzeigeneinenZusammenhangzwischenDruck(pressure)undDefektrate(defect):
– Können wir daraus schließen, dass eine Änderung des Drucks die Defektrate beeinflusst?
BegründenSie.
– WelcheRollekönntendieVariablenmachineundshiftbeidiesemZusammenhangspielen?
– Wie könnten Sie untersuchen, ob eine gezielte Änderung des Drucks tatsächlich die
Defektratesenkt?
| 2. Erstes | Modell |     |     |     |     |     |     |     |     |
| --------- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
• Basisfall?
• InterpretierenSie2metrischeKoeﬀizienten
• Maschinen: IstM1dieMaschinemitdergeringstenundM5dieMaschinemitgrößterDefektrate?
• InterpretierenSiedenKoeﬀizientenfürdieNachtschicht. WelcheAussagenlassensichtreffen?
• WaskönnenSiezurGütedesModellssagen?
• WarumkönnteeinezufälligeAufteilungderTraining-undTestdatenzueinerzuoptimistischen
EinschätzungderzukünftigenVorhersagegüteführen?
• Welche andere Aufteilung würden Sie empfehlen, wenn das Modell Defekte in zukünftigen
Produktionswochenvorhersagensoll?
• Wie würden Sie überprüfen, ob das Modell für alle Produktionsanlagen und Schichten ähnlich
zuverlässigfunktioniert?
ErstesModell:
| # Sampling | funktioniert |     | gut |     |     |     |     |     |     |
| ---------- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
m1 = stan_glm(defect ~ pressure + temperature + humidity + exposure_time +
|     |     |                | line_speed |                  | + machine | +   | shift,     |     |     |
| --- | --- | -------------- | ---------- | ---------------- | --------- | --- | ---------- | --- | --- |
|     |     | data=df_train, |            | family=binomial, |           |     | refresh=0) |     |     |
info(m1)
|                           |     | median   |           | mad       | lwr      | upr    | mcse | n_eff | Rhat |
| ------------------------- | --- | -------- | --------- | --------- | -------- | ------ | ---- | ----- | ---- |
| (Intercept)               |     | -24.05   | 2.22      |           | -28.41   | -19.83 | 0.04 | 3255  | 1    |
| pressure                  |     |          | 0.08 0.01 |           | 0.06     | 0.10   | 0.00 | 3303  | 1    |
| temperature               |     |          | 0.46 0.07 |           | 0.34     | 0.60   | 0.00 | 2954  | 1    |
| humidity                  |     |          | 0.11 0.01 |           | 0.08     | 0.13   | 0.00 | 3821  | 1    |
| exposure_time             |     | -5.20    | 0.98      |           | -7.14    | -3.30  | 0.02 | 3983  | 1    |
| line_speed                |     |          | 0.05 0.00 |           | 0.04     | 0.06   | 0.00 | 3371  | 1    |
| machineM2                 |     |          | 0.09 0.17 |           | -0.27    | 0.40   | 0.00 | 2366  | 1    |
| machineM3                 |     |          | 0.89 0.16 |           | 0.56     | 1.23   | 0.00 | 2411  | 1    |
| machineM4                 |     |          | 1.43 0.17 |           | 1.08     | 1.75   | 0.00 | 2432  | 1    |
| machineM5                 |     |          | 1.59 0.18 |           | 1.24     | 1.96   | 0.00 | 2756  | 1    |
| shiftEvening              |     |          | 0.80 0.11 |           | 0.58     | 1.03   | 0.00 | 4452  | 1    |
| shiftNight                |     |          | 1.41 0.14 |           | 1.14     | 1.69   | 0.00 | 4307  | 1    |
| mean_PPD                  |     |          | 0.25 0.01 |           | 0.24     | 0.27   | 0.00 | 4757  | 1    |
| log-posterior             |     | -1341.57 | 2.35      | -1347.07  | -1337.96 |        | 0.06 | 1639  | 1    |
| print(mean(bayes_R2(m1)), |     |          |           | digits=2) |          |        |      |       |      |
[1] 0.37
LVDAA,ArnoHollosi 2

2. ERSTESMODELL
ROC(m1)
ROC−Kurve
0.1
1
|     | 8.0 |     |     |     |     |     |     |     |     | 8.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
etar evitisop eurT
|     | 6.0 |     |     |     |     |     |     |     |     | 6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | 4.0 |     |     |     |     |     |     |     |     | 4.0 |
|     | 2.0 |     |     |     |     |     |     |     |     | 2.0 |
AUC: 0.86
0.0
0
|     |     | 0.0 |     | 0.2 |     | 0.4 |     | 0.6 | 0.8 | 1.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
False positive rate
| prediction_metrics(m1, |            |                  |                | newdata=df_test) |           |           |             |     |     |     |
| ---------------------- | ---------- | ---------------- | -------------- | ---------------- | --------- | --------- | ----------- | --- | --- | --- |
|                        | Dataset    |                  | n              | Brier            | LogLoss   |           | Skill       |     |     |     |
|                        | 1 Training |                  | 3500 0.1145429 |                  | 0.3780214 | 0.3904951 |             |     |     |     |
|                        | 2 New      | data             | 1500 0.1094334 |                  | 0.3792729 | 0.4090285 |             |     |     |     |
| ROC(m1,                |            | newdata=df_test, |                | main="ROC        |           | für       | Testdaten") |     |     |     |
ROC für Testdaten
99.0
0.1
8.0
etar evitisop eurT
|     | 6.0 |     |     |     |     |     |     |     |     | 6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | 4.0 |     |     |     |     |     |     |     |     | 4.0 |
|     | 2.0 |     |     |     |     |     |     |     |     | 2.0 |
AUC: 0.86
0.0
0
|     |     | 0.0 |     | 0.2 |     | 0.4 |     | 0.6 | 0.8 | 1.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
False positive rate
effectsize(m1)
|     | Effect | size | by term | (incl. | interactions) |     |     |     |     |     |
| --- | ------ | ---- | ------- | ------ | ------------- | --- | --- | --- | --- | --- |
Model:
|     | defect     | ~ pressure | +         | temperature |         | + humidity | + exposure_time |     | +   |     |
| --- | ---------- | ---------- | --------- | ----------- | ------- | ---------- | --------------- | --- | --- | --- |
|     | line_speed |            | + machine |             | + shift |            |                 |     |     |     |
LVDAA,ArnoHollosi 3

4. ZWEITESMODELLMIT“REFERENZPUNKT”
|               |     | Df Deviance |        | AIC           |     |     |     |
| ------------- | --- | ----------- | ------ | ------------- | --- | --- | --- |
| <none>        |     |             | 2647.1 | 2671.1        |     |     |     |
| exposure_time |     | 1           | 2674.4 | 2696.4        |     |     |     |
| temperature   |     | 1           | 2695.0 | 2717.0        |     |     |     |
| humidity      |     | 1           | 2716.6 | 2738.6        |     |     |     |
| pressure      |     | 1           | 2726.1 | 2748.1        |     |     |     |
| line_speed    |     | 1           | 2754.6 | 2776.6        |     |     |     |
| shift         |     | 2           | 2766.1 | 2786.1        |     |     |     |
| machine       |     | 4           | 2815.6 | 2831.6        |     |     |     |
| 3. Defektrate |     | abhängig    |        | von Variablen |     |     |     |
ImTest-DatensatzsehenwirfolgendenZusammenhangeinzelnerVariablenmitderDefektrate:
Interpretieren Sie die Diagramme. Was bedeutet das im Zusammenhang mit den Koeﬀizienten des
Modells? WasschließenSiedaraus? KannmandiesenSchlussverlässlichziehen?
1.00
1.00
etartkefeD etartkefeD
| 0.75            |     |               |     | 0.75            |     |          |           |
| --------------- | --- | ------------- | --- | --------------- | --- | -------- | --------- |
| 0.50            |     |               |     | 0.50            |     |          |           |
| 0.25            |     |               |     | 0.25            |     |          |           |
|                 |     | 20            | 22  | 24 26           |     | 40       | 50        |
|                 |     | temperature   |     |                 |     | humidity |           |
| 1.00            |     |               |     | 1.00            |     |          |           |
| etartkefeD 0.75 |     |               |     | etartkefeD 0.75 |     |          |           |
| 0.50            |     |               |     | 0.50            |     |          |           |
| 0.25            |     |               |     | 0.25            |     |          |           |
|                 | 0.8 | 1.0           |     | 1.2             | 50  | 60 70    | 80 90 100 |
|                 |     | exposure_time |     |                 |     | pressure |           |
| 4. Zweites      |     | Modell        | mit | “Referenzpunkt” |     |          |           |
In der Halbleiterfertigung sind nicht nur hohe oder niedrige Werte relevant, sondern vor allem
AbweichungenvoneinemstabilenProzessfenster.
FolgendeZielwertesindfestgelegt:
• pressure=75
• temperature=22.5
• humidity=45
• exposure_time=1.05
• line_speed=110
DaszweiteModellberücksichtigtquadratischeAbweichungenvondiesenZielwerten.
LVDAA,ArnoHollosi 4

4. ZWEITESMODELLMIT“REFERENZPUNKT”
• VergleichenSiedasModellmitdemModellausSchritt1.
• IstdaszweiteModellbessergeeignet?
• WelcheAbweichungscheintbesondersstarkmitProduktionsfehlernverbundenzusein?
• WassolltenwirbeiderEffektgrößeberücksichtigen?
• Welche Annahme treffen beide Modelle hinsichtlich des Einflusses der Luftfeuchtigkeit auf die
verschiedenenMaschinen?
| df$pressure2      | =   | (df$pressure        | - 75)^2 |           |     |     |     |     |
| ----------------- | --- | ------------------- | ------- | --------- | --- | --- | --- | --- |
| df$temperature2   |     | = (df$temperature   |         | - 22.5)^2 |     |     |     |     |
| df$humidity2      | =   | (df$humidity        | - 45)^2 |           |     |     |     |     |
| df$exposure_time2 |     | = (df$exposure_time |         | - 1.05)^2 |     |     |     |     |
| df$line_speed2    |     | = (df$line_speed    |         | - 110)^2  |     |     |     |     |
m2 = update(m1, ~ . + pressure2 + temperature2 + humidity2 + exposure_time2 + line_speed2)
info(m2)
|                           |     | median   | mad       | lwr               | upr    | mcse | n_eff | Rhat |
| ------------------------- | --- | -------- | --------- | ----------------- | ------ | ---- | ----- | ---- |
| (Intercept)               |     | -25.94   | 2.29      | -30.41            | -21.44 | 0.04 | 3233  | 1    |
| pressure                  |     | 0.07     | 0.01      | 0.05              | 0.09   | 0.00 | 3363  | 1    |
| temperature               |     | 0.45     | 0.07      | 0.31              | 0.59   | 0.00 | 3009  | 1    |
| humidity                  |     | 0.13     | 0.01      | 0.10              | 0.15   | 0.00 | 3888  | 1    |
| exposure_time             |     | -5.48    | 1.03      | -7.52             | -3.57  | 0.02 | 4364  | 1    |
| line_speed                |     | 0.05     | 0.00      | 0.04              | 0.06   | 0.00 | 3811  | 1    |
| machineM2                 |     | 0.18     | 0.19      | -0.21             | 0.56   | 0.00 | 2950  | 1    |
| machineM3                 |     | 1.13     | 0.19      | 0.75              | 1.50   | 0.00 | 2708  | 1    |
| machineM4                 |     | 1.65     | 0.19      | 1.26              | 2.03   | 0.00 | 2775  | 1    |
| machineM5                 |     | 1.70     | 0.22      | 1.27              | 2.11   | 0.00 | 2818  | 1    |
| shiftEvening              |     | 0.90     | 0.13      | 0.65              | 1.15   | 0.00 | 4734  | 1    |
| shiftNight                |     | 1.49     | 0.16      | 1.19              | 1.79   | 0.00 | 4811  | 1    |
| pressure2                 |     | 0.01     | 0.00      | 0.00              | 0.01   | 0.00 | 5811  | 1    |
| temperature2              |     | 0.18     | 0.03      | 0.11              | 0.24   | 0.00 | 5422  | 1    |
| humidity2                 |     | 0.02     | 0.00      | 0.01              | 0.02   | 0.00 | 5875  | 1    |
| exposure_time2            |     | 42.00    | 8.11      | 27.06             | 58.96  | 0.11 | 5744  | 1    |
| line_speed2               |     | 0.00     | 0.00      | 0.00              | 0.00   | 0.00 | 5331  | 1    |
| mean_PPD                  |     | 0.25     | 0.01      | 0.24              | 0.27   | 0.00 | 4778  | 1    |
| log-posterior             |     | -1121.55 | 2.84      | -1127.87 -1116.53 |        | 0.07 | 1617  | 1    |
| print(mean(bayes_R2(m2)), |     |          | digits=2) |                   |        |      |       |      |
[1] 0.49
ROC(m2)
LVDAA,ArnoHollosi 5

4. ZWEITESMODELLMIT“REFERENZPUNKT”
ROC−Kurve
|     | 0.1 |     |     |     |     |     |     |     |     | 1   |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | 8.0 |     |     |     |     |     |     |     |     | 8.0 |
etar evitisop eurT
|     | 6.0 |     |     |     |     |     |     |     |     | 6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | 4.0 |     |     |     |     |     |     |     |     | 4.0 |
|     | 2.0 |     |     |     |     |     |     |     |     | 2.0 |
AUC: 0.905
0.0
0
|     |     | 0.0 |     | 0.2 |     | 0.4 |     | 0.6 | 0.8 | 1.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
False positive rate
| prediction_metrics(m2, |            |                  |                 | newdata=df_test) |           |                 |       |     |     |     |
| ---------------------- | ---------- | ---------------- | --------------- | ---------------- | --------- | --------------- | ----- | --- | --- | --- |
|                        | Dataset    |                  | n               | Brier            | LogLoss   |                 | Skill |     |     |     |
|                        | 1 Training |                  | 3500 0.09527998 |                  | 0.3132871 | 0.4929970       |       |     |     |     |
|                        | 2 New      | data             | 1500 0.08910198 |                  | 0.2936031 | 0.5188239       |       |     |     |     |
| ROC(m2,                |            | newdata=df_test, |                 | main="ROC        |           | für Testdaten") |       |     |     |     |
ROC für Testdaten
0.1
1
|     | 8.0 |     |     |     |     |     |     |     |     | 8.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
etar evitisop eurT
|     | 6.0 |     |     |     |     |     |     |     |     | 6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     | 4.0 |     |     |     |     |     |     |     |     | 4.0 |
|     | 2.0 |     |     |     |     |     |     |     |     | 2.0 |
AUC: 0.917
0.0
0
|     |     | 0.0 |     | 0.2 |     | 0.4 |     | 0.6 | 0.8 | 1.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
False positive rate
effectsize(m2)entferntimmerbeideTeilederselbenVariable: deneinfachen(linearen)Teilundden
quadratischenTeil.
|     | Effect | size | by term | (incl. | interactions) |     |     |     |     |     |
| --- | ------ | ---- | ------- | ------ | ------------- | --- | --- | --- | --- | --- |
Model:
|     | defect     | ~ pressure | +                | temperature |       | + humidity  | + exposure_time |              | +   |     |
| --- | ---------- | ---------- | ---------------- | ----------- | ----- | ----------- | --------------- | ------------ | --- | --- |
|     | line_speed |            | + machine        | +           | shift | + pressure2 | +               | temperature2 | +   |     |
|     | humidity2  |            | + exposure_time2 |             | +     | line_speed2 |                 |              |     |     |
LVDAA,ArnoHollosi 6

6. CUTOFF
|               | Df Deviance | AIC    |     |     |     |     |
| ------------- | ----------- | ------ | --- | --- | --- | --- |
| <none>        | 2192.6      | 2226.6 |     |     |     |     |
| exposure_time | 2 2249.8    | 2279.8 |     |     |     |     |
| temperature   | 2 2278.0    | 2308.0 |     |     |     |     |
| shift         | 2 2301.7    | 2331.7 |     |     |     |     |
| pressure      | 2 2336.4    | 2366.4 |     |     |     |     |
| machine       | 4 2347.8    | 2373.8 |     |     |     |     |
| humidity      | 2 2356.0    | 2386.0 |     |     |     |     |
| line_speed    | 2 2448.0    | 2478.0 |     |     |     |     |
LOO:
loo1 = loo(m1)
loo2 = loo(m2)
| loo_compare(loo1, | loo2)   |                      |     |     |     |     |
| ----------------- | ------- | -------------------- | --- | --- | --- | --- |
| elpd_diff         | se_diff |                      |     |     |     |     |
| m2 0.0            | 0.0     |                      |     |     |     |     |
| m1 -222.8         | 24.0    |                      |     |     |     |     |
| 5. Zusammenhang   |         | mit Luftfeuchtigkeit |     |     |     |     |
ModellvorhersagenfürmittlereWertevonDruck,Temperatur,Belichtungsdauer,Transportgeschwindigkeit:
|     | Modell 1   |     |     | Modell 1   |     |     |
| --- | ---------- | --- | --- | ---------- | --- | --- |
|     | Maschine 1 |     |     | Maschine 5 |     |     |
1.00
0.75
0.50
0.25
shift
etartkefeD 0.00
|     | Modell 2   |     |     | Modell 2   |     | Day     |
| --- | ---------- | --- | --- | ---------- | --- | ------- |
|     | Maschine 1 |     |     | Maschine 5 |     | Evening |
1.00
Night
0.75
0.50
0.25
0.00
| 30  | 40  | 50  | 60 30 | 40  | 50  | 60  |
| --- | --- | --- | ----- | --- | --- | --- |
Luftfeuchtigkeit
• WieinterpretierenSiedenUnterschiedzwischenModell1undModell2?
• WieinterpretierenSiedenUnterschiedzwischenMaschine1undMaschine5?
• WelcheEmpfehlungfürdieLuftfeuchtigkeitwürdenSiefürdenProduktionsbetriebabgeben?
6. Cutoff
WennwirmaximaleinenvonviertatsächlichenDefektenfalschvorhersagenwollen:
LVDAA,ArnoHollosi 7

7. ZUKUNFT
• WelchenCutoff-Wertsolltenwirdannverwenden?
• WievieletatsächlicheDefektesagenwirdannvorher?
• WievielefehlerfreieStückesagenwirimSchnittalsDefektvorher?
plotlogrates(m2)
|      | true positive |      | false negative |     |
| ---- | ------------- | ---- | -------------- | --- |
| 1.00 |               | 1.00 |                |     |
| 0.75 |               | 0.75 |                |     |
| 0.50 |               | 0.50 |                |     |
| 0.25 |               | 0.25 |                |     |
| 0.00 |               | 0.00 |                |     |
etaR
|           | false positive |           | true negative |           |
| --------- | -------------- | --------- | ------------- | --------- |
| 1.00      |                | 1.00      |               |           |
| 0.75      |                | 0.75      |               |           |
| 0.50      |                | 0.50      |               |           |
| 0.25      |                | 0.25      |               |           |
| 0.00      |                | 0.00      |               |           |
| 0.00 0.25 | 0.50 0.75      | 1.00 0.00 | 0.25 0.50     | 0.75 1.00 |
Schwellwert
7. Zukunft
7a. Neukalibrierung
Der Hersteller hat Modell 2 ausgewählt und möchte es dauerhaft einsetzen. Nach einigen Monaten
werdendieMaschinenneukalibriert,wodurchsichdietypischenProzesswerteverändern.
• WarumkönntedasModellnunschlechtereVorhersagenliefern?
• Welche Auswertungen würden Sie regelmäßig durchführen, um eine Verschlechterung der
Modellgütezuerkennen?
7b. Veränderung
Angenommen, die Belichtungszeit und die Transportgeschwindigkeit verändern sich im laufenden
Produktionsbetrieb deutlich gegenüber den Trainingsdaten. Die beobachtete Gesamtdefektrate bleibt
aberunverändert!
• Bei welcher der beiden Veränderungen wäre aufgrund der AIC-Tabelle größere Vorsicht
angebracht? BegründenSie.
• Ist die unveränderte Gesamtdefektrate ein Beleg dafür, dass Modell 2 weiterhin zuverlässig
vorhersagt?
• WiewürdenSieüberprüfen,obModell2nachdiesenVeränderungenweiterhingeeignetist?
LVDAA,ArnoHollosi 8