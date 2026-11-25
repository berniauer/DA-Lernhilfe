<!-- Quelle: Wiederholung, Downloads und Kurzreferenzen/Voraussetzung (statistisches Basiswissen)/Arbeitsblätter (PDF)/00b-Wiederholung-Wahrscheinlichkeitsverteilungen.pdf -->

Wahrscheinlichkeitsverteilungen
ArnoHollosi
Contents
Wahrscheinlichkeitsverteilungen 1
UniformeVerteilung 1
Normalverteilung 3
NormalverteilteZufallszahlen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Normalverteilung: ZusammenhangmituniformenZufall . . . . . . . . . . . . . . . . . . . . . 7
Binomialverteilung 7
Bernoulli . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
ReihevonVersuchen . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
Binomial-Verteilung . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
Beispiel . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
AndereVerteilungen 9
Wahrscheinlichkeitsverteilungen
EsgibtinderMathematik/StatistikvieleVerteilungen,dieeineZahlenreiheannehmenkann. Füruns
vonbesonderemInteresse: uniformeVerteilung,NormalverteilungundBinomialverteilung.
| Uniforme | Verteilung |     |     |
| -------- | ---------- | --- | --- |
Uniformer Zufall ist das, was man sich gewöhnlich unter Zufall vorstellt: alle Zahlen haben die selbe
| Wahrscheinlichkeitvorzukommen. |              | EinBeispiel: |                      |
| ------------------------------ | ------------ | ------------ | -------------------- |
| # Zufallszahlen                | mit runif(n, | min =        | 0, max = 1) erzeugen |
| # Name steht                   | für Random   | UNIForm      |                      |
| # Wir erzeugen                 | 2000 Zahlen  | zwischen     | 0 und 10             |
| x = runif(2000,                | 0, 10)       |              |                      |
hist(x, main="Histogramm: Uniformer Zufall", col="lightgreen", breaks=20, xlab="")
1

UNIFORMEVERTEILUNG
Histogramm: Uniformer Zufall
021
ycneuqerF
08
06
04
02
0
|     | 0   |     | 2   |     |     | 4   | 6   |     | 8   | 10  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Wahrscheinlichkeitsdichtefunktionen.
| Für Wahrscheinlichkeitsverteilungen |     |     |     | gibt | es  | auch stetige |     |     |     |     |
| ----------------------------------- | --- | --- | --- | ---- | --- | ------------ | --- | --- | --- | --- |
Beim uniformen Zufall ist das (wie zu erwarten) eine gerade Linie: alle Zahlen haben die selbe
Wahrscheinlichkeit,gezogenzuwerden:
| # Dichtefunktion |     | mit     | dunif(x,       | min = | 0, max          | = 1) | für Punkt | x   |     |     |
| ---------------- | --- | ------- | -------------- | ----- | --------------- | ---- | --------- | --- | --- | --- |
| # Name steht     | für | Density | UNIForm        |       |                 |      |           |     |     |     |
| curve(dunif(x,   |     | 0, 10), | xlim=c(-2,12), |       | col="darkblue", |      | xlab="",  |     |     |     |
main="Dichtefunktion uniformen Zufalls (0-10)", frame.plot=FALSE)
Dichtefunktion uniformen Zufalls (0−10)
01.0
80.0
)01 ,0 ,x(finud
60.0
40.0
20.0
00.0
|     | −2  |     | 0   | 2   |     | 4   | 6   | 8   | 10  | 12  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Die Fläche unter der Kurve ist 1 (schließlich muss sich die Gesamtwahrscheinlichkeit auf 100%
summieren).
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     |     |     | 2   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

NORMALVERTEILUNG
WiegroßistdieChance,dasseineZahlkleiner2herauskommt? DieersteIntuitionstimmt: 20%. Wir
könnendasauchmiteinerR-Funktionabfragen:
# Verteilungsfunktion mit punif(x, min = 0, max = 1) für Werte kleiner x
| # Name steht | für Probability |     | UNIForm |     |     |     |     |
| ------------ | --------------- | --- | ------- | --- | --- | --- | --- |
| punif(2,     | 0, 10)          |     |         |     |     |     |     |
[1] 0.2
| # Wir können | auch einen | ganzen | Graphen | zeichnen |     |     |     |
| ------------ | ---------- | ------ | ------- | -------- | --- | --- | --- |
curve(punif(x, 0, 10), xlim=c(-2,12), col="darkblue", frame.plot=FALSE,
| main="Verteilungsfunktion |     |     | uniformen | Zufalls | (0-10)") |     |     |
| ------------------------- | --- | --- | --------- | ------- | -------- | --- | --- |
Verteilungsfunktion uniformen Zufalls (0−10)
0.1
8.0
)01 ,0 ,x(finup
6.0
4.0
2.0
0.0
|     | −2  | 0   | 2   | 4   | 6   | 8 10 | 12  |
| --- | --- | --- | --- | --- | --- | ---- | --- |
x
Aus dem Diagramm sehen wir, dass z.B. Zahlen kleiner 4 mit 40% Wahrscheinlichkeit vorkommen
und Zahlen kleiner 9 mit 90% Wahrscheinlichkeit. Ergibt auch Sinn, da ja alle Zahlen gleich häufig
vorkommen–jegrößerdererlaubteBereich,umsogrößerdieSummenwahrscheinlichkeit.
Es gibt auch eine inverse Funktion: wenn ich eine Chance von 30% haben will, wo soll die Grenze
| gezogenwerden? | Antwort: | beiallenZahlenkleiner3: |     |     |     |     |     |
| -------------- | -------- | ----------------------- | --- | --- | --- | --- | --- |
# Quantilfunktion mit qunif(p, min = 0, max = 1) für Wahrscheinlichkeit p
| # Name steht | für Quantile | UNIForm |     |     |     |     |     |
| ------------ | ------------ | ------- | --- | --- | --- | --- | --- |
| qunif(0.3,   | 0, 10)       |         |     |     |     |     |     |
[1] 3
Normalverteilung
Die Normal- oder Gauß-Verteilung ist eine der wichtigsten Wahrscheinlichkeitsverteilungen. Die
Abweichungen vieler natur- und wirtschaftswissenschaftlicher Vorgänge vom Mittelwert lassen sich
durchdieNormalverteilunginsehrguterNäherungbeschreiben. DieNormalverteilungistdurcheinen
Mittelwert𝜇unddieStandardabweichung𝜎beschrieben:
| LVDAA,ArnoHollosi |     |     |     |     |     |     | 3   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- |

NORMALVERTEILUNG
Normalverteilung
|     |     |     |     |     | N ~ (m =- 2, s | =0.5) |     |
| --- | --- | --- | --- | --- | -------------- | ----- | --- |
|     |     |     |     |     | N ~ (m =0, s   | =1)   |     |
|     |     |     |     |     | N ~ (m =2, s   | =2)   |     |
| −4  |     | −2  |     | 0   | 2              | 4     |     |
Innerhalbvon±2𝜎liegen95.45%allerWertederNormalverteilung,innerhalbvon±3𝜎liegen99.73%:
Normalverteilung (2)
50.00%
|     |     |     | 25.00% |     | 75.00% |     |     |
| --- | --- | --- | ------ | --- | ------ | --- | --- |
– 0.674s 50.00%
|     |     |     | 15.87% | – 1s | 84.13% |     |     |
| --- | --- | --- | ------ | ---- | ------ | --- | --- |
68.27%
|     |     | 5.00% |     |     |     | 95.00% |     |
| --- | --- | ----- | --- | --- | --- | ------ | --- |
– 1.64s 90.00%
|     |     | 2.28% |     | – 2s |     | 97.72% |     |
| --- | --- | ----- | --- | ---- | --- | ------ | --- |
95.45%
|     | −3  | −2  | −1  | 0   | 1   | 2   | 3   |
| --- | --- | --- | --- | --- | --- | --- | --- |
LVDAA,ArnoHollosi 4

| NormalverteilteZufallszahlen |     |     |     |     |     |     |     |     | NORMALVERTEILUNG |     |
| ---------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------- | --- |
NormalverteilteZufallszahlen
InRkönnenSiefolgendeFunktionenverwenden,umdieNormalverteilungzuberechnen:
• rnorm(n, mean = 0, sd = 1), um 𝑛 Zufallswerte entsprechend einer Normalverteilung zu
erhalten
|     | dnorm(x, | mean | =   | 0, sd | = 1),umdenWertamPunktxzuberechnen |     |     |     |     |     |
| --- | -------- | ---- | --- | ----- | --------------------------------- | --- | --- | --- | --- | --- |
•
• pnorm(p, mean = 0, sd = 1),umdasIntegral(=AnzahlderWerte/Fläche)biszumPunkt𝑝zu
berechnen
1),umdenPunktzuerhalten,beidemdieFlächeunterderKurve𝑞
|     | • qnorm(q, | mean | =   | 0, sd | =   |     |     |     |     |     |
| --- | ---------- | ---- | --- | ----- | --- | --- | --- | --- | --- | --- |
entspricht
| # Zufallszahlen |       |     | mit    | rnorm(n, | mean = | 0, sd | = 1) erzeugen |     |     |     |
| --------------- | ----- | --- | ------ | -------- | ------ | ----- | ------------- | --- | --- | --- |
| # Name          | steht | für | Random | NORMal   |        |       |               |     |     |     |
# Wir erzeugen 2000 Zahlen mit Mittelwert 10 und Std.abweichung 3
| x =     | rnorm(2000,       |     | 10, | 3)         |                  |     |          |          |     |     |
| ------- | ----------------- | --- | --- | ---------- | ---------------- | --- | -------- | -------- | --- | --- |
| hist(x, | main="Histogramm: |     |     |            | Normalverteilter |     | Zufall", | xlab="", |     |     |
|         | col="lightgreen", |     |     | breaks=20) |                  |     |          |          |     |     |
Histogramm: Normalverteilter Zufall
052
002
ycneuqerF
051
001
05
0
|                  |       |     | 0       |          | 5      |       | 10       |       | 15  | 20  |
| ---------------- | ----- | --- | ------- | -------- | ------ | ----- | -------- | ----- | --- | --- |
| # Dichtefunktion |       |     | mit     | dnorm(x, | mean = | 0, sd | = 1) für | Punkt | x   |     |
| # Name           | steht | für | Density |          | NORMal |       |          |       |     |     |
# z.B. für eine Zufallsfunktion mit Mittelwert 10 und Std.abweichung 3
curve(dnorm(x, 10, 3), xlim=c(0,20), xlab="", col="darkblue", frame.plot=FALSE,
|     | main="Dichtefunktion |     |     |     | Normalverteilung |     | N(10,3)") |     |     |     |
| --- | -------------------- | --- | --- | --- | ---------------- | --- | --------- | --- | --- | --- |
LVDAA,ArnoHollosi 5

| NormalverteilteZufallszahlen |     |     |     | NORMALVERTEILUNG |     |
| ---------------------------- | --- | --- | --- | ---------------- | --- |
Dichtefunktion Normalverteilung N(10,3)
21.0
)3 ,01 ,x(mrond
80.0
40.0
00.0
|     | 0   | 5   | 10  | 15  | 20  |
| --- | --- | --- | --- | --- | --- |
DieFläche(Integral)unterderKurveistwieder1.
WiegroßistdieChance,dasseineZahlkleiner2herauskommt?
# Verteilungsfunktion mit pnorm(x, mean = 0, sd = 1) für Werte kleiner x
| # Name steht | für Probability | NORMal |     |     |     |
| ------------ | --------------- | ------ | --- | --- | --- |
| pnorm(2,     | 10, 3)          |        |     |     |     |
[1] 0.003830381
Die Wahrscheinlichkeit, bei der Normalverteilung 𝑁(10,3) eine Zahl kleiner 2 zu erhalten ist also
0.3%. Nicht verwunderlich, wenn man bedenkt, dass der Wert über 2.5 Standardabweichungen vom
Mittelwertentferntliegt.
Verteilungsfunktion Normalverteilung N(10,3)
0.1
8.0
)3 ,01 ,x(mronp
6.0
4.0
2.0
0.0
|                   | 0   | 5   | 10  | 15  | 20  |
| ----------------- | --- | --- | --- | --- | --- |
| LVDAA,ArnoHollosi |     |     |     |     | 6   |

Normalverteilung: ZusammenhangmituniformenZufall BINOMIALVERTEILUNG
Aus dem Diagramm sehen wir, dass z.B. Zahlen kleiner 10 mit 50% Wahrscheinlichkeit vorkommen –
derMittelwertistalsogleichzeitigderMedianeinerNormalverteilung. (Sollteunsnichtverwundern,
dadieFunktionsymmetrischist.)
Inverse Funktion: wenn ich eine Chance von 30% haben will, wo soll die Grenze gezogen werden?
Antwort: beiallenZahlenkleiner8.43:
# Quantilfunktion mit qnorm(p, mean = 0, sd = 1) für Wahrscheinlichkeit p
# Name steht für Quantile NORMal
qnorm(0.3, 10, 3)
[1] 8.426798
Normalverteilung: ZusammenhangmituniformenZufall
DieNormalverteilungistinderNaturhäufiganzutreffen,weilsieauseinerSummezufälliger,kleiner
Schritte entsteht. Fast alle Wachstumsprozesse in der Natur sind eine solche Summe kleiner Schritte:
z.B.dieKörpergröße. SiehedazuauchÜbungsblatt.
Deshalb funktioniert eine Logarithmus-Transformation auch so gut bei multiplikativem Wachstum
(bzw. Abhängigkeiten): die Multiplikation wird auf der Logarithmus-Skala zur Addition und die
AdditionzufälligerZahlenhatinhärenteineNormalverteilung.
Binomialverteilung
DieUnterscheidunginzweiFälle(z.B.Kopf/ZahlbeiMünzen)trittinvielenForschungsfragenaufund
gehörtauchzudenBasisaufgabenstellungenderStatistik.
Bernoulli
Typischerweise weisen wir den beiden Fällen die Zahlen 0 und 1 zu. Der zu untersuchende Prozess
hateinebestimmteTendenz,z.B.zu70%erhaltenwirbeimMünzwurfdieKopfseite(zu70%wirktein
Medikament,zu70%isteinVerkaufsgesprächerfolgreichetc.). WirgebendieserTendenzdenWert𝜃,
(Theta)welcherimBereich0..1liegt. DasführtzufolgenderEigenschaft:
𝑝(𝑦 = 1|𝜃) = 𝜃
𝑝(𝑦 = 0|𝜃) = 1−𝜃
Gelesenals: diebedingteWahrscheinlichkeitist𝜃,dass𝑦 = 1(z.B.Kopfseite)eintritt,wenndieMünze
eine“Tendenz”𝜃hat. Und: diebedingteWahrscheinlichkeitist1−𝜃,dass𝑦 = 0(z.B.Zahlseite)eintritt,
wenndieMünzeeine“Tendenz”𝜃hat. AmBeispiel:diebedingteWahrscheinlichkeit,dass𝑦 = 0eintritt
ist30%(1−0.7),wenndieMünzeeineTendenzvon70%hat.
FasstmanbeideAussagenineinereinzigenGleichungzusammen,erhältmandieBernoulli-Gleichung:
𝑝(𝑦|𝜃) = 𝜃𝑦(1−𝜃)(1−𝑦)
Bei𝑦 = 1istderzweiteHälftedesAusdrucks1(kürztsichweg),da1−𝑦 = 0(und(1−𝜃)0 = 1),
wenn𝑦 = 0,dannistdieersteHälftedesAusdrucks1(undkürztsichweg).
LVDAA,ArnoHollosi 7

| ReihevonVersuchen |     |     |     |     | BINOMIALVERTEILUNG |
| ----------------- | --- | --- | --- | --- | ------------------ |
ReihevonVersuchen
WennwireineReihevonUntersuchungenmachen(d.h. eineReihevonMünzwürfen),wiegroßistdie
Wahrscheinlichkeit,dasseinebestimmteAbfolgevonZahl-&Kopfseitenauftaucht?
→
Jeder Münzwurf ist unabhängig die Wahrscheinlichkeiten der einzelnen Würfe multiplizieren sich
𝑝(𝑦|𝜃) = 𝜃𝑦(1 − 𝜃)(1−𝑦)
auf. Damit ergibt sich aus Wahrscheinlichkeit für einen Münzwurf durch
Multiplikation die Wahrscheinlichkeit für eine Serie 𝕐 = {𝑦 ,𝑦 ,𝑦 ...𝑦 } von 𝑛 Würfen 𝑝(𝕐|𝜃) =
0 1 2 𝑛
|     | 𝑛   | 𝜃𝑦 𝑖(1−𝜃)(1−𝑦 | ).  |     |     |
| --- | --- | ------------- | --- | --- | --- |
∏ 𝑝(𝑦 |𝜃) = ∏ 𝑖 Wenn wir für die Anzahl der geworfenen Kopfseiten 𝑧 setzen,
| 𝑖 𝑖 | 𝑖=0 |     |     |     |     |
| --- | --- | --- | --- | --- | --- |
dannwirddarausdurchumformen:
𝑝(𝕐|𝜃) = 𝜃𝑧(1−𝜃)(𝑛−𝑧)
Beispiel
EineMünzehat𝜃 = 0.75undwirmachen5Würfe. WiegroßistdieWahrscheinlichkeit,dasswirdie
| Serie𝕐 | = {0,1,1,1,0}werfen? |     |     |     |     |
| ------ | -------------------- | --- | --- | --- | --- |
N = 5
z = 3
| theta = | 0.75              |                          |     |     |     |
| ------- | ----------------- | ------------------------ | --- | --- | --- |
| theta^z | * (1-theta)^(N-z) | # = p({0,1,1,1,0}|theta) |     |     |     |
[1] 0.02636719
Binomial-Verteilung
Die Binomial-Verteilung entsteht, wenn wir ein Experiment, das nur zwei Ausgänge hat, also mit
Bernoulli-Verteilung, n-mal wiederholen und dabei die positiven Ergebnisse (𝑦 = 1) zählen, die
𝑧
wir nennen. Dabei ist uns die Reihenfolge der Würfe egal (jede Permutation möglich). Die
Verteilungfür𝑧 positiveErgebnissebei𝑛VersuchenmitzuGrundeliegenderTendenz𝜃istdanneine
Binomial-Verteilung1:
𝑛
|     |     | 𝑝(𝑧|𝑛,𝜃) | = ( | )𝜃𝑧(1−𝜃)(𝑛−𝑧) |     |
| --- | --- | -------- | --- | ------------- | --- |
𝑧
RbieteteineeinfacheFunktion,umzufälligebinomial-verteilteExperimentedurchzuführen:
| # 20 ...  | Anzahl an    | "Experimenten" |                |       |     |
| --------- | ------------ | -------------- | -------------- | ----- | --- |
| # 10 ...  | n = Versuche | (Münzwürfe)    | pro Experiment |       |     |
| # 0.7 ... | Theta (wie   | häufig zeigt   | die Münze      | Kopf) |     |
# Ergebnis: z = Vektor mit Anzahl der "Kopfseiten" pro Experiment (y=1)
| rbinom(20, | 10, 0.7) |          |       |             |        |
| ---------- | -------- | -------- | ----- | ----------- | ------ |
| [1]        | 6 7 5 8  | 8 7 6 10 | 5 5 4 | 7 8 5 6 5 6 | 8 10 9 |
WieschonbeiderNormalverteilunggibtesinRauchhiereineReiheweitererFunktionenrundumdie
Binomial-Verteilung:
rbinom(exp, size, prob),um𝑒𝑥𝑝Experimentemit𝑠𝑖𝑧𝑒 = 𝑛Versuchendurchzuführen
•
• dbinom(x, size, prob),umdenWertamPunktxzuberechnen,𝑠𝑖𝑧𝑒 = 𝑛,𝑝𝑟𝑜𝑏 = 𝜃
• pbinom(q, size, prob, lower.tail = TRUE),umdasIntegralbiszumPunkt𝑞zuberechnen
• qbinom(p, size, prob, lower.tail = TRUE),umjenenPunktzuerrechnen,beidemdieFläche
unterderKurvegleich𝑝ist.
1DerTerm(𝑛)entsprichtderAnzahlderPermutationenvon𝑧Einsernbei𝑛Zahlen.
𝑧
LVDAA,ArnoHollosi 8

| Beispiel |     |     |     |     |     | ANDEREVERTEILUNGEN |     |
| -------- | --- | --- | --- | --- | --- | ------------------ | --- |
Beispiel
Eine Klausur mit 20 Multiple-Choice-Fragen, bei denen jede Frage 4 Antworten hat, von denen
nur eine richtig ist. Wie hoch ist die Chance, positiv zu sein, wenn zufällig angekreuzt wird? Am
häufigsten (Modus) sind 5 Antworten richtig, mehr als 10 Antworten richtig zu haben, hat nur eine
Wahrscheinlichkeitvon0.4%.
| # n ... | Anzahl an              | Fragen    |     |         |           |     |     |
| ------- | ---------------------- | --------- | --- | ------- | --------- | --- | --- |
| # z ... | Anzahl richtiger       | Antworten |     |         |           |     |     |
| # theta | ... Wahrscheinlichkeit |           |     | richtig | zu liegen |     |     |
n = 20
| z = 0:n    | # Liste der | Zahlen | 0..n |     |     |     |     |
| ---------- | ----------- | ------ | ---- | --- | --- | --- | --- |
| theta =    | 0.25 # 1    | von 4  |      |     |     |     |     |
| # Diagramm | erstellen   |        |      |     |     |     |     |
plot(z, dbinom(z, n, theta), frame.plot=FALSE, main="Chance, #z Fragen richtig zu haben")
| abline(v=10.5, | lty="dashed") |     |     |     |     |     |     |
| -------------- | ------------- | --- | --- | --- | --- | --- | --- |
arrows(10.5,0.18,7.5,0.18,length=0.1)
arrows(10.5,0.18,13.5,0.18,length=0.1)
pKleiner11 = pbinom(10, n, theta) # pbinom ... Summe aller Wahrscheinlichkeiten z < 11
| text(9,0.19,sprintf("%.1f%%",  |     |     | 100*pKleiner11)) |                      |     |     |     |
| ------------------------------ | --- | --- | ---------------- | -------------------- | --- | --- | --- |
| text(12,0.19,sprintf("%.2f%%", |     |     |                  | 100*(1-pKleiner11))) |     |     |     |
Chance, #z Fragen richtig zu haben
02.0
99.6% 0.39%
)ateht ,n ,z(monibd 51.0
01.0
50.0
00.0
|     | 0   |     | 5   |     | 10  | 15  | 20  |
| --- | --- | --- | --- | --- | --- | --- | --- |
z
| Andere | Verteilungen |     |     |     |     |     |     |
| ------ | ------------ | --- | --- | --- | --- | --- | --- |
RkenntauchnocheineReiheweitererVerteilungen, einigedavonwerdenwirnochinderLVkennen
lernenundverwenden:
| • Student-t-Verteilung,Funktionen: |     |     |     | rt(), | dt(), pt(), qt() |     |     |
| ---------------------------------- | --- | --- | --- | ----- | ---------------- | --- | --- |
• Gammaverteilung,Funktionen: rgamma(), dgamma(), pgamma(), qgamma()
| LVDAA,ArnoHollosi |     |     |     |     |     |     | 9   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- |

ANDEREVERTEILUNGEN
• Beta-Vertailung,Funktionen: rbeta(), dbeta(), pbeta(), qbeta()
• Poisson-Verteilung,Funktionen: rpois(), dpois(), ppois(), qpois()
• Logistic-Verteilung,Funktionen: rlogis(), dlogis(), plogis(), qlogis()
• Cauchy-Verteilung,Funktionen: rcauchy(), dcauchy(), pcauchy(), qcauchy()
• ExponentielleVerteilung,Funktionen: rexp(), dexp(), pexp(), qexp()
LVDAA,ArnoHollosi 10