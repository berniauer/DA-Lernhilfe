<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/06-Modellvergleich.pdf -->

Modellvergleich
ArnoHollosi
Contents
| Modellvergleich |     | 1   |
| --------------- | --- | --- |
Beispiel: ErtraginLandwirtschaft . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1
| Posterior-PredictiveChecks |     | 2   |
| -------------------------- | --- | --- |
VerteilungdesDatensatzes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2
VorhersagevonY:𝑦 ↔ 𝑦-̂Plot . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Residuen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
𝑅2
| Bestimmtheitsmaß:     |              | 5   |
| --------------------- | ------------ | --- |
| VorhersageneuerDaten: | Trainvs.Test | 6   |
| CrossValidation       |              | 7   |
Vergleich . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
EinflusseinzelnerDatensätze . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
| GleicheDaten            |     | 11  |
| ----------------------- | --- | --- |
| WelchesModellistbesser? |     | 11  |
Modellvergleich
EintypischerArbeitsablaufbeiderModellierungist,dasswirimLaufederAnalysemehrereModelle
aufstellen. Diese können unterschiedliche Variable verwenden oder unterschiedliche Ansätze. Wie
können wir diese Modelle vergleichen? Wie kann man bestimmen, ob ein Modell ein besserer Fit als
einanderesist?
Wirsetzenimmervoraus,dassdasSampling(alsodieBerechnung)beiallenModellenpasst. Ansonsten
könnenwirdenModellparameternnichtausreichendvertrauen.
Beispiel: ErtraginLandwirtschaft
Als Beispiel-Datensatz verwenden wir einen (synthetischen) Datensatz zum Ernte-Ertrag einer
Landwirtschaft: als Daten haben wir Wassermenge (Niederschlag bzw. Bewässerung), Index für
BodenqualitätundMengedesDüngers. WirhabenimLaufederAnalysevierModelleerstellt,diewir
auf Basis unseres Fachwissens immer weiter verfeinert haben. Unter anderem haben wir modelliert,
dass der Ernteertrag nicht-linear mit Wasser zusammenhängt, da entweder zu wenig oder zu viel
Wasser schlecht ist und eine optimale Wassermenge den Ernteertrag maximiert. Auch haben wir
bspw. in Modell 2 eingebaut, dass der Nutzen von zusätzlichem Dünger mit der Menge abnimmt
(Sättigungseffekt), bzw. dass es auch einen Zusammenhang (Interaktion) zwischen Dünger und
Wassermengegibt(Modell4).
1

POSTERIOR-PREDICTIVECHECKS
| # Erstes | Modell:           | einfach        | alle Variablen |            | hineingeben |            |
| -------- | ----------------- | -------------- | -------------- | ---------- | ----------- | ---------- |
| modell1  | = stan_glm(ertrag |                | ~ boden        | + duenger  |             | + wasser,  |
|          |                   | data=df_train, |                | seed=1234, |             | refresh=0) |
# Zweites Modell: Einfluss von Dünger nimmt mit zunehmender Menge ab
| modell2 | = stan_glm(ertrag |                | ~ boden | + log1p(duenger) |     | + wasser,  |
| ------- | ----------------- | -------------- | ------- | ---------------- | --- | ---------- |
|         |                   | data=df_train, |         | seed=1234,       |     | refresh=0) |
# Drittes Modell: zu wenig, aber auch zu viel Wasser ist schlecht ->
# nicht-linearen Zusammenhang als quadratische Kurve modellieren
modell3 = stan_glm(ertrag ~ boden + log1p(duenger) + wasser + I(wasser^2),
|     |     | data=df_train, |     | seed=1234, |     | refresh=0) |
| --- | --- | -------------- | --- | ---------- | --- | ---------- |
# Viertes Modell: Wirkung des Düngers verändert sich mit Wassermenge (Interaktion)
modell4 = stan_glm(ertrag ~ boden + log1p(duenger)*wasser + I(wasser^2),
|     |     | data=df_train, |     | seed=1234, |     | refresh=0) |
| --- | --- | -------------- | --- | ---------- | --- | ---------- |
Sampling hat bei allen vier Modellen funktioniert. Wir wollen jetzt in Folge gar nicht die einzelnen
Koeﬀizienteninterpretieren,sondernunsausschließlichaufdenModellvergleichfokussieren.
| Posterior-Predictive |     |     | Checks |     |     |     |
| -------------------- | --- | --- | ------ | --- | --- | --- |
Ein wichtiger Schritt ist, dass wir überprüfen, ob das Modell eine gute Beschreibung des Datensatzes
darstellt. Dazu verwenden wir die bekannten Diagnose-Funktionen, um den Fit des Modells zu
überprüfen. Einerseits ist diese grafische Inspektion wichtig und wertvoll, andererseits ist es gerade
beieinervisuellenInspektionteilweiseschwierig,eineindeutigesVotumabzugeben–vorallemwenn
die Verteilungen ähnlich aussehen oder der Unterschied schwer beschreibbar ist. Aus diesem Grund
versuchenwirdasGeseheneauchinMetrikzufassen.
VerteilungdesDatensatzes
Schauen wir erstes darauf, wie die Modelle die Verteilung des Datensatzes nachbilden können. Wie
im folgenden Diagramm zu sehen, kann man argumentieren, dass das Modell 1 den Datensatz nicht
optimaltrifft. Allerdingsistbspw. derUnterschiedzwischenModell3undModell4reinvisuellnicht
eindeutigbestimmbar.
LVDAA,ArnoHollosi 2

| VorhersagevonY:𝑦 |     | ↔ 𝑦-̂Plot |            |     | POSTERIOR-PREDICTIVECHECKS |     |     |
| ---------------- | --- | --------- | ---------- | --- | -------------------------- | --- | --- |
|                  |     | Modell 1  |            |     | Modell 2                   |     |     |
|                  | 5   |           | 10         | 15  | 5                          | 10  | 15  |
|                  |     | Modell 3  |            |     | Modell 4                   |     |     |
|                  | 5   |           | 10         | 15  | 5                          | 10  | 15  |
| VorhersagevonY:𝑦 |     |           | ↔ 𝑦-̂ Plot |     |                            |     |     |
|                  |     |           |            | 𝑦   | 𝑦̂(Vorhersage              |     |     |
Sehen wir uns die Abweichung zwischen (Datensatz) und des Modells) an. Hier ist
reinvisuellkeinUnterschiedzwischendenModellenauszumachen.
|     |     | Modell 1 |     |     |     | Modell 2 |     |
| --- | --- | -------- | --- | --- | --- | -------- | --- |
| 21  |     |          |     | 21  |     |          |     |
y y
| 8   |     |              |        | 8   |     |                    |     |
| --- | --- | ------------ | ------ | --- | --- | ------------------ | --- |
| 6   |     |              |        | 6   |     |                    |     |
| 4   |     |              |        | 4   |     |                    |     |
|     | 6   | 8            | 10     | 12  | 4 6 | 8 10               | 12  |
|     |     | avg Modell 3 | ( y )  |     |     | avg Modell 4 ( y ) |     |
|     |     |              | sample |     |     | sample             |     |
| 21  |     |              |        | 21  |     |                    |     |
y y
| 8   |     |     |          | 8     |     |              |     |
| --- | --- | --- | -------- | ----- | --- | ------------ | --- |
| 6   |     |     |          | 6     |     |              |     |
| 4   |     |     |          | 4     |     |              |     |
|     | 4   | 6   | 8        | 10 12 | 6   | 8 10         | 12  |
|     |     |     | ( )      |       |     | ( )          |     |
|     |     | avg | y sample |       |     | avg y sample |     |
Residuen
Die Residuenplots sind etwas eindeutiger. Bei Modell 1 sieht man eine Krümmung (“Banane”), die
auchdurchvieleDatenpunktegestütztist. AuchbeiModell2siehtmanvorallemimBereichzwischen
7und12eineKrümmung,diedurchvieleDatenpunktegestütztist;dieAbweichungimBereich4..6ist
nurdurchwenigePunktegegeben. DemsolltenwirnichtzuvielGewichtbeimessen. BeiModell3sieht
| LVDAA,ArnoHollosi |     |     |     |     |     |     | 3   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- |

Residuen POSTERIOR-PREDICTIVECHECKS
dieAbweichunggeringeralsinModell2aus;wiedermitAusnahmedesBereichs4..6,woallerdingsnur
wenigePunkteliegen. Modell4hatinSummediegeringstenAbweichungenbeidenResiduen.
Die Residuenplots geben uns also Hinweise darauf, dass es einen nicht-linearen Zusammenhang gibt,
derinModell1&2nochnichtmodelliertist,inModell3&4aberschon. Wirkönnendarausableiten,
dasseseinweiteresIndizgibt,dassModell1(wahrscheinlich)dasSchlechtesteist,gefolgtvonModell
2. Modell3und4sehengutaus,wobeiModell4auchdenBereichbeikleinen𝑦gutabbildet.
| Modell 1 |     |     |     | Modell 2 |     |
| -------- | --- | --- | --- | -------- | --- |
3
| )slaudiser(gva 2 |     | )slaudiser(gva |     |     |     |
| ---------------- | --- | -------------- | --- | --- | --- |
1
0
1−
2−
3−
4−
| 6 8      | 10 12  |     | 4 6 | 8 10     | 12  |
| -------- | ------ | --- | --- | -------- | --- |
| Modell 3 |        |     |     | Modell 4 |     |
|          | fitted |     |     | fitted   |     |
3
3
| 2   |     | 2   |     |     |     |
| --- | --- | --- | --- | --- | --- |
)slaudiser(gva )slaudiser(gva
| 1   |     | 1   |     |     |     |
| --- | --- | --- | --- | --- | --- |
0
1−
2−
3−
| 4 6 | 8 10 | 12  | 6   | 8 10 | 12  |
| --- | ---- | --- | --- | ---- | --- |
EsgibtsogenanntePartialResidualPlots,dieResiduenimKontexteinereinzelnenVariabledarstellen. fitted fitted Für
dieModelle1und3sehensiefürWasserwieuntenaus. DieblaueLiniezeigtZusammenhangzwischen
WasserundErtraglautModell. DieroteLiniezeigteinegeglätteteKurvedurchdiepartiellenResiduen.
Stimmen beide Linien gut überein, ist das ein Hinweis darauf, dass das Modell den Zusammenhang
ausreichendgutbeschreibt.
In unserem Fall ist klar zu sehen, dass bei Modell 1, welches den quadratischen Zusammenhang von
Wasser nicht modelliert, eine starke Abweichung zwischen der Vorhersage und den Daten gibt. Bei
Modell 3, welches den quadratischen Zusammenhang enthält, deckt sich die (blaue) Vorhersage ist
sehrgutmitden(roten)Residuen.
LVDAA,ArnoHollosi 4

BESTIMMTHEITSMASS:𝑅2
14
12
10
8
6
4
200 400 600
wasser
)ressaw(f
Modell 1
14
12
10
8
6
4
200 400 600
wasser
)ressaw(f
Modell 3
Bestimmtheitsmaß:
𝑅2
𝑅2 gibt an, welcher Anteil der Varianz im Datensatz durch das Modell erklärt wird. Daraus können
wirableiten, dassModellemithöherem𝑅2 denDatensatzbessernachbilden. Wieschonanderenorts
erwähnt, sollten wir diese Zahl nie isoliert betrachten, aber im Kontext einer vollständigen Analyse
könnenwirauchdieseZahlzurEinschätzungmiteinbeziehen.
R²
Modell1 0.69
Modell2 0.71
Modell3 0.78
Modell4 0.80
Auchhierspiegeltsichwieder,waswirbereitsvisuellvermutethaben. Modell1hatdasgeringste𝑅2,
Modell 4 das höchste. D.h. auch 𝑅2 liefert uns ein weiteres Indiz, dass die Modelle unterschiedliche
Güte haben. Vergessen wir jedoch nicht, dass 𝑅2 eine vollständige Verteilung hat wie unten gezeigt.
Ob die Unterschiede also tatsächlich eine praktische Bedeutung haben oder nicht, können wir (wenn
überhaupt)nurimKontextderanderenTestsbeurteilen. Essiehtzumindestsoaus,alswärenModell3
und4eindeutlichbessererFitfürdenDatensatzalsModell1und2.
LVDAA,ArnoHollosi 5

VORHERSAGENEUERDATEN:TRAINVS.TEST
|      |       | R² Modell 1 |      |           |     |       |       | R² Modell 2 |      |       |           |
| ---- | ----- | ----------- | ---- | --------- | --- | ----- | ----- | ----------- | ---- | ----- | --------- |
|      |       | median=0.69 |      |           |     |       |       | median=0.71 |      |       |           |
|      |       | 95% HDI     |      |           |     |       |       | 95% HDI     |      |       |           |
|      | 0.659 |             |      | 0.707     |     | 0.692 |       |             |      |       | 0.736     |
|      | 0.66  | 0.68        | 0.70 | 0.72      |     | 0.68  | 0.69  | 0.70 0.71   | 0.72 | 0.73  | 0.74 0.75 |
|      |       | R² Modell 3 |      |           |     |       |       | R² Modell 4 |      |       |           |
|      |       | median=0.78 |      |           |     |       |       | median=0.8  |      |       |           |
|      |       | 95% HDI     |      |           |     |       |       | 95% HDI     |      |       |           |
|      | 0.761 |             |      | 0.795     |     |       | 0.779 |             |      | 0.811 |           |
| 0.75 | 0.76  | 0.77 0.78   |      | 0.79 0.80 |     | 0.77  | 0.78  | 0.79        | 0.80 | 0.81  | 0.82      |
Achtung: Ein höheres 𝑅2 bedeutet nicht automatisch, dass ein Modell neue Daten besser vorhersagt.
Insbesondere berücksichtigt 𝑅2 nicht direkt, ob die zusätzliche Modellkomplexität gerechtfertigt ist.
GenaudeshalbbenötigenwirweitereVergleichsverfahrenwieCross-Validation(sieheunten).
| Vorhersage |     | neuer | Daten: | Train | vs. | Test |     |     |     |     |     |
| ---------- | --- | ----- | ------ | ----- | --- | ---- | --- | --- | --- | --- | --- |
Ein sehr aussagekräftiges Kriterium ist, wie gut ein Modell neue Daten vorhersagt. Wenn unsere
Aufgabenstellung ist, zukünftige Daten vorherzusagen, dann ist dies das entscheidende Kriterium.
Aber auch wenn wir “nur” Analyse bestehender Daten betreiben, ist eine solche Vorhersage ein
wichtiges Indiz, um zu wissen, ob unser Modell gut generalisiert, also die zu Grunde liegenden
EigenschaftendesDatensatzesguterfasst.
Wir sagen also auf Basis unseres Modells neuen Daten für die Y-Werte vorher. Dann sehen wir uns
an, wie stark die Vorhersagen von unserem echten Y abweichen. Es gibt verschiedene Maßzahlen
dafür, häufig werden bei Regressionsmodellen RMSE (root mean squared error) und MAE (mean
absolute error) verwendet. Unser daatools-Paket hat dafür auch eine passende Funktion bereit:
prediction_metrics(). FürunserevierModellesehendieErgebnissezusammengefasstwiefolgtaus:
|     |     |     |     |         | RMSE | MAE  | Skill |     |     |     |     |
| --- | --- | --- | --- | ------- | ---- | ---- | ----- | --- | --- | --- | --- |
|     |     |     |     | Modell1 | 1.13 | 0.88 | 0.70  |     |     |     |     |
|     |     |     |     | Modell2 | 1.08 | 0.86 | 0.73  |     |     |     |     |
|     |     |     |     | Modell3 | 0.96 | 0.78 | 0.79  |     |     |     |     |
|     |     |     |     | Modell4 | 0.90 | 0.74 | 0.81  |     |     |     |     |
Auch bei den Vorhersagen ist Modell 4 das jene mit dem kleinsten Vorhersagefehler bzw. mit dem
größtenSkill. Dasheißt,auchdieserTestdeutetdaraufhin,dassModell3und4gutsind,Modell1aber
dasamwenigstengeeignete(dasmitdemgrößtenVorhersagefehler).
NunistunserTrain-Test-Splitzwarzufälliggewählt, abervielleichthabenwirjaeinenzufälligenSplit
erwischt,derModell1oder2besondersschlechtaussehenlässtoderModell4besondersgut. Umuns
LVDAA,ArnoHollosi 6

CROSSVALIDATION
abzusichernsolltenwireigentlichdiesenTrain-Test-Splitmehrfachwiederholen,dieModellemehrfach
rechnenundunsansehen,obundwiesichdieEigenschaftenverändern.
Dasistnichtnurrechenaufwendig. WirgebenauchimmereinengewissenProzentsatzunsererDaten
fürdasTestenauf. DadurchsindunsereKoeﬀizientenwenigergenaubestimmt,alssieeswären,wenn
wirdengesamtenDatensatzverwendenwürden. EinemöglicheLösung: Cross-Validation.
Cross Validation
WiediskutiertisteinAnsatz,dieVorhersagekrafteinesModellszubestimmen,denDatensatzinzwei
Teilezuteilen: ineinenTrainingsdatensatzundeinenTestdatensatz. DasExtremderCross-Validierung
ist,nureineneinzigenDatensatzzumTestenzuverwendenundalleanderenzumTrainieren; unddas
inFolgemitallenDatensätzendurchzuspielen. BeiunseremErnteertrag-Training-Datensatzhießedas
also 1200-mal eine Regression mit 1199 Datensätzen durchzurechnen und den jeweils verbleibenden
Datensatz vorherzusagen. Da das zu langsam ist, gibt es bei dieser leave-one-out-Validierung (loo)
Algorithmen,umdiezugehörigenWertenäherungsweisezuberechnen:
loo1 = loo(modell1)
loo1
| Computed | from 4000 by | 1200 log-likelihood | matrix. |
| -------- | ------------ | ------------------- | ------- |
|          | Estimate     | SE                  |         |
| elpd_loo | -1853.6 24.8 |                     |         |
| p_loo    | 5.1 0.3      |                     |         |
| looic    | 3707.3 49.7  |                     |         |
------
| MCSE of                         | elpd_loo is   | 0.0.               |                  |
| ------------------------------- | ------------- | ------------------ | ---------------- |
| MCSE and                        | ESS estimates | assume independent | draws (r_eff=1). |
| All Pareto                      | k estimates   | are good           | (k < 0.7).       |
| See help('pareto-k-diagnostic') |               |                    | for details.     |
elpd_loomisst,wiegutdasModellneueBeobachtungen(voraussichtlich)vorhersagenkann. Jegrößer
looicenthältdieselbeInformationaufeineranderenSkala1:
derWert,destobesser. hieristderkleinere
Wert besser. p_loo beschreibt die effektive Modellkomplexität. Die absoluten Werte von elpd_loo bzw.
looicsindfürsichalleinenichtaussagekräftig,dadergenaueWertvonAnzahlderDatensätzeundderen
Wertebereichabhängt. Eskannabergenütztwerden,umModellezuvergleichen.
𝑅2
Nach demselben Prinzip kann auch auf Basis der erklärten Varianz für die jeweils ausgelassenen
Datensätzeberechnetwerden. Typischerweiseistloo_R2etwaskleineralsbayes_R2,istabereinbesseres
IndizfürdieVorhersagekrafteinesModells:
mean(loo_R2(modell1))
[1] 0.68
Vergleich
WennwirnununsereModellevergleichenwollen,dannberechnenwirloofürallevierModelle.
1𝑙𝑜𝑜𝑖𝑐=−2×𝑒𝑙𝑝𝑑
𝑙𝑜𝑜
LVDAA,ArnoHollosi 7

EinflusseinzelnerDatensätze CROSSVALIDATION
|     |     |     |         | looic Std.-Fehler |     |
| --- | --- | --- | ------- | ----------------- | --- |
|     |     |     | Modell1 | 3707              | 50  |
|     |     |     | Modell2 | 3592              | 47  |
|     |     |     | Modell3 | 3289              | 47  |
|     |     |     | Modell4 | 3191              | 47  |
Die looic-Werte sind vergleichbar, da alle vier Modelle dieselben abhängige Variable (ertrag)
haben. Je kleiner, desto besser die Vorhersagekraft. Also haben Modell 3 und Modell 4 eine bessere
ErklärungskraftalsModell1und2. DerangebenenStandardfehlerzeigtan,wiegenaudieSchätzung
vonlooicist. DieFunktionloo_compare()beziehtdieVerteilungindieDifferenzbildungein.
| # Differenz       | zum besten | Modell  | (hier: | modell4) |     |
| ----------------- | ---------- | ------- | ------ | -------- | --- |
| loo_compare(loo1, | loo2,      | loo3,   | loo4)  |          |     |
|                   | elpd_diff  | se_diff |        |          |     |
| modell4           | 0.0        | 0.0     |        |          |     |
| modell3           | -49.0      | 10.4    |        |          |     |
| modell2           | -200.9     | 18.4    |        |          |     |
| modell1           | -258.3     | 21.5    |        |          |     |
Die Tabelle zeigt, um wie viel schlechter die anderen Modelle gegenüber dem besten Modell
abschneiden.Das beste Modell steht in der ersten Zeile (𝑒𝑙𝑝𝑑_𝑑𝑖𝑓𝑓 = 0).Die Spalte 𝑒𝑙𝑝𝑑_𝑑𝑖𝑓𝑓 zeigt
denVerlustanVorhersagegütederanderenModelleimVergleichzumbestenModell. EinUnterschied
istrelevant,wenn|𝑒𝑙𝑝𝑑 | > 2×𝑠𝑒 . Sonstkönnenwirnichtzuverlässigsagen,welchesModell
|     |     | 𝑑𝑖𝑓𝑓 | 𝑑𝑖𝑓𝑓 |     |     |
| --- | --- | ---- | ---- | --- | --- |
tatsächlich besser vorhersagt. Ein Modell kann also den besten Zahlenwert haben, ohne dass dieser
Vorsprungüberzeugendist. InunseremFallistModell4aberdeutlich(d.h. knapp5xse_diff)besser
alsModell3.
EinflusseinzelnerDatensätze
DienäherungsweiseBerechnungdurchleave-one-outerzeugteininteressantesNebenprodukt: wiestark
einzelne Datensätze die Koeﬀizienten beeinflussen2. Man könnte stark abweichende Datensätze mit
großem Einfluss auch als “Ausreisser” bezeichnen. In der Ausgabe von loo() findet man schon den
Hinweis auf die pareto k estimates. Details der Berechnung sollen uns hier nicht interessieren. Wichtig
fürdiepraktischeAnwendungist:
• Pareto-k-Werte<0.7(auchnegativmöglich)sindgut(Näherungsmethodehatgutfunktioniert)
• 0.7<Pareto-k-Werte<1sindeinGraubereich
• Pareto-k-Werte > 1 sollten genauer inspiziert werden, da hier die Näherungsmethode nicht
funktioniert hat, also z.B. looic ungenau bestimmt sein könnte und es typischerweise auf
| Ausreisserbzw. | starkeinflussreichePunktehindeutet. |     |     |     |     |
| -------------- | ----------------------------------- | --- | --- | --- | --- |
Manchmal schlägt die Näherungsmethode aber unnötig Alarm. Dann kann man den Wert eines
Datensatzes durch echtes Durchrechnen der zugehörigen Regression bestimmen und nicht durch die
Näherungsrechnung. Sehenwirunsz.B.diePareto-k-WertebeimModell4an:
| # alle Werte | <0.5 |     |     |     |     |
| ------------ | ---- | --- | --- | --- | --- |
top_pareto_k_influence_values(loo4)
2genauergesagt,obdieImportance-Sampling-Näherung,dielooimHintergrundausführt,zuverlässigfunktionierthat.
Ein
hoherWertkanndaraufhinweisen,dassdasEntfernendieserBeobachtungdiePosteriorverteilungstarkverändert.
LVDAA,ArnoHollosi 8

| EinflusseinzelnerDatensätze |     |     |     |     |     | CROSSVALIDATION |     |
| --------------------------- | --- | --- | --- | --- | --- | --------------- | --- |
row pkiv
| [1,] 1030 | 0.22     |     |     |     |     |     |     |
| --------- | -------- | --- | --- | --- | --- | --- | --- |
| [2,]      | 446 0.19 |     |     |     |     |     |     |
| [3,]      | 756 0.18 |     |     |     |     |     |     |
| [4,]      | 433 0.18 |     |     |     |     |     |     |
| [5,]      | 562 0.17 |     |     |     |     |     |     |
| [6,]      | 776 0.16 |     |     |     |     |     |     |
| [7,]      | 82 0.16  |     |     |     |     |     |     |
| [8,]      | 25 0.16  |     |     |     |     |     |     |
| [9,]      | 484 0.16 |     |     |     |     |     |     |
| [10,]     | 802 0.16 |     |     |     |     |     |     |
Bzw. alsDiagramm:
plotpkiv(loo4)
0.1
6.0
vip
2.0
2.0−
|     | 0   | 200 | 400 | 600 | 800 | 1000 | 1200 |
| --- | --- | --- | --- | --- | --- | ---- | ---- |
Index
| WiesähenFehleraus? |     | FügenwireinfachzweiAusreisserhinzu: |     |     |     |     |     |
| ------------------ | --- | ----------------------------------- | --- | --- | --- | --- | --- |
# Wir erzeugen uns einen neuen kleineren Trainingsdatensatz, damit die
| # 'ungewöhnlichen'         |              | Punkte deutlich | ins Gewicht  | fallen |     |     |     |
| -------------------------- | ------------ | --------------- | ------------ | ------ | --- | --- | --- |
| split_random(df,           | 200,         | "df_train2a",   | "df_test2a") |        |     |     |     |
| df_train2b                 | = df_train2a |                 |              |        |     |     |     |
| df_train2b["395",]$ertrag  |              | = 18            |              |        |     |     |     |
| df_train2b["1018",]$ertrag |              | = 0.5           |              |        |     |     |     |
modell1a = update(modell1, data=df_train2a) # Modell ohne Ausreisser
modell1b = update(modell1, data=df_train2b) # Modell mit Ausreisser
| loo1b = loo(modell1b) |     |     |     |     |     |     |     |
| --------------------- | --- | --- | --- | --- | --- | --- | --- |
loo1b
| Computed          | from 4000 | by 200 log-likelihood |     | matrix. |     |     |     |
| ----------------- | --------- | --------------------- | --- | ------- | --- | --- | --- |
|                   | Estimate  | SE                    |     |         |     |     |     |
| elpd_loo          | -394.7    | 43.1                  |     |         |     |     |     |
| p_loo             | 18.8      | 11.4                  |     |         |     |     |     |
| LVDAA,ArnoHollosi |           |                       |     |         |     |     | 9   |

| EinflusseinzelnerDatensätze |       |      |     |     | CROSSVALIDATION |     |
| --------------------------- | ----- | ---- | --- | --- | --------------- | --- |
| looic                       | 789.3 | 86.2 |     |     |                 |     |
------
| MCSE of                         | elpd_loo      | is NA.  |             |                  |     |     |
| ------------------------------- | ------------- | ------- | ----------- | ---------------- | --- | --- |
| MCSE and                        | ESS estimates | assume  | independent | draws (r_eff=1). |     |     |
| Pareto                          | k diagnostic  | values: |             |                  |     |     |
|                                 |               |         | Count Pct.  | Min. ESS         |     |     |
| (-Inf,                          | 0.7] (good)   |         | 198 99.0%   | 2794             |     |     |
| (0.7,                           | 1] (bad)      |         | 0 0.0%      | <NA>             |     |     |
| (1,                             | Inf) (very    | bad)    | 2 1.0%      | <NA>             |     |     |
| See help('pareto-k-diagnostic') |               |         | for         | details.         |     |     |
0.1
6.0
vip
2.0
2.0−
|     | 0   |     | 50  | 100 | 150 | 200 |
| --- | --- | --- | --- | --- | --- | --- |
Index
DierotenPunkteimScatterplotsinddiebeidenAusreisser,dieschwarzeLinieistdieRegressionslinie
desursprünglichenDatensatzesohneAusreisser,dieroteLinestelltdieRegressionsliniedesDatensatzes
mitdenAusreisserndar:
15
]ah/t[ gartrE
10
5
0
|     |     | 200 |     | 400 |     | 600 |
| --- | --- | --- | --- | --- | --- | --- |
Wasser [mm]
LVDAA,ArnoHollosi 10

WELCHESMODELLISTBESSER?
Ausreisserentfernen?
Eine umstrittene Frage ist, ab wann Datenpunkte, welche die Regressionsgerade arg verschieben
bzw. drehen, aus dem Datensatz entfernt werden sollen. Bei eindeutigen Messfehlern bzw.
Aufzeichnungsfehlern (z.B. Person, die 1.76cm groß ist anstatt 176cm) sollte – sofern der Fehler
nicht korrigiert werden kann – der Datensatz entfernt werden. Sonst tendiert man heute dazu, den
Datensatzbeizubehalten,weildasMessergebnisvielleichtunerwartetwar,aberoffensichtlichdennoch
möglich. Im Zweifel kann man auch Sensitivitätsanalysen durchführen: Wie verändert sich das
ErgebnismitundohnediefraglichenBeobachtungen?
Es gibt sogenannte robuste Regressionsvarianten, welche z.B. anstelle der Normalverteilung die
t-Verteilungverwenden,welche“dickereAusläufer”hatunddamitdiegroßenResiduenderAusreisser
abdecken bzw. erfassen können, ohne dass sich die Koeﬀizienten wesentlichen ändern müssen.
Während MC-Stan selbst diese Möglichkeit bietet, gibt es leider keine robuste Variante in den
vorkompiliertenModellenvonrstanarm.
Gleiche Daten
UnsereModellvergleichesetzenvoraus,dassalleModellemitdengleichenDatentrainiertwurden. Im
Allgemeinenmüssenwirdaheraufpassen,dass:
• alleModellediegleicheY-Variablehaben: VieleVergleichsverfahrensetzenvoraus,dassYinallen
Modellen identisch ist. Wird die abhängige Variable in einem Modell bspw. logarithmiert, sind
mancheVergleichenichtmehrodernurmitAnpassungenmöglich.
• alleModellediegleicheAnzahlanDatenhaben: Fehlenbeispielsweisebei3%derBeobachtungen
Angaben zum Dünger, kann ein Modell ohne diese Variable mehr Daten nutzen als eines mit
Dünger. EindirekterVergleichwirddadurchproblematischer.3
AnzahlundWertebereichederunabhängigenVariablen(𝑥 ..𝑥 )sindhingegenfürdenModellvergleich
1 𝑛
egal,dürfenalsovariieren.
Welches Modell ist besser?
Nachdem wir die vier Modelle nun ausführlich verglichen haben, fällt unsere Wahl auf Modell 4. Es
beschreibtdievorliegendenDatenbesserunderzieltauchbeiderCrossvalidierungundbeiVorhersagen
aufneuenDatengeringereFehler. InderPraxiswürdenwirdaherModell4wählen. Zusammengefasst
habenwirfolgendeTestsdurchgeführt:
Verfahren Wasbeurteilenwir?
Posterior-PredictiveChecks KanndasModelldiebeobachtetenDatenplausibel
nachbilden?
Residuen/PartialResiduals HabenwirsystematischeZusammenhängeübersehen?
𝑅2 WiegutbeschreibtdasModelldieVarianzder
beobachtetenDaten?
RMSE/MAEaufTestdaten WiegroßsinddieVorhersagefehleraufneuenDaten?
LOO WiegutsagtdasModellvoraussichtlichneue
Beobachtungenvorher,unterBerücksichtigungder
gesamtenprädiktivenVerteilung?
3EinemöglicheLösungwäreImputationfehlenderDaten. Obdiesesinnvollist(undwelchepotentielleProblemediesemit
sichbringt),istallerdingseineeigeneFragestellungaufdiewirhiernichtnähereingehenkönnen.
LVDAA,ArnoHollosi 11

WELCHESMODELLISTBESSER?
BeimModellvergleichsolltenwirunsalsonieaufeineeinzelneKennzahlverlassen: dieverschiedenen
TestssollteneineinigermaßeneinheitlichesBildergeben. WidersprechensichdieErgebnisse, müssen
wirgenauerhinsehenundunsereSchlussfolgerungenentsprechendvorsichtigerformulieren.
Nicht immer jedoch ist das mathematisch “beste” Modell, das zu bevorzugende. Ein komplexeres
Modell kann zwar bessere Vorhersagen machen, ist dafür aber häufig schwieriger zu interpretieren
(oder enthält Variablen, die schwerer zu messen sind). In unserem Beispiel stellt sich daher die
Frage, ob die Verbesserung von Modell 4 gegenüber Modell 3 groß genug ist, um den zusätzlichen
Interaktionstermzurechtfertigen. FürdieKommunikationistModell3deutlichbessergeeignet–und
wirkönnenauchargumentieren,dassesfürunsereFragestellungausreichendguteVorhersagenliefert.
LVDAA,ArnoHollosi 12