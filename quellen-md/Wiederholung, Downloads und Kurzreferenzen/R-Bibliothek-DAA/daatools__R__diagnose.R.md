# daatools/R/diagnose.R

```r
diagnose_fit = function(model, prediction=NULL, newdata=NULL, low=0.025, high=0.975, credMass=0.95, rows=NULL) {
  UseMethod("diagnose_fit")
}

diagnose_fit.stanreg = function(model, prediction=NULL, newdata=NULL, low=0.025, high=0.975, credMass=0.95, rows=NULL) {
  dat = .stan_get_y_yhat(model, prediction, newdata, rows, 1000)
  .diagnose_fit(dat$y, dat$yhat, low=low, high=high, credMass=credMass)
}

.diagnose_fit = function(y, yhat, low=0.025, high=0.975, credMass=0.95) {
  oldpar = par(mfrow=c(2,3), mar=c(3,2,2,2))
  pmin = apply(yhat, 1, min)
  pmax = apply(yhat, 1, max)
  pmean = apply(yhat, 1, mean)
  pquant = apply(yhat, 1, function(x) quantile(x, c(low, high, 0.5)))
  plothist(pmin, compVal = min(y), xlab = '', main='min(y)', credMass = credMass)
  plothist(pmax, compVal = max(y), xlab = '', main='max(y)', credMass = credMass)
  plothist(pmean, compVal = mean(y), xlab = '', main='mean(y)', credMass = credMass)
  plothist(pquant[1,], compVal = quantile(y, low), xlab = '', main=paste0(low*100,'%(y)'), credMass = credMass)
  plothist(pquant[2,], compVal = quantile(y, high), xlab = '', main=paste0(high*100,'%(y)'), credMass = credMass)
  plothist(pquant[3,], compVal = median(y), xlab = '', main='50%(y)', credMass = credMass)
  par(oldpar)
}

diagnose_distribution = function(model, prediction=NULL, newdata=NULL, rows=NULL) {
  UseMethod("diagnose_distribution")
}

diagnose_distribution.stanreg = function(model, prediction=NULL, newdata=NULL, rows=NULL) {
  dat = .stan_get_y_yhat(model, prediction, newdata, rows, 8)
  .diagnose_distribution(dat$y, dat$yhat)
}

.diagnose_distribution = function(y, yhat) {
  oldpar = par(mfrow=c(3,3), mar=c(2,2,2,2))
  dat = cbind(y, t(yhat[sample.int(nrow(yhat), 8),]))
  rn = range(dat)
  breaks = seq(rn[1], rn[2], length.out = 20)
  hist(dat[,1], col='darkblue', breaks=breaks, main=bquote('y'['data']))
  for (i in 2:9) {
    hist(dat[,i], col='lightblue', breaks=breaks, main=bquote('y'['sample'][.(i-1)]))
  }
  par(oldpar)
}


diagnose_residual_dist = function(model, prediction=NULL, newdata=NULL, rows=NULL, samples=TRUE, main=NULL) {
  UseMethod("diagnose_residual_dist")
}

diagnose_residual_dist.stanreg = function(model, prediction=NULL, newdata=NULL, rows=NULL, samples=TRUE, main=NULL) {
  dat = .stan_get_y_yhat(model, prediction, newdata, rows, 250, 'epred')
  .diagnose_residual_dist(dat$y, dat$yhat, samples=samples, main=main)
}

.diagnose_residual_dist = function(y, yhat, samples, main) {
  if (samples)
    oldpar = par(mfrow=c(3,3), mar=c(2,2,2,2))
  else
    oldpar = par(mar=c(2,2,2,2))
  yhat_m = colMeans(yhat)
  dat = cbind(yhat_m, t(yhat[sample.int(nrow(yhat), 8),]))
  dat = apply(dat, 2, function(c) y - c)
  rn = range(dat)
  breaks = seq(rn[1], rn[2], length.out = 20)
  if (is.null(main))
    main='avg(residuals)'
  hist(dat[,1], col='darkblue', breaks=breaks, main=main)
  if (samples) {
    for (i in 2:9) {
      hist(dat[,i], col='lightblue', breaks=breaks,
           main=bquote('residuals'['sample'][.(i)]))
    }
  }
  par(oldpar)
}


diagnose_residual = function(model, prediction=NULL, newdata=NULL, type=c('fitted', 'y'),
                             alpha=0.25, rows=NULL, samples=TRUE, main=NULL) {
  UseMethod("diagnose_residual")
}

diagnose_residual.stanreg = function(model, prediction=NULL, newdata=NULL, type=c('fitted', 'y'),
                                     alpha=0.25, rows=NULL, samples=TRUE, main=NULL) {
  dat = .stan_get_y_yhat(model, prediction, newdata, rows, 250, 'epred')
  .diagnose_residual(dat$y, dat$yhat, type=type, alpha=alpha, samples=samples, main=main)
}
.diagnose_residual = function (y, yhat, type=c('fitted', 'y'), alpha, samples, main) {
  type = match.arg(type)
  if (samples)
    oldpar = par(mfrow=c(3,3), mar=c(2,4,2,0.5))
  else
    oldpar = par(mar=c(2,4,2,0.5))
  yhat_m = colMeans(yhat)

  if (type == 'y') { x_axis = y }
  else             { x_axis = yhat_m }
  x_axis_order = order(x_axis)
  lo_x = x_axis[x_axis_order]

  avg_resid = y - yhat_m
  if (is.null(main))
    main = paste('avg(residuals) vs ', type)
  plot(x_axis, avg_resid,
       ylab='avg(residuals)', xlab=type, main=main,
       col=rgb(0,0.1,0.4,alpha))
  lo_y = avg_resid[x_axis_order]
  lo = loess(lo_y ~ lo_x)
  abline(h=0, lty=2)
  lines(lo_x, predict(lo), col='red', lty=2)

  if (samples) {
    dat = t(yhat[sample.int(nrow(yhat), 8),])
    dat = apply(dat, 2, function(c) y - c)
    for (i in 1:8) {
      sample_y = dat[,i]
      plot(x_axis, sample_y,
           ylab='residuals', xlab=type,
           main=bquote('residual'['sample'][.(i)]),
           col=rgb(0,0,0,alpha))
      lo_y = sample_y[x_axis_order]
      lo <- loess(lo_y ~ lo_x)
      abline(h=0, lty=2)
      lines(lo_x, predict(lo), col='red', lty=2)
    }
  }
  par(oldpar)
}


diagnose_y_vs_yhat = function(model, prediction=NULL, newdata=NULL, alpha=0.25,
                              rows=NULL, samples=TRUE, main=NULL) {
  UseMethod("diagnose_y_vs_yhat")
}

diagnose_y_vs_yhat.stanreg = function(model, prediction=NULL, newdata=NULL, alpha=0.25,
                                      rows=NULL, samples=TRUE, main=NULL) {
  dat = .stan_get_y_yhat(model, prediction, newdata, rows, 250)
  .diagnose_y_vs_yhat(dat$y, dat$yhat, alpha=alpha, samples=samples, main=main)
}

.diagnose_y_vs_yhat = function (y, yhat, alpha, samples, main) {
  if (samples)
    oldpar = par(c(3,3), mar=c(2,4,2,0.5))
  else
    oldpar = par(mar=c(2,4,2,0.5))
  yhat_m = colMeans(yhat)
  if (is.null(main))
    main='y vs avg(y_hat)'
  plot(yhat_m, y,
       xlab=bquote(avg('y'['sample'])), ylab="y", main=main,
       col=rgb(0,0.1,0.4,alpha))
  abline(a=0, b=1, lty=2, col='darkgreen')
  if (samples) {
    dat = t(yhat[sample.int(nrow(yhat), 8),])
    for (i in 1:8) {
      plot(dat[,i], y,
           xlab=bquote('y'['sample'][.(i)]), ylab="y",
           main=bquote('y vs y'['sample'][.(i)]),
           col=rgb(0,0,0,alpha))
      abline(a=0, b=1, lty=2, col='darkblue')
    }
  }
  par(oldpar)
}


diagnose_density = function(model, prediction=NULL, newdata=NULL, n=10, rows=NULL, main=NULL, xlim=NULL) {
  UseMethod("diagnose_density")
}

diagnose_density.stanreg = function(model, prediction=NULL, newdata=NULL, n=10, rows=NULL, main=NULL, xlim=NULL) {
  dat = .stan_get_y_yhat(model, prediction, newdata, rows, n)
  .diagnose_density(dat$y, dat$yhat, n=n, main=main, xlim=xlim)
}

.diagnose_density = function(y, yhat, n=10, main, xlim) {
  dat = cbind(y, t(yhat[sample.int(nrow(yhat), n),]))
  dens = apply(dat, 2, density)
  xrn = range(dat)
  xsp = (xrn[2] - xrn[1])*0.05
  xrn = xrn + c(-xsp, xsp)
  yrn = max(sapply(dens, function(d) max(d$y)))
  if (is.null(main))
    main=bquote("Density of y & y"['sample'])
  if (is.null(xlim))
    xlim=xrn
  plot(dens[[1]], col="white", xlim=xlim, ylim=c(0, yrn),
       main=main, xlab='', ylab='', frame.plot = FALSE, yaxt='n')
  for (i in 2:(n+1)) {
    lines(dens[[i]], col='lightblue')
  }
  lines(dens[[1]], col='darkblue', lwd=2)
}
```
