# daatools/NAMESPACE

```
exportPattern("^[[:alnum:]_]+$")

import(stats)
import(graphics)
importFrom("grDevices", "rgb")
importFrom("rlang", ".data")
importFrom("car", "crPlot")
# Load rstanarm before registering our predict.stanreg override.
importFrom("rstanarm", "posterior_linpred", "posterior_epred")

S3method(plotcoef, stanreg)
S3method(plotcoef, lm)
S3method(plotcoef, data.frame)
S3method(plotcoef, matrix)

S3method(effectsize, lm)
S3method(effectsize, glm)
S3method(effectsize, stanreg)
S3method(effectsize, lmerMod)
S3method(effectsize, glmerMod)

S3method(hdi, numeric)
S3method(hdi, matrix)
S3method(hdi, data.frame)
S3method(hdi, stanreg)

S3method(info, numeric)
S3method(info, integer)
S3method(info, Date)
S3method(info, character)
S3method(info, factor)
S3method(info, logical)
S3method(info, data.frame)
S3method(info, matrix)
S3method(info, lm)
S3method(info, stanreg)
S3method(print, daa_info_lm)
S3method(print, daa_info_df)
S3method(print, daa_info_stanreg)
S3method(print, daa_compare_coefs)

S3method(diagMCMC, stanreg)

S3method(plothist, numeric)
S3method(plothist, matrix)
S3method(plothist, stanreg)

S3method(hist, data.frame)
S3method(hist, tbl_df)
S3method(crPlot, stanreg)
S3method(predict, stanreg)

S3method(diagnose_density, stanreg)
S3method(diagnose_distribution, stanreg)
S3method(diagnose_fit, stanreg)
S3method(diagnose_y_vs_yhat, stanreg)
S3method(diagnose_residual, stanreg)
S3method(diagnose_residual_dist, stanreg)

S3method(plotcorr, data.frame)
S3method(plotcorr, matrix)
S3method(plotcorr, stanreg)
S3method(plotpairs, data.frame)
S3method(plotpairs, matrix)
S3method(plotpairs, stanreg)
```
