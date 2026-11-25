# daatools/man/foreach.Rd

```
\name{foreach}
\alias{foreach_row}
\alias{foreach_column}
\title{Anwenden einer Funktion auf Zeilen bzw. Spalten eines Dataframes/Matrix}
\description{
  Wendet eine Funktion auf jede Zeile bzw. jede Spalte einer Matrix, eines
  Dataframes oder eines Tibbles an und fasst die Ergebnisse zusammen.
}
\usage{
  foreach_row(x, fun)
  foreach_column(x, fun)
}
\arguments{
  \item{x}{Matrix oder Dataframe}
  \item{fun}{Funktion die auf Zeilen bzw. Spalten angewandt wird}
}
```
