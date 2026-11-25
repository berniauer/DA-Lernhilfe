# daatools/R/plothist.R

```r
plothist = function( paramSampleVec , parName=NULL, cenTend=c("median","mean","mode")[1] ,
                     compVal=NULL, ROPE=NULL, credMass=0.95, HDItextPlace=0.7,
                     xlab=NULL , xlim=NULL , yaxt=NULL , ylab=NULL ,
                     main=NULL , cex=NULL , cex.lab=NULL ,
                     col=NULL , border=NULL , showCurve=FALSE , breaks=NULL ,
                     returnSummary=FALSE , transform=identity ,
                     ... ) {
  UseMethod("plothist")
}

plothist.numeric = function( paramSampleVec , parName=NULL, cenTend=c("median","mean","mode")[1] ,
                             compVal=NULL, ROPE=NULL, credMass=0.95, HDItextPlace=0.7,
                             xlab=NULL , xlim=NULL , yaxt=NULL , ylab=NULL ,
                             main=NULL , cex=NULL , cex.lab=NULL ,
                             col=NULL , border=NULL , showCurve=FALSE , breaks=NULL ,
                             returnSummary=FALSE , transform = identity,
                             ...  ) {
  if (is.null(parName))
    parName = deparse1(substitute(paramSampleVec))
  if (is.null(main))
    main = paste('Histogram of', parName)
  paramSampleVec = transform(paramSampleVec)

  .plothist(paramSampleVec=paramSampleVec, cenTend=cenTend, compVal=compVal, ROPE=ROPE,
            credMass=credMass, HDItextPlace=HDItextPlace,
            xlab=xlab, xlim=xlim, yaxt=yaxt, ylab=ylab, main=main, cex=cex, cex.lab=cex.lab,
            col=col, border=border, showCurve=showCurve, breaks=breaks,
            returnSummary=returnSummary, ... )
}

plothist.matrix = function( paramSampleVec , parName=NULL, cenTend=c("median","mean","mode")[1] ,
                             compVal=NULL, ROPE=NULL, credMass=0.95, HDItextPlace=0.7,
                             xlab=NULL , xlim=NULL , yaxt=NULL , ylab=NULL ,
                             main=NULL , cex=NULL , cex.lab=NULL ,
                             col=NULL , border=NULL , showCurve=FALSE , breaks=NULL ,
                             returnSummary=FALSE , transform = identity,
                             ...  ) {
  if (is.null(parName))
    parName = deparse1(substitute(paramSampleVec))
  if (dim(paramSampleVec)[2] > 1) {
    warning("Matrix mit mehreren Spalten \u00FCbergeben! Nur 1. Spalte wird angezeigt")
  }
  paramSampleVec = paramSampleVec[,1]
  if (is.null(main))
    main = paste('Histogram of', parName)
  paramSampleVec = transform(paramSampleVec)

  .plothist(paramSampleVec=paramSampleVec, cenTend=cenTend, compVal=compVal, ROPE=ROPE,
            credMass=credMass, HDItextPlace=HDItextPlace,
            xlab=xlab, xlim=xlim, yaxt=yaxt, ylab=ylab, main=main, cex=cex, cex.lab=cex.lab,
            col=col, border=border, showCurve=showCurve, breaks=breaks,
            returnSummary=returnSummary, ... )
}

plothist.stanreg = function ( paramSampleVec, parName, cenTend = c("median", "mean","mode")[1],
                              compVal = NULL, ROPE = NULL, credMass = 0.95,
                              HDItextPlace = 0.7, xlab = NULL, xlim = NULL, yaxt = NULL,
                              ylab = NULL, main = NULL, cex = NULL, cex.lab = NULL, col = NULL,
                              border = NULL, showCurve = FALSE, breaks = NULL, returnSummary = FALSE,
                              transform = identity, ...) {
  if (is.null(parName))
    parName = deparse1(substitute(paramSampleVec))
  if (is.null(main))
    main = paste("Histogram of", parName)
  paramSampleVec = as.matrix(paramSampleVec)[,parName]
  paramSampleVec = transform(paramSampleVec)

  .plothist(paramSampleVec = paramSampleVec, cenTend = cenTend,
            compVal = compVal, ROPE = ROPE, credMass = credMass,
            HDItextPlace = HDItextPlace, xlab = xlab, xlim = xlim,
            yaxt = yaxt, ylab = ylab, main = main, cex = cex, cex.lab = cex.lab,
            col = col, border = border, showCurve = showCurve, breaks = breaks,
            returnSummary = returnSummary, ...)
}


# Nachfolgende Funktionen (teils leicht modifiziert) aus:
#   Kruschke, J. K. (2015). Doing Bayesian Data Analysis, Second Edition:
#   A Tutorial with R, JAGS, and Stan. Academic Press / Elsevier.

.plothist = function( paramSampleVec , cenTend=c("median","mean","mode")[1] ,
                      compVal=NULL, ROPE=NULL, credMass=0.95, HDItextPlace=0.7,
                      xlab=NULL , xlim=NULL , yaxt=NULL , ylab=NULL ,
                      main=NULL , cex=NULL , cex.lab=NULL ,
                      col=NULL , border=NULL , showCurve=FALSE , breaks=NULL ,
                      returnSummary=FALSE ,
                      ... ) {
  # Override defaults of hist function, if not specified by user:
  # (additional arguments "..." are passed to the hist function)
  if ( is.null(cex.lab) ) cex.lab=1.5
  if ( is.null(cex) ) cex=1.4
  if ( is.null(xlim) ) xlim=range( c( compVal , ROPE , paramSampleVec ) )
  if ( is.null(main) ) main=""
  if ( is.null(yaxt) ) yaxt="n"
  if ( is.null(ylab) ) ylab=""
  if ( is.null(col) ) col="skyblue"
  if ( is.null(border) ) border="white"

  # convert coda object to matrix:
  if ( inherits(paramSampleVec, "mcmc.list" )) {
    paramSampleVec = as.matrix(paramSampleVec)
  }

  summaryColNames = c("ESS","mean","median","mode",
                      "hdiMass","hdiLow","hdiHigh",
                      "compVal","pGtCompVal",
                      "ROPElow","ROPEhigh","pLtROPE","pInROPE","pGtROPE")
  postSummary = matrix( NA , nrow=1 , ncol=length(summaryColNames) ,
                        dimnames=list( c( xlab ) , summaryColNames ) )

  postSummary[,"ESS"] = coda::effectiveSize(paramSampleVec)

  postSummary[,"mean"] = mean(paramSampleVec)
  postSummary[,"median"] = median(paramSampleVec)
  mcmcDensity = density(paramSampleVec)
  postSummary[,"mode"] = mcmcDensity$x[which.max(mcmcDensity$y)]

  HDI = hdi( paramSampleVec , credMass )
  postSummary[,"hdiMass"]=credMass
  if (HDI[1] != HDI[2]) {
    postSummary[,"hdiLow"]=HDI[1]
    postSummary[,"hdiHigh"]=HDI[2]
  } else {
    postSummary[,"hdiLow"]=NA
    postSummary[,"hdiHigh"]=NA
  }

  # Plot histogram.
  cvCol = "darkgreen"
  ropeCol = "darkred"
  if ( is.null(breaks) ) {
    if ( max(paramSampleVec) > min(paramSampleVec) ) {
      by = (HDI[2]-HDI[1]) / 18
      if (by != 0) {
        breaks = c( seq( from=min(paramSampleVec) , to=max(paramSampleVec) ,
                         by=by))
        n_brk = length(breaks)
        if (isTRUE(all.equal(breaks[n_brk], max(paramSampleVec)))) {
          breaks[n_brk] = max(paramSampleVec) # just to make very sure (rounding)
        } else {
          breaks = c(breaks, max(paramSampleVec))
        }
      } else {
        breaks = c( seq( from=min(paramSampleVec) , to=max(paramSampleVec) ,
                         length.out=18))
      }
    } else {
      breaks=c(min(paramSampleVec)-1.0E-6,max(paramSampleVec)+1.0E-6)
      border="skyblue"
    }
  }
  if ( !showCurve ) {
    par(xpd=NA)
    histinfo = hist( paramSampleVec , xlab=xlab , yaxt=yaxt , ylab=ylab ,
                     freq=F , border=border , col=col ,
                     xlim=xlim , main=main , cex=cex , cex.lab=cex.lab ,
                     breaks=breaks , ... )
  }
  if ( showCurve ) {
    par(xpd=NA)
    histinfo = hist( paramSampleVec , plot=F )
    densCurve = density( paramSampleVec , adjust=2 )
    plot( densCurve$x , densCurve$y , type="l" , lwd=5 , col=col , bty="n" ,
          xlim=xlim , xlab=xlab , yaxt=yaxt , ylab=ylab ,
          main=main , cex=cex , cex.lab=cex.lab , ... )
  }
  cenTendHt = 0.9*max(histinfo$density)
  cvHt = 0.7*max(histinfo$density)
  ROPEtextHt = 0.55*max(histinfo$density)
  # Display central tendency:
  mn = mean(paramSampleVec)
  med = median(paramSampleVec)
  mcmcDensity = density(paramSampleVec)
  mo = mcmcDensity$x[which.max(mcmcDensity$y)]
  if ( cenTend=="mode" ){
    text( mo , cenTendHt ,
          bquote(mode==.(signif(mo,3))) , adj=c(.5,0) , cex=cex)
  }
  if ( cenTend=="median" ){
    text( med , cenTendHt ,
          bquote(median==.(signif(med,3))) , adj=c(.5,0) , cex=cex)
  }
  if ( cenTend=="mean" ){
    text( mn , cenTendHt ,
          bquote(mean==.(signif(mn,3))) , adj=c(.5,0) , cex=cex)
  }
  # Display the comparison value.
  if ( !is.null( compVal ) ) {
    pGtCompVal = sum( paramSampleVec > compVal ) / length( paramSampleVec )
    pLtCompVal = 1 - pGtCompVal
    lines( c(compVal,compVal) , c(0.96*cvHt,0) ,
           lty="dotted" , lwd=2 , col=cvCol )
    text( compVal , cvHt ,
          bquote( .(round(100*pLtCompVal,1)) * "% < " *
                    .(signif(compVal,3)) * " < " *
                    .(round(100*pGtCompVal,1)) * "%" ) ,
          adj=c(pLtCompVal,0) , cex=0.8*cex , col=cvCol )
    postSummary[,"compVal"] = compVal
    postSummary[,"pGtCompVal"] = pGtCompVal
  }
  # Display the ROPE.
  if ( !is.null( ROPE ) ) {
    pInROPE = ( sum( paramSampleVec > ROPE[1] & paramSampleVec < ROPE[2] )
                / length( paramSampleVec ) )
    pGtROPE = ( sum( paramSampleVec >= ROPE[2] ) / length( paramSampleVec ) )
    pLtROPE = ( sum( paramSampleVec <= ROPE[1] ) / length( paramSampleVec ) )
    lines( c(ROPE[1],ROPE[1]) , c(0.96*ROPEtextHt,0) , lty="dotted" , lwd=2 ,
           col=ropeCol )
    lines( c(ROPE[2],ROPE[2]) , c(0.96*ROPEtextHt,0) , lty="dotted" , lwd=2 ,
           col=ropeCol)
    text( mean(ROPE) , ROPEtextHt ,
          bquote( .(round(100*pLtROPE,1)) * "% < " * .(ROPE[1]) * " < " *
                    .(round(100*pInROPE,1)) * "% < " * .(ROPE[2]) * " < " *
                    .(round(100*pGtROPE,1)) * "%" ) ,
          adj=c(pLtROPE+.5*pInROPE,0) , cex=1 , col=ropeCol )

    postSummary[,"ROPElow"]=ROPE[1]
    postSummary[,"ROPEhigh"]=ROPE[2]
    postSummary[,"pLtROPE"]=pLtROPE
    postSummary[,"pInROPE"]=pInROPE
    postSummary[,"pGtROPE"]=pGtROPE
  }
  # Display the HDI.
  if (HDI[1] != HDI[2]) {
    lines( HDI , c(0,0) , lwd=4 , lend=1 )
    text( mean(HDI) , 0 , bquote(.(100*credMass) * "% HDI" ) ,
          adj=c(.5,-1.7) , cex=cex )
    text( HDI[1] , 0 , bquote(.(signif(HDI[1],3))) ,
          adj=c(HDItextPlace,-0.5) , cex=cex )
    text( HDI[2] , 0 , bquote(.(signif(HDI[2],3))) ,
          adj=c(1.0-HDItextPlace,-0.5) , cex=cex )
  }
  par(xpd=F)
  #
  if (returnSummary) {
    return( postSummary )
  }
}
```
