<!-- Quelle: Wiederholung, Downloads und Kurzreferenzen/Downloads  Kurzreferenzen/Base-R-cheatsheet.pdf -->

|     |     |     |     | Vectors |     |     |     |     | Programming |     |     |     |
| --- | --- | --- | --- | ------- | --- | --- | --- | --- | ----------- | --- | --- | --- |
Base R
|     |     |     | Creating Vectors |     |     |     | For Loop |     |     |     | While Loop |     |
| --- | --- | --- | ---------------- | --- | --- | --- | -------- | --- | --- | --- | ---------- | --- |
Cheat Sheet
Join elements into
c(2, 4, 6) 2 4 6 for (variable in sequence){  while (condition){
a vector
|     |              |     |     |           |             | Do something  |     |     |     | Do something  |     |     |
| --- | ------------ | --- | --- | --------- | ----------- | ------------- | --- | --- | --- | ------------- | --- | --- |
|     | Getting Help |     |     |           | An integer  |               |     |     |     |               |     |     |
|     |              | 2:6 |     | 2 3 4 5 6 |             |               |     |     |     |               |     |     |
sequence
|     |                          |                   |     |             |            | }   |         |     |     | }   |         |     |
| --- | ------------------------ | ----------------- | --- | ----------- | ---------- | --- | ------- | --- | --- | --- | ------- | --- |
|     | Accessing the help files |                   |     |             | A complex  |     | Example |     |     |     | Example |     |
|     |                          | seq(2, 3, by=0.5) |     | 2.0 2.5 3.0 |            |     |         |     |     |     |         |     |
sequence
| ?mean   |     |     |     |     |     | for (i in 1:4){  |     |     |     | while (i < 5){  |     |     |
| ------- | --- | --- | --- | --- | --- | ---------------- | --- | --- | --- | --------------- | --- | --- |
Get help of a particular function.  rep(1:2, times=3) 1 2 1 2 1 2 Repeat a vector j <- i + 10  print(i)
help.search(‘weighted mean’)
|                                              |     |                  |     |             |                  | print(j)  |     |     |     | i <- i + 1  |     |     |
| -------------------------------------------- | --- | ---------------- | --- | ----------- | ---------------- | --------- | --- | --- | --- | ----------- | --- | --- |
| Search the help files for a word or phrase.  |     | rep(1:2, each=3) |     | 1 1 1 2 2 2 | Repeat elements  |           |     |     |     |             |     |     |
of a vector
| help(package = ‘dplyr’)  |     |     |     |     |     | }   |     |     |     | }   |     |     |
| ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Find help for a package.
Vector Functions
|     | More about an object |           |     |          |     |     | If Statements |     |     |     | Functions |     |
| --- | -------------------- | --------- | --- | -------- | --- | --- | ------------- | --- | --- | --- | --------- | --- |
|     |                      | sort(x)   |     | rev(x)   |     |     |               |     |     |     |           |     |
Return x sorted. Return x reversed. if (condition){  function_name <- function(var){
str(iris)
|                                           |     | table(x)              |     | unique(x)          |     | Do something  |     |     |     |               |     |     |
| ----------------------------------------- | --- | --------------------- | --- | ------------------ | --- | ------------- | --- | --- | --- | ------------- | --- | --- |
| Get a summary of an object’s structure.   |     |                       |     |                    |     |               |     |     |     | Do something  |     |     |
|                                           |     | See counts of values. |     | See unique values. |     | } else {      |     |     |     |               |     |     |
class(iris)
Do something different
return(new_variable)
Find the class an object belongs to.
|     |     |     |     |     |     | }   |     |     |     | }   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Selecting Vector Elements
|     |     |     |     |     |     |     | Example |     |     |     | Example |     |
| --- | --- | --- | --- | --- | --- | --- | ------- | --- | --- | --- | ------- | --- |
Using Libraries
By Position
|     |     |     |     |     |     | if (i > 3){  |     |     |     | square <- function(x){  |     |     |
| --- | --- | --- | --- | --- | --- | ------------ | --- | --- | --- | ----------------------- | --- | --- |
install.packages(‘dplyr’)
|     |     |     | x[4] | The fourth element. |     | print(‘Yes’)  |     |     |     |     |     |     |
| --- | --- | --- | ---- | ------------------- | --- | ------------- | --- | --- | --- | --- | --- | --- |
squared <- x*x
Download and install a package from CRAN.
} else {
print(‘No’)
|     |     |     | x[-4] | All but the fourth. |     |     |     |     |     | return(squared)  |     |     |
| --- | --- | --- | ----- | ------------------- | --- | --- | --- | --- | --- | ---------------- | --- | --- |
library(dplyr)
|     |     |     |     |     |     | }   |     |     |     | }   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Load the package into the session, making all
| its functions available to use.   |     |     | x[2:4] | Elements two to four. |     |     |     |     |     |     |     |     |
| --------------------------------- | --- | --- | ------ | --------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
Reading and Writing Data
| dplyr::select   |     |     |     | All elements except  |     |       |     |     |       |     |              |     |
| --------------- | --- | --- | --- | -------------------- | --- | ----- | --- | --- | ----- | --- | ------------ | --- |
|                 |     |     |     |                      |     | Input |     |     | Ouput |     | Description  |     |
x[-(2:4)]
| Use a particular function from a package.  |     |     |     | two to four. |     |     |     |     |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- |
Read and write a delimited text
|             |     |            |     | Elements one and  |     | df <- read.table(‘file.txt’) |     |     | write.table(df, ‘file.txt’) |     |     |     |
| ----------- | --- | ---------- | --- | ----------------- | --- | ---------------------------- | --- | --- | --------------------------- | --- | --- | --- |
| data(iris)  |     | x[c(1, 5)] |     |                   |     |                              |     |     |                             |     |     |     |
file.
five.
Load a built-in dataset into the environment.
By Value
Read and write a comma
Working Directory
|     |     |            |     | Elements which  |     |                            |     |     |                           |     |     | separated value file. This is a  |
| --- | --- | ---------- | --- | --------------- | --- | -------------------------- | --- | --- | ------------------------- | --- | --- | -------------------------------- |
|     |     |            |     |                 |     | df <- read.csv(‘file.csv’) |     |     | write.csv(df, ‘file.csv’) |     |     |                                  |
|     |     | x[x == 10] |     |                 |     |                            |     |     |                           |     |     | special case of read.table/      |
are equal to 10.
write.table.
getwd()
All elements less
x[x < 0]
Find the current working directory (where
than zero.
Read and write an R data file, a
inputs are found and outputs are sent).  load(‘file.RData’) save(df, file = ’file.Rdata’)
|     |     |             | x[x %in%   | Elements in the set  |     |     |     |     |     |     |     | file type special for R.  |
| --- | --- | ----------- | ---------- | -------------------- | --- | --- | --- | --- | --- | --- | --- | ------------------------- |
|     |     | c(1, 2, 5)] |            | 1, 2, 5.             |     |     |     |     |     |     |     |                           |
setwd(‘C://file/path’)
Change the current working directory.
|     |     |     | Named Vectors  |     |     |     |        |           |                    |        | Greater than  |          |
| --- | --- | --- | -------------- | --- | --- | --- | ------ | --------- | ------------------ | ------ | ------------- | -------- |
|     |     |     |                |     |     |     | a == b | Are equal | a > b Greater than | a >= b |               | is.na(a) |
or equal to Is missing
Conditions
Use projects in RStudio to set the working
|     |     |     |     | Element with  |     |     |     |     |     |     | Less than or  |     |
| --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- | ------------- | --- |
x[‘apple’] a != b Not equal a < b Less than a <= b is.null(a) Is null
directory to the folder you are working in.   name ‘apple’. equal to
RStudio® is a trademark of RStudio, Inc.  •  CC BY Mhairi McNeill  •  mhairihmcneill@gmail.com   Learn more at web page or vignette  •  package  version  •  Updated: 3/15

Types
|     |     |     |     |     |     |     |     |     | Matrixes |     |     |     |     |     |     | Strings  |     |     | Also see the stringr library. |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- | -------- | --- | --- | ----------------------------- | --- | --- | --- |
m <- matrix(x, nrow = 3, ncol = 3)
|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | paste(x, y, sep = ' ')  |     |     |     | Join multiple vectors together. |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------------- | --- | --- | --- | ------------------------------- | --- | --- | --- |
Converting between common data types in R. Can always go
 Create a matrix from x.
from a higher value in the table to a lower value.
paste(x, collapse = ' ')
Join elements of a vector together.
t(m)
|     |     |     |     |     |     |     | wwm[2,  ] - Select a row |     |     |     |     |     |     |     | grep(pattern, x) |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | ---------------- | --- | --- | --- | --- | --- | --- | --- |
Find regular expression matches in x.
|            |                   |     |     |                                 |     |     | ww  |     |     |     |     |     | Transpose  |                           |     |     |     |     |                                     |     |     |     |
| ---------- | ----------------- | --- | --- | ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | ------------------------- | --- | --- | --- | --- | ----------------------------------- | --- | --- | --- |
| as.logical | TRUE, FALSE, TRUE |     |     | Boolean values (TRUE or FALSE). |     |     | ww  |     |     |     |     |     |            |                           |     |     |     |     |                                     |     |     |     |
|            |                   |     |     |                                 |     |     |     |     |     |     |     |     | m %*% n    | gsub(pattern, replace, x) |     |     |     |     | Replace matches in x with a string. |     |     |     |
wwm[ , 1] - Select a  column
Integers or floating point  ww Matrix Multiplication  toupper(x) Convert to uppercase.
| as.numeric | 1, 0, 1 |     |     |     |          |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ---------- | ------- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|            |         |     |     |     | numbers. |     | ww  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
solve(m, n)
|     |     |     |     |     |     |     |                                |     |     |     |     |     |                      |     |     | tolower(x) |     |     | Convert to lowercase. |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------------------------ | --- | --- | --- | --- | --- | -------------------- | --- | --- | ---------- | --- | --- | --------------------- | --- | --- | --- |
|     |     |     |     |     |     |     | wwm[2, 3] -  Select an element |     |     |     |     |     | Find x in: m * x = n |     |     |            |     |     |                       |     |     |     |
Character strings. Generally
| as.character | '1', '0', '1' |           |        |                       |                                        |     | ww  |     |       |     |     |     |     |     |     | nchar(x) |     |          |                                    |     |     |     |
| ------------ | ------------- | --------- | ------ | --------------------- | -------------------------------------- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | -------- | --- | -------- | ---------------------------------- | --- | --- | --- |
|              |               |           |        | preferred to factors. |                                        |     | ww  |     |       |     |     |     |     |     |     |          |     |          | Number of characters in a string.  |     |     |     |
|              | ' 1 ' ,   ' 0 | ' ,   ' 1 | ' ,    | Ch a ra c t           | e r s t ri n g s  w i t h   p re s et  |     |     |     | Lists |     |     |     |     |     |     |          |     |          |                                    |     |     |     |
| as.factor    |               |           |        |                       |                                        |     |     |     |       |     |     |     |     |     |     |          |     | Factors  |                                    |     |     |     |
|              | l e v e l s : |   ' 1 ' , |   ' 0' | le v e ls             | .  N e e d e d   fo r   s o m e        |     |     |     |       |     |     |     |     |     |     |          |     |          |                                    |     |     |     |
statistical models.
l <- list(x = 1:5, y = c('a', 'b'))  factor(x)  cut(x, breaks = 4)
 A list is collection of elements which can be of different types.
Maths Functions  Turn a vector into a factor. Can  Turn a numeric vector into a
|             |                     |     |             |     |                   |                 |        |                 |             |                |     |     |                | set the levels of the factor and  |                |            |             |     |                       | factor by ‘cutting’ into  |             |     |
| ----------- | ------------------- | --- | ----------- | --- | ----------------- | --------------- | ------ | --------------- | ----------- | -------------- | --- | --- | -------------- | --------------------------------- | -------------- | ---------- | ----------- | --- | --------------------- | ------------------------- | ----------- | --- |
|             |                     |     |             |     |                   |                 | l[[2]] |                 | l[1]        |                | l$x |     | l['y']         |                                   |                |            |             |     |                       |                           |             |     |
| log(x)      | Natural log.        |     | sum(x)      |     | Sum.              |                 |        |                 |             |                |     |     |                |                                   |                | the order. |             |     |                       | sections.                 |             |     |
|             |                     |     |             |     |                   |                 |        | New list with   |             |                |     |     | New list with  |                                   |                |            |             |     |                       |                           |             |     |
| exp(x)      |                     |     | mean(x)     |     |                   | Second element  |        |                 |             | Element named  |     |     |                |                                   |                |            |             |     |                       |                           |             |     |
|             | Exponential.        |     |             |     | Mean.             |                 |        |                 |             |                |     |     |                |                                   |                |            |             |     |                       |                           |             |     |
|             |                     |     |             |     |                   |                 |        | only the first  |             |                |     |     | only element   |                                   |                |            | Statistics  |     |                       |                           |             |     |
|             |                     |     |             |     |                   |                 | of l.  |                 |             |                | x.  |     |                |                                   |                |            |             |     |                       |                           |             |     |
| max(x)      |                     |     | median(x)   |     |                   |                 |        | element.        |             |                |     |     | named y.       |                                   |                |            |             |     |                       |                           |             |     |
|             | Largest element.    |     |             |     | Median.           |                 |        |                 |             |                |     |     |                |                                   |                |            |             |     |                       |                           |             |     |
| min(x)      | Smallest element.   |     | quantile(x) |     | Percentage        |                 |        |                 |             |                |     |     |                |                                   |                |            |             |     |                       |                           |             |     |
|             |                     |     |             |     |                   |                 |        |                 |             |                |     |     |                | lm(x ~ y, data=df)                |                |            |             |     |                       |                           | prop.test   |     |
|             |                     |     |             |     |                   | Also see the    |        |                 |             |                |     |     |                |                                   |                |            |             |     | t.test(x, y)          |                           |             |     |
|             |                     |     |             |     | quantiles.        |                 |        |                 | Data Frames |                |     |     |                |                                   |                |            |             |     |                       |                           |             |     |
|             |                     |     |             |     |                   |                 |        |                 |             |                |     |     |                |                                   | Linear model.  |            |             |     |                       |                           | Test for a  |     |
|             |                     |     |             |     |                   | dplyr library.  |        |                 |             |                |     |     |                |                                   |                |            |             |     | Preform a t-test for  |                           |             |     |
| round(x, n) |                     |     | rank(x)     |     |                   |                 |        |                 |             |                |     |     |                |                                   |                |            |             |     |                       |                           |             |     |
|             | Round to n decimal  |     |             |     | Rank of elements. |                 |        |                 |             |                |     |     |                |                                   |                |            |             |     |                       |                           | difference  |     |
difference between
|     | places. |     |     |     |     |     |     |     |     |     |     |     |     | glm(x ~ y, data=df)  |     |     |     |     |         |     |          |     |
| --- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- | --- | ------- | --- | -------- | --- |
|     |         |     |     |     |     |     |     |     |     |     |     |     |     |                      |     |     |     |     | means.  |     | between  |     |
df <- data.frame(x = 1:3, y = c('a', 'b', 'c'))
|     |     |     |     |     |     |     |     |     |     |     |     |     |     | Generalised linear model.  |     |     |     |     |     |     | proportions.  |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------------------- | --- | --- | --- | --- | --- | --- | ------------- | --- |
signif(x, n) var(x) A special case of a list where all elements are the same length.
|     | Round to n           |     |     |     | The variance. |     |     |     |     |     |                 |     |     |     |     |          |     |                  |     |     |     |     |
| --- | -------------------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --------------- | --- | --- | --- | --- | -------- | --- | ---------------- | --- | --- | --- | --- |
|     | significant figures. |     |     |     |               |     |     |     |     |     |                 |     |     |     |     |          |     | pairwise.t.test  |     |     |     |     |
|     |                      |     |     |     |               |     |     |     |     |     | List subsetting |     |     |     |     | summary  |     |                  |     |     |     |     |
aov
Preform a t-test for
cor(x, y) Correlation. sd(x) The standard  Get more detailed information  Analysis of
|     |     |     |     |     |            |     | x   | y   |      |     |     |         |     |     |               |     |     |     |  paired data. |     |            |     |
| --- | --- | --- | --- | --- | ---------- | --- | --- | --- | ---- | --- | --- | ------- | --- | --- | ------------- | --- | --- | --- | ------------- | --- | ---------- | --- |
|     |     |     |     |     | deviation. |     |     |     |      |     |     |         |     |     |  out a model. |     |     |     |               |     | variance.  |     |
|     |     |     |     |     |            |     |     |     | df$x |     |     | df[[2]] |     |     |               |     |     |     |               |     |            |     |
|     |     |     |     |     |            |     | 1   | a   |      |     |     |         |     |     |               |     |     |     |               |     |            |     |
Variable Assignment
Distributions
|     |     |     |     |     |     |     | 2   | b   |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Understanding a data frame
| > a <- 'apple'  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | Random  |     | Density  |     | Cumulative  |     |     |
| --------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- | --- | -------- | --- | ----------- | --- | --- |
Quantile
| > a  |     |     |     |     |     |     |     |     |     |     |     | See the full data  |     |     |     | Variates  |     | Function |     | Distribution |     |     |
| ---- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------ | --- | --- | --- | --------- | --- | -------- | --- | ------------ | --- | --- |
View(df)
|             |     |     |     |     |     |     | 3   | c   |     |     |     |        |     |        |     |       |     |       |     |       |     |       |
| ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ | --- | ------ | --- | ----- | --- | ----- | --- | ----- | --- | ----- |
| [1] 'apple' |     |     |     |     |     |     |     |     |     |     |     | frame. |     | Normal |     | rnorm |     | dnorm |     | pnorm |     | qnorm |
See the first 6
|     |                 |     |     |     |     | Matrix subsetting |     |     |     | head(df) |     |       |     | Poison   |     | rpois  |     | dpois  |     | ppois  |        | qpois |
| --- | --------------- | --- | --- | --- | --- | ----------------- | --- | --- | --- | -------- | --- | ----- | --- | -------- | --- | ------ | --- | ------ | --- | ------ | ------ | ----- |
|     | The Environment |     |     |     |     |                   |     |     |     |          |     | rows. |     |          |     |        |     |        |     |        |        |       |
|     |                 |     |     |     |     |                   |     |     |     |          |     |       |     | Binomial |     | rbinom |     | dbinom |     | pbinom | qbinom |       |
df[ , 2]
nrow(df)
ls() List all variables in the  cbind - Bind columns. Uniform runif dunif punif qunif
Number of rows.
environment.
| rm(x) |     | Remove x from the  |     |     |     |         |     |     |            |     |     |     |     |     |            |     |     |     |                               |     |     |     |
| ----- | --- | ------------------ | --- | --- | --- | ------- | --- | --- | ---------- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | ----------------------------- | --- | --- | --- |
|       |     |                    |     |     |     |         |     |     | ncol(df)   |     |     |     |     |     | Plotting   |     |     |     | Also see the ggplot2 library. |     |     |     |
|       |     | environment.       |     |     |     | df[2, ] |     |     | Number of  |     |     |     |     |     |            |     |     |     |                               |     |     |     |
columns.
| rm(list = ls()) |     | Remove all variables from the  |     |     |     |     |     |     |     |     |     |                    |     |     |     |          |     |     |             |     |     |          |
| --------------- | --- | ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------------ | --- | --- | --- | -------- | --- | --- | ----------- | --- | --- | -------- |
|                 |     |                                |     |     |     |     |     |     |     |     |     | rbind - Bind rows. |     |     |     | plot(x)  |     |     | plot(x, y)  |     |     | hist(x)  |
environment.
|     |     |     |     |     |     |     |     |     | dim(df)    |     |     |     |     |     |     | Values of x in  |     |     | Values of x  |     | Histogram of  |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- | --- | --- | --------------- | --- | --- | ------------ | --- | ------------- | --- |
|     |     |     |     |     |     |     |     |     | Number of  |     |     |     |     |     |     | order.          |     |     | against y.   |     |               | x.  |
You can use the environment panel in RStudio to
|     |     |     |     |     |     | df[2, 2] |     |     | columns and  |     |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | -------- | --- | --- | ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
browse variables in your environment.
|     |     |     |     |     |     |     |     |     | rows. |     |     |     |     |     |     | Dates  |     |     |     | See the lubridate library. |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | -------------------------- | --- | --- |
RStudio® is a trademark of RStudio, Inc.  •  CC BY Mhairi McNeill  •  mhairihmcneill@gmail.com  •  844-448-1212 • rstudio.com  Learn more at web page or vignette  •  package  version  •  Updated: 3/15