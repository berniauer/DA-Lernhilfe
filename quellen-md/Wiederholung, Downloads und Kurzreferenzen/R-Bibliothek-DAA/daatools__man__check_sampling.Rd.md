# daatools/man/check_sampling.Rd

```
\name{check_sampling}
\alias{check_sampling}
\encoding{UTF-8}
\title{Überprüft Sampling-Diagnostik eines RStanARM-Modells}
\usage{
check_sampling(x, include=NULL, exclude=NULL,
               neff_min=400, mcse_max=0.05, rhat_max=1.01,
               credMass=0.95, n=10)
}
\arguments{
  \item{x}{RStanARM-Modell.}
  \item{include, exclude}{Reguläre Ausdrücke zur Auswahl bzw. zum Ausschluss von
  Koeffizienten. Mit \code{include="beta"} werden Intercept und Hilfsparameter
  ausgeschlossen. Die Prüfung von \code{mean_PPD} erfolgt unabhängig davon.}
  \item{neff_min}{Mindestwert der effektiven Stichprobengröße. Standard: 400.}
  \item{mcse_max}{Obere Grenze für MCSE / MAD (exklusiv). Standard: 0.05.}
  \item{rhat_max}{Maximal zulässiger Rhat-Wert. Standard: 1.01.}
  \item{credMass}{Wahrscheinlichkeitsmasse des zentralen Intervalls von
  \code{mean_PPD}. Standard: 0.95.}
  \item{n}{Maximale Anzahl angezeigter Koeffizienten (positive ganze Zahl).
  Standard: 10. Angezeigt werden die Koeffizienten mit den niedrigsten
  effektiven Stichprobengrößen.}
}
\description{
Prüft effektive Stichprobengröße, Monte-Carlo-Standardfehler relativ zur MAD
und Rhat der ausgewählten Koeffizienten. Zusätzlich wird geprüft, ob
\code{mean(x$y)} im zentralen Intervall der \code{mean_PPD}-Ziehungen liegt.
Diese Prüfung beurteilt die Übereinstimmung mit den beobachteten Daten;
sie ist kein Konvergenzkriterium und verlangt keine exakte numerische Gleichheit.
}
\details{
Gibt für jede Prüfung das Ergebnis sowie eine nach effektiver Stichprobengröße
aufsteigend sortierte Diagnostiktabelle aus. Die effektive Stichprobengröße
wird in der Ausgabe auf ganze Zahlen gerundet.
Es werden höchstens \code{n} Koeffizienten angezeigt. Alle ausgewählten
Koeffizienten werden geprüft und in \code{diagnostics} zurückgegeben.
Nicht endliche Diagnostikwerte bestehen die Prüfung
nicht. Für den Vergleich mit \code{mean_PPD} muss \code{x$y} ein endlicher,
numerischer Vektor sein. Fehlt dieser oder fehlen endliche
\code{mean_PPD}-Ziehungen, wird die Prüfung als nicht verfügbar ausgegeben
und mit \code{FALSE} zurückgegeben.
}
\value{
Unsichtbar eine Liste mit \code{checks} (benannter logischer Vektor),
\code{diagnostics} (Data Frame mit \code{n_eff}, \code{mcse_mad} und
\code{Rhat}) und \code{mean_PPD} (benannter Vektor mit prädiktivem Mittelwert,
beobachtetem Mittelwert sowie unterer und oberer Intervallgrenze).
}
\seealso{\code{\link{check_mcse}}}
```
