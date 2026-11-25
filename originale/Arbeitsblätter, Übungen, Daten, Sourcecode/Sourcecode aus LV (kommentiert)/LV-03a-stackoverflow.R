library(dplyr)
library(daatools)
library(rstanarm)

# Datensatz laden
df = read.csv('daten/StackOverflow-survey.csv', stringsAsFactors = TRUE)

# Erster Überblick
info(df)
hist(df$Salary)

# Unwahrscheinliche Gehälter ausfiltern (willkürliche Grenze)
df2 = df |> filter(Salary > 6543)

# Erstes Modell
m1 = stan_glm(Salary ~ TabSpaces + LearningNewTech, data=df2)
m1

levels(df2$LearningNewTech)
levels(df2$TabSpaces)

# Basisfall: 62700 USD (Referenzgruppen Both und Agree)
plothist(m1, '(Intercept)')
# Im Vgl. zu Both verdient man im Schnitt 11800 USD mehr
plothist(m1, 'TabSpacesSpaces')
# Im Vergleich zu Both verdient man mit Tabs um 2300 USD weniger.
# Allerdings ist (im 95%-Niveau) die Aussage auch konsistent mit mehr Verdienst. 
# (Intervall schließt null mit ein.)
plothist(m1, 'TabSpacesTabs', compVal = 0)

# "Strongly disagree" hat breites Intervall, ...
plotcoef(m1)
# ... da nur wenige Datenpunkte in diese Gruppe fallen
table(df2$LearningNewTech)

# Sampling ok
check_sampling(m1)
# Kein guter Fit
diagnose_density(m1)
# Zudem negative Gehälter möglich
diagnose_fit(m1)

# Logarithmisch transformieren
df2$Salary_log = log(df2$Salary)
hist(df2$Salary)
hist(df2$Salary_log)

# Neues Modell
m2 = stan_glm(Salary_log ~ TabSpaces + LearningNewTech, data=df2)
print(m2, digits=3)

# Rückrechnen von log(Gehalt) auf Gehalt:
exp(10.85) # 51,500 USD
exp(0.21)  # 1.23
51500 * 1.23  # 63,345 USD .... +23%

# Interpretation also nach exp() und als multiplikativer Faktor verstehen
round(exp(coef(m2)), 2)

# Fit besser, aber noch nicht berauschend
diagnose_density(m2)
diagnose_fit(m2)

# Einige weitere Variablen mit aufnehmen
m3 = stan_glm(
  Salary_log ~ TabSpaces + LearningNewTech + Country + CompanySize,
  data=df2)

check_sampling(m3) # Länderkoeff. mit Vorsicht genießen (kleines n_eff)

# Sieht besser wie m2 aus, aber auch hier werden vor allem die Ränder nicht 
# so gut getroffen
diagnose_density(m3)
diagnose_fit(m3)
plotcoef(m3, "beta")

mean(bayes_R2(m2))
mean(bayes_R2(m3)) # eindeutig besser :o)

pred_m2 = predict(m2, newdata = df2)
pred_m3 = predict(m3, newdata = df2)

resid_m2 = df2$Salary_log - pred_m2
resid_m3 = df2$Salary_log - pred_m3

mean(abs(resid_m2)) # MAE (mean absolute error)
mean(abs(resid_m3))
# m3 hat kleineren Fehler -> besser

# lässt sich auch aus Std.abweichung der Residuen herauslesen
sd(resid_m2)
sd(resid_m3)

# sd(resid) entspricht sigma des Modells
print(m3, digits=2)


# Nochmal Modelle trainieren, diesmal mit Train/Test-Split
split_random(df2, 5000, 'df_train', 'df_test')

m2b = update(m2, data=df_train)
m3b = update(m3, data=df_train)

# MAE und 2 weitere Metriken
prediction_metrics(m2b, newdata=df_test)
prediction_metrics(m3b, newdata=df_test)

# Loo-Werte (elpd - "generic (expected) log-predictive density)
# sind spezifisch für Datensatz. Absolute Zahl sagt also nichts
# aus. Für Modellvergleich aber gut geeignet.
loo_m2 = loo(m2)
loo_m3 = loo(m3)

loo_m3
plotpkiv(loo_m3)

loo_compare(loo_m2, loo_m3)

# Spaces verdienen immer noch 12% mehr (HDI-95: +9..16%)
plothist(m3, 'TabSpacesSpaces', transform = exp)
plothist(m3, 'TabSpacesTabs', transform = exp)

# Differenz zwischen Spaces und Tabs berechnen
samples3 = as.matrix(m3)
colnames(samples3)
dim(samples3)

# Mit Spaces verdient man 17% mehr als mit Tabs (HDI-95: +14..19%)
plothist(samples3[1:4000,'TabSpacesSpaces'] - samples3[ , 'TabSpacesTabs'],
         transform = exp, main="Spaces vs Tabs")
