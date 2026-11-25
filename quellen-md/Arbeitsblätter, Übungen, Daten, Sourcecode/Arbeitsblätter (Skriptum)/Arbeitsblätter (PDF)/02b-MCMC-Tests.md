<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/02b-MCMC-Tests.pdf -->

Bayes & Sampling: Testen des Modells
ArnoHollosi
Contents
MC-Stan 1
KontrolledesSampelns 2
ReproduktionderDaten 4
MittelwertderVorhersagen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
VergleichderVerteilung . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
Statistiken . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
KontrollesystematischerFehler 6
Vergleichdery-Werte . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
Residuen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
KorrelationderParameter 7
BeispielfürFehlerfall 10
Generalisierung 12
Metriken. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
Graphisch . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
Zusammenfassung 14
MC-Stan
Wir verwenden MC-Stan (http://mc-stan.org/), einen MCMC-Sampler, zur Berechnung unserer
Modelle; konkretdasPaketrstanarm, dasvorgefertigte,generischeModelleenthält, welchesichganz
ähnlichzudenklassischenFunktion(lm(),glm())verwendenlassen. SetzenwirdasBeispielmitdem
Körpermaßdatensatz fort: Erstellen wir ein Modell, das die durchschnittliche Größe abhängig vom
GeschlechtunddemKnieumfangberechnet.
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)
model = stan_glm(
formula = Height ~ Gender + Knee.girth, data = body,
# Wir geben mal als Beispiel eigene Priors an
prior_intercept = normal(170, 10),
prior = normal(c(0, 0), c(25, 15)), # Reihenfolge wie in Formel: Gender, Knee
prior_aux = exponential(3/10),
refresh=0
)
1

KONTROLLEDESSAMPELNS
| # Ergebnis   | ansehen   |     |     |     |     |     |     |
| ------------ | --------- | --- | --- | --- | --- | --- | --- |
| print(model, | digits=2) |     |     |     |     |     |     |
stan_glm
| family:       |     | gaussian | [identity] |     |            |     |     |
| ------------- | --- | -------- | ---------- | --- | ---------- | --- | --- |
| formula:      |     | Height   | ~ Gender   | +   | Knee.girth |     |     |
| observations: |     | 507      |            |     |            |     |     |
| predictors:   |     | 3        |            |     |            |     |     |
------
|             | Median        | MAD_SD |      |     |     |     |     |
| ----------- | ------------- | ------ | ---- | --- | --- | --- | --- |
| (Intercept) | 124.94        |        | 4.21 |     |     |     |     |
| GenderMale  |               | 10.68  | 0.61 |     |     |     |     |
| Knee.girth  |               | 1.13   | 0.12 |     |     |     |     |
| Auxiliary   | parameter(s): |        |      |     |     |     |     |
| Median      |               | MAD_SD |      |     |     |     |     |
| sigma 6.29  |               | 0.19   |      |     |     |     |     |
------
| * For help | interpreting |            | the  | printed | output                 | see ?print.stanreg |     |
| ---------- | ------------ | ---------- | ---- | ------- | ---------------------- | ------------------ | --- |
| * For info | on           | the priors | used | see     | ?prior_summary.stanreg |                    |     |
Das Ergebnis zeigt, dass (bei ansonsten gleichen Merkmalen) ein Mann 10.7cm größer als eine
Frau ist und je Zentimeter Knieumfang die Größe um 1.1cm zunimmt. Die Residuen sind mit einer
Standardabweichungvon6.3cmimerwartetenBereich.
WirwollenunsnuninFolgevierFragenstellen:
1. HatdieBerechnung/dasSamplenfunktioniert?
2. ReproduziertdasModelldiewesentlichenEigenschaftenderbeobachtetenDaten?
3. EnthältdasModellsystematischeFehler?
4. FunktioniertesbeiunbekanntenDaten?
KönnenwirallevierFragenpositivbeantworten,dannhabenwireinbrauchbaresModell.
| Kontrolle | des | Sampelns |     |     |     |     |     |
| --------- | --- | -------- | --- | --- | --- | --- | --- |
Man kann sich das Samplen als eine Wanderung (bzw. Springen) durch die Wahrscheinlichkeits-
Landschaft der Daten & Koeﬀizienten vorstellen. MC-Stan unternimmt vier solcher Wanderungen
parallel (=4 chains). In Summe sollten alle vier Pfade zum selben Ergebnis kommen, nicht auf der
Stelle herumtreten (sie sollen stattdessen die gesamte Landschaft erkunden). Die Befehle summary()
bzw. info()gebenunsdienotwendigeInformation:
info(model)
|               |     | median   | mad  |          | lwr upr  | mcse n_eff | Rhat |
| ------------- | --- | -------- | ---- | -------- | -------- | ---------- | ---- |
| (Intercept)   |     | 124.94   | 4.21 | 117.24   | 133.28   | 0.06 4651  | 1    |
| GenderMale    |     | 10.68    | 0.61 | 9.56     | 11.93    | 0.01 4157  | 1    |
| Knee.girth    |     | 1.13     | 0.12 | 0.91     | 1.36     | 0.00 4534  | 1    |
| sigma         |     | 6.29     | 0.19 | 5.91     | 6.68     | 0.00 4467  | 1    |
| mean_PPD      |     | 171.13   | 0.39 | 170.35   | 171.87   | 0.01 4086  | 1    |
| log-posterior |     | -1658.33 | 1.20 | -1661.51 | -1656.71 | 0.03 1935  | 1    |
LVDAA,ArnoHollosi 2

KONTROLLEDESSAMPELNS
n_effgibtunsdieeffektiveSchrittzahl,also“wieweit”derPfadinderLandschaftherumführtoderob
er “auf der Stelle tritt”. Bei 4000 Samples (4 Pfade á 1000 Samples) ist es gut, wenn es mehr als 2000
effektiverSampling-Schrittesind. Unter400wäreschlecht. InunseremModellsiehtdasgutaus.1
DieSpalteRhatgibtan,obdiePfade(vereinfachtausgedrückt)zumselbenErgebniskommen. 𝑅ℎ𝑎𝑡 =
1 bedeutet: ja, alles passt. Werte größer als 1.1 sind problematisch. Wir können das auch graphisch
überprüfen,mitdemsogenanntentraceplot:
mcmc_trace(model)
|     | (Intercept) |     |     |     | GenderMale |     |     |
| --- | ----------- | --- | --- | --- | ---------- | --- | --- |
140
12
| 130 |     |     |     | 11  |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
10
120
9
Chain
| 110 |         |     |          | 8     |         |          |     |
| --- | ------- | --- | -------- | ----- | ------- | -------- | --- |
| 0   | 200 400 | 600 | 800 1000 | 0 200 | 400 600 | 800 1000 | 1   |
2
|     | Knee.girth |     |     |     | sigma |     | 3   |
| --- | ---------- | --- | --- | --- | ----- | --- | --- |
1.6
4
| 1.4 |     |     |     | 6.8 |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1.2 |     |     |     | 6.4 |     |     |     |
1.0
6.0
0.8
5.6
| 0   | 200 400 | 600 | 800 1000 | 0 200 | 400 600 | 800 1000 |     |
| --- | ------- | --- | -------- | ----- | ------- | -------- | --- |
DassiehtwieRauschenausundistauchgutso:o)Wirsehen4PfadeinunterschiedlichenFarben,die
sich alle im selben Bereich befinden (also kein Pfad befindet sich völlig abseits der anderen). Es sind
auch keine deutlichen Muster erkennbar wie bspw. Sinuskurven. Genau das drückt auch 𝑅ℎ𝑎𝑡 = 1
| aus. Urteil: | passt. |     |     |     |     |     |     |
| ------------ | ------ | --- | --- | --- | --- | --- | --- |
DiedritteSpaltegibtdenStandardfehlerdesSamplingsan(mcse=MonteCarloStandardError). Der
| solltemax. | 5%vomMAD(StandardfehlerdesKoeﬀizienten)betragen. |     |     |     |     |     |     |
| ---------- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- |
Indaatoolshabenwirmitcheck_smapling()eineHilfskunktion,diealldieseWertefürunsüberprüft:
check_sampling(model)
| n_eff >=   | 400: Check      | OK.       |              |              |     |     |     |
| ---------- | --------------- | --------- | ------------ | ------------ | --- | --- | --- |
| MCSE <     | 5% of MAD:      | Check OK. |              |              |     |     |     |
| Rhat <=    | 1.01: Check     | OK.       |              |              |     |     |     |
| Sampling   | diagnostics     | (sorted   | by n_eff,    | ascending):  |     |     |     |
|            | n_eff mcse_mad  |           | Rhat         |              |     |     |     |
| GenderMale | 4157            | 0.016     | 1            |              |     |     |     |
| Knee.girth | 4534            | 0.015     | 1            |              |     |     |     |
| mean_PPD   | vs. mean(y):    | Check     | OK.          |              |     |     |     |
| mean(y)    | must lie within | the       | 95% interval | of mean_PPD. |     |     |     |
| mean_PPD   | mean_y          | lower     | upper        |              |     |     |     |
| 171.137    | 171.144         | 170.384   | 171.910      |              |     |     |     |
InSummekönnenwiralsosagen: ja,dasSamplinghatindiesemFallgutfunktioniert.
1Dassauch𝑛
𝑒𝑓𝑓 >4000vorkommthängtdamitzusammen,dassdieZahleineHeuristikistundkeinegenaueBerechnung.
| LVDAA,ArnoHollosi |     |     |     |     |     |     | 3   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- |

REPRODUKTIONDERDATEN
Reproduktion der Daten
WendenwirunsderzweitenFragezu,obdasModelldieDatenguterfasstbzw. reproduziert. Nurwenn
unsereVorhersagenähnlichwiedieDatenaussehen,habenwireinpassendesModell.
MittelwertderVorhersagen
Im Modell gibt es einen Parameter mean_PPD. PPD steht für posterior predictive distribution, was für die
Posterior-Verteilung der vorhergesagten Werte der Daten steht (also predict() für Originaldaten).
Wir erwarten, dass der Mittelwert dieser Verteilung (mean_PPD) in etwa dem Mittelwert der y-Daten
entspricht, beiunsalsomean(body$Height). SolltendieMittelwertedeutlichvoneinanderabweichen,
gibteseinProblemmitdemModell: esistoffensichtlichnichtinderLage,BasiseigenschaftenderDaten
nachzubilden.
VergleichderVerteilung
EsgibteineReiheweitererDiagnosen,welcheunszeigenkönnen,wiegutunserModelldenDatensatz
abbildenkann. DazulassenwirfürdenvorliegendenDatensatzdieVorhersagedesModellsberechnen
undvergleichenimAnschlussdieVorhersagemitdenechtenWerten. DiepassendeVorhersagewirdin
dendiagnose_*()-Funktionenautomatischberechnet.
Wir wünschen uns, dass die Vorhersage die selbe Verteilung (das selbe Histogramm) wie die
Originaldatenhaben. Mitdiagnose_density()könnenwirunsdasansehen. Eswähltzehnder4000
Samples2 aus und zeigt deren Verteilung (density) im Vergleich zu den Originaldaten (dunkelblau).
EssolltemöglichstdengesamtenWertebereichinähnlicherFormabbilden:
diagnose_density(model)
Density of y & y
sample
140 150 160 170 180 190 200 Dsa
Ergebnis sieht ganz ok aus: die hellblauen Verteilungen (Stichprobe der Vorhersagen des Modells)
habeninetwadieselbeFormwiedieder(dunkelblaudargestellten)Daten.
2jedesSamplebestehtaus507Vorhersagen:fürjedeZeiledesDatensatzesinbodyeineVorhersage.
LVDAA,ArnoHollosi 4

| Statistiken |     |     |     |     |     |     |     | REPRODUKTIONDERDATEN |     |     |     |
| ----------- | --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- |
Statistiken
Da wir 4000 Vorhersagen (Samples) des gesamten Datensatzes (507 Personen) haben, können wir
uns auch ansehen, wie gut das Modell Minimum, Maxmimum, Mittelwert, Median und ausgewählte
Quantillen des Originaldatensatzes trifft. Am Beispiel des Maximums: wir berechnen von allen 4000
Samples jeweils das Maximum (der 507 Werte je Sample). Damit erhalten wir 4000 Maxima, welche
als Histogramm angezeigt werden. Die grüne Linie gibt den Wert der Originaldaten an. Liegen die
OriginaldatengutinderVerteilung,trifftunserModelldasMaximumgut. AnalogfürandereWerte.
diagnose_fit(model)
|                     |                     | min(y)     |         |                     |                    | max(y)   |         |       | mean(y)             |       |       |
| ------------------- | ------------------- | ---------- | ------- | ------------------- | ------------------ | -------- | ------- | ----- | ------------------- | ----- | ----- |
|                     |                     | median=146 |         |                     | median=197         |          |         |       | median=171          |       |       |
|                     | 72.3% < 147 < 27.7% |            |         | 65.6% < 198 < 34.4% |                    |          |         |       | 48.9% < 171 < 51.1% |       |       |
|                     |                     | 95% HDI    |         |                     | 95% HDI            |          |         |       | 95% HDI             |       |       |
|                     | 139                 |            | 150     |                     | 192                |          | 204     |       | 170                 |       | 172   |
|                     | 135                 | 140        | 145 150 | 190                 | 195                | 200      | 205 210 | 170.0 | 171.0               |       | 172.0 |
|                     |                     | 2.5%(y)    |         |                     |                    | 97.5%(y) |         |       | 50%(y)              |       |       |
|                     | median=154          |            |         |                     | median=189         |          |         |       | median=171          |       |       |
| 79.2% < 154 < 20.8% |                     |            |         |                     | 94.9% < 190 < 5.1% |          |         |       | 5.2% < 170 < 94.8%  |       |       |
|                     | 95% HDI             |            |         |                     |                    | 95% HDI  |         |       | 95% HDI             |       |       |
| 152                 |                     |            | 156     |                     | 187                |          | 191     |       | 170                 |       | 172   |
| 151                 |                     | 153        | 155 157 | 186                 |                    | 188      | 190 192 | 169.5 | 170.5               | 171.5 | 172.5 |
Wirsehen,dassdieModellverhersagen(hellblaueVerteilungen)dieWertederDatentreffen.
InSummekönnenwiralsosagen: dasModellreproduziertdieEigenschaftenderDatengut.
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     |     | 5   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

KONTROLLESYSTEMATISCHERFEHLER
| Kontrolle |     | systematischer |     |     | Fehler |     |     |     |     |     |     |
| --------- | --- | -------------- | --- | --- | ------ | --- | --- | --- | --- | --- | --- |
KommenwirzurdrittenFrage,obunserModellsystematischeFehleraufweist. Dazuschauenwiruns
ResiduenundVorhersagewertean.
Vergleichdery-Werte
WennwireinenScatterplotvon𝑦 ↔ 𝑦̂ansehen, dannwürdeeinperfektesModellgenaudiey-Werte
vorhersagen. DerPlotwäredanneine45°-Linie. DaunserModellnichtalleWerteperfektvorhersagen
kann,alsoResiduenübrigbleiben,wirdausdieserLinieeinemehroderwenigerbreiteWolke,dieaber
immernochdenselbenNeigungswinkelhabensollte. Bananenformenetc. sindunerwünscht,deuten
sie doch auf einen nichtlinearen Zusammenhang hin. Links oben wird der Mittelwert von einigen
hundertSamplesangezeigt,derRestsindy-WertevonachtzufälligausgewähltenSamples.
diagnose_y_vs_yhat(model)
|       |     | y vs avg(y_hat) |           |     |     | y vs y  |          |       |     | y vs y   |         |
| ----- | --- | --------------- | --------- | --- | --- | ------- | -------- | ----- | --- | -------- | ------- |
|       |     |                 |           |     |     |         | sample1  |       |     |          | sample2 |
| 091   |     |                 |           |     | 091 |         |          | 091   |     |          |         |
| y 071 |     |                 |           | y   | 071 |         |          | y 071 |     |          |         |
| 051   |     |                 |           |     | 051 |         |          | 051   |     |          |         |
|       | 160 | 170             | 180       |     | 150 | 160 170 | 180 190  | 200   | 150 | 160 170  | 180 190 |
|       |     | y vs y (        | sample3 ) |     |     | y vs y  | sample4  |       |     | y vs y   | sample5 |
|       |     | avg ysample     |           |     |     |         | ysample1 |       |     | ysample2 |         |
| 091   |     |                 |           |     | 091 |         |          | 091   |     |          |         |
| y 071 |     |                 |           | y   | 071 |         |          | y 071 |     |          |         |
| 051   |     |                 |           |     | 051 |         |          | 051   |     |          |         |
150 160 170 180 190 150 160 170 180 190 200 150 160 170 180 190
|       |     | y vs y   |         |     |     | y vs y |                  |       |     | y vs y   |         |
| ----- | --- | -------- | ------- | --- | --- | ------ | ---------------- | ----- | --- | -------- | ------- |
|       |     | ysample3 | sample6 |     |     |        | ysample4 sample7 |       |     | ysample5 | sample8 |
| 091   |     |          |         |     | 091 |        |                  | 091   |     |          |         |
| y 071 |     |          |         | y   | 071 |        |                  | y 071 |     |          |         |
| 051   |     |          |         |     | 051 |        |                  | 051   |     |          |         |
150 160 170 180 190 150 160 170 180 190 150 160 170 180 190 200
InunseremFallsehenwirkeinesystematischeAbweichungen. ysample6 ysample7 Dasistgut. ysample8
Residuen
DieResiduensolltengleichmäßigüberdengesamtenWertebereichverteiltsein. IstdasnichtderFall,
gäbeessystematischeAbweichungen,welchedieVorhersagekraftdesModellseinschränken. Wiederist
linksobenderMittelwerteinigerhundertSampleszusehensowieachtzufälligausgewählteSamples.
DaserkennbareMuster(zweiWolken)entsteht,weildieGrößezwischenFrauenundMännerndeutlich
unterschiedlichist. InnerhalbderWolkenistaberkeinMustererkennbar: dasistgut.
diagnose_residual(model)
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     |     | 6   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

KORRELATIONDERPARAMETER
|                   |                           |     |     |           |     | residual |         |     |           |     | residual |         |
| ----------------- | ------------------------- | --- | --- | --------- | --- | -------- | ------- | --- | --------- | --- | -------- | ------- |
|                   | avg(residuals) vs  fitted |     |     |           |     |          | sample1 |     |           |     |          | sample2 |
| )slaudiser(gva 01 |                           |     |     |           | 01  |          |         |     |           | 01  |          |         |
|                   |                           |     |     | slaudiser |     |          |         |     | slaudiser |     |          |         |
| 0                 |                           |     |     |           | 0   |          |         |     |           | 0   |          |         |
| 01−               |                           |     |     |           | 01− |          |         |     |           | 01− |          |         |
|                   |                           |     |     |           | 02− |          |         |     |           | 02− |          |         |
02−
|     | 160 | 170      | 180     |     | 160 |          | 170            | 180 |     | 160 |          | 170 180        |
| --- | --- | -------- | ------- | --- | --- | -------- | -------------- | --- | --- | --- | -------- | -------------- |
|     |     | residual |         |     |     | residual |                |     |     |     | residual |                |
|     |     | fitted   | sample3 |     |     |          | fitted sample4 |     |     |     |          | fitted sample5 |
02
| 01        |     |          |         |           | 01  |          |         |     |           | 01  |          |         |
| --------- | --- | -------- | ------- | --------- | --- | -------- | ------- | --- | --------- | --- | -------- | ------- |
| slaudiser |     |          |         | slaudiser |     |          |         |     | slaudiser |     |          |         |
| 0         |     |          |         |           | 0   |          |         |     |           | 0   |          |         |
| 01−       |     |          |         |           | 01− |          |         |     |           | 01− |          |         |
|           |     |          |         |           | 02− |          |         |     |           | 02− |          |         |
|           | 160 | 170      | 180     |           | 160 |          | 170     | 180 |           | 160 |          | 170 180 |
|           |     | residual | sample6 |           |     | residual | sample7 |     |           |     | residual | sample8 |
|           |     | fitted   |         |           |     |          | fitted  |     |           |     |          | fitted  |
| 01        |     |          |         |           | 01  |          |         |     |           | 01  |          |         |
| slaudiser |     |          |         | slaudiser |     |          |         |     | slaudiser |     |          |         |
| 0         |     |          |         |           | 0   |          |         |     |           | 0   |          |         |
| 01−       |     |          |         |           | 01− |          |         |     |           | 01− |          |         |
| 02−       |     |          |         |           | 02− |          |         |     |           | 02− |          |         |
|           | 160 | 170      | 180     |           | 160 |          | 170     | 180 |           | 160 |          | 170 180 |
WastunwenndieResiduenMusterzeigen? Fashängtdavonab,waswirsehen. Sindsiegebogenund
|     |     | fitted |     |     |     |     | fitted |     |     |     |     | fitted |
| --- | --- | ------ | --- | --- | --- | --- | ------ | --- | --- | --- | --- | ------ |
kurvig, haben wir es meist mit nicht-linearen Zusammenhängen zu tun, die man modellieren kann;
sindsieinFächerformliegtestypischerweiseamfalschgewähltenModell(Varianzmodell);deutliche
GruppenabweichungenkannmanhierarchischindenGriffbekommenetc. Dazuspätermehr.
| Korrelation |     | der | Parameter |     |     |     |     |     |     |     |     |     |
| ----------- | --- | --- | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Da wir dank des Samplings echte Verteilungen und deren Zusammenhänge kennen, können wir uns
| auchdieKorrelationderKoeﬀizientenselbst(nichtderDaten!) |     |             |            |             |             |            |       | ansehen:   |       |       |      |     |
| ------------------------------------------------------- | --- | ----------- | ---------- | ----------- | ----------- | ---------- | ----- | ---------- | ----- | ----- | ---- | --- |
| # Korrelation                                           |     | nach        | Umwandlung | mit         | as.matrix() |            |       |            |       |       |      |     |
| kable(cor(as.matrix(model)),                            |     |             |            | digits      | =           | 2)         |       |            |       |       |      |     |
|                                                         |     |             |            | (Intercept) |             | GenderMale |       | Knee.girth |       | sigma |      |     |
|                                                         |     | (Intercept) |            |             | 1.00        |            | 0.29  |            | -1.00 |       | 0.01 |     |
|                                                         |     | GenderMale  |            |             | 0.29        |            | 1.00  |            | -0.35 | -0.02 |      |     |
|                                                         |     | Knee.girth  |            |             | -1.00       |            | -0.35 |            | 1.00  | -0.01 |      |     |
|                                                         |     | sigma       |            |             | 0.01        |            | -0.02 |            | -0.01 |       | 1.00 |     |
# und Korrelationsplot
plotcorr(model)
LVDAA,ArnoHollosi 7

KORRELATIONDERPARAMETER
elaMredneG
|     |     | )tpecretnI( |     |     | htrig.eenK |     |     |
| --- | --- | ----------- | --- | --- | ---------- | --- | --- |
amgis
1
0.8
|     | (Intercept) |     |   29 |     | −100 |    1 |     |
| --- | ----------- | --- | ---- | --- | ---- | ---- | --- |
0.6
0.4
| GenderMale |     |   29 |     |     |  −35 |   −2 |     |
| ---------- | --- | ---- | --- | --- | ---- | ---- | --- |
0.2
0
|     | Knee.girth |      |      |     |     |      | −0.2 |
| --- | ---------- | ---- | ---- | --- | --- | ---- | ---- |
|     |            | −100 |  −35 |     |     |   −1 |      |
−0.4
−0.6
|     | sigma |    1 |   −2 |     |   −1 |     |     |
| --- | ----- | ---- | ---- | --- | ---- | --- | --- |
−0.8
−1
IdealerweisesolltenalleParametereineniedrigeKorrelationaufweisen,anderenfallssinddieParameter
nur schwer einzeln interpretierbar. In unserem Fall ist Knee.girth extrem stark mit dem Intercept
korreliert. DamitistderParameternichtmehrunabhängigvomInterceptinterpretierbar.
Ein Grund dafür ist, dass der Knieumfang eine im Verhältnis zum Wertebereich große Mindestlänge
hat (29cm im Datensatz) und deshalb Änderungen im Koeﬀizienten durch Änderungen im Intercept
ausgeglichenwerden. EineAbhilfeistes,denKnieumfangzuzentrieren(denMittelwertabzuziehen):
| body$knee     |                 | = body$Knee.girth |     | -      | mean(body$Knee.girth) |     |     |
| ------------- | --------------- | ----------------- | --- | ------ | --------------------- | --- | --- |
| model2        | = update(model, |                   | ~   | Gender | + knee)               |     |     |
| print(model2, |                 | digits=2)         |     |        |                       |     |     |
stan_glm
|     | family:       | gaussian |     | [identity] |     |      |     |
| --- | ------------- | -------- | --- | ---------- | --- | ---- | --- |
|     | formula:      | Height   | ~   | Gender     | +   | knee |     |
|     | observations: | 507      |     |            |     |      |     |
|     | predictors:   | 3        |     |            |     |      |     |
------
|     |             | Median        | MAD_SD |     |     |     |     |
| --- | ----------- | ------------- | ------ | --- | --- | --- | --- |
|     | (Intercept) | 165.94        | 0.41   |     |     |     |     |
|     | GenderMale  | 10.68         | 0.61   |     |     |     |     |
|     | knee        | 1.13          | 0.11   |     |     |     |     |
|     | Auxiliary   | parameter(s): |        |     |     |     |     |
|     | Median      | MAD_SD        |        |     |     |     |     |
|     | sigma 6.29  | 0.20          |        |     |     |     |     |
------
|     | * For help | interpreting |        | the  | printed | output see             | ?print.stanreg |
| --- | ---------- | ------------ | ------ | ---- | ------- | ---------------------- | -------------- |
|     | * For info | on the       | priors | used | see     | ?prior_summary.stanreg |                |
LVDAA,ArnoHollosi 8

KORRELATIONDERPARAMETER
# Korrelationsplot
plotcorr(model2)
elaMredneG
)tpecretnI(
amgis
eenk
1
0.8
| (Intercept) | −73 |  25 |   3 |     |
| ----------- | --- | --- | --- | --- |
0.6
0.4
| GenderMale | −73 | −38 |  −2 |     |
| ---------- | --- | --- | --- | --- |
0.2
0
| knee |         |     |     | −0.2 |
| ---- | ------- | --- | --- | ---- |
|      |  25 −38 |     |   0 |      |
−0.4
−0.6
| sigma |   3  −2 |   0 |     |     |
| ----- | ------- | --- | --- | --- |
−0.8
−1
DieKorrelationistmit0.3nochvorhanden(undimPairs-Plotersichtlich), aberschondeutlichbesser
alsohneZentrierung. DerWertdesknee-Koeﬀizientenselbsthatsichnichtwesentlichverändert. Aber
wennwennmansichdenInterceptansiehtistnichtnurdessenWertanders(weilerjetztdieGrößebei
durchschnittlichemKnieumfangdarstellt),sondernauchdasHD-Intervallistdeutlichenger. Grundist,
dassjetztKnee.girthnichtmehr(sostark)“gegen”denInterceptarbeitet.
|     |             |        | lwr upr | lwr upr       |
| --- | ----------- | ------ | ------- | ------------- |
|     | (Intercept) | 117.24 | 133.28  | 165.11 166.71 |
|     | GenderMale  | 9.56   | 11.93   | 9.51 11.86    |
|     | Knee.girth  | 0.91   | 1.36    | 0.91 1.34     |
|     | sigma       | 5.91   | 6.68    | 5.93 6.71     |
LVDAA,ArnoHollosi 9

BEISPIELFÜRFEHLERFALL
| Beispiel | für Fehlerfall |     |     |     |     |     |
| -------- | -------------- | --- | --- | --- | --- | --- |
SehenwirunseinBeispielan, indenendieobigenTestsanzeigen,dassetwasnichtganzpasst. Wenn
| 𝑦   |     | 𝑥   |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- |
nicht linear mit den zusammenhängt, ist einer lineare Regression per se kein gutes Modell. Als
Beispiel soll eines der berühmten Fallexperiment von Galileo dienen: auf einer Rampe wird auf einer
bestimmtenHöheheighteineKugellosgelassenunddanngemessen,wieweit(dist)dieKugelfliegt:
# Source: Drake, S. (1978), Galileo at Work, Chicago: University of Chicago Press.
galileo = read.csv('daten/galileo.csv', stringsAsFactors = TRUE)
| model3 = stan_glm(dist |           | ~ height, | data=galileo, | refresh=0) |     |     |
| ---------------------- | --------- | --------- | ------------- | ---------- | --- | --- |
| print(model3,          | digits=2) |           |               |            |     |     |
stan_glm
| family:       | gaussian | [identity] |     |     |     |     |
| ------------- | -------- | ---------- | --- | --- | --- | --- |
| formula:      | dist     | ~ height   |     |     |     |     |
| observations: | 7        |            |     |     |     |     |
| predictors:   | 2        |            |     |     |     |     |
------
|             | Median        | MAD_SD |     |     |     |     |
| ----------- | ------------- | ------ | --- | --- | --- | --- |
| (Intercept) | 269.52        | 27.25  |     |     |     |     |
| height      | 0.33          | 0.05   |     |     |     |     |
| Auxiliary   | parameter(s): |        |     |     |     |     |
Median MAD_SD
| sigma 39.03 | 12.83 |     |     |     |     |     |
| ----------- | ----- | --- | --- | --- | --- | --- |
------
| * For help | interpreting | the         | printed output             | see ?print.stanreg |     |     |
| ---------- | ------------ | ----------- | -------------------------- | ------------------ | --- | --- |
| * For info | on the       | priors used | see ?prior_summary.stanreg |                    |     |     |
Die Regressionsgerade sähe wie folgt aus – es ist offensichtlich, dass ein lineares Modell keine gute
BeschreibungdesDatensatzesist:
Fallexperiment mit Regressionsgerade
)itnup( etiewgulF 055
004
052
|     | 200 |     | 400 | 600 | 800 | 1000 |
| --- | --- | --- | --- | --- | --- | ---- |
Höhe der Rampe (punti)
|     |     |     | zumeinenzeigt𝑦 | ↔ 𝑦̂ebenjeneklareBananenform |     |     |
| --- | --- | --- | -------------- | ---------------------------- | --- | --- |
ZweiDiagnosenzeigenunssofortAuffälligkeiten:
(linksoben),zumanderensiehtmaneineähnlicheBananenformbeidenResiduen.
| # y vs y_hat | (echte | vs. vorhergsagte | y-Werte) |     |     |     |
| ------------ | ------ | ---------------- | -------- | --- | --- | --- |
diagnose_y_vs_yhat(model3)
| LVDAA,ArnoHollosi |     |     |     |     |     | 10  |
| ----------------- | --- | --- | --- | --- | --- | --- |

BEISPIELFÜRFEHLERFALL
|     |     | y vs avg(y_hat) |                     |     |     | y vs y |                  |     |     | y vs y |                  |
| --- | --- | --------------- | ------------------- | --- | --- | ------ | ---------------- | --- | --- | ------ | ---------------- |
|     |     |                 |                     |     |     |        | sample1          |     |     |        | sample2          |
|     | 055 |                 |                     |     | 055 |        |                  |     | 055 |        |                  |
|     | 054 |                 |                     |     | 054 |        |                  |     | 054 |        |                  |
| y   |     |                 |                     | y   |     |        |                  | y   |     |        |                  |
|     | 053 |                 |                     |     | 053 |        |                  |     | 053 |        |                  |
|     | 052 |                 |                     |     | 052 |        |                  |     | 052 |        |                  |
|     | 300 |                 | 400 500             | 600 | 300 | 350    | 400 450 500      | 550 | 300 | 400    | 500 600          |
|     |     |                 | y vs y ( )          |     |     | y vs y |                  |     |     | y vs y |                  |
|     |     |                 | avg ysample sample3 |     |     |        | ysample1 sample4 |     |     |        | ysample2 sample5 |
|     | 055 |                 |                     |     | 055 |        |                  |     | 055 |        |                  |
|     | 054 |                 |                     |     | 054 |        |                  |     | 054 |        |                  |
| y   |     |                 |                     | y   |     |        |                  | y   |     |        |                  |
|     | 053 |                 |                     |     | 053 |        |                  |     | 053 |        |                  |
|     | 052 |                 |                     |     | 052 |        |                  |     | 052 |        |                  |
|     |     | 300             | 400 500             |     | 300 | 400    | 500 600          |     | 350 | 450    | 550              |
|     |     |                 | y vs y sample6      |     |     | y vs y | sample7          |     |     | y vs y | sample8          |
|     |     |                 | ysample3            |     |     |        | ysample4         |     |     |        | ysample5         |
|     | 055 |                 |                     |     | 055 |        |                  |     | 055 |        |                  |
|     | 054 |                 |                     |     | 054 |        |                  |     | 054 |        |                  |
| y   |     |                 |                     | y   |     |        |                  | y   |     |        |                  |
|     | 053 |                 |                     |     | 053 |        |                  |     | 053 |        |                  |
|     | 052 |                 |                     |     | 052 |        |                  |     | 052 |        |                  |
|     | 250 | 350             | 450 550             |     | 250 | 350    | 450 550          |     |     | 300    | 400 500 600      |
|     |     |                 | ysample6            |     |     |        | ysample7         |     |     |        | ysample8         |
# Residuen
diagnose_residual(model3)
|     |     |                           |     |     |     | residual |         |     |     | residual |         |
| --- | --- | ------------------------- | --- | --- | --- | -------- | ------- | --- | --- | -------- | ------- |
|     |     | avg(residuals) vs  fitted |     |     |     |          | sample1 |     |     |          | sample2 |
04
06
02
| )slaudiser(gva |     |     |     |           |     |     |     |           | 02  |     |     |
| -------------- | --- | --- | --- | --------- | --- | --- | --- | --------- | --- | --- | --- |
|                | 0   |     |     | slaudiser | 02  |     |     | slaudiser |     |     |     |
0
0
02−
04−
04−
04−
|     | 300 |     | 400 500        | 600 | 300 | 400      | 500            | 600 | 300 | 400      | 500 600        |
| --- | --- | --- | -------------- | --- | --- | -------- | -------------- | --- | --- | -------- | -------------- |
|     |     |     | residual       |     |     | residual |                |     |     | residual |                |
|     |     |     | fitted sample3 |     |     |          | fitted sample4 |     |     |          | fitted sample5 |
04
02
02
02
| slaudiser |     |     |     | slaudiser | 0   |     |     | slaudiser |     |     |     |
| --------- | --- | --- | --- | --------- | --- | --- | --- | --------- | --- | --- | --- |
|           |     |     |     |           | 02− |     |     |           | 0   |     |     |
0
04−
06−
04−
|           | 300 |     | 400 500          | 600       | 300 | 400      | 500     | 600       | 300 | 400      | 500 600 |
| --------- | --- | --- | ---------------- | --------- | --- | -------- | ------- | --------- | --- | -------- | ------- |
|           |     |     | residual sample6 |           |     | residual | sample7 |           |     | residual | sample8 |
|           |     |     | fitted           |           |     |          | fitted  |           |     |          | fitted  |
|           | 04  |     |                  |           | 02  |          |         |           | 02  |          |         |
| slaudiser | 02  |     |                  | slaudiser | 0   |          |         | slaudiser | 02− |          |         |
|           | 0   |     |                  |           |     |          |         |           | 06− |          |         |
|           | 02− |     |                  |           | 04− |          |         |           |     |          |         |
001−
|     | 300 |     | 400 500 | 600 | 300 | 400 | 500    | 600 | 300 | 400 | 500 600 |
| --- | --- | --- | ------- | --- | --- | --- | ------ | --- | --- | --- | ------- |
|     |     |     | fitted  |     |     |     | fitted |     |     |     | fitted  |
LVDAA,ArnoHollosi 11

GENERALISIERUNG
Generalisierung
KommenwirzurletztenFrage: sagtdasModellunbekannteDatengutvorher? InderPraxiswürden
wirdasModellmitdenbestehendenDatentrainierenunddannspäterneueMessungenunternehmen
und schauen wie gut das Modell die neuen Messungen vorhersagt. Da wir in der Lehrveranstaltung
selber keine Daten messen, wenden wir einen Trick an. Wir unterteilen die bestehenden Daten in ein
TrainingssetundineinTestset. DiedaatoolsstellendafürwiedereineHilfsfunktionparat
# Wir erzeugen einen Split mit 350 Datensätzen in body_train & dem Rest (157) in body_test
| split_random(body, |     |     | 350, | "body_train", |     | "body_test") |     |     |     |     |     |
| ------------------ | --- | --- | ---- | ------------- | --- | ------------ | --- | --- | --- | --- | --- |
# Dann berechnen (bzw. trainieren) wir das Modell nur auf body_train
| model5 | = stan_glm(Height |     |      | ~             | Gender | + knee,    |     |     |     |     |     |
| ------ | ----------------- | --- | ---- | ------------- | ------ | ---------- | --- | --- | --- | --- | --- |
|        |                   |     | data | = body_train, |        | refresh=0) |     |     |     |     |     |
info(model5)
|     |               |     | median   | mad  |          | lwr           | upr mcse   | n_eff | Rhat |     |     |
| --- | ------------- | --- | -------- | ---- | -------- | ------------- | ---------- | ----- | ---- | --- | --- |
|     | (Intercept)   |     | 166.05   | 0.48 |          | 165.12 166.96 | 0.01       | 4129  |      | 1   |     |
|     | GenderMale    |     | 10.46    | 0.69 |          | 9.05          | 11.80 0.01 | 4232  |      | 1   |     |
|     | knee          |     | 1.06     | 0.13 |          | 0.79          | 1.32 0.00  | 4318  |      | 1   |     |
|     | sigma         |     | 6.18     | 0.24 |          | 5.71          | 6.66 0.00  | 3963  |      | 1   |     |
|     | mean_PPD      |     | 171.23   | 0.46 |          | 170.37 172.17 | 0.01       | 3721  |      | 1   |     |
|     | log-posterior |     | -1140.65 | 1.22 | -1143.81 | -1139.03      | 0.03       | 2052  |      | 1   |     |
Metriken
DiedaatoolsstellenunswiedereinigeFunktionenzurVerfügung,dieunshelfen,zuverstehen,wiegut
das Modell neue Daten vorhersagen kann. Die Idee dabei ist immer dieselbe: es werden mithilfe des
Modells Vorhersagen für die Testdaten gemacht und diese dann mit den echten Testdaten verglichen.
Je kleiner der Unterschied bzw. wenn die Fehlerin etwagleich groß sind wie bei den Trainingsdaten,
destobesser.
DieersteFunktiongibtunseinpaarKennzahlenaus:
| print(prediction_metrics(model5, |            |     |        |      |       | body_test), | digits=3) |      |     |          |           |
| -------------------------------- | ---------- | --- | ------ | ---- | ----- | ----------- | --------- | ---- | --- | -------- | --------- |
|                                  | Dataset    |     | n RMSE | MAE  | Skill |             |           |      |     |          |           |
|                                  | 1 Training | 350 | 6.14   | 4.96 | 0.560 |             |           |      |     |          |           |
|                                  | 2 New data | 157 | 6.56   | 5.14 | 0.543 |             |           |      |     |          |           |
|                                  |            |     |        |      |       |             |           | 𝑅𝑀𝑆𝐸 |     | = √1 ∑ 𝑛 | (𝑦 −𝑦̂)2, |
RMSE steht für root mean square error und berechnet sich aus 𝑖 𝑖 d.h.
𝑛 𝑖=1
DifferenzzwischenwahremundvorhergesagtemWertwirdquadriert,danngemitteltunddieWurzel
| gezogen. | DieseMetriknimmtbeistarkenAusreißerndeutlichzu. |     |     |     |     |     |     |     |     |     |     |
| -------- | ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
𝑛
MAE steht für mean absolute error und berechnet sich aus 𝑀𝐴𝐸 = 1 ∑ |𝑦 −𝑦̂| und bildet den
|     |     |     |     |     |     |     |     |     | 𝑛   | 𝑖=1 𝑖 𝑖 |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- |
DurchschnittdesabsolutenFehlers. ImVergleichzuRMSEgehenalsoalleFehler“gleichstark”ein.
SkillisteineeinfacheMetrik, die1ist, wenndasModelldieDatenperfektvorhersagt, 0istwenndas
ModellnursogutistalswürdenwireinfachimmerdenMittelwertderDatenvorhersagenundnegativ,
wenndasModellschlechteristalseinfachdenMittelwertzubilden(dassolltehoffentlichniepassieren
:o)
InunseremBeispielsehenwir,dassRMSE,MAEundSkillca. dieselbeGrößebeidenTestdatenhaben
wiedieTrainingsdatenselbst. Darauskönnenwirschließen,dassdasModellgutgeneralisiert.
LVDAA,ArnoHollosi 12

| Graphisch |     |     |     |     |     |     |     |     |     |     | GENERALISIERUNG |     |
| --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------- | --- |
Graphisch
Wir können auch wieder die diagnose_*-Funktionen verwenden und sie auf den Testdatensatz
| anwenden.                |     | DazuübergebenwirdieTestdatenalsParameternewdata=. |     |         |     |            |     |     |     |     |     |     |
| ------------------------ | --- | ------------------------------------------------- | --- | ------- | --- | ---------- | --- | --- | --- | --- | --- | --- |
| diagnose_density(model5, |     |                                                   |     | newdata | =   | body_test) |     |     |     |     |     |     |
Density of y & y
sample
|                           | 140                       | 150 |     | 160     |     | 170        |          | 180     |     | 190 |          | 200     |
| ------------------------- | ------------------------- | --- | --- | ------- | --- | ---------- | -------- | ------- | --- | --- | -------- | ------- |
| diagnose_residual(model5, |                           |     |     | newdata | =   | body_test) |          |         |     |     |          |         |
|                           | avg(residuals) vs  fitted |     |     |         |     |            | residual |         |     |     | residual |         |
|                           |                           |     |     |         |     |            |          | sample1 |     |     |          | sample2 |
)slaudiser(gva
|           | 01  |          |                |     | 01           |         |          |         |           | 01  |          |                |
| --------- | --- | -------- | -------------- | --- | ------------ | ------- | -------- | ------- | --------- | --- | -------- | -------------- |
|           |     |          |                |     | slaudiser    |         |          |         | slaudiser |     |          |                |
|           | 0   |          |                |     | 0            |         |          |         |           | 0   |          |                |
|           | 51− |          |                |     | 51−          |         |          |         |           | 51− |          |                |
|           | 160 | 165 170  | 175            | 180 |              | 160 165 | 170      | 175 180 |           | 160 | 165 170  | 175 180        |
|           |     | residual | sample3        |     |              |         | residual | sample4 |           |     | residual | sample5        |
|           |     |          | fitted         |     |              |         | fitted   |         |           |     |          | fitted         |
|           |     |          |                |     | 02           |         |          |         |           | 02  |          |                |
| slaudiser | 01  |          |                |     | slaudiser 01 |         |          |         | slaudiser | 01  |          |                |
|           | 0   |          |                |     | 0            |         |          |         |           | 0   |          |                |
|           | 51− |          |                |     | 51−          |         |          |         |           | 51− |          |                |
|           | 160 | 165 170  | 175            | 180 |              | 160 165 | 170      | 175 180 |           | 160 | 165 170  | 175 180        |
|           |     | residual |                |     |              |         | residual |         |           |     | residual |                |
|           |     |          | fitted sample6 |     |              |         | fitted   | sample7 |           |     |          | fitted sample8 |
|           | 01  |          |                |     | 01           |         |          |         |           | 01  |          |                |
| slaudiser |     |          |                |     | slaudiser    |         |          |         | slaudiser |     |          |                |
|           | 0   |          |                |     | 0            |         |          |         |           | 0   |          |                |
|           |     |          |                |     | 51−          |         |          |         |           | 51− |          |                |
51−
|     | 160 | 165 170 | 175    | 180 |     | 160 165 | 170    | 175 180 |     | 160 | 165 170 | 175 180 |
| --- | --- | ------- | ------ | --- | --- | ------- | ------ | ------- | --- | --- | ------- | ------- |
|     |     |         | fitted |     |     |         | fitted |         |     |     |         | fitted  |
BeidesehenzwaretwasschlechterausalsbeidenTrainingsdatenselbst,dennochnochimRahmenund
ok.
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     |     |     | 13  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

ZUSAMMENFASSUNG
Zusammenfassung
WennwirpraxisrelevanteModelleberechnenwollen,werdenbeiBayes-ModellenSampling-Methoden
verwendet, dierepräsentativdenParameterraumabdecken. DieSamplerkönnensichallerdingsauch
imParameterraum“verlaufen”. DeshalbwirddasSampelntypischerweiseinzweiPhasen(“Warmup”
& “Sampling”) unterteilt und mehrere Durchläufe (chains) gestartet. Nur wenn alle Chains das selbe
Ergebnisliefern,könnenwirdavonausgehen,dassdasSamplingrepräsentativwar.
Mit einigen Diagnosetools können wir verifizieren, ob unser Modell den vorliegenden Datensatz gut
beschreibt. IstdasnichtderFall,bleibtinderPraxisnur,dasModellzumodifizieren. Gelegentlichkann
eshilfreichsein,auchdieSampling-Einstellungenzuändern. ImRahmenderLVgehenwirdaraufaber
nichtnäherein.
LVDAA,ArnoHollosi 14