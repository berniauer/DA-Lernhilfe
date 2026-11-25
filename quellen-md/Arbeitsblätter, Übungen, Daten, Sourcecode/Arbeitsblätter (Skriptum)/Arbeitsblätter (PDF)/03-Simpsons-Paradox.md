<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/03-Simpsons-Paradox.pdf -->

|     |     |     | Simpsons | Paradox |     |     |
| --- | --- | --- | -------- | ------- | --- | --- |
ArnoHollosi
Contents
| Beispiel:            | OperationenineinemKrankenhaus |                |          |             |     | 1   |
| -------------------- | ----------------------------- | -------------- | -------- | ----------- | --- | --- |
| Regressionsbeispiel: |                               | Wohnungspreise |          |             |     | 2   |
| Zusammenfassung      |                               |                |          |             |     | 5   |
| Beispiel:            | Operationen                   |                | in einem | Krankenhaus |     |     |
Versetzen wir uns in die Lage einer Krankenhausleitung, in deren Krankenhaus zwei OP-Teams tätig
sind,TeamAundTeamB.FürdiejährlichenBonuszahlungensolljenesTeambelohntwerden,beidessen
OperationenesamwenigstenKomplikationengegebenhat. EineersteÜbersichtistschnellerstellt(Sie
findendenDatensatzinderDatei“daten/operationen.csv”):
|     |     | Table1: Erfolgebzw. | Komplikationenbei1000Operationen |                       |      |     |
| --- | --- | ------------------- | -------------------------------- | --------------------- | ---- | --- |
|     |     | erfolgreich         | Komplikationen                   | Sum Komplikationenin% |      |     |
|     | A   | 310                 |                                  | 188 498               | 37.8 |     |
|     | B   | 354                 |                                  | 148 502               | 29.5 |     |
|     | Sum | 664                 |                                  | 336 1000              | 33.6 |     |
Es ist eindeutig, dass Team B das “bessere” Team ist. Die Krankenhausleitung will schon die
Bonuszahlungenentsprechendverteilen,dakommtmanaufdieIdee,dassvielleichtdieSchwierigkeit
der Operation – Routineeingriff oder komplizierter Fall – eine Rolle spielen könnte. Entsprechende
| DatenstehenzurVerfügung. |     | EineneueAuswertungergibtfolgendesBild: |     |     |     |     |
| ------------------------ | --- | -------------------------------------- | --- | --- | --- | --- |
Table2: LeichteOperationen
|     |     | erfolgreich | Komplikationen | Sum Komplikationenin% |      |     |
| --- | --- | ----------- | -------------- | --------------------- | ---- | --- |
|     | A   | 214         |                | 56 270                | 20.7 |     |
|     | B   | 318         |                | 89 407                | 21.9 |     |
|     | Sum | 532         |                | 145 677               | 21.4 |     |
1

REGRESSIONSBEISPIEL:WOHNUNGSPREISE
Table3: SchwereOperationen
erfolgreich Komplikationen Sum Komplikationenin%
A 96 132 228 57.9
B 36 59 95 62.1
Sum 132 191 323 59.1
Inbeiden(!) Fällen–leichtenundschwerenOperationen–hatsichdasErgebnisnunumgekehrtund
TeamAistdasTeammitwenigerKomplikationen. WiekanndieSummevonzweiTeilergebnissendie
Statistikumdrehen?
Dieses Phänomen wird Simpsons Paradox genannt. Es taucht auf, wenn eine Summen-Statistik auf
einzelne Gruppen aufgebrochen wird und die Gruppen unterschiedliche Gewichtung haben. Ein
bekanntesBeispielistdieFrauen-/Männer-QuotebeiderStudien-ZulassunganderUCBerkeley1.
InobigemBeispielerklärtsichdasParadoxso,dassTeamAsowohlmehrschwereOperationenalsauch
wenigerleichteOperationendurchführtalsTeamB.DieGesamtquotevermischtdaher(a)wiegutein
Teamarbeitetund(b)welcheFälledasTeambehandelt.
WennSieinderKrankenhausleitungtätigwären,wemwürdenSiedieBonuszahlungenzuteilen? Was
wäre,wenndieDatenfürdieSchwierigkeiteinerOperationnichtverfügbarwären? Waswäre,wennes
nochandere“versteckte”Variablengäbe,dieinobigerAufteilungnichtberücksichtigwordensind(z.B.
Alterbzw. VorgeschichtederPatienten)?
Regressionsbeispiel: Wohnungspreise
Ähnliche Effekte können auch bei linearen Regressionen eine Rolle spielen. In beiden Fällen entsteht
derscheinbareWiderspruchdadurch, dasswirnachBerücksichtigungeinerweiterenVariableandere
Beobachtungen miteinander vergleichen. Wir wollen uns das am Beispiel für Wohnungspreise
ansehen. WirhabeneinenDatensatzmitWohnungspreisen,WohnflächeundAnzahlderZimmer. Der
Zusammenhang ist eindeutig: je mehr Zimmer, desto höher der Preis und auch je mehr Wohnfläche,
destohöherderPreis.
1https://en.wikipedia.org/wiki/Simpson%27s_paradox#Examples
LVDAA,ArnoHollosi 2

REGRESSIONSBEISPIEL:WOHNUNGSPREISE
| 6e+05       |     |        | 6e+05       |     |                 |     |
| ----------- | --- | ------ | ----------- | --- | --------------- | --- |
| )RUE( sierP |     |        | )RUE( sierP |     |                 |     |
| 4e+05       |     |        | 4e+05       |     |                 |     |
| 2e+05       |     |        | 2e+05       |     |                 |     |
|             | 1 2 | 3 4    | 5 6         | 40  | 80 120          | 160 |
|             |     | Zimmer |             |     | Wohnfläche (m²) |     |
DieRegressionlieferteindeutlichesErgebnis(wirverwendenzimmer4alsunabhängigeVariable: sieist
𝑍𝑖𝑚𝑚𝑒𝑟−4;nullbedeutetalsovierZimmer):
| fit_zi      | = stan_glm(preis | ~ zimmer4, | data=wohnungen, | seed=1234) |     |     |
| ----------- | ---------------- | ---------- | --------------- | ---------- | --- | --- |
| (Intercept) |                  | zimmer4    |                 |            |     |     |
| 368429.94   | 30811.13         |            |                 |            |     |     |
Interpretation: JeZimmerUnterschiedkosteteineWohnungumüber30000EURmehr. Basisfall: eine
| Wohnungmit4Zimmernkostetca. |     |     | 370000EUR(zimmer4=0). |     |     |     |
| --------------------------- | --- | --- | --------------------- | --- | --- | --- |
AuchdieWohnflächeisteinguterIndikatorfürdenPreis. DieRegressionliefertfolgendesErgebnis(wir
verwendenwohnflaeche90alsunabhängigeVariable: nullbedeutet90m²Fläche):
fit_fl <- stan_glm(preis ~ wohnflaeche90, data=wohnungen, seed=4567)
| (Intercept) | wohnflaeche90 |          |     |     |     |     |
| ----------- | ------------- | -------- | --- | --- | --- | --- |
| 371568.695  |               | 3104.185 |     |     |     |     |
Interpretation: Je m² Unterschied kostet eine Wohnung um 3050 EUR mehr. Eine Wohnung mit 90m²
| kostetca. | 370000EUR(Basisfall,wohnflaeche90=0). |     |     |     |     |     |
| --------- | ------------------------------------- | --- | --- | --- | --- | --- |
BevorwirnungroßindieImmobilienbrancheeinsteigen, solltenwirunsüberlegen, obwirnichteine
Regression rechnen, in der wir beide Variable aufnehmen, da ja beide Effekte zum Preis beitragen.
Gesagtgetan:
fit_beide = stan_glm(preis ~ wohnflaeche90 + zimmer4, data=wohnungen, seed=7890)
| (Intercept) | wohnflaeche90 |          | zimmer4   |     |     |     |
| ----------- | ------------- | -------- | --------- | --- | --- | --- |
| 374628.682  |               | 3458.324 | -9007.783 |     |     |     |
Der Koeﬀizient für die Zimmer hat das Vorzeichen geändert! Während vorher mehr Zimmer einen
höherenPreisvorhergesagthat(positivesVorzeichen),sagennunwenigerZimmereinenhöherenPreis
| vorher(negativesVorzeichen). |     | Wieistdasmöglich? |     |     |     |     |
| ---------------------------- | --- | ----------------- | --- | --- | --- | --- |
| LVDAA,ArnoHollosi            |     |                   |     |     |     | 3   |

REGRESSIONSBEISPIEL:WOHNUNGSPREISE
SehenwirunsdieKorrelations-Matrixan:
preis wohnflaeche zimmer
preis 1.00 0.85 0.49
wohnflaeche 0.85 1.00 0.67
zimmer 0.49 0.67 1.00
Wohnfläche korreliert recht stark mit Preis (0.85), Anzahl der Zimmer geringfügig weniger (0.49),
zudemkorrelierenaberZimmerundWohnflächerechtstarkmiteinander(0.66). D.h. dadiesebeiden
Variablen korrelieren, beeinflussen sich auch die Regressionskoeﬀizienten gegenseitig. Der folgende
Scatterplot zeigt den Zusammenhang nochmal bunt. Achten Sie darauf, wie höhere Zimmeranzahl
(gelb) tendenziell eher rechts (bei höherer Wohnfläche) liegt und niedrigere Zimmer (rot) eher links
beikleinererWohnflächezufindensind.
6e+05
4e+05
2e+05
40 80 120 160
Wohnfläche
)RUE(
sierP
zimmer
6
5
4
3
2
1
WiealsodieRegressionskoeﬀizienteninterpretieren?
(Intercept) wohnflaeche90 zimmer4
374628.682 3458.324 -9007.783
Der Koeﬀizient für zimmer4 bedeutet nun etwas anderes als vorher. Er beschreibt nicht mehr den
PreisunterschiedzwischenWohnungenmitunterschiedlicherZimmerzahlallgemein,sondernzwischen
Wohnungen mit gleicher Wohnfläche, die sich in ihrer Zimmerzahl unterscheiden. Dieser geänderte
VergleicherklärtdenVorzeichenwechsel.
Also nur die separaten Regressionen verwenden? Oder noch zusätzliche Variable einführen? Weder,
noch. DieModellefit_ziundfit_beidebeantwortenunterschiedlicheFragestellungen!
• Bei fit_zi lautet die Fragestellung: Wie hängt der Preis einer Wohnung von Anzahl der Zimmer
ab?
• Bei fit_beide ist die Fragestellung aber: Welchen Einfluss hat die Anzahl der Zimmer auf den
PreiseinervergleichbarenWohnung(wennalsodieWohnflächegleichbleibt)?
LVDAA,ArnoHollosi 4

ZUSAMMENFASSUNG
EinmöglicherGrundfürdennegativenZimmerpreisist,dassdadurchdieWohnungmehrzerstückelt
wird und damit keine großen Räume aufweist. D.h. beide der folgenden Aussagen sind gleichzeitig
gültig:
• InsgesamtsindWohnungenmitmehrZimmernteurer.
• BeigleicherWohnflächekönnenzusätzlicheZimmerabermiteinemniedrigerenPreisverbunden
sein.
DerZusammenhangistauchbereitsindenDatenersichtlich:wennwirunsnureinenkleinenAusschnitt
derDatenanssehen,dannkönnenwirdennegativenEinflussderZimmergrößesehen:
5e+05
4e+05
3e+05
2 3 4 5 6
Zimmer
)RUE(
sierP
Nur Wohnungen zwischen 95 und 105 m²
Zusammenfassung
Die Beispiele sollen verdeutlichen, dass die praktische Interpretation der Koeﬀizienten bei multipler
linearer Regression (d.h. zwei oder mehr unabhängige Variablen) nicht ohne Kontext erfolgen kann.
NurdannkönnenRegressions-Modellesinnvollbeurteiltwerden. LetztlichsindRegressions-Modelle
eben genau das: vereinfachte Modelle der Wirklichkeit. Welche Frage wir beantworten wollen,
beeinflusstwelchesModellwirverwendensollten.
WennsicheinKoeﬀizientstarkverändertodersogarseinVorzeichenwechselt, istdasdaherzunächst
kein Fehler des Modells. Es zeigt, dass der bedingte Vergleich (“bei gleichen Werten der anderen
Modellvariablen”) etwas anderes beschreibt als der unbedingte Vergleich. Wir müssen uns also
fragen, wann “X gleich halten” inhaltlich sinnvoll ist. Mehr Variablen im Modell bedeuten also nicht
automatisch“besseresModell”,sondern“anderesModell”.
Bevor wir Regressionskoeﬀizienten interpretieren, bspw. bei einem Modell 𝑦 ∼ 𝑥1 + 𝑥2 + 𝑥3 + …,
solltenwirunsfragen:
1. Waswirdmiteinanderverglichen?
2. Waswirddabeikonstantgehalten?
3. Istesrealistischundinhaltlichsinnvoll,dieseVariablenkonstantzuhalten?
4. GibteswichtigeGruppenoderEinflussgrößen,diedasModellnichtberücksichtigt?
5. BeschreibendieKoeﬀizientennureineAssoziationoderdürfenwirsiekausalinterpretieren?
LVDAA,ArnoHollosi 5

ZUSAMMENFASSUNG
QuellenundweiterführendeUnterlagen
Yu-Kang Tu, David Gunnell, and Mark S Gilthorpe (2008): Simpson’s Paradox, Lord’s Paradox, and
Suppression Effects are the same phenomenon – the reversal paradox. Emerging Themes in Epidemiology,
20085:2. DOI:10.1186/1742-7622-5-2
WestfallJ,YarkoniT(2016): StatisticallyControllingforConfoundingConstructsIsHarderthanYouThink.
PLoSONE11(3): e0152719. DOI:10.1371/journal.pone.0152719
McElreathR(2020): StatisticalRethinking. CRCPress, 2ndEdition. https://xcelab.net/rm/statistical-
rethinking/
LVDAA,ArnoHollosi 6