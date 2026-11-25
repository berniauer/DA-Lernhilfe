# daatools/R/correlation.R

```r
plotcorr = function(x, ...) {
  UseMethod("plotcorr", x)
}

plotcorr.data.frame = function (x, include=NULL, exclude=NULL,
                                addCoef.col = 'white', addCoefasPercent = TRUE,
                                diag=FALSE, tl.cex=0.8, number.cex=0.7, method="color", ...) {
  x = .filter.columns(x, include=include, exclude=exclude, only.numeric=TRUE)
  corr = cor(x, use = 'pairwise')
  corrplot::corrplot(corr,
                     addCoef.col=addCoef.col, method=method,
                     addCoefasPercent=addCoefasPercent,
                     diag=diag, tl.cex=tl.cex, number.cex=number.cex, ...)
}

plotcorr.matrix = function (x, include=NULL, exclude=NULL,
                            addCoef.col = 'white', addCoefasPercent = TRUE,
                            diag=FALSE, tl.cex=0.8, number.cex=0.7, method="color", ...) {
  x = .filter.columns(x, include=include, exclude=exclude)
  corr = cor(x, use = 'pairwise')
  corrplot::corrplot(corr,
                     addCoef.col=addCoef.col, method=method,
                     addCoefasPercent=addCoefasPercent,
                     diag=diag, tl.cex=tl.cex, number.cex=number.cex, ...)
}

plotcorr.stanreg = function (x, include=NULL, exclude=NULL,
                             addCoef.col = 'white', addCoefasPercent = TRUE,
                             diag=FALSE, tl.cex=0.8, number.cex=0.7, method="color", ...) {
  m = .filter.columns(as.matrix(x), include=include, exclude=exclude)
  corrplot::corrplot(cor(m),
                     addCoef.col=addCoef.col, method=method,
                     addCoefasPercent=addCoefasPercent,
                     diag=diag, tl.cex=tl.cex, number.cex=number.cex, ...)
}


plotpairs = function(x, ...) {
  UseMethod("plotpairs", x)
}

plotpairs.stanreg = function(x, include=NULL, exclude=NULL, n = 500, ...) {
  posterior = as.matrix(x)
  posterior = .filter.columns(posterior, include=include, exclude=exclude)
  n = min(nrow(posterior), n)
  pairs(posterior[1:n, ], col=rgb(0,0,0.8, 0.1), pch=21, bg=rgb(0,0.4,0.8,0.1),
        diag.panel = .panel_hist, lower.panel = .panel.cor)
}

plotpairs.data.frame = function(x, include=NULL, exclude=NULL, n = 500, ...) {
  x = .filter.columns(x, include=include, exclude=exclude, only.numeric=TRUE)
  n = min(nrow(x), n)
  pairs(x[1:n, ], col=rgb(0,0,0.8, 0.1), pch=21, bg=rgb(0,0.4,0.8,0.1),
        diag.panel = .panel_hist, lower.panel = .panel.cor)
}

plotpairs.matrix = function(x, include=NULL, exclude=NULL, n = 500, ...) {
  x = .filter.columns(x, include=include, exclude=exclude)
  n = min(nrow(x), n)
  pairs(x[1:n,], col=rgb(0,0,0.8, 0.1), pch=21, bg=rgb(0,0.4,0.8,0.1),
        diag.panel = .panel_hist, lower.panel = .panel.cor)
}


# .panel_hist aus Dokumentation zu pairs() übernommen
.panel_hist <- function(x, ...)
{
  usr <- par("usr"); on.exit(par(usr=usr))
  par(usr = c(usr[1:2], 0, 1.5) )
  h <- hist(x, plot = FALSE)
  breaks <- h$breaks; nB <- length(breaks)
  y <- h$counts; y <- y/max(y)
  rect(breaks[-nB], 0, breaks[-1], y, ...)
}

## .panel_cor aus Dokumentation zu pairs() übernommen
.panel.cor <- function(x, y, digits = 2, prefix = "", cex.cor, ...)
{
  usr <- par("usr"); on.exit(par(usr=usr))
  par(usr = c(0, 1, 0, 1))
  r <- abs(cor(x, y))
  txt <- format(c(r, 0.123456789), digits = digits)[1]
  txt <- paste0(prefix, txt)
  if(missing(cex.cor)) cex.cor <- 0.8/strwidth(txt)
  text(0.5, 0.5, txt, cex = max(0.8, cex.cor * r))
}
```
