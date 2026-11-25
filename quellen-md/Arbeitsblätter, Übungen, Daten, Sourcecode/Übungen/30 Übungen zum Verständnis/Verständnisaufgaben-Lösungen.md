<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Übungen/30 Übungen zum Verständnis/Verständnisaufgaben-Lösungen.pdf -->

DAA - Lösungshinweise zu Übungsaufgaben

Arno Hollosi

Contents

A: Bayessches Schlussfolgern

B: Lineare Regression interpretieren

C: Berechnung und Modellprüfung

D: Vorhersagen und Entscheidungen

E: Welche Fälle werden verglichen?

F: Effektgröße und praktische Bedeutung

G: Interaktionen und Datenbereiche

H: Modelle vergleichen

I: Logistische Regression und Entscheidungen

A: Bayessches Schlussfolgern

1

2

2

2

3

4

4

4

5

01. Alarm: Die Erkennungsrate betrifft Alarme unter den defekten Bauteilen; gefragt ist aber der
Defektanteil unter den Alarmen. Das sind 90/585 ≈ 15%. Wenn der Defektanteil der Lieferung steigt,
kann bei unveränderten bedingten Erkennungs- und Fehlalarmraten der Anteil richtiger Alarme steigen.
Die Basisrate ist daher relevant.

02. Priors: Der Posterior kombiniert Prior und Likelihood; er muss nicht dem beobachteten Anteil von
80 % entsprechen. Für Prior B braucht es eine fachliche Begründung, beispielsweise geeignete frühere
Untersuchungen vergleichbarer Angebote und Zielgruppen. Einen Prior nach dem erwünschten Ergebnis
auszuwählen ist keine solche Begründung.
Sinnvoll ist der Vergleich der Schlussfolgerungen unter
mehreren vertretbaren Priors.

03. Doppelte Daten: Dieselben Antworten werden zweimal gewichtet, obwohl weiterhin nur 50
Personen befragt wurden. Die engere Verteilung täuscht zusätzliche Information vor. Neue unabhängige
Beobachtungen können einen Posterior dagegen sinnvoll aktualisieren, sofern dasselbe Ziel und passende
Modellannahmen gelten. Entscheidend ist neue Evidenz, nicht die Anzahl durchgeführter Rechenschritte.

1

D: VORHERSAGEN UND ENTSCHEIDUNGEN

B: Lineare Regression interpretieren

04. Basisfall: Der Intercept beschreibt die erwartete Nettomiete einer 60-m²-Wohnung in Bezirk 1. Die
70 € vergleichen Bezirk 3 mit Bezirk 1 bei gleicher Fläche. Unterschiedliche Flächenverteilungen können zu
einem anderen Unterschied der beobachteten Bezirksmittelwerte führen. Einheiten: Intercept: Euro; Fläche60:
Euro/m²; Bezirk2/Bezirk3: Euro.

05. Intervall: Aussage 1 ist in Ordnung, bedingt auf Modell, Prior und Daten. Aussage 2 verwechselt
Parameterunsicherheit mit Unterschieden einzelner Wohnungen. Aussage 3 macht zusätzlich aus einer
Assoziation (Korrelation) eine sichere Aussage über eine Intervention (kausaler Zusammenhang). Auch
die Unsicherheit eines mittleren Unterschieds wäre kein garantiertes Intervall für eine konkrete Wohnung.

06. Extrapolation: Das enge Intervall beschreibt Unsicherheit laut Modell; es belegt nicht, dass die lineare
Beziehung bis 70 Stunden gilt. Sättigung oder ein Rückgang durch Ermüdung wären beispielsweise denkbar.
Geeignete Daten im fraglichen Bereich wären hilfreich. Für eine kausale Arbeitszeitentscheidung braucht
es außerdem ein passendes Untersuchungsdesign.

C: Berechnung und Modellprüfung

07. Samples: Es bleiben 100 beobachtete Personen. Mehr Posterior-Draws verbessern die numerische
Annäherung an denselben Posterior. Monte-Carlo-Fehler von Mittelwerten, Quantilen oder Intervallgrenzen
können sinken; die zugrunde liegende inhaltliche Unsicherheit wird dadurch nicht automatisch kleiner,
d.h. Intervalle werden sich nicht wesentlich ändern.

08. Sampler und Modell: B hat deutliche Hinweise auf ein Berechnungsproblem. A wurde zwar
anscheinend brauchbar berechnet, modelliert aber möglicherweise die Form des Zusammenhangs
unzureichend. Das Bananen-Muster ist Anlass zur Modellprüfung. Bei B sind posteriorbasierte Ergebnisse
und daraus abgeleitete Diagnosen zunächst ebenfalls fraglich. → Unauffällige MCMC-Diagnostik ist kein
Nachweis für Modellgüte oder Kausalität.

09. Gruppen: Bezogen auf das vorliegende Modell ist die Aussage richtig. Allerdings hat das Modell selbst
Schwächen. Antragstyp A wird überschätzt, B unterschätzt. Die gegenläufigen Abweichungen gleichen sich
insgesamt aus. Abhilfe: Antragstyp als Prädiktor (X-Variable) hinzufügen und prüfen. Die angegebenen
Bereiche betreffen Mittelwerte ganzer replizierter Datensätze, nicht einzelne Anträge.

10: Streuung: Das Diagramm weist besonders auf eine unpassende konstante Streuungsannahme hin.
Der mittlere Zusammenhang scheint ok. Eine gemeinsame Residualstreuung – wie bei einfachen linearen
Regressionsmodellen – kann Intervalle bei Vorhersagen für lange Strecken zu eng und für kurze Strecken
zu breit machen. Mehr MCMC-Samples ändern diese Modellannahme nicht. Die Aussage der Studentin ist
falsch: unser Modell ist ja 𝑦 𝑎 + 𝑏𝑥 + 𝜖, die Residuen (das 𝜖) sind also unabhängig von 𝑥 und haben eine
konstante Standardabweichung 𝜎. Offensichtlich würden wir ein alternatives Modell brauchen, welches
die Streuung abhänggig von 𝑥 bzw. dem vorhergesagten ̂𝑦 macht: 𝜎(𝑥) = 𝑐 ⋅
̂𝑦(𝑥). Dann wäre die relative
(prozentmäßige) Änderungen der Residuen ok.

D: Vorhersagen und Entscheidungen

11. Vorhersageziel: Für die nächste konkrete Lieferung passt das breite Intervall 54–86 Minuten. Das enge
Intervall beschreibt Unsicherheit des Mittelwerts. Bei exakt bekannten Koeﬀizienten bleibt individuelle

LV DAA, Arno Hollosi

2

E: WELCHE FÄLLE WERDEN VERGLICHEN?

Variation durch nicht erklärte Einflüsse bestehen (es schrumpft etwas, weil →), der Mittelwert würde auf
einen Punkt schrumpfen.

12. Differenz: Die mittlere Differenz beträgt in jedem Posterior-Zustand zwei Minuten, das Intervall ist
also 1..3 Minuten. Zustände dürfen nicht unabhängig zwischen den Zeilen kombiniert werden, weil so
In der LV haben wir bspw. bei der Differenzbildung
die gemeinsame Posteriorstruktur verloren geht.
samples[,"param1"] - samples[,"param2"] gerechnet:
auch dort werden Werte derselben Zeile
voneinander abgezogen. Wir vergleichen die erwarteten mittleren Bearbeitungszeiten (posterior_epred(),
kein 𝜖), nicht die Dauer einzelner Anträge (posterior_predict()). Entscheidend ist die Verteilung der
Differenz 𝐵 − 𝐴, die wir für jedes Posterior-Sample berechnen. Selbst wenn sich die Wertebereiche der
beiden Vorhersagen für die Mittelwerte überlappen, kann diese Differenz in fast allen Samples positiv sein
(wie hier der Fall). Bei der Vorhersage einzelner Bearbeitungszeiten kommt zusätzlich die individuelle
Streuung hinzu. Deshalb ist die Aussage, dass Profil B im Mittel länger dauert, wesentlich leichter zu
treffen als die Aussage, dass ein einzelner Antrag mit Profil B länger dauern wird als einer mit Profil A.

13. Kosten: 120 Essen minimieren unter den drei Optionen die erwarteten Kosten. Fehlmengen sind teurer
als Überschüsse; deshalb ist eine Entscheidung oberhalb des wahrscheinlichsten Bedarfs sinnvoll. Wenn
tatsächlich 80 Essen benötigt werden, wäre nachträglich eine andere Entscheidung günstiger gewesen. Das
macht die unter den gegebenen Informationen kostenoptimale Entscheidung nicht falsch. Im Mittel sollte
das Modell helfen die Kosten zu senken. Für die Einzelentscheidung können individuelle Abweichungen
ungünstig sein.

E: Welche Fälle werden verglichen?

14. Simpson: A behandelt überwiegend schwere Eingriffe, B überwiegend leichte. Die Gesamtquoten
vergleichen unterschiedliche Fallmischungen. In jeder der beiden gegebenen Schwierigkeitsgruppen hat
A die niedrigere beobachtete Komplikationsquote. Das beweist noch keine kausale Überlegenheit; bspw.
können Vorerkrankungen oder Unterschiede innerhalb der groben Schwierigkeitsgruppen relevant bleiben.
Auch die statistische Unsicherheit (=das Intervall) ist für eine Prämienentscheidung zu bedenken.

15. Zimmer: Modell 1 beschreibt einen Unterschied von +30.000 € je zusätzlichem Zimmer ohne dass die
Fläche konstant gehalten wird. Modell 2 vergleicht Wohnungen gleicher Fläche: ein weiteres Zimmer ist
dann mit -10.000 € verbunden. Beide Beschreibungen können gleichzeitig zutreffen. Eine Zwischenwand zu
entfernen ist eine Intervention; die beobachteten Vergleiche beweisen nicht deren Preiswirkung (wir haben
immer nur einen Datensatz pro Wohnung, keinen Vergleich im Sinne vorher/nachher). Andere Merkmale
können mit der Zimmerzahl zusammenhängen.

16. Kontrollvariablen: Vorerfahrung ist eine vorbestehende gemeinsame Einflussgröße und sollte für
den beabsichtigten Vergleich berücksichtigt werden, sofern die genannten Annahmen passen. Erworbene
Kenntnisse hingegen liegen auf einem möglichen Wirkungsweg: sie konstant zu halten blendet einen
Teil der Gesamtwirkung aus. Eine so kontrollierte Regression identifiziert auch nicht automatisch einen
kausalen direkten Effekt. Unter Projektgruppenmitgliedern müssen Personen ohne Zertifikat besonders
motiviert sein, um aufgenommen zu werden; für Personen mit Zertifikat gilt diese Bedingung nicht. Die
Auswahl kann damit Kursbesuch und Motivation miteinander verknüpfen und den Leistungsvergleich
verzerren. Fachbegriffe für die drei Rollen sind Confounder, Mediator und Collider.

LV DAA, Arno Hollosi

3

H: MODELLE VERGLEICHEN

F: Effektgröße und praktische Bedeutung

17. Einheiten: Das Geschlecht wird mit nur einem Zentimeter verglichen. Die Zahlen sind deshalb keine
allgemeine Rangordnung der Bedeutung. Zehn Zentimeter entsprechen einem vorhergesagten Unterschied
von 7 kg. In Metern lautet derselbe Koeﬀizient 70 kg je Meter. Wenn nur Einheiten geändert werden bleiben
alle Vorhersagen unverändert.

18. Relevanz: A zeigt eine sehr gut abgesicherte, aber nach der vorab gesetzten Grenze unzureichende
Verbesserung. Bei B ist eine relevante Verbesserung plausibler; Unsicherheit und die Möglichkeit einer
Verschlechterung bleiben. Nur danach zu entscheiden, ob ein Intervall null enthält, ignoriert die Größe
des Nutzens und die Relevanzgrenze.
19. Zusatzbeitrag: Aussage 1 ist falsch: 𝑅2 steigt durch 𝑇1, nach Berücksichtigung von 𝑇2 und 𝐵, um
einen Prozentpunkt. Das entspricht 5 % der beim vollständigen Modell noch unerklärten Varianz von 0.20,
nicht 5 % der gesamten Varianz im Datensatz. Aussage 2 ist nicht gedeckt: Sensor 2 liefert bereits ähnliche
Information. Aussage 3 ist für diese Daten und Modelle gedeckt; das Weglassen der Belastung verschlechtert
die Anpassung stärker. Daraus folgt allerdings keine allgemeine oder kausale Rangordnung. (Hinweis: wir
haben keine Aussage darüber getroffen, was passiert wenn wir beide Sensoren weglassen und ein Modell
nur Belastung haben.)

G: Interaktionen und Datenbereiche

20. Interaktion: Der Koeﬀizient Betreuung gibt uns den Gruppenunterschied bei null Lernstunden an. Wie
anhand des Diagramms ersichtlich ist dort die betreute Gruppe einen Punkt unterhalb der Selbstlerngruppe.
Die Gruppe Betreuung erzielt 5 Punkte je Lernstunde (2 Punkte macht die Gruppe Selbststudium + 3 Punkte
Differenz (Koeﬀizient Lernstunden:Betreuung)). Die freiwillige Formatwahl lässt alternative Erklärungen
wie Motivation oder Vorkenntnisse offen (ist also kein experimentelles Setting, das kausale Rückschlüsse
zulässt).

21. Bezugspunkt: -3 bezeichnet den Unterschied Betreuung minus Selbststudium bei null Stunden; +12
bezeichnet ihn bei fünf Stunden. Die Modellfunktion und alle Vorhersagen bleiben identisch. Fünf Stunden
liegen im beobachteten Bereich, null Stunden außerhalb. Deshalb ist der zweite Koeﬀizient leichter anhand
vorhandener Daten inhaltlich zu deuten bzw. zu kommunizieren.

22. Überlappung: Für einen Vergleich bei gleicher Lernzeit fehlt die gemeinsame Datenbasis. Mindestens
eines der Formate muss jeweils extrapoliert werden. Auch eine gemeinsame gekrümmte Beziehung, die bei
höheren Lernzeiten steiler wird, kann die verschiedenen Geraden erklären. Besonders hilfreich sind beide
Formate in denselben Stundenbereichen einschließlich der Lücke. Für eine kausale Aussage sind zusätzlich
Zuteilung und andere Unterschiede der Gruppen zu untersuchen.

H: Modelle vergleichen

23. Trainingsgüte: A liefert im vorliegenden Test die besseren Vorhersagen. Das hohe Trainings-𝑅2 von
B garantiert keine Generalisierung; die große Verschlechterung ist ein Hinweis auf Overfitting, aber allein
kein Beweis seiner Ursache. Zu prüfen sind etwa Repräsentativität für zukünftige Sendungen, Fehler nach
Untergruppen, große Fehlvorhersagen und Unsicherheit des Vergleichs. Werden die Prüfdaten fortlaufend
für Modellauswahl verwendet, braucht die abschließende unabhängige Bewertung weitere unbenutzte
Daten oder ein geeignetes Validierungsdesign.

LV DAA, Arno Hollosi

4

I: LOGISTISCHE REGRESSION UND ENTSCHEIDUNGEN

24. LOO: Der geschätzte Unterschied zwischen A und B ist klein gegenüber seiner Unsicherheit. Eine
eindeutige Rangfolge ist nicht überzeugend belegt. Der Unterschied A–C ist relativ zur Unsicherheit
deutlicher. B kann wegen einfacherer Anwendung und geringerer Messkosten die bessere praktische Wahl
sein; Gleichwertigkeit ist damit nicht bewiesen. Eine Orientierung an ungefähr zwei Standardfehlern ist
eine Faustregel, keine Definition praktischer Relevanz.

25. Zukunft: Bei Modell A ist jede Maschinenwoche eine Beobachtung, bei Modell B jede Maschine. Die
Zielvariable ist bei A der Ausfall in der folgenden Woche, bei B mindestens ein Ausfall in den Wochen 19–24.
Für A eignet sich eine zeitliche Aufteilung in Training und Test, die den späteren Einsatz nachbildet; bei B
werden ganze Maschinen auf Training und Test verteilt. Als Prädiktoren (X-Variable) dürfen jeweils nur
Informationen verwendet werden, die zum Vorhersagezeitpunkt bereits bekannt sind: bei A die aktuellen
und früheren Messwerte, bei B ausschließlich Messwerte aus den ersten 18 Wochen.

I: Logistische Regression und Entscheidungen

26. Wahrscheinlichkeit: Aussage 1 verwechselt ein Ereignis mit einem Beschädigungsgrad. Aussage 2 ist
eine passende Häufigkeitsinterpretation. Aussage 3 verwechselt eine mögliche Klassifikationsschwelle mit
Unmöglichkeit des Ereignisses. Aussage 4 ignoriert zufällige Schwankungen: 25 statt erwarteter 20 Ausfälle
widerlegt die Prognose nicht automatisch.

27. Odds: Die Odds verdoppeln sich, nicht die Wahrscheinlichkeit. Die Änderungen betragen ungefähr 8,2
beziehungsweise 16,7 Prozentpunkte; B hat die größere absolute Änderung. Die nichtlineare Umrechnung
vom Logit zur Wahrscheinlichkeit erzeugt solche Unterschiede auch ohne Interaktionsterm auf der Logit-
Skala. Deshalb muss bei Aussagen über Interaktion die Skala benannt werden bzw. besser gleich mit
Diagrammen kommuniziert werden.

28. Mehrere Gütekriterien: Beide Modelle ordnen sämtliche Bauteile exakt gleich nach ihrem Risiko (beide
haben aufsteigende %-Wahrscheinlichkeiten). Auch die Gruppen mit identischen Prognosen sind dieselben.
Da die AUC nur die Rangordnung und nicht die konkreten Wahrscheinlichkeiten bewertet, ist sie bei beiden
Modellen gleich. A stimmt in den drei Gruppen dieses Datensatzes mit den beobachteten Häufigkeiten
besser überein, B überschätzt überall. A verbessert den Brier-Score gegenüber der konstanten 30%-Prognose,
B verschlechtert ihn. Die AUC misst keine Kalibrierung und keinen Anteil korrekt klassifizierter Fälle.
Perfekte Gruppenkalibrierung in diesem einen Testdatensatz beweist keine perfekte Kalibrierung in der
Population.

29. Entscheidungen: Unter den angegebenen Kosten ist die 10-%-Schwelle günstiger. Die hohe Trefferquote
bei 50 % verdeckt viele übersehene Defekte. Bei gleichen Fehlerkosten wäre unter den beiden Optionen
50 % günstiger: 40 statt 200 Fehler. Damit ist nur die Wahl zwischen den zwei angebotenen Schwellen
beurteilt, kein global optimaler Schwellenwert bestimmt. Die Schwellenwahl erfolgt anhand von Testdaten;
eine unabhängige abschließende Prüfung bleibt eine andere Aufgabe.

30. Separation: Zwischen den beobachteten Belastungsbereichen fehlen Daten. Die Lage und Steilheit des
Übergangs sind nur schwach bestimmt. Gute MCMC-Diagnostik macht die Berechnung eines gewählten
Modells plausibler, erzeugt aber keine Informationen in der Lücke. Geeignete Priors können die Schätzung
regularisieren und hier merklich beeinflussen; sie ersetzen keine zusätzlichen Messungen. Besonders
hilfreich wären mehrere unabhängige Bauteile je Belastungsstufe im Bereich 5..7.

LV DAA, Arno Hollosi

5

