<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/05-Interaktionen.pdf -->

Interaktionen
ArnoHollosi
Contents
| Motivation: | EineZahlreichtnichtimmer |     |     |     | 1   |
| ----------- | ------------------------ | --- | --- | --- | --- |
ErstesModell: Gruppenvariable . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2
Interaktion: UnterschiedlicheSteigungjeGruppe . . . . . . . . . . . . . . . . . . . . . . . . . 2
WaspassiertbeianderemBasisfall? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
WaspassiertbeiandererReferenzgruppe? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
WelchesModellistbesser? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
| Fallstrick:                          | KaumgemeinsameDatenbereiche |     |     |     | 6   |
| ------------------------------------ | --------------------------- | --- | --- | --- | --- |
| InteraktionzweiermetrischerVariablen |                             |     |     |     | 6   |
EineFlächestattvielerLinien . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
| WannInteraktionverwenden? |     |     |     |     | 8   |
| ------------------------- | --- | --- | --- | --- | --- |
PrüfungenvorjederInterpretation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
| Motivation: | Eine Zahl | reicht nicht | immer |     |     |
| ----------- | --------- | ------------ | ----- | --- | --- |
Eine Schulungsfirma möchte wissen, ob zusätzliche Lernstunden mit besseren Testergebnissen
einhergehen. SiehatDatenauszweiKursformaten,SelbststudiumundBetreuung:
80
| etknuptseT |     |     |     | Kursformat |     |
| ---------- | --- | --- | --- | ---------- | --- |
60 Selbststudium
Betreuung
40
|     | 2.5 | 5.0 | 7.5 | 10.0 |     |
| --- | --- | --- | --- | ---- | --- |
Lernstunden
1

ErstesModell: Gruppenvariable MOTIVATION:EINEZAHLREICHTNICHTIMMER
Überlegen Sie kurz: Was würden Sie einer Person raten, die 2 Stunden lernt? Was einer Person, die 9
Stundenlernt? WaswäreproblematischanderAussage: “BetreuungbringtimMittelXPunkte”?
ErstesModell: Gruppenvariable
StellenwiralsoeineerstesModellauf,umeinwenigLichtindas“Datendunkel”zubringen:
modell1 = stan_glm(punkte ~ stunden + format, data=lernen, seed=1234, refresh=0)
coef(modell1)
(Intercept) stunden formatBetreuung
26.1 3.6 19.6
Kurze Interpretation: Basisfall (26 Punkte) ist Selbststudium mit 0 Stunden lernen. Je Lernstunde
Unterschied mehr ist das Testergebnis um 3.6 Punkte höher. Betreuung erzielt bei gleicher
Stundenanzahl im Schnitt knapp 20 Punkte besseres Testergebnis. Werden die Regressionslininen
fürbeiderGruppeneingezeichnet,dannsiehtdassoaus:
80
60
40
2.5 5.0 7.5 10.0
Lernstunden
etknuptseT Kursformat
Selbststudium
Betreuung
Interaktion: UnterschiedlicheSteigungjeGruppe
WennwirunsdenScatterplotgenauansehen,erkennenwir,dassdieRegressionsgeradendenDatensatz
nicht optimal treffen. Vor allem bei wenigen Stunden ist ersichtlich, dass bspw. das Selbststudium
deutlich abweicht. Man könnte jetzt einen Residual-Plot machen (siehe Arbeitsblatt “Testen des
Modells”),derunszeigt,dasshiertatsächlicheinsystematischerFehlervorliegt:
LVDAA,ArnoHollosi 2

Interaktion: UnterschiedlicheSteigungjeGruppe MOTIVATION:EINEZAHLREICHTNICHTIMMER
30 40 50 60 70 80
51
5
5−
51−
avg(residuals) vs fitted
fitted
)slaudiser(gva
ObderZusammenhangwirklichnicht-linearistodereinandererGrundfürdieAbweichungvorliegt,
kannmanausdemPlotnichtablesen. Wirentscheidenunsdazu,unterschiedlicheSteigungenfürdie
RegressionsgeradeninjederGruppezuverwenden. DasgehtmiteinerInteraktion:
modell2 = stan_glm(punkte ~ stunden + format + stunden:format,
data=lernen, seed=1234, refresh=0)
coef(modell2)
(Intercept) stunden formatBetreuung
33.8 2.2 3.9
stunden:formatBetreuung
2.7
Wir haben nun zusätzlich zu den Koeﬀizienten für Stunden und Format einen weiteren Koeﬀizienten
(stunden:formatBetreuung). Der Koeﬀizient für das Format (formatBetreuung) gibt weiterhin den
Unterschied zwischen Betreuung und Selbststudium an, allerdings nur beim Basisfall, also bei null
Lernstunden. Bei0LernstundenerzieltdieBetreuungetwa4Punktemehr. BeianderenLernstunden
verändert sich dieser Unterschied aufgrund der Interaktion. Wie stark er sich verändert, beschreibt
der Interaktionskoeﬀizient. Wegen der Interaktion gilt der Koeﬀizient für Stunden nur noch für die
Referenzgruppe(“Selbststudium”). D.h. beiSelbststudiumgibtes,jeLernstundeDifferenz,umüber2
Testpunktemehr.
Der Koeﬀizient des Interaktionsterms stunden:formatBetreuung gibt an, wie sehr sich die Differenz
je Stunde für die Gruppe Betreuung ändert im Vergleich zur Referenzgruppe. D.h. im Vergleich zum
SelbststudiumhatdieGruppeBetreuungeinumca. 2.7PunkteproStundestärkerenZusammenhang.
DadieReferenzgruppeSelbststudiumselbstaber2.2PunkteDifferenzjeStundeLernenhat,heißtdas,
dass(inabsolutenWerten)dieBetreuungsgruppeeineSteigungvonca. 5PunktenjeLernstundehat
(2.2+2.7Punkte).
Ähnlich also wie bei Gruppenvariablen die Koeﬀizienten die Differenz zur Referenzgruppe angeben,
gibt der Interaktionsterm ebenfalls die Differenz zur Referenzgruppe an, allerdings für die Steigung
(stunden)nichtfürdenIntercept. BeieinerInteraktionhängtalsoderZusammenhangzwischeneiner
erklärendenVariableunddemErgebnisvomWerteineranderenVariableab. EineinzelnerKoeﬀizient
beschreibtdannnureinenbedingtenZusammenhang.
ImScatterplotsehendieRegressionsgeradennunwiefolgtaus:
LVDAA,ArnoHollosi 3

WaspassiertbeianderemBasisfall? MOTIVATION:EINEZAHLREICHTNICHTIMMER
modell2: unterschiedliche Steigungen; zum Vergleich modell1 gestrichelt
80
etknuptseT
format
| 60  |     |     |     |     |     |     | Selbststudium |
| --- | --- | --- | --- | --- | --- | --- | ------------- |
Betreuung
40
|     | 2.5 |     | 5.0 | 7.5 |     | 10.0 |     |
| --- | --- | --- | --- | --- | --- | ---- | --- |
Lernstunden
DerTestmitdiagnose_residual()zeigtnunaucheinedeutlichbessere(unauffällige)Verteilungder
Residuen.
avg(residuals) vs  fitted
51
)slaudiser(gva
5
5−
51−
|     | 40  |     | 50  | 60  | 70  |     | 80  |
| --- | --- | --- | --- | --- | --- | --- | --- |
fitted
WaspassiertbeianderemBasisfall?
Derzeit ist der Basisfall “0 Lernstunden, Selbststudium”. Wie ändern sich die Koeﬀizienten, wenn
wir die Basisgruppe ändern? Fangen wir mit den Lernstunden an und nehmen 5 Stunden lernen als
Referenz:
| lernen$stunden5 | =   | lernen$stunden | - 5 |     |     |     |     |
| --------------- | --- | -------------- | --- | --- | --- | --- | --- |
# 'stunden5 * format' ist die Kurzschreibweise für 'stunden5 + format + stunden5:format'
modell3 = stan_glm(punkte ~ stunden5 * format, data=lernen, seed=1234, refresh=0)
|           | (Intercept) | stunden | formatBetreuung | stunden:formatBetreuung |     |     |     |
| --------- | ----------- | ------- | --------------- | ----------------------- | --- | --- | --- |
| ursprung  |             | 34      | 2.2             | 3.9                     |     | 2.7 |     |
| zentriert |             | 45      | 2.2             | 17.7                    |     | 2.7 |     |
WarumhatsichderGruppenunterschiedformatBetreuungnunsostarkverändert?
DerIntercepthatsichverändertweilnunderBasisfalldieGruppeSelbststudiummit5Lernstundenist,
nichtmehrmit0Stunden. DeshalbistjetztauchderIntercepthöher,nämlichum5×2.2(Koeﬀizient
LVDAA,ArnoHollosi 4

WaspassiertbeiandererReferenzgruppe? MOTIVATION:EINEZAHLREICHTNICHTIMMER
für Stunden). Der Gruppenkoeﬀizient für die Betreuung (formatBetreuung) hat sich aus demselben
Grundgeändert. ErgibtweiterhindenUnterschiedzurGruppedesSelbststudiumsan, abernunden
Unterschied bei 5 Lernstunden (und nicht mehr den Unterschied bei 0 Lernstunden). Und zu diesem
ZeitpunktistbereitsfünfmaldiehöhereSteigungderGruppebetreuungeingegangen. Soergibtsichder
neueWertvon17.7(3.9+5×2.75).
Waswirdarauslernen,ist,dasswirausderAussage“derGruppenkoeﬀizientistklein”nichtdenSchluss
ziehendürfen“Betreuungwirktnicht”. Je nach Referenzpunktkönnenwirden Koeﬀizientenfürden
Gruppenunterschiedbeliebiggroßoderklein,jasogarnullodernegativmachen. DerZusammenhang
imDatensatzjedochbleibtimmerdergleiche!
Welcher Referenzpunkt ist also der richtige? Sind es null Lernstunden wie im Modell 1, obwohl null
Stunden im Datensatz nicht vorkommen? Oder sind es 5 Lernstunden, was in etwa dem Mittelwert
entspricht? Oderistesetwasganzanderes?
Die provokante Antwort ist, dass alle Referenzpunkte richtig sind! Es ändern sich ja weder die
Daten, noch die Regressionsgeraden selbst. Wir beschreiben die Regressionsgeraden nur durch
unterschiedliche Referenzpunkte. Wir können jeden Referenzpunkt wählen. Aber nicht jeder
Referenzpunkt ist inhaltlich sinnvoll: Liegt er weit außerhalb unserer Beobachtungen, interpretieren
wireinenUnterschied,dendasModellnurextrapoliertundderinRealitätnichtvorkam.
Bei einer Interaktion ist also die Frage “Wie groß ist der Gruppenunterschied?” ohne Angabe des
Referenzwerts unvollständig. Die isolierte Interpretation des Koeﬀizienten alleine gibt uns keine
AuskunftüberdieUnterschiedezwischendenGruppen. DasBeispielzeigt,warummanHaupteffekte
(stunden,formatBetreuung)beiInteraktionennichtisoliertinterpretierensollte.
WaspassiertbeiandererReferenzgruppe?
ÄndernwirnunauchdieReferenzgruppe:
lernen$format2 = relevel(lernen$format, ref="Betreuung")
modell4 = stan_glm(punkte ~ stunden5 * format2, data=lernen, seed=1234, refresh=0)
coef(modell4)
(Intercept) stunden5
62.6 5.0
format2Selbststudium stunden5:format2Selbststudium
-17.7 -2.8
WasbedeutendieKoeﬀizientennun?
DerBasisfallistnundieGruppeBetreuungbei5LernstundenunderzieltlautIntercept62Testpunkte.
DerKoeﬀicientfürStundenstelltnundieSteigungfürdieGruppeBetreuungdar,dadiesenununsere
Referenzgruppeist. Die5TestpunktejeLernstundeDifferenzsindgenaujeneSteigung,diewirvorher
bereitsfürdieGruppeberechnethatten(sieheModelleweiteroben).
Warum haben sich die Vorzeichen für format2Selbststudium und stunden5:format2Selbststudium
umgedreht?
DaderUnterschiedzwischenbeidenGruppenidentischgebliebenist,hatsichderabsoluteWertnicht
verändert. Da aber die Referenz nun die andere Gruppe ist, ergibt sich die Differenz nicht mehr aus
𝐵𝑒𝑡𝑟𝑒𝑢𝑢𝑛𝑔 − 𝑆𝑒𝑙𝑏𝑠𝑡𝑠𝑡𝑢𝑑𝑖𝑢𝑚 sondern aus 𝑆𝑒𝑙𝑏𝑠𝑡𝑠𝑡𝑢𝑑𝑖𝑢𝑚 − 𝐵𝑒𝑡𝑟𝑒𝑢𝑢𝑛𝑔 und damit dreht sich das
Vorzeichenum.
LVDAA,ArnoHollosi 5

WelchesModellistbesser? INTERAKTIONZWEIERMETRISCHERVARIABLEN
WelchesModellistbesser?
WirkönnendievierFragenderModelltestsaufdasnormaleundaufdasInteraktionsmodellanwenden,
umzusehen, obdieModelledenDatensatzgutbeschreiben, systematischeFehlervorliegen, etc. Wir
könnenauchmithilfeeinesTrain-Test-SplitsPrüfen,obdieModellegutaufneueDatenverallgemeinern.
Bzw. wie im Arbeitsblatt Modellvergleich ausgeführt, mithilfe von 𝑅2, loo oder anderen Metriken
prüfen, welches Modell geeigneter für unseren Anwendungsfall ist. Interaktionsmodelle sind nur
sinnvoll, wenn sie uns helfen, die vorliegenden Daten bzw. unseren Anwendungsfall besser zu
modellieren.
Fallstrick: Kaum gemeinsame Datenbereiche
Betrachten wir nun einen verwandten Datensatz: In einem Kursformat lernen die meisten wenig, im
anderenviel:
80
70
60
50
40
30
2.5 5.0 7.5 10.0
Lernstunden
etknuptseT
Getrennte Datenbereiche
format
Selbststudium
Betreuung
Achtung: Hier sind die Regressionsgeraden weit über die jeweiligen Datenpunkte hinaus verlängert.
InwieferndieAussagenderRegressionsgeradenalsogültigsind,alsoz.B.diederBetreuungbeibspw.
zweiLernstundenoderdiedesSelbststudiumsbeiachtLernstundenistnichtklar. Dementsprechend
könnenwirzwardieKoeﬀizienteneineszugehörigenModellsinterpretieren,esstelltsichallerdingsdie
Frage,inwieferndieSteigungdieserLerngeradensinnvollmiteinandervergleichbarsind.
WirsolltenalsoimmerimAugeerhalten,wodierealenBeobachtungenfürbeideGruppenliegen. Ein
ModellkannnämlichauchdortVorhersagenliefern,woeskeineodernursehrwenigeDatengibt.
Interaktion zweier metrischer Variablen
Bisher war die zweite Variable eine Gruppe. Wie sieht eine Interaktion zweier metrischer Variablen
aus? Hier hängt die Steigung einer Variable vom Wert der anderen Variable ab, und umgekehrt.
Eine Interpretation der “nackten” Koeﬀizienten führt hier besonders leicht in die Irre. R hat einen
mitgelieferten Datensatz, welcher die Ozonbelastung in der Luft misst, u.a. abhängig von Wind und
Temperatur. Die Überlegung ist folgende: Je höher die Temperatur umso höher der Ozonwert, aber
LVDAA,ArnoHollosi 6

INTERAKTIONZWEIERMETRISCHERVARIABLEN
je stärker der Wind umso niedriger der Ozonwert, weil der Wind die Schadstoffe verdünnt bzw.
| abtransportiert. |     | Wirgehendavonaus,dasseineInteraktionvorliegt. |     |     |     |     |     |
| ---------------- | --- | --------------------------------------------- | --- | --- | --- | --- | --- |
# Der Datensatz airquality ist im R-Package 'datasets' enthalten
# Wind in mph (Meilen pro Stunde), Temperatur in °Fahrenheit, Ozon in ppb (part per billion)
| # Wir zentrieren      |        | den Datensatz |       | wieder |     |     |     |
| --------------------- | ------ | ------------- | ----- | ------ | --- | --- | --- |
| air = airquality      |        | |>            |       |        |     |     |     |
| filter(!is.na(Ozone)) |        |               | |>    |        |     |     |     |
| mutate(temp80         |        | = Temp        | - 80, |        |     |     |     |
|                       | wind10 | = Wind        | - 10) |        |     |     |     |
m_ozon = stan_glm(Ozone ~ temp80 * wind10, data=air, seed=1234, refresh=0)
coef(m_ozon)
| (Intercept) |       |     | temp80 |     | wind10 temp80:wind10 |       |     |
| ----------- | ----- | --- | ------ | --- | -------------------- | ----- | --- |
|             | 41.74 |     | 1.85   |     | -3.57                | -0.22 |     |
Wie bereits einleitend angedeutet ist nun Vorsicht angebracht. Wir können nicht einfach sagen, die
Ozonwerteändernsich(generell)um1.8ppbpro°FUnterschiedoderum-3.6ppbpromphWindstärke
Unterschied. DenndieSteigungbeiderändertsichabhängigvontemp80:wind10! DieWertegeltennur
fürdenBasisfall. HieristderBasisfall(nachzentrieren,d.h. X-Variablesind0)bei10mphWindstärke
und80°F.Dasheißt,die1.8ppbpro°FUnterschiedgeltennurbei10mphWindstärke. Analoggelten
die-3.6ppbUnterschiedpromphWindstärkenurbei80°F.
Beiz.B.15mphändertsichderOzonwertum~0.7ppb/°F–errechnetsichausderSteigungdesBasisfalls
(1.8ppb/°F)plus5xSteigungsänderungjemph(5mphDifferenzzuBasisfallvon10mph),also5x-0.21.
Analog,beimWind. Beiz.B.90°FändertsichderOzonwertumca. -5.8ppb/mph.
Anmerkung: AuchhierhatdieWahldesBasisfallsEinflussaufdieGrößederKoeﬀizienten. Probieren
SieunterschiedlicheReferenzpunkteausundüberlegenSiesich,warumundwiesichdieKoeﬀizienten
geänderthaben.
Am sinnvollsten ist es nun, die Interaktion visuell darzustellen. Bspw. Ozon in Abhängigkeit von
TemperaturbeieinigenWindstärken:
120
80
Wind (mph)
)bpp( nozO
5
10
40
15
0
|     |     | 60  |     | 70  | 80  | 90  | 100 |
| --- | --- | --- | --- | --- | --- | --- | --- |
Temperatur (°F)
LVDAA,ArnoHollosi 7

EineFlächestattvielerLinien WANNINTERAKTIONVERWENDEN?
EineFlächestattvielerLinien
StattvieleLinieninunterschiedlicheDiagrammezumalen,könnenwirdieInteraktionauchalsFläche
darstellen und so die Auswirkung der Interaktion visualisieren (die Punkte zeigen die tatsächlich
gemessenenWerteimDatensatz):
20
15
10
5
0
60 70 80 90 100
Temperatur (°F)
)hpm(
dniW
Vorhersage
150
100
50
0
Fragen: WonimmtOzonmitsteigenderTemperaturstarkzu? Woeherschwach? Wieerkenntmandas
amAbstandundderRichtungderKonturlinien? WaslässtsichausdemPlotnichtablesen? Inwelchen
BereichendesDiagrammssinddieVorhersagengutdurchBeobachtungengestützt? Woverlassenwir
unsstärkeraufModellannahmen?
Wann Interaktion verwenden?
Interaktions-Modellesindnichtimmerautomatischrichtig. DereinfachsteFallist,wennsichausdem
Fachwissen heraus eine Interaktion aufdrängt, sei es z.B. im Gesundheitsbereich eine Interaktion mit
RauchenoderimphysikalischenBereichwieimOzonbeispielzwischenTemperaturundWind. Injedem
FallsolltenwirdieModellgüteüberprüfen,mithilfederTestswieimArbeitsblattModelltestsdiskutiert.
Zudemsolltenwirprüfen,obdiebeobachtetenUnterschiedetatsächlicheineInteraktionerfordernoder
auchdurcheinebishernichtberücksichtigteNichtlinearitäterklärtwerdenkönnen. Vielleichtbrauchen
wirauchbeides. Modelltestssindalsoimmernotwendig,umdieQualitäteinesModellseinzuschätzen.
SichdabeibloßaufdieerklärteVarianzeinesModellszuverlassen(𝑅2)greiftzukurz.
Berechnungen prüfen, Daten visualisieren, Modellergebnisse visualisieren, etc. sind deshalb immer
essentielleSchrittederModellierungeinesZusammenhangsbzw. einerForschungsfrage.
BetrachtenSiebspw. folgendeAussagenundentscheidenSiejeweils: sinnvoll,nurbedingt,odernicht
gedeckt.
• EinMedikamentkönntebeiälterenundjüngerenPersonenunterschiedlichwirken.
• EinInteraktionskoeﬀizientvon−2bedeutet,dassdieZielgrößeüberallum2sinkt.
• AuchohnesignifikantenGruppen-HaupteffektkannsichdieGruppensteigungunterscheiden.
• Einbesseres𝑅2beweistdieInteraktion.
• Wirsolltenvorabüberlegen,welcheModeratorenfachlichplausibelsind.
LVDAA,ArnoHollosi 8

PrüfungenvorjederInterpretation WANNINTERAKTIONVERWENDEN?
• AuseinemInteraktionsmodellkannichautomatischkausaleEmpfehlungenableiten.
• FürVorhersagensindkonkreteFallkonstellationenoftverständlicheralsKoeﬀizienten.
PrüfungenvorjederInterpretation
BevorwirKoeﬀizienteninterpretierenundsodemModell“Aussagenentlocken”,solltenwirfolgende
Tests durchführen. Einerseits sind es generische Modell-Tests, andererseits sind hier einige spezielle
Überlegungenerwähnt,diewirunsfürInteraktionsmodelleüberlegensollten:
• Sampling: HatMC-StandasSamplingguthinbekommen? (effektiveSample-Anzahl,Sampling-
KettenimselbenWertebereich,…)
• Posterior-/Predictive Check bzw. Modellcheck: Sind Vorhersagen und Residuen plausibel?
ÜbersehenwirKrümmung,AusreißeroderungleicheStreuung?
• Systematischer Fehler: Welche Drittvariablen könnten den beobachteten Unterschied erklären?
Sindwirdabei,einenZusammenhangkausalzudeuten?
• Daten: Woher stammen die Daten? Haben alle Gruppen vergleichbare Wertebereiche? Gibt es
genügendBeobachtungenindeninteressierendenKombinationen?
• Modellvergleichbzw. Train/Test: VerbessertdieInteraktionVorhersagenaufneuenDatenoder
nurdieAnpassungandievorhandenen?
LVDAA,ArnoHollosi 9