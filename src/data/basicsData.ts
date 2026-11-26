export type BasicsVisualId =
  | 'bayes-story'
  | 'regression-rent'
  | 'mcmc-hikers'
  | 'epred-vs-predict'
  | 'causal-arrows'
  | 'curves-interaction'
  | 'loo-scale'
  | 'odds-translator';

export interface BasicsTermCard {
  term: string;
  oneLiner: string;
  everydayExample: string;
  courseConnection: string;
}

export interface BasicsCheck {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BasicsModule {
  id: string;
  number: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  duration: string;
  everydayStory: string;
  visualId: BasicsVisualId;
  visualTitle: string;
  visualHint: string;
  terms: BasicsTermCard[];
  checks: BasicsCheck[];
  targetJourneyStageIndex: number;
  targetJourneyLabel: string;
}

export const BASICS_MODULES: BasicsModule[] = [
  {
    id: 'm01-bayes',
    number: '01',
    shortTitle: 'Wie Bayes denkt',
    title: 'Prior, Likelihood, Posterior – einfach erklärt am Rauchmelder',
    subtitle: 'Du hast noch nie von Bayes gehört? Perfekt – genau hier fangen wir an.',
    duration: '5 Min.',
    everydayStory:
      'Stell dir vor, du stehst unter der Dusche und plötzlich piept der Rauchmelder in deiner Küche. Reißt du sofort in Panik das Fenster auf, weil die Wohnung brennt – oder denkst du dir: „Moment, mein Mitbewohner brät gerade Speck an“? Herzlichen Glückwunsch: Genau so denkt der Satz von Bayes! Du verbindest dein Vorwissen (wie oft brennt es wirklich?) mit dem neuen Hinweis (es piept).',
    visualId: 'bayes-story',
    visualTitle: 'Interaktives Alltagsbeispiel: Vorwissen + Hinweis = Neues Urteil',
    visualHint:
      'Wechsle zwischen drei Alltagssituationen und sieh, warum derselbe Alarm je nach Basisrate etwas völlig anderes bedeutet.',
    terms: [
      {
        term: 'Basisrate (Prävalenz)',
        oneLiner: 'Wie oft kommt etwas im Alltag überhaupt vor – ganz ohne Test oder Alarm?',
        everydayExample:
          'Ein echter Wohnungsbrand passiert vielleicht an 1 von 10.000 Tagen (winzige Basisrate). Angebrannter Toast passiert viel öfter.',
        courseConnection:
          'Wenn nur 1 % aller Bauteile defekt sind, dominieren Fehlalarme fast jeden positiven Test – erst auf die Basisrate schauen!',
      },
      {
        term: 'Prior (Vorwissen)',
        oneLiner: 'Deine ehrliche Einschätzung BEVOR du neue Daten oder Hinweise siehst.',
        everydayExample:
          'Noch bevor du aus dem Fenster schaust, weißt du: Im August schneit es in Österreich fast nie. Das ist dein Prior.',
        courseConnection:
          'In R nutzt stan_glm automatisch vorsichtige („schwach-informative“) Priors, die absurde Fantasiezahlen verhindern, ohne die Daten zu verbiegen.',
      },
      {
        term: 'Likelihood (Passung der Daten)',
        oneLiner: 'Wie gut passt das, was du gerade beobachtest, zu einer bestimmten Erklärung?',
        everydayExample:
          'Dass der Rauchmelder piept, passt super zu „echtes Feuer“ (95 %), passiert aber manchmal auch beim Braten (5 %).',
        courseConnection:
          'Die Likelihood verbindet dein Modell mit den tatsächlich gemessenen Daten: p(Daten | Parameter).',
      },
      {
        term: 'Posterior (Neues Urteil)',
        oneLiner: 'Dein aktualisiertes Wissen NACHDEM du Vorwissen (Prior) und neue Daten (Likelihood) kombiniert hast.',
        everydayExample:
          'Aus „Feuer ist extrem selten“ + „Rauchmelder piept“ wird: „Wahrscheinlich nur angebrannter Toast, aber ich schaue kurz nach.“',
        courseConnection:
          'In der Bayes-Statistik ist der Posterior keine einzelne starre Zahl, sondern eine ganze Wolke aus 4.000 plausiblen Werten.',
      },
      {
        term: 'Satz von Bayes',
        oneLiner: 'Die Rechenregel, die eine Frage umdreht: Von „Wie oft piept es bei Feuer?“ zu „Wie sicher brennt es, wenn es piept?“.',
        everydayExample:
          'Fast alle Menschen verwechseln die beiden Richtungen – der Satz von Bayes sorgt dafür, dass wir nicht auf seltene Fehlalarme hereinfallen.',
        courseConnection:
          'Das Herzstück der gesamten Vorlesung: Wir schätzen p(Parameter | Daten) statt des verwirrenden klassischen p-Werts.',
      },
      {
        term: 'z-Transformation (z-Skala)',
        oneLiner: 'Rechnet verschiedene Einheiten (z. B. °C und Euro) auf eine gemeinsame neutrale Skala um.',
        everydayExample:
          'Wie wenn du im Zeugnis nicht „42 Punkte“ und „1,80 m“ vergleichst, sondern sagst: „1 Standardabweichung über dem Schnitt“.',
        courseConnection:
          'Ermöglicht faire Vergleiche zwischen Variablen mit völlig unterschiedlichen Einheiten und ist die Standard-Skala für Priors in R.',
      },
    ],
    checks: [
      {
        id: 'b01-1',
        prompt:
          'Du hörst im Treppenhaus lautes Bellen. Noch bevor du die Tür öffnest, weißt du: Im Haus wohnen 5 Hunde, aber 0 Löwen. Wie heißt dieses Vorwissen?',
        options: ['Likelihood', 'Prior', 'Posterior', 'Residuum'],
        correctIndex: 1,
        explanation:
          'Dein Wissen BEVOR du den neuen Hinweis (das Bellen) auswertest, ist der Prior. Das Bellen selbst liefert die Likelihood, und dein Schluss danach ist der Posterior.',
      },
      {
        id: 'b01-2',
        prompt:
          'Warum sind bei einer sehr seltenen Krankheit (0,5 % der Menschen betroffen) viele positive Schnelltests trotzdem Fehlalarme?',
        options: [
          'Weil der Test kaputt sein muss.',
          'Weil es riesig viele gesunde Menschen gibt – selbst wenige Prozent Fehlalarm ergeben viele falsche Treffer (niedrige Basisrate).',
          'Weil der Posterior immer 50 % ist.',
          'Weil man die z-Transformation vergessen hat.',
        ],
        correctIndex: 1,
        explanation:
          'Genau! Das ist der Basisraten-Effekt: Viele Gesunde × kleine Fehlalarmrate übertreffen leicht Wenige Kranke × hohe Trefferquote.',
      },
    ],
    targetJourneyStageIndex: 0,
    targetJourneyLabel: 'Etappe 01: Bayes bei NovaChip anwenden',
  },
  {
    id: 'm02-regression',
    number: '02',
    shortTitle: 'Regression & Geraden',
    title: 'Was eine Regressionsgerade wirklich sagt (am Mietspiegel)',
    subtitle: 'Intercept, Zentrieren, Referenzgruppe, HDI und sigma ohne eine einzige komplizierte Formel.',
    duration: '6 Min.',
    everydayStory:
      'Du suchst eine Wohnung und willst wissen: „Was kostet eine Wohnung je nach Quadratmetern – und macht Altbau vs. Neubau einen Unterschied?“ Eine lineare Regression zieht einfach die bestmögliche gerade Linie durch deine Preisdaten. Dabei tauchen in R plötzlich Begriffe wie Intercept, HDI oder sigma auf – alle haben eine völlig logische Bedeutung.',
    visualId: 'regression-rent',
    visualTitle: 'Interaktiver Mietspiegel: Warum Zentrieren den Startwert sinnvoll macht',
    visualHint:
      'Schalte zwischen „0 m² (unzentriert)“ und „ab 50 m² (zentriert)“ um und vergleiche Altbau vs. Neubau.',
    terms: [
      {
        term: 'Intercept & Basisfall',
        oneLiner: 'Der Startwert der Linie genau an dem Punkt, an dem alle Eingaben auf 0 (bzw. ihrem Startwert) stehen.',
        everydayExample:
          'Wenn x die Wohnfläche in m² ist, wäre der Intercept die Miete einer 0-m²-Wohnung – im Alltag komplett unsinnig!',
        courseConnection:
          'In der Klausur immer fragen: „Ist der Basisfall (alle x = 0) realistisch?“ Falls nein → zentrieren!',
      },
      {
        term: 'Zentrieren',
        oneLiner: 'Wir verschieben den Nullpunkt auf einen realistischen Vergleichswert (z. B. Wohnfläche minus 50 m²).',
        everydayExample:
          'Jetzt steht x = 0 für eine typische 50-m²-Wohnung – plötzlich kannst du den Intercept direkt als normale Miete ablesen.',
        courseConnection:
          'Die Vorhersagen und die Linie bleiben 100 % gleich – nur der Intercept wird endlich verständlich!',
      },
      {
        term: 'Referenzgruppe',
        oneLiner: 'Die Basis-Kategorie (z. B. Altbau), mit der alle anderen Gruppen (z. B. Neubau) verglichen werden.',
        everydayExample:
          'Wenn „Neubau: +180 €“ in der Tabelle steht, bedeutet das: Ein Neubau kostet im Schnitt 180 € mehr ALS die Referenzgruppe Altbau.',
        courseConnection:
          'Die Referenzgruppe hat in R (info()) keine eigene Zeile – sie steckt im Intercept.',
      },
      {
        term: 'MAD_SD & 95 %-HDI',
        oneLiner: 'Zeigen dir, wie sicher oder wackelig eine geschätzte Zahl (z. B. +12 €/m²) ist.',
        everydayExample:
          'Statt blind „genau +12 €“ zu behaupten, sagt das 95 %-HDI ehrlich: „Mit 95 % Wahrscheinlichkeit liegt der Aufpreis zwischen +10 € und +14 €.“',
        courseConnection:
          'Enthält das 95 %-HDI die 0 (z. B. −2 bis +5), wissen wir nicht einmal sicher, ob der Effekt positiv oder negativ ist!',
      },
      {
        term: 'sigma (σ) & Bayes-R²',
        oneLiner: 'sigma ist die normale Streuung einzelner Wohnungen um die Linie; R² sagt, wie viel Prozent der Preisunterschiede die Linie erklärt.',
        everydayExample:
          'Auch zwei exakt gleiche 60-m²-Wohnungen kosten nicht auf den Cent gleich viel (Aussicht, Balkon) – diese Reststreuung ist sigma.',
        courseConnection:
          'Etwa 95 % aller Einzelfälle liegen im Bereich ±2·sigma um die Linie. R² liegt zwischen 0 (erklärt nichts) und 1 (erklärt alles).',
      },
      {
        term: 'Extrapolation',
        oneLiner: 'Eine Vorhersage weit außerhalb der bisher gesehenen Daten.',
        everydayExample:
          'Wenn du nur normale 30–100-m²-Wohnungen kennst und damit den Preis eines 2.000-m²-Schlosses ausrechnest, rätst du ins Blaue.',
        courseConnection:
          'In jeder Klausur ein wichtiger Warnhinweis: Modelle gelten nur zuverlässig im Bereich der Trainingsdaten!',
      },
    ],
    checks: [
      {
        id: 'b02-1',
        prompt:
          'Warum ziehen wir bei der Temperatur oft 20 °C ab (temp - 20), bevor wir das Modell rechnen?',
        options: [
          'Damit das Modell genauere Vorhersagen macht und R² steigt.',
          'Damit der Intercept den sinnvollen Basisfall „bei 20 °C“ beschreibt statt eines unrealistischen 0-°C-Werts.',
          'Weil R keine Zahlen über 20 verarbeiten kann.',
          'Um die Referenzgruppe zu löschen.',
        ],
        correctIndex: 1,
        explanation:
          'Zentrieren ändert weder Vorhersagen noch R² – es macht aber den Startwert (Intercept) für Menschen direkt sinnvoll lesbar.',
      },
      {
        id: 'b02-2',
        prompt:
          'Im Modell steht für „Balkon“ ein 95 %-HDI von [−15 €; +65 €]. Was bedeutet das alltagssprachlich?',
        options: [
          'Ein Balkon erhöht die Miete garantiert um mindestens 15 €.',
          'Die 0 liegt im Intervall – der wahre Effekt könnte leicht negativ, 0 oder positiv sein (zu unsicher für eine klare Richtung).',
          '95 % aller Wohnungen haben einen Balkon.',
          'Das Modell hat einen Rechenfehler.',
        ],
        correctIndex: 1,
        explanation:
          'Wenn das 95 %-HDI die Null einschließt, ist kein eindeutiger Effekt in eine Richtung belegt.',
      },
    ],
    targetJourneyStageIndex: 1,
    targetJourneyLabel: 'Etappe 02: Lineare Regression im R-Output lesen',
  },
  {
    id: 'm03-mcmc',
    number: '03',
    shortTitle: 'MCMC & Modell-Check',
    title: 'Wie der Computer rechnet – und woran du kaputte Modelle erkennst',
    subtitle: '4 Wanderer im Nebel (MCMC, Rhat) und der Realitäts-Check (PPC, Residuen, Overfitting).',
    duration: '6 Min.',
    everydayStory:
      'Bayes-Modelle sind oft zu kompliziert, um sie per Hand mit einer Formel auszurechnen. Deshalb schickt dein Computer 4 unabhängige „Wanderer“ (Chains) in eine neblige Berglandschaft, um den wahrscheinlichsten Gipfel abzulaufen. Danach prüfen wir zwei Dinge: Haben die Wanderer sauber gerechnet (MCMC)? Und passt das Modell überhaupt zur echten Welt (Diagnose)?',
    visualId: 'mcmc-hikers',
    visualTitle: '4 Wanderer im Nebel: Gesundes Sampling vs. Rhat-Alarm',
    visualHint:
      'Schalte zwischen „Alle einig“ und „Ein Wanderer verirrt sich“ um und sieh, was Rhat und n_eff bedeuten.',
    terms: [
      {
        term: 'MCMC & Chains',
        oneLiner: 'Das Zufalls-Suchverfahren, mit dem der Computer 4 unabhängige Ketten (Chains) laufen lässt, um 4.000 mögliche Lösungen zu sammeln.',
        everydayExample:
          'Wie 4 Wanderer, die an verschiedenen Stellen im Tal starten und per GPS alle 1.000 Schritte ihre Position melden.',
        courseConnection:
          'Standard in stan_glm: 4 Chains × 1.000 Schritte = 4.000 Posterior-Samples pro Parameter.',
      },
      {
        term: 'Rhat, n_eff & mcse',
        oneLiner: 'Die drei technischen Kontrolllampen für die Berechnung: Einigkeit (Rhat ≈ 1.0), eigenständige Schritte (n_eff > 2000), winzige Rechenunschärfe (mcse).',
        everydayExample:
          'Landen alle 4 Wanderer auf demselben Gipfel? Super (Rhat = 1.00). Hängt einer im Nachbartal fest? Alarm (Rhat > 1.1)!',
        courseConnection:
          'Wichtige Falle: Grüne MCMC-Werte heißen nur „sauber gerechnet“ – NICHT automatisch „inhaltlich gutes Modell“!',
      },
      {
        term: 'PPC & mean_PPD',
        oneLiner: 'Realitäts-Test: Das fertige Modell erfindet künstliche Daten – sehen die genauso aus wie deine echten Messwerte?',
        everydayExample:
          'Wie wenn ein Musik-Programm eigene Songs erzeugt: Wenn sie komplett schräg klingen, hat es das Genre nicht verstanden.',
        courseConnection:
          'mean_PPD (Mittelwert der simulierten Daten) sollte fast genau dem echten Durchschnitt deiner Zielgröße entsprechen.',
      },
      {
        term: 'Residuum & Heteroskedastizität',
        oneLiner: 'Ein Residuum ist schlicht der Fehler pro Datenpunkt (echter Wert minus Vorhersage). Wächst der Fehler trichterförmig an, heißt das Heteroskedastizität.',
        everydayExample:
          'Wenn deine Uhr mal 1 Min vor, mal 1 Min nach geht, ist alles ok. Wenn sie aber bei hohen Temperaturen immer 20 Min falsch geht, stimmt etwas nicht!',
        courseConnection:
          'U-förmige („Bananen“-)Residuen verraten dir: Eine gerade Linie reicht nicht, es fehlt eine Kurve (quadratischer Term)!',
      },
      {
        term: 'Overfitting',
        oneLiner: 'Das Modell lernt Zufall und Ausreißer der Trainingsdaten auswendig statt echte Regeln zu verstehen.',
        everydayExample:
          'Wie ein Schüler, der alte Prüfungsantworten nur auswendig lernt: Bei derselben Klausur 100 %, bei neuen Aufgaben Totalausfall.',
        courseConnection:
          'Deshalb testen wir Modelle IMMER auf frischen Daten (Testdaten / LOO) statt nur auf den Trainingsdaten.',
      },
      {
        term: 'RMSE & Skill',
        oneLiner: 'RMSE ist der typische Vorhersagefehler in der echten Einheit (z. B. Euro oder kWh). Skill vergleicht dich mit blindem Durchschnitt-Raten.',
        everydayExample:
          'Wenn ein Wetterfrosch immer „15 °C“ rät und du nur halb so große Fehler machst, hast du Skill = 0,5 (50 % Fehler gespart).',
        courseConnection:
          'Skill = 0 bedeutet „nicht besser als Raten“, Skill = 1 wäre perfekt, negativer Skill ist schlechter als einfach den Schnitt zu raten!',
      },
    ],
    checks: [
      {
        id: 'b03-1',
        prompt:
          'Alle deine MCMC-Lampen sind grün (Rhat = 1.00, n_eff = 3800). Darfst du sofort jubeln, dass das Modell die Realität perfekt beschreibt?',
        options: [
          'Ja, Rhat = 1.00 beweist, dass keine wichtige Variable fehlt.',
          'Nein! Das heißt nur, dass der Computer die Rechnung sauber gelöst hat – ob das Modell zur Realität passt, prüfen PPC und Residuen.',
          'Nur wenn Overfitting > 1 ist.',
          'Ja, denn n_eff misst die Genauigkeit auf Testdaten.',
        ],
        correctIndex: 1,
        explanation:
          'Genau diese Trennung ist Gold wert: MCMC prüft die Rechentechnik, PPC/Residuen/Testdaten prüfen die inhaltliche Qualität.',
      },
      {
        id: 'b03-2',
        prompt:
          'Was bedeutet ein Skill-Score von 0,0?',
        options: [
          'Das Modell macht 0 Fehler (perfekt).',
          'Das Modell ist genauso gut – oder schlecht – wie einfach immer stumpf den Mittelwert zu raten.',
          'Das Modell ist 100 % besser als der Durchschnitt.',
          'Alle Residuen sind 0.',
        ],
        correctIndex: 1,
        explanation:
          'Skill = 1 − Fehler_Modell / Fehler_Nullmodell. Bei Skill = 0 bringt dein Modell keinen Vorteil gegenüber blindem Durchschnitt-Raten.',
      },
    ],
    targetJourneyStageIndex: 2,
    targetJourneyLabel: 'Etappe 03: MCMC & Diagnose-Plots testen',
  },
  {
    id: 'm04-prediction',
    number: '04',
    shortTitle: 'Schnitt vs. Einzelfall',
    title: 'Durchschnitt vorhersagen vs. einen einzelnen Tag absichern',
    subtitle: 'Warum posterior_epred schmal ist, posterior_predict breit – und wie Kosten Entscheidungen lenken.',
    duration: '5 Min.',
    everydayStory:
      'Stell dir vor, du planst einen Pizza-Abend. Im Durchschnitt über 100 Partys isst ein Gast ziemlich genau 3,0 Stücke (sehr gut planbar!). Aber wie viel isst dein bester Freund Lukas HEUTE Abend? Vielleicht 1 Stück, vielleicht 6! Genau das ist der Unterschied zwischen Durchschnitt (epred) und Einzelfall (predict).',
    visualId: 'epred-vs-predict',
    visualTitle: 'Pizza-Rechner: Durchschnitt vieler Abende vs. genau heute Abend',
    visualHint:
      'Verschiebe das Kostenverhältnis (Hunger vs. Reste) und beobachte, warum du nicht einfach den Mittelwert bestellst.',
    terms: [
      {
        term: 'posterior_epred (Durchschnitt)',
        oneLiner: 'Zeigt die Unsicherheit für den MITTELWERT vieler gleicher Fälle.',
        everydayExample:
          '„Wie viele Stücke Pizza essen 100 Gäste IM SCHNITT?“ – Dieser Durchschnitt schwankt nur sehr wenig.',
        courseConnection:
          'Enthält nur die Unsicherheit der Modell-Koeffizienten, NICHT den Einzelfall-Zufall sigma. Bei logistischen Modellen liefert es Wahrscheinlichkeiten p.',
      },
      {
        term: 'posterior_predict (Einzelfall)',
        oneLiner: 'Zeigt die mögliche Bandbreite für EINE einzige konkrete Person, einen Tag oder ein Bauteil.',
        everydayExample:
          '„Wie viele Stücke isst Lukas HEUTE Abend?“ – Viel breiter als der Durchschnitt, weil jeder Abend anders läuft!',
        courseConnection:
          'Enthält Koeffizienten-Unsicherheit PLUS den unvermeidbaren Zufall sigma – immer die Wahl für konkrete Einzelfall-Entscheidungen!',
      },
      {
        term: 'Kostenquantil (Optimales Quantil)',
        oneLiner: 'Wenn zu wenig viel teurer ist als zu viel, planst du bewusst Puffer ein statt genau die Mitte zu nehmen.',
        everydayExample:
          'Wenn hungrige Gäste 3× schlimmer sind als 2 übrige Pizzastücke im Kühlschrank, bestellst du so viel, dass es in 75 % der Fälle reicht: 3 / (3 + 1) = 75 %!',
        courseConnection:
          'Formel q* = c_unter / (c_unter + c_über) direkt auf die Samples von posterior_predict anwenden.',
      },
    ],
    checks: [
      {
        id: 'b04-1',
        prompt:
          'Du willst wissen, wie hoch der Stromverbrauch DEINES Hauses morgen höchstens sein könnte (95 %-Bereich). Welche Funktion brauchst du?',
        options: [
          'posterior_epred – weil es ein präziserer, schmalerer Bereich ist.',
          'posterior_predict – weil es um EINEN konkreten morgigen Tag inklusive Zufallsstreuung geht.',
          'Nur den Intercept.',
          'Rhat.',
        ],
        correctIndex: 1,
        explanation:
          'Ein konkreter einzelner Tag schwankt viel stärker als der langfristige Schnitt – dafür brauchst du immer posterior_predict.',
      },
      {
        id: 'b04-2',
        prompt:
          'Zu wenig Ware zu bestellen kostet 4 € Strafe pro Stück, zu viel zu bestellen kostet nur 1 € Lagerkosten. Welches Quantil der Vorhersage solltest du bestellen?',
        options: ['50 % (Median)', '20 %', '80 %  (weil 4 / (4 + 1) = 0,80)', '100 %'],
        correctIndex: 2,
        explanation:
          'Perfekt gerechnet: q* = c_unter / (c_unter + c_über) = 4 / (4 + 1) = 80 %. Du baust genau den passenden Puffer ein.',
      },
    ],
    targetJourneyStageIndex: 3,
    targetJourneyLabel: 'Etappe 04: Vorhersage & Kostenquantil üben',
  },
  {
    id: 'm05-causal',
    number: '05',
    shortTitle: 'Ursache vs. Zufall',
    title: 'Warum Eisessen keinen Sonnenbrand verursacht (Kausal-Fallen)',
    subtitle: 'Simpsons Paradox, Confounder, Mediator und Collider – klar getrennt an Alltagsbildern.',
    duration: '6 Min.',
    everydayStory:
      'Im Freibad zeigt jede Statistik: An Tagen mit hohem Eisverkauf gibt es viel mehr Sonnenbrände! Verbietet der Bademeister jetzt das Eis? Natürlich nicht – beides wird von der Sonne ausgelöst. In der Datenanalyse fallen sogar Profis ständig auf solche versteckten Pfeile herein. Hier lernst du die 3 Muster, die du für die Klausur auseinanderhalten musst.',
    visualId: 'causal-arrows',
    visualTitle: 'Die 3 Kausal-Dreiecke: Was darf ins Modell – und wovon lässt du die Finger?',
    visualHint:
      'Klicke alle drei Pfeil-Muster durch und präge dir die Regel „Rein“ vs. „Finger weg“ ein.',
    terms: [
      {
        term: 'Assoziation vs. Kausalität',
        oneLiner: 'Dass zwei Dinge zusammen auftreten (Assoziation), heißt noch lange nicht, dass das eine das andere verursacht (Kausalität).',
        everydayExample:
          'Störche und Babys korrelieren in alten Daten – aber Störche bringen keine Babys (beides war auf dem Land häufiger).',
        courseConnection:
          'Aus reinen Beobachtungsdaten darfst du in der Klausur NIE schließen: „Wenn wir X ändern, passiert garantiert Y.“',
      },
      {
        term: 'Confounder (Störgröße)',
        oneLiner: 'Eine gemeinsame Hintergrund-Ursache, die BEIDES gleichzeitig antreibt (X ← C → Y).',
        everydayExample:
          'Hitze (C) sorgt für mehr Eisverkauf (X) UND mehr Sonnenbrand (Y). Ohne „Hitze“ im Modell sieht es aus, als mache Eis Sonnenbrand!',
        courseConnection:
          'Lösung: Confounder IMMER ins Modell aufnehmen (kontrollieren), sonst entsteht Omitted Variable Bias.',
      },
      {
        term: 'Mediator (Zwischenschritt)',
        oneLiner: 'Liegt wie eine Brücke mitten auf dem Wirkungsweg zwischen Ursache und Ergebnis (X → M → Y).',
        everydayExample:
          'Mehr Lernen (X) → besseres Verständnis (M) → bessere Note (Y). Wenn du „Verständnis“ festhältst, scheint Lernen plötzlich wirkungslos!',
        courseConnection:
          'Willst du die gesamte Wirkung von X messen, darfst du den Mediator NICHT ins Modell packen.',
      },
      {
        term: 'Collider (Sackgasse)',
        oneLiner: 'Eine Folge, die von ZWEI unabhängigen Ursachen gleichzeitig beeinflusst wird (X → C ← Y).',
        everydayExample:
          'In Hollywood werden Leute berühmt (C), wenn sie extrem talentiert (X) ODER extrem attraktiv (Y) sind. Schaust du nur auf Stars, wirken Talent und Aussehen plötzlich negativ verknüpft!',
        courseConnection:
          'Finger weg vom Collider: Weder danach filtern noch ins Modell aufnehmen – sonst erzeugst du künstliche Schein-Effekte.',
      },
      {
        term: 'Simpsons Paradox',
        oneLiner: 'In jeder einzelnen Untergruppe geht der Trend in eine Richtung – wirft man alle Gruppen zusammen, dreht er sich um!',
        everydayExample:
          'Ein Spitzen-Chirurg übernimmt die schwersten Notfälle und hat insgesamt mehr Todesfälle als ein Anfänger mit leichten Fällen – obwohl er in jeder Risikogruppe besser ist!',
        courseConnection:
          'Niemals blinden Gesamtdurchschnitten trauen – immer prüfen, ob eine versteckte Gruppen-Variable dahintersteckt.',
      },
    ],
    checks: [
      {
        id: 'b05-1',
        prompt:
          'Menschen mit Feuerzeug in der Tasche bekommen häufiger Lungenkrebs – weil Rauchen beides verursacht (Feuerzeug ← Rauchen → Krebs). Was ist „Rauchen“?',
        options: ['Mediator', 'Collider', 'Confounder (gemeinsame Ursache)', 'Intercept'],
        correctIndex: 2,
        explanation:
          'Rauchen zeigt mit Pfeilen auf beide Seiten (X ← C → Y). Das ist ein klassischer Confounder – er gehört ins Modell!',
      },
      {
        id: 'b05-2',
        prompt:
          'Ein neues Lernprogramm (X) verbessert die Übungszeit (M) und dadurch die Klausurnote (Y): X → M → Y. Du willst wissen, wie gut das Programm insgesamt hilft. Nimmst du M als Kontrollvariable mit rein?',
        options: [
          'Ja, immer alle verfügbaren Spalten ins Modell werfen.',
          'Nein! M ist ein Mediator auf dem Wirkungsweg – ihn zu kontrollieren würde den Effekt des Programms künstlich verschlucken.',
          'Nur wenn Rhat > 1,1 ist.',
          'Ja, weil M ein Collider ist.',
        ],
        correctIndex: 1,
        explanation:
          'Genau! Den Mediator kontrolliert man nicht, wenn man die Gesamtwirkung von X sucht.',
      },
    ],
    targetJourneyStageIndex: 4,
    targetJourneyLabel: 'Etappe 05: Simpsons Paradox bei NovaChip lösen',
  },
  {
    id: 'm06-effects',
    number: '06',
    shortTitle: 'Effektgröße & Kurven',
    title: 'Wie wichtig ist eine Variable – und wann biegt sich die Linie?',
    subtitle: 'Cohens f², Cohens d, Interaktionen („Kommt drauf an!“) und U-Kurven (Scheitelpunkt).',
    duration: '5 Min.',
    everydayStory:
      'Nicht jede Linie ist gerade und nicht jede Variable wirkt überall gleich: 1 Tasse Kaffee macht dich wacher, 2 Tassen sind perfekt – aber 8 Tassen machen dich zittrig und unkonzentriert (eine Kurve mit Optimum!). Und Lernzeit hilft ausgeschlafen doppelt so stark wie übermüdet (eine Interaktion!).',
    visualId: 'curves-interaction',
    visualTitle: 'Visueller Vergleich: Parallel vs. Interaktion (Schere) vs. U-Kurve',
    visualHint:
      'Schalte durch alle drei Formen und sieh sofort, was R mit „Interaktion“ und „Scheitelpunkt“ meint.',
    terms: [
      {
        term: 'Cohens f² (Effektgröße)',
        oneLiner: 'Misst, wie viel von dem NOCH UNERKLÄRTEN Rest eine Variable zusätzlich wegräumt, wenn man sie ins Modell aufnimmt.',
        everydayExample:
          'Wenn schon 80 % geklärt sind und eine neue Info die Hälfte der übrigen 20 % erklärt, ist sie überraschend stark – genau das misst f².',
        courseConnection:
          'Richtwerte merken: 0,02 klein · 0,15 mittel · 0,35 groß. In R direkt mit effectsize(m) ablesbar!',
      },
      {
        term: 'Cohens d',
        oneLiner: 'Wie weit liegen zwei Gruppendurchschnitte auseinander – gemessen in Standardabweichungen statt in Euro oder Punkten.',
        everydayExample:
          '„Gruppe B ist 0,8 Standardabweichungen besser“ – egal ob es um Körpergröße, Gehalt oder Klausurpunkte geht, 0,8 ist immer ein großer Unterschied.',
        courseConnection:
          'Richtwerte für Gruppenvergleiche: 0,2 klein · 0,5 mittel · 0,8 groß.',
      },
      {
        term: 'effectsize() & Df',
        oneLiner: 'Eine Hilfsfunktion in R, die jede Variable probeweise komplett rauswirft und zeigt, wie weh ihr Fehlen dem Modell tut.',
        everydayExample:
          'Wie beim Fußball: Du nimmst einen Spieler kurz vom Platz und schaust, wie stark die Mannschaft einbricht.',
        courseConnection:
          'Spalte Df zeigt, wie viele Parameter dabei rausfliegen (z. B. Haupteffekt + Interaktion = 2). Bei logistisch schaust du auf den AIC-Anstieg!',
      },
      {
        term: 'Interaktion (Schere)',
        oneLiner: '„Es kommt drauf an!“ – Die Steigung einer Variable verändert sich je nach Gruppe oder zweiter Variable.',
        everydayExample:
          'Zusätzliche Heizleistung senkt im schlecht gedämmten Altbau die Kosten ganz anders als im Passivhaus – die Linien laufen nicht parallel!',
        courseConnection:
          'Wichtigste Regel: Bei einer Interaktion gilt der Haupteffekt einer Gruppe NUR genau am Referenzpunkt x = 0.',
      },
      {
        term: 'Quadratischer Term & Scheitelpunkt',
        oneLiner: 'Wenn sowohl „zu wenig“ als auch „zu viel“ schlecht ist, biegt ein (x − c)² die Gerade zu einer U- oder Bogen-Kurve.',
        everydayExample:
          'Kaffee, Ofentemperatur beim Backen oder Trainingspensum: Irgendwo dazwischen liegt der perfekte Punkt (Scheitelpunkt x*).',
        courseConnection:
          'Scheitelpunkt-Formel aus der Klausur: x* = c − β₁ / (2 · β₂).',
      },
    ],
    checks: [
      {
        id: 'b06-1',
        prompt:
          'Woran erkennst du in einer Grafik auf einen Blick, dass eine Interaktion zwischen zwei Variablen vorliegt?',
        options: [
          'Die Linien der beiden Gruppen laufen exakt parallel.',
          'Die Linien haben unterschiedliche Steigungen (sie laufen auseinander wie eine Schere oder kreuzen sich).',
          'Alle Punkte liegen genau auf der Nulllinie.',
          'Die x-Achse ist in Prozent.',
        ],
        correctIndex: 1,
        explanation:
          'Parallel = keine Interaktion (Effekt überall gleich). Unterschiedliche Steigung = Interaktion („es kommt drauf an“).',
      },
      {
        id: 'b06-2',
        prompt:
          'Ein Kollege sagt: „f² = 0,15 bedeutet, die Variable erklärt 15 % der gesamten Streuung.“ Stimmt das?',
        options: [
          'Ja, f² und R² sind dasselbe.',
          'Nein! f² misst den Anteil an der noch UNERKLÄRTEN Restvarianz (1 − R²), nicht an der Gesamtvarianz – und 0,15 gilt als mittlerer Effekt.',
          'Nein, 0,15 ist ein gigantischer Effekt.',
          'f² gibt es nur für Textdaten.',
        ],
        correctIndex: 1,
        explanation:
          'Super aufgepasst! Genau diese Unterscheidung (Restvarianz statt Gesamtvarianz) ist eine beliebte Klausurfrage.',
      },
    ],
    targetJourneyStageIndex: 5,
    targetJourneyLabel: 'Etappe 06 & 07: Effektgröße & Interaktionen meistern',
  },
  {
    id: 'm07-compare',
    number: '07',
    shortTitle: 'Modelle vergleichen',
    title: 'Welches Modell ist wirklich besser – ohne Selbstbetrug?',
    subtitle: 'Warum mehr Variablen nicht automatisch besser sind – einfach erklärt mit LOO, AIC und Pareto k.',
    duration: '4 Min.',
    everydayStory:
      'Du hast zwei Modelle gebaut: ein einfaches mit 2 Regeln und ein kompliziertes mit 10 Regeln. Auf den alten Daten wirkt das komplizierte fast immer besser – weil es sich jede zufällige Zacke merken kann. Wie finden wir fair heraus, welches bei NEUEN Daten gewinnt? Wir machen eine Generalprobe, bei der jeder Punkt einmal versteckt wird!',
    visualId: 'loo-scale',
    visualTitle: 'Interaktive LOO-Waage: Wann lohnt sich das komplexere Modell?',
    visualHint:
      'Schiebe Vorteil (elpd_diff) und Unsicherheit (se_diff) und beobachte die 2·SE-Faustregel.',
    terms: [
      {
        term: 'LOO & elpd (Leave-One-Out)',
        oneLiner: 'Prüft für jeden Datenpunkt so, als hätte das Modell ihn vorher nie gesehen – und addiert, wie gut die Vorhersagen klappen (elpd: größer = besser).',
        everydayExample:
          'Wie eine mündliche Prüfung mit 100 Fragen, bei der das Modell jede Frage beantworten muss, ohne sie vorher im Übungsheft gesehen zu haben.',
        courseConnection:
          'Mit loo_compare(loo(m1), loo(m2)) steht das beste Modell oben (0.0); alle anderen bekommen ein negatives elpd_diff.',
      },
      {
        term: '2·SE-Regel (elpd_diff & se_diff)',
        oneLiner: 'Erst wenn der Vorsprung mindestens doppelt so groß ist wie seine eigene Unsicherheit (|elpd_diff| > 2 · se_diff), ist ein Modell klar besser.',
        everydayExample:
          'Wenn Auto A auf 100 km im Schnitt 0,2 Liter spart, die Messung aber um ±0,5 Liter wackelt, ist kein klarer Sieger belegt → nimm das einfachere!',
        courseConnection:
          'Wichtige Einschränkung: LOO darf nur Modelle mit exakt denselben Datenzeilen und derselben y-Skala vergleichen!',
      },
      {
        term: 'Pareto k',
        oneLiner: 'Eine Ampel für einzelne Ausreißer-Punkte: Zeigt, ob ein einziger extremer Wert die LOO-Schätzung unzuverlässig macht.',
        everydayExample:
          'Wenn ein Milliardär in einer Kneipe sitzt, verfälscht er das Durchschnittsvermögen komplett – Pareto k schlägt genau bei solchen Punkten Alarm.',
        courseConnection:
          'Grenzwerte: unter 0,7 = alles grün · 0,7 bis 1,0 = Warnung · über 1,0 = unzuverlässig!',
      },
      {
        term: 'AIC & Deviance',
        oneLiner: 'Ein klassisches Punktesystem: bestraft Vorhersagefehler (Deviance) PLUS eine Strafgebühr für jede zusätzliche Variable (2 pro Parameter).',
        everydayExample:
          'Wie beim Eiskunstlauf mit Handicap: Ein unnötig kompliziertes Modell startet mit Strafpunkten und muss erst echten Mehrwert liefern.',
        courseConnection:
          'Kleinerer AIC = besser! Taucht in R vor allem in effectsize() bei logistischen Modellen auf.',
      },
    ],
    checks: [
      {
        id: 'b07-1',
        prompt:
          'In loo_compare hat Modell B einen Rückstand von elpd_diff = −3,2 bei einer Unsicherheit von se_diff = 4,1. Welches Modell wählst du, wenn Modell B viel einfacher ist?',
        options: [
          'Auf jeden Fall das komplexe Modell A, weil −3,2 negativ ist.',
          'Das einfachere Modell B – denn |−3,2| ist kleiner als 2 × 4,1 (= 8,2), der Unterschied ist also nicht eindeutig.',
          'Keines, weil se_diff immer 0 sein muss.',
          'Das Modell mit mehr Variablen gewinnt immer.',
        ],
        correctIndex: 1,
        explanation:
          'Genau nach der 2·SE-Regel: 3,2 < 8,2 → kein klarer Unterschied, also bevorzugen wir das einfachere, sparsamere Modell!',
      },
      {
        id: 'b07-2',
        prompt:
          'Wofür warnt ein hoher Pareto-k-Wert (> 0,7) beim LOO-Vergleich?',
        options: [
          'Dass zu wenige Zeilen im Datensatz sind.',
          'Dass einzelne stark einflussreiche Datenpunkte (Ausreißer) die LOO-Näherung unsicher machen.',
          'Dass das Modell perfekt ist.',
          'Dass du noch zentrieren musst.',
        ],
        correctIndex: 1,
        explanation:
          'Richtig! Unter 0,7 ist alles sauber; darüber beeinflussen einzelne Extrempunkte das Modell zu stark.',
      },
    ],
    targetJourneyStageIndex: 7,
    targetJourneyLabel: 'Etappe 08: LOO-Modellvergleich anwenden',
  },
  {
    id: 'm08-logistic',
    number: '08',
    shortTitle: 'Ja/Nein, Odds & Praxis',
    title: 'Ja/Nein-Vorhersagen, Wettquoten (Odds) & fiese Daten-Fallen',
    subtitle: 'Warum logistische Regression Odds statt Prozent nutzt – und was Cutoff, AUC und Data Leakage bedeuten.',
    duration: '7 Min.',
    everydayStory:
      'Manchmal willst du keine Zahl (wie Euro oder °C) vorhersagen, sondern ein klares JA oder NEIN: Besteht der Student die Prüfung? Ist das Bauteil defekt? Eine normale Gerade würde irgendwann über 100 % oder unter 0 % hinausschießen! Deshalb nutzt die logistische Regression einen cleveren Umweg über Wettquoten (Odds) und eine S-Kurve.',
    visualId: 'odds-translator',
    visualTitle: 'Interaktiver Übersetzer: Wahrscheinlichkeit (%) ↔ Odds ↔ Logit',
    visualHint:
      'Schiebe die Wahrscheinlichkeit hin und her und klicke „Odds verdoppeln (OR = 2)“ – so merkst du dir die größte Klausurfalle sofort!',
    terms: [
      {
        term: 'Odds (Chancenverhältnis)',
        oneLiner: 'Das Verhältnis „Treffer zu Niete“: p geteilt durch (1 − p) – genau wie bei Sportwetten („1 zu 4“).',
        everydayExample:
          'Bei 20 % Gewinnchance gewinnst du 1× und verlierst 4× → Odds = 1/4 = 0,25. Bei 50 % sind die Odds genau 1 zu 1 (= 1,0).',
        courseConnection:
          'Umrechnung: Odds = p / (1 − p) und zurück: p = Odds / (1 + Odds).',
      },
      {
        term: 'Logit (Logit-Skala)',
        oneLiner: 'Der Logarithmus der Odds. Er streckt den Bereich 0 % bis 100 % ins Unendliche (−∞ bis +∞), damit man wieder linear rechnen kann.',
        everydayExample:
          'Wie ein Übersetzer: Im Inneren rechnet das Modell bequem in Logits (Logit 0 = exakt 50 %) und übersetzt am Ende sauber zurück in Prozent.',
        courseConnection:
          'Die Koeffizienten β einer logistischen Regression stehen IMMER auf dieser Logit-Skala – nicht direkt in Prozent!',
      },
      {
        term: 'Odds-Ratio (OR = e^β)',
        oneLiner: 'Der Faktor, mit dem sich die ODDS multiplizieren, wenn eine Variable um +1 steigt.',
        everydayExample:
          'Verdoppelte Odds (OR = 2) machen aus 10 % Risiko etwa 18 % – aber aus 60 % Risiko NICHT 120 %, sondern 75 %!',
        courseConnection:
          'Nummer-1-Klausurfalle: OR = 4,1 bedeutet 4,1-fache ODDS, niemals 4,1-fache Wahrscheinlichkeit!',
      },
      {
        term: 'Cutoff, TPR, FPR & Precision',
        oneLiner: 'Ab wie viel Prozent Risiko schlägst du Alarm? Das ist der Cutoff. Ein strenger (niedriger) Cutoff erwischt mehr Defekte (hohe TPR), nervt aber mit mehr Fehlalarmen (hohe FPR).',
        everydayExample:
          'Wie der Metalldetektor am Flughafen: Stellst du ihn ultra-empfindlich ein, findest du jede Büroklammer (TPR hoch), aber jeder Zweite piept umsonst (FPR hoch).',
        courseConnection:
          'Precision = Trefferquote unter allen Alarmen. Accuracy allein täuscht bei seltenen Defekten massiv!',
      },
      {
        term: 'ROC, AUC, Brier-Score & Kalibrierung',
        oneLiner: 'AUC misst, wie gut das Modell „Defekt“ höher einstuft als „Gut“ (Rangfolge). Brier-Score & Kalibrierung prüfen, ob die Prozentzahlen selbst ehrlich stimmen.',
        everydayExample:
          'Ein Wetterbericht mit „immer 20 % statt 40 %“ sortiert Regentage zwar noch richtig (gute AUC), liegt aber bei den echten Prozenten daneben (schlecht kalibriert).',
        courseConnection:
          'AUC: 0,5 = Münzwurf · 0,8 = gut · 0,9 = sehr gut. Brier-Score: kleiner = besser (0 = perfekt).',
      },
      {
        term: 'Data Leakage & Separation',
        oneLiner: 'Data Leakage heißt: Eine Info aus der Zukunft (die man beim Vorhersagen noch gar nicht hat) schmuggelt sich ins Training – oft explodieren die Zahlen (Separation).',
        everydayExample:
          'Als würdest du beim Üben versehentlich schon die fertige Note aus dem Sekretariat als Eingabefeld mit ins Modell füttern – im Training 100 %, in echt nutzlos!',
        courseConnection:
          'Immer prüfen: „Ist diese Spalte zum Vorhersagezeitpunkt im echten Betrieb schon bekannt?“',
      },
      {
        term: 'Zeitlicher Split, Covariate Shift & Concept Drift',
        oneLiner: 'Trainiere auf der Vergangenheit, teste auf der Zukunft (Zeitlicher Split). Ändern sich später die Eingaben, ist es Covariate Shift; ändert sich der Zusammenhang selbst, ist es Concept Drift.',
        everydayExample:
          'Ein Immobilien-Modell von 2019 scheitert 2026: Erst steigen die Zinsen (neue Eingaben = Covariate Shift), dann bewerten Käufer Energieklassen ganz anders (neue Regeln = Concept Drift).',
        courseConnection:
          'Und Bonus-Spalte neg0 in info(df): zählt einfach, wie viele Werte ≤ 0 sind (bei 0/1-Variablen also die Anzahl der Nullen).',
      },
    ],
    checks: [
      {
        id: 'b08-1',
        prompt:
          'Ein Modell liefert eine Odds-Ratio von OR = 3,0 für Nachtschicht. Ein Kollege ruft: „In der Nachtschicht ist die Defekt-Wahrscheinlichkeit also 3× so hoch!“ Was antwortest du?',
        options: [
          'Stimmt genau, Odds und Wahrscheinlichkeit sind identisch.',
          'Vorsicht! OR = 3,0 bedeutet dreifache ODDS (Chancenverhältnis), NICHT automatisch dreifache Wahrscheinlichkeit – sonst käme man über 100 %!',
          'OR = 3,0 bedeutet, dass das Risiko sinkt.',
          'Odds gelten nur für lineare Regression.',
        ],
        correctIndex: 1,
        explanation:
          'Volltreffer! Wenn du dir diesen einen Satz merkst, entgehst du der häufigsten Falle in der gesamten Klausur.',
      },
      {
        id: 'b08-2',
        prompt:
          'Du willst vor dem Versand vorhersagen, ob ein Paket beschädigt ankommt. Im Datensatz gibt es die Spalte „Reklamation_eingegangen (ja/nein)“. Darf die als Eingabe ins Modell?',
        options: [
          'Ja, sie macht die AUC bestimmt fast 1,0!',
          'Auf keinen Fall – das ist klassisches Data Leakage, weil eine Reklamation erst NACH der Lieferung existiert.',
          'Nur wenn sie zentriert wird.',
          'Ja, solange kein Covariate Shift vorliegt.',
        ],
        correctIndex: 1,
        explanation:
          'Genau! Eine Information, die erst nach dem Ereignis entsteht, darf niemals als Eingabe für die Vorhersage genutzt werden.',
      },
    ],
    targetJourneyStageIndex: 8,
    targetJourneyLabel: 'Etappe 09 & 10: Logistische Regression & Praxis-Check',
  },
];
