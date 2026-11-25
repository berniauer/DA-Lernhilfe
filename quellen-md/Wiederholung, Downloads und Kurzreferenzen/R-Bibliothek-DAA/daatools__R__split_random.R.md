# daatools/R/split_random.R

```r
split_random = function(df, n, train_var, test_var, seed=1234) {
  df_name = gsub("[^a-zA-Z]", "", deparse(substitute(df)))
  if (df_name == "" && (missing(train_var) || missing(test_var))) {
    stop("Cannot parse df expression -> please specify names of train_var and test_var")
  }
  if (missing(train_var)) {
    train_var = paste0(df_name, "_train")
  }
  if (missing(test_var)) {
    test_var = paste0(df_name, "_test")
  }
  if (length(n) != 1L || !is.numeric(n) || is.na(n) ||
      !is.finite(n) || n != floor(n) || n < 0 || n > nrow(df)) {
    stop("n must be a whole number between 0 and nrow(df)")
  }
  set.seed(seed)
  index = sample.int(nrow(df))
  pfr = parent.frame()
  pfr[[train_var]] = df[index[seq_len(n)], , drop=FALSE]
  pfr[[test_var]] = df[index[seq_len(nrow(df) - n) + n], , drop=FALSE]
}
```
