<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Übungen/Vollständiges Analysebeispiel/Presse/StackOverflow_Management_Summary.pdf -->

Einrückung und Gehalt
Management-Summary

Arno Hollosi

Ergebnis

In der untersuchten Stack-Overflow-Stichprobe geht die Angabe Spaces mit einem höheren Jahresgehalt
einher als Tabs. Nach Berücksichtigung von Land, Programmiererfahrung, Firmengröße, Sprachwahl,
Lernhaltung und Kopierhäufigkeit beträgt der geschätzte Unterschied +8,2 Prozent. Das modellbedingte
95%-Unsicherheitsintervall (HDI) reicht ungefähr von +5,8 bis +10,4 Prozent. Verglichen werden bedingte
Gehaltsmediane bei gleichen erfassten Merkmalen. Ein Gehaltszuwachs durch einen Wechsel der
Einrückung ist damit nicht nachgewiesen.

Datengrundlage und Vorgehen

Die Datei enthält Selbstauskünfte von 6.543 Personen aus 18 Ländern, laut Vorauswahl Vollzeitbeschäftigte;
Salary bezeichnet das Jahresgehalt in US-Dollar. Nach Ausschluss von 102 unvollständigen Angaben zur
Firmengröße und weiteren 343 Gehältern unter der Arbeitsgrenze von 5.000 USD verbleiben 6.098 Personen.
Die Grenze ist eine dokumentierte Analyseentscheidung, keine weltweit gesicherte Mindestvergütung.
Zweifelhafte Angaben wurden ohne gesicherte Fehlerursache nicht umgerechnet.

Fünf Bayes-Regressionsmodelle wurden mit rstanarm::stan_glm() auf 5.000 Trainingsfällen aufgebaut:
vom einfachen Gruppenvergleich auf der USD- und Logskala bis zu Modellen mit zusätzlichen Merkmalen.
Erfahrung und Firmengröße wurden sowohl kategorial als auch durch metrische Näherungen abgebildet.
Sampling, replizierte Daten und Residuen wurden geprüft; die Vorhersage wurde mit LOO und 1.098
zurückgehaltenen Testfällen beurteilt. Ein auffälliger LOO-Beitrag wurde separat nachgerechnet. Die
abschließende Schätzung nutzt alle Analysedaten; andere Gehaltsgrenzen prüfen ihre Empfindlichkeit.

Belastbarkeit

Der unadjustierte Spaces-Unterschied von rund 29 Prozent sinkt mit Land und Erfahrung auf etwa 12
Prozent und mit den weiteren Merkmalen auf etwa 8 Prozent. Die kategoriale Variante wird durch LOO
gestützt; die metrische Variante liefert einen ähnlichen Spaces-Zusammenhang. Bei Gehaltsuntergrenzen von
5.000, 10.000 und 20.000 USD liegen die Schätzungen zwischen +7 und +8,2 Prozent, mit stabil positivem
Vorzeichen.

Die Modelle bilden den zentralen Zusammenhang brauchbar ab, treffen jedoch Verteilungsränder und
unterschiedliche Streuungen nicht vollständig. Der mittlere absolute Vorhersagefehler im Test liegt
noch bei rund 16.000 USD. Die Gehaltsfilter verändern die untersuchte Population; der beobachtete
obere Gehaltsbereich wird ebenfalls nicht gut reproduziert. Die Intervalle erfassen diese Modell- und
Auswahlunsicherheiten nicht vollständig.

Konsequenz

Das Ergebnis ist ein positiver adjustierter Zusammenhang in einer ausgewählten Umfrage, keine kausale
Grundlage für Vergütungsentscheidungen oder Einrückungsregeln zur Gehaltssteigerung. Tätigkeit,
Seniorität, Verantwortung, Ausbildung und weitere Einflussgrößen fehlen. Für solche Entscheidungen
wären zusätzliche Daten, eine begründete kausale Analyse und eine bessere Abbildung von Auswahl und
Gehaltsstreuung erforderlich.

1

