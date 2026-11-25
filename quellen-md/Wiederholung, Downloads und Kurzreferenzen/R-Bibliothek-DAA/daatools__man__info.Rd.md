# daatools/man/info.Rd

```
\name{info}
\alias{info}
\alias{info.numeric}
\alias{info.integer}
\alias{info.Date}
\alias{info.character}
\alias{info.factor}
\alias{info.logical}
\alias{info.data.frame}
\alias{info.matrix}
\alias{info.lm}
\alias{info.stanreg}
\title{Daten-Beschreibung}
\usage{
  info(x, ...)
  \method{info}{numeric}(x, long=FALSE, ...)
  \method{info}{integer}(x, long=FALSE, ...)
  \method{info}{Date}(x, ...)
  \method{info}{character}(x, ...)
  \method{info}{factor}(x, ...)
  \method{info}{logical}(x, ...)
  \method{info}{data.frame}(x, digits=2, long=FALSE, n_levels=20, ...)
  \method{info}{matrix}(x, ...)
  \method{info}{lm}(x, credMass=0.95, digits=2, ...)
  \method{info}{stanreg}(x, include=NULL, exclude=NULL, credMass=0.95, digits=2, ...)
}
\description{
  Beschreibende Statistik für Vektoren, Matrizen, Dataframes, Tibbles und Regressionsmodelle.
  Nicht alle Parameter sind für jeden Datentyp verfügbar.
}
\arguments{
  \item{x}{Variable, die analysiert werden soll}
  \item{...}{Zusätzliche Argumente für die Methoden. Bei Matrizen werden sie an die
  Dataframe-Methode weitergegeben. Bei Dataframes und Modellen werden zusätzliche
  Ausgabeparameter gespeichert und beim Drucken verwendet; bei Vektoren derzeit nicht verwendet.}
  \item{n_levels}{Maximale Anzahl angezeigter Ausprägungen pro kategorialer Spalte
  eines Dataframes. Bei mehr Ausprägungen werden die häufigsten angezeigt.}
  \item{long}{Ob Skew und Kurtosis für numerische Variable auch ausgegeben werden soll.}
  \item{credMass}{Konfidenzniveau bei lm-Modellen bzw. Wahrscheinlichkeitsmasse des HD-Intervalls bei rstanarm-Modellen}
  \item{digits}{Anzahl der Nachkommastellen für die gerundete Ausgabe}
  \item{include}{Eine Liste von Namen, nach denen die Koeffizienten-Parameter
  gefiltert werden sollen. Die Namen werden als Regular Expression interpretiert
  (siehe ?grep). Bei rstanarm-Modellen kann als Koeffizient "beta" angegeben werden:
  in diesem Fall werden Intercept und Sigma nicht dargestellt.}
  \item{exclude}{Eine Liste von Namen, die entfernt werden sollen. Die Namen werden
  als Regular Expression interpretiert (siehe ?grep).}
}

\value{
  Für \code{Date}-Vektoren ein Dataframe mit einer Zeile und den Spalten
  \code{min}, \code{median}, \code{max} (jeweils Klasse \code{Date}) und
  \code{na} (Anzahl fehlender Werte). Fehlende Werte werden bei den
  Datumsstatistiken ignoriert; bei leeren oder vollständig fehlenden Vektoren
  sind diese Statistiken \code{NA}.
  Die übrigen Methoden liefern numerische Zusammenfassungen, Häufigkeitstabellen
  oder Objekte mit einer angepassten Druckdarstellung.
}

\details{
  Bei lm-Modellen bleiben nicht schätzbare (aliasierte) Koeffizienten in der
  Übersicht erhalten; ihre Statistiken werden als \code{NA} ausgegeben.

  Datumsspalten in Dataframes und Tibbles werden als separate Übersicht mit
  Kalenderdaten ausgegeben. \code{long} und \code{digits} ändern diese Übersicht nicht.

}
```
