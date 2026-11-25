<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/02c-Vorhersagen-Samples.pdf -->

Vorhersagen mit linearen Modellen
ArnoHollosi
Contents
Vorhersage 1
R-Funktionen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1
Wahrscheinlichkeiten . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Unterschied . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
Entscheidungen 5
KosteneinerEntscheidung . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
WiegutwarunsereEntscheidung? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
WannistdasModellbesser? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
Vorhersage
WenneinModellerstelltist,könnenwirfürneue(odervorhandene)DatensätzedieabhängigeVariable
vorhersagen. EsgibtinderGleichung𝑦 ∼ 𝛼+𝛽𝑥+𝜖zweiArten,wieUngenauigkeitindieVorhersage
einfließenkann:
1. über die Koeﬀizienten 𝛼 und 𝛽: deren Werte könnten zwar für den ursprünglichen Datensatz
exakt bestimmt werden, aber bei einer Extrapolation auf die Gesamtpopulation ergeben sich
Ungenauigkeiten, weil wir nur ein Sample der Population haben –> das sind die besprochenen
IntervallefürdieKoeﬀizienten;
2. über 𝜖: das Modell hat einen generellen Fehlerterm, selbst wenn 𝛼 und 𝛽 exakt bekannt wären.
In𝜖sindalleUmwelteinflüsseenthalten,dienichtimModellalsVariablenrepräsentiertsind(z.B.
Messfehler,fehlendeVariable,…).1
R-Funktionen
Es gibt drei Funktionen, welche für die Vorhersage genützt werden können: predict(), für
Punktvorhersagen, posterior_epred(), wenn nur die Unschärfe von 𝛼 und 𝛽 eine Rolle spielen
soll; und posterior_predict(), wenn zusätzlich auch 𝜖 für die Vorhersage berücksichtigt werden
soll. Für neue Daten nimmt man typischerweise letztere Funktion, wenn man am Intervall der
Einzelvorhersageinteressiertist. DiebeidenletzterenFunktionenlieferneineMatrixretour,welchefür
jedenDatensatz4000Samples(Default)fürdieVorhersageerzeugt2.
Wir verwenden wieder das Body-Modell aus dem vorigen Arbeitsblatt, trainieren es aber nur auf die
ersten257Datensätze,damitwirdieletzten250DatensätzealsdemModellbislangunbekannte,neue
Datenverwendenkönnen.
1𝜖entsprichtalsodenResiduen. DerimRegressionsmodellermittelteKoeﬀizient𝜎entsprichtderStandardabweichungder
VerteilungderResiduen.Jegrößer𝜎,umsogrößereResiduen,umsowenigerErklärungskrafthatdasModell.
2basierendaufden4000Samples(1000jeChain,4Chains)desPosteriorsdesModells.
1

R-Funktionen VORHERSAGE
stan_glm
| family:       |     | gaussian |     | [identity] |       |          |     |
| ------------- | --- | -------- | --- | ---------- | ----- | -------- | --- |
| formula:      |     | Weight   | ~   | Height     | + Age | + Gender |     |
| observations: |     | 257      |     |            |       |          |     |
| predictors:   |     | 4        |     |            |       |          |     |
------
|             |               | Median | MAD_SD |     |     |     |     |
| ----------- | ------------- | ------ | ------ | --- | --- | --- | --- |
| (Intercept) |               | -77.36 | 12.16  |     |     |     |     |
| Height      |               | 0.80   | 0.07   |     |     |     |     |
| Age         |               | 0.19   | 0.05   |     |     |     |     |
| GenderMale  |               | 7.04   | 1.38   |     |     |     |     |
| Auxiliary   | parameter(s): |        |        |     |     |     |     |
Median MAD_SD
| sigma | 7.83 | 0.33 |     |     |     |     |     |
| ----- | ---- | ---- | --- | --- | --- | --- | --- |
------
| * For | help interpreting |            |     | the printed | output                 | see | ?print.stanreg |
| ----- | ----------------- | ---------- | --- | ----------- | ---------------------- | --- | -------------- |
| * For | info on           | the priors |     | used see    | ?prior_summary.stanreg |     |                |
VerwendenwirnunalledreiFunktionen,umeineVorhersagefürzweidefiniertePersonenzumachen:
| # Beispiel: | Mann,                      | 48  | Jahre,             | 196cm   |           |           |             |
| ----------- | -------------------------- | --- | ------------------ | ------- | --------- | --------- | ----------- |
| #           | Frau,                      | 36  | Jahre,             | 171cm   |           |           |             |
| body_new    | = data.frame(Height=c(171, |     |                    |         | 196),     |           |             |
|             |                            |     | Age=c(36,          | 48),    |           |           |             |
|             |                            |     | Gender=c('Female', |         |           | 'Male'))  |             |
| # predict() | retourniert                |     | die                | "beste" | Schätzung |           | des Modells |
| point_pred  | = predict(modell,          |     |                    | newdata | =         | body_new) |             |
point_pred
| 1   | 2   |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
66.1 95.4
# ohne Epsilon
| epred =       | posterior_epred(modell, |             |     | newdata   |           | = body_new) |     |
| ------------- | ----------------------- | ----------- | --- | --------- | --------- | ----------- | --- |
| hdi(epred,    | add=median)             |             |     |           |           |             |     |
| lwr           | upr                     | median      |     |           |           |             |     |
| 1 64.3        | 67.9                    | 66.1        |     |           |           |             |     |
| 2 92.1        | 98.7                    | 95.4        |     |           |           |             |     |
| # mit Epsilon |                         | -- deutlich |     | breiteres | Intervall |             |     |
pred = posterior_predict(modell, newdata = body_new, seed=4567)
| hdi(pred, | add=median) |        |     |     |     |     |     |
| --------- | ----------- | ------ | --- | --- | --- | --- | --- |
| lwr       | upr         | median |     |     |     |     |     |
| 1 49.8    | 81.1        | 66.1   |     |     |     |     |     |
| 2 80.6    | 111.6       | 95.2   |     |     |     |     |     |
Mansieht,dassderfitderbeidenspäterenFunktionenziemlichgenauderPunktvorhersageentspricht.
Der fit ist der Median aller Samples, insoferne ist es nachvollziehbar, dass dieses letztlich mit der
Punktvorhersageübereinstimmt.
LVDAA,ArnoHollosi 2

Wahrscheinlichkeiten VORHERSAGE
DasersteIntervallentsprichtderUnsicherheitderKoeﬀizienten,wennwiraufdiePopulationschließen.
Andersausgedrückt:wennwirdenMittelwertdesGewichtsaller36JahrealterFraueninderPopulation,
die171cmgroßsind,berechneten,dannwürdenwirerwarten,dassderPopulationsmittelwertirgendwo
imIntervallvon64kgbis68kgliegt. DasIntervallbeschreibtalsoeinenerwartetenDurchschnittswert,
nichtdasIntervallfüreineneinzelnenFall.
ImzweitenFallistdasIntervalldeutlichbreiter,weilesdenFehlerterm𝜖miteinschließt3. Esbeschreibt
alsodasIntervalldesGewichtseinereinzelnenPerson. Andersausgedrückt: wennwireinebeliebige
Frau,die36Jahrealtund171cmgroßist,ausderPopulationwählenwürden,dannhatdiese(zu95%)
einGewichtzwischen50kgund81kg.
Gedankenspiel: wennunserSamplediegesamtePopulationumfasst,dannsinddieKoeﬀizientenexakt
bekannt–esgibtkeineUnsicherheitmehr. DannwürdedasIntervallvonposterior_epred()aufNull
schrumpfen,weilesbeidenModellkoeﬀizientenkeineUnsicherheitmehrgibt. AberdasIntervallvon
posterior_predict()würdenichtaufNullsondernaufca. 4𝜎 schrumpfen. WeilebeneinRest(der
FehlertermdesModells)vomModellnichterfasstwirdundderEinzelfalldahernieexaktvorhergesagt
wird.
Wahrscheinlichkeiten
Dawir(dankBayes-Modell)mitechtenVerteilungenarbeiten,könnenwirdieseweiterverwenden,z.B.
umweitereAussagenzutreffen:
| # Daten             | von oben |             |     |     |     |     |
| ------------------- | -------- | ----------- | --- | --- | --- | --- |
| epred_sample_female |          | = epred[,1] |     |     |     |     |
| epred_sample_male   |          | = epred[,2] |     |     |     |     |
| pred_sample_female  |          | = pred[,1]  |     |     |     |     |
| pred_sample_male    | =        | pred[,2]    |     |     |     |     |
# Wie wahrscheinlich wiegt die Frau (36, 171cm) zwischen 55 und 60kg?
| # -> 16%                | Wahrscheinlichkeit |     |                         |     |     |       |
| ----------------------- | ------------------ | --- | ----------------------- | --- | --- | ----- |
| mean(pred_sample_female |                    | >=  | 55 & pred_sample_female |     |     | < 60) |
[1] 0.142
# Wie wahrscheinlich ist der Mann (48, 196cm) schwerer als 90kg?
| # -> 63%              | Wahrscheinlichkeit |       |     |     |     |     |
| --------------------- | ------------------ | ----- | --- | --- | --- | --- |
| mean(pred_sample_male |                    | > 90) |     |     |     |     |
[1] 0.737
# Von allen Männern der Population die 48 Jahre alt und 196cm groß sind:
# Welches mittlere Gewicht erwarten wir (mit Angabe von Quartilen)?
| quantile(epred_sample_male,   |            |       | c(0.25,  | 0.5, | 0.75))       |     |
| ----------------------------- | ---------- | ----- | -------- | ---- | ------------ | --- |
| 25%                           | 50% 75%    |       |          |      |              |     |
| 94.3                          | 95.4 96.5  |       |          |      |              |     |
| # Und bei                     | den Frauen | (alle | 36 Jahre | alt, | 171cm groß): |     |
| quantile(epred_sample_female, |            |       | c(0.25,  | 0.5, | 0.75))       |     |
| 25%                           | 50% 75%    |       |          |      |              |     |
| 65.4                          | 66.1 66.7  |       |          |      |              |     |
3Eskommenetwaswenigerals4𝜎desModellsbeim95%-Intervalldazu: derSigma-KoeﬀizientrepräsentiertdieGrößeder
Residuen.ImModellist𝜎=8.8kg,d.h.diebeidenVorhersagenunterscheidensichumetwaswenigerals2×8.8=17.6kgin
jedeRichtung(lwrundupr).
LVDAA,ArnoHollosi 3

Unterschied VORHERSAGE
Unterschied
Ebenfalls möglich ist es, z.B. Unterschiede zu berechnen. Wenn wir nur am Unterschied der
Modellvorhersage (ohne Fehlerterm) interessiert sind – also am durchschnittlichen Unterschied
zwischendengewähltenPersonen–dannsolltenwirposterior_epred()verwenden.
MitdenDaten
vonvorher, wasistderUnterschiedlautModellzwischendenbeidenPersonen? NimmtmanEpsilon
mit hinein (posterior_predict()), stellt man sich also die Frage: Wenn ich zwei beliebige Personen
mitdengenanntenDatenausderPopulationherauspicke,wiegroßistdannderUnterschied?
| epred_diff |     | =                  | epred_sample_male |     |     | - epred_sample_female |     |     |     |     |
| ---------- | --- | ------------------ | ----------------- | --- | --- | --------------------- | --- | --- | --- | --- |
| pred_diff  |     | = pred_sample_male |                   |     | -   | pred_sample_female    |     |     |     |     |
par(mfrow=c(1,2))
| plothist(epred_diff, |                   |         |     | main='Differenz |     |             | (epred)', |     | xlab='')            |        |
| -------------------- | ----------------- | ------- | --- | --------------- | --- | ----------- | --------- | --- | ------------------- | ------ |
| plothist(pred_diff,  |                   |         |     | main='Differenz |     | (predict)', |           |     | xlab='')            |        |
|                      | Differenz (epred) |         |     |                 |     |             |           |     | Differenz (predict) |        |
|                      | median            |         | =   | 29.3            |     |             |           |     | median              | = 29.4 |
|                      |                   | 95% HDI |     |                 |     |             |           |     | 95% HDI             |        |
|                      | 26.8              |         |     | 32              |     |             |           |     | 6.17                | 49.4   |
| 24                   | 26                | 28      | 30  | 32              | 34  |             |           |     | 0 20                | 40 60  |
Es ist deutlich zu sehen, wie sehr der Fehlerterm 𝜖 (Einflüsse, die von Modell nicht erfasst sind) das
Intervall der Differenz verbreitet. Die durchschnittliche Differenz von 29kg ist aber in beiden Fällen
gleich.
WirkönntenunsauchdieFragestellen,wiewahrscheinlichesist,dassdieDifferenzkleiner10kgist:
| #              | die Wahrscheinlichkeit, |              |       |             | dass | die Differenz |      | zwischen | einer       |     |
| -------------- | ----------------------- | ------------ | ----- | ----------- | ---- | ------------- | ---- | -------- | ----------- | --- |
| #              | zufällig                | ausgewählten |       | Frau        | (36, | 171cm)        | und  | einem    | zufällig    |     |
| #              | ausgewählten            |              | Mann  | (38, 196cm) |      | kleiner       | 10kg | ist,     | beträgt ~8% |     |
| mean(pred_diff |                         |              | < 10) |             |      |               |      |          |             |     |
[1] 0.0437
| #              | und dass | die | Frau | schwerer | als | der | Mann | ist: | ~1.6% |     |
| -------------- | -------- | --- | ---- | -------- | --- | --- | ---- | ---- | ----- | --- |
| mean(pred_diff |          |     | < 0) |          |     |     |      |      |       |     |
[1] 0.00575
LVDAA,ArnoHollosi 4

ENTSCHEIDUNGEN
Entscheidungen
Angenommen, wir sind eine Fluggesellschaft und wollen das maximale Ladegewicht ausnützen. Wir
kennenAlter,GeschlechtundGrößeunsererPassagiere(habenwirausReisepass-Daten),ihrGewicht
kennenwirvordemFlugabernicht.
WennwirzuvielGewichteinplanen,lassenwirunnötigLadungzurück. PlanenwirzuwenigGewicht
ein, istdasFlugzeugschwereralserwartetundbereitseingeplanteLadungkannnichtmitgenommen
werden. WirmüssenalsoeineEntscheidungtreffen,mitwelchemGesamtgewichtwirplanen.
AlsBeispiel-DatensatzverwendenwirdenPoolaus250Personenausbody_test,welchedemModell
bisherunbekanntsind. UnsereFlugzeugefassen150Passagiere,wählenwiralsozufällig150Personen
ausden250aus:
set.seed(123)
| passagiere   | = slice_sample(body_test, |                | n=150) |     |     |
| ------------ | ------------------------- | -------------- | ------ | --- | --- |
| # Vorhersage | für alle                  | 150 Passagiere |        |     |     |
ppred = posterior_predict(modell, newdata=passagiere, seed=9876)
# Jede Zeile entspricht einem möglichen Gesamtgewicht des Fluges
| gesamtgewicht           | = rowSums(ppred) |               |              |          |     |
| ----------------------- | ---------------- | ------------- | ------------ | -------- | --- |
| plothist(gesamtgewicht, |                  | credMass=0.9, |              |          |     |
|                         | main='Mögliches  | Gesamtgewicht | des Fluges', | xlab='') |     |
Mögliches Gesamtgewicht des Fluges
=
|     |     | median | 10300 |     |     |
| --- | --- | ------ | ----- | --- | --- |
90% HDI
|     | 10100 |       | 10500 |       |       |
| --- | ----- | ----- | ----- | ----- | ----- |
|     | 10000 | 10200 | 10400 | 10600 | 10800 |
WirerhalteneineVerteilungmöglicherGesamtgewichte. Das95%-HDIentsprichtinetwademGewicht
von±3Personen. FürunsereEntscheidungmüssenwirnunfestlegen,mitwelchemGewichtwirplanen.
KosteneinerEntscheidung
Angenommen, jedes Kilogramm zu viel eingeplantes Gewicht kostet uns 5,- €: wir hätten stattdessen
zusätzliche Ladung mitnehmen können. Jedes Kilogramm zu wenig eingeplantes Gewicht kostet
dagegen 15,- €, weil bereits geplante Ladung zurückbleiben und auf Folgeflüge verteilt werden muss.
UnsereKostenfunktionsiehtdamitsoaus:
LVDAA,ArnoHollosi 5

| KosteneinerEntscheidung |        |     |                            |     |     |     |     |         | ENTSCHEIDUNGEN |     |
| ----------------------- | ------ | --- | -------------------------- | --- | --- | --- | --- | ------- | -------------- | --- |
|                         |        |     | 15×(𝐺𝑒𝑤𝑖𝑐ℎ𝑡−𝐸𝑛𝑡𝑠𝑐ℎ𝑒𝑖𝑑𝑢𝑛𝑔), |     |     |     |     | 𝐺𝑒𝑤𝑖𝑐ℎ𝑡 | > 𝐸𝑛𝑡𝑠𝑐ℎ𝑒𝑖𝑑𝑢𝑛𝑔 |     |
|                         | 𝐾𝑜𝑠𝑡𝑒𝑛 |     | = {                        |     |     |     |     |         |                |     |
|                         |        |     | 5×(𝐸𝑛𝑡𝑠𝑐ℎ𝑒𝑖𝑑𝑢𝑛𝑔−𝐺𝑒𝑤𝑖𝑐ℎ𝑡),  |     |     |     |     | 𝐺𝑒𝑤𝑖𝑐ℎ𝑡 | < 𝐸𝑛𝑡𝑠𝑐ℎ𝑒𝑖𝑑𝑢𝑛𝑔 |     |
WirkönntenbeispielsweiseeinfachdenMittelwertunserervorhergesagtenGesamtgewichteverwenden:
mean(gesamtgewicht)
[1] 10336
Aber ist das tatsächlich die beste Entscheidung? Wir können für jede mögliche Entscheidung
ausrechnen, welche Kosten über unsere posterior-prädiktiven Samples im Durchschnitt entstehen
würden:
gewicht_seq = seq(min(gesamtgewicht), max(gesamtgewicht), length.out=200)
| erwartete_kosten |                               |                  | = sapply(gewicht_seq, |       |          | function(gewicht) |     | {   |     |     |
| ---------------- | ----------------------------- | ---------------- | --------------------- | ----- | -------- | ----------------- | --- | --- | --- | --- |
|                  | kosten = ifelse(gesamtgewicht |                  |                       | >     | gewicht, |                   |     |     |     |     |
|                  | (gesamtgewicht                |                  | - gewicht)            | * 15, |          |                   |     |     |     |     |
|                  | (gewicht                      | - gesamtgewicht) |                       | * 5   |          |                   |     |     |     |     |
)
mean(kosten)
})
| plot(gewicht_seq, |                    |     | erwartete_kosten, |           | type='l', |                 |           |          |     |     |
| ----------------- | ------------------ | --- | ----------------- | --------- | --------- | --------------- | --------- | -------- | --- | --- |
|                   | xlab='Eingeplantes |     | Gesamtgewicht',   |           |           | ylab='Erwartete |           | Kosten', |     |     |
|                   | main='Welche       |     | Entscheidung      | minimiert |           | unsere          | Kosten?') |          |     |     |
Welche Entscheidung minimiert unsere Kosten?
0007
netsoK etetrawrE
0005
0003
0001
|     |     |     | 10000 |     | 10200 |     | 10400 |     | 10600 | 10800 |
| --- | --- | --- | ----- | --- | ----- | --- | ----- | --- | ----- | ----- |
Eingeplantes Gesamtgewicht
DieoptimaleEntscheidung,alsodasMinimumdererwartetenKosten,istbei:4
| entscheidung |     | = gewicht_seq[which.min(erwartete_kosten)] |     |     |     |     |     |     |     |     |
| ------------ | --- | ------------------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- |
entscheidung
4Es gäbe auch einen anderen Weg bei einer solchen asymmetrischen Kostenfunktion: ein bestimmtes Quantil der
Vorhersageverteilung ist optimal. Bei uns kostet Unterschätzen: 15€/kg und Überschätzen 5€/kg. Daher liegt die optimale
Entscheidungbeim 15 = 0.75QuantilunsererVorhersageverteilung. BeigleichhohenKostenfürÜber-undUnterschätzen
15+5
wäredagegendas50%-Quantil,alsoderMedian,dieoptimaleEntscheidung.
LVDAA,ArnoHollosi 6

WiegutwarunsereEntscheidung? ENTSCHEIDUNGEN
[1] 10416
Da Unterschätzen für uns dreimal so teuer ist wie Überschätzen planen wir also vorsichtiger und
verwendeneinGewicht,dasoberhalbderMitteunsererVorhersageverteilungliegt.
WiegutwarunsereEntscheidung?
Bei echten zukünftigen Passagieren kennen wir deren echtes Gewicht natürlich nicht. In unserem
TestdatensatzistunsdastatsächlicheGewichtaberbekannt. Daherkönnenwirnachträglichüberprüfen,
welcheKostentatsächlichentstandenwären.
| gewicht_real |              | = sum(passagiere$Weight) |                |            |     |          |      |
| ------------ | ------------ | ------------------------ | -------------- | ---------- | --- | -------- | ---- |
| diff =       | entscheidung |                          | - gewicht_real |            |     |          |      |
| kosten_real  |              | = ifelse(diff            |                | < 0, -diff | *   | 15, diff | * 5) |
c(entscheidung=entscheidung,
gewicht_real=gewicht_real,
kosten_real=kosten_real)
| entscheidung |       | gewicht_real |       | kosten_real |      |     |     |
| ------------ | ----- | ------------ | ----- | ----------- | ---- | --- | --- |
|              | 10416 |              | 10496 |             | 1190 |     |     |
Wichtig ist also die Trennung zwischen Vorhersage und Entscheidung: posterior_predict()
liefert uns eine Verteilung möglicher Gewichte. Daraus leiten wir dann unter Berücksichtigung der
Kostenfunktion in Folge die optimale Entscheidung ab. Die beste Vorhersage (hier: Median) und die
besteEntscheidung(hier: MinimumdererwartetenKosten)müssenalsonichtdasselbesein.
WannistdasModellbesser?
Angenommen,wirhättenvorderEntwicklungunseresModellseinfachmiteinemdurchschnittlichen
Gewicht von 69 kg pro Passagier gerechnet (dem Mittelwert des Gewichts im Datensatz). Für
|     |     |     |     |     |     | 69 × | 150 = 10350 |
| --- | --- | --- | --- | --- | --- | ---- | ----------- |
150 Passagiere hätten wir daher immer mit kg geplant. Welche der beiden
Entscheidungsregelnistbesser?
| 1. AlteRegel: |     | immer69kgproPassagierannehmen. |     |     |     |     |     |
| ------------- | --- | ------------------------------ | --- | --- | --- | --- | --- |
2. Modell: fürdiekonkretenPassagiereeineVorhersageverteilungberechnenundderenMinimum
verwenden.
Um beide Ansätze fair zu vergleichen, müssen sie auf mehreren Flügen testen. Wir verwenden dafür
die250PersonenausunseremTestdatensatzundstellendarausimmerwiederFlügemit150Passagieren
zusammen:
| n_fluege      | = 500 |                     |     |     |     |     |     |
| ------------- | ----- | ------------------- | --- | --- | --- | --- | --- |
| kosten_modell |       | = numeric(n_fluege) |     |     |     |     |     |
| kosten_alt    | =     | numeric(n_fluege)   |     |     |     |     |     |
set.seed(1234)
| for (i         | in 1:n_fluege) |                           | {                        |             |           |                |               |
| -------------- | -------------- | ------------------------- | ------------------------ | ----------- | --------- | -------------- | ------------- |
| # 150          | Personen       | für                       | diesen                   | Flug        | auswählen |                |               |
| passagiere_i   |                | = slice_sample(body_test, |                          |             |           | n=150,         | replace=TRUE) |
| gewicht_real_i |                | =                         | sum(passagiere_i$Weight) |             |           |                |               |
| # optimale     |                | Entscheidung              |                          | bei unserer |           | Kostenfunktion |               |
ppred_i = posterior_predict(modell, newdata=passagiere_i, draws=1000)
| gesamtgewicht_i |     | =   | rowSums(ppred_i) |     |     |     |     |
| --------------- | --- | --- | ---------------- | --- | --- | --- | --- |
gewicht_seq_i = seq(min(gesamtgewicht_i), max(gesamtgewicht_i), length.out=200)
LVDAA,ArnoHollosi 7

| WannistdasModellbesser? |                          |                         |                    |                   | ENTSCHEIDUNGEN |     |
| ----------------------- | ------------------------ | ----------------------- | ------------------ | ----------------- | -------------- | --- |
| erwartete_kosten_i      |                          | = sapply(gewicht_seq_i, |                    | function(gewicht) | {              |     |
| kosten                  | = ifelse(gesamtgewicht_i |                         | > gewicht,         |                   |                |     |
|                         |                          | (gesamtgewicht_i        | - gewicht)         | * 15,             |                |     |
|                         |                          | (gewicht                | - gesamtgewicht_i) | * 5)              |                |     |
mean(kosten)
})
| entscheidung_i | =              | gewicht_seq_i[which.min(erwartete_kosten_i)] |                |     |     |     |
| -------------- | -------------- | -------------------------------------------- | -------------- | --- | --- | --- |
| diff_i =       | entscheidung_i | -                                            | gewicht_real_i |     |     |     |
kosten_modell[i] = ifelse(diff_i < 0, -diff_i * 15, diff_i * 5)
| # Entscheidung     | mit                  | der alten | 69-kg-Regel      |     |     |     |
| ------------------ | -------------------- | --------- | ---------------- | --- | --- | --- |
| entscheidung_alt_i |                      | = 69 *    | 150              |     |     |     |
| diff_alt_i         | = entscheidung_alt_i |           | - gewicht_real_i |     |     |     |
kosten_alt[i] = ifelse(diff_alt_i < 0, -diff_alt_i * 15, diff_alt_i * 5)
}
NunkönnenwirdiedurchschnittlichenKostenproFlugvergleichen:
c(
| Modell =     | mean(kosten_modell), |     |     |     |     |     |
| ------------ | -------------------- | --- | --- | --- | --- | --- |
| `69kg-Regel` | = mean(kosten_alt)   |     |     |     |     |     |
)
| Modell | 69kg-Regel |     |     |     |     |     |
| ------ | ---------- | --- | --- | --- | --- | --- |
2061 2373
MitunseremModellsparenwiralsoimSchnittproFlugca. €310ein. DieVerteilungderKostendifferenz
zwischen69kg-RegelundModellsiehtsoaus:
Kostenersparnis des Modells pro Flug
=
|     |     | mean | 312 |     |     |     |
| --- | --- | ---- | --- | --- | --- | --- |
43.4% < 0 < 56.6%
95% HDI
| −2610 |       |     |     |      | 3790 |      |
| ----- | ----- | --- | --- | ---- | ---- | ---- |
| −4000 | −2000 |     | 0   | 2000 | 4000 | 6000 |
PositiveWertebedeuten,dassunserModellgünstigerwar,negativeWertebedeuten,dassdieeinfache
69kg-Regel bei diesem Flug besser abgeschnitten hätte. Die Bandbreite reicht von -2600..+3800€ und
unserModellschneidetbeiüber56%allerFlügebesserabundimMittelebenum310€.
Der Vergleich zeigt: erst die Vorhersage in Kombination mit einer guten Entscheidungsregel (hier:
minimieren der bekannten Kostenfunktion) kann ein gutes Ergebnis bringen. Das Histogramm führt
unsauchvorAugen,welcheKonsequenzenFehlerindieeineoderandereRichtunghaben.
LVDAA,ArnoHollosi 8

WannistdasModellbesser? ENTSCHEIDUNGEN
EinzigerWermutstropfen: unsereEntscheidungsregelwurdenurauf250Testpersonenüberprüft. Sind
diese Personen wirklich repräsentativ für alle zukünftigen Fluggäste unserer Fluggesellschaft? Das
ModellbleibtnurdanneineguteGrundlagefürEntscheidungen,wennauchseineVorhersageverteilung
diezukünftigenPassagiereausreichendgutbeschreibt.
LVDAA,ArnoHollosi 9