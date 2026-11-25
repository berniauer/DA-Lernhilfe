export type GlossaryCategory =
  | 'Grundlagen & Bayes'
  | 'Lineare Regression'
  | 'Diagnose & MCMC'
  | 'Vorhersage & Entscheidung'
  | 'Kausalität & Effekte'
  | 'Interaktion & Vergleich'
  | 'Logistische Regression'
  | 'Daten & Betrieb';

export interface GlossaryEntry {
  id: string;
  term: string;
  aliases?: string[];
  category: GlossaryCategory;
  chapter: string;
  simple: string;
  formula?: string;
  trap?: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    id: 'prior',
    term: 'Prior',
    aliases: ['Priors', 'Schwach-informativer Prior'],
    category: 'Grundlagen & Bayes',
    chapter: 'Etappe 1',
    simple:
      'Dein Vorwissen über einen Wert, BEVOR du die neuen Daten gesehen hast – als Wahrscheinlichkeitsverteilung. In rstanarm nutzen wir schwach-informative Defaults, die absurde Werte ausschließen, das Ergebnis aber kaum verzerren.',
    formula: 'rstanarm-Default: normal(0, 2.5) auf z-Skala',
    trap: 'Priors dürfen nie nachträglich so gewählt werden, dass das Wunschergebnis herauskommt.',
  },
  {
    id: 'likelihood',
    term: 'Likelihood',
    category: 'Grundlagen & Bayes',
    chapter: 'Etappe 1',
    simple:
      'Misst, wie gut die tatsächlich beobachteten Daten zu einem bestimmten Parameterwert passen.',
    formula: 'p(Daten | Parameter)',
  },
  {
    id: 'posterior',
    term: 'Posterior',
    aliases: ['Posterior-Verteilung', 'Posterior-Samples'],
    category: 'Grundlagen & Bayes',
    chapter: 'Etappe 1',
    simple:
      'Das aktualisierte Wissen NACH den Daten. Verbindet Prior (Vorwissen) und Likelihood (Daten) zu einer ganzen Verteilung plausibler Werte statt nur einer einzelnen Zahl.',
    formula: 'Posterior ∝ Likelihood × Prior  |  p(Parameter | Daten)',
    trap: 'Nicht verwechseln mit dem p-Wert: Der Posterior sagt direkt, welche Parameterwerte plausibel sind.',
  },
  {
    id: 'basisrate',
    term: 'Basisrate',
    aliases: ['Prävalenz', 'Defektrate'],
    category: 'Grundlagen & Bayes',
    chapter: 'Etappe 1 & 9',
    simple:
      'Wie häufig ein Ereignis überhaupt vorkommt (z. B. nur 1 % der Wafer sind defekt). Ist die Basisrate sehr klein, sind selbst bei einem guten Test viele Alarme Fehlalarme.',
    trap: 'Wer die Basisrate ignoriert, überschätzt positive Testergebnisse massiv („Base-Rate Fallacy“).',
  },
  {
    id: 'satz-von-bayes',
    term: 'Satz von Bayes',
    aliases: ['Bayes'],
    category: 'Grundlagen & Bayes',
    chapter: 'Etappe 1',
    simple:
      'Rechenregel, mit der wir eine bedingte Wahrscheinlichkeit umdrehen – z. B. von „Wie oft schlägt der Test bei Defekt an?“ zu „Wie wahrscheinlich ist ein Defekt, wenn der Test piept?“.',
    formula: 'p(A | B) = p(B | A) · p(A) / p(B)',
  },
  {
    id: 'z-transformation',
    term: 'z-Transformation',
    aliases: ['z-Skala'],
    category: 'Grundlagen & Bayes',
    chapter: 'Etappe 1 & 6',
    simple:
      'Zieht den Mittelwert ab und teilt durch die Standardabweichung. Danach hat jede Variable Mittelwert 0 und SD 1 – so lassen sich Äpfel (°C) und Birnen (Sekunden) vergleichen.',
    formula: 'z = (x − Mittelwert) / SD',
  },
  {
    id: 'zentrieren',
    term: 'Zentrieren',
    aliases: ['zentriert', 'Referenzpunkt'],
    category: 'Lineare Regression',
    chapter: 'Etappe 2 & 7',
    simple:
      'Man zieht einen sinnvollen Referenzwert ab (z. B. temp - 20 statt temp). Dadurch beschreibt der Intercept keinen absurden 0-Wert mehr, sondern einen realen Vergleichsfall.',
    formula: 'x_zentriert = x − Referenzwert',
    trap: 'Vorhersagen und R² ändern sich durch Zentrieren NICHT – nur der Intercept (und bei Interaktionen die Haupteffekte).',
  },
  {
    id: 'basisfall',
    term: 'Basisfall',
    category: 'Lineare Regression',
    chapter: 'Etappe 2',
    simple:
      'Die genaue Situation, die der Intercept beschreibt: Alle Zahlen-Variablen stehen auf 0 (bzw. ihrem Zentrierwert) und alle Kategorien stehen auf ihrer Referenzgruppe.',
    trap: 'In der Klausur immer prüfen, ob x = 0 überhaupt realistisch ist (z. B. 0 °C, 0 mTorr -> nicht sinnvoll!).',
  },
  {
    id: 'intercept',
    term: 'Intercept',
    aliases: ['(Intercept)'],
    category: 'Lineare Regression',
    chapter: 'Etappe 2',
    simple:
      'Der Startwert (Achsenabschnitt) des Modells: die vorhergesagte Zielgröße (bzw. Logit) genau im Basisfall.',
  },
  {
    id: 'referenzgruppe',
    term: 'Referenzgruppe',
    category: 'Lineare Regression',
    chapter: 'Etappe 2',
    simple:
      'Die erste Kategorie eines Faktors (meist alphabetisch, z. B. Maschine M1 oder Tagschicht). Sie bekommt keine eigene Zeile in info() – alle anderen Gruppen werden mit ihr verglichen.',
    formula: 'In R ändern mit: relevel(x, ref = "...")',
  },
  {
    id: 'mad-sd',
    term: 'MAD_SD',
    aliases: ['mad'],
    category: 'Lineare Regression',
    chapter: 'Etappe 2',
    simple:
      'Robuste Streuung der Posterior-Verteilung eines Koeffizienten. Zeigt dir wie ein Standardfehler, wie unsicher die Schätzung dieses Koeffizienten noch ist.',
  },
  {
    id: 'hdi',
    term: 'HDI',
    aliases: ['95%-HDI', '95 %-HDI', 'lwr', 'upr'],
    category: 'Lineare Regression',
    chapter: 'Etappe 2',
    simple:
      'Highest Density Interval: der kürzeste Bereich (von lwr bis upr), in dem der wahre Parameterwert laut Modell mit 95 % Wahrscheinlichkeit liegt.',
    formula: 'In R: hdi(x)  |  Spalten lwr / upr in info()',
    trap: 'Enthält das 95%-HDI die 0 (z. B. [−0.27; 0.40]), ist der Unterschied nicht eindeutig von 0 trennbar!',
  },
  {
    id: 'sigma',
    term: 'sigma',
    aliases: ['σ'],
    category: 'Lineare Regression',
    chapter: 'Etappe 2 & 4',
    simple:
      'Typische Abweichung (Standardabweichung) einzelner echter Beobachtungen von der Regressionslinie. Etwa 95 % der Einzelfälle liegen innerhalb von ±2·sigma um die Vorhersage.',
    trap: 'sigma verschwindet auch mit Millionen Daten nicht – es beschreibt die Reststreuung der Welt.',
  },
  {
    id: 'bayes-r2',
    term: 'Bayes-R²',
    aliases: ['bayes_R2', 'R²'],
    category: 'Lineare Regression',
    chapter: 'Etappe 2 & 6',
    simple:
      'Welcher Anteil der gesamten Streuung der Zielgröße vom Modell erklärt wird (0 = gar nichts, 1 = perfekt). In Bayes wird R² für jedes der 4000 Samples berechnet.',
    trap: 'Allein nach R² zu wählen führt zu Overfitting, weil R² mit jeder zusätzlichen Variable steigt.',
  },
  {
    id: 'extrapolation',
    term: 'Extrapolation',
    category: 'Lineare Regression',
    chapter: 'Etappe 2 & 10',
    simple:
      'Eine Vorhersage außerhalb des Bereichs, in dem Trainingsdaten lagen (z. B. −20 °C, obwohl Daten nur bis −12 °C gingen). Dort muss der Zusammenhang nicht mehr gelten.',
  },
  {
    id: 'mcmc',
    term: 'MCMC',
    aliases: ['Chains', 'Chain'],
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Markov Chain Monte Carlo: Das Rechenverfahren, mit dem stan_glm standardmäßig 4 unabhängige Ketten (Chains) à 1000 Schritte laufen lässt, um 4000 Posterior-Samples zu erzeugen.',
    formula: 'Default: 4 Chains × 1000 Samples = 4000 Samples',
  },
  {
    id: 'rhat',
    term: 'Rhat',
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Prüft, ob sich alle 4 MCMC-Chains auf denselben Bereich geeinigt haben. Ist Rhat ≈ 1, lief die Berechnung sauber. Über 1.1 heißt: Alarm – die Ketten widersprechen sich!',
    formula: 'Gut: ≈ 1.00  |  Problematisch: > 1.10',
    trap: 'Ein gutes Rhat beweist nur, dass der Computer sauber gerechnet hat – NICHT, dass das Modell inhaltlich richtig ist!',
  },
  {
    id: 'n-eff',
    term: 'n_eff',
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Effektive Stichprobengröße der gezogenen Posterior-Samples (wie viele wirklich unabhängige Ziehungen dahinterstecken).',
    formula: 'Gut: > 2000  |  Warnung: < 400',
  },
  {
    id: 'mcse',
    term: 'mcse',
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Monte-Carlo-Standardfehler: die rein numerische Rechenungenauigkeit durch das Sampling. Sollte winzig sein (< 5 % von mad).',
    formula: 'Ziel: mcse < 0.05 · mad',
    trap: 'Mehr Samples (z. B. 40 000 statt 4 000) verkleinern nur den mcse – sie ersetzen keine neuen Daten!',
  },
  {
    id: 'mean-ppd',
    term: 'mean_PPD',
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Durchschnitt der vom Modell simulierten Daten (Posterior Predictive Distribution). Sollte fast genau dem echten Mittelwert deiner Zielgröße y entsprechen.',
  },
  {
    id: 'ppc',
    term: 'PPC',
    aliases: ['Posterior Predictive Check', 'diagnose_density', 'diagnose_fit'],
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Simuliert künstliche Datensätze aus deinem fertigen Modell und legt sie über die echten Daten. Sehen die Kurven gleich aus, kann dein Modell die Realität nachbilden.',
  },
  {
    id: 'residuum',
    term: 'Residuum',
    aliases: ['Residuen', 'diagnose_residual'],
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Der Fehler pro Datenpunkt: echter Wert minus vorhergesagter Wert (y − ŷ). Gute Residuen streuen wie eine zufällige Wolke gleichmäßig um 0.',
    formula: 'e = y − ŷ',
    trap: 'Siehst du eine „Banane“ (U-Form) in den Residuen, fehlt eine Nichtlinearität (z. B. ein quadratischer Term)!',
  },
  {
    id: 'heteroskedastizitaet',
    term: 'Heteroskedastizität',
    aliases: ['Trichter'],
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3',
    simple:
      'Die Streuung der Fehler bleibt nicht gleich, sondern wächst trichterförmig an. Folge: Die konstante Streuung sigma passt nicht überall – Vorhersageintervalle sind teils zu eng oder zu breit.',
  },
  {
    id: 'overfitting',
    term: 'Overfitting',
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3 & 8',
    simple:
      'Das Modell lernt den Zufall der Trainingsdaten auswendig. Auf Trainingsdaten glänzt es, aber auf neuen Testdaten bricht die Leistung stark ein.',
  },
  {
    id: 'rmse',
    term: 'RMSE',
    aliases: ['MAE'],
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3 & 8',
    simple:
      'Root Mean Squared Error: typischer Vorhersagefehler in der Originaleinheit von y (z. B. kWh). Große Ausreißer fallen beim RMSE stärker ins Gewicht als beim MAE (mittlerer absoluter Fehler).',
  },
  {
    id: 'skill',
    term: 'Skill',
    aliases: ['Brier-Skill'],
    category: 'Diagnose & MCMC',
    chapter: 'Etappe 3 & 9',
    simple:
      'Vergleicht den Fehler deines Modells mit einem dummen Nullmodell (das immer nur den Durchschnitt rät). 0 = nicht besser als Raten, 1 = perfekt, negativ = schlechter als Raten.',
    formula: 'Skill = 1 − Fehler_Modell / Fehler_Nullmodell',
  },
  {
    id: 'posterior-epred',
    term: 'posterior_epred',
    aliases: ['epred'],
    category: 'Vorhersage & Entscheidung',
    chapter: 'Etappe 4',
    simple:
      'Liefert 4000 Samples für den MITTELWERT vergleichbarer Fälle (enthält nur die Unsicherheit der Koeffizienten). Bei logistischer Regression liefert es Wahrscheinlichkeiten p.',
    trap: 'Für einen einzelnen Kunden/Tag ist epred zu schmal – dort brauchst du posterior_predict!',
  },
  {
    id: 'posterior-predict',
    term: 'posterior_predict',
    category: 'Vorhersage & Entscheidung',
    chapter: 'Etappe 4',
    simple:
      'Liefert 4000 Samples für EINE einzelne neue Beobachtung. Enthält Koeffizienten-Unsicherheit PLUS den unvermeidbaren Zufallsfehler ε (sigma) – deshalb deutlich breiter als epred.',
    trap: 'Antwortet auf „Was passiert bei DIESEM konkreten Haus/Wafer?“ (bei logistisch: simulierte 0/1-Werte).',
  },
  {
    id: 'kostenquantil',
    term: 'Kostenquantil',
    aliases: ['Optimales Quantil'],
    category: 'Vorhersage & Entscheidung',
    chapter: 'Etappe 4',
    simple:
      'Wenn Unterschätzen teurer ist als Überschätzen (z. B. Strom nachkaufen 3× teurer), bestellst du nicht den Median (50 %), sondern das kostenoptimale Quantil der predict-Verteilung.',
    formula: 'q* = c_unter / (c_unter + c_über)  |  z. B. 3 / (3 + 1) = 75 %',
  },
  {
    id: 'simpsons-paradox',
    term: 'Simpsons Paradox',
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 5',
    simple:
      'Ein Trend in jeder einzelnen Untergruppe dreht sich im Gesamtdurchschnitt komplett um, weil die Gruppen unterschiedlich zusammengesetzt sind.',
    trap: 'Roh-Mittelwerte niemals blind glauben – immer prüfen, ob eine Hintergrundvariable die Gruppen mischt!',
  },
  {
    id: 'confounder',
    term: 'Confounder',
    aliases: ['Störgröße', 'Omitted Variable Bias'],
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 5',
    simple:
      'Eine gemeinsame Ursache, die sowohl X als auch Y beeinflusst (X ← C → Y). Fehlt sie im Modell, verzerrt sie den Effekt von X (Omitted Variable Bias). Lösung: ins Modell aufnehmen (kontrollieren)!',
  },
  {
    id: 'mediator',
    term: 'Mediator',
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 5',
    simple:
      'Liegt mitten auf dem Wirkungsweg zwischen X und Y (X → M → Y, z. B. Kurs → erlerntes Wissen → Note). Willst du die Gesamtwirkung von X messen, darfst du den Mediator NICHT kontrollieren.',
  },
  {
    id: 'collider',
    term: 'Collider',
    aliases: ['Collider-Bias'],
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 5',
    simple:
      'Eine Variable, die von X UND Y beeinflusst wird (X → C ← Y). Wenn du auf einen Collider filterst oder ihn ins Modell aufnimmst, erzeugst du künstliche Scheinzusammenhänge!',
    trap: 'Finger weg vom Collider: weder danach filtern noch als Kontrollvariable aufnehmen.',
  },
  {
    id: 'assoziation',
    term: 'Assoziation',
    aliases: ['Kausalität', 'Intervention'],
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 5',
    simple:
      'Beobachtungsdaten zeigen nur Unterschiede zwischen Gruppen (Assoziation), nicht was passiert, wenn man aktiv an einer Schraube dreht (Intervention/Kausalität). Dafür bräuchte es ein randomisiertes Experiment.',
    trap: 'In der Klausur IMMER betonen: „Beobachtungsdaten erlauben keine kausale Aussage.“',
  },
  {
    id: 'f2',
    term: 'f²',
    aliases: ['Cohens f²', 'Effektgröße'],
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 6',
    simple:
      'Misst, welchen Anteil der NOCH UNERKLÄRTEN Varianz eine Variable zusätzlich erklärt, wenn man sie ins Modell aufnimmt.',
    formula: 'f² = (R²_mit − R²_ohne) / (1 − R²_mit)  |  0.02 klein · 0.15 mittel · 0.35 groß',
    trap: 'f² = 0.057 heißt NICHT „erklärt 5.7 % der Gesamtvarianz“, sondern 5.7 % der Restvarianz!',
  },
  {
    id: 'cohens-d',
    term: 'Cohens d',
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 6',
    simple:
      'Mittelwertsunterschied zwischen zwei Gruppen geteilt durch die Standardabweichung – ein einheitenfreies Maß für die praktische Größe eines Unterschieds.',
    formula: 'Richtwerte: 0.2 klein · 0.5 mittel · 0.8 groß',
  },
  {
    id: 'effectsize',
    term: 'effectsize()',
    aliases: ['effectsize', 'Df'],
    category: 'Kausalität & Effekte',
    chapter: 'Etappe 6',
    simple:
      'daatools-Funktion, die jede Variable einmal komplett aus dem Modell entfernt (inkl. ihrer Interaktionen/Quadrate -> Spalte Df) und prüft, wie stark f² oder AIC sich verschlechtert.',
    trap: 'Bei logistischen Modellen zeigt effectsize() kein f², sondern Deviance und AIC: Je stärker der AIC ohne Variable steigt, desto wichtiger ist sie.',
  },
  {
    id: 'interaktion',
    term: 'Interaktion',
    aliases: ['Interaktionsterm', 'Interaktionen'],
    category: 'Interaktion & Vergleich',
    chapter: 'Etappe 7',
    simple:
      'Die Wirkung (Steigung) einer Variable hängt vom Wert einer anderen Variable ab – die Geraden der Gruppen laufen nicht mehr parallel, sondern unterschiedlich steil.',
    formula: 'Steigung in Gruppe G = β_x + β_x:G  |  Unterschied bei x = c: β_G + β_x:G · c',
    trap: 'Bei einer Interaktion gilt der Haupteffekt von G NUR genau am Referenzpunkt x = 0 – nie als Gesamteffekt lesen!',
  },
  {
    id: 'scheitelpunkt',
    term: 'Scheitelpunkt',
    aliases: ['quadratischer Term', 'U-Form'],
    category: 'Interaktion & Vergleich',
    chapter: 'Etappe 7',
    simple:
      'Wenn hohe UND niedrige Werte schlecht sind (U-Form, z. B. zu kalt oder zu heiß), ergänzt man (x − Ziel)². Der Scheitelpunkt x* ist der optimale Wert mit dem Minimum.',
    formula: 'x* = c − β₁ / (2 · β₂)',
  },
  {
    id: 'loo',
    term: 'LOO',
    aliases: ['loo_compare', 'elpd', 'elpd_diff', 'se_diff', 'looic'],
    category: 'Interaktion & Vergleich',
    chapter: 'Etappe 8',
    simple:
      'Leave-One-Out-Kreuzvalidierung: schätzt geschickt aus den Posterior-Samples, wie gut das Modell einzelne weggelassene Datenpunkte vorhersagt (elpd: größer = besser).',
    formula: '|elpd_diff| > 2 · se_diff → klarer Modellunterschied  |  looic = −2 · elpd',
    trap: 'LOO darf nur Modelle mit EXAKT denselben Datenzeilen und derselben y-Skala vergleichen (nie y gegen log(y)!).',
  },
  {
    id: 'pareto-k',
    term: 'Pareto k',
    category: 'Interaktion & Vergleich',
    chapter: 'Etappe 8',
    simple:
      'Qualitätsampel für die LOO-Näherung pro Datenpunkt. Zeigt an, ob einzelne extreme Punkte das Modell zu stark verbiegen.',
    formula: '< 0.7 ok  |  0.7–1.0 problematisch  |  > 1.0 unzuverlässig',
  },
  {
    id: 'aic',
    term: 'AIC',
    aliases: ['Deviance'],
    category: 'Interaktion & Vergleich',
    chapter: 'Etappe 6 & 8',
    simple:
      'Akaike-Informationskriterium: bestraft Modellabweichung (Deviance) plus Komplexität (2 · Parameterzahl). Kleiner = besser. In effectsize() zeigt der AIC-Anstieg die Wichtigkeit.',
    formula: 'AIC = Deviance + 2·k  |  ΔAIC / 2 ≈ Δelpd',
  },
  {
    id: 'odds',
    term: 'Odds',
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'Das Chancenverhältnis „Treffer zu Niete“: p geteilt durch (1 − p). Bei 20 % Wahrscheinlichkeit sind die Odds 0.2 / 0.8 = 0.25 (also 1 zu 4).',
    formula: 'Odds = p / (1 − p)  |  p = Odds / (1 + Odds)',
  },
  {
    id: 'logit',
    term: 'Logit',
    aliases: ['Logit-Skala'],
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'Der natürliche Logarithmus der Odds. Streckt Wahrscheinlichkeiten (0 bis 1) auf die volle Zahlengerade (−∞ bis +∞), damit man linear rechnen kann. Logit 0 entspricht genau p = 50 %.',
    formula: 'logit = ln(p / (1 − p))  |  p = 1 / (1 + e^−logit)',
  },
  {
    id: 'odds-ratio',
    term: 'Odds-Ratio',
    aliases: ['OR'],
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'e^β: Der Faktor, mit dem sich die ODDS bei +1 Einheit x multiplizieren (bei sonst gleichen Werten). OR = 1 bedeutet kein Effekt, > 1 höheres Risiko, < 1 geringeres Risiko.',
    formula: 'OR = e^β  |  Faustregel: max. Δp ≈ β / 4 (bei p ≈ 0.5)',
    trap: 'HÄUFIGSTE KLAUSURFALLE: OR = 4.1 heißt 4.1-fache ODDS, NICHT 4.1-fache Wahrscheinlichkeit!',
  },
  {
    id: 'brier-score',
    term: 'Brier-Score',
    aliases: ['Brier', 'LogLoss'],
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'Mittlerer quadrierter Fehler von Wahrscheinlichkeitsprognosen (0 = perfekt). Misst sowohl Trennschärfe als auch Kalibrierung. LogLoss bestraft zusätzlich extrem sichere Fehlprognosen hart.',
    formula: 'Brier = mean((y − p)²)  |  Brier_Null = p̄ · (1 − p̄)',
  },
  {
    id: 'auc',
    term: 'AUC',
    aliases: ['ROC', 'ROC-Kurve'],
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'Fläche unter der ROC-Kurve: Wahrscheinlichkeit, dass ein zufälliges defektes Teil ein höheres vorhergesagtes Risiko bekommt als ein zufälliges gutes Teil. 0.5 = Münzwurf, 1.0 = perfekt.',
    formula: '0.5 Zufall · 0.7 ok · 0.8 gut · 0.9 sehr gut',
    trap: 'AUC prüft nur die Rangfolge! Wenn ein Modell alle Wahrscheinlichkeiten halbiert, bleibt AUC gleich, aber der Brier-Score wird schlecht.',
  },
  {
    id: 'cutoff',
    term: 'Cutoff',
    aliases: ['Schwellenwert', 'plotlogrates'],
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'Die Grenze für die Wahrscheinlichkeit p, ab der wir „Alarm / Defekt“ auslösen. Niedriger Cutoff findet mehr Defekte (hohe TPR), erzeugt aber auch mehr Fehlalarme (hohe FPR).',
    formula: 'Kostenoptimal (kalibriert): p > c_FP / (c_FP + c_FN)',
    trap: 'plotlogrates(m2) ohne newdata nutzt Trainingsdaten! Für Entscheidungen immer newdata = df_test angeben.',
  },
  {
    id: 'tpr',
    term: 'TPR',
    aliases: ['Sensitivität', 'Recall', 'FNR', 'FPR', 'Precision', 'Accuracy'],
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'True Positive Rate (Sensitivität): Anteil der echten Defekte, die unser Modell findet. Gegenstück: FNR (übersehene Defekte = 1 − TPR). FPR: Anteil guter Teile mit Fehlalarm. Precision: Trefferquote unter allen Alarmen.',
    formula: 'TPR = TP/(TP+FN) · FPR = FP/(FP+TN) · Precision = TP/(TP+FP)',
    trap: 'Bei 25 % Defekten hat das dumme Modell „immer 0“ schon 75 % Accuracy – Accuracy allein ist irreführend!',
  },
  {
    id: 'kalibrierung',
    term: 'Kalibrierung',
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'Stimmen die vorhergesagten Prozentzahlen mit der Realität überein? Wenn das Modell 30 % Defekt vorhersagt, sollten auch rund 30 % dieser Teile wirklich defekt sein.',
    trap: 'Ohne gute Kalibrierung (z. B. nach Oversampling) funktioniert die Kosten-Cutoff-Formel nicht!',
  },
  {
    id: 'separation',
    term: 'Separation',
    category: 'Logistische Regression',
    chapter: 'Etappe 9',
    simple:
      'Eine Variable trennt 0 und 1 (fast) perfekt -> Koeffizienten explodieren. Oft ein deutlicher Warnhinweis auf Data Leakage!',
  },
  {
    id: 'data-leakage',
    term: 'Data Leakage',
    aliases: ['Leakage'],
    category: 'Daten & Betrieb',
    chapter: 'Etappe 10',
    simple:
      'Information rutscht ins Modell, die im echten Betrieb zum Vorhersagezeitpunkt noch gar nicht bekannt ist (z. B. ein Wert, der erst nach der Qualitätsprüfung entsteht, oder Skalierung vor dem Split).',
    trap: 'Erzeugt traumhafte Testwerte, die im Live-Betrieb komplett zusammenbrechen.',
  },
  {
    id: 'split',
    term: 'Zeitlicher Split',
    aliases: ['Gruppierter Split', 'Leave-one-machine-out', 'Train/Test-Split'],
    category: 'Daten & Betrieb',
    chapter: 'Etappe 10',
    simple:
      'Aufteilung in Trainings- und Testdaten passend zum echten Einsatz: Früher trainieren, später testen (Zeitlicher Split) oder ganze Anlagen zurückhalten (Gruppierter Split).',
    trap: 'Ein zufälliger Split mischt ähnliche Produktionsstunden in Train & Test und macht die Bewertung zu optimistisch.',
  },
  {
    id: 'covariate-shift',
    term: 'Covariate Shift',
    category: 'Daten & Betrieb',
    chapter: 'Etappe 10',
    simple:
      'Die Verteilung der Eingangsgrößen X verändert sich im Betrieb (z. B. höherer Druck nach Neukalibrierung), wodurch das Modell in dünn besetzte Bereiche extrapoliert.',
  },
  {
    id: 'concept-drift',
    term: 'Concept Drift',
    category: 'Daten & Betrieb',
    chapter: 'Etappe 10',
    simple:
      'Der eigentliche Zusammenhang zwischen Eingangsgrößen X und Defektrisiko Y verändert sich über die Zeit (z. B. durch Verschleiß oder neue Materialien).',
    trap: 'Selbst wenn die gesamte Defektrate gleich bleibt, kann Concept Drift das Modell längst unbrauchbar gemacht haben!',
  },
  {
    id: 'neg0',
    term: 'neg0',
    category: 'Daten & Betrieb',
    chapter: 'Etappe 2 & 10',
    simple:
      'Spalte in info(df): zählt, wie viele Werte ≤ 0 sind. Bei 0/1-Variablen (wie defect oder smart) ist neg0 einfach die Anzahl der Nullen; bei Temperatur sind es Frosttage.',
  },
];

export interface TextSegment {
  type: 'text' | 'term';
  content: string;
  entry?: GlossaryEntry;
}

interface MatchRule {
  pattern: string;
  entry: GlossaryEntry;
}

const MATCH_RULES: MatchRule[] = [];
for (const entry of GLOSSARY_ENTRIES) {
  const candidates = [entry.term, ...(entry.aliases ?? [])];
  for (const label of candidates) {
    if (label.trim().length >= 2) {
      MATCH_RULES.push({ pattern: label, entry });
    }
  }
}

// Sort longest pattern first so "posterior_predict" matches before "Posterior" and "Odds-Ratio" before "Odds".
MATCH_RULES.sort((a, b) => b.pattern.length - a.pattern.length);

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const LOOKUP_BY_LOWER = new Map<string, GlossaryEntry>();
for (const rule of MATCH_RULES) {
  const key = rule.pattern.toLowerCase();
  if (!LOOKUP_BY_LOWER.has(key)) {
    LOOKUP_BY_LOWER.set(key, rule.entry);
  }
}

const COMBINED_REGEX = new RegExp(
  `(?<![\\p{L}\\p{N}_])(${MATCH_RULES.map((r) => escapeRegex(r.pattern)).join('|')})(?![\\p{L}\\p{N}_])`,
  'giu'
);

/**
 * Splits prose into plain text and matched glossary terms for automatic hover tooltips.
 * Avoids matching substrings inside unrelated German words (e.g. "oder" vs "OR").
 */
export function tokenizeWithGlossary(text: string): TextSegment[] {
  if (!text) return [];
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  COMBINED_REGEX.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = COMBINED_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    const start = match.index;
    const entry = LOOKUP_BY_LOWER.get(matchedText.toLowerCase());

    // Guard short uppercase acronyms like "OR" so lowercase words don't falsely trigger
    if (!entry) continue;
    if (matchedText.length <= 2 && matchedText !== matchedText.toUpperCase() && matchedText !== 'f²') {
      continue;
    }

    if (start > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, start) });
    }
    segments.push({ type: 'term', content: matchedText, entry });
    lastIndex = start + matchedText.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

export function findGlossaryEntry(idOrTerm: string): GlossaryEntry | undefined {
  const lower = idOrTerm.toLowerCase();
  return (
    GLOSSARY_ENTRIES.find((e) => e.id === lower) ??
    LOOKUP_BY_LOWER.get(lower)
  );
}
