# daatools/man/zscale.Rd

```
\name{zscale}
\alias{zscale}
\alias{inv_zscale}
\alias{zscale_other}
\alias{inv_zscale_other}
\alias{zscale_df}
\alias{zscale_df_other}
\alias{center}
\alias{inv_center}
\alias{center_other}
\alias{inv_center_other}
\alias{center_df}
\alias{center_df_other}
\alias{levels}
\title{Z-Skalierung}
\usage{
  zscale(x, mode=c("z", "center", "2sd"))
  inv_zscale(z)
  zscale_other(x, scaled.var)
  inv_zscale_other(z, scaled.var)
  zscale_df(df, include=NULL, exclude=NULL, mode=c("z", "center", "2sd"), drop.originals=TRUE)
  zscale_df_other(df, other.df, include=NULL, exclude=NULL, drop.originals=TRUE)

  center(x)
  inv_center(z)
  center_other(x, scaled.var)
  inv_center_other(z, scaled.var)
  center_df(df, include=NULL, exclude=NULL, drop.originals=TRUE)
  center_df_other(df, other.df, include=NULL, exclude=NULL, drop.originals=TRUE)
}
\description{
Numeric-Vektoren z-skalieren bzw. zentrieren und rückumwandeln; einzelne Zahlen anhand bereits skalierter Variable z-skalieren bzw. zentrieren. Die center-Funktionen sind dabei nur Aliases der zscale-Funktionen mit `mode="center"`.
}
\arguments{
  \item{df}{Dataframe oder Tibble. Der Tabellentyp bleibt im Ergebnis erhalten.}
  \item{x}{Variable, die z-skaliert bzw. zentriert werden soll}
  \item{mode}{"z" führt eine echte z-Skalierung durch, "center" subtrahiert nur den Mittelwert, "2sd" dividiert bei Normierung durch 2*sd() anstatt durch 1*sd()}
  \item{z}{Z-Skalierte Variable, die rücktransformiert werden soll}
  \item{scaled.var}{Skalierte Variable, deren mean+sd als Basis herangezogen werden soll}
  \item{other.df}{Existierender Dataframe oder Tibble, dessen Spalten als Basis für Transformation herangezogen werden sollen}
  \item{include}{Eine Liste von Namen, nach denen die Spaltennamen des Datenframes
gefiltert werden, bevor skaliert wird. Die Namen werden als Regular Expression interpretiert (siehe ?grep).}
  \item{exclude}{Eine Liste von Spaltennamen, die vom Datenframe ausgenommen werden, bevor skaliert wird. Die Namen werden als Regular Expression interpretiert (siehe ?grep).}
  \item{drop.originals}{Wenn TRUE, dann werden die originalen (nicht skalierten) Spalten entfernt und durch die skalierten Spalten ersetzt. Anderenfalls werden die skalierten Spalten mit Postfix ".z" dem Dataframe hinzugefügt.}
}
\examples{
  skaliert = zscale(1:10)
  z19 = zscale_other(19, skaliert)
  eins_bis_zehn = inv_zscale(skaliert)
  neunzehn = inv_zscale_other(z19, skaliert)

  zscale_df(df, c("x3","x4"), drop.originals=FALSE)
}
```
