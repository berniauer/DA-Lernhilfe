<!-- Quelle: Arbeitsblätter, Übungen, Daten, Sourcecode/Studien/Student performance Portugal/cortez-silva-predict-student-performance.pdf -->

|          |              |           |            | USING  | DATA                                        |            | MINING            | TO                                             | PREDICT     |               |     |           |             |       |
| -------- | ------------ | --------- | ---------- | ------ | ------------------------------------------- | ---------- | ----------------- | ---------------------------------------------- | ----------- | ------------- | --- | --------- | ----------- | ----- |
|          |              | SECONDARY |            |        | SCHOOL                                      |            | STUDENT           |                                                | PERFORMANCE |               |     |           |             |       |
|          |              |           |            |        | Paulo                                       | Cortez     |                   | and Alice                                      | Silva       |               |     |           |             |       |
|          |              |           |            | Dep.   | Information                                 |            | Systems/Algoritmi |                                                | R&D         | Centre        |     |           |             |       |
|          |              |           |            |        |                                             | University |                   | of Minho                                       |             |               |     |           |             |       |
|          |              |           |            |        | 4800-058Guimar˜aes,                         |            |                   | PORTUGAL                                       |             |               |     |           |             |       |
|          |              |           |            | Email: | pcortez@dsi.uminho.pt,alicegsilva@gmail.com |            |                   |                                                |             |               |     |           |             |       |
| KEYWORDS |              |           |            |        |                                             |            |                   | for18to24yearolds,whiletheEuropeanUnionaverage |             |               |     |           |             |       |
|          |              |           |            |        |                                             |            |                   | value                                          | was just    | 15% (Eurostat |     | 2007). In | particular, | fail- |
| Business | Intelligence | in        | Education, |        | Classification                              |            | and               |                                                |             |               |     |           |             |       |
Regression, Decision Trees, Random Forest ure in the core classes of Mathematics and Portuguese
|     |     |     |     |     |     |     |     | (the | native | language) | is extremely | serious, |     | since they |
| --- | --- | --- | --- | --- | --- | --- | --- | ---- | ------ | --------- | ------------ | -------- | --- | ---------- |
ABSTRACT provide fundamental knowledge for the success in the
Although the educational level of the Portuguese pop- remaining school subjects (e.g. physics or history).
ulation has improved in the last decades, the statistics On the other hand, the interest in Business Intelligence
keep Portugal at Europe’s tail end due to its high stu- (BI)/DataMining(DM)(Turbanetal.2007),arosedue
|              |        |                |     |      |            |     |     | to the | advances | of Information |     | Technology, |     | leading to |
| ------------ | ------ | -------------- | --- | ---- | ---------- | --- | --- | ------ | -------- | -------------- | --- | ----------- | --- | ---------- |
| dent failure | rates. | In particular, |     | lack | of success | in  | the |        |          |                |     |             |     |            |
core classes of Mathematics and the Portuguese lan- an exponential growth of business and organizational
guage is extremely serious. On the other hand, the databases. All this data holds valuable information,
fields of Business Intelligence (BI)/Data Mining (DM), such as trends and patterns, which can be used to im-
which aim at extracting high-level knowledge from raw prove decision making and optimize success. Yet, hu-
|             |             |           |     |       |          |     |     | man | experts | are limited | and | may overlook |     | important |
| ----------- | ----------- | --------- | --- | ----- | -------- | --- | --- | --- | ------- | ----------- | --- | ------------ | --- | --------- |
| data, offer | interesting | automated |     | tools | that can | aid | the |     |         |             |     |              |     |           |
education domain. The present work intends to ap- details. Hence,thealternativeistouseautomatedtools
proach student achievement in secondary education us- to analyze the raw data and extract interesting high-
ing BI/DM techniques. Recent real-world data (e.g. level information for the decision-maker.
student grades, demographic, social and school related The education arena offers a fertile ground for BI ap-
features)wascollectedbyusingschoolreportsandques-
|     |     |     |     |     |     |     |     | plications, | since | there | are multiple | sources | of  | data (e.g. |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------- | ----- | ----- | ------------ | ------- | --- | ---------- |
tionnaires. The two core classes (i.e. Mathematics and traditionaldatabases,online web pages)anddiverse in-
Portuguese) were modeled under binary/five-level clas- terestgroups(e.g. students, teachers,administratorsor
sification and regression tasks. Also, four DM mod- alumni) (Ma et al. 2000). For instance, there are sev-
els (i.e. Decision Trees, Random Forest, Neural Net- eral interesting questions for this domain that could be
| works and | Support | Vector | Machines) |     | and three | input |     |               |     |       |            |       |              |     |
| --------- | ------- | ------ | --------- | --- | --------- | ----- | --- | ------------- | --- | ----- | ---------- | ----- | ------------ | --- |
|           |         |        |           |     |           |       |     | answeredusing |     | BI/DM | techniques | (Luan | 2002,Minaei- |     |
selections (e.g. with and without previous grades) were Bidgoli et al. 2003): Who are the students taking most
tested. Theresultsshowthatagoodpredictiveaccuracy credit hours? Who is likely to return for more classes?
can be achieved, provided that the first and/or second Whattypeofcoursescanbeofferedtoattractmorestu-
school period grades are available. Although student dents? Whatarethemainreasonsforstudenttransfers?
achievementishighlyinfluencedbypastevaluations,an
|     |     |     |     |     |     |     |     | Isispossibletopredictstudentperformance? |     |     |     |     |     | Whatare |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------------------- | --- | --- | --- | --- | --- | ------- |
explanatoryanalysishasshownthattherearealsoother the factorsthataffectstudentachievement? Thispaper
relevant features (e.g. number of absences, parent’s job will focus in the last two questions. Modeling student
and education, alcohol consumption). As a direct out- performanceisanimportanttoolforbotheducatorsand
come of this research, more efficient student prediction students,sinceitcanhelpabetterunderstandingofthis
| tools can | be be | developed, | improving |     | the quality | of  | ed- |            |     |                |     |         |         |           |
| --------- | ----- | ---------- | --------- | --- | ----------- | --- | --- | ---------- | --- | -------------- | --- | ------- | ------- | --------- |
|           |       |            |           |     |             |     |     | phenomenon |     | and ultimately |     | improve | it. For | instance, |
ucation and enhancing school resource management. school professionals could perform corrective measures
|     |     |     |     |     |     |     |     | for weak | students | (e.g. | remedial | classes). |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | -------- | ----- | -------- | --------- | --- | --- |
INTRODUCTION In effect, several studies have addressed similar topics.
|     |     |     |     |     |     |     |     | Ma et | al. (2000) | applied | a DM | approach | based | in As- |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | ---------- | ------- | ---- | -------- | ----- | ------ |
Educationis a key factor for achieving a long-termeco- sociation Rules in order to select weak tertiary school
nomicprogress. Duringthelastdecades,thePortuguese students of Singapore for remedial classes. The input
educational level has improved. However, the statistics variables included demographic attributes (e.g. sex, re-
keep the Portugal at Europe’s tail end due to its high gion) and school performance over the past years and
student failure and dropping out rates. For example, in the proposed solution outperformed the traditional al-
2006 the early school leaving rate in Portugal was 40% locationprocedure. In2003(Minaei-Bidgolietal.2003),

online student grades from the Michigan State Univer- followedby higher education. Most of the students join
sity were modeled using three classification approaches the public andfree educationsystem. There are several
(i.e. binary: pass/fail; 3-level: low, middle, high; and courses (e.g. Sciences and Technologies, Visual Arts)
9-level: from 1 - lowest grade to 9 - highest score). The that share core subjects such as the Portuguese Lan-
databaseincluded227sampleswithonlinefeatures(e.g. guage and Mathematics. Like several other countries
numberofcorrectedanswersortriesforhomework)and (e.g. France or Venezuela), a 20-point grading scale is
the best results were obtained by a classifier ensemble used, where 0 is the lowest grade and 20 is the perfect
(e.g. Decision Tree and Neural Network) with accu- score. During the school year, students are evaluated
racyratesof94%(binary), 72%(3-classes)and62%(9- in three periods and the lastevaluation(G3 of Table 1)
classes). Kotsiantis et al. (2004)applied severalDM al- corresponds to the final grade.
gorithmstopredicttheperformanceofcomputerscience This study willconsiderdata collectedduring the 2005-
students from an university distance learning program. 2006schoolyearfromtwopublicschools,fromtheAlen-
For each student, several demographic (e.g. sex, age, tejoregionofPortugal. Althoughtherehasbeenatrend
marital status) and performance attributes (e.g. mark for an increase of Information Technology investment
in a given assignment) were used as inputs of a binary from the Government, the majority of the Portuguese
pass/failclassifier. The best solutionwas obtained by a public school information systems are very poor, rely-
Naive Bayes method with an accuracy of 74%. Also, it ingmostlyonpapersheets(whichwasthecurrentcase).
was found that past school grades have a much higher Hence, the database was built from two sources: school
impactthandemographicvariables. Morerecently,Par- reports, based on paper sheets and including few at-
dos et al. (2006) collected data from an online tutoring tributes (i.e. the three period grades and number of
system regarding USA 8th grade Math tests. The au- school absences); and questionnaires, used to comple-
thorsadoptedaregressionapproach,wheretheaimwas ment the previous information. We designed the latter
topredictthemathtestscorebasedonindividualskills. with closed questions (i.e. with predefined options) re-
TheauthorsusedBayesianNetworksandthebestresult lated to several demographic (e.g. mother’s education,
was an predictive error of 15%. familyincome),social/emotional(e.g. alcoholconsump-
In this work, we will analyze recent real-world data tion) (Pritchard and Wilson 2003) and school related
from two Portuguese secondary schools. Two differ- (e.g. number of past class failures) variables that were
entsourceswereused: markreportsandquestionnaires. expected to affect student performance. The question-
Since the formercontainedscarceinformation(i.e. only nairewasreviewedbyschoolprofessionalsandtestedon
the grades and number of absences were available), it asmallsetof15studentsinordertogetafeedback. The
was complemented with the latter, which allowed the finalversioncontained37questions ina single A4 sheet
collection of several demographic, social and school re- and it was answered in class by 788 students. Latter,
lated attributes (e.g. student’s age, alcohol consump- 111 answers were discardeddue to lack of identification
tion,mother’seducation). Theaimistopredictstudent details (necessary for merging with the school reports).
achievementandifpossibleto identify thekeyvariables Finally, the data was integrated into two datasets re-
| that affect | educational | success/failure. |     | The | two core |         |                  |     |                    |     |     |      |
| ----------- | ----------- | ---------------- | --- | --- | -------- | ------- | ---------------- | --- | ------------------ | --- | --- | ---- |
|             |             |                  |     |     |          | latedto | Mathematics(with |     | 395examples)andthe |     |     | Por- |
classes (i.e. Mathematics and Portuguese)will be mod- tuguese language (649 records) classes.
eled under three DM goals: During the preprocessingstage, some features were dis-
|                    |                |                    |                |        |            | carded    | due to          | the lack | of discriminative |               | value.    | For in-    |
| ------------------ | -------------- | ------------------ | -------------- | ------ | ---------- | --------- | --------------- | -------- | ----------------- | ------------- | --------- | ---------- |
| i) binary          | classification | (pass/fail);       |                |        |            |           |                 |          |                   |               |           |            |
|                    |                |                    |                |        |            | stance,   | few respondents |          | answered          | about         | their     | family     |
| ii) classification |                | with five          | levels (from   | I very | good or    |           |                 |          |                   |               |           |            |
|                    |                |                    |                |        |            | income    | (probably       | due      | to privacy        | issues),      | while     | almost     |
| excellent          | to             | V - insufficient); | and            |        |            |           |                 |          |                   |               |           |            |
|                    |                |                    |                |        |            | 100%of    | the students    |          | live with         | their parents |           | and have a |
| iii) regression,   |                | with a numeric     | output         | that   | ranges be- |           |                 |          |                   |               |           |            |
|                    |                |                    |                |        |            | personal  | computer        | at       | home.             | The remaining |           | attributes |
| tween              | zero           | (0%) and           | twenty (100%). |        |            |           |                 |          |                   |               |           |            |
|                    |                |                    |                |        |            | are shown | in Table        | 1,       | where             | the last      | four rows | denote     |
For each of these approaches, three input setups (e.g. the variables taken from the school reports.
| with and | without | the school | period | grades) | and four |     |     |     |     |     |     |     |
| -------- | ------- | ---------- | ------ | ------- | -------- | --- | --- | --- | --- | --- | --- | --- |
DM algorithms (e.g. Decision Trees, Random Forest) Data Mining Models
| will be | tested. | Moreover, | an explanatory |     | analysis will |     |     |     |     |     |     |     |
| ------- | ------- | --------- | -------------- | --- | ------------- | --- | --- | --- | --- | --- | --- | --- |
be performed over the best models, in order to identify Classification and regression are two important DM
the most relevant features. goals. Bothrequireasupervisedlearning,whereamodel
|     |     |     |     |     |     | is adjusted | to  | a dataset | made | up of | k ∈ {1,...,N} | ex- |
| --- | --- | --- | --- | --- | --- | ----------- | --- | --------- | ---- | ----- | ------------- | --- |
|     |     |     |     |     |     |             |     |           |      |       | k             | k   |
MATERIALS AND METHODS amples, each mapping an input vector (x ,...,x ) to
|     |     |     |     |     |     |         |        |         |      |            | 1      | I        |
| --- | --- | --- | --- | --- | --- | ------- | ------ | ------- | ---- | ---------- | ------ | -------- |
|     |     |     |     |     |     | a given | target | yk. The | main | difference | is set | in terms |
Student Data of the output representation, (i.e. discrete for classifi-
|     |     |     |     |     |     | cation and | continuous |     | for regression). |     | In classification, |     |
| --- | --- | --- | --- | --- | --- | ---------- | ---------- | --- | ---------------- | --- | ------------------ | --- |
InPortugal,the secondaryeducationconsistsof3years modelsareoftenevaluatedusingthe PercentageofCor-
of schooling, preceding 9 years of basic education and rect Classifications(PCC), while in regressionthe Root

|           |     |             |     | Table     | 1:     | The     | preprocessed | student | related | variables |     |     |     |     |
| --------- | --- | ----------- | --- | --------- | ------ | ------- | ------------ | ------- | ------- | --------- | --- | --- | --- | --- |
| Attribute |     | Description |     | (Domain)  |        |         |              |         |         |           |     |     |     |     |
| sex       |     | student’s   | sex | (binary:  | female | or      | male)        |         |         |           |     |     |     |     |
| age       |     | student’s   | age | (numeric: |        | from 15 | to 22)       |         |         |           |     |     |     |     |
school student’s school (binary: Gabriel Pereira or Mousinho da Silveira)
| address |     | student’s | home         | address |        | type (binary: |     | urban or        | rural) |        |     |     |     |     |
| ------- | --- | --------- | ------------ | ------- | ------ | ------------- | --- | --------------- | ------ | ------ | --- | --- | --- | --- |
| Pstatus |     | parent’s  | cohabitation |         | status | (binary:      |     | living together | or     | apart) |     |     |     |     |
a
| Medu |     | mother’s | education |          | (numeric: |     | from 0 | to 4 ) |     |     |     |     |     |     |
| ---- | --- | -------- | --------- | -------- | --------- | --- | ------ | ------ | --- | --- | --- | --- | --- | --- |
| Mjob |     | mother’s | job       | (nominal | b )       |     |        |        |     |     |     |     |     |     |
a
| Fedu |     | father’s | education |     | (numeric: | from | 0 to | 4 ) |     |     |     |     |     |     |
| ---- | --- | -------- | --------- | --- | --------- | ---- | ---- | --- | --- | --- | --- | --- | --- | --- |
b
| Fjob     |     | father’s  | job      | (nominal | )         |         |     |           |        |     |     |     |     |     |
| -------- | --- | --------- | -------- | -------- | --------- | ------- | --- | --------- | ------ | --- | --- | --- | --- | --- |
| guardian |     | student’s | guardian |          | (nominal: | mother, |     | father or | other) |     |     |     |     |     |
| famsize  |     | family    | size     | (binary: | ≤3        | or >3)  |     |           |        |     |     |     |     |     |
famrel quality of family relationships (numeric: from 1 – very bad to 5 – excellent)
reason reason to choose this school (nominal: close to home, school reputation, course preference or other)
traveltime home to school travel time (numeric: 1 – <15 min., 2 – 15 to 30 min., 3 – 30 min. to 1 hour
|     |     | or 4 – | >1 hour). |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | ------ | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
studytime weekly study time (numeric: 1 – <2 hours, 2 – 2 to 5 hours, 3 – 5 to 10 hours or 4 – >10 hours)
| failures   |     | number           | of past      | class        | failures  | (numeric: |          | n if 1≤n<3, |        | else 4) |     |     |     |     |
| ---------- | --- | ---------------- | ------------ | ------------ | --------- | --------- | -------- | ----------- | ------ | ------- | --- | --- | --- | --- |
| schoolsup  |     | extra            | educational  |              | school    | support   | (binary: | yes         | or no) |         |     |     |     |     |
| famsup     |     | family           | educational  |              | support   | (binary:  | yes      | or no)      |        |         |     |     |     |     |
| activities |     | extra-curricular |              | activities   |           | (binary:  | yes      | or no)      |        |         |     |     |     |     |
| paidclass  |     | extra            | paid classes |              | (binary:  | yes       | or no)   |             |        |         |     |     |     |     |
| internet   |     | Internet         | access       | at           | home      | (binary:  | yes or   | no)         |        |         |     |     |     |     |
| nursery    |     | attended         | nursery      |              | school    | (binary:  | yes      | or no)      |        |         |     |     |     |     |
| higher     |     | wants            | to take      | higher       | education |           | (binary: | yes or      | no)    |         |     |     |     |     |
| romantic   |     | with a           | romantic     | relationship |           | (binary:  |          | yes or no)  |        |         |     |     |     |     |
freetime free time after school (numeric: from 1 – very low to 5 – very high)
goout going out with friends (numeric: from 1 – very low to 5 – very high)
Walc weekend alcohol consumption (numeric: from 1 – very low to 5 – very high)
Dalc workday alcohol consumption (numeric: from 1 – very low to 5 – very high)
health current health status (numeric: from 1 – very bad to 5 – very good)
| absences |     | number       | of school |           | absences  | (numeric: |        | from 0 to | 93) |     |     |     |     |     |
| -------- | --- | ------------ | --------- | --------- | --------- | --------- | ------ | --------- | --- | --- | --- | --- | --- | --- |
| G1       |     | first period |           | grade     | (numeric: | from      | 0 to   | 20)       |     |     |     |     |     |     |
| G2       |     | second       | period    | grade     | (numeric: |           | from 0 | to 20)    |     |     |     |     |     |     |
| G3       |     | final grade  |           | (numeric: | from      | 0 to      | 20)    |           |     |     |     |     |     |     |
a 0 – none,1 – primaryeducation(4thgrade),2 – 5thto 9thgrade,3 –secondaryeducationor4 – highereducation.
b teacher, health care related, civil services (e.g. administrative or police), at home or other.
MeanSquared(RMSE)isapopularmetric(Wittenand (i.e. G3 of Table 1) will be modeled using three super-
Frank 2005). A high PCC (i.e. near 100%) suggests a vised approaches:
| good classifier, |     | while | a regressor |     | should | present | a low |     |     |     |     |     |     |     |
| ---------------- | --- | ----- | ----------- | --- | ------ | ------- | ----- | --- | --- | --- | --- | --- | --- | --- |
global error (i.e. RMSE close to zero). These metrics 1. Binary classification – pass if G3≥10, else fail;
Erasmus1
|        |          |          |          |            |           |     |     |     | 2. 5-Level    | classification       | –           | based    | on the |     |
| ------ | -------- | -------- | -------- | ---------- | --------- | --- | --- | --- | ------------- | -------------------- | ----------- | -------- | ------ | --- |
| can be | computed | using    | the      | equations: |           |     |     |     |               |                      |             |          |        |     |
|        |          |          |          |            |           |     |     |     | grade         | conversionsystem     | (Table      |          | 2);    |     |
|        |          |          |          |            |           |     |     |     | 3. Regression | – the                | G3 value    | (numeric | output | be- |
|        |          |          | 1 ,      | if yi      | =yi       |     |     |     |               |                      |             |          |        |     |
|        | Φ(i)=    |          |          |            |           |     |     |     | tween         | 0 and 20).           |             |          |        |     |
|        |          | (cid:26) | 0 ,      | else       |           |     |     |     |               |                      |             |          |        |     |
|        | PCC      | =        | N Φ(i)/N |            | ×100(%) b |     | (1) |     |               |                      |             |          |        |     |
|        |          |          | i=1      |            |           |     |     |     | Figure 1      | plots the respective | histograms. |          |        |     |
P N (yi−yi)2/N SeveralDM algorithms,eachone with its own purposes
RMSE =
i=1
|     |     |     | q   |     |     |     |     |     | and capabilities, | have | been proposed |     | for classification |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | ---- | ------------- | --- | ------------------ | --- |
P
|          |         |     |           |       | b   |          |       |     | and regression | tasks. | The Decision |     | Tree (DT) | is a |
| -------- | ------- | --- | --------- | ----- | --- | -------- | ----- | --- | -------------- | ------ | ------------ | --- | --------- | ---- |
| where yi | denotes | the | predicted | value | for | the i-th | exam- |     |                |        |              |     |           |      |
ple.
1Europeanexchangeprogrammethatenablesstudentexchange
b
| In this | work, | the Mathematics |     | and | Portuguese |     | grades |     | in31countries. |     |     |     |     |     |
| ------- | ----- | --------------- | --- | --- | ---------- | --- | ------ | --- | -------------- | --- | --- | --- | --- | --- |

|     |     |     |     |     | Table | 2: The | five-level | classification |     | system |     |     |     |     |     |
| --- | --- | --- | --- | --- | ----- | ------ | ---------- | -------------- | --- | ------ | --- | --- | --- | --- | --- |
|     |     |     |     |     |       | I      |            | II             |     | III    |     | IV  |     | V   |     |
Country (excellent/very good) (good) (satisfactory) (sufficient) (fail)
|     |     | Portugal/France |     |     |     | 16-20 |     | 14-15 |     | 12-13 |     | 10-11 | 0-9 |     |     |
| --- | --- | --------------- | --- | --- | --- | ----- | --- | ----- | --- | ----- | --- | ----- | --- | --- | --- |
|     |     | Ireland         |     |     |     | A     |     | B     |     | C     |     | D     |     | F   |     |
Mathematics:
|     |     | 052 |     |     | 021 |     |     |     | 08  |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     | 002 |     |     | 001 |     |     |     |     |     |     |     |     |     |     |
06
|     |     | 051 |     |     | 08  |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     |     |     | 06  |     |     |     | 04  |     |     |     |     |     |     |
001
04
02
05
02
0
|     |     | 0   |      |      | 0   |      |        |     |     |     |     |     |     |     |     |
| --- | --- | --- | ---- | ---- | --- | ---- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     | Pass | Fail |     | I II | III IV | V   | 0   | 5   | 10  | 15  | 20  |     |     |
Portuguese:
002
005
051
051
004
|     |     | 003 |     |     |     |     |     |     | 001 |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
001
002
05
05
001
|     |     | 0   |      |      | 0   |      |        |     | 0   |     |     |     |     |     |     |
| --- | --- | --- | ---- | ---- | --- | ---- | ------ | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |     | Pass | Fail |     | I II | III IV | V   | 0   | 5   | 10  | 15  | 20  |     |     |
Figure 1: Histograms for the output variables (binary/5-levelclassification and regression)
branching structure that represents a set of rules, dis- the DT/RF algorithms, since the latter explicitly per-
tinguishingvaluesinahierarchicalform(Breimanetal. form an internal feature selection.
| 1984).      | This representation |                                   | can      | translated    |            | into a set | of    |               |             |        |             |         |            |         |           |
| ----------- | ------------------- | --------------------------------- | -------- | ------------- | ---------- | ---------- | ----- | ------------- | ----------- | ------ | ----------- | ------- | ---------- | ------- | --------- |
| IF-THEN     | rules,              | which                             | are easy | to            | understand | by         | hu-   |               |             |        |             |         |            |         |           |
|             |                     |                                   |          |               |            |            |       | Computational |             |        | Environment |         |            |         |           |
| mans. The   | Random              |                                   | Forest   | (RF) (Breiman |            | 2001)      | is an |               |             |        |             |         |            |         |           |
| ensembleofT |                     | unprunedDT.Eachtreeisbasedinaran- |          |               |            |            |       |               |             |        |             |         |            |         |           |
|             |                     |                                   |          |               |            |            |       | All           | experiments |        | reported    | in      | this study | were    | conducted |
| dom feature | selection           |                                   | from     | bootstrap     | training   | samples    |       |               |             |        |             |         |            |         |           |
|             |                     |                                   |          |               |            |            |       | using         | the         | RMiner |             | (Cortez | In press), | an open | source    |
and the RF predictions are built by averaging the out- libraryfor the R environmentthatfacilitates the use of
| putsoftheT | trees. | TheRFismoredifficulttointerpret |     |     |     |     |     |     |            |     |         |     |        |          |            |
| ---------- | ------ | ------------------------------- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------- | --- | ------ | -------- | ---------- |
|            |        |                                 |     |     |     |     |     | DM  | techniques |     | (Figure | 2). | R is a | free and | high-level |
when compared with the single DT, although it is still matrix programming language with a powerful suite of
possible to provide explanatory knowledge in terms of tools for statistical and data analysis (R Development
| its input | variable | relevance. |     | Nonlinear | functions, |     | such |                |     |     |                    |     |     |                |     |
| --------- | -------- | ---------- | --- | --------- | ---------- | --- | ---- | -------------- | --- | --- | ------------------ | --- | --- | -------------- | --- |
|           |          |            |     |           |            |     |      | CoreTeam2006). |     |     | Itcanruninmultiple |     |     | platforms(e.g. |     |
asNeuralNetworks(NN)andSupportVectorMachines Windows, MacOS or Linux) and new features can be
| (SVM), | have | also been | proposed | for | DM  | tasks (Hastie |     |       |     |          |           |     |     |     |     |
| ------ | ---- | --------- | -------- | --- | --- | ------------- | --- | ----- | --- | -------- | --------- | --- | --- | --- | --- |
|        |      |           |          |     |     |               |     | added | by  | creating | packages. |     |     |     |     |
et al. 2001), obtaining better results when a high non- The RMiner library2 presents a set of coherent func-
linearityispresent. Inthiswork,theNNmodelisbased tions (e.g. mining, saveMining) for classification and
| in the popular |     | multilayer | perceptron, |     | with | one hidden |     |            |     |       |         |     |            |             |         |
| -------------- | --- | ---------- | ----------- | --- | ---- | ---------- | --- | ---------- | --- | ----- | ------- | --- | ---------- | ----------- | ------- |
|                |     |            |             |     |      |            |     | regression |     | tasks | (Cortez | In  | press). In | particular, | the li- |
layer with H hidden nodes, while the SVM will use a braryusestherpart(DT),randomForest(RF),nnet
gaussiankernelwith one hyperparameter(γ). It should (NN) and kernlab (SVM) packages. As an example,
be noted that NN and SVM use model representations thefollowingRMiner/RcodewasusedduringtheDT
|          |           |      |            |               |         |        |      | predictive |     | experiments |     | of the | portuguese | binary | classi- |
| -------- | --------- | ---- | ---------- | ------------- | ------- | ------ | ---- | ---------- | --- | ----------- | --- | ------ | ---------- | ------ | ------- |
| that are | difficult | to   | understand | by            | humans. | Also,  | NN   |            |     |             |     |        |            |        |         |
| and SVM  | are       | more | affected   | by irrelevant |         | inputs | than |            |     |             |     |        |            |        |         |
2http://www.dsi.uminho.pt/˜pcortez/R/rminer.zip

fication: To access the predictive performances, 20 runs of a 10-
foldcross-validation(Hastieetal.2001)(inatotalof200
| source("rminer.R") |       | #   | read | the RMiner |     | library |     |              |     |              |           |         |                |             |       |
| ------------------ | ----- | --- | ---- | ---------- | --- | ------- | --- | ------------ | --- | ------------ | --------- | ------- | -------------- | ----------- | ----- |
|                    |       |     |      |            |     |         |     | simulations) |     | were applied |           | to each | configuration. |             | Under |
| # load the         | data: |     |      |            |     |         |     |              |     |              |           |         |                |             |       |
|                    |       |     |      |            |     |         |     | such scheme, |     | for a        | given run | the     | data           | is randomly | di-   |
data=read.table("a-por-bin.dat",sep=";",header=T)
|                 |         |           |      |                  |     |     |     | vided in      | 10 subsets |           | of equal | size.  | Sequentially, |       | one dif- |
| --------------- | ------- | --------- | ---- | ---------------- | --- | --- | --- | ------------- | ---------- | --------- | -------- | ------ | ------------- | ----- | -------- |
| K=c("kfold",10) |         | # 10-fold |      | cross-validation |     |     |     |               |            |           |          |        |               |       |          |
|                 |         |           |      |                  |     |     |     | ferent subset |            | is tested | (with    | 10%    | of the        | data) | and the  |
| # execute       | 10 runs | of        | a DT | classification:  |     |     |     |               |            |           |          |        |               |       |          |
|                 |         |           |      |                  |     |     |     | remaining     | data       | used      | to fit   | the DM | technique.    |       | At the   |
DT=mining(y~.,data,model="dt",Runs=20,method=K)
|             |                |     |     |       |         |      |     | end of | this process, |     | the evaluated |     | test set | contains | the |
| ----------- | -------------- | --- | --- | ----- | ------- | ---- | --- | ------ | ------------- | --- | ------------- | --- | -------- | -------- | --- |
| # show mean | classification |     |     | error | on test | set: |     |        |               |     |               |     |          |          |     |
print(mean(DT$error)) whole dataset, although 10 variations of the same DM
# save the results (predictions, ...): model are used to create the predictions.
saveMining(DT,"DT-results") As a baseline comparison, a naive predictor (NV) will
|     |     |     |     |     |     |     |     | also be          | tested.         | For    | the A        | setup, | this                   | model is       | equal  |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------- | --------------- | ------ | ------------ | ------ | ---------------------- | -------------- | ------ |
|     |     |     |     |     |     |     |     | to the           | second          | period | grade        | (G2    | or its                 | binary/5-level |        |
|     |     |     |     |     |     |     |     | versions).       | When            | the    | second       | grade  | is not                 | available      | (B     |
|     |     |     |     |     |     |     |     | setup),          | the first       | period | grade        | is     | used (or               | its binary/5-  |        |
|     |     |     |     |     |     |     |     | level variants). |                 | If no  | evaluation   |        | is present             | (C             | setup) |
|     |     |     |     |     |     |     |     | then the         | mostcommonclass |        |              | (for   | classificationtasks)or |                |        |
|     |     |     |     |     |     |     |     | the average      | output          | value  | (regression) |        | is                     | returned.      |        |
|     |     |     |     |     |     |     |     | The test         | set results     |        | are shown    | in     | Tables                 | 3 to 5 in      | terms  |
ofthemeanandrespectivet-student95%confidencein-
|        |          |         |     |        |          |     |       | tervals(Flexer1996). |          |         | Asexpected,theAsetupachieves |             |           |            |        |
| ------ | -------- | ------- | --- | ------ | -------- | --- | ----- | -------------------- | -------- | ------- | ---------------------------- | ----------- | --------- | ---------- | ------ |
|        |          |         |     |        |          |     |       | the best             | results. | The     | predictive                   | performance |           | decreases  |        |
|        |          |         |     |        |          |     |       | when the             | second   | period  | grade                        | is          | not known | (B)        | and    |
|        |          |         |     |        |          |     |       | the wost             | results  | are     | obtained                     | when        | no        | student    | scores |
|        |          |         |     |        |          |     |       | are used             | (C).     | Using   | only                         | the last    | available | evaluation |        |
| Figure | 2: MacOS | example |     | of the | R/RMiner |     | tool. |                      |          |         |                              |             |           |            |        |
|        |          |         |     |        |          |     |       | (NV method           |          | for the | first                        | two input   | setups)   | is the     | best   |
optionfortheMathematicsclassificationgoals(bothbi-
|     |     |     |     |     |     |     |     | nary and | 5-level) | and | Portuguese |     | regression | under | the |
| --- | --- | --- | --- | --- | --- | --- | --- | -------- | -------- | --- | ---------- | --- | ---------- | ----- | --- |
RESULTS
|            |             |     |     |     |     |     |     | A input        | selection. | This    | suggests  | that       | in           | these cases | the      |
| ---------- | ----------- | --- | --- | --- | --- | --- | --- | -------------- | ---------- | ------- | --------- | ---------- | ------------ | ----------- | -------- |
|            |             |     |     |     |     |     |     | non evaluation |            | inputs  | are       | of no use. | However,     |             | the sce- |
| Predictive | Performance |     |     |     |     |     |     |                |            |         |           |            |              |             |          |
|            |             |     |     |     |     |     |     | nario changes  |            | for the | remaining |            | experiments. | The         | RF       |
|            |             |     |     |     |     |     |     | is the best    | choice     | in      | 8 cases,  | followed   | by           | the DT,     | which    |
Before fitting the models, some preprocessing was re- obtains 4 best results. In general, the nonlinear func-
| quiredbytheNNandSVMmodels. |     |     |     |     | Thenominal3 |     | vari- |              |     |         |      |     |              |     |        |
| -------------------------- | --- | --- | --- | --- | ----------- | --- | ----- | ------------ | --- | ------- | ---- | --- | ------------ | --- | ------ |
|                            |     |     |     |     |             |     |       | tion methods |     | (NN and | SVM) | are | outperformed |     | by the |
ables (e.g Mjob) were transformed into a 1-of-C en- tree based ones. This behavior may be explained by a
| coding and | all | attributes | were      | standardized |         | to     | a zero |             |     |               |     |         |          |        |      |
| ---------- | --- | ---------- | --------- | ------------ | ------- | ------ | ------ | ----------- | --- | ------------- | --- | ------- | -------- | ------ | ---- |
|            |     |            |           |              |         |        |        | high number |     | of irrelevant |     | inputs, | as shown | in the | next |
| mean and   | one | standard   | deviation |              | (Hastie | et al. | 2001). |             |     |               |     |         |          |        |      |
section.
Next, the DM models were fitted. The DT node split Asanexampleofthequalityofthepredictions,Figure3
| was adjusted | for | the reduction |     | of  | the sum | of  | squares. |     |     |     |     |     |     |     |     |
| ------------ | --- | ------------- | --- | --- | ------- | --- | -------- | --- | --- | --- | --- | --- | --- | --- | --- |
showstheconfusionmatricesfortheDTalgorithm,Por-
Regarding the remaining methods, the default parame- tuguese class and A setup. In both binary and 5-level
| ters were    | adopted | for   | the RF               | (e.g. | T = | 500), | NN (e.g. |                    |           |            |     |        |        |               |      |
| ------------ | ------- | ----- | -------------------- | ----- | --- | ----- | -------- | ------------------ | --------- | ---------- | --- | ------ | ------ | ------------- | ---- |
|              |         |       |                      |       |     |       |          | classification,the |           | majorityof |     | the    | values | arein/nearthe |      |
| E =100epochs |         | ofthe | BFGSalgorithm)andSVM |       |     |       | (e.g.    |                    |           |            |     |        |        |               |      |
|              |         |       |                      |       |     |       |          | matrix             | diagonal, | revealing  |     | a good | fit.   | The figure    | also |
Sequential Minimal Optimization algorithm). Also, the presents the RF scatter plot (predicted versus the ob-
NNandSVMhyperparameterswereoptimizedusingan
servedvalues)fortheMathematicsregressionapproach.
internalgridsearch(i.e. usingonlytrainingdata)where TheRFpredictionsareclosetothediagonalline(which
|     |     |     |     | −9,2 −7,2 | −5,2 | −3,2 | −1}. |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --------- | ---- | ---- | ---- | --- | --- | --- | --- | --- | --- | --- | --- |
H ∈{0,2,4,6,8}and γ ∈{2 denotes the perfect forecast) within most of the output
| Since we   | suspected    | that      | the   | G1 and | G2             | grades | would   |             |          |           |     |     |     |     |     |
| ---------- | ------------ | --------- | ----- | ------ | -------------- | ------ | ------- | ----------- | -------- | --------- | --- | --- | --- | --- | --- |
|            |              |           |       |        |                |        |         | range (i.e. | [5,20]). |           |     |     |     |     |     |
| have a     | high impact, |           | three | input  | configurations |        | were    |             |          |           |     |     |     |     |     |
| tested for | each         | DM model: |       |        |                |        |         |             |          |           |     |     |     |     |     |
|            |              |           |       |        |                |        |         | Descriptive |          | Knowledge |     |     |     |     |     |
| • A -      | with all     | variables | from  | Table  | 1              | except | G3 (the |             |          |           |     |     |     |     |     |
Herethegoalisnottoinferaboutthepredictivecapabil-
output);
itiesofeachmodel,asmeasuredintheprevioussection,
• B-similartoAbutwithoutG2(thesecondperiod
|         |         |      |             |     |         |       |        | but to             | give a  | simple       | description |              | that summarizes |      | the     |
| ------- | ------- | ---- | ----------- | --- | ------- | ----- | ------ | ------------------ | ------- | ------------ | ----------- | ------------ | --------------- | ---- | ------- |
| grade); | and     |      |             |     |         |       |        |                    |         |              |             |              |                 |      |         |
|         |         |      |             |     |         |       |        | best DM            | models. | Thus,        | the         | whole        | dataset         | will | be used |
| • C -   | similar | to B | but without |     | G1 (the | first | period |                    |         |              |             |              |                 |      |         |
|         |         |      |             |     |         |       |        | in the descriptive |         | experiments. |             | Furthermore, |                 | only | the     |
grade).
|     |     |     |     |     |     |     |     | DT/RF | algorithms |     | will be | considered, |     | since it | is more |
| --- | --- | --- | --- | --- | --- | --- | --- | ----- | ---------- | --- | ------- | ----------- | --- | -------- | ------- |
3Discretewithmorethantwonon-orderedvalues. easy to extract knowledge from these models and they

Table 3: Binary classification results (PCC values, in %; underline – best model; bold – best within the input setup)
| Input |     |     |     | Mathematics |     |     |     |     |       | Portuguese |     |     |     |     |
| ----- | --- | --- | --- | ----------- | --- | --- | --- | --- | ----- | ---------- | --- | --- | --- | --- |
| Setup | NV  |     | NN  | SVM         |     | DT  | RF  |     | NV NN |            | SVM | DT  | RF  |     |
A 91.9†±0.0 88.3 ±0.7 86.3 ±0.6 90.7 ±0.3 91.2 ±0.2 89.7 ±0.0 90.7 ±0.5 91.4 ±0.2 93.0†±0.3 92.6 ±0.1
B 83.8†±0.0 81.3 ±0.5 80.5 ±0.5 83.1 ±0.5 83.0 ±0.4 87.5 ±0.0 87.6 ±0.4 88.0 ±0.3 88.4 ±0.3 90.1†±0.2
C 67.1 66.3 70.6∗±0.4 65.3 70.5 84.6 83.4 84.8 84.4 85.0∗±0.2
|                 |     | ±0.0         |     | ±1.0           |             | ±0.8       |      | ±0.5  | ±0.0     | ±0.5 | ±0.3 | ±0.4 |     |     |
| --------------- | --- | ------------ | --- | -------------- | ----------- | ---------- | ---- | ----- | -------- | ---- | ---- | ---- | --- | --- |
| † – statistical |     | significance |     | under pairwise | comparisons |            | with | other | methods. |      |      |      |     |     |
| ∗ – statistical |     | significance |     | under a        | pairwise    | comparison | with | NV.   |          |      |      |      |     |     |
Table 4: Five-level classification results (PCC values, in %; underline – best model; bold – best within the input
setup)
| Input |           |     |      | Mathematics |      |      |      |      |           | Portuguese |      |      |      |      |
| ----- | --------- | --- | ---- | ----------- | ---- | ---- | ---- | ---- | --------- | ---------- | ---- | ---- | ---- | ---- |
| Setup | NV        |     | NN   | SVM         |      | DT   | RF   |      | NV NN     |            | SVM  | DT   | RF   |      |
| A     | 78.5†±0.0 |     | 60.3 | 59.6        |      | 76.7 | 72.4 |      | 72.9 65.1 |            | 64.5 | 76.1 | 73.5 |      |
|       |           |     |      | ±1.6        | ±0.9 | ±0.4 |      | ±0.4 | ±0.0      | ±0.9       | ±0.6 | ±0.1 |      | ±0.2 |
| B     | 60.5†±0.0 |     | 49.8 | 47.9        |      | 57.5 | 52.7 |      | 58.7 52.0 |            | 51.7 | 62.9 | 55.3 |      |
|       |           |     |      | ±1.2        | ±0.7 | ±0.8 |      | ±0.6 | ±0.0      | ±0.6       | ±0.6 | ±0.2 |      | ±0.4 |
C 32.9 ±0.0 30.4 ±1.0 31.0 ±0.7 31.5 ±0.6 33.5 ±0.6 31.0 ±0.0 33.7 ±0.6 34.9 ±0.5 32.8 ±0.6 36.7†±0.6
| † – statistical |     | significance |     | under pairwise | comparisons |     | with | other | methods. |     |     |     |     |     |
| --------------- | --- | ------------ | --- | -------------- | ----------- | --- | ---- | ----- | -------- | --- | --- | --- | --- | --- |
Table 5: Regression results (RMSE values; underline – best model; bold – best within the input setup)
| I.  |     |     |     | Mathematics |     |     |     |     |     | Portuguese |     |     |     |     |
| --- | --- | --- | --- | ----------- | --- | --- | --- | --- | --- | ---------- | --- | --- | --- | --- |
| S.  | NV  | NN  |     | SVM         | DT  | RF  |     | NV  | NN  |            | SVM | DT  |     | RF  |
A 2.01 ±0.00 2.05 ±0.02 2.09 ±0.02 1.94 ±0.04 1.75†±0.01 1.32 ±0.00 1.36 ±0.04 1.35 ±0.01 1.46 ±0.03 1.32 ±0.00
B 2.80 2.82 2.90 2.67 2.46†±0.01 1.89 1.88 1.87 1.78∗±0.03 1.79
|     | ±0.00 |     | ±0.02 | ±0.02 | ±0.04 |     |     |     | ±0.00 | ±0.02 | ±0.01 |     |     | ±0.01 |
| --- | ----- | --- | ----- | ----- | ----- | --- | --- | --- | ----- | ----- | ----- | --- | --- | ----- |
C 4.59 4.41 4.37 4.46 3.90†±0.01 3.23 2.79 2.76 2.93 2.67†±0.01
|                 | ±0.00 |              | ±0.03 | ±0.03          | ±0.04       |            |      |       | ±0.00    | ±0.02 | ±0.02 | ±0.02 |     |     |
| --------------- | ----- | ------------ | ----- | -------------- | ----------- | ---------- | ---- | ----- | -------- | ----- | ----- | ----- | --- | --- |
| † – statistical |       | significance |       | under pairwise | comparisons |            | with | other | methods. |       |       |       |     |     |
| ∗ – statistical |       | significance |       | under a        | pairwise    | comparison | with | NV.   |          |       |       |       |     |     |
achieved in general the best predictive performances. grades are the most relevant features, appearing at the
rootofthetrees,andonlyasmallnumber(2to5)ofthe
Table6presentstherelativeimportance(inpercentage)
|     |     |     |     |     |     |     |     | inputs | considered | are | used. There | are | some interesting |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------ | ---------- | --- | ----------- | --- | ---------------- | --- |
ofeachinputvariableasmeasuredbytheRFalgorithm
rulesthatcanbeextractedfromthesetrees,forinstance:
| (Breiman | 2001).   | To      | clarify | the analysis, | only       | the   | five |     |                |     |         |           |        |      |
| -------- | -------- | ------- | ------- | ------------- | ---------- | ----- | ---- | --- | -------------- | --- | ------- | --------- | ------ | ---- |
| most     | relevant | results | are     | shownin       | the table. | These | five |     |                |     |         |           |        |      |
|          |          |         |         |               |            |       |      | 1.  | if G1< 10∧G2=9 |     | ∧ Mjob∈ | {teacher, | other} | then |
variablespresentanoverallimpactthatrangesfrom43%
pass;
to 77%, which indicates that there is a high number of 2. if G1< 10∧G2=9 ∧ Mjob∈ {home, health, civil
| irrelevant | inputs. | As  | expected, | the | student | evaluations |     |     |           |            |     |     |     |     |
| ---------- | ------- | --- | --------- | --- | ------- | ----------- | --- | --- | --------- | ---------- | --- | --- | --- | --- |
|            |         |     |           |     |         |             |     |     | services} | then fail; |     |     |     |     |
have a high impact (from 23% to 46%) in the models. 3. if 12≤G2<14∧ goout>1 then III;
Forinstance,G2isthemostimportantfeaturefortheA 4. if 12≤G2<14∧ goout=1 then II;
input selection example, while G1 is highly relevant for 5. if 11<G1≤13∧ absences<7 then 13;
|         |        |          |            |                 |     |         |      | 6.  | if 11<G1≤13∧ |     | absences≥7 | then | 11; |     |
| ------- | ------ | -------- | ---------- | --------------- | --- | ------- | ---- | --- | ------------ | --- | ---------- | ---- | --- | --- |
| the B   | setup. | Also,    | the number | ofpastfailures, |     | whichis |      |     |              |     |            |      |     |     |
| related | with   | previous | student    | performance,    |     | is the  | most |     |              |     |            |      |     |     |
Theserulesshowtheinfluenceofthemother’sjob(rules
important factor when no student scores are available. 1–2),goingoutwith friends(rules 3–4)andthe number
| Nevertheless,         |         | there | are other        | relevant     | factors, | such         | as  |     |                 |       |     |     |     |     |
| --------------------- | ------- | ----- | ---------------- | ------------ | -------- | ------------ | --- | --- | --------------- | ----- | --- | --- | --- | --- |
|                       |         |       |                  |              |          |              |     | of  | absences (rules | 5–6). |     |     |     |     |
| school                | related | (e.g. | number           | of absences, |          | extra school |     |     |                 |       |     |     |     |     |
| supportortraveltime), |         |       | demographic(e.g. |              |          | the mother’s |     |     |                 |       |     |     |     |     |
CONCLUSIONS
| job)andsocial(e.g. |     |     | goingoutwithfriends,alcoholcon- |     |     |     |     |     |     |     |     |     |     |     |
| ------------------ | --- | --- | ------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
sumption) variables. Education is a crucial element in our society. Business
Figure 4 plots the best four DT. Again, the student Intelligence (BI)/Data Mining (DM) techniques, which

Table 6: Relative importance of the input variables for the best RF models
Setup Relative Importance
C-Mat-Bin failures: 21.8%, absenses: 9.4%, schoolsup: 7.0%, goout: 6.5%, higher: 6.4%
B-Por-Bin G1: 22.8%, failures: 14.4%, higher: 11.9%, school: 8.1%, Mjob: 4.1%
C-Por-Bin failures: 16.8%, school: 13.2%, higher: 13.1%, traveltime: 5.9, famrel: 5.7%
C-Mat-5L failures: 18.3%, schoolsup: 9.5%, sex: 5.7%, absences: 5.6%, Medu: 4.5%
C-Por-5L failures: 16.8%, higher: 9.9%, school: 9.3%, schoolsup: 6.9%, Walc: 6.6%
A-Mat-Reg G2: 30.5%, absenses: 20.6%, G1: 15.4%, failures: 6.7%, age: 4.2%
B-Mat-Reg G1: 42.2%, absenses: 18.6%, failures: 8.9%, age: 3.3%, schoolsup: 3.2%
C-Mat-Reg failures: 19.7%, absenses: 18.9%, schoolsup: 8.3%, higher: 5.4%, Mjob:4.2%
C-Por-Reg failures: 20.7%, higher: 11.4%, schoolsup: 6.9%, school: 6.7%, Medu:5.6%
A setup: B setup:
G2<8 Decision G2<12? G1<12? G1>11?
false true false true false true false true
G1<10? Fail Leave G2<14? G2<9? G1<15 G1<9? G1>8? G1>13?
true false true true false true true false true true
Pass G2<10? G2<16? goout>1? IV V I G1<14? IV V 8 failures<1? absences<7? G1>16?
false true false true false true false true
Pass Mjob=teacher or other? I II II III II absences>7? 10 G1<11? 11 13 15 Fedu<3?
false true false true false true
Fail Pass III reason=school reputation? Fjob=teacher or other? 11 17 18
false true false
IV II 10 11
Figure 4: Examples of Decision Trees (A-Por-Bin, A-Por-5L,B-Por-5Land B-Por-Reg)
allowahighlevelextractionofknowledgefromrawdata, DMtechniqueswereappliedafterthedatawascollected.
offer interesting possibilities for the education domain. However, there is a potential for an automatic on-line
Inparticular,severalstudieshaveusedBI/DMmethods learningenvironment,by using a student predictionen-
to improve the quality of education and enhance school gine as part of a school management support system.
resource management. This willallowthe collectionofadditionalfeatures (e.g.
grades from previous school years) and also to obtain
In this paper, we have addressed the prediction of sec-
a valuable feedback from the school professionals. Fur-
ondarystudentgradesoftwocoreclasses(Mathematics
thermore, we intent to enlarge the experiments to more
and Portuguese) by using past school grades (first and
schools and school years, in order to enrich the student
second periods), demographic, social and other school
databases. Automatic feature selection methods (e.g.
related data. Three different DM goals (i.e. binary/5-
filtering or wrapper) (Witten and Frank 2005) will also
level classification and regression) and four DM meth-
beexplored,sinceonlyasmallportionoftheinputvari-
ods, i.e. Decision Trees (DT), Random Forests (RF),
ables consideredseem to be relevant. In particular,this
Neural Networks (NN) and Support Vector Machines
is expected to benefit the nonlinear function methods
(SVM),weretested. Also,distinctinputselections(e.g.
(e.g. NN and SVM), which are more sensitive to irrele-
with or without past grades) were explored. The ob-
vantinputs. Moreresearchisalsoneeded(e.g. sociolog-
tainedresults revealthat itis possible to achievea high
ical studies) in order to understand why and how some
predictive accuracy, provided that the first and/or sec-
variables (e.g. reason to choose school, parent’s job or
ond school period grades are known. This confirms the
alcohol consumption) affect student performance.
conclusion found in (Kotsiantis et al. 2004): student
achievementishighlyaffectedbypreviousperformances.
Nevertheless, an analysis to knowledge provided by the
best predictive models has shown that, in some cases,
thereareotherrelevantfeatures,suchas: schoolrelated ACKNOWLEDGMENTS
(e.g. number of absences, reason to choose school, ex-
tra educational school support), demographic (e.g. stu-
dent’s age, parent’s job and education) and social (e.g.
going out with friends, alcohol consumption) variables.
We wish to thank the students and school professionals
This study was based on an off-line learning, since the who voluntarily participated in this study.

|      |      |      |     |      |        |      | Using             | Machine | Learning |        | Techniques. |             | Applied      | Artifi- |
| ---- | ---- | ---- | --- | ---- | ------ | ---- | ----------------- | ------- | -------- | ------ | ----------- | ----------- | ------------ | ------- |
|      | Pass | Fail |     | I    | II III | IV V |                   |         |          |        |             |             |              |         |
|      |      |      |     |      |        |      | cial Intelligence |         | (AAI),   | 18,    | no.         | 5, 411–426. |              |         |
| Pass | 480  | 69   |     | I 44 | 33 4   | 1 0  |                   |         |          |        |             |             |              |         |
|      |      |      |     |      |        |      | Luan J.,          | 2002.   | Data     | Mining | and         | Its         | Applications | in      |
Fail 12 88 II 2 54 42 14 0 Higher Education. New Directions for Institutional
|     |     |     |     | III 0 | 19 84 | 48 3   | Research, | 113,    | 17–36. |          |       |         |         |           |
| --- | --- | --- | --- | ----- | ----- | ------ | --------- | ------- | ------ | -------- | ----- | ------- | ------- | --------- |
|     |     |     |     |       |       |        | Ma Y.;    | Liu B.; | Wong   | C.;      | Yu    | P.; and | Lee     | S., 2000. |
|     |     |     |     | IV 0  | 0 24  | 111 66 |           |         |        |          |       |         |         |           |
|     |     |     |     |       |       |        | Targeting | the     | right  | students | using | data    | mining. | In        |
VV 0 0 0 1 88 Proc. of 6th ACM SIGKDD International Conference
|     |     |     |     |     |     |     | on Knowledge |     | Discovery |     | and | Data | Mining. | Boston, |
| --- | --- | --- | --- | --- | --- | --- | ------------ | --- | --------- | --- | --- | ---- | ------- | ------- |
02
USA, 457–464.
|     |     |     |     |     |     |     | Minaei-Bidgoli |     | B.; | Kashy | D.; | Kortemeyer |     | G.; and |
| --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | ----- | --- | ---------- | --- | ------- |
51
|     |     |     |     |     |     |     | Punch       | W., 2003. | Predicting |        | student |     | performance: | an        |
| --- | --- | --- | --- | --- | --- | --- | ----------- | --------- | ---------- | ------ | ------- | --- | ------------ | --------- |
|     |     |     |     |     |     |     | application |           | of data    | mining | methods |     | with         | an educa- |
detciderP
|     |     |     |     |     |     |     | tional | web-based | system. |     | In Proc. | of  | IEEE | Frontiers |
| --- | --- | --- | --- | --- | --- | --- | ------ | --------- | ------- | --- | -------- | --- | ---- | --------- |
01
|     |     |     |     |     |     |     | in Education. |     | Colorado, |     | USA, | 13–18. |     |     |
| --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --------- | --- | ---- | ------ | --- | --- |
PardosZ.;HeffernanN.;AndersonB.;andHeffernanC.,
|     | 5   |     |     |     |     |     | 2006.       | Using | Fine-Grained  |     | Skill     | Models   | to Fit  | Student |
| --- | --- | --- | --- | --- | --- | --- | ----------- | ----- | ------------- | --- | --------- | -------- | ------- | ------- |
|     |     |     |     |     |     |     | Performance |       | with Bayesian |     | Networks. |          | InProc. | of 8th  |
|     |     |     |     |     |     |     | Int. Conf.  | on    | Intelligent   |     | Tutoring  | Systems. |         | Taiwan. |
0
|          |                                      |     |     |         |     |     | PritchardM.andWilsonS.,2003.UsingEmotional |         |              |       |         |          |            | and        |
| -------- | ------------------------------------ | --- | --- | ------- | --- | --- | ------------------------------------------ | ------- | ------------ | ----- | ------- | -------- | ---------- | ---------- |
|          |                                      | 0   | 5   | 10      | 15  | 20  |                                            |         |              |       |         |          |            |            |
|          |                                      |     |     |         |     |     | Social                                     | Factors | To Predict   |       | Student | Success. |            | Journal of |
|          |                                      |     |     | Desired |     |     | College                                    | Student | Development, |       |         | 44, no.  | 1, 18–28.  |            |
|          |                                      |     |     |         |     |     | R Development                              |         | Core         | Team, | 2006.   | R:       | A language | and        |
| Figure3: | Exampleofthepredictionsonthetestset: |     |     |         |     | DT  |                                            |         |              |       |         |          |            |            |
confusion matrices for A-Por-Bin and A-Por-5L setups environment for statistical computing. R Foundation
|            |            |      |     |           |          |     | for Statistical |     | Computing, |     | Vienna, | Austria, |     | ISBN 3- |
| ---------- | ---------- | ---- | --- | --------- | -------- | --- | --------------- | --- | ---------- | --- | ------- | -------- | --- | ------- |
| (top); and | RF scatter | plot | for | A-Mat-Reg | (bottom) |     |                 |     |            |     |         |          |     |         |
900051-00-3,http://www.R-project.org.
|     |     |     |     |     |     |     | Turban | E.; Sharda |     | R.; Aronson |     | J.; | and | King D., |
| --- | --- | --- | --- | --- | --- | --- | ------ | ---------- | --- | ----------- | --- | --- | --- | -------- |
REFERENCES
|     |     |     |     |     |     |     | 2007. | Business | Intelligence, |     | A   | Managerial |     | Approach. |
| --- | --- | --- | --- | --- | --- | --- | ----- | -------- | ------------- | --- | --- | ---------- | --- | --------- |
Prentice-Hall.
| Breiman | L., 2001. | Random | Forests. | Machine |     | Learning, |            |     |               |           |               |      |         |          |
| ------- | --------- | ------ | -------- | ------- | --- | --------- | ---------- | --- | ------------- | --------- | ------------- | ---- | ------- | -------- |
| 45, no. | 1, 5–32.  |        |          |         |     |           |            |     |               |           |               |      |         |          |
|         |           |        |          |         |     |           | Witten I.  | and | Frank         | E., 2005. |               | Data | Mining: | Practi-  |
|         |           |        |          |         |     |           | calMachine |     | LearningTools |           | andTechniques |      |         | withJava |
BreimanL.;FriedmanJ.;OhlsenR.;andStoneC.,1984.
|                |     |                |     |        |     |            | Implementations. |     | Morgan |     | Kaufmann, |     | San | Francisco, |
| -------------- | --- | -------------- | --- | ------ | --- | ---------- | ---------------- | --- | ------ | --- | --------- | --- | --- | ---------- |
| Classification |     | and Regression |     | Trees. |     | Wadsworth, |                  |     |        |     |           |     |     |            |
CA.
| Monterey, | CA.           |         |     |             |     |             |     |     |     |     |     |     |     |     |
| --------- | ------------- | ------- | --- | ----------- | --- | ----------- | --- | --- | --- | --- | --- | --- | --- | --- |
| Cortez    | P., In press. | RMiner: |     | Data Mining |     | with Neural |     |     |     |     |     |     |     |     |
BIBLIOGRAPHIE
| Networks  | and    | Support      | Vector | Machines    | using           | R. In      |         |                |         |          |       |        |          |          |
| --------- | ------ | ------------ | ------ | ----------- | --------------- | ---------- | ------- | -------------- | ------- | -------- | ----- | ------ | -------- | -------- |
| R. Rajesh | (Ed.), | Introduction |        | to Advanced |                 | Scientific |         |                |         |          |       |        |          |          |
|           |        |              |        |             |                 |            | PAULO   | CORTEZ         |         | was born | in    | Braga, | Portugal | and      |
| Softwares | and    | Toolboxes.   |        |             |                 |            |         |                |         |          |       |        |          |          |
|           |        |              |        |             |                 |            | went to | the University |         | of       | Minho | where  | he       | obtained |
|           |        |              |        |             |                 |            | an Eng. | Degree         | (1995), | a        | M.Sc. | (1998) | and      | a Ph.D   |
| Eurostat, | 2007.  |              |        | Early       | school-leavers. |            |         |                |         |          |       |        |          |          |
http://epp.eurostat.ec.europa.eu/. (2002) in Computer Science. In 2001, he became Lec-
|        |           |             |     |            |     |           | turer at | the    | Dep.      | of Information |     | Systems |     | and Re- |
| ------ | --------- | ----------- | --- | ---------- | --- | --------- | -------- | ------ | --------- | -------------- | --- | ------- | --- | ------- |
| Flexer | A., 1996. | Statistical |     | Evaluation |     | of Neural |          |        |           |                |     |         |     |         |
|        |           |             |     |            |     |           | searcher | at the | Algoritmi |                | R&D | Centre. | He  | partic- |
Networks Experiments: Minimum Requirements and ipated in 7 R&D projects (principal investigator in
Current Practice. In Proceedings of the 13th Euro- 2) and he is co-author of more than fifty publica-
| pean | Meeting | on Cybernetics |     | and | Systems | Research. |          |      |             |     |               |     |          |     |
| ---- | ------- | -------------- | --- | --- | ------- | --------- | -------- | ---- | ----------- | --- | ------------- | --- | -------- | --- |
|      |         |                |     |     |         |           | tions in | int. | conferences |     | and journals. |     | Research | in- |
Vienna, Austria, vol. 2, 1005–1008. terests: Business Intelligence/Data Mining; Neural and
|        |                |     |     |          |     |           | Evolutionary |     | Computation; |     | Forecasting. |     | Web-page: |     |
| ------ | -------------- | --- | --- | -------- | --- | --------- | ------------ | --- | ------------ | --- | ------------ | --- | --------- | --- |
| Hastie | T.; Tibshirani | R.; | and | Friedman | J., | 2001. The |              |     |              |     |              |     |           |     |
http://www.dsi.uminho.pt/˜pcortez
| Elements | of Statistical  |     | Learning:           | Data | Mining, | Infer- |              |            |         |              |     |        |          |         |
| -------- | --------------- | --- | ------------------- | ---- | ------- | ------ | ------------ | ---------- | ------- | ------------ | --- | ------ | -------- | ------- |
|          |                 |     |                     |      |         |        | ALICE        | SILVA      | studied | Informations |     |        | Systems, | obtain- |
| ence,    | and Prediction. |     | Springer-Verlag,NY, |      |         | USA.   |              |            |         |              |     |        |          |         |
|          |                 |     |                     |      |         |        | ing a Degree | (Braganc¸a |         | Polytechnic  |     | Inst., | 2003)    | and a   |
KotsiantisS.; PierrakeasC.;andPintelasP.,2004. Pre- M.Sc. (U. Minho, 2007). Currently, she teaches Infor-
|         |           |             |     |     |          |          | matics at | the secondary |     | school | of  | Arcozelo, | Portugal. |     |
| ------- | --------- | ----------- | --- | --- | -------- | -------- | --------- | ------------- | --- | ------ | --- | --------- | --------- | --- |
| dicting | Students’ | Performance |     | in  | Distance | Learning |           |               |     |        |     |           |           |     |