<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/04-Effektgroesse.pdf -->

Effektgrößen
ArnoHollosi
Contents
Motivation 1
StandardisierteEffektgröße . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 2
EffektgrößenbeiRegression 2
GrößederKoeﬀizienten!=Effektgröße . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
ErklärteVarianzeinesModells . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
EffektgrößeeinzelnerParameter . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Motivation
StatistischeAnalysenliefernimmerein(mathematisches)Ergebnis. ObdiesesErgebnisaberauchreal
ist,d.h. derWirklichkeitentspricht,verratendieZahlenselbstmeistensnicht. FürdiePraxisrelevantist
unteranderemdieEffektgröße. NurwenneinEffektsogroßist,dasserauchpraktischeBedeutunghat,
sindstatistischsignifikanteErgebnisserelevant.
NehmenwiralsBeispieldieKörpergröße: InÖsterreichistdieDurchschnittsgrößevonMännern179cm,
von Frauen 166cm. Die Größe ist normalverteilt, mit einer Standardabweichung von ca. 7cm. Wir
könntenalsodieabweichendeKörpergrößealsEffektdesGeschlechtssehen. Isterrelevant?
140 150 160 170 180 190 200 210
40.0
20.0
00.0
Körpergröße von Erwachsenen in Österreich
Körpergröße (cm)
ytisneD
Frauen Männer
WirkönnendenEffektalsUnterschiedderDurchschnittsgrößenberechnen: 179𝑐𝑚−166𝑐𝑚 = 13𝑐𝑚
1

| StandardisierteEffektgröße |     | EFFEKTGRÖSSENBEIREGRESSION |     |     |     |
| -------------------------- | --- | -------------------------- | --- | --- | --- |
Während bei der Größe (und anderen physikalischen Messwerten) absolute Zahlen sinnvoll
interpretiert werden können, sind viele Konstrukte unklar: was bedeutet ein Effekt von 3.2 bei
Fröhlichkeit?
StandardisierteEffektgröße
Eine standardisierte Effektgröße für metrische Variable ist Cohens d und bezieht sich auf die
StandardabweichungineinemSampleundberechnetsichals:
𝜇 −𝜇
𝑥 𝑦
𝑑 =
𝜎
Am Beispiel der Körpergröße: 𝑑 = 179𝑐𝑚−166𝑐𝑚 = 1.86. Cohen hat folgende Daumenregeln für die
7𝑐𝑚
Effektgrößeaufgestellt:
• 𝑑 ≈ 0.2giltalskleinerEffekt
• 𝑑 ≈ 0.5giltalsmittlererEffekt
𝑑 ≈ 0.8giltalsgroßerEffekt
•
DerEffektdesGeschlechtsaufdieKörpergrößeistindiesemSchemaalsoeinsehrgroßerEffekt.
Beispiel: Facebook-Studie
EineStudiehatdieAuswirkungnegativerKommentareaufFacebookausgewertet1.
FolgendesErgebnis
wurdedortstatistischsignifikantgefunden:
WhenpositivepostswerereducedintheNewsFeed,[…]thepercentageofwordsthatwere
negativeincreasedbyB=0.04%(t=2.71,P=0.007,d=0.001).
Wasbedeutetein𝑑 = 0.001? Esheißt,dassbeieinergegebenenStandardabweichungderEffektnur0.1%
derStandardabweichungausgemachthat. WennsichbeidegetestetenFacebook-Nutzergruppenähnlich
verhalten,dannbedeutetdas, dasseinePersonmin. 2500Wörtertippenmuss2 bevor(imSchnitt)ein
zusätzlichesnegativesWortauftaucht(beiderdurchschnittlichenLängeeinesFacebook-Postingssind
dasca. 100Postings;o)EinrelevanterEffekt?
| Effektgrößen | bei Regression |     |     |     |     |
| ------------ | -------------- | --- | --- | --- | --- |
AuchbeiRegressionsgleichungenkönnenwirdieeinzelnenKoeﬀizientenalsEffektgrößeninterpretieren.
SehenwirunsdazufolgendeVariablean:
set.seed(4321)
| x1 = rnorm(500, | 150, 10) |     |     |     |     |
| --------------- | -------- | --- | --- | --- | --- |
| x2 = rnorm(500, | 200, 10) |     |     |     |     |
df = data.frame(
| x1 = x1, | x2 = x2,              |          |     |     |     |
| -------- | --------------------- | -------- | --- | --- | --- |
| y1 = x1  | + 0.1*x2 + rnorm(500, | 10, 10), |     |     |     |
| y2 = x1  | + 1*x2 + rnorm(500,   | 10, 10), |     |     |     |
| y3 = x1  | + 10*x2 + rnorm(500,  | 50, 50)) |     |     |     |
DerunterschiedlichstarkeZusammenhangzwischen𝑦 und𝑥
𝑖 2 istimScatterplotdeutlichzuerkennen:
1Kramera,Guillory,andHancock(2014): Experimentalevidenceofmassive-scaleemotionalcontagionthroughsocialnetworks,http:
//www.pnas.org/content/111/24/8788.full
2Numberneededtotreat(siehez.B.http://rpsychologist.com/d3/cohend/)NNT
|     |     |     | = function(CER, | d) { return | (1 / |
| --- | --- | --- | --------------- | ----------- | ---- |
(pnorm(d + qnorm(CER))-CER)) },CER…eventrate,NNT(0.5, 0.001) ~ 2500. Alternativ: bei122MioWörtenderStudie
gabeseinenUnterschiedvon0.04%=~50.000Wörter,dasistinetwajedes2500steWort.
| LVDAA,ArnoHollosi |     |     |     |     | 2   |
| ----------------- | --- | --- | --- | --- | --- |

GrößederKoeﬀizienten!=Effektgröße EFFEKTGRÖSSENBEIREGRESSION
022
004
| 081 |     |     | 063 |     |
| --- | --- | --- | --- | --- |
| 1Y  |     |     | 2Y  |     |
023
041
| 170 | 190 | 210 230 | 170 190 | 210 230 |
| --- | --- | ------- | ------- | ------- |
|     |     | X2      |         | X2      |
0042
3Y
0002
| 170 | 190 | 210 230 |     |     |
| --- | --- | ------- | --- | --- |
X2
WiesehendieRegressionsgleichungenaus?
| m1 = stan_glm(y1 | ~ x1 | + x2, data=df, seed=123, | refresh=0) |     |
| ---------------- | ---- | ------------------------ | ---------- | --- |
| m2 = stan_glm(y2 | ~ x1 | + x2, data=df, seed=123, | refresh=0) |     |
| m3 = stan_glm(y3 | ~ x1 | + x2, data=df, seed=123, | refresh=0) |     |
𝑥 𝑥
(Intercept) 1 2
|     |     | m1 6.81   | 0.97 0.14 |     |
| --- | --- | --------- | --------- | --- |
|     |     | m2 27.74  | 0.95 0.95 |     |
|     |     | m3 108.72 | 0.97 9.74 |     |
Sieentsprechen(mitkleinemFehler)derWirklichkeit: erhöhtsich𝑥 um1,danngibtderKoeﬀizientan,
2
wievielsich𝑦 imDurchschnitterhöht. EshandeltsichumabsoluteZahlen. DieKoeﬀizientenkönnen
𝑖
indiesemSinndirektalsEffektinterpretiertwerden.
GrößederKoeﬀizienten!=Effektgröße
Es ist ein Trugschluss zu glauben, dass je größer der Koeﬀizient ist, desto größer auch der Effekt sein
muss. Ein einfaches Gegenbeispiel beweist es: für die Regression Weight ~ Height + Gender + Age
(Größe in cm, Gewicht in kg) kommt ein Größe-Koeﬀizient von ca. 0.7 heraus (Einheit kg/cm), der
kleiner als der Wert des Geschlecht-Koeﬀizienten ist. Misst man Größe allerdings in Metern statt
ZentimeternistderKoeﬀizientmit72(Einheitkg/m)plötzlichgrößeralsderdesGeschlechts.
body = read.csv('daten/body-dimensions.csv', stringsAsFactors = TRUE)
| body$Height_m | = body$Height | / 100 |     |     |
| ------------- | ------------- | ----- | --- | --- |
modell1 = stan_glm(Weight ~ Height + Gender + Age, data=body, seed=123, refresh=0)
modell1m = stan_glm(Weight ~ Height_m + Gender + Age, data=body, seed=123, refresh=0)
LVDAA,ArnoHollosi 3

| ErklärteVarianzeinesModells |     |     | EFFEKTGRÖSSENBEIREGRESSION |     |
| --------------------------- | --- | --- | -------------------------- | --- |
modell1 modell1m
|     | (Intercept) | -64.12 | -64.12 |     |
| --- | ----------- | ------ | ------ | --- |
|     | Height      | 0.72   | 72.49  |     |
|     | GenderMale  | 7.72   | 7.72   |     |
|     | Age         | 0.18   | 0.18   |     |
Der tatsächliche, reale Effekt von Größe auf Gewicht ist aber in beiden Modellen gleich groß. D.h. je
nachdemwiedieVariablenskaliertsind,ändertsichzwardieGrößederKoeﬀizienten,aberwievieldie
Variable zur Erklärung der Y-Variable beiträgt lässt sich daraus nicht ablesen. Man kann sich diese
Eigenschaft zu Nutze machen, in dem bspw. alle Variablen auf dieselbe Größe skaliert werden (z-
Skalierung)oderalleKoeﬀizientenmitderStandardabweichungmultipliziertwerden.
ErklärteVarianzeinesModells
𝑅2gibtdieerklärteVarianzeineslinearenModellsanundkannmitbayes_R2()berechnetwerden. Die
erklärte Varianz eines Modells kann als Indikator für ein passendes Modell herangezogen werden: je
| höher𝑅2,destomehrVarianzimDatensatzwirderklärt. |     | 𝑅2  |     |     |
| ----------------------------------------------- | --- | --- | --- | --- |
solltedennochmitVorsichtinterpretiert
𝑅2
werden: sagtnuretwasüberdenvorliegendenDatensatzaus, nichtaberüberdieGenauigkeitbei
Vorhersagenbzw. derVerallgemeinerungaufdiePopulation.
Wieimmer,habenwirbishernurvonPunktwertengesprochen. Eigentlichist𝑅2aucheineVerteilung.
Histogram of bayes_R2(modell1)
=
|     | median | 0.58 |     |     |
| --- | ------ | ---- | --- | --- |
95% HDI
0.535 0.629
| 0.50 | 0.55 | 0.60 |     | 0.65 |
| ---- | ---- | ---- | --- | ---- |
𝑅2
sagt auch nichts darüber aus, ob unser Modell korrekt ist: das Modell kann exakt der Wirklichkeit
entsprechenunddennocheinsehrkleines𝑅2
|     |     | haben,weildieunabhängigenVariablen𝑥 |     | desModells |
| --- | --- | ----------------------------------- | --- | ---------- |
𝑖
ebennureinenkleinenTeilderabhängigenVariable𝑦erklären.
ImUmkehrschlusskanneinModell,das
derWirklichkeitnichtentspricht,einsehrhohes𝑅2 haben,weil“erklärteVarianz”ebennichtkausaler
𝑅2
Zusammenhangbedeutet. solltedaheralsIndizverstandenundgemeinsammitanderenDiagnose
verknüpftwerden,anstattesalseinabsolutesMaßfürdieQualitäteinesModellszuverstehen.
LVDAA,ArnoHollosi 4

EffektgrößeeinzelnerParameter EFFEKTGRÖSSENBEIREGRESSION
EffektgrößeeinzelnerParameter
Mankannsich𝑅2 auchzuNutzemachen,umdenEinflussbzw. dieEffektgrößeeinzelnerParameter
𝑅2
zu berechnen. Dazu berechnet man zuerst des vollständigen Modells und entfernt dann eine
𝑅2 𝑅2
der Variablen, um zu schauen, wie sich verändert. Wenn stark fällt, dann hat die Variable
offensichtlichsehrvielvonderVarianzimDatensatzerklärt. Bleibthingegen𝑅2 beinaheunverändert,
dannkönnenwirdarausschließen,dassdieVariablenurwenigzurErklärungderDatenbeiträgt.
BerechnenwirnunzweiweitereModelle:
modell2 = stan_glm(Weight ~ Height + Age, data=body, seed=123, refresh=0)
modell3 = stan_glm(Weight ~ Gender + Age, data=body, seed=123, refresh=0)
Undschauenwirunsdas𝑅2allerdreiModellean:
|     |     | Name    | Modellformel |                     | R²   |
| --- | --- | ------- | ------------ | ------------------- | ---- |
|     |     | Modell1 | 𝑊𝑒𝑖𝑔ℎ𝑡       | ∼ 𝐻𝑒𝑖𝑔ℎ𝑡+𝐺𝑒𝑛𝑑𝑒𝑟+𝐴𝑔𝑒 | 0.58 |
|     |     | Modell2 | 𝑊𝑒𝑖𝑔ℎ𝑡       | ∼ 𝐻𝑒𝑖𝑔ℎ𝑡+𝐴𝑔𝑒        | 0.54 |
|     |     |         | 𝑊𝑒𝑖𝑔ℎ𝑡       | ∼ 𝐺𝑒𝑛𝑑𝑒𝑟+𝐴𝑔𝑒        |      |
|     |     | Modell3 |              |                     | 0.44 |
WieerwarteterklärtdasersteModellmitseinendreiX-VariablendiemeisteVarianzimDatensatzmit
58 Prozent. Bei Modell 2, das Gender entfernt hat, fällt 𝑅2 auf 54 Prozent. Bei Modell 3, das Height
entfernthat,fällt𝑅2auf44Prozent.
Dasheißt,ohneHeighterklärtdasModelldeutlichwenigerVarianz
imDatensatzalsohneGender→dieKörpergrößehatalsoeinendeutlichstärkerenEffekt–einebessere
“Erklärungskraft”,einenhöherenEinfluss–aufdasKörpergewichtalsdasGeschlecht.
UmdieseErklärungsstärkebesservergleichbarzumachen,istesmöglich,einstandardisiertesMaßzu
verwenden: Cohens𝑓2. EsistdasVerhältnisvonerklärterzuunerklärterVarianzunderrechnetsichaus:
𝑅2 −𝑅2
|     |     |     |     | 𝑓2 = 𝐴𝐵 𝐴 |     |
| --- | --- | --- | --- | --------- | --- |
1−𝑅2
𝐴𝐵
(wobei𝑅2 das𝑅2 fürjenesModellist,dasalleVariablenAundVariableBenthält,und𝑅2 das𝑅2
𝐴𝐵 𝐴
fürModellnurmitdenVariablenAist.) AmBeispielmitdenKörpermodellen:
| r2_m1 =   | bayes_R2(modell1) |          |               |     |     |
| --------- | ----------------- | -------- | ------------- | --- | --- |
| r2_m2 =   | bayes_R2(modell2) |          |               |     |     |
| r2_m3 =   | bayes_R2(modell3) |          |               |     |     |
| f2_height | = (r2_m1          | - r2_m3) | / (1 - r2_m1) |     |     |
mean(f2_height)
[1] 0.33
| f2_gender | = (r2_m1 | - r2_m2) | / (1 - r2_m1) |     |     |
| --------- | -------- | -------- | ------------- | --- | --- |
mean(f2_gender)
[1] 0.11
UmdenEffektderKörpergrößezuberechnen,vergleichenwirdasvollständigeModell(modell1)mit
jenem, bei dem die Körpergröße fehlt (modell3). Der Unterschied zwischen beiden Modellen muss
derEffektderKörpergrößesein. AnalogistderVergleichmitmodell2(beidemdasGeschlechtfehlt)
geeignet,dieEffektgrößederGeschlecht-Variableherauszufinden.
LVDAA,ArnoHollosi 5

EffektgrößeeinzelnerParameter EFFEKTGRÖSSENBEIREGRESSION
| Miteinem𝑓2 |     | 0.33fürdieGrößeund𝑓2 |     |     |                                |                     |
| ---------- | --- | -------------------- | --- | --- | ------------------------------ | ------------------- |
|            | =   |                      |     |     | = 0.11fürdasGeschlechtistklar, | dassGeschlechteinen |
kleinerenEffektaufdasGewichteinerPersonhatalsdieKörpergröße.
Wie oben erwähnt, erklärt die Körpergröße zusätzliche 14 Prozentpunkte der Varianz des Gewichts,
nachdem Alter und Geschlecht bereits berücksichtigt wurden. 𝑓2 = 0.33 bedeutet, dass dieser
zusätzlicheErklärungsbeitragrund33%derimvollständigenModellnochunerklärtenVarianzbeträgt.
Andersformuliert:
zusätzlicherklärteVarianz
𝑓2
=
unerklärteVarianzimvollständigenModell
𝑓2 istalsoeinrelativesMaßund𝑓2 = 0.33bedeutetnicht, dassdieVariable33%derVarianzerklärt.
Wenn also bspw. für eine Variable A 𝑓2 = 0.4 und für eine Variable B 𝑓2 = 0.04 ist, dann ist der
zusätzlicheErklärungsbeitragvonAzehnmalsogroßwiejenervonB,jeweilsrelativzurunerklärtenVarianz
desselbenvollständigenModells. Dasbedeutetnicht,dassAeinezehnmalsogroßeVeränderungvonY
bewirktoderzehnmalsowichtigfüreinepraktischeEntscheidungist.
Richtwertefür𝑓2
CohenhatfolgendeRichtwertefür𝑓2angegeben:
| • 𝑓2 | ≈ 0.02giltalskleinerEffekt |     |     |     |     |     |
| ---- | -------------------------- | --- | --- | --- | --- | --- |
𝑓2
| •   | ≈ 0.15giltalsmittlererEffekt |     |     |     |     |     |
| --- | ---------------------------- | --- | --- | --- | --- | --- |
| 𝑓2  | ≈ 0.35giltalsgroßerEffekt    |     |     |     |     |     |
•
Hinweis: dieRichtwertevonCohensindalsDaumenregelzuverstehen. IneinemgegebenenFachbzw.
Kontextkönnenbspw. auchwesentlichkleinereWertehöchstbedeutsamsein.
Effektgröße-Funktion
DiedaatoolshabeneinehilfreicheFunktion,welcheeserlaubt,dieEffektgröße𝑓2direktzuberechnen:
effectsize(modell1)
| Single | term deletions |     | (incl. | their | interactions) |     |
| ------ | -------------- | --- | ------ | ----- | ------------- | --- |
Model:
| Weight | ~ Height | +    | Gender | + Age |     |     |
| ------ | -------- | ---- | ------ | ----- | --- | --- |
|        | Df RSS   | AIC  |        | R2 f2 |     |     |
| <none> | 37580    | 3632 | 0.583  |       |     |     |
| Age    | 1 39043  | 3649 | 0.567  | 0.039 |     |     |
| Gender | 1 41476  | 3680 | 0.540  | 0.104 |     |     |
| Height | 1 50060  | 3775 | 0.445  | 0.332 |     |     |
Die Funktion berechnet 𝑅2 und den darauf aufbauend 𝑓2-Wert bei linearen Modellen. “<none>” ist
das Originalmodell mit allen Variablen. Jede weitere Zeile gibt an, welche Variable entfernt worden
ist. Interaktionsterme werden gemeinsam mit den Basisvariablen entfernt. Die Funktion verschafft
einendirektenÜberblicküberdieEffektgrößederVariablen;sieistauchfürdielogistischeRegression
einsetzbar.
LVDAA,ArnoHollosi 6