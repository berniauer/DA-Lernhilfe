# Glossar Datenanalyse (A–Z)

> Kurzdefinitionen aller Klausurbegriffe. 🔗 = Kapitel mit Details.

| Begriff | Bedeutung | 🔗 |
|---|---|---|
| **AIC** | Akaike-Informationskriterium = Deviance + 2·Parameter; kleiner = besser; in `effectsize` (logistisch) als ΔAIC beim Weglassen | 6, 8 |
| **Accuracy** | Anteil richtiger Klassifikationen; bei unausgeglichenen Klassen irreführend | 9 |
| **Assoziation** | statistischer Zusammenhang ohne Kausalaussage | 5 |
| **AUC** | Fläche unter der ROC-Kurve; P(zufälliger Positiver bekommt höheres p als zufälliger Negativer); 0.5 = Zufall | 9 |
| **Basisfall** | Situation, die der Intercept beschreibt: alle metrischen = 0, alle Faktoren auf Referenz | 2 |
| **Basisrate** | Grundhäufigkeit eines Ereignisses (Prävalenz, Defektrate) | 1, 9 |
| **Bayes-R²** | Anteil erklärter Varianz, als Posterior-Verteilung berechnet | 2 |
| **Brier-Score** | mean((y − p)²) für Wahrscheinlichkeitsprognosen; 0 perfekt | 9 |
| **Chain** | eine MCMC-Kette; Default 4 Chains | 3 |
| **Cohens d** | standardisierter Mittelwertsunterschied; 0.2/0.5/0.8 | 6 |
| **Collider** | wird von X und Y beeinflusst; Selektion darauf erzeugt Scheinzusammenhänge | 5 |
| **Concept Drift** | Zusammenhang X → y ändert sich über die Zeit | 10 |
| **Confounder** | Störgröße, beeinflusst X und Y | 5 |
| **Covariate Shift** | Verteilung der Prädiktoren ändert sich | 10 |
| **Cutoff** | Schwellenwert für p, ab dem „1“ vorhergesagt wird | 9 |
| **Deviance** | −2·log-Likelihood; Maß für Abweichung Modell ↔ Daten | 6 |
| **elpd** | expected log pointwise predictive density (LOO); größer = besser | 8 |
| **epred** | `posterior_epred`: Samples des Erwartungswerts (Mittel) | 4 |
| **Extrapolation** | Aussage außerhalb des Datenbereichs | 2 |
| **f²** | Effektgröße (R²_mit − R²_ohne)/(1 − R²_mit); 0.02/0.15/0.35 | 6 |
| **FNR / FPR** | Anteil übersehener Positiver / fälschlich markierter Negativer | 9 |
| **HDI** | Highest Density Interval, kürzestes Intervall mit 95 % Posterior-Masse | 2 |
| **Heteroskedastizität** | nicht konstante Residuenstreuung (Trichter) | 3 |
| **Hinkley-Test** | prüft die Link-Funktion des logistischen Modells (Nichtlinearität) | 9 |
| **Interaktion** | Wirkung einer Variable hängt von einer anderen ab | 7 |
| **Intercept** | Achsenabschnitt = Vorhersage im Basisfall | 2 |
| **Kalibrierung** | vorhergesagte Wahrscheinlichkeiten = beobachtete Raten | 9 |
| **Leakage** | Information im Modell, die zum Vorhersagezeitpunkt nicht verfügbar ist | 9, 10 |
| **Likelihood** | p(Daten \| Parameter) | 1 |
| **Logit** | log(p/(1 − p)) | 9 |
| **LogLoss** | mittlere negative log-Likelihood der Prognosen; bestraft sichere Fehler stark | 9 |
| **LOO** | Leave-One-Out-Kreuzvalidierung (PSIS-Approximation) | 8 |
| **MAD_SD** | robuste Streuung der Posterior ≈ Standardfehler | 2 |
| **MAE** | mittlerer absoluter Fehler | 3 |
| **MCMC** | Markov Chain Monte Carlo: Verfahren zum Ziehen von Posterior-Samples | 3 |
| **mcse** | Monte-Carlo-Standardfehler (Rechenungenauigkeit), < 5 % von mad | 3 |
| **mean_PPD** | Mittel der posterior-predictive Daten; ≈ mean(y) | 3 |
| **Mediator** | liegt auf dem Wirkungspfad X → M → Y | 5 |
| **n_eff** | effektive Samplegröße; > 2000 gut, < 400 schlecht | 3 |
| **neg0** | (info) Anzahl Werte ≤ 0 | 10 |
| **Odds** | p/(1 − p) | 9 |
| **Odds-Ratio** | e^β: Faktor der Odds pro Einheit x | 9 |
| **Omitted Variable Bias** | Verzerrung durch fehlende relevante Variable | 5 |
| **Overfitting** | Modell lernt Zufall der Trainingsdaten; Test viel schlechter | 3, 8 |
| **Pareto k** | LOO-Diagnose je Beobachtung; < 0.7 ok, > 1 schlecht | 8 |
| **Posterior** | p(Parameter \| Daten) | 1 |
| **posterior_predict** | Samples einzelner neuer Beobachtungen (inkl. ε) | 4 |
| **PPC** | Posterior Predictive Check (diagnose_density/fit) | 3 |
| **Precision** | TP/(TP + FP) | 9 |
| **Prior** | Verteilung über Parameter vor den Daten | 1 |
| **Referenzgruppe** | erstes Faktorlevel, im Intercept enthalten | 2 |
| **Residuum** | y − ŷ | 3 |
| **Rhat** | Konvergenzdiagnose; ≈ 1 gut, > 1.1 schlecht | 3 |
| **RMSE** | Wurzel des mittleren quadrierten Fehlers | 3 |
| **ROC** | TPR gegen FPR für alle Cutoffs | 9 |
| **Separation** | Prädiktor trennt 0/1 perfekt → extreme Koeffizienten | 9 |
| **sigma (σ)** | SD der Residuen | 2 |
| **Simpsons Paradox** | Zusammenhang kehrt sich bei Aggregation um | 5 |
| **Skill** | 1 − Fehler_Modell/Fehler_Nullmodell | 3, 9 |
| **TPR (Sensitivität, Recall)** | TP/(TP + FN) | 9 |
| **Zentrieren** | Referenzwert abziehen, damit der Basisfall sinnvoll ist | 2, 7 |
| **z-Transformation** | (x − Mittelwert)/SD | 0 |
