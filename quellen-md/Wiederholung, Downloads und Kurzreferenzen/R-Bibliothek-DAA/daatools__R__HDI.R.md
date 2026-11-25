# daatools/R/HDI.R

```r
# Nachfolgende Funktionen (teils leicht modifiziert) aus:
#   Kruschke, J. K. (2015). Doing Bayesian Data Analysis, Second Edition:
#   A Tutorial with R, JAGS, and Stan. Academic Press / Elsevier.

hdi_grid = function( probMassVec , credMass=0.95 ) {
  # Arguments:
  #   probMassVec is a vector of probability masses at each grid point.
  #   credMass is the desired mass of the HDI region.
  # Return value:
  #   A list with components:
  #   indices is a vector of indices that are in the HDI
  #   mass is the total mass of the included indices
  #   height is the smallest component probability mass in the HDI
  # Example of use: For determining HDI of a beta(30,12) distribution
  #   approximated on a grid:
  #   > probDensityVec = dbeta( seq(0,1,length=201) , 30 , 12 )
  #   > probMassVec = probDensityVec / sum( probDensityVec )
  #   > HDIinfo = HDIofGrid( probMassVec )
  #   > show( HDIinfo )
  sortedProbMass = sort( probMassVec , decreasing=TRUE )
  HDIheightIdx = min( which( cumsum( sortedProbMass ) >= credMass ) )
  HDIheight = sortedProbMass[ HDIheightIdx ]
  HDImass = sum( probMassVec[ probMassVec >= HDIheight ] )
  return( list( indices = which( probMassVec >= HDIheight ) ,
                mass = HDImass , height = HDIheight ) )
}


# grid-based HDI in einem Plot anzeigen
showHDI = function(theta, probMassVec, credMass=0.95) {
  HDIinfo = hdi_grid( probMassVec, credMass )
  points( theta[ HDIinfo$indices ] ,
          rep( HDIinfo$height , length( HDIinfo$indices ) ) ,
          pch="-" , cex=1.0 )
  text( mean( theta[ HDIinfo$indices ] ) , HDIinfo$height ,
        bquote( .(100*signif(HDIinfo$mass,3)) * "% HDI" ) ,
        adj=c(0.5,-1.5) , cex=1.5 )
  # Mark the left and right ends of the waterline.
  # Find indices at ends of sub-intervals:
  inLim = HDIinfo$indices[1] # first point
  for ( idx in 2:(length(HDIinfo$indices)-1) ) {
    if ( ( HDIinfo$indices[idx] != HDIinfo$indices[idx-1]+1 ) | # jumps on left, OR
         ( HDIinfo$indices[idx] != HDIinfo$indices[idx+1]-1 ) ) { # jumps on right
      inLim = c(inLim,HDIinfo$indices[idx]) # include idx
    }
  }
  inLim = c(inLim,HDIinfo$indices[length(HDIinfo$indices)]) # last point
  # Mark vertical lines at ends of sub-intervals:
  for ( idx in inLim ) {
    lines( c(theta[idx],theta[idx]) , c(-0.5,HDIinfo$height) , type="l" , lty=2 ,
           lwd=1.5 )
    text( theta[idx] , HDIinfo$height , bquote(.(round(theta[idx],3))) ,
          adj=c(0.5,-0.1) , cex=1.2 )
  }
}

hdi = function(obj, ...) {
  UseMethod("hdi")
}

.hdi_add = function(add, expr) {
  if (is.null(add)) return(list())
  if (is.function(add)) {
    add = list(add)
    expressions = list(expr)
  } else {
    expressions = if (is.call(expr) && as.character(expr[[1]])[1] %in% c('c', 'list')) {
      as.list(expr)[-1]
    } else list()
  }
  if (!is.list(add) || !all(vapply(add, is.function, logical(1)))) {
    stop('add must be a function or a list of functions')
  }
  labels = names(add)
  if (is.null(labels)) labels = rep('', length(add))
  for (i in seq_along(add)) {
    if (is.na(labels[i]) || labels[i] == '') {
      labels[i] = if (length(expressions) >= i && is.symbol(expressions[[i]])) {
        as.character(expressions[[i]])
      } else if (length(expressions) >= i && is.call(expressions[[i]]) &&
                 identical(expressions[[i]][[1]], as.name('::'))) {
        as.character(expressions[[i]][[3]])
      } else paste0('add', i)
    }
  }
  if (anyDuplicated(c('lwr', 'upr', labels))) {
    stop('add names must be unique and must not be lwr or upr')
  }
  names(add) = labels
  add
}

hdi.numeric = function(obj, credMass=0.95, add=NULL, ...) {
  add = .hdi_add(add, substitute(add))
  # Computes highest density interval from a sample of representative values,
  #   estimated as shortest credible interval.
  sortedPts = sort( obj )
  ciIdxInc = ceiling( credMass * length( sortedPts ) )
  nCIs = length( sortedPts ) - ciIdxInc
  ciWidth = rep( 0 , nCIs )
  for ( i in 1:nCIs ) {
    ciWidth[ i ] = sortedPts[ i + ciIdxInc ] - sortedPts[ i ]
  }
  HDImin = sortedPts[ which.min( ciWidth ) ]
  HDImax = sortedPts[ which.min( ciWidth ) + ciIdxInc ]
  HDIlim = c( HDImin , HDImax )
  if (length(add)) {
    extra = vapply(add, function(fun) {
      value = fun(obj)
      if (!is.numeric(value) || length(value) != 1 || !is.null(dim(value))) {
        stop('Each add function must return one numeric value')
      }
      unname(value)
    }, numeric(1))
    HDIlim = c(setNames(HDIlim, c('lwr', 'upr')), extra)
  }
  return( HDIlim )
}

hdi.stanreg = function(obj, include=NULL, exclude=NULL, credMass=0.95, add=NULL, ...) {
  add = .hdi_add(add, substitute(add))
  samples = as.matrix(obj)
  dat = .filter.columns(samples, include=include, exclude=exclude)
  hdis = apply(dat, 2, hdi, credMass=credMass, add=add)
  dimnames(hdis) = list(c('lwr', 'upr', names(add)), colnames(hdis))
  t(hdis)
}

hdi.matrix = function(obj, include=NULL, exclude=NULL, credMass=0.95, margin=2, add=NULL, ...) {
  add = .hdi_add(add, substitute(add))
  dat = .filter.columns(obj, include=include, exclude=exclude)
  result = t(apply(dat, margin, hdi, credMass=credMass, add=add))
  colnames(result) = c('lwr', 'upr', names(add))
  names(dimnames(result)) = NULL # result from epred has named dimensions
  result
}

hdi.data.frame = function(obj, include=NULL, exclude=NULL, credMass=0.95, margin=2, add=NULL, ...) {
  add = .hdi_add(add, substitute(add))
  dat = .filter.columns(obj, include=include, exclude=exclude, only.numeric = TRUE)
  result = t(apply(dat, margin, hdi, credMass=credMass, add=add))
  colnames(result) = c('lwr', 'upr', names(add))
  result
}
```
