<!-- Quelle: Wiederholung, Downloads und Kurzreferenzen/Downloads  Kurzreferenzen/R-short-refcard.pdf -->

|     | R Reference | Card |     |                                                              |     |     |     |               |                     |     |
| --- | ----------- | ---- | --- | ------------------------------------------------------------ | --- | --- | --- | ------------- | ------------------- | --- |
|     |             |      |     | characterorfactorcolumnsaresurroundedbyquotes(");sepisthe    |     |     |     | Indexinglists |                     |     |
|     |             |      |     | fieldseparator;eolistheend-of-lineseparator;naisthestringfor |     |     |     | x[n]          | listwithelementsn   |     |
|     |             |      |     | missingvalues;usecol.names=NAtoaddablankcolumnheaderto       |     |     |     | x[[n]]        | nthelementofthelist |     |
byTomShort,EPRIPEAC,tshort@epri-peac.com2004-11-07
|                           |                                      |     |     | getthecolumnheadersalignedcorrectlyforspreadsheetinput |     |     |     | x[["name"]]elementofthelistnamed"name" |     |     |
| ------------------------- | ------------------------------------ | --- | --- | ------------------------------------------------------ | --- | --- | --- | -------------------------------------- | --- | --- |
| Grantedtothepublicdomain. | Seewww.Rpad.orgforthesourceandlatest |     |     |                                                        |     |     |     |                                        |     |     |
|                           |                                      |     |     | sink(file)outputtofile,untilsink()                     |     |     |     | x$name                                 | id. |     |
version. IncludesmaterialfromRforBeginnersbyEmmanuelParadis(with
permission). MostoftheI/Ofunctionshaveafileargument.Thiscanoftenbeacharac- Indexingmatrices
|     |     |     |     | terstringnamingafileoraconnection.file=""meansthestandardinputor |     |     |     | x[i,j] | elementatrowi,columnj |     |
| --- | --- | --- | --- | ---------------------------------------------------------------- | --- | --- | --- | ------ | --------------------- | --- |
|     |     |     |     |                                                                  |     |     |     | x[i,]  | rowi                  |     |
output.Connectionscanincludefiles,pipes,zippedfiles,andRvariables.
|     |     |     |     | On windows, | the file connection | can also be | used with description | = x[,j] | columnj |     |
| --- | --- | --- | --- | ----------- | ------------------- | ----------- | --------------------- | ------- | ------- | --- |
Gettinghelp "clipboard".ToreadatablecopiedfromExcel,use x[,c(1,3)]columns1and3
|     |     |     |     | x <- read.delim("clipboard") |     |     |     | x["name",]rownamed"name" |     |     |
| --- | --- | --- | --- | ---------------------------- | --- | --- | --- | ------------------------ | --- | --- |
MostRfunctionshaveonlinedocumentation.
TowriteatabletotheclipboardforExcel,use Indexingdataframes(matrixindexingplusthefollowing)
help(topic)documentationontopic
|     |     |     |     | write.table(x,"clipboard",sep="\t",col.names=NA) |     |     |     | x[["name"]]columnnamed"name" |     |     |
| --- | --- | --- | --- | ------------------------------------------------ | --- | --- | --- | ---------------------------- | --- | --- |
?topicid.
|     |     |     |     | For database | interaction, see | packages RODBC, | DBI, RMySQL, RPgSQL, | and x$name | id. |     |
| --- | --- | --- | --- | ------------ | ---------------- | --------------- | -------------------- | ---------- | --- | --- |
help.search("topic")searchthehelpsystem
ROracle.SeepackagesXML,hdf5,netCDFforreadingotherfileformats.
apropos("topic")thenamesofallobjectsinthesearchlistmatching
Datacreation
theregularexpression”topic”
Variableconversion
help.start()starttheHTMLversionofhelp c(...) genericfunctiontocombineargumentswiththedefaultforminga
str(a)displaytheinternal*str*uctureofanRobject vector;withrecursive=TRUEdescendsthroughlistscombiningall as.array(x), as.data.frame(x), as.numeric(x),
summary(a)givesa“summary”ofa,usuallyastatisticalsummarybutitis
elementsintoonevector as.logical(x), as.complex(x), as.character(x),
genericmeaningithasdifferentoperationsfordifferentclassesofa from:togeneratesasequence;“:”hasoperatorpriority;1:4+1is“2,3,4,5”
...converttype;foracompletelist,usemethods(as)
ls() show objects in the search path; specify pat="pat" to search on a seq(from,to) generates a sequence by= specifies increment; length=
Variableinformation
| pattern |     |     |     | specifiesdesiredlength |     |     |     |     |     |     |
| ------- | --- | --- | --- | ---------------------- | --- | --- | --- | --- | --- | --- |
ls.str()str()foreachvariableinthesearchpath seq(along=x) generates 1, 2, ..., length(along); useful for for is.na(x), is.null(x), is.array(x), is.data.frame(x),
dir()showfilesinthecurrentdirectory loops is.numeric(x), is.complex(x), is.character(x),
methods(a)showsS3methodsofa rep(x,times) replicate x times; use each= to repeat “each” el- ...testfortype;foracompletelist,usemethods(is)
methods(class=class(a))listsallthemethodstohandleobjectsof ement of x each times; rep(c(1,2,3),2) is 1 2 3 1 2 3; length(x)numberofelementsinx
classa rep(c(1,2,3),each=2)is112233 dim(x)Retrieveorsetthedimensionofanobject;dim(x) <- c(3,2)
Inputandoutput data.frame(...) create a data frame of the named or unnamed dimnames(x)Retrieveorsetthedimensionnamesofanobject
data.frame(v=1:4,ch=c("a","B","c","d"),n=10); nrow(x)numberofrows;NROW(x)isthesamebuttreatsavectorasaone-
arguments;
load()loadthedatasetswrittenwithsave shortervectorsarerecycledtothelengthofthelongest rowmatrix
data(x)loadsspecifieddatasets
|     |     |     |     | list(...) | create a list | of the named | or unnamed arguments; | ncol(x)andNCOL(x)id.forcolumns |     |     |
| --- | --- | --- | --- | --------- | ------------- | ------------ | --------------------- | ------------------------------ | --- | --- |
library(x)loadadd-onpackages
|                  |                                           |                 |                    | list(a=c(1,2),b="hi",c=3i);                       |       |              |                    | class(x)getorsettheclassofx;class(x)      |     | <- "myclass" |
| ---------------- | ----------------------------------------- | --------------- | ------------------ | ------------------------------------------------- | ----- | ------------ | ------------------ | ----------------------------------------- | --- | ------------ |
| read.table(file) | reads a file                              | in table format | and creates a data |                                                   |       |              |                    |                                           |     |              |
|                  |                                           |                 |                    | array(x,dim=)                                     | array | with data x; | specify dimensions | like unclass(x)removetheclassattributeofx |     |              |
| framefromit;     | thedefaultseparatorsep=""isanywhitespace; |                 | use                |                                                   |       |              |                    |                                           |     |              |
|                  |                                           |                 |                    | dim=c(3,4,2);elementsofxrecycleifxisnotlongenough |       |              |                    | attr(x,which)getorsettheattributewhichofx |     |              |
header=TRUEtoreadthefirstlineasaheaderofcolumnnames;use
matrix(x,nrow=,ncol=)matrix;elementsofxrecycle attributes(obj)getorsetthelistofattributesofobj
as.is=TRUEtopreventcharactervectorsfrombeingconvertedtofac-
|     |     |     |     | factor(x,levels=)encodesavectorxasafactor |     |     |     | Dataselectionandmanipulation |     |     |
| --- | --- | --- | --- | ----------------------------------------- | --- | --- | --- | ---------------------------- | --- | --- |
tors;usecomment.char=""toprevent"#"frombeinginterpretedas
gl(n,k,length=n*k,labels=1:n)generatelevels(factors)byspec-
acomment;useskip=ntoskipnlinesbeforereadingdata;seethe ifyingthepatternoftheirlevels;kisthenumberoflevels,andnis which.max(x)returnstheindexofthegreatestelementofx
helpforoptionsonrownaming,NAtreatment,andothers thenumberofreplications which.min(x)returnstheindexofthesmallestelementofx
read.csv("filename",header=TRUE)id. butwithdefaultssetfor expand.grid()adataframefromallcombinationsofthesuppliedvec- rev(x)reversestheelementsofx
readingcomma-delimitedfiles sort(x)sortstheelementsofxinincreasingorder;tosortindecreasing
torsorfactors
read.delim("filename",header=TRUE)id. butwithdefaultsset order:rev(sort(x))
|     |     |     |     | rbind(...) | combineargumentsbyrowsformatrices,dataframes,and |     |     |     |     |     |
| --- | --- | --- | --- | ---------- | ------------------------------------------------ | --- | --- | --- | --- | --- |
forreadingtab-delimitedfiles cut(x,breaks)dividesxintointervals(factors);breaksisthenumber
others
read.fwf(file,widths,header=FALSE,sep=""(cid:127),as.is=FALSE) ofcutintervalsoravectorofcutpoints
cbind(...)id.bycolumns
readatableoffixedwidthformatteddataintoa’data.frame’;widths match(x, y)returnsavectorofthesamelengththanxwiththeelements
Slicingandextractingdata
isanintegervector,givingthewidthsofthefixed-widthfields ofxwhichareiny(NAotherwise)
save(file,...) savesthespecifiedobjects(...) intheXDRplatform- Indexingvectors which(x == a)returnsavectoroftheindicesofxifthecomparisonop-
independentbinaryformat x[n] nthelement erationistrue(TRUE),inthisexamplethevaluesofiforwhichx[i]
save.image(file)savesallobjects x[-n] allbutthenthelement == a(theargumentofthisfunctionmustbeavariableofmodelogi-
| cat(..., file="", | sep=" ")printstheargumentsaftercoercingto |     |     |        |     |                |     |     |      |     |
| ----------------- | ----------------------------------------- | --- | --- | ------ | --- | -------------- | --- | --- | ---- | --- |
|                   |                                           |     |     | x[1:n] |     | firstnelements |     |     | cal) |     |
character;sepisthecharacterseparatorbetweenarguments choose(n, k)computesthecombinationsofkeventsamongnrepetitions
|     |     |     |     | x[-(1:n)] |     | elementsfromn+1totheend |     |     |     |     |
| --- | --- | --- | --- | --------- | --- | ----------------------- | --- | --- | --- | --- |
print(a, ...)printsitsarguments;generic,meaningitcanhavediffer- x[c(1,4,2)] =n!/[(n−k)!k!]
specificelements
entmethodsfordifferentobjects x["name"] elementnamed"name" na.omit(x) suppresses the observations with missing data (NA) (sup-
format(x,...)formatanRobjectforprettyprinting x[x > 3] allelementsgreaterthan3 pressesthecorrespondinglineifxisamatrixoradataframe)
write.table(x,file="",row.names=TRUE,col.names=TRUE, x[x > 3 & x < 5] allelementsbetween3and5 na.fail(x)returnsanerrormessageifxcontainsatleastoneNA
| sep=" ")printsxafterconvertingtoadataframe;ifquoteisTRUE, |     |     |     | x[x %in% c("a","and","the")]elementsinthegivenset |     |     |     |     |     |     |
| --------------------------------------------------------- | --- | --- | --- | ------------------------------------------------- | --- | --- | --- | --- | --- | --- |

unique(x)ifxisavectororadataframe,returnsasimilarobjectbutwith fft(x)FastFourierTransformofanarray nchar(x)numberofcharacters
theduplicateelementssuppressed mvfft(x)FFTofeachcolumnofamatrix DatesandTimes
table(x) returns a table with the numbers of the differents values of x filter(x,filter)applieslinearfilteringtoaunivariatetimeseriesor
TheclassDatehasdateswithouttimes.POSIXcthasdatesandtimes,includ-
| (typicallyforintegersorfactors) |     |     |     | toeachseriesseparatelyofamultivariatetimeseries |     |     |     |               |                  |                                  |
| ------------------------------- | --- | --- | --- | ----------------------------------------------- | --- | --- | --- | ------------- | ---------------- | -------------------------------- |
|                                 |     |     |     |                                                 |     |     |     | ingtimezones. | Comparisons(e.g. | >),seq(),anddifftime()areuseful. |
subset(x, ...) returnsaselectionofxwithrespecttocriteria(..., Manymathfunctionshavealogicalparameterna.rm=FALSEtospecifymiss-
Datealsoallows+and−.?DateTimeClassesgivesmoreinformation.See
| typicallycomparisons: |     | x$V1 < 10);ifxisadataframe,theoption |     | ingdata(NA)removal. |     |     |     |     |     |     |
| --------------------- | --- | ------------------------------------ | --- | ------------------- | --- | --- | --- | --- | --- | --- |
alsopackagechron.
| selectgivesthevariablestobekeptordroppedusingaminussign |     |     |     | Matrices |     |     |     |     |     |     |
| ------------------------------------------------------- | --- | --- | --- | -------- | --- | --- | --- | --- | --- | --- |
sample(x, size)resamplerandomlyandwithoutreplacementsizeele- as.Date(s) and as.POSIXct(s) convert to the respective class;
mentsinthevectorx,theoptionreplace = TRUEallowstoresample t(x)transpose format(dt)convertstoastringrepresentation. Thedefaultstring
withreplacement diag(x)diagonal formatis“2001-02-21”.Theseacceptasecondargumenttospecifya
prop.table(x,margin=)tableentriesasfractionofmarginaltable %*%matrixmultiplication formatforconversion.Somecommonformatsare:
|     |     |     |     | solve(a,b)solvesa | %*% | x = bforx |     |     |     |     |
| --- | --- | --- | --- | ----------------- | --- | --------- | --- | --- | --- | --- |
Math
solve(a)matrixinverseofa
%a,%AAbbreviatedandfullweekdayname.
sin,cos,tan,asin,acos,atan,atan2,log,log10,exp rowsum(x)sumofrowsforamatrix-likeobject;rowSums(x)isafaster %b,%BAbbreviatedandfullmonthname.
max(x)maximumoftheelementsofx version %dDayofthemonth(01–31).
min(x)minimumoftheelementsofx colsum(x),colSums(x)id.forcolumns %HHours(00–23).
range(x)id.thenc(min(x), max(x)) rowMeans(x)fastversionofrowmeans %IHours(01–12).
sum(x)sumoftheelementsofx colMeans(x)id.forcolumns %jDayofyear(001–366).
diff(x)laggedanditerateddifferencesofvectorx Advanceddataprocessing %mMonth(01–12).
prod(x)productoftheelementsofx
%MMinute(00–59).
mean(x)meanoftheelementsofx apply(X,INDEX,FUN=)avectororarrayorlistofvaluesobtainedby
%pAM/PMindicator.
| median(x)medianoftheelementsofx |     |     |     | applyingafunctionFUNtomargins(INDEX)ofX |     |     |     |     |     |     |
| ------------------------------- | --- | --- | --- | --------------------------------------- | --- | --- | --- | --- | --- | --- |
%SSecondasdecimalnumber(00–61).
quantile(x,probs=)samplequantilescorrespondingtothegivenprob- lapply(X,FUN)applyFUNtoeachelementofthelistX
|     |     |     |     | tapply(X,INDEX,FUN=)applyFUNtoeachcellofaraggedarraygiven |     |     |     | %UWeek(00–53);thefirstSundayasday1ofweek1. |     |     |
| --- | --- | --- | --- | --------------------------------------------------------- | --- | --- | --- | ------------------------------------------ | --- | --- |
abilities(defaultsto0,.25,.5,.75,1) %wWeekday(0–6,Sundayis0).
byXwithindexesINDEX
weighted.mean(x, w)meanofxwithweightsw %WWeek(00–53);thefirstMondayasday1ofweek1.
by(data,INDEX,FUN)applyFUNtodataframedatasubsettedbyINDEX
rank(x)ranksoftheelementsofx %yYearwithoutcentury(00–99).Don’tuse.
merge(a,b)mergetwodataframesbycommoncolumnsorrownames
var(x)orcov(x)varianceoftheelementsofx(calculatedonn−1);ifxis %YYearwithcentury.
xtabs(a b,data=x)acontingencytablefromcross-classifyingfactors
amatrixoradataframe,thevariance-covariancematrixiscalculated %z(outputonly.)OffsetfromGreenwich;-0800is8hourswestof.
|     |     |     |     | aggregate(x,by,FUN)splitsthedataframexintosubsets, |     |     | computes |     |     |     |
| --- | --- | --- | --- | -------------------------------------------------- | --- | --- | -------- | --- | --- | --- |
sd(x)standarddeviationofx %Z(outputonly.)Timezoneasacharacterstring(emptyifnotavailable).
cor(x)correlationmatrixofxifitisamatrixoradataframe(1ifxisa summary statistics for each, and returns the result in a convenient
vector) form;byisalistofgroupingelements,eachaslongasthevariables
Whereleadingzerosareshowntheywillbeusedonoutputbutareoptional
| var(x, y) | or cov(x, | y) covariance between | x and y, or between | the inx |     |     |     |     |     |     |
| --------- | --------- | --------------------- | ------------------- | ------- | --- | --- | --- | --- | --- | --- |
oninput.See?strftime.
columnsofxandthoseofyiftheyarematricesordataframes stack(x, ...) transformdataavailableasseparatecolumnsinadata
frameorlistintoasinglecolumn
cor(x, y)linearcorrelationbetweenxandy,orcorrelationmatrixifthey
|     |     |     |     | unstack(x, | ...)inverseofstack() |     |     |     |     |     |
| --- | --- | --- | --- | ---------- | -------------------- | --- | --- | --- | --- | --- |
arematricesordataframes
|          |                                   |     |     | reshape(x, | ...) reshapes | a data frame between | ’wide’ format with |          |     |     |
| -------- | --------------------------------- | --- | --- | ---------- | ------------- | -------------------- | ------------------ | -------- | --- | --- |
| round(x, | n)roundstheelementsofxtondecimals |     |     |            |               |                      |                    | Plotting |     |     |
repeatedmeasurementsinseparatecolumnsofthesamerecordand
log(x, base)computesthelogarithmofxwithbasebase
’long’ format with the repeated measurements in separate records; plot(x)plotofthevaluesofx(onthey-axis)orderedonthex-axis
scale(x)ifxisamatrix,centersandreducesthedata;tocenteronlyuse
theoptioncenter=FALSE,toreduceonlyscale=FALSE(bydefault use(direction=”wide”)or(direction=”long”) plot(x, y)bivariateplotofx(onthex-axis)andy(onthey-axis)
center=TRUE, scale=TRUE) Strings hist(x)histogramofthefrequenciesofx
barplot(x)histogramofthevaluesofx;usehoriz=FALSEforhorizontal
| pmin(x,y,...) | a vector | which ith element is | the minimum of x[i], |                                                                  |     |     |     |      |     |     |
| ------------- | -------- | -------------------- | -------------------- | ---------------------------------------------------------------- | --- | --- | --- | ---- | --- | --- |
|               |          |                      |                      | paste(...)concatenatevectorsafterconvertingtocharacter;sep=isthe |     |     |     | bars |     |     |
y[i],...
stringtoseparateterms(asinglespaceisthedefault);collapse=is dotchart(x)ifxisadataframe,plotsaClevelanddotplot(stackedplots
pmax(x,y,...)id.forthemaximum
|     |     |     |     | anoptionalstringtoseparate“collapsed”results |     |     |     | line-by-lineandcolumn-by-column) |     |     |
| --- | --- | --- | --- | -------------------------------------------- | --- | --- | --- | -------------------------------- | --- | --- |
cumsum(x)avectorwhichithelementisthesumfromx[1]tox[i]
|                            |     |     |     | substr(x,start,stop)substringsinacharactervector; |     |                       | canalsoas- | pie(x)circularpie-chart |     |     |
| -------------------------- | --- | --- | --- | ------------------------------------------------- | --- | --------------------- | ---------- | ----------------------- | --- | --- |
| cumprod(x)id.fortheproduct |     |     |     | sign,assubstr(x,                                  |     | start, stop) <- value |            |                         |     |     |
boxplot(x)“box-and-whiskers”plot
cummin(x)id.fortheminimum strsplit(x,split)splitxaccordingtothesubstringsplit
|     |     |     |     |     |     |     |     | sunflowerplot(x, | y)id.thanplot()butthepointswithsimilarcoor- |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------- | ------------------------------------------- | --- |
cummax(x)id.forthemaximum grep(pattern,x)searchesformatchestopatternwithinx;see?regex
dinatesaredrawnasflowerswhichpetalnumberrepresentsthenum-
union(x,y),intersect(x,y),setdiff(x,y),setequal(x,y), gsub(pattern,replacement,x)replacementofmatchesdetermined
| is.element(el,set)“set”functions |     |     |     |                                                          |     |     |     | berofpoints |     |     |
| -------------------------------- | --- | --- | --- | -------------------------------------------------------- | --- | --- | --- | ----------- | --- | --- |
|                                  |     |     |     | byregularexpressionmatchingsub()isthesamebutonlyreplaces |     |     |     |             |     | x   |
Re(x)realpartofacomplexnumber stripplot(x) plot of the values of on a line (an alternative to
|     |     |     |     | thefirstoccurrence. |     |     |     | boxplot()forsmallsamplesizes) |     |     |
| --- | --- | --- | --- | ------------------- | --- | --- | --- | ----------------------------- | --- | --- |
Im(x)imaginarypart
tolower(x)converttolowercase coplot(x˜y | z)bivariateplotofxandyforeachvalueorintervalof
Mod(x)modulus;abs(x)isthesame
|     |     |     |     | toupper(x)converttouppercase |     |     |     | valuesofz |     |     |
| --- | --- | --- | --- | ---------------------------- | --- | --- | --- | --------- | --- | --- |
Arg(x)angleinradiansofthecomplexnumber
match(x,table)avectorofthepositionsoffirstmatchesfortheelements interaction.plot (f1, f2, y)iff1andf2arefactors,plotsthe
| Conj(x)complexconjugate |     |     |     | ofxamongtable |     |     |     |     |     |     |
| ----------------------- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | --- |
meansofy(onthey-axis)withrespecttothevaluesoff1(onthe
| convolve(x,y) | compute | the several kinds of | convolutions of two | se- x %in% | tableid.butreturnsalogicalvector |     |     |     |     |     |
| ------------- | ------- | -------------------- | ------------------- | ---------- | -------------------------------- | --- | --- | --- | --- | --- |
x-axis)andoff2(differentcurves);theoptionfunallowstochoose
quences pmatch(x,table)partialmatchesfortheelementsofxamongtable
thesummarystatisticofy(bydefaultfun=mean)

matplot(x,y)bivariateplotofthefirstcolumnofxvs.thefirstoneofy, mtext(text, side=3, line=0, ...) addstextgivenbytextin lty controls the type of lines, can be an integer or string (1: "solid",
thesecondoneofxvs.thesecondoneofy,etc. themarginspecifiedbyside(seeaxis()below);linespecifiesthe 2: "dashed", 3: "dotted", 4: "dotdash", 5: "longdash", 6:
fourfoldplot(x)visualizes,withquartersofcircles,theassociationbe- linefromtheplottingarea "twodash",orastringofuptoeightcharacters(between"0"and
tweentwodichotomousvariablesfordifferentpopulations(xmust segments(x0, y0, x1, y1)drawslinesfrompoints(x0,y0)topoints "9")whichspecifiesalternativelythelength,inpointsorpixels,of
beanarraywithdim=c(2, 2, k),oramatrixwithdim=c(2, 2)if (x1,y1) thedrawnelementsandtheblanks,forexamplelty="44"willhave
k=1) arrows(x0, y0, x1, y1, angle= 30, code=2)id.witharrows thesameeffectthanlty=2
assocplot(x)Cohen–Friendlygraphshowingthedeviationsfrominde- atpoints(x0,y0)ifcode=2, atpoints(x1,y1)ifcode=1, orbothif lwdanumericwhichcontrolsthewidthoflines,default1
code=3;anglecontrolstheanglefromtheshaftofthearrowtothe maravectorof4numericvalueswhichcontrolthespacebetweentheaxes
pendenceofrowsandcolumnsinatwodimensionalcontingencyta-
ble edgeofthearrowhead and the border of the graph of the form c(bottom, left, top,
mosaicplot(x)‘mosaic’graphoftheresidualsfromalog-linearregres- abline(a,b)drawsalineofslopebandintercepta right),thedefaultvaluesarec(5.1, 4.1, 4.1, 2.1)
sionofacontingencytable abline(h=y)drawsahorizontallineatordinatey mfcolavectoroftheformc(nr,nc)whichpartitionsthegraphicwindow
pairs(x)ifxisamatrixoradataframe,drawsallpossiblebivariateplots abline(v=x)drawsaverticallineatabcissax asamatrixofnrlinesandnccolumns,theplotsarethendrawnin
betweenthecolumnsofx abline(lm.obj)drawstheregressionlinegivenbylm.obj columns
plot.ts(x)ifxisanobjectofclass"ts",plotofxwithrespecttotime,x rect(x1, y1, x2, y2)drawsarectanglewhichleft,right,bottom,and mfrowid.buttheplotsaredrawnbyrow
maybemultivariatebuttheseriesmusthavethesamefrequencyand toplimitsarex1,x2,y1,andy2,respectively pchcontrolsthetypeofsymbol,eitheranintegerbetween1and25,orany
dates polygon(x, y)drawsapolygonlinkingthepointswithcoordinatesgiven singlecharacterwithin""
|               | butifxismultivariatetheseriesmayhavedifferentdates |     |     | byxandy |     |     |     |        |         |            |              |
| ------------- | -------------------------------------------------- | --- | --- | ------- | --- | --- | --- | ------ | ------- | ---------- | ------------ |
| ts.plot(x)id. |                                                    |     |     |         |     |     |     | 1l 2 3 | 4 5 6 7 | 8 9 10l 11 | 12 13l 14 15 |
andmusthavethesamefrequency legend(x, y, legend)addsthelegendatthepoint(x,y)withthesym- 16l 17 18 19l 20l 21l 22 23 24 25 * . XX aa ??
*
qqnorm(x)quantilesofxwithrespecttothevaluesexpectedunderanor- bolsgivenbylegend psanintegerwhichcontrolsthesizeinpointsoftextsandsymbols
mallaw title()addsatitleandoptionallyasub-title ptyacharacterwhichspecifiesthetypeoftheplottingregion,"s":square,
qqplot(x, y)quantilesofywithrespecttothequantilesofx axis(side, vect)addsanaxisatthebottom(side=1),ontheleft(2), "m":maximal
contour(x, y, z) contour plot (data are interpolated to draw the atthetop(3),orontheright(4);vect(optional)givestheabcissa(or tckavaluewhichspecifiesthelengthoftick-marksontheaxesasafraction
curves), x and y must be vectors and z must be a matrix so that ordinates)wheretick-marksaredrawn ofthesmallestofthewidthorheightoftheplot;iftck=1agridis
dim(z)=c(length(x), length(y))(xandymaybeomitted) rug(x)drawsthedataxonthex-axisassmallverticallines drawn
filled.contour(x, y, z)id.buttheareasbetweenthecontoursare locator(n, type="n", ...) returnsthecoordinates(x,y)afterthe tclavaluewhichspecifiesthelengthoftick-marksontheaxesasafraction
userhasclickedntimesontheplotwiththemouse;alsodrawssym-
coloured,andalegendofthecoloursisdrawnaswell oftheheightofalineoftext(bydefaulttcl=-0.5)
image(x, y, z)id.butwithcolours(actualdataareplotted) bols(type="p")orlines(type="l")withrespecttooptionalgraphic xaxtifxaxt="n"thex-axisissetbutnotdrawn(usefulinconjonctionwith
persp(x, y, z)id.butinperspective(actualdataareplotted) parameters(...);bydefaultnothingisdrawn(type="n") axis(side=1, ...))
stars(x)ifxisamatrixoradataframe,drawsagraphwithsegmentsora yaxtifyaxt="n"they-axisissetbutnotdrawn(usefulinconjonctionwith
Graphicalparameters
starwhereeachrowofxisrepresentedbyastarandthecolumnsare axis(side=2, ...))
Thesecanbesetgloballywithpar(...);manycanbepassedasparameters
thelengthsofthesegments
toplottingcommands.
| symbols(x, | y, ...) draws,atthecoordinatesgivenbyxandy,sym- |     |     |     |     |     |     |     |     |     |     |
| ---------- | ----------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
adjcontrolstextjustification(0left-justified,0.5centred,1right-justified)
bols(circles,squares,rectangles,stars,thermometresor“boxplots”)
|                       |     |                                      |     | bgspecifiesthecolourofthebackground(ex. |     | : bg="red",bg="blue",... |     | Lattice(Trellis)graphics |     |     |     |
| --------------------- | --- | ------------------------------------ | --- | --------------------------------------- | --- | ------------------------ | --- | ------------------------ | --- | --- | --- |
| whichsizes,colours... |     | arespecifiedbysupplementaryarguments |     |                                         |     |                          |     |                          |     |     |     |
thelistofthe657availablecoloursisdisplayedwithcolors())
termplot(mod.obj)plotofthe(partial)effectsofaregressionmodel xyplot(y˜x)bivariateplots(withmanyfunctionalities)
(mod.obj) btycontrolsthetypeofboxdrawnaroundtheplot,allowedvaluesare:"o",
barchart(y˜x)histogramofthevaluesofywithrespecttothoseofx
Thefollowingparametersarecommontomanyplottingfunctions: "l","7","c","u"ou"]"(theboxlookslikethecorrespondingchar-
dotplot(y˜x)Clevelanddotplot(stackedplotsline-by-lineandcolumn-
| add=FALSEifTRUEsuperposestheplotonthepreviousone(ifitexists) |     |     |     | acter);ifbty="n"theboxisnotdrawn |     |     |     |     |     |     |     |
| ------------------------------------------------------------ | --- | --- | --- | -------------------------------- | --- | --- | --- | --- | --- | --- | --- |
by-column)
axes=TRUEifFALSEdoesnotdrawtheaxesandthebox cexavaluecontrollingthesizeoftextsandsymbolswithrespecttothede-
|     |     |     |     | fault;thefollowingparametershavethesamecontrolfornumberson |     |     |     | densityplot(˜x)densityfunctionsplot |     |     |     |
| --- | --- | --- | --- | ---------------------------------------------------------- | --- | --- | --- | ----------------------------------- | --- | --- | --- |
type="p"specifiesthetypeofplot,"p": points,"l": lines,"b": points histogram(˜x)histogramofthefrequenciesofx
|     |     |     |     | theaxes, cex.axis, | theaxislabels, | cex.lab, thetitle, | cex.main, |     |     |     |     |
| --- | --- | --- | --- | ------------------ | -------------- | ------------------ | --------- | --- | --- | --- | --- |
connectedbylines,"o": id. butthelinesareoverthepoints,"h": bwplot(y˜x)“box-and-whiskers”plot
andthesub-title,cex.sub
verticallines,"s": steps,thedataarerepresentedbythetopofthe qqmath(˜x)quantilesofxwithrespecttothevaluesexpectedunderathe-
colcontrolsthecolorofsymbolsandlines;usecolornames:"red","blue"
verticallines,"S": id. butthedataarerepresentedbythebottomof oreticaldistribution
|     |     |     |     | see colors() | or as "#RRGGBB"; | see rgb(), hsv(), | gray(), and |     |     |     |     |
| --- | --- | --- | --- | ------------ | ---------------- | ----------------- | ----------- | --- | --- | --- | --- |
theverticallines stripplot(y˜x)singledimensionplot,xmustbenumeric,ymaybea
|     |     |     |     | rainbow(); | asforcexthereare: | col.axis, col.lab, | col.main, |     |     |     |     |
| --- | --- | --- | --- | ---------- | ----------------- | ------------------ | --------- | --- | --- | --- | --- |
xlim=, ylim=specifiesthelowerandupperlimitsoftheaxes,forexam- factor
| plewithxlim=c(1, | 10)orxlim=range(x) |     |     | col.sub |     |     |     |     |     |     |     |
| ---------------- | ------------------ | --- | --- | ------- | --- | --- | --- | --- | --- | --- | --- |
qq(y˜x)quantilestocomparetwodistributions,xmustbenumeric,ymay
xlab=, ylab=annotatestheaxes,mustbevariablesofmodecharacter fontanintegerwhichcontrolsthestyleoftext(1: normal, 2: italics, 3:
bold,4: asforcexthereare: font.axis,font.lab, benumeric,character,orfactorbutmusthavetwo‘levels’
| main=maintitle,mustbeavariableofmodecharacter |     |     |     | bolditalics);      |     |     |     |                                 |     |     |     |
| --------------------------------------------- | --- | --- | --- | ------------------ | --- | --- | --- | ------------------------------- | --- | --- | --- |
|                                               |     |     |     | font.main,font.sub |     |     |     | splom(˜x)matrixofbivariateplots |     |     |     |
sub=sub-title(writteninasmallerfont)
|     |     |     |     | lasanintegerwhichcontrolstheorientationoftheaxislabels(0:parallelto |     |     |     | parallel(˜x)parallelcoordinatesplot |     |     |     |
| --- | --- | --- | --- | ------------------------------------------------------------------- | --- | --- | --- | ----------------------------------- | --- | --- | --- |
Low-levelplottingcommands levelplot(z˜x*y|g1*g2)colouredplotofthevaluesofzatthecoor-
theaxes,1:horizontal,2:perpendiculartotheaxes,3:vertical)
dinatesgivenbyxandy(x,yandzareallofthesamelength)
| points(x, | y)addspoints(theoptiontype=canbeused) |     |     |     |     |     |     |     |     |     |     |
| --------- | ------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
wireframe(z˜x*y|g1*g2)3dsurfaceplot
| lines(x, | y)id.butwithlines |     |     |     |     |     |     |     |     |     |     |
| -------- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
cloud(z˜x*y|g1*g2)3dscatterplot
| text(x,                          | y, labels, ...) | adds text given | by labels at coordi- |     |     |     |     |     |     |     |     |
| -------------------------------- | --------------- | --------------- | -------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| nates(x,y);atypicaluseis:plot(x, |                 | y,              | type="n"); text(x,   | y,  |     |     |     |     |     |     |     |
names)

| InthenormalLatticeformula,y                                       |                       | x|g1*g2hascombinationsofoptionalcon- |                           |                  | rpois(n,    | lambda)Poisson           |                     |                 |     |
| ----------------------------------------------------------------- | --------------------- | ------------------------------------ | ------------------------- | ---------------- | ----------- | ------------------------ | ------------------- | --------------- | --- |
| ditioningvariablesg1andg2plottedonseparatepanels.                 |                       |                                      |                           | Latticefunctions | rweibull(n, |                          | shape,              | scale=1)Weibull |     |
| takemanyofthesameargumentsasbasegraphicsplusalsodata=thedata      |                       |                                      |                           |                  | rcauchy(n,  | location=0,              |                     | scale=1)Cauchy  |     |
| frame for                                                         | the formula variables | and subset=                          | for subsetting.           | Use panel=       | rbeta(n,    | shape1,                  | shape2)beta         |                 |     |
| todefineacustompanelfunction(seeapropos("panel")and?llines).      |                       |                                      |                           |                  | rt(n,       | df)‘Student’(t)          |                     |                 |     |
|                                                                   |                       |                                      |                           |                  |             | df2)Fisher–Snedecor(F)(c |                     |                 | 2)  |
| Latticefunctionsreturnanobjectofclasstrellisandhavetobeprint-edto |                       |                                      |                           |                  | rf(n,       | df1,                     |                     |                 |     |
| producethegraph.                                                  | Useprint(xyplot(...)) |                                      | insidefunctionswhereauto- |                  | rchisq(n,   | df)Pearson               |                     |                 |     |
| maticprintingdoesn’twork.Uselattice.themeandlsettochangeLattice   |                       |                                      |                           |                  | rbinom(n,   | size,                    | prob)binomial       |                 |     |
| defaults.                                                         |                       |                                      |                           |                  | rgeom(n,    | prob)geometric           |                     |                 |     |
|                                                                   |                       |                                      |                           |                  | rhyper(nn,  | m,                       | n, k)hypergeometric |                 |     |
Optimizationandmodelfitting
|            |             |                    |                 |               | rlogis(n,  | location=0, |                       | scale=1)logistic  |     |
| ---------- | ----------- | ------------------ | --------------- | ------------- | ---------- | ----------- | --------------------- | ----------------- | --- |
| optim(par, | fn, method  | = c("Nelder-Mead", |                 | "BFGS",       |            |             |                       |                   |     |
|            |             |                    |                 |               | rlnorm(n,  | meanlog=0,  |                       | sdlog=1)lognormal |     |
| "CG",      | "L-BFGS-B", | "SANN")            | general-purpose | optimization; |            |             |                       |                   |     |
|            |             |                    |                 |               | rnbinom(n, | size,       | prob)negativebinomial |                   |     |
parisinitialvalues,fnisfunctiontooptimize(normallyminimize)
|     |     |     |     |     | runif(n, | min=0, | max=1)uniform |     |     |
| --- | --- | --- | --- | --- | -------- | ------ | ------------- | --- | --- |
nlm(f,p)minimizefunctionfusingaNewton-typealgorithmwithstarting
|     |     |     |     |     | rwilcox(nn, |     | m, n),rsignrank(nn, |     | n)Wilcoxon’sstatistics |
| --- | --- | --- | --- | --- | ----------- | --- | ------------------- | --- | ---------------------- |
valuesp
Allthesefunctionscanbeusedbyreplacingtheletterrwithd, porqto
lm(formula)fitlinearmodels;formulaistypicallyoftheformresponse get,respectively,theprobabilitydensity(dfunc(x, ...)),thecumulative
termA + termB + ...; useI(x*y) + I(xˆ2)fortermsmadeof probabilitydensity(pfunc(x, ...)),andthevalueofquantile(qfunc(p,
| nonlinearcomponents |     |     |     |     | ...),with0<p<1). |     |     |     |     |
| ------------------- | --- | --- | --- | --- | ---------------- | --- | --- | --- | --- |
glm(formula,family=)fitgeneralizedlinearmodels,specifiedbygiv-
ingasymbolicdescriptionofthelinearpredictorandadescriptionof
theerrordistribution;familyisadescriptionoftheerrordistribution
| andlinkfunctiontobeusedinthemodel;see?family |     |     |     |     | Programming |     |     |     |     |
| -------------------------------------------- | --- | --- | --- | --- | ----------- | --- | --- | --- | --- |
nls(formula)nonlinearleast-squaresestimatesofthenonlinearmodel
|     |     |     |     |     | function( | arglist | )   | exprfunctiondefinition |     |
| --- | --- | --- | --- | --- | --------- | ------- | --- | ---------------------- | --- |
parameters
return(value)
approx(x,y=)linearlyinterpolategivendatapoints;xcanbeanxyplot-
|     |     |     |     |     | if(cond) | expr |     |     |     |
| --- | --- | --- | --- | --- | -------- | ---- | --- | --- | --- |
tingstructure
|     |     |     |     |     | if(cond) | cons.expr |     | else alt.expr |     |
| --- | --- | --- | --- | --- | -------- | --------- | --- | ------------- | --- |
spline(x,y=)cubicsplineinterpolation
|     |     |     |     |     | for(var | in seq) | expr |     |     |
| --- | --- | --- | --- | --- | ------- | ------- | ---- | --- | --- |
loess(formula)fitapolynomialsurfaceusinglocalfitting
|                                                               |     |     |     |     | while(cond) |      | expr |     |     |
| ------------------------------------------------------------- | --- | --- | --- | --- | ----------- | ---- | ---- | --- | --- |
| Manyoftheformula-basedmodelingfunctionshaveseveralcommonargu- |     |     |     |     | repeat      | expr |      |     |     |
ments: data=thedataframefortheformulavariables,subset=asubsetof
break
variablesusedinthefit,na.action=actionformissingvalues:"na.fail",
next
"na.omit",orafunction.Thefollowinggenericsoftenapplytomodelfitting
Usebraces{}aroundstatements
functions:
|     |     |     |     |     | ifelse(test, |     | yes, no)avaluewiththesameshapeastestfilled |     |     |
| --- | --- | --- | --- | --- | ------------ | --- | ------------------------------------------ | --- | --- |
predict(fit,...)predictionsfromfitbasedoninputdata
withelementsfromeitheryesorno
df.residual(fit)returnsthenumberofresidualdegreesoffreedom
|           |             |                        |            |            | do.call(funname, |     | args)executesafunctioncallfromthenameof |     |     |
| --------- | ----------- | ---------------------- | ---------- | ---------- | ---------------- | --- | --------------------------------------- | --- | --- |
| coef(fit) | returns the | estimated coefficients | (sometimes | with their |                  |     |                                         |     |     |
thefunctionandalistofargumentstobepassedtoit
standard-errors)
residuals(fit)returnstheresiduals
deviance(fit)returnsthedeviance
fitted(fit)returnsthefittedvalues
logLik(fit)computesthelogarithmofthelikelihoodandthenumberof
parameters
AIC(fit)computestheAkaikeinformationcriterionorAIC
Statistics
aov(formula)analysisofvariancemodel
anova(fit,...)analysisofvariance(ordeviance)tablesforoneormore
fittedmodelobjects
density(x)kerneldensityestimatesofx
| binom.test(), | pairwise.t.test(), |     |     | power.t.test(), |     |     |     |     |     |
| ------------- | ------------------ | --- | --- | --------------- | --- | --- | --- | --- | --- |
prop.test(),t.test(),...usehelp.search("test")
Distributions
| rnorm(n, | mean=0, sd=1)Gaussian(normal) |     |     |     |     |     |     |     |     |
| -------- | ----------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
rexp(n, rate=1)exponential
| rgamma(n, | shape, scale=1)gamma |     |     |     |     |     |     |     |     |
| --------- | -------------------- | --- | --- | --- | --- | --- | --- | --- | --- |