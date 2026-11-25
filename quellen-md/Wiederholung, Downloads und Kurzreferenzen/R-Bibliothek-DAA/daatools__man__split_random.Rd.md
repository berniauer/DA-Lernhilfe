# daatools/man/split_random.Rd

```
\name{split_random}
\alias{split_random}
\title{split_random}
\usage{
  split_random(df, n, train_var, test_var, seed=1234)
}
\description{
  Teilt einen Dataframe in zwei Teile auf. Dabei ist "n" die Anzahl der Zeilen
  im ersten Datensatz, die restlichen Zeilen werden im zweiten Datensatz gespeichert.
}
\arguments{
  \item{df}{Dataframe oder Tibble der geteilt werden soll. Der Tabellentyp bleibt erhalten, auch bei nur einer Spalte.}
  \item{n}{Wie viele Zeilen im ersten Datensatz enthalten sein sollen: eine ganze Zahl zwischen 0 und nrow(df).}
  \item{train_var}{(String) Name der Variable für den ersten Datensatz.
    Falls nicht angegeben wird der Name des Datenframes plus das Suffix "_train" verwendet.}
  \item{test_var}{(String) Name der Variable für den zweiten Datensatz.
    Falls nicht angegeben wird der Name des Datenframes plus das Suffix "_test" verwendet.}
  \item{seed}{Seed-Wert für den Zufallsgenerator}
}
\examples{
  df = data.frame(size=100:120)

  split_random(df, 15)
  nrow(df_train) # 15
  nrow(df_test)  # 5

  split_random(df, 12, "df1", "df2")
  nrow(df1) # 12
  nrow(df2) # 8
}
```
