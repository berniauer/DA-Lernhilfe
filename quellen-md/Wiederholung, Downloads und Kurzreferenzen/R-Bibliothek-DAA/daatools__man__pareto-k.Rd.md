# daatools/man/pareto-k.Rd

```
\name{pareto-k}
\alias{plotpkiv}
\alias{top_pareto_k_influence_values}
\title{Pareto-k Influence Values}
\description{
  Untersucht den Einfluss einzelner Beobachtungen anhand der Pareto-k-Werte
  eines LOO-Objekts. \code{plotpkiv()} stellt die Einflusswerte grafisch dar.
  \code{top_pareto_k_influence_values()} liefert die größten Einflusswerte
  zusammen mit den zugehörigen Zeilennummern, absteigend sortiert.
}
\usage{
  plotpkiv(model_loo)
  top_pareto_k_influence_values(model_loo, n=10)
}
\arguments{
  \item{model_loo}{ein LOO-Objekt, siehe rstanarm::loo()}
  \item{n}{Anzahl der zu retournierenden Werte}
}
```
