<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Arbeitsblätter (Skriptum)/Arbeitsblätter (PDF)/01-Schlussfolgern-mit-Bayes.pdf -->

|     |     |     | Satz | von Bayes |
| --- | --- | --- | ---- | --------- |
ArnoHollosi
Contents
BayesFormel 1
Beispiel: TestaufKrankheit . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 1
BayesscheSchlussfolgerung 2
Beispiel: Filmkritik . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Ergebnisbeliebig? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Zusammenfassung 5
| Bayes                                           | Formel |     |     |          |
| ----------------------------------------------- | ------ | --- | --- | -------- |
| WirhabenmitderbedingtenWahrscheinlichkeit𝑝(𝐴|𝐵) |        |     |     | = 𝑝(𝐴∩𝐵) |
𝑝(𝐵) undderkommutativenEigenschaft
𝑝(𝐴∩𝐵) = 𝑝(𝐵∩𝐴)bereitsdienotwendigenGrundlagenfürdenSatzvonBayes:
𝑝(𝐵|𝐴)×𝑝(𝐴)
𝑝(𝐴|𝐵) =
𝑝(𝐵)
(ErgibtsichdurchEinsetzenundUmformenderobigenFormeln.)
WirsindnuninderLage,bedingteWahrscheinlichkeitenvonanderenabzuleiten!
| Beispiel: | TestaufKrankheit |     |     |     |
| --------- | ---------------- | --- | --- | --- |
GreifenwirnochmaldasBeispielausdemGrundlagen-Auffrischungsarbeitsblattauf:
EinTestidentifiziertdieKrankheitzu90%fallssievorhandenistundzu5%werdenGesunde
alskrankeingestuft. DieKrankheittrittnurbei1%derPopulationauf. Wiewahrscheinlich
istdannjemandbeipositivemTestwirklichkrank?
Dieser Text beschreibt bedingte Wahrscheinlichkeiten: wenn jemand krank ist (Bedingung), wie
wahrscheinlich zeigt der Test dann ein positives Ergebnis (identifziert also die Krankheit richtig)?
| Antwort:              | 90%. FormulierenwirdenTextalsWahrscheinlichkeiten: |        |                     |                  |
| --------------------- | -------------------------------------------------- | ------ | ------------------- | ---------------- |
| p_positiv_wenn_krank  |                                                    | = 0.9  | # p(positiv|krank)  |                  |
| p_positiv_wenn_gesund |                                                    | = 0.05 | # p(positiv|gesund) |                  |
| p_krank               | = 0.01                                             |        | # p(krank)          |                  |
| p_gesund              | = 1 - p_krank                                      |        | # ergibt            | sich automatisch |
Wirkönnenunsalsoausrechnen,wiehochdieWahrscheinlichkeitist,dasseinTestpositivausfällt:
| p_positiv | = p_positiv_wenn_krank |     | * p_krank  | +   |
| --------- | ---------------------- | --- | ---------- | --- |
|           | p_positiv_wenn_gesund  |     | * p_gesund |     |
1

BAYESSCHESCHLUSSFOLGERUNG
NunkönnenwirdieFragebeantworten,wiewahrscheinlichjemandbeipositivemTestwirklichkrank
ist. WirverwendendazudieFormelvonBayes:
# p(A|B) = p(B|A) * p(A) / p(B)
p_krank_wenn_positiv = p_positiv_wenn_krank * p_krank / p_positiv
p_krank_wenn_positiv
[1] 0.1538462
Nur1von7positivgetestenPersonenhatdieKrankheitwirklich!
SiekönnensichvonderRichtigkeitdiesesWertsüberzeugen,wennSiedieselbeRechnunganstattmit
WahrscheinlichkeitenmitPersonenrechnen:
# Population in Österreich
pop = 8000000
# davon gesund (99%) bzw. krank (1%)
pop_krank = pop * 0.01
pop_gesund = pop * (1 - 0.01)
# bei den Kranken hat der Test 0.9 Chance
pop_positiv_wenn_krank = pop_krank * 0.9
# Gesunde werden zu 5% falsch identifiziert
pop_positiv_wenn_gesund = pop_gesund * 0.05
# Summe der positiven Tests
pop_positiv = pop_positiv_wenn_krank + pop_positiv_wenn_gesund
# Anteil der wirklich Kranken
pop_positiv_wenn_krank / pop_positiv
[1] 0.1538462
Bayessche Schlussfolgerung
In der Forschung wird häufig von Messreihen auf Parameter-Werte in einem Modell geschlossen. In
unserem Kontext zum Beispiel: Wie groß ist die Wahrscheinlichkeit, dass bei einer Münze 𝜃 = 0.75
ist, wenn wir die Serie 𝕐 = {0,1,1,1,0} an Münzwürfen sehen? Diese Art der Fragestellung ist
derKernallerwissenschaftlicherForschung. Andersformuliert: waskönnenwirüber𝜃–unserenzu
untersuchendenModellparameter–sagen,wennwireineMessreihe(Menge𝕐)vorliegenhaben? Der
SatzvonBayesgibtAuskunft:
𝑝(𝕐|𝜃)×𝑝(𝜃)
𝑝(𝜃|𝕐) =
𝑝(𝕐)
WasbedeutendieeinzelnenTeilederGleichungindiesemZusammenhang?
• 𝑝(𝜃|𝕐)…Posterior,WahrscheinlichkeitfürunserModell(𝜃)wenndieDaten(𝕐)miteinbezogen
werden
• 𝑝(𝕐|𝜃)…Likelihood,Maßdafür,wiegutbestimmteModellannahmenzudenbeobachtetenDaten
passen.
• 𝑝(𝜃) … Prior, Vorwissen/Annahme über die Wahrscheinlichkeit, dass unser Modell (und die
Modellparameter)stimmen
• 𝑝(𝕐)…Evidenz,Normierungsfaktor
LVDAA,ArnoHollosi 2

Beispiel: Filmkritik BAYESSCHESCHLUSSFOLGERUNG
In Bayesscher Statistik gehen wir also immer von einem Vorwissen/einer Annahme aus und
korrigieren/erweitern unser Wissen anhand der Daten der Messreihe. Effektiv werden dadurch
WahrscheinlichkeitenfürdieModellparameter(hier: 𝜃)verteiltbzw. neugewichtet.
Beispiel: Filmkritik
Angenommen,wirwollenüberprüfen,wieguteinFilmbeimPublikumankommt. WirzeigendenFilm
im Rahmen einer Versuchsreihe 50 Personen. Wir selbst sind sehr überzeugt, dass der Film Anklang
findet: unsereFreund*innenhabenihnallesehrgutgefunden:o)
UnserPrior𝑝(𝜃)(Vorwissen)könntez.B.alsosoaussehen(0=Filmgefälltnicht,1=Filmgefälltgut):
0.0 0.2 0.4 0.6 0.8 1.0
40.0
20.0
00.0
Prior (Filmkritik)
Kritik
)ktirK(p
NachderVorstellungbefragenwirdasPublikummiteinereinfachenJa/Nein-Frage: hateuchderFilm
gefallen? Von den 50 Personen erhalten wir 30x ein Ja, 20x ein Nein. Für sich alleine, ergibt das eine
Likelihood𝑝(𝕐|𝜃),diesoaussieht(dasMaximumistgenaubei30÷50 = 0.6):
0.0 0.2 0.4 0.6 0.8 1.0
80.0
40.0
00.0
Likelihood der Publikumsantworten
Kritik
)
|q
Y(p
LVDAA,ArnoHollosi 3

Beispiel: Filmkritik BAYESSCHESCHLUSSFOLGERUNG
Nach Anwenden der Bayes-Regel entsteht unser neues, aktualisiertes Wissen über die Qualität des
Films. Der Posterior kombiniert Vorwissen (Prior) und Daten (bzw. genauer: die daraus abgeleitete
Likelihood). DasErgebnissiehtsoaus:
0.0 0.2 0.4 0.6 0.8 1.0
60.0
40.0
20.0
00.0
Posterior (Filmkritik)
Kritik
)Y|
q(p
Zwei Punkte fallen auf: (1) im Vergleich zur Likelihood hat sich das Ergebnis wegen unserem Prior
etwasnachrechtsverschoben;(2)dasIntervallistengergeworden. DerGrunddafürist,dasswirmehr
Datenhaben: Publikum+Vorwissen(Freunde)lasseneinegenauereBestimmungzu.
WürdenwireineweitereProbevorstellungdesFilmsgebenunddortwärenz.B.100Personen,vondenen
wir80xJaund20xNeinerhalten,dannkönntenwirdenPosteriorvonobennunalsVorwissennützen
undmitdenneuenDatenaktualisieren. DasErgebnissähedannwiefolgtaus:
0.0 0.2 0.4 0.6 0.8 1.0
21.0
80.0
40.0
00.0
Posterior (nach 2. Vorführung)
Kritik
)Y|
q(p
Die 2. Vorstellung alleine hätte eine Kritik von 0.8 (80 ÷ 100 = 0.8). Wegen unseres
(𝑗𝑎) (𝑔𝑒𝑠𝑎𝑚𝑡)
Vorwissens (der Posterior nach der ersten Vorstellung) ist nun der Modus (=max. Wert) bei 0.75.
Wieder greift dasselbe Prinzip der Bayes-Regel, dass wir alles Wissen (Freunde, 1. Vorstellung, 2.
Vorstellung)indasErgebnishabeneinfließenlassenundsozueinembesserenErgebniskommen, als
wennwirnurdie2. Vorstellungalleinebetrachten.
LVDAA,ArnoHollosi 4

Ergebnisbeliebig? ZUSAMMENFASSUNG
DasBeispielzeigtauch, dasswirmitBayesscherStatistiknichtnurPunktwertefürKoeﬀizientenoder
Intervalleangebenkönnen,sonderngleicheinekompletteWahrscheinlichkeitsverteilungen.
Ergebnisbeliebig?
Eine Frage, die sich in diesem Zusammenhang aufdrängt: können wir also jedes beliebige Ergebnis
erzeugen bzw. erzwingen? Wenn wir bspw. unser Vorwissen nur “stark genug” machen? Aus
mathematischer Sicht: ja. Aus praktischer Sicht: nein. Mathematisch brauchen wir unseren Prior
nur eng genug machen, so dass er jede Likelihood der Messreihe dominiert. Wir wollen, dass ein
MedikamentdieZulassungbesteht? EinfachdenpassendenPriorwählen!
In der Praxis muss man die Wahl des Priors rechtfertigen. Zudem werden meist nur schwach-
informative Priors verwendet. Deren Aufgabe ist nicht das Ergebnis stark zu beeinflussen, sondern
unmögliche Werte auszuschließen und so die Berechnung stabiler zu machen. Beispiel: Körpergröße
liegtbeiErwachsenenzu95%imBereich150..194cm. KeinerwachsenerMenschwarje35cmkleinoder
350cmgroß. DaskönntenwiralsPriorfürKörpergrößeverwenden.
Zusammenfassung
DieBayes-FormeleröffnetunsdasTorzueinerneuenStatistikwelt. Mitihrwirdesmöglich,direktvon
Daten auf das Modell zu schließen (𝑝(𝜃|𝕐)). Wir erkaufen uns diesen Vorteil durch die Einführung
eines Priors. Die Wahl des Priors muss fachlich gut begründet sein, anderenfalls können starke
Prior-Verteilungen zu falschen Schlüssen führen. Ein weiterer Nachteil ist, dass wir für realistische
AufgabenstellungeinVielfachesderRechenpowerderfrequentistischenStatistikbenötigen.
AlsErgebniserhaltenwirfürdiegesuchtenModellparameternichtnurWerteoderKonfidenzintervalle
sonderneinevollständigeWahrscheinlichkeitsverteilung,denPosterior.
LVDAA,ArnoHollosi 5