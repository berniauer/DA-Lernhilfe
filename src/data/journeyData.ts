export type LabId =
  | 'bayes'
  | 'linear-centering'
  | 'diagnostics'
  | 'prediction-cost'
  | 'simpson-causal'
  | 'effectsize'
  | 'interaction-nonlinear'
  | 'loo-compare'
  | 'logistic-cutoff'
  | 'split-drift';

export interface MiniCheck {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface JourneyStage {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  chapterRef: string;
  examWeight: string;
  duration: string;
  storyLead: string;
  plainExplanation: string[];
  keyTakeaways: string[];
  labId: LabId;
  labTitle: string;
  labInstruction: string;
  rOutputTitle: string;
  rCode: string;
  rOutput: string;
  examPhrasing: string[];
  quizDeckId: string;
  checks: MiniCheck[];
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'etappe-01-bayes',
    number: '01',
    shortTitle: 'Grundidee & Bayes',
    title: 'Warum ein 90-%-Test trotzdem meistens Fehlalarm schlägt',
    chapterRef: 'Kapitel 0 & 1',
    examWeight: 'Grundlage',
    duration: '6 Min.',
    storyLead:
      'Willkommen bei NovaChip! Du startest als neue Datenanalystin in einer Halbleiterfabrik. Ein neuer Laserscanner meldet „Defekt“ – die Werkleitung will sofort die ganze Charge stoppen. Moment mal: Wie sicher ist dieser Alarm wirklich?',
    plainExplanation: [
      'In der klassischen Statistik rechnet man oft mit einem p-Wert – doch der beantwortet gar nicht die Frage, die dich eigentlich interessiert. Mit dem Satz von Bayes drehen wir die Frage um: Wir verbinden unser Vorwissen (Prior bzw. Basisrate) mit neuen Daten (Likelihood) und erhalten den Posterior: eine ehrliche Wahrscheinlichkeitsverteilung nach dem Blick auf die Daten.',
      'Die wichtigste Greenhorn-Erkenntnis der ganzen Vorlesung ist die Basisrate: Wenn nur 1 % aller Wafer wirklich defekt sind, gibt es 99 gesunde Wafer für jeden kaputten. Selbst ein guter Sensor mit 5 % Fehlalarmrate produziert bei 990 guten Wafern fast 50 Fehlalarme – aber nur 9 echte Treffer!',
    ],
    keyTakeaways: [
      'Posterior verbindet Prior (Vorwissen) + Likelihood (Daten) – es gibt eine ganze Verteilung statt einer starren Zahl.',
      'Eine niedrige Basisrate dominiert positive Tests: Erst rechnen, dann Alarm schlagen.',
      'Prozentpunkte vs. Prozent sauber trennen: 10 % → 15 % sind +5 Prozentpunkte, aber +50 % relativ.',
    ],
    labId: 'bayes',
    labTitle: 'Basisraten- & Bayes-Simulator (1 000 Wafer)',
    labInstruction:
      'Schiebe die Basisrate (Anteil defekter Wafer) von 1 % auf 25 % und beobachte im 100-Wafer-Raster, wie stark der Anteil echter Alarme springt.',
    rOutputTitle: 'Bayes-Denkweise im Kurs (rstanarm)',
    rCode: '# Schwach-informativer Prior verhindert absurde Werte, verzerrt aber kaum:\nprior_summary(m1)',
    rOutput: `Priors for model 'm1'
------
Intercept (after predictors centered)  ~ normal(location = 0, scale = 2.5)
Coefficients (z-Skala)                 ~ normal(location = 0, scale = 2.5)
# 4 Chains × 1000 Schritte = 4000 Posterior-Samples je Parameter`,
    examPhrasing: [
      'Der Posterior beschreibt p(Parameter | Daten) – also plausible Parameterwerte gegeben die Daten (nicht umgekehrt wie der p-Wert).',
      'Priors müssen fachlich begründet sein (in der LV: schwach-informative Defaults) – niemals nach Wunschergebnis wählen.',
      'Dieselben Daten doppelt einzufüttern erzeugt keine neue Information, sondern nur trügerisch enge Intervalle.',
    ],
    quizDeckId: '01-Grundlagen-Bayes',
    checks: [
      {
        id: 'c1-1',
        prompt:
          'Bei NovaChip sind 1 % der Wafer defekt. Der Scanner erkennt 90 % der Defekte (Sensitivität) und meldet bei 5 % der guten Wafer Fehlalarm. Der Scanner piept – wie hoch ist P(Defekt | Alarm) ungefähr?',
        options: ['Etwa 90 %', 'Etwa 50 %', 'Etwa 15 %', 'Etwa 1 %'],
        correctIndex: 2,
        explanation:
          'Bei 1 000 Wafern gibt es 9 echte Treffer (0.9 × 10), aber ca. 50 Fehlalarme (0.05 × 990). 9 / 59 ≈ 15.3 %. Die niedrige Basisrate dominiert!',
      },
      {
        id: 'c1-2',
        prompt:
          'Die Defektrate steigt von 20 % auf 30 %. Wie formulierst du das in der Klausur eindeutig richtig?',
        options: [
          'Sie steigt um +10 %.',
          'Sie steigt um +10 Prozentpunkte (bzw. relativ um +50 %).',
          'Sie steigt um +50 Prozentpunkte.',
          'Die Basisrate verdoppelt sich.',
        ],
        correctIndex: 1,
        explanation:
          'Die absolute Differenz sind 10 Prozentpunkte; relativ zur Ausgangsbasis 20 % ist 10 / 20 = +50 %. „+10 %“ allein ist mehrdeutig!',
      },
    ],
  },
  {
    id: 'etappe-02-linear',
    number: '02',
    shortTitle: 'Lineare Regression lesen',
    title: 'Die R-Tabelle info(m1) ohne Panik entschlüsseln',
    chapterRef: 'Kapitel 2',
    examWeight: 'Sehr wichtig',
    duration: '8 Min.',
    storyLead:
      'Bevor wir Wafer-Defekte vorhersagen, will NovaChip den täglichen Stromverbrauch (kwh) der Reinraum-Anlagen verstehen – abhängig von Außentemperatur, Hallenfläche und Bauart. Du bekommst zum ersten Mal eine info(m1)-Tabelle aus R vorgesetzt.',
    plainExplanation: [
      'Ein lineares Bayes-Modell (stan_glm) schätzt eine Gerade durch die Daten – aber statt nur einer Zahl bekommst du für jeden Koeffizienten 4 000 plausible Werte (Posterior-Samples). Die Spalte median ist dein bester Schätzwert, lwr und upr bilden das 95%-HDI: der Bereich, in dem der wahre mittlere Zusammenhang mit 95 % Wahrscheinlichkeit liegt.',
      'Der größte Stolperstein für Anfänger ist der Basisfall (Intercept): Er gilt genau dann, wenn ALLE Zahlen-Variablen = 0 sind und alle Kategorien auf ihrer Referenzgruppe stehen. Eine 0-m²-Halle bei 0 °C existiert nicht! Durch Zentrieren (z. B. flaeche - 130, temp - 5) verschieben wir den Nullpunkt in die Mitte der Daten – die Steigungen bleiben dabei komplett identisch!',
    ],
    keyTakeaways: [
      'Basisfall = alle metrischen Variablen auf 0 (bzw. Zentrierwert), alle Faktoren auf Referenzgruppe (erstes Level).',
      'Koeffizient = Unterschied im Mittel bei +1 Einheit x, bei sonst gleichen Werten (Vergleich, keine Intervention!).',
      'sigma = Streuung einzelner echter Beobachtungen um die Gerade (~95 % innerhalb ±2·sigma).',
    ],
    labId: 'linear-centering',
    labTitle: 'Zentrierungs-Labor & Klickbare info()-Röntgen-Tabelle',
    labInstruction:
      'Schalte zwischen „Rohdaten“ und „Zentriert (temp5 = temp − 5 °C)“ um und klicke eine Zeile der info()-Tabelle an, um die exakte Klausur-Übersetzung zu sehen.',
    rOutputTitle: 'Typischer Klausur-Output: info(m2) (zentriert)',
    rCode: 'df$temp5 = df$temp - 5; df$flaeche130 = df$flaeche - 130\nm2 = stan_glm(kwh ~ temp5 + flaeche130 + daemmung + smart, data=df_train, refresh=0)\ninfo(m2)',
    rOutput: `                median  mad    lwr    upr mcse n_eff Rhat
(Intercept)      38.99 0.32  38.36  39.61 0.01  3826    1
temp5            -1.06 0.03  -1.12  -1.00 0.00  2790    1
flaeche130        0.08 0.01   0.07   0.09 0.00  2765    1
daemmungmittel   -8.49 0.41  -9.29  -7.69 0.01  2652    1
daemmungneu     -17.23 0.48 -18.16 -16.29 0.01  4471    1
sigma             5.18 0.12   4.95   5.41 0.00  3103    1`,
    examPhrasing: [
      'Immer „im Mittel“ und „bei sonst gleichen Werten“ schreiben – plus Einheit nennen (z. B. kWh pro °C).',
      'Immer prüfen, ob das 95%-HDI die 0 einschließt: Schließt es 0 ein, ist kein eindeutiger Unterschied belegbar.',
      'Bei Extrapolation (z. B. −20 °C weit außerhalb der Trainingsdaten): warnen, dass die Gerade dort nicht mehr gelten muss.',
    ],
    quizDeckId: '02-Lineare-Regression',
    checks: [
      {
        id: 'c2-1',
        prompt:
          'Im obigen Modell m2 (temp5 = temp − 5, flaeche130 = flaeche − 130, Referenz daemmung = alt, smart = 0/1): Was beschreibt der Intercept 38.99 kWh?',
        options: [
          'Den Durchschnitt aller Häuser im Datensatz.',
          'Den mittleren Verbrauch eines Hauses mit alter Dämmung, 130 m², ohne Smart-Thermostat bei 5 °C.',
          'Den Verbrauch eines Hauses mit 0 m² bei 0 °C.',
          'Die maximale Abweichung einzelner Tage.',
        ],
        correctIndex: 1,
        explanation:
          'temp5 = 0 bedeutet 5 °C, flaeche130 = 0 bedeutet 130 m², smart = 0 (nein), daemmung auf Referenz „alt“. Genau das ist der zentrierte Basisfall!',
      },
      {
        id: 'c2-2',
        prompt: 'Was bedeutet sigma = 5.18 kWh in dieser Tabelle?',
        options: [
          'Der Intercept ist auf ±5.18 kWh genau.',
          'Einzelne beobachtete Tagesverbräuche weichen typischerweise rund ±5.18 kWh von der Modellvorhersage ab (~95 % in ±10.4 kWh).',
          'Das Modell erklärt 5.18 % der Varianz.',
          'Das Sampling hat nicht konvergiert.',
        ],
        correctIndex: 1,
        explanation:
          'sigma ist die Standardabweichung der Residuen – also wie stark einzelne echte Tage um die Regressionsgerade streuen.',
      },
    ],
  },
  {
    id: 'etappe-03-diagnose',
    number: '03',
    shortTitle: 'Modellprüfung & MCMC',
    title: 'Die 4 Prüffragen: Darf ich diesem Modell trauen?',
    chapterRef: 'Kapitel 3',
    examWeight: 'Sehr wichtig',
    duration: '7 Min.',
    storyLead:
      'Dein erstes Modell spuckt hübsche Zahlen aus. Doch bevor du sie dem NovaChip-Management zeigst, gilt die eiserne Regel der Datenanalyse: Ein fertiger R-Output heißt noch lange nicht, dass das Modell stimmt!',
    plainExplanation: [
      'Jede Modellprüfung folgt exakt 4 Prüffragen: (1) Hat die Berechnung (MCMC) sauber funktioniert? (2) Kann das Modell die Daten überhaupt nachbilden (PPC / mean_PPD)? (3) Gibt es systematische Fehler in den Residuen (Banane = fehlende Krümmung, Trichter = Heteroskedastizität)? (4) Generalisiert es auf neue Testdaten (Overfitting-Check)?',
      'Ganz wichtig für die Klausur: Trenne strikt zwischen Rechenproblem (Rhat > 1.1, n_eff < 400, Chains laufen auseinander) und Modellproblem (Sampling perfekt mit Rhat = 1, aber Residuen bilden eine U-förmige Banane). Mehr Samples (40 000 statt 4 000) verkleinern nur den mcse – sie heilen niemals eine fehlende Krümmung oder zu wenige Daten!',
    ],
    keyTakeaways: [
      'Sampling-Grenzwerte auswendig: Rhat ≈ 1 (> 1.1 schlecht), n_eff > 2000 (< 400 schlecht), mcse < 5 % von mad.',
      'Banane im Residuenplot → Nichtlinearität fehlt (quadratischer Term/Spline). Trichter → Heteroskedastizität (Intervalle lokal falsch).',
      'Overfitting erkennen: Trainingsfehler super, Testfehler deutlich schlechter. Skill < 0 = schlechter als stumpf den Mittelwert zu raten.',
    ],
    labId: 'diagnostics',
    labTitle: 'Interaktives Diagnose-Labor (Traceplot & Residuen)',
    labInstruction:
      'Schalte durch alle 4 Diagnose-Szenarien und prüfe jeweils Rhat, n_eff, Traceplot und Residuenwolke wie ein Prüfer.',
    rOutputTitle: 'Die 4 Prüffragen als R-Workflow',
    rCode: 'check_sampling(m1)          # 1) Rhat ≈ 1, n_eff > 2000, mcse < 5% mad?\ndiagnose_density(m1)        # 2) PPC: passen simulierte Daten zu echten y?\ndiagnose_residual(m1)       # 3) Wolke um 0 (keine Banane, kein Trichter)?\nprediction_metrics(m1, test)# 4) Test-RMSE / Skill ähnlich wie Training?',
    rOutput: `   Dataset    n   RMSE   MAE  Skill
1 Training 1000   5.16  4.13  0.786
2 New data  400   5.23  4.29  0.761
# Training ≈ Test → gute Generalisierung, kein Overfitting!`,
    examPhrasing: [
      'Gutes Sampling (Rhat = 1, hohes n_eff) heißt nur, dass numerisch sauber gerechnet wurde – nicht, dass das Modell sachlich gut ist.',
      'Bei Trichterform (Heteroskedastizität): Die Annahme konstanter Streuung sigma ist verletzt → Vorhersageintervalle sind in manchen Bereichen zu eng, in anderen zu breit.',
      '40 000 statt 4 000 Samples senken nur den mcse, machen aber Daten-Intervalle nicht schmaler.',
    ],
    quizDeckId: '03-Modellpruefung',
    checks: [
      {
        id: 'c3-1',
        prompt:
          'info(m) zeigt Rhat = 1.00, n_eff = 3 400, mcse = 0.00. Aber im Plot diagnose_residual(m) bilden die Punkte eine deutliche U-Form („Banane“). Was ist deine Diagnose?',
        options: [
          'Ein MCMC-Berechnungsproblem – mehr Chains laufen lassen.',
          'Ein Modellproblem: Der Zusammenhang ist nichtlinear, dem Modell fehlt z. B. ein quadratischer Term.',
          'Overfitting – sofort Variablen entfernen.',
          'Alles perfekt, weil Rhat = 1.00 ist.',
        ],
        correctIndex: 1,
        explanation:
          'Sampling lief einwandfrei, aber das Modell hat einen systematischen Fehler (Prüffrage 3): Eine gerade Linie passt nicht auf einen gebogenen Zusammenhang.',
      },
      {
        id: 'c3-2',
        prompt:
          'Du siehst Trichter-Residuen (Heteroskedastizität). Hilft es, einfach 40 000 statt 4 000 Posterior-Samples zu ziehen?',
        options: [
          'Ja, die Intervalle werden dadurch deutlich genauer.',
          'Nein – mehr Samples senken nur den numerischen Rechenfehler (mcse), die verletzte Modellannahme bleibt.',
          'Ja, weil sigma dadurch kleiner wird.',
          'Nur wenn Rhat vorher 1.00 war.',
        ],
        correctIndex: 1,
        explanation:
          'Ein Klassiker aus Probeklausur B & Verständnisaufgabe 07: Mehr MCMC-Samples verbessern nur die numerische Approximation, nicht das Modell oder die Datenmenge!',
      },
    ],
  },
  {
    id: 'etappe-04-vorhersage',
    number: '04',
    shortTitle: 'Vorhersage & Kosten',
    title: 'Mittelwert vs. Einzelfall – und optimal entscheiden unter Unsicherheit',
    chapterRef: 'Kapitel 4',
    examWeight: 'Sehr wichtig',
    duration: '7 Min.',
    storyLead:
      'NovaChip muss den Strom für morgen im Voraus an der Börse bestellen. Zu wenig Strom nachzukaufen ist 3-mal so teuer wie überschüssigen Strom abzuschreiben. Bestellen wir einfach den Modell-Median?',
    plainExplanation: [
      'Nein! Erst müssen wir die richtige Unsicherheit wählen: posterior_epred zeigt, wie sicher wir beim MITTELWERT vieler gleicher Tage sind (schmales Intervall, nur Koeffizienten-Unsicherheit). posterior_predict zeigt die Spanne für EINEN konkreten morgigen Tag – und addiert den Zufallsfehler sigma oben drauf (deutlich breiter!).',
      'Zweitens gilt: Vorhersage ≠ Entscheidung! Wenn Unterschätzen (c_unter = 3 €) dreimal weher tut als Überschätzen (c_über = 1 €), ist der Median (50 %) zu geizig. Das kostenoptimale Quantil lautet c_unter / (c_unter + c_über) = 3 / 4 = 75 % – abgelesen aus der posterior_predict-Verteilung!',
    ],
    keyTakeaways: [
      'posterior_epred = Erwartungswert (Mittelwert gleicher Fälle, schmal). posterior_predict = einzelner neuer Fall (inkl. sigma, breit).',
      'Differenzen (z. B. Maschine 5 minus Maschine 4) IMMER zeilenweise pro Sample bilden: d = s[,2] - s[,1] – nie Intervallgrenzen voneinander abziehen!',
      'Optimales Quantil bei asymmetrischen Kosten: q* = c_unter / (c_unter + c_über).',
    ],
    labId: 'prediction-cost',
    labTitle: 'epred vs. predict & Kosten-Quantil-Waage',
    labInstruction:
      'Stelle das Kostenverhältnis (Nachkauf-Kosten vs. Überschuss-Kosten) ein und beobachte, wie die optimale Bestellmenge auf der blauen Einzelfall-Kurve wandert.',
    rOutputTitle: 'Klausur-Beispiel: Strombestellung für ein einzelnes Haus',
    rCode: 'ep   = posterior_epred(m3, newdata = haus_morgen)\npred = posterior_predict(m3, newdata = haus_morgen)\nhdi(ep); hdi(pred); quantile(pred, c(0.50, 0.75, 0.90))',
    rOutput: `posterior_epred:   Median 43.0 kWh   95%-HDI [42.1 ; 43.8]  # Mittelwert
posterior_predict: Median 43.0 kWh   95%-HDI [33.8 ; 52.1]  # EIN Haus morgen!
Quantile (predict): 50% = 43.0  |  75% = 46.1  |  90% = 48.9 kWh`,
    examPhrasing: [
      'Klar unterscheiden: epred enthält nur Koeffizienten-Unsicherheit (schrumpft mit mehr Daten); predict enthält zusätzlich die individuelle Reststreuung sigma.',
      'Eine ex-ante kostenoptimale Entscheidung war nicht „falsch“, nur weil im Einzelfall weniger verbraucht wurde.',
      'Für Gruppenvergleiche oder Summen (z. B. Gesamtlast): immer pro Sample rechnen (rowSums(pred) oder pred[,2] - pred[,1]).',
    ],
    quizDeckId: '04-Vorhersage-Entscheidung',
    checks: [
      {
        id: 'c4-1',
        prompt:
          'Die Einkaufsleitung fragt: „Wie viel Strom wird DIESE einzelne Halle morgen wahrscheinlich verbrauchen?“ Welche Funktion liefert das passende 95%-Intervall?',
        options: [
          'predict() – liefert direkt ein Intervall.',
          'posterior_epred() – weil es den Erwartungswert schätzt.',
          'posterior_predict() – weil ein einzelner Tag zusätzlich die Reststreuung sigma hat.',
          'loo() – weil es Kreuzvalidierung nutzt.',
        ],
        correctIndex: 2,
        explanation:
          'Für einen einzelnen konkreten Fall brauchen wir posterior_predict (inkl. Fehlerterm ε/sigma). predict() liefert gar kein Intervall, epred nur die Unsicherheit des Mittelwerts.',
      },
      {
        id: 'c4-2',
        prompt:
          'Fehlender Strom kostet 3 €/kWh, überschüssiger Strom 1 €/kWh. Welches Quantil der posterior_predict-Verteilung minimiert die erwarteten Kosten?',
        options: ['50 % (Median = 43.0 kWh)', '25 %', '75 % (46.1 kWh)', '95 % (oberes HDI-Ende)'],
        correctIndex: 2,
        explanation:
          'Kostenquantil q* = c_unter / (c_unter + c_über) = 3 / (3 + 1) = 0.75 (75-%-Quantil = 46.1 kWh).',
      },
    ],
  },
  {
    id: 'etappe-05-simpson',
    number: '05',
    shortTitle: 'Simpson & Kausalität',
    title: 'Vorsicht Scheinzusammenhang: Confounder, Mediator, Collider',
    chapterRef: 'Kapitel 5',
    examWeight: 'Sehr wichtig',
    duration: '8 Min.',
    storyLead:
      'Aufregung bei NovaChip: Hallen mit freiwillig installierten Smart-Thermostaten verbrauchen im Schnitt 8.6 kWh weniger! Der Vorstand will sofort alle alten Hallen umrüsten. Doch Moment – wer hat die Smart-Thermostate eigentlich eingebaut?',
    plainExplanation: [
      'Ein Blick in die Daten entlarvt die Falle: 67 % der nagelneuen, super gedämmten Hallen haben ein Smart-Thermostat, aber nur 10 % der ungedämmten Altbauten! Ohne Dämmung im Modell bekommt das Thermostat fälschlich den ganzen Energiespar-Effekt der Neubau-Dämmung gutgeschrieben (Omitted Variable Bias / Confounder). Im Extremfall dreht sich ein Trend sogar komplett um – das ist Simpsons Paradox!',
      'Darf man also einfach ALLE Variablen ins Modell werfen? Nein! Du musst 3 kausale Rollen unterscheiden: Confounder (beeinflusst X und Y → KONTROLLIEREN), Mediator (liegt auf dem Wirkungsweg X → M → Y → NICHT kontrollieren für Gesamtwirkung), Collider (wird von X und Y beeinflusst → FINGER WEG, sonst erzeugst du Scheinzusammenhänge!). Und: Kausalität beweist nur ein randomisiertes Experiment!',
    ],
    keyTakeaways: [
      'Beide Koeffizienten (−8.6 ohne Dämmung vs. −2.6 mit Dämmung) sind nicht „falsch“, sie beantworten verschiedene Vergleiche.',
      'Confounder (X ← C → Y) kontrollieren · Mediator (X → M → Y) für Gesamtwirkung nicht kontrollieren · Collider (X → C ← Y) nie filtern/kontrollieren!',
      'Aus Beobachtungsdaten folgt NIE eine sichere Interventions-Aussage („Wenn wir X ändern, passiert Y“).',
    ],
    labId: 'simpson-causal',
    labTitle: 'Simpson-Switch & Kausalrollen-Sortierer',
    labInstruction:
      'Aktiviere zuerst „Nach Dämmstandard kontrollieren“ im Diagramm und ordne danach die drei Klausur-Variablen ihrer kausalen Rolle zu.',
    rOutputTitle: 'Vorher vs. Nachher: Effekt schrumpft durch Kontrollvariable',
    rCode: 'm1 = stan_glm(kwh ~ temp + flaeche + smart, data = df_train)\nm2 = stan_glm(kwh ~ temp5 + flaeche130 + daemmung + smart, data = df_train)',
    rOutput: `Ohne Dämmung (m1):  smart = -8.62 kWh  [-9.63 ; -7.61]   # vermischt mit Neubau!
Mit Dämmung  (m2):  smart = -2.60 kWh  [-3.34 ; -1.86]   # Vergleich bei gleicher Dämmung!`,
    examPhrasing: [
      'Immer klären: Was wird verglichen und was wird konstant gehalten? Beide Modelle beantworten unterschiedliche Fragen.',
      'Keine Kausalität aus Beobachtungsdaten: Für einen echten Kausalbeweis bräuchte man ein kontrolliertes Experiment mit zufälliger Zuteilung.',
      'In der Beispielklausur (2.3): Druck und Defekt korrelieren, aber machine und shift könnten Confounder sein → gezieltes Experiment mit zufälligen Druckstufen vorschlagen!',
    ],
    quizDeckId: '05-Simpson-Kausalitaet',
    checks: [
      {
        id: 'c5-1',
        prompt:
          'Ein Werk untersucht, ob ein Schulungskurs die Fehlerquote senkt. Die Variable „Vorerfahrung“ beeinflusst sowohl, wer den Kurs bucht, als auch die spätere Fehlerquote. Welche Rolle hat „Vorerfahrung“?',
        options: [
          'Collider – unbedingt weglassen',
          'Mediator – liegt zwischen Kurs und Leistung',
          'Confounder – als Kontrollvariable ins Modell aufnehmen',
          'Irrelevante Zufallsgröße',
        ],
        correctIndex: 2,
        explanation:
          'Vorerfahrung beeinflusst sowohl X (Kursteilnahme) als auch Y (Fehlerquote): X ← C → Y. Das ist ein klassischer Confounder und sollte kontrolliert werden.',
      },
      {
        id: 'c5-2',
        prompt:
          'Im Modell mit Dämmung ist smart = −2.60 kWh. Folgt daraus, dass der Einbau eines Smart-Thermostats den Stromverbrauch eines bestehenden Hauses sicher um 2.6 kWh senkt?',
        options: [
          'Ja, weil Dämmung bereits kontrolliert wurde.',
          'Ja, weil das 95%-HDI die 0 ausschließt.',
          'Nein – es bleibt eine Beobachtungsstudie (weitere unbeobachtete Confounder wie sparsames Nutzerverhalten möglich).',
          'Nur wenn Bayes-R² über 0.75 liegt.',
        ],
        correctIndex: 2,
        explanation:
          'Freiwillige Installation bedeutet Selbstselektion (z. B. besonders energiebewusste Personen). Nur ein randomisiertes Experiment prüft die echte Intervention.',
      },
    ],
  },
  {
    id: 'etappe-06-effektgroesse',
    number: '06',
    shortTitle: 'Effektgröße & f²',
    title: 'Großer Koeffizient ≠ wichtigste Variable!',
    chapterRef: 'Kapitel 6',
    examWeight: 'Wichtig',
    duration: '6 Min.',
    storyLead:
      'In NovaChips Defektmodell steht exposure_time = −5.20 und pressure = +0.08. Ein Praktikant ruft: „Belichtungszeit ist 65-mal wichtiger als Druck!“ Stopp – du bist gerade auf eine der fiesesten Klausurfallen gestoßen.',
    plainExplanation: [
      'Warum stimmt das nicht? Weil Belichtungszeit in Sekunden gemessen wird und im ganzen Werk nur zwischen 0.8 und 1.3 s schwankt (SD = 0.07 s). Druck schwankt dagegen über 56 mTorr (SD = 8.28 mTorr)! Ein roher Koeffizient hängt komplett von der Einheit ab (Meter statt Zentimeter macht ihn 100× größer!).',
      'Um Wichtigkeit fair zu messen, nutzt daatools effectsize(m): Es wirft jede Variable einmal komplett aus dem Modell (inkl. Interaktionen/Quadrate -> Spalte Df). Bei linearen Modellen liefert das Cohens f² = (R²_mit − R²_ohne) / (1 − R²_mit). Bei logistischen Modellen schauen wir auf den AIC-Anstieg: Je stärker der AIC ohne eine Variable hochschießt, desto wichtiger ist sie im Modell!',
    ],
    keyTakeaways: [
      'Rohe Koeffizienten verschiedener Einheiten NIE direkt vergleichen! Immer auf 1 SD (β · SD) oder effectsize() schauen.',
      'f²-Richtwerte nach Cohen: 0.02 klein · 0.15 mittel · 0.35 groß. Achtung: f² ist Anteil an der REST-Varianz (1 − R²_mit), nicht an der Gesamtvarianz!',
      'Statistische Sicherheit (enges HDI) ≠ praktische Größe! Bei n = 500 000 kann ein winziger Effekt super sicher von 0 verschieden sein.',
    ],
    labId: 'effectsize',
    labTitle: 'Einheiten-Falle & f²-Rechner',
    labInstruction:
      'Vergleiche im linken Fenster die rohen Koeffizienten mit der 1-SD-Wirkung und spiele rechts mit R²_mit und R²_ohne, um f² visuell zu begreifen.',
    rOutputTitle: 'Klausur-Output: effectsize() linear vs. logistisch',
    rCode: '# Linear (Wärmepumpen):           # Logistisch (Beispielklausur m1):\neffectsize(m3)                    effectsize(m1)',
    rOutput: `Linear (sortiert nach f2):        Logistisch (sortiert nach AIC):
              Df    R2    f2                    Df Deviance    AIC
<none>           0.829            <none>             2647.1 2671.1
smart          1 0.819 0.057      exposure_time  1   2674.4 2696.4 (+25.3)
flaeche130     1 0.779 0.290      pressure       1   2726.1 2748.1 (+77.0)
temp5          3 0.514 1.835      machine        4   2815.6 2831.6 (+160.5)`,
    examPhrasing: [
      'f² = 0.057 NICHT als „erklärt 5.7 % der Gesamtvarianz“ lesen, sondern als Anteil der zusätzlich erklärten Varianz an der im vollen Modell unerklärten Restvarianz.',
      'Df > 1 in effectsize() erklären: Es werden alle zugehörigen Terme gemeinsam entfernt (z. B. Faktor-Dummies, Interaktionsterme oder quadratischer Term).',
      'Stark korrelierte Variablen (z. B. exposure_time & line_speed mit r = −0.68) teilen sich Erklärungskraft → beim Weglassen übernimmt die andere!',
    ],
    quizDeckId: '06-Effektgroesse',
    checks: [
      {
        id: 'c6-1',
        prompt:
          'Ein Modell erreicht R² = 0.60. Ohne Variable X fällt es auf R² = 0.55. Wie groß ist Cohens f²?',
        options: ['0.05 (klein)', '0.125 (klein bis mittel)', '0.55 (groß)', '0.083 (klein)'],
        correctIndex: 1,
        explanation:
          'f² = (0.60 − 0.55) / (1 − 0.60) = 0.05 / 0.40 = 0.125. Knapp unter Cohens Grenze 0.15 (mittel).',
      },
      {
        id: 'c6-2',
        prompt:
          'In der logistischen Tabelle oben hat exposure_time den größten Koeffizienten (−5.20), aber beim Weglassen steigt der AIC nur um +25.3 (bei machine um +160.5). Welche Variable trägt im Modell mehr bei?',
        options: [
          'exposure_time, weil −5.20 betragsmäßig am größten ist.',
          'machine, weil der AIC-Anstieg (+160.5) deutlich größer ist; −5.20 liegt nur an der Einheit Sekunden.',
          'Beide sind exakt gleich wichtig.',
          'Das lässt sich an der AIC-Tabelle nicht ablesen.',
        ],
        correctIndex: 1,
        explanation:
          'In logistischen Modellen zeigt der größere AIC-Anstieg (weiter unten in effectsize()) den größeren Modellbeitrag. Der rohe Koeffizient täuscht wegen der Einheit!',
      },
    ],
  },
  {
    id: 'etappe-07-interaktion',
    number: '07',
    shortTitle: 'Interaktion & Kurven',
    title: 'Wenn Gruppen verschiedene Steigungen haben – und U-förmige Prozessfenster',
    chapterRef: 'Kapitel 7',
    examWeight: 'Sehr wichtig',
    duration: '8 Min.',
    storyLead:
      'Zwei echte Wendepunkte unserer Analyse: Erstens reagieren gut gedämmte Hallen viel entspannter auf Kälte als Altbauten (verschiedene Steigungen = Interaktion). Zweitens sind bei NovaChip sowohl zu NIEDRIGE als auch zu HOHE Temperaturen giftig für die Wafer (U-Form)!',
    plainExplanation: [
      'Bei einer Interaktion (temp5 * daemmung) laufen die Linien der Gruppen nicht mehr parallel. Der Haupteffekt temp5 (−1.58) ist jetzt NUR die Steigung in der Referenzgruppe (alt). Für Neubauten addierst du den Interaktionsterm: −1.58 + 1.05 = −0.53 kWh/°C! Und der Gruppeneffekt daemmungneu (−15.25) gilt NUR genau am Referenzpunkt temp5 = 0 (also 5 °C)!',
      'Für U-förmige Prozessfenster (wie in der Beispielklausur WS26/27!) ergänzen wir einen quadratischen Abweichungsterm vom Zielwert, z. B. (humidity - 45)². Ist β₂ positiv, biegt sich die Kurve nach oben (U-Form) und hat ein echtes Optimum am Scheitelpunkt x* = c − β₁ / (2·β₂).',
    ],
    keyTakeaways: [
      'Interaktion: Steigung in Gruppe G = β_x + β_x:G · Gruppenunterschied bei x = c: β_G + β_x:G · (c − x_ref).',
      'Achtung Haupteffekt-Falle: Ein geänderter Gruppeneffekt nach Aufnahme einer Interaktion heißt NICHT, dass die Variable schwächer wirkt – er wird nur an einem anderen Referenzpunkt gemessen!',
      'Quadratischer Term (x − Ziel)² fängt U-Formen ein. Bei logistischen Modellen ohne Interaktion sehen Kurven auf der p-Skala trotzdem leicht verschieden geformt aus (wegen der S-Kurve), obwohl sie auf der Logit-Skala parallel sind!',
    ],
    labId: 'interaction-nonlinear',
    labTitle: 'Interaktions- & U-Kurven-Labor',
    labInstruction:
      'Wechsle zwischen „Interaktion (verschiedene Steigungen)“ und „Quadratische U-Form (m1 vs. m2)“ und schiebe den Messpunkt entlang der x-Achse.',
    rOutputTitle: 'Interaktion (m3) & Quadratische Abweichung (Beispielklausur m2)',
    rCode: '# Interaktion:                      # Quadratisches Prozessfenster:\nm3 = stan_glm(kwh ~ temp5*daemmung  df$exposure_time2 = (df$exposure_time - 1.05)^2\n              + flaeche130 + smart) m2 = update(m1, ~ . + pressure2 + ... + exposure_time2)',
    rOutput: `Interaktion (m3):                   Quadratisch (Beispielklausur m2):
temp5                = -1.58 (alt)  exposure_time  = -5.48
daemmungneu          = -15.25 (5°C) exposure_time2 = +42.00  (Ziel c = 1.05 s)
temp5:daemmungneu    = +1.05        → Scheitelpunkt x* = 1.05 - (-5.48)/(2*42) ≈ 1.115 s`,
    examPhrasing: [
      'Bei Interaktionen immer angeben, für welche Gruppe bzw. an welchem Referenzpunkt (x = 0) ein Haupteffekt gilt.',
      'Beide Beispielklausur-Modelle (m1 & m2) enthalten KEINE Interaktion humidity:machine → sie nehmen an, dass Luftfeuchtigkeit auf der Logit-Skala bei allen Maschinen gleich wirkt!',
      'Quadratischer Term β₂ = 42 bei exposure_time2 wirkt gigantisch, weil SD² = 0.07² = 0.0049 winzig ist → β₂ · SD² ≈ 0.21!',
    ],
    quizDeckId: '07-Interaktionen',
    checks: [
      {
        id: 'c7-1',
        prompt:
          'Im Interaktionsmodell m3 ist temp5 = −1.58 (Ref: alt) und temp5:daemmungneu = +1.05. Wie groß ist die Steigung (kWh pro +1 °C) in Häusern mit neuer Dämmung?',
        options: ['+1.05 kWh/°C', '−1.58 kWh/°C', '−0.53 kWh/°C', '−2.63 kWh/°C'],
        correctIndex: 2,
        explanation:
          'Steigung in Gruppe G = β_x + β_x:G = −1.58 + 1.05 = −0.53 kWh pro Grad wärmer (also nur +0.53 kWh pro Grad kälter).',
      },
      {
        id: 'c7-2',
        prompt:
          'In der Beispielklausur zeigen m1 und m2 Kurven für Luftfeuchtigkeit getrennt nach Maschine M1 und M5, die leicht anders geformt sind. Enthält m2 deshalb eine Interaktion zwischen humidity und machine?',
        options: [
          'Ja, sonst wären die Kurven exakt parallel.',
          'Nein – auf der Logit-Skala sind sie parallel (additiv); erst die Umrechnung in Wahrscheinlichkeiten (S-Kurve) verändert die Steilheit.',
          'Ja, aber nur bei Maschine M5.',
          'Nur wenn Pareto k < 0.7 ist.',
        ],
        correctIndex: 1,
        explanation:
          'Klausurfrage 4.5! Beide Modelle addieren machine und humidity ohne Interaktionsterm. Die nichtlineare Logit-Transformation sorgt auf der p-Skala automatisch für unterschiedliche Steilheiten.',
      },
    ],
  },
  {
    id: 'etappe-08-loo',
    number: '08',
    shortTitle: 'Modellvergleich (LOO)',
    title: 'Welches Modell gewinnt? LOO, 2·se-Regel und Pareto k',
    chapterRef: 'Kapitel 8',
    examWeight: 'Wichtig',
    duration: '6 Min.',
    storyLead:
      'Jetzt haben wir zwei Kandidaten für NovaChip: das einfache lineare Modell m1 und das quadratische Modell m2 mit 5 zusätzlichen Termen. Ist m2 wirklich besser – oder überangepasstes Overfitting?',
    plainExplanation: [
      'R² auf den Trainingsdaten steigt fast immer, wenn man mehr Variablen reinwirft – als Schiedsrichter taugt es allein nicht! Deshalb nutzen wir echte Testdaten (prediction_metrics) UND LOO (Leave-One-Out-Kreuzvalidierung mit loo_compare). LOO schätzt clever aus den 4 000 Posterior-Samples, wie gut jedes Modell für ausgelassene Punkte vorhersagt (elpd: größer = besser).',
      'In loo_compare steht der Gewinner immer ganz oben mit elpd_diff = 0. Die anderen Modelle zeigen negative Differenzen und deren Unsicherheit se_diff. Die goldene 2·se-Regel lautet: Erst wenn |elpd_diff| > 2 · se_diff, ist der Vorteil überzeugend! Zusätzlich prüfen wir Pareto k: Liegen viele Punkte über 0.7 oder gar 1.0, ist die LOO-Näherung unzuverlässig.',
    ],
    keyTakeaways: [
      '2·se-Regel: |elpd_diff| > 2 · se_diff → klarer Modellvorteil; darunter ist das einfachere Modell gut vertretbar.',
      'LOO-Voraussetzung: EXAKT derselbe Datensatz (keine fehlenden Zeilen durch NAs!) und EXAKT dieselbe Zielvariable y (nie y gegen log(y)!).',
      'Pareto k-Ampel: < 0.7 ok · 0.7–1.0 problematisch · > 1.0 schlecht (einflussreiche Punkte / Fehlspezifikation prüfen).',
    ],
    labId: 'loo-compare',
    labTitle: 'LOO-Waage (2·se-Prüfer) & Pareto-k-Check',
    labInstruction:
      'Vergleiche das klare Klausur-Duell (m2 vs. m1) mit einem knappen Unentschieden oder schiebe elpd_diff und se_diff selbst.',
    rOutputTitle: 'Beispielklausur WS26/27: loo_compare(loo1, loo2)',
    rCode: 'loo1 = loo(m1); loo2 = loo(m2)\nloo_compare(loo1, loo2)',
    rOutput: `   elpd_diff se_diff
m2    0.0       0.0    # Gewinner steht immer oben (elpd_diff = 0)
m1 -222.8      24.0    # |-222.8| / 24.0 = 9.3 Standardfehler → m2 überragend besser!`,
    examPhrasing: [
      'Modellwahl immer mit mehreren Kennzahlen begründen: LOO (|elpd_diff| > 2·se_diff), Testdaten-Metriken (Brier/Skill/AUC oder RMSE) UND Check auf Overfitting (Train ≈ Test).',
      'Immer prüfen, ob loo_compare überhaupt zulässig ist: gleiche y-Skala, exakt gleiche Zeilenanzahl, Pareto k < 0.7.',
      'Faustregel zur Plausibilität: ΔAIC / 2 ≈ Δelpd (z. B. AIC sinkt um 444 → elpd steigt um ca. 222!).',
    ],
    quizDeckId: '08-Modellvergleich',
    checks: [
      {
        id: 'c8-1',
        prompt:
          'loo_compare(looA, looB) zeigt für Modell A: elpd_diff = −3.1, se_diff = 2.5 (B steht oben mit 0.0). Wie entscheidest du?',
        options: [
          'Modell B ist klar und eindeutig besser.',
          'Kein überzeugender Unterschied (3.1 < 2 × 2.5 = 5.0) – das einfachere Modell ist gut vertretbar.',
          'Modell A ist besser, weil es negativ ist.',
          'Das Ergebnis beweist Overfitting.',
        ],
        correctIndex: 1,
        explanation:
          '2·se-Regel: 2 × 2.5 = 5.0. Da |−3.1| < 5.0 liegt der Unterschied innerhalb der Unsicherheit → kein klarer Sieger.',
      },
      {
        id: 'c8-2',
        prompt:
          'Darf man ein Modell für preis mit einem Modell für log(preis) per loo_compare vergleichen?',
        options: [
          'Ja, wenn beide mit stan_glm geschätzt wurden.',
          'Nein – die Zielvariable hat eine andere Skala, die Log-Dichten sind nicht direkt vergleichbar.',
          'Ja, solange Pareto k < 0.7 ist.',
          'Nur auf Testdaten.',
        ],
        correctIndex: 1,
        explanation:
          'LOO vergleicht Log-Wahrscheinlichkeiten für y. Ändert man die Skala von y (z. B. log(y)) oder fliegen NAs raus, wird loo_compare ungültig!',
      },
    ],
  },
  {
    id: 'etappe-09-logistisch',
    number: '09',
    shortTitle: 'Logistische Regression ★',
    title: 'Klausurschwerpunkt: Odds, Logit, ROC und der perfekte Cutoff',
    chapterRef: 'Kapitel 9 · Beispielklausur',
    examWeight: 'Klausur-Kern (~60 %)',
    duration: '10 Min.',
    storyLead:
      'Das Finale der Modellierung bei NovaChip – und das absolute Herzstück der Beispielklausur WS26/27! Jetzt ist die Zielgröße binär: defect = 1 (defekter Wafer) oder 0 (fehlerfrei). Wie lesen wir Logits, Odds-Ratios und wählen den besten Alarm-Cutoff?',
    plainExplanation: [
      'Weil eine normale Gerade Wahrscheinlichkeiten über 100 % oder unter 0 % vorhersagen würde, rechnet stan_glm(..., family = binomial) auf der Logit-Skala: Erst verwandeln wir p in Odds = p / (1 − p), dann nehmen wir den Logarithmus (Logit = ln(Odds)). Logit 0 ist genau p = 50 %. Ein Koeffizient β wirkt multiplikativ auf die Odds: e^β ist die Odds-Ratio (OR).',
      'MERKSATZ NR. 1 FÜR DIE KLAUSUR: In der Nachtschicht ist shiftNight = 1.41, also OR = e^1.41 ≈ 4.1. Das heißt: Die ODDS sind 4.1-mal so hoch (bei sonst gleichen Werten) – NICHT die Wahrscheinlichkeit! Bei 10 % am Tag steigt p in der Nacht auf 31 %, nicht auf 41 %!',
      'Für die Praxis brauchen wir schließlich einen Cutoff (Schwellenwert für p): Senkst du den Cutoff (z. B. von 0.50 auf 0.30), erkennst du mehr echte Defekte (TPR steigt, FNR sinkt), zahlst aber mit mehr Fehlalarmen bei guten Wafern (FPR steigt). Wenn wir maximal 1 von 4 Defekten übersehen dürfen (FNR ≤ 0.25 ⇔ TPR ≥ 0.75), landet der Cutoff bei ca. 0.30!',
    ],
    keyTakeaways: [
      'Logit → p: p = 1 / (1 + e^−logit) · Faustregel für maximale p-Änderung: ≈ β / 4 (bei p ≈ 0.5).',
      'Gütemaße: AUC (Rangfolge, 0.5 Zufall, 0.917 sehr gut) · Brier-Score (Kalibrierung + Schärfe, Nullmodell p̄(1−p̄) = 0.1875 bei 25 % Defekten) · Skill = 1 − Brier/Brier_Null.',
      'Cutoff-Entscheidung: Bei kalibriertem Modell ist der kostenoptimale Cutoff p* = c_FP / (c_FP + c_FN). plotlogrates() immer mit newdata = df_test!',
    ],
    labId: 'logistic-cutoff',
    labTitle: 'Logit/OR-Umrechner & Interaktives Cutoff-Cockpit (100 Wafer)',
    labInstruction:
      'Probiere beide Tabs: (1) Sieh live, warum OR = 4.1 bei 10 % nur 31 % ergibt. (2) Schiebe den Cutoff-Regler auf ca. 0.30, um mindestens 75 % der Defekte zu erwischen (TPR ≥ 0.75), und prüfe Fehlalarme & Euro-Kosten!',
    rOutputTitle: 'Beispielklausur WS26/27: m2 Testgüte & plotlogrates',
    rCode: 'prediction_metrics(m2, newdata = df_test)\nROC(m2, newdata = df_test)\nplotlogrates(m2, newdata = df_test)  # WICHTIG: newdata angeben!',
    rOutput: `   Dataset    n     Brier   LogLoss    Skill   AUC
1 Training 3500  0.095280  0.313287  0.49300  0.905
2 New data 1500  0.089102  0.293603  0.51882  0.917
# Nullmodell-Brier (25% Defekte): 0.25 × 0.75 = 0.1875 → Skill = 1 - 0.089/0.1875 ≈ 0.52!`,
    examPhrasing: [
      'Bei Koeffizienten IMMER „Odds“ sagen, nie „Wahrscheinlichkeit“: „Die Odds für einen Defekt sind in der Nachtschicht ca. 4.1-mal so hoch wie am Tag (bei sonst gleichen Werten, nicht kausal).“',
      'Accuracy bei 25 % Defekten entlarven: Das blinde Modell „immer 0“ hat schon 75 % Accuracy – nutze stattdessen Brier-Skill, AUC und TPR/FPR.',
      'Anforderung „max. 1 von 4 Defekten übersehen“ übersetzen: FNR ≤ 0.25 ⇔ TPR ≥ 0.75 → Cutoff ≈ 0.30 ablesen.',
    ],
    quizDeckId: '09-Logistische-Regression',
    checks: [
      {
        id: 'c9-1',
        prompt:
          'Am Tag liegt die Defektwahrscheinlichkeit bei 10 % (Odds = 0.111). In der Nachtschicht ist die Odds-Ratio OR = 4.1. Wie hoch ist die Defektwahrscheinlichkeit in der Nacht ungefähr?',
        options: ['41 % (10 % × 4.1)', '31 % (Odds 0.456 → 0.456 / 1.456)', '14.1 %', '50 %'],
        correctIndex: 1,
        explanation:
          'Odds_Nacht = 0.111 × 4.1 = 0.456 → p = 0.456 / (1 + 0.456) ≈ 0.313 (31 %). Niemals Wahrscheinlichkeiten direkt mit der OR multiplizieren!',
      },
      {
        id: 'c9-2',
        prompt:
          'Eine Prüfung eines verdächtigen Wafers kostet 30 € (c_FP), ein übersehener Defekt beim Kunden kostet 300 € (c_FN). Das Modell ist gut kalibriert. Ab welcher Defektwahrscheinlichkeit p lohnt sich das Aussortieren?',
        options: ['Ab p > 0.50', 'Ab p > 0.091 (ca. 9–10 %)', 'Ab p > 0.30', 'Ab p > 0.90'],
        correctIndex: 1,
        explanation:
          'Kostenoptimaler Cutoff = c_FP / (c_FP + c_FN) = 30 / (30 + 300) = 30 / 330 ≈ 0.091 (bzw. p · 300 > 30 → p > 0.10).',
      },
    ],
  },
  {
    id: 'etappe-10-drift',
    number: '10',
    shortTitle: 'Split, Leakage & Drift',
    title: 'Go-Live-Realität: Warum Traum-Testwerte im Betrieb scheitern können',
    chapterRef: 'Kapitel 10 · Klausur Teil 1 & 7',
    examWeight: 'Sehr wichtig',
    duration: '7 Min.',
    storyLead:
      'Modell m2 geht bei NovaChip live! Doch ein paar Monate später werden die Anlagen neu kalibriert, und eine sechste Maschine M6 wird gekauft. Genau hier holst du dir in der Klausur (Abschnitt 1, 2 & 7) die letzten entscheidenden Punkte.',
    plainExplanation: [
      'Drei unsichtbare Killer ruinieren gute Modelle: (1) Falscher Split: Ein zufälliger 70/30-Split mischt benachbarte Produktionsstunden in Training und Test und prüft weder die Zukunft (dafür brauchst du einen zeitlichen Split) noch neue Anlagen (Leave-one-machine-out). (2) Data Leakage: Eine Variable enthält Zukunftswissen (z. B. Messwert nach der Endprüfung oder Skalierung vor dem Split) → im Test sensationell, im Betrieb nutzlos.',
      '(3) Drift nach Go-Live: Nach einer Neukalibrierung verschieben sich die Eingangsgrößen (Covariate Shift → Extrapolation!) oder der Zusammenhang X → y verändert sich (Concept Drift). Falle aus Klausurfrage 7.4: Selbst wenn die gesamte Defektrate bei 25 % bleibt, können sich Fehler zwischen Maschinen oder Schichten ausgleichen – die Gesamtquote allein beweist NICHTS!',
    ],
    keyTakeaways: [
      'Datenentstehung immer hinterfragen: na = 0 heißt nicht repräsentativ! Wurden Defekte überrepräsentiert (Oversampling → zerstört Kalibrierung)?',
      'Passender Split: Zukunft vorhersagen → Zeitlicher Split · Neue Maschine → Gruppierter Split (Leave-one-machine-out).',
      'Monitoring im Betrieb: Regelmäßig neue gelabelte Daten prüfen → Brier/AUC, Kalibrierung je Maschine/Schicht, TPR/FPR am Cutoff, Eingangsverteilungen vs. Training.',
    ],
    labId: 'split-drift',
    labTitle: 'Split- & Drift-Simulator (Go-Live-Stresstest)',
    labInstruction:
      'Wähle zuerst den passenden Split für verschiedene Klausur-Szenarien und simuliere dann eine Neukalibrierung (Covariate Shift / Concept Drift) im Live-Betrieb!',
    rOutputTitle: 'Klausur-Checkliste: Abschnitt 1 & 7 (Zukunft & Monitoring)',
    rCode: '# Monitoring auf neuen gelabelten Produktionsdaten (Monat +6):\nprediction_metrics(m2, newdata = df_monat6)\nROC(m2, newdata = df_monat6)\n# + getrennt je Maschine & Schicht prüfen + Eingangsverteilungen vergleichen!',
    rOutput: `Vor Neukalibrierung:  Gesamtdefektrate 25% | AUC 0.917 | Brier 0.089 (gut!)
Nach Drift (Falle!):  Gesamtdefektrate 25% | AUC 0.680 | Brier 0.165 (kaputt!)
# Gleiche Gesamtquote verbirgt massive Verschlechterung in Untergruppen!`,
    examPhrasing: [
      'Bei AIC-Frage 7.3 (Belichtungszeit vs. Transportgeschwindigkeit ändern sich): Größere Vorsicht bei line_speed, weil der AIC-Anstieg in effectsize(m2) dort am größten ist (+251 vs. +53) – zusätzlich starke Korrelation (−0.68) beachten!',
      'Unveränderte Gesamtdefektrate ist KEIN Beleg für ein funktionierendes Modell (Fehler können sich ausgleichen; Rangordnung & Untergruppen prüfen).',
      'Neue Maschine M6: Das Modell kennt keinen Koeffizienten für M6 und kann maschinenspezifische Eigenheiten nicht kennen.',
    ],
    quizDeckId: '10-Daten-Split-Drift',
    checks: [
      {
        id: 'c10-1',
        prompt:
          'Nach einigen Monaten ändern sich Belichtungszeit und Transportgeschwindigkeit deutlich, aber die Gesamtdefektrate bleibt bei exakt 25 %. Zeigt das, dass Modell m2 weiterhin zuverlässig ist?',
        options: [
          'Ja, weil mean_PPD weiterhin 0.25 entspricht.',
          'Nein – Fehler können sich über Maschinen/Schichten ausgleichen; AUC, Brier-Score und Kalibrierung müssen auf neuen gelabelten Daten geprüft werden.',
          'Ja, solange man mehr MCMC-Samples zieht.',
          'Nur wenn ein zufälliger Split verwendet wurde.',
        ],
        correctIndex: 1,
        explanation:
          'Beispielklausur Frage 7.4! Eine stabile Gesamtquote garantiert weder gute Trennschärfe (AUC) noch Kalibrierung in einzelnen Gruppen.',
      },
      {
        id: 'c10-2',
        prompt:
          'Du willst realistisch prüfen, wie gut dein Modell Defekte auf einer NEUEN, bisher unbekannten Produktionsanlage (M6) vorhersagt. Welche Validierung passt?',
        options: [
          'Zufälliger 70/30-Split über alle Zeilen',
          'Gruppierter Split (Leave-one-machine-out)',
          'Skalierung auf allen Daten vor dem Split',
          'Einfach R² auf Trainingsdaten ablesen',
        ],
        correctIndex: 1,
        explanation:
          'Bei einem gruppierten Split (Leave-one-machine-out) liegen alle Daten einer Maschine entweder komplett im Training oder komplett im Test – genau das testet die Übertragbarkeit auf neue Anlagen.',
      },
    ],
  },
];
