<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Übungen/Interaktiv/Regressionsdetektiv.html -->

STATISTICAL CRIMES UNIT · FALL 24-170

# Regression Detective

Unsere Presseabteilung drängt uns, sofort folgenden Analysebericht aus unserer Forschungsabteilung an die Medien weiterzuleiten. Findet das deine Zustimmung?

0 / 6 Beweise

> „Unsere Analyse zeigt: Männer wiegen im Durchschnitt **7,65 kg mehr** als Frauen. Das Modell erklärt die Körpergewichte zuverlässig und kann daher für **Erwachsene allgemein** eingesetzt werden und sagt als Durchschnittsgewicht **64,6 kg** vorher; die Österreicher\*innen nehmen also ab. Für DJ Alpenbeat werden **82 kg** vorhergesagt; die Pressesprecherin des Stars gab dazu kein Kommentar ab.“

— Bericht der Analytics-Abteilung

**Datensatz**College-Studierende aus den USA

**Zielvariable**Weight [kg]

**Prädiktoren**Height, Age, Gender

**Auftrag**Bericht fachlich freigeben oder stoppen

## Beweiswand

Du kannst die Beweise in beliebiger Reihenfolge untersuchen. Jeder geklärte Punkt landet im Notizbuch.

## Ermittlungsnotizen

### Wer ist der Hauptverdächtige?

Alle sechs Beweise sind ausgewertet.

**Die Berechnung**
MCMC hat nicht funktioniert.
**Das Regressionsmodell**
Lineare Regression ist hier grundsätzlich unbrauchbar.
**Die Interpretation im Bericht**
Das Modell ist brauchbar, aber seine Aussagen werden überzogen.
**Der gesamte Datensatz**
Mit diesen Daten darf überhaupt nichts ausgesagt werden.

### Rekonstruiere die zulässige Aussage

Markiere alle Formulierungen, die in den Abschlussbericht gehören.

[ ] Der Intercept 64,6 kg beschreibt den Basisfall: eine 170 cm große, 30 Jahre alte Frau.
[ ] Bei gleicher Größe und gleichem Alter liegt das vom Modell erwartete Gewicht für Männer im Mittel 7,65 kg höher als für Frauen.
[ ] Ein beliebiger Mann wiegt deshalb 7,65 kg mehr als eine beliebige Frau.
[ ] Für einzelne Personen ist die Vorhersage deutlich unsicherer als der erwartete Mittelwert; dafür ist auch die Residuenstreuung relevant.
[ ] Die Ergebnisse gelten zunächst für einen Datensatz aus US-College-Studierenden; eine Übertragung auf alle Erwachsenen ist nicht automatisch gerechtfertigt.
[ ] Weil Train- und Testfehler ähnlich sind, ist Repräsentativität für die Gesamtbevölkerung bewiesen.

Abschlussbericht prüfen

BERICHT GESTOPPT

### Ermittlungsergebnis

**Das Modell ist nicht der Täter.** Sampling, Reproduktion der Daten und Generalisierung auf Testdaten liefern keinen offensichtlichen technischen Alarm.

Der Bericht begeht dagegen mehrere Interpretationsfehler: Er verwechselt den Intercept mit einem allgemeinen Durchschnitt, lässt beim Gruppenkoeffizienten „ansonsten gleich“ weg, macht aus einer erwarteten Modellvorhersage eine sichere Einzelvorhersage und überträgt eine Stichprobe von US-College-Studierenden auf alle Erwachsenen.

**Zulässige Kurzfassung:** Im vorliegenden Datensatz sagt das Modell für ansonsten gleiche Personen ein im Mittel um 7,65 kg höheres Gewicht für Männer als für Frauen voraus. Der Basisfall ist eine 170 cm große, 30 Jahre alte Frau mit einem erwarteten Gewicht von 64,6 kg. Einzelvorhersagen streuen deutlich; die externe Übertragbarkeit auf andere Populationen ist nicht durch den Datensatz belegt. Zur derzeit hitzigen Debatte rund um DJ Alpenbeat kann unser Modell keine konkrete Aussage liefern.

Fall neu starten