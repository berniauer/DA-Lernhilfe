<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Übungen/30 Übungen zum Verständnis/Verständnisaufgaben.pdf -->

DAA - Übungsaufgaben
ArnoHollosi
Contents
DAA-LV:AufgabenzumVerstehenundBeurteilenstatistischerModelle 2
A:BayesschesSchlussfolgern 3
Aufgabe01: WasbedeuteteinAlarm? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Aufgabe02: GleicheDaten,verschiedeneErgebnisse . . . . . . . . . . . . . . . . . . . . . . . . . . 3
Aufgabe03: NeuesWissendurcherneutesEinlesen? . . . . . . . . . . . . . . . . . . . . . . . . . 3
B:LineareRegressioninterpretieren 4
Aufgabe04: WelcheWohnungistderBasisfall? . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
Aufgabe05: Woraufbeziehensichdie95Prozent? . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
Aufgabe06: Präzisegeschätzt,weithinausvorhergesagt. . . . . . . . . . . . . . . . . . . . . . . . 5
C:BerechnungundModellprüfung 5
Aufgabe07: ZehnmalsovieleSamples . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Aufgabe08: DerSampleristzufrieden . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
Aufgabe09: ImGesamtdurchschnittpasstalles . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
Aufgabe10: RichtigerMittelwert,falscheStreuung. . . . . . . . . . . . . . . . . . . . . . . . . . . 6
D:VorhersagenundEntscheidungen 7
Aufgabe11: DurchschnittodernächsteLieferung? . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
Aufgabe12: UnsichereWerte,klarerUnterschied . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
Aufgabe13: DiebesteEntscheidungliegtwo? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
E:WelcheFällewerdenverglichen? 8
Aufgabe14: WelchesOP-Teamschneidetbesserab? . . . . . . . . . . . . . . . . . . . . . . . . . . 8
Aufgabe15: MehrZimmer: teureroderbilliger? . . . . . . . . . . . . . . . . . . . . . . . . . . . . 8
Aufgabe16: Einfachalleskontrollieren? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
F:EffektgrößeundpraktischeBedeutung 10
Aufgabe17: DergrößereKoeﬀizientgewinnt? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
Aufgabe18: Klarpositiv,aberrelevant? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 10
Aufgabe19: KleinerZusatzbeitrag,unwichtigeVariable? . . . . . . . . . . . . . . . . . . . . . . . 10
G:InteraktionenundDatenbereiche 11
Aufgabe20: EinGruppenunterschiedvonzwölfPunkten? . . . . . . . . . . . . . . . . . . . . . . 11
Aufgabe21: DerGruppenkoeﬀizientwechseltdasVorzeichen . . . . . . . . . . . . . . . . . . . . 12
Aufgabe22: VerschiedeneSteigungenoderverschiedeneAusschnitte? . . . . . . . . . . . . . . . . 12
1

DAA-LV:AUFGABENZUMVERSTEHENUNDBEURTEILENSTATISTISCHERMODELLE
H:Modellevergleichen 13
Aufgabe23: HöheresR² . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 13
Aufgabe24: EinSieger? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
Aufgabe25: EinguterTestfürwelcheZukunft? . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
I:LogistischeRegressionundEntscheidungen 14
Aufgabe26: Wasbedeuten20Prozent? . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
Aufgabe27: DoppelteOdds,doppelteWahrscheinlichkeit? . . . . . . . . . . . . . . . . . . . . . . 15
Aufgabe28: GleicheAUC,gleichgutesModell? . . . . . . . . . . . . . . . . . . . . . . . . . . . . 15
Aufgabe29: DiehöhereTrefferquoteentscheidet? . . . . . . . . . . . . . . . . . . . . . . . . . . . 16
Aufgabe30: Perfektgetrennt,trotzdemunklar . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 16
DAA-LV:AufgabenzumVerstehenundBeurteilenstatistischerModelle
Bei diesen Aufgaben geht es nicht (nur) um die Berechnung bzw. um die Interpretation einzelner
Koeﬀizienten, sondern um das Verständnis, aus welchen Modellen und Ergebnissen sich welche
Aussagen ableiten lassen. Sie testen also eher das “globale” Verständnis, das wir zwischendurch in
derLehrveranstaltungbesprochenhaben,undnichtsosehrdenBerechnungswegdesModellsselbst.
DieAufgabenorientierensichandenArbeitsblätternundandenLehrzielenderLV:Ergebnisseverständlich
interpretieren,dentatsächlichvorgenommenenVergleicherkennen,Unsicherheitrichtiginterpretierenund
dieVerlässlichkeiteinesModellsbegründetbeurteilen.
Alle Aufgaben sind in sich abgeschlosssen. Der jeweilige Kontext, die Variablen und alle notwendigen
ZahlensteheninderAufgabenstellung.
Niveaus: “A” = ein grundlegender Interpretationsschritt; “B” = mehrere Informationen verbinden; “C”
= eine naheliegende Schlussfolgerung kritisch prüfen oder Alternativerklärungen abwägen. Zeitliche
Orientierung: 3–5Minutenfür“A”Aufgaben,5–7Minutenfür“B”und7–10Minutenfür“C”Aufgaben.
IchbinauchanIhremFeedbackinteressiert: entwederimMoodle-ForumoderperE-Mail. FallsIhnenetwas
auffälltbzw. unklarvorkommtoderichFehlergemachthabe,lassenSieesmichbittewissen.
Einsatz von KI: Wenn Sie KI zur Lernunterstützung verwenden, empfehle ich Ihnen zuerst eine Antwort
selbst zu formulieren, die Sie dann gemeinsam mit der Fragestellung der KI geben, um konstruktives
Feedbackzuerhaltenbzw. dieKIweiterführendeFragenausdenkenzulassen. SolltenSiekeineAntwort
finden,formulierenSiezumindesteinepartielleAntwortbzw. ihre“rohen”Gedankenundlassensichvon
derKIzuersteinenTippgeben,bevorSiesichdievollständigeAntwortgebenlassen.
LVDAA,ArnoHollosi 2

A:BAYESSCHESSCHLUSSFOLGERN
| A: Bayessches | Schlussfolgern       |     |     |     |     |     |
| ------------- | -------------------- | --- | --- | --- | --- | --- |
| Aufgabe01:    | WasbedeuteteinAlarm? |     |     |     |     |     |
Niveau: A
Eine automatische Prüfmaschine soll defekte Bauteile erkennen. Bei einer Kontrolle von 10.000 Bauteilen
ergabensichfolgendeZahlen:
|     |     | Zustand        | Alarm KeinAlarm | Gesamt       |     |     |
| --- | --- | -------------- | --------------- | ------------ | --- | --- |
|     |     | Defekt         | 90              | 10 100       |     |     |
|     |     | Funktionsfähig | 495             | 9.405 9.900  |     |     |
|     |     | Gesamt         | 585             | 9.415 10.000 |     |     |
EinMitarbeitersagt: “DieMaschineerkennt90%derdefektenBauteile. WennsieAlarmgibt,istdasBauteil
dahermit90%Wahrscheinlichkeitdefekt.”
1. WelchezweiunterschiedlichenFragenwerdenhierverwechselt?
2. LiegtderAnteiltatsächlichdefekterBauteileunterdenAlarmennäherbei15%,50%oder90%?
3. Könnte dieser Anteil bei einer anderen Lieferung höher sein, obwohl Erkennungsrate und
FehlalarmratederPrüfmaschineunverändertbleiben?
| Aufgabe02: | GleicheDaten,verschiedeneErgebnisse |     |     |     |     |     |
| ---------- | ----------------------------------- | --- | --- | --- | --- | --- |
Niveau: B
EinneuesLernangebotwird20zufälligausgewähltenPersonenausseinerZielgruppegezeigt. 16Personen
würden es nutzen. Zwei Analysen verwenden dieselben Antworten und dasselbe Modell für Ja/Nein-
Antworten:
| Analyse | PriorvorderBefragung                            |     |     |     | Posterior-Mittelwert |       |
| ------- | ----------------------------------------------- | --- | --- | --- | -------------------- | ----- |
| A       | AlleAnteilezwischen0und100%werdenzunächstgleich |     |     |     |                      | 77,3% |
gewichtet.
| B   | DerAnteilwirdvorherrechtkonzentriertinderNähevon10% |     |     |     |     | 45,0% |
| --- | --------------------------------------------------- | --- | --- | --- | --- | ----- |
vermutet.
1. MussmindestenseineBerechnungfalschsein,weilinderBefragung80%zugestimmthaben?
2. WelcheInformationbrauchstdu,umdieVerwendungvonPriorBbeurteilenzukönnen?
3. Eine Projektleiterin möchte einen stark optimistischen Prior einsetzen, damit das Ergebnis besser
| aussieht.  | Wasistdaranproblematisch?         |     |     |     |     |     |
| ---------- | --------------------------------- | --- | --- | --- | --- | --- |
| Aufgabe03: | NeuesWissendurcherneutesEinlesen? |     |     |     |     |     |
Niveau: C
EinKinobefragt50zufälligausgewählteBesucherinnenundBesucher. 30fandeneinenFilmgut. Auseinem
vorherfestgelegtenPriorunddiesenAntwortenwirdeinePosterior-VerteilungfürdenAnteilzufriedener
Besucherberechnet.
| LVDAA,ArnoHollosi |     |     |     |     |     | 3   |
| ----------------- | --- | --- | --- | --- | --- | --- |

B:LINEAREREGRESSIONINTERPRETIEREN
Eine Mitarbeiterin schlägt vor: “Nehmen wir diesen Posterior als neuen Prior und geben dieselben 50
Antwortennochmalsein. DasIntervallwirddannenger.”
1. EntstehtdadurchtatsächlichneuesWissen?
2. Worin unterscheidet sich das von einer zweiten Befragung anderer, unabhängig ausgewählter
Besucher?
3. WelcheirreführendeAussagewürdedasengereIntervallnahelegen?
B: Lineare Regression interpretieren
Aufgabe04: WelcheWohnungistderBasisfall?
Niveau: A
Ein Modell beschreibt die monatliche Nettomiete (in Euro) von Wohnungen in zwei Bezirken. Fläche60
bedeutet Wohnfläche in Quadratmetern minus 60. Bezirk 1 ist die Referenzgruppe. Das Modell enthält
keineInteraktion.
Modellbestandteil Koeﬀizient
Intercept 700
Fläche60 10
Bezirk2 150
Bezirk3 70
1. WelcheEinheitenhabendieKoeﬀizienten?
2. WelcheWohnungbeschreibtderIntercept?
3. Vervollständige: „WohnungeninBezirk3habenlautModellimMitteleineum…höhereMieteals…“
4. IstdiebeobachteteDurchschnittsmieteallerWohnungeninBezirk2genau150€höheralsjeneinBezirk
1?
Aufgabe05: Woraufbeziehensichdie95Prozent?
Niveau: B
Ein Modell beschreibt monatliche Stromkosten durch Wohnfläche und Bewohnerzahl. Für den
Flächenkoeﬀizientenergibtsichein95-%-HDIvon1,20bis1,80€jezusätzlichemQuadratmeter. Grundlage
sindbeobachteteWohnungen;eswurdekeinUmbau-Experimentdurchgeführt.
BeurteiledieAussagenundverbesserediefalschen:
1. BeigleicherBewohnerzahlliegtdermittlereZusammenhangzwischenFlächeundStromkostenlaut
Modellmit95%posteriorerWahrscheinlichkeitzwischen1,20und1,80€jem².
2. 95%dereinzelnenWohnungenhabenjezusätzlichemQuadratmeterzwischen1,20und1,80€höhere
Stromkosten.
3. Wenn wir eine bestimmte Wohnung um zehn Quadratmeter vergrößern, steigen ihre monatlichen
Stromkostensicherum12bis18€.
LVDAA,ArnoHollosi 4

Aufgabe06: Präzisegeschätzt,weithinausvorhergesagt C:BERECHNUNGUNDMODELLPRÜFUNG
Aufgabe06: Präzisegeschätzt,weithinausvorhergesagt
Niveau: B
EineFirmauntersuchtdenZusammenhangzwischenWochenarbeitszeitunderledigtenVorgängen. Inden
Daten kommen ausschließlich 20 bis 40 Arbeitsstunden pro Woche vor. Ein lineares Modell liefert einen
positivenSteigungskoeﬀizientenmitengem95-%-Intervall.
DieFirmaverwendetdasModellanschließendfür70Wochenstunden. EineFührungskraftsagt: “Dasenge
Koeﬀizientenintervallzeigt,dassauchdieseVorhersageverlässlichist.”
1. WarumreichtdasengeIntervallfürdieseAussagenichtaus?
2. NenneeinenplausiblenVerlaufoberhalbvon40Stunden,derindenbisherigenDatennichterkennbar
wäre.
3. WelchezusätzlichenInformationenwärenfürdieneueFragestellunghilfreich?
C: Berechnung und Modellprüfung
Aufgabe07: ZehnmalsovieleSamples
Niveau: A
EinebayesscheRegressionwirdmit100beobachtetenPersonenberechnet. ViergutfunktionierendeChains
liefern zusammen 4.000 verwertbare Posterior-Samples. Anschließend wird dieselbe Berechnung mit
denselbenDaten,PriorsundModellannahmenauf40.000Samplesverlängert.
EinStudentsagt: “JetzthabenwirzehnmalsovieleDaten. DasKredibilitätsintervallmussdeshalbdeutlich
schmalerwerden.”
1. WelchezweiArtenvonSampleswerdenhierverwechselt?
2. WassolltedurchlängeresSamplinggenauerwerden?
3. WürdenSieeinewesentlicheVerengungdeszugrundeliegendenPosteriorserwarten?
Aufgabe08: DerSampleristzufrieden
Niveau: B
ZweiModellemitderselbenY-Variable(Zielgröße)liefernfolgendeDiagnosen:
Diagnose ModellA ModellB
Chains Gutdurchmischt;gleicher ZweiChainsbleibenin
Bereich getrenntenBereichen
GrößtesRhat 1,00 1,15
KleinsteeffektiveSamplezahl 3.200 80
Residuen DeutlichU-förmigesMuster AufdenerstenBlickunauffällig
1. BeiwelchemModellbestehteindeutlichesBerechnungsproblem?
2. KannModellAwegenseinerSampling-Diagnostikbereitsalsgeeignetgelten?
3. WarumsolltenauchdiescheinbargutenResiduenvonBzunächstvorsichtigbeurteiltwerden?
LVDAA,ArnoHollosi 5

Aufgabe09: ImGesamtdurchschnittpasstalles C:BERECHNUNGUNDMODELLPRÜFUNG
Aufgabe09: ImGesamtdurchschnittpasstalles
Niveau: B
EinModellbeschreibtBearbeitungszeitenvonAnträgen,berücksichtigtabernichtdenAntragstyp. Esgibt
je200AnträgederTypenAundB,dieallefürdieModellberechnungverwendetwordensind.
ZurVerifikationwurdendannmitdemModellVorhersagengemachtundmitechtenDatenverglichen.
Betrachtung BeobachteterMittelwert(echt) BereichdervorhergesagtenMittelwerte
AlleAnträge 100Minuten 97,5–102,5Minuten
TypA 90Minuten 96,9–103,1Minuten
TypB 110Minuten 96,9–103,1Minuten
EineKolleginsagt: “DerGesamtdurchschnittpasst. DieModellprüfungistbestanden.”
1. IstdieseAussageprinzipiellfalsch?
2. WelchesProblemverdecktdieGesamtbetrachtung?
3. FürwelchenTypüberschätztbeziehungsweiseunterschätztdasModelldieBearbeitungszeit?
4. WelcheÄnderungoderweiterePrüfungwärenaheliegend?
Aufgabe10: RichtigerMittelwert,falscheStreuung
Niveau: B
Ein gewöhnliches Modell schätzt die Lieferzeit anhand der Entfernung. Es nimmt überall dieselbe
Residualstreuungan. Residuumbedeutet: tatsächlicheminusvorhergesagteLieferzeit. Plot:
40
20
0
−20
0.0 2.5 5.0 7.5
Entfernung [km]
]nim[
neudiseR
1. WelcherModellbestandteilscheintproblematisch:dermittlereZusammenhang,dieStreuungsannahme
oderzwingendbeides?
2. WaskönntemitdenVorhersageintervallenfürlangeLieferstreckenpassieren?
LVDAA,ArnoHollosi 6

D:VORHERSAGENUNDENTSCHEIDUNGEN
3. EineStudentinargumentiert: “BeilangenLieferstreckensindgrößereFehlernormal. EinFehlervon
20 Minuten bei einer zweistündigen Lieferung ist nicht schlimmer als ein Fehler von 2 Minuten bei
| einerzwölfminütigenLieferung. | DasModellpasstalso.” |     | Richtig? |     |
| ----------------------------- | -------------------- | --- | -------- | --- |
| D: Vorhersagen und            | Entscheidungen       |     |          |     |
Aufgabe11: DurchschnittodernächsteLieferung?
Niveau: A
FürLieferungenmitbestimmtenMerkmalenlieferteinModellfolgendegerundeteIntervalle:
| GesuchteGröße |     |     | Median | 95%-Intervall |
| ------------- | --- | --- | ------ | ------------- |
ErwartetemittlereLieferzeitbeidiesenMerkmalen 70Minuten 68–72Minuten
ZeiteinerneueneinzelnenLieferungbeidiesen 70Minuten 54–86Minuten
Merkmalen
1. WelchesIntervallpasstzurFrageeinerKundin,wannihrekonkreteBestellungeintrifft?
2. WelchesIntervallbeschreibtdenDurchschnittderBestellungen?
3. Angenommen,dieKoeﬀizientenwärennahezuexaktbekannt: WürdendannbeideIntervallefastauf
einenPunktschrumpfen?
Aufgabe12: UnsichereWerte,klarerUnterschied
Niveau: C
Ein Modell sagt die erwarteten mittleren Bearbeitungszeiten zweier festgelegter Antragprofile A und B
vorher. FürdiesesGedankenbeispielhabenwirnurvier(statt4.000)SamplesvomPosteriorgezogen(alle
sindgleichwahrscheinlich):
|     | Sample ErwarteteZeitA |           | ErwarteteZeitB |     |
| --- | --------------------- | --------- | -------------- | --- |
|     | 1                     | 10Minuten | 11Minuten      |     |
|     | 2                     | 20Minuten | 22Minuten      |     |
|     | 3                     | 30Minuten | 32Minuten      |     |
|     | 4                     | 40Minuten | 43Minuten      |     |
1. WiegroßistBminusA?WelchesIntervallhabenwirdafür?
2. JemandkombiniertdenkleinstenB-WertmitdemgrößtenA-Wertunderhält-28Minuten. Warumist
dashierkeinemöglicheDifferenz?
3. WasbedeutetdasErgebnisfüreinzelneBearbeitungenvonAundB?
Aufgabe13: DiebesteEntscheidungliegtwo?
Niveau: B
FürdenmorgigenBedarfanvorbereitetenMittagessenergibtsichfolgendeVorhersage:
LVDAA,ArnoHollosi 7

E:WELCHEFÄLLEWERDENVERGLICHEN?
|     |     | Bedarf   | Wahrscheinlichkeit |     |     |
| --- | --- | -------- | ------------------ | --- | --- |
|     |     | 80Essen  |                    | 20% |     |
|     |     | 100Essen |                    | 50% |     |
|     |     | 120Essen |                    | 30% |     |
Ein überzählig vorbereitetes Essen kostet 1 €. Ein fehlendes Essen verursacht 3 € Zusatzkosten
für kurzfristigen Ersatz. Andere Kosten (und Unannehmlichkeiten) spielen in dieser vereinfachten
| EntscheidungkeineRolle. | DieerwartetenKostensindbereitsberechnet: |                   |                 |     |     |
| ----------------------- | ---------------------------------------- | ----------------- | --------------- | --- | --- |
|                         |                                          | VorbereiteteEssen | ErwarteteKosten |     |     |
|                         |                                          | 80                |                 | 66€ |     |
|                         |                                          | 100               |                 | 22€ |     |
|                         |                                          | 120               |                 | 18€ |     |
1. WelchederdreiEntscheidungenwürdenSietreffen,wennSieerwarteteKostenminimierenmöchten?
2. WarumkanndieseEntscheidungvomwahrscheinlichstenBedarfabweichen? (vgl. Tabelle1)
3. Tatsächlichwerdenmorgennur80Essengebraucht. WardieEntscheidungdamitzwangsläufigfalsch?
| E: Welche  | Fälle werden                     | verglichen? |     |     |     |
| ---------- | -------------------------------- | ----------- | --- | --- | --- |
| Aufgabe14: | WelchesOP-Teamschneidetbesserab? |             |     |     |     |
Niveau: A
Ein Krankenhaus vergleicht zwei Teams. Die Schwierigkeit der OP wurde vor der Operation bestimmt.
WenigerKomplikationengeltenalsbesseresErgebnis. FolgendeKomplikationensindaufgetreten:
|     | Team LeichteEingriffe |             | SchwereEingriffe |                 | AlleEingriffe |
| --- | --------------------- | ----------- | ---------------- | --------------- | ------------- |
|     | A                     | 2von100: 2% | 90von900:        | 10% 92von1.000: | 9,2%          |
|     | B 36von900:           | 4%          | 15von100:        | 15% 51von1.000: | 5,1%          |
DieLeitungsagt: “TeamBarbeitetbesser;seinegesamteKomplikationsquoteistniedriger.”
1. WarumsprechenGesamtquoteunddienachSchwierigkeitgetrenntenVergleicheinunterschiedliche
Richtungen?
2. WelcheAussageüberdiebeobachtetenErgebnisseistgedeckt?
3. WelchezusätzlicheInformationwürdenSievoreinerEntscheidungüberLeistungsprämienverlangen?
| Aufgabe15: | MehrZimmer: | teureroderbilliger? |     |     |     |
| ---------- | ----------- | ------------------- | --- | --- | --- |
Niveau: B
AusbeobachtetenWohnungsverkäufenwerdenzweiModelleerstellt. DerPreiswirdinTausendEuro,die
FlächeinQuadratmeterngemessen. DieFormelnbeschreibengeschätztemittlerePreise:
LVDAA,ArnoHollosi 8

Aufgabe16: Einfachalleskontrollieren? E:WELCHEFÄLLEWERDENVERGLICHEN?
𝑀 ∶ 𝑃𝑟𝑒𝑖𝑠 = 370+30(𝑍𝑖𝑚𝑚𝑒𝑟−4)
1
𝑀 ∶ 𝑃𝑟𝑒𝑖𝑠 = 370+3.5(𝐹𝑙𝑐ℎ𝑒−90)−10(𝑍𝑖𝑚𝑚𝑒𝑟−4)
2
ImDatensatzhabenWohnungenmitmehrZimmernmeistensauchmehrWohnfläche.
1. FormulieredenZimmerkoeﬀizientenbeiderModelleinWorten. Waswirdjeweilsverglichen?
2. Eine Maklerin folgert aus dem zweiten Modell: “Wenn wir eine Zwischenwand entfernen und
dadurcheinZimmerwenigerhaben,steigtderVerkaufspreisum10.000€.” IstdieseAussagerichtig?
Aufgabe16: Einfachalleskontrollieren?
Niveau: C
Ein Unternehmen möchte wissen, wie stark ein freiwilliger Programmierkurs die spätere Arbeitsleistung
insgesamt verbessert. Leistung wird als Zahl korrekt erledigter, vergleichbarer Aufgaben pro Woche
gemessen. DieKursentscheidungwurdenichtzufälliggetroffen.
Größe BekannteZusammenhänge
Vorerfahrung ErfahrenereBeschäftigtenehmenhäufigeramKursteil. Vorerfahrungverbessert
auchdiespätereArbeitsleistung.
NachdemKurs DerKursvermitteltKenntnisse;diesekönnenanschließenddieArbeitsleistung
erworbeneKenntnisse verbessern.
Mitgliedschaftin AusgewähltwerdenPersonenmitKurszertifikatoderbesondershoher
Projektgruppen Motivation. MotivationverbessertebenfallsdieLeistung. Leistungsdatenliegen
füralleBeschäftigtenvor.
EinKollegemöchteVorerfahrungunderworbeneKenntnisseinsModellaufnehmenundnurProjektgruppenmitglieder
auswerten.
1. Welche Berücksichtigung hilft, einen bereits vorher bestehenden Unterschied zwischen den
Vergleichsgruppenzuerfassen?
2. BeiwelchemVorschlagwürdeeinTeilderinteressierendenGesamtwirkungausgeblendet?
3. Warum könnte die Beschränkung auf die Projektgruppe einen zusätzlichen irreführenden
Zusammenhangerzeugen?
LVDAA,ArnoHollosi 9

F:EFFEKTGRÖSSEUNDPRAKTISCHEBEDEUTUNG
| F: Effektgröße                          | und praktische | Bedeutung |     |     |
| --------------------------------------- | -------------- | --------- | --- | --- |
| Aufgabe17: DergrößereKoeﬀizientgewinnt? |                |           |     |     |
Niveau: A
EinModellfürdasKörpergewichtErwachsenerberücksichtigtGröße,AlterundGeschlecht:
|     | Variable                  |     | Koeﬀizient |     |
| --- | ------------------------- | --- | ---------- | --- |
|     | Körpergröße               |     | 0,7kgjecm  |     |
|     | MännerimVergleichzuFrauen |     | +3kg       |     |
EinStudentsagt: “DieGruppehatdenstärkerenZusammenhangmitdemGewicht,denn3istgrößerals
0.7.”
1. WarumreichtdieserVergleichnicht?
2. WelchenGewichtsunterschiedsagtdasModellfürzehnZentimeterGrößenunterschiedbeigleichem
AlterundgleicherGruppevoraus?
3. DieselbeModellfunktionwirdnunmitGrößeinMeterngeschrieben. WielautetderGrößenkoeﬀizient?
ÄndernsichdadurchdieVorhersagen?
| Aufgabe18: Klarpositiv,aberrelevant? |     |     |     |     |
| ------------------------------------ | --- | --- | --- | --- |
Niveau: B
Zwei neue Bedienoberflächen werden jeweils in einem zufällig zugeteilten Vergleich gegen dieselbe
bisherigeOberflächegetestet. DieZielpopulation(Nutzer*innen)istdieselbe. AlsrelevanteVerbesserung
wurdevorabeinemittlereZeitersparnisvonmindestenszweiSekundenproAufgabefestgelegt.
PositiveWertebedeutenZeitersparnis.
Posterior-Wahrscheinlichkeit
fürmehrals2Sekunden
OberflächeGeschätztemittlereErsparnis 95-%-Kredibilitätsintervall Ersparnis
| A   | 0,4Sekunden |     | [0,2;0,6]  | praktisch0% |
| --- | ----------- | --- | ---------- | ----------- |
| B   | 4,0Sekunden |     | [−1,0;9,0] | ungefähr78% |
1. BeiwelcherOberflächeistdieRichtungklarer? BeiwelcheristeinepraktischrelevanteVerbesserung
plausibler?
2. Die Projektleitung sagt: “Wir nehmen A, weil nur bei A das ganze Intervall positiv ist.” Welche
wesentlicheInformationlässtdieseBegründungaußerAcht?
| Aufgabe19: KleinerZusatzbeitrag,unwichtigeVariable? |     |     |     |     |
| --------------------------------------------------- | --- | --- | --- | --- |
Niveau: C
EinModellbeschreibtdenEnergieverbraucheinerMaschine. EsverwendetTemperaturvonSensor1(𝑇 ),
1
Temperatur von Sensor 2 (𝑇 ) und aktuelle Belastung (𝐵). Die beiden Temperatursensoren messen fast
2
dasselbe;ihreWertesindstarkkorreliert. AlleModelleverwendendieselbenBeobachtungen.
LVDAA,ArnoHollosi 10

G:INTERAKTIONENUNDDATENBEREICHE
| Modell       |         | 𝑅2 𝑓2derjeweilsentferntenVariable |     |
| ------------ | ------- | --------------------------------- | --- |
| Vollständig: | 𝑇 +𝑇 +𝐵 | 0.80                              | –   |
1 2
| Ohne𝑇  | 𝑇 +𝐵 |      |      |
| ------ | ---- | ---- | ---- |
|        | :    | 0.79 | 0.05 |
| 1      | 2    |      |      |
| Ohne𝐵: | 𝑇 +𝑇 | 0.60 | 1.00 |
1 2
Esgilt:
𝑅2 −𝑅2
|     | 𝑓2 = | vollständig ohneVariable. |     |
| --- | ---- | ------------------------- | --- |
1−𝑅2
vollständig
BeurteilefolgendeAussagen:
1. Sensor1erklärtfünfProzentdergesamtenVarianz.
2. DiegeringeVerschlechterungohneSensor1zeigt,dassTemperaturkaumeineRollespielt.
3. IndiesemModellliefertdieBelastungmehrzusätzlicheErklärungalsSensor1.
| G: Interaktionen und | Datenbereiche |     |     |
| -------------------- | ------------- | --- | --- |
Aufgabe20: EinGruppenunterschiedvonzwölfPunkten?
Niveau: B
ZweiKursformate(BetreuungundSelbststudium)wurdenfreiwilliggewählt. FürbeideliegenDatenüber
den gesamten Bereich von zwei bis acht Lernstunden vor (strichlierte Linien im Diagramm). Ein Modell
mitjeeinerGeradenproKursformathatfolgendeKoeﬀizienten(Referenzgruppe: Selbststudium):
Koeﬀizient Wert
Intercept 30
Lernstunden 2
Betreuung -1
Lernstunden:Betreuung 3
LVDAA,ArnoHollosi 11

Aufgabe21: DerGruppenkoeﬀizientwechseltdasVorzeichen G:INTERAKTIONENUNDDATENBEREICHE
70
60
50
40
30
0.0 2.5 5.0 7.5 10.0
Lernstunden
etknuP
Gruppe
Betreuung
Selbststudium
1. WasgenausagtderKoeﬀizientbeiBetreuungaus? Warumisternegativ?
2. WievielePunktejeLernstundeerzieltdieGruppeBetreuung?
3. LässtsichdarausbereitseinekausaleEmpfehlungfürdieWahldesKursformatsableiten?
Aufgabe21: DerGruppenkoeﬀizientwechseltdasVorzeichen
Niveau: B
EinModellbeschreibterwarteteTestpunktedurchLernstundenℎundKursformat𝐹. Dabeibedeutet𝐹 = 0
Selbststudiumund𝐹 = 1Betreuung:
𝜇 = 30+2ℎ−3𝐹 +3ℎ𝐹
EineKolleginschreibtgenaudieselbebereitsbestimmteModellfunktionmitℎ = ℎ−5um:
5
𝜇 = 40+2ℎ +12𝐹 +3ℎ 𝐹
5 5
FürbeideFormateliegenBeobachtungenzwischeneinerundzehnLernstundenvor.
1. WarumbeträgtderGruppenkoeﬀizienteinmal-3undeinmal+12?
2. HabensichdieVorhersagenverändert?
3. WelcherderbeidenGruppenkoeﬀizienteneignetsichbesserfüreineInterpretation/Kommunikation
innerhalbdesbeobachtetenBereichs?
Aufgabe22: VerschiedeneSteigungenoderverschiedeneAusschnitte?
Niveau: C
EineSchulungsfirmabeobachtetLernstundenundTestpunkte:
LVDAA,ArnoHollosi 12

H:MODELLEVERGLEICHEN
SteigungeinerjeGruppe
| Format        |     | BeobachteteLernstunden |        | angepasstenGeraden |
| ------------- | --- | ---------------------- | ------ | ------------------ |
| Selbststudium |     |                        | 1bis4  | 5PunkteproStunde   |
| Betreuung     |     |                        | 7bis10 | 17PunkteproStunde  |
Zwischen vier und sieben Stunden gibt es keine Beobachtungen. In den beiden beobachteten Bereichen
kommtjeweilsnureinesderFormatevor.
DieFirmawirbt: “MitBetreuunglohntsicheinezusätzlicheLernstundevielstärker!”
1. WaserschwertdenVergleichbeigleicherLernzeit?
2. Könnten die verschiedenen Steigungen auch entstehen, wenn für beide Formate dieselbe aber
gekrümmteBeziehungzwischenLernzeitundTestpunktengilt?
3. WelchezusätzlichenDatenwärenbesondershilfreich,umdieErklärungenzuunterscheiden?
| H: Modelle | vergleichen |     |     |     |
| ---------- | ----------- | --- | --- | --- |
| Aufgabe23: | HöheresR²   |     |     |     |
Niveau: B
EinPaketdienstmöchteLieferzeitenneuerSendungenvorhersagen. ZweiModellewurdenmitdenselben
800Sendungentrainiertundanschließendaufdenselben200bislangunbenutztenSendungengeprüft.
|     | Kennzahl           | EinfachesModellA | UmfangreichesModellB |            |
| --- | ------------------ | ---------------- | -------------------- | ---------- |
|     | 𝑅2imTraining       |                  | 0,76                 | 0,96       |
|     | RMSEimTraining     | 4,9Minuten       |                      | 2,0Minuten |
|     | RMSEindenPrüfdaten | 5,2Minuten       |                      | 7,5Minuten |
DerRMSEbeschreibtdieGrößederVorhersagefehler(rootmeansquarederror).
1. WelchesModellwürdestdufürneueSendungenzunächstbevorzugen?
2. WasübersiehtdieAussage“Berklärtfastallesundmussdeshalbzuverlässigersein”?
3. WassolltevoreinemendgültigenEinsatzzusätzlichgeprüftwerden?
LVDAA,ArnoHollosi 13

Aufgabe24: EinSieger? I:LOGISTISCHEREGRESSIONUNDENTSCHEIDUNGEN
| Aufgabe24: EinSieger? |     |     |     |     |
| --------------------- | --- | --- | --- | --- |
Niveau: B
Drei Modelle sagen den Stromverbrauch desselben Gebäudebestands voraus. Der LOO-Vergleich
verwendetdieselbenFälleunddieselbeZielvariable;seineBerechnungsdiagnostikistunauffällig.
|     | Modell | ELPD-Differenz | StandardfehlerderDifferenz |     |
| --- | ------ | -------------- | -------------------------- | --- |
|     | A      |                | 0                          | 0   |
|     | B      |                | −2                         | 5   |
|     | C      |                | −18                        | 6   |
NegativeELPD-WertezeigeneinengeschätztenVerlustanVorhersagegütegegenüberA.DerStandardfehler
beschreibt die Unsicherheit dieser Differenz. B braucht vier leicht verfügbare Eingangsgrößen, A zwölf,
darunterzweiaufwendigzumessende.
1. IstAgegenüberBüberzeugendüberlegen?
2. WarumistderVergleichA–Cdeutlicher?
3. IstdieWahlvonBfachlichvertretbar? Bedeutetdas,dassdieModellenachweislichgleichgutsind?
| Aufgabe25: EinguterTestfürwelcheZukunft? |     |     |     |     |
| ---------------------------------------- | --- | --- | --- | --- |
Niveau: C
Ein Betrieb hat von 200 Maschinen über jeweils 24 Wochen Sensorwerte und Ausfälle aufgezeichnet. Es
sollenModelleentwickeltwerden,diezukünftigeAusfällevorhersagen.
ZweiVorschlägestehenimRaum:
• A: Jede Woche anhand der aktuellen Messwerte vorhersagen, ob eine Maschine in der folgenden
Wocheausfällt.
• B:AnhandderMesswertederersten18Wochenvorhersagen,obeineMaschineindenWochen19–24
ausfällt.
1. WasstelltbeijedemModelleineBeobachtung(eineZeileimDatensatz)dar?
2. WieunterscheidensichdieZielvariablen?
3. WiewürdestdujeweilsTrainings-undTestdatenaufteilen?
4. WelcheInformationendürfenjeweilsalsPrädiktoren(X-Variable)verwendetwerden?
| I: Logistische                   | Regression | und Entscheidungen |     |     |
| -------------------------------- | ---------- | ------------------ | --- | --- |
| Aufgabe26: Wasbedeuten20Prozent? |            |                    |     |     |
Niveau: A
Ein logistisches Modell prognostiziert, ob ein Bauteil in den nächsten 30 Tagen ausfällt. Für Bauteile mit
bestimmtenMerkmalenlautetdieVorhersage20%.
Beurteileundkorrigieregegebenenfalls:
1. DiesesBauteilistzu20%kaputt.
LVDAA,ArnoHollosi 14

Aufgabe27: DoppelteOdds,doppelteWahrscheinlichI:keLiOt?GISTISCHEREGRESSIONUNDENTSCHEIDUNGEN
2. Bei100vergleichbarenBauteilenerwartenwirungefähr20Ausfälle.
3. Weil20%unter50%liegt,fälltdasBauteilnichtaus.
4. Wennunterdennächsten100Bauteilen25ausfallen,istdiePrognosewiderlegt.
Aufgabe27: DoppelteOdds,doppelteWahrscheinlichkeit?
Niveau: B
Wir betrachten eine festgelegte logistische Modellkurve für Bauteilausfälle. Bei zehn zusätzlichen
Betriebsstunden verdoppelt sich die Ausfallchance (odds). Das Modell enthält Betriebsart und
Betriebsstunden.
FürzweiBetriebsartenwurdenberechnet:
| Betriebsart | Wahrscheinlichkeitvorher |     |       | NachzehnweiterenStunden |     |       |
| ----------- | ------------------------ | --- | ----- | ----------------------- | --- | ----- |
| A           |                          |     | 10,0% |                         |     | 18,2% |
| B           |                          |     | 50,0% |                         |     | 66,7% |
1. Ist “Zehn zusätzliche Stunden verdoppeln das Ausfallrisiko” korrekt, wenn mit Risiko die
Wahrscheinlichkeitgemeintist?
2. InwelcherBetriebsartistdieÄnderunginProzentpunktengrößer?
3. BeweisendieunterschiedlichenÄnderungeneinenInteraktionstermimModell?
Aufgabe28: GleicheAUC,gleichgutesModell?
Niveau: C
Zwei Modelle (A und B) sagen Defekte für dieselben 300 Bauteile vorher. In jeder Gruppe liegen 100
Bauteile; innerhalbeinerGruppeerhaltenalledieselbePrognose. DieGruppensindbeibeidenModellen
gleich.
| Gruppe           |     | PrognoseA   | PrognoseB |       | Tatsächlichdefekt |     |
| ---------------- | --- | ----------- | --------- | ----- | ----------------- | --- |
| NiedrigePrognose |     |             | 12%       | 20%   | 10von100          |     |
| MittlerePrognose |     |             | 28%       | 50%   | 30von100          |     |
| HohePrognose     |     |             | 49%       | 80%   | 50von100          |     |
|                  |     | Kennzahl    |           | A     | B                 |     |
|                  |     | AUC         | 0,712     | 0,712 |                   |     |
|                  |     | Brier-Score | 0,183     | 0,230 |                   |     |
Die AUC beurteilt die Rangfolge der Risiken; größer ist besser. Der Brier-Score bewertet die quadrierten
Fehler der Wahrscheinlichkeitsvorhersagen; kleiner ist besser. Eine bereits aus dem Training festgelegte
konstanteBasisprognosevon30%erreichthiereinenBrier-Scorevon0,210.
1. WarumkanndieAUCbeibeidenModellengleichsein?
LVDAA,ArnoHollosi 15

Aufgabe29: DiehöhereTrefferquoteentscheidet? I:LOGISTISCHEREGRESSIONUNDENTSCHEIDUNGEN
2. Welches Modell liefert hier passendere absolute Wahrscheinlichkeiten? In welche Richtung irrt das
andere?
3. WelchesModellverbessertdenBrier-ScoregegenüberderkonstantenBasisprognose? Wasübersieht
“GleicheAUCbedeutetgleichguteModelle”?
| Aufgabe29: DiehöhereTrefferquoteentscheidet? |     |     |     |     |     |     |     |     |
| -------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
Niveau: B
EinModellmarkiertmöglicherweisedefekteBauteilezurNachprüfung. IneinemTestdatensatzmit1.000
Bauteilensind50defekt.
|          | Defekterichtig |     |                  |     | Intaktefalsch |     | Intakterichtig |     |
| -------- | -------------- | --- | ---------------- | --- | ------------- | --- | -------------- | --- |
| Schwelle | markiert       |     | Defekteübersehen |     | markiert      |     | unmarkiert     |     |
| 10%      |                | 40  |                  | 10  |               | 190 |                | 760 |
| 50%      |                | 15  |                  | 35  |               | 5   |                | 945 |
Beider10%-Schwellewerdenalsoinsgesamt800der1.000Bauteilerichtigzugeordnet,bei50%sindes960.
EineunnötigeNachprüfungkosteteineKosteneinheit,einübersehenerDefekt20. AndereKostenwerden
indiesemBeispielnichtberücksichtigt. DieKostenbetragen390,-€beider10-%-Schwelleund705,-€beider
50-%-Schwelle.
1. WelchederbeidenSchwellenwürdestduunterdiesenAnnahmenwählen?
2. WarumreichtderAnteilrichtigerZuordnungennichtaus?
3. WäredieWahldieselbe,wennjederderbeidenFehlertypendieselbenKostenverursachte?
| Aufgabe30: Perfektgetrennt,trotzdemunklar |     |     |     |     |     |     |     |     |
| ----------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
Niveau: C
AchtBauteilewurdenverschiedenenBelastungenausgesetzt:
|     | Belastung  |     | 1 2 | 3 4 8 | 9 10 11 |     |     |     |
| --- | ---------- | --- | --- | ----- | ------- | --- | --- | --- |
|     | Bruch(0/1) |     | 0 0 | 0 0 1 | 1 1 1   |     |     |     |
ZweimöglichesteilelogistischeKurvengebendenbeobachtetenErgebnissenjeweilshoheWahrscheinlichkeit.
BeieinerBelastungvon6liefertKurveAabereineBruchwahrscheinlichkeitvon31%,KurveBvon69%.
1. Warum können beide Kurven zu den vorhandenen Beobachtungen passen und sich bei 6 trotzdem
starkunterscheiden?
2. Angenommen,einBayes-ModelllässtsichhiermitunauffälligerMCMC-Diagnostikrechnen:Istdamit
dieÜbergangskurveeindeutigdurchdieDatenbestimmt? WelcheRollekönnendiePriorsspielen?
3. WelchezusätzlichenBeobachtungenwärenbesondershilfreich?
| LVDAA,ArnoHollosi |     |     |     |     |     |     |     | 16  |
| ----------------- | --- | --- | --- | --- | --- | --- | --- | --- |