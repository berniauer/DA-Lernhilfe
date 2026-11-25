# daatools/R/diagMCMC.R

```r
.chain_colors = function(n) {
  # Retain the existing chain colors using the public six-color scheme.
  indices = switch(as.character(n),
                   "1" = 3L,
                   "2" = c(1L, 5L),
                   "3" = c(1L, 3L, 5L),
                   "4" = c(1L, 3L, 5L, 6L),
                   "5" = c(1L, 2L, 4L, 5L, 6L),
                   rep_len(seq_len(6L), n))
  colors = unlist(bayesplot::color_scheme_get(), use.names=FALSE)
  colors[rev(indices)]
}

# Convert the selected draws to plotting data without bayesplot internals.
.acf_overlay_data = function(model, pars, regex_pars, lags) {
  x = as.array(model)
  if (!is.numeric(x) || length(dim(x)) != 3L || any(dim(x) == 0L)) {
    stop("model must provide a non-empty iterations x chains x parameters array")
  }
  if (anyNA(x)) {
    stop("Missing values are not allowed in posterior draws")
  }
  if (!is.numeric(lags) || length(lags) != 1L || is.na(lags) ||
      !is.finite(lags) || lags < 0 || lags != floor(lags)) {
    stop("lags must be a non-negative whole number")
  }
  if (lags + 1 >= dim(x)[1]) {
    stop(paste0("Too few iterations for lags=", lags, "."))
  }
  if (!is.character(pars) || !is.character(regex_pars) ||
      anyNA(pars) || anyNA(regex_pars)) {
    stop("pars and regex_pars must be character vectors without missing values")
  }
  available = dimnames(x)[[3]]
  if (is.null(available)) {
    stop("Posterior draws must have parameter names")
  }
  if (!all(pars %in% available)) {
    stop("Some 'pars' don't match parameter names: ",
         paste(setdiff(pars, available), collapse=", "))
  }
  selected = unique(pars)
  if (length(regex_pars)) {
    matched = unlist(lapply(regex_pars, function(pattern) {
      grep(pattern, available, value=TRUE)
    }), use.names=FALSE)
    if (!length(matched)) {
      stop("No matches for 'regex_pars'.")
    }
    selected = unique(c(selected, matched))
  }
  if (!length(selected)) {
    selected = available
  }
  x = x[, , selected, drop=FALSE]
  n_chain = dim(x)[2]
  pieces = vector("list", length(selected) * n_chain)
  for (p in seq_along(selected)) {
    for (chain in seq_len(n_chain)) {
      ac = stats::acf(x[, chain, p], lag.max=lags, plot=FALSE)
      pieces[[(p - 1L) * n_chain + chain]] = data.frame(
        Chain=chain, Parameter=selected[p],
        Lag=as.numeric(ac$lag), AC=as.numeric(ac$acf))
    }
  }
  result = do.call(rbind, pieces)
  result$Chain = factor(result$Chain, levels=seq_len(n_chain))
  result$Parameter = factor(result$Parameter, levels=selected)
  result
}

mcmc_acf_overlay = function (model, pars = character(), regex_pars = character(), lags = 25, size = 0.5)
{
  plot_data = .acf_overlay_data(model, pars, regex_pars, lags)
  n_chain = nlevels(plot_data$Chain)
  plot = ggplot2::ggplot(plot_data,
    ggplot2::aes(x=.data$Lag, y=.data$AC, group=.data$Chain, color=.data$Chain)) +
    bayesplot::bayesplot_theme_get() +
    ggplot2::geom_hline(yintercept=0, linewidth=0.25,
                       color=bayesplot::color_scheme_get(i=3)[[1]]) +
    ggplot2::geom_line(linewidth=size) +
    ggplot2::scale_color_manual(values = .chain_colors(n_chain)) +
    ggplot2::scale_y_continuous("Autocorrelation", limits = c(min(0, plot_data$AC), 1.05),
                                breaks = c(0, 0.5, 1)) +
    ggplot2::scale_x_continuous("Lag", limits = c(-0.5, lags + 0.5),
                                breaks = function(x) as.integer(pretty(x, n = 4)),
                                expand = c(0, 0))
  if (nlevels(plot_data$Parameter) > 1L)
    plot = plot + ggplot2::facet_wrap("Parameter", axes="all", axis.labels="margins")
  plot
}




diagMCMC = function(model, parName) {
  UseMethod("diagMCMC")
}

diagMCMC.stanreg = function(model, parName) {
  if (model$algorithm != 'sampling') {
    stop('diagMCMC funktioniert nur f\u00FCr MCMC-Sampling')
  }
  old_cols = bayesplot::color_scheme_get()
  bayesplot::color_scheme_set('mix-blue-red')

  rhats = round(bayesplot::rhat(model)[parName],2)
  samples = as.data.frame(model$stanfit)
  n_samples = nrow(samples)
  n_chains = model$stanfit@sim$chains
  neffs = as.integer(bayesplot::neff_ratio(model)[parName] * n_samples)
  np = bayesplot::nuts_params(model)
  if (sum(np$Value[np$Parameter=='divergent__']) == 0)
    np = NULL;

  trace = bayesplot::mcmc_trace(model, pars=parName, np=np) +
    ggplot2::annotate("text", label=paste("hat(R)==", rhats),
                      x=n_samples/n_chains, y=min(samples[,parName]),
                      hjust="right", parse=TRUE, size=4, vjust="bottom")
  dens = bayesplot::mcmc_dens_overlay(model, pars=parName) + ggplot2::ylab("Density")
  acf = mcmc_acf_overlay(model, pars=parName) +
    ggplot2::annotate("text", label=paste("N[eff]==", neffs), x=25, y=1,
                      hjust="right", parse=TRUE, size=4)

  cols = .chain_colors(n_chains)[c(2,1)]
  cols[1] = paste0(cols[1], '10') # add alpha
  cols[2] = paste0(cols[2], '80') # add alpha
  if (is.null(np)) {
    vs_lp = ggplot2::ggplot(samples,
                            ggplot2::aes_(x = as.name(parName), y = ~`log-posterior`)) +
      ggplot2::geom_point(color=cols[1])
  } else {
    diverge = np$Value[np$Parameter=='divergent__']
    Diverged = factor(diverge, labels = c('no', 'yes')[1:(max(diverge)+1)])
    vs_lp = ggplot2::ggplot(cbind(samples, diverge),
                            ggplot2::aes_(x = as.name(parName), y = ~`log-posterior`, color= ~Diverged)) +
      ggplot2::geom_point()
  }
  vs_lp = vs_lp +
    bayesplot::bayesplot_theme_get() +
    ggplot2::scale_color_manual(values = cols)

  bayesplot::color_scheme_set(as.character(old_cols))
  gridExtra::grid.arrange(trace, dens, vs_lp, acf)
}


# Nachfolgende Funktionen (teils leicht modifiziert) aus:
#   Kruschke, J. K. (2015). Doing Bayesian Data Analysis, Second Edition:
#   A Tutorial with R, JAGS, and Stan. Academic Press / Elsevier.

.diagMCMC = function( codaObject , parName , niceName ) {
  DBDAplColors = c("skyblue","black","royalblue","steelblue")
  oldpar = par( mar=0.5+c(3,4,1,0) , oma=0.1+c(0,0,2,0) ,
                mgp=c(2.25,0.7,0) , cex.lab=1.5,
                mfcol=c(2,2) )
  # traceplot and gelman.plot are from CODA package:
  coda::traceplot( codaObject[,c(parName)] , main="" , ylab="Param. Value" ,
                   col=DBDAplColors )
  tryVal = try(
    coda::gelman.plot( codaObject[,c(parName)] , main="" , auto.layout=FALSE ,
                       col=DBDAplColors )
  )
  # if it runs, gelman.plot returns a list with finite shrink values:
  if ( inherits(tryVal, "try-error" )) {
    plot.new()
    print(paste0("Warning: coda::gelman.plot fails for ",parName))
  } else {
    if ( inherits(tryVal, "list") & !is.finite(tryVal$shrink[1]) ) {
      plot.new()
      print(paste0("Warning: coda::gelman.plot fails for ",parName))
    }
  }

  .DbdaDensPlot(codaObject,parName,plColors=DBDAplColors)
  .DbdaAcfPlot(codaObject,parName,plColors=DBDAplColors)

  mtext( text=niceName , outer=TRUE , adj=c(0.5,0.5) , cex=2.0 )
  par(oldpar)
}

.DbdaAcfPlot = function( codaObject , parName=coda::varnames(codaObject)[1] , plColors=NULL ) {
  if ( all( parName != coda::varnames(codaObject) ) ) {
    stop("parName must be a column name of coda object")
  }
  nChain = length(codaObject)
  if ( is.null(plColors) ) plColors=1:nChain
  xMat = NULL
  yMat = NULL
  for ( cIdx in 1:nChain ) {
    acfInfo = acf(codaObject[,c(parName)][[cIdx]],plot=FALSE)
    xMat = cbind(xMat,acfInfo$lag)
    yMat = cbind(yMat,acfInfo$acf)
  }
  # do not display autocorrelation values at lag=0
  dispXMat = xMat[2:(length(xMat[,1])),]
  dispYMat = yMat[2:(length(yMat[,1])),]
  matplot( dispXMat , dispYMat , type="o" , pch=20 , col=plColors,
           main="" , xlab="Lag" , ylab="Autocorrelation")
  abline(h=0,lty="dashed")
  EffChnLngth = coda::effectiveSize(codaObject[,c(parName)])
  text( x=max(dispXMat) , y=max(dispYMat) , adj=c(1.0,1.0) , cex=1.25 ,
        labels=paste("ESS =",round(EffChnLngth,1)) )
}


.DbdaDensPlot = function( codaObject , parName=coda::varnames(codaObject)[1] , plColors=NULL ) {
  if ( all( parName != coda::varnames(codaObject) ) ) {
    stop("parName must be a column name of coda object")
  }
  nChain = length(codaObject) # or nchain(codaObject)
  if ( is.null(plColors) ) plColors=1:nChain
  xMat = NULL
  yMat = NULL
  hdiLims = NULL
  for ( cIdx in 1:nChain ) {
    densInfo = density(codaObject[,c(parName)][[cIdx]])
    xMat = cbind(xMat,densInfo$x)
    yMat = cbind(yMat,densInfo$y)
    hdiLims = cbind(hdiLims, hdi(codaObject[,c(parName)][[cIdx]]))
  }
  matplot( xMat , yMat , type="l" , col=plColors ,
           main="" , xlab="Param. Value" , ylab="Density" )
  abline(h=0)
  points( hdiLims[1,] , rep(0,nChain) , col=plColors , pch="|" )
  points( hdiLims[2,] , rep(0,nChain) , col=plColors , pch="|" )
  text( mean(hdiLims) , 0 , "95% HDI" , adj=c(0.5,-0.2) )
  EffChnLngth = coda::effectiveSize(codaObject[,c(parName)])
  MCSE = sd(as.matrix(codaObject[,c(parName)]))/sqrt(EffChnLngth)
  text( max(xMat) , max(yMat) , adj=c(1.0,1.0) , cex=1.25 ,
        paste("MCSE =\n",signif(MCSE,3)) )
}
```
