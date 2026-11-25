<!-- Quelle: Wiederholung, Downloads und Kurzreferenzen/Downloads  Kurzreferenzen/RStudio-IDE-cheatsheet.pdf -->

RStudio IDE  The RStudio IDE is an Integrated Development Environment in R that comes in three versions
Cheat Sheet
|     |     |     |     |     |     |     |     | Desktop IDE   |     |     |     |     |     | Open Source Server   |     |     |     |     |     | Professional Server   |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ------------- | --- | --- | --- | --- | --- | -------------------- | --- | --- | --- | --- | --- | --------------------- | --- | --- |
A local version of the IDE  for larger compute resources  for teams that share large compute
learn more at www.rstudio.com
resources, large data, and uniform
|     |     |     |     |     |     |     |     | for your desktop  |     |     |     |     |     | and remote access |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- | ----------------- | --- | --- | --- | --- | --- | --- | --- | --- |
environments for collaboration
Download all at www.rstudio.com. Each provides the same useful interface:
DDooccuummeennttss  aanndd  AAppppss WWrriittee  CCooddee RR  SSuuppppoorrtt RRSSttuuddiioo  PPrroo  FFeeaattuurreess
|     |     |     |     |     |     |     |     |     |     |     |     | Import data file  |     | History of past  |     | Display .RPres  |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------------- | --- | ---------------- | --- | --------------- | --- | --- | --- | --- | --- | --- |
Navigate  Open in new  Save Find and  Compile as  Run  Share Project  Active shared  Start new R Session
Open Shiny, R Markdown,  with wizard commands to  slideshows
tabs window replace notebook selected  with Collaborators collaborators in current  project
knitr, Sweave, LaTeX, .Rd files  run/add to source File > New  File >
code
|        |         | and more in Source Pane |         |         |     |     |     |     |     |     |     |     |     |     |     | R Presentation |     |       |     |     | Close R Session  |     |
| ------ | ------- | ----------------------- | ------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | ----- | --- | --- | ---------------- | --- |
|        |         |                         |         |         |     |     |     |     |     |     |     |     |     |     |     |                |     | T H J |     |     | in project       |     |
| Check  | Render  | Choose                  | Choose  | Insert  |     |     |     |     |     |     |     |     |     |     |     |                |     |       |     |     |                  |     |
T H J
| spelling | output | output  | output   | code  |             |     |         |                 |     |            |       |     |       |             |     |                |     |     |     |     |     | Select    |
| -------- | ------ | ------- | -------- | ----- | ----------- | --- | ------- | --------------- | --- | ---------- | ----- | --- | ----- | ----------- | --- | -------------- | --- | --- | --- | --- | --- | --------- |
|          |        | format  | location | chunk |             |     |         |                 |     |            |       |     |       |             |     |                |     |     |     |     |     | R Version |
|          |        |         |          |       | Cursors of  |     | Re-run  | Source with or  |     | Show file  | Load  |     | Save  | Delete all  |     | Search inside  |     |     |     |     |     |           |
Jump to  Jump  Run  Publish  Show file  shared users previous code without Echo outline workspace workspace saved objects environment                                                                   PPrroojjeecctt  SSyysstteemm
| previous  | to next  | selected  | to server | outline |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| --------- | -------- | --------- | --------- | ------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
chunk chunk lines Multiple cursors/column selection  Choose environment to display from  Display objects  File > New Project
with Alt + mouse drag. list of parent environments as list or grid RStudio saves the call history,
Access markdown guide at   Code diagnostics that appear in the margin.  workspace, and working
Help > Markdown Quick Reference Hover over diagnostic symbols for details. directory associated with a
Name of
project. It reloads each when
current project
Jump to  Set knitr  Run this and  Run this  Syntax highlighting based  you re-open a project.
| chunk |     | chunk   | all previous  | code chunk |     |     |     | on your file's extension |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ----- | --- | ------- | ------------- | ---------- | --- | --- | --- | ------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|       |     | options | code chunks   |            |     |     |     |                          |     |     |     |     |     |     |     |     |     |     |     |     |     |     |
Tab completion to finish
RStudio opens plots in a dedicated Plots pane
|     |     |     |     |     |     |     |     | function names, file paths,  |     |     | Displays saved objects by   |     |     |     | View in data  |     | View function  |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | ---------------------------- | --- | --- | --------------------------- | --- | --- | --- | ------------- | --- | -------------- | --- | --- | --- | --- | --- |
|     |     |     |     |     |     |     |     |                              |     |     | type with short description |     |     |     | viewer        |     | source code    |     |     |     |     |     |
arguments, and more.
|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | Navigate  | Open in  | Export  | Delete  | Delete  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | -------- | ------- | ------- | ------- |
Multi-language code
|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | recent plots | window | plot | plot | all plots |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------------ | ------ | ---- | ---- | --------- |
snippets to quickly use
common blocks of code.
RStudio recognizes that files named app.R,  GUI Package manager lists every installed package
| server.R, ui.R, and global.R belong to a shiny app |      |         |             |         | Jump to function in file  |     |     |     | Change file type |     |         |         |         |         |     |     |           |          |          |                              |     |     |
| -------------------------------------------------- | ---- | ------- | ----------- | ------- | ------------------------- | --- | --- | --- | ---------------- | --- | ------- | ------- | ------- | ------- | --- | --- | --------- | -------- | -------- | ---------------------------- | --- | --- |
|                                                    |      |         |             |         |                           |     |     |     |                  |     | Create  | Upload  | Delete  | Rename  |     |     | Change    |          |          |                              |     |     |
|                                                    |      |         |             |         |                           |     |     |     |                  |     | folder  | file    | file    | file    |     |     | directory | Install  | Update   | Create reproducible package  |     |     |
|                                                    |      |         |             |         |                           |     |     |     |                  |     |         |         |         |         |     |     |           | Packages | Packages | library for your project     |     |     |
|                                                    | Run  | Choose  | Publish to  | Manage  |                           |     |     |     |                  |     |         |         |         |         |     |     |           |          |          |                              |     |     |
Path to displayed directory
|     | app | location to  | shinyapps.io  | publish  |     |     |           |     |                |     |     |     |     |     |     |     |     |     |     |     |     |     |
| --- | --- | ------------ | ------------- | -------- | --- | --- | --------- | --- | -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|     |     |              |               |          |     |     | Working   |     | Maximize,      |     |     |     |     |     |     |     |     |     |     |     |     |     |
|     |     | view app     | or server     | accounts |     |     |           |     |                |     |     |     |     |     |     |     |     |     |     |     |     |     |
|     |     |              |               |          |     |     | Directory |     | minimize panes |     |     |     |     |     |     |     |     |     |     |     |     |     |
Press ! to see
|     |     |     |     |     |     |     |     |     | Drag pane  |     | A File browser keyed to your working directory.  |     |     |     |     |     |     | Click to load package with  |     |     | Package  | Delete  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------- | --- | ------------------------------------------------ | --- | --- | --- | --- | --- | --- | --------------------------- | --- | --- | -------- | ------- |
command history boundaries Click on file or directory name to open. library(). Unclick to detach  version  from
|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | package with detach() |     |     | installed | library |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------------------- | --- | --- | --------- | ------- |
DDeebbuugg  MMooddee VVeerrssiioonn  CCoonnttrrooll  wwiitthh  GGiitt  oorr  SSVVNN
RStudio opens documentation in a dedicated Help pane
|     |     |     |     |     |     | Launch debugger  |     | Open traceback to examine  |     |     |     | Turn on at Tools > Project Options > Git/SVN |     |     |     |     |     |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | ---------------- | --- | -------------------------- | --- | --- | --- | -------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
Open with debug(), browse(), or a breakpoint. RStudio will open the  mode from origin  the functions that R called  Show file  Commit  Push/Pull
|     |     |     |     |     |     |     |     |     |     |     |     | Stage  |     |     |     |     | View  |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ------ | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- |
debugger mode when it encounters a breakpoint while executing code. of error before the error occurred diff staged files to remote
|                |     |     |     |     |     |     |     |     |     |     |           | files: |     |     |     |     | History |                |     |                |             |     |
| -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --------- | ------ | --- | --- | --- | --- | ------- | -------------- | --- | -------------- | ----------- | --- |
|                |     |     |     |     |     |     |     |     |     |     |           |        |     |     |     |     |         | Home page of   |     | Search within  | Search for  |     |
|                |     |     |     |     |     |     |     |     |     |     |           |        |     |     |     |     |         | helpful links  |     | help file      | help file   |     |
| Click next to  |     |     |     |     |     |     |     |     |     |     | •A Added  |        |     |     |     |     |         |                |     |                |             |     |
•D Deleted
line number to  Viewer Pane displays HTML content, such as Shiny apps,
M• Modified
add/remove a  RMarkdown reports, and interactive visualizations
|     |     |     |     |     |     |     |     |     |     |     | •R Renamed  |     | Open shell to  |     |     |     | current  |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | -------------- | --- | --- | --- | -------- | --- | --- | --- | --- | --- |
breakpoint.
|     |     |     |     |     |     |     |     |     |     |     | • Untracked |     | type commands |     |     |     | branch |     |     |     |     |     |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------------- | --- | --- | --- | ------ | --- | --- | --- | --- | --- |
?
| Highlighted  |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | Stop Shiny  |     | Publish to shinyapps.io,  |     | Refresh  |
| ------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ----------- | --- | ------------------------- | --- | -------- |
line shows  PPaacckkaaggee  WWrriittiinngg app rpubs, RSConnect, …
where
View(<data>) opens spreadsheet like view of data set
| execution has  |     |     |     |     |     |     |     |     |     |     |     | File > New Project >   |     |     |     |     |     |     |     |     |     |     |
| -------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---------------------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
paused
New Directory > R Package
Turn project into package,
Run commands in  Examine variables  Select function  Step through  Step into and  Resume  Quit debug  Enable roxygen documentation with
environment where  in executing  in traceback to  code one line  out of functions  execution mode  Tools > Project Options > Build Tools
execution has paused environment debug at a time to run Filter rows by value  Sort by  Search
Roxygen guide at
|     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     |     | or value range |     |     | values | for value |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | -------------- | --- | --- | ------ | --------- |
Help > Roxygen Quick Reference
RStudio® is a trademark of RStudio, Inc.  •  CC BY RStudio •  info@rstudio.com  •  844-448-1212 • rstudio.com  More cheat sheets at http://www.rstudio.com/resources/cheatsheets/ Learn more at support.rstudio.com  •  RStudio IDE  0.99.832  •  Updated: 01/16

|          |               |     |              |                |     | 5 DEBUG CODE | Windows/Linux | Mac |
| -------- | ------------- | --- | ------------ | -------------- | --- | ------------ | ------------- | --- |
| 1 LAYOUT | Windows/Linux | Mac | 4 WRITE CODE | Windows /Linux | Mac |              |               |     |
Attempt completion Tab or Ctrl+Space Tab or Cmd+Space Toggle Breakpoint Shift+F9 Shift+F9
| Move focus to Source Editor | Ctrl+1 | Ctrl+1 |                     |     |     |                   |     |     |
| --------------------------- | ------ | ------ | ------------------- | --- | --- | ----------------- | --- | --- |
|                             |        |        | Navigate candidates | !/" | !/" | Execute Next Line | F10 | F10 |
| Move focus to Console       | Ctrl+2 | Ctrl+2 |                     |     |     |                   |     |     |
Accept candidate Enter, Tab, or # Enter, Tab, or # Step Into Function Shift+F4 Shift+F4
| Move focus to Help | Ctrl+3 | Ctrl+3 |     |     |     |     |     |     |
| ------------------ | ------ | ------ | --- | --- | --- | --- | --- | --- |
Dismiss candidates Esc Esc Finish Function/Loop Shift+F6 Shift+F6
| Show History | Ctrl+4 | Ctrl+4 |      |              |             |                |          |          |
| ------------ | ------ | ------ | ---- | ------------ | ----------- | -------------- | -------- | -------- |
|              |        |        | Undo | Ctrl+Z       | Cmd+Z       | Continue       | Shift+F5 | Shift+F5 |
| Show Files   | Ctrl+5 | Ctrl+5 |      |              |             |                |          |          |
|              |        |        | Redo | Ctrl+Shift+Z | Cmd+Shift+Z |                |          |          |
|              |        |        |      |              |             | Stop Debugging | Shift+F8 | Shift+F8 |
| Show Plots   | Ctrl+6 | Ctrl+6 |      |              |             |                |          |          |
|              |        |        | Cut  | Ctrl+X       | Cmd+X       |                |          |          |
Show Packages Ctrl+7 Ctrl+7 6 VERSION CONTROL Windows/Linux Mac
|     |     |     | Copy | Ctrl+C | Cmd+C |     |     |     |
| --- | --- | --- | ---- | ------ | ----- | --- | --- | --- |
Show Environment Ctrl+8 Ctrl+8 Show diff Ctrl+Alt+D Ctrl+Option+D
|     |     |     | Paste | Ctrl+V | Cmd+V |     |     |     |
| --- | --- | --- | ----- | ------ | ----- | --- | --- | --- |
Show Git/SVN Ctrl+9 Ctrl+9 Commit changes Ctrl+Alt+M Ctrl+Option+M
|     |     |     | Select All | Ctrl+A | Cmd+A |     |     |     |
| --- | --- | --- | ---------- | ------ | ----- | --- | --- | --- |
Show Build Ctrl+0 Ctrl+0 Delete Line Ctrl+D Cmd+D Scroll diff view Ctrl+!/" Ctrl+!/"
Select Shift+[Arrow] Shift+[Arrow] Stage/Unstage (Git) Spacebar Spacebar
| 2 RUN CODE | Windows/Linux | Mac |     |     |     |     |     |     |
| ---------- | ------------- | --- | --- | --- | --- | --- | --- | --- |
Select Word Ctrl+Shift+ $/# Option+Shift+ $/# Stage/Unstage and move to next Enter Enter
| Search command history | Ctrl+! | Cmd+! |     |             |             |     |     |     |
| ---------------------- | ------ | ----- | --- | ----------- | ----------- | --- | --- | --- |
|                        |        |       |     | Alt+Shift+$ | Cmd+Shift+$ |     |     |     |
Select to Line Start
Navigate command history !/" !/" 7 MAKE PACKAGES Windows/Linux Mac
|     |     |     |     | Alt+Shift+# | Cmd+Shift+# |     |     |     |
| --- | --- | --- | --- | ----------- | ----------- | --- | --- | --- |
Select to Line End
Move cursor to start of line Home Cmd+$ Build and Reload Ctrl+Shift+B Cmd+Shift+B
|     |     |     | Select Page Up/Down | Shift+PageUp/Down | Shift+PageUp/Down |     |     |     |
| --- | --- | --- | ------------------- | ----------------- | ----------------- | --- | --- | --- |
Move cursor to end of line End Cmd+ # Load All (devtools) Ctrl+Shift+L Cmd+Shift+L
|     |     |     | Select to Start/End | Shift+Alt+!/" | Cmd+Shift+!/" |     |     |     |
| --- | --- | --- | ------------------- | ------------- | ------------- | --- | --- | --- |
Change working directory Ctrl+Shift+H Ctrl+Shift+H Test Package (Desktop) Ctrl+Shift+T Cmd+Shift+T
|     |     |     | Delete Word Left | Ctrl+Backspace | Ctrl+Opt+Backspace |     |     |     |
| --- | --- | --- | ---------------- | -------------- | ------------------ | --- | --- | --- |
Interrupt current command Esc Esc Test Package (Web) Ctrl+Alt+F7 Cmd+Alt+F7
|     |     |     | Delete Word Right |     | Option+Delete |     |     |     |
| --- | --- | --- | ----------------- | --- | ------------- | --- | --- | --- |
Clear console Ctrl+L Ctrl+L Check Package Ctrl+Shift+E Cmd+Shift+E
|     |     |     | Delete to Line End |     | Ctrl+K |     |     |     |
| --- | --- | --- | ------------------ | --- | ------ | --- | --- | --- |
Quit Session (desktop only) Ctrl+Q Cmd+Q Delete to Line Start   Option+Backspace Document Package Ctrl+Shift+D Cmd+Shift+D
Restart R Session Ctrl+Shift+F10 Cmd+Shift+F10 Indent Tab (at start of line) Tab (at start of line)
|     |     |     |     |     |     | 8 DOCUMENTS AND APPS | Windows/Linux | Mac |
| --- | --- | --- | --- | --- | --- | -------------------- | ------------- | --- |
Run current line/selection Ctrl+Enter Cmd+Enter Outdent Shift+Tab Shift+Tab
|     |     |     |     |     |     | Preview HTML (Markdown, etc.) | Ctrl+Shift+K | Cmd+Shift+K |
| --- | --- | --- | --- | --- | --- | ----------------------------- | ------------ | ----------- |
Run current (retain cursor) Alt+Enter Option+Enter Yank line up to cursor Ctrl+U Ctrl+U
|     |     |     |     |     |     | Knit Document (knitr) | Ctrl+Shift+K | Cmd+Shift+K |
| --- | --- | --- | --- | --- | --- | --------------------- | ------------ | ----------- |
Run from current to end Ctrl+Alt+E Cmd+Option+E Yank line after cursor Ctrl+K Ctrl+K
Insert yanked text Ctrl+Y Ctrl+Y Compile Notebook Ctrl+Shift+K Cmd+Shift+K
| Run the current function  | Ctrl+Alt+F | Cmd+Option+F |     |     |     |     |     |     |
| ------------------------- | ---------- | ------------ | --- | --- | --- | --- | --- | --- |
Insert <- Alt+- Option+- Compile PDF (TeX and Sweave) Ctrl+Shift+K Cmd+Shift+K
| dSoefuinrcitei oan file | Ctrl+Shift+O | Cmd+Shift+O |     |     |     |     |     |     |
| ----------------------- | ------------ | ----------- | --- | --- | --- | --- | --- | --- |
Insert %>% Ctrl+Shift+M Cmd+Shift+M Insert chunk (Sweave and Knitr) Ctrl+Alt+I Cmd+Option+I
| Source the current file | Ctrl+Shift+S | Cmd+Shift+S |     |     |     |     |     |     |
| ----------------------- | ------------ | ----------- | --- | --- | --- | --- | --- | --- |
Show help for function F1 F1 Insert code section Ctrl+Shift+R Cmd+Shift+R
| Source with echo | Ctrl+Shift+Enter | Cmd+Shift+Enter |     |     |     |     |     |     |
| ---------------- | ---------------- | --------------- | --- | --- | --- | --- | --- | --- |
Show source code  F2 F2 Re-run previous region Ctrl+Shift+P Cmd+Shift+P
3 NAVIGATE CODE Windows /Linux Mac uNnecwt idooncument Ctrl+Shift+N Cmd+Shift+N
|     |     |     |     |     |     | Run current document | Ctrl+Alt+R | Cmd+Option+R |
| --- | --- | --- | --- | --- | --- | -------------------- | ---------- | ------------ |
Goto File/Function Ctrl+. Ctrl+. New document (Chrome) Ctrl+Alt+Shift+N Cmd+Shift+Alt+N
|               |       |              |               |        |       | Run from start to current line | Ctrl+Alt+B | Cmd+Option+B |
| ------------- | ----- | ------------ | ------------- | ------ | ----- | ------------------------------ | ---------- | ------------ |
| Fold Selected | Alt+L | Cmd+Option+L | Open document | Ctrl+O | Cmd+O |                                |            |              |
|               |       |              |               |        |       | Run the current code section   | Ctrl+Alt+T | Cmd+Option+T |
Unfold Selected Shift+Alt+L Cmd+Shift+Option+L Save document Ctrl+S Cmd+S
|            |             |                    |                         |              |              | Run previous Sweave/Rmd code | Ctrl+Alt+P | Cmd+Option+P |
| ---------- | ----------- | ------------------ | ----------------------- | ------------ | ------------ | ---------------------------- | ---------- | ------------ |
| Fold All   | Alt+O       | Cmd+Option+O       | Close document          | Ctrl+W       | Cmd+W        |                              |            |              |
|            |             |                    |                         |              |              | Run the current chunk        | Ctrl+Alt+C | Cmd+Option+C |
|            |             |                    | Close document (Chrome) | Ctrl+Alt+W   | Cmd+Option+W |                              |            |              |
| Unfold All | Shift+Alt+O | Cmd+Shift+Option+O |                         |              |              |                              |            |              |
|            |             |                    |                         |              |              | Run the next chunk           | Ctrl+Alt+N | Cmd+Option+N |
|            |             |                    | Close all documents     | Ctrl+Shift+W | Cmd+Shift+W  |                              |            |              |
| Go to line | Shift+Alt+G | Cmd+Shift+Option+G |                         |              |              |                              |            |              |
|            |             |                    |                         |              |              | Sync Editor & PDF Preview    | Ctrl+F8    | Cmd+F8       |
|            |             |                    | Extract function        | Ctrl+Alt+X   | Cmd+Option+X |                              |            |              |
| Jump to    | Shift+Alt+J | Cmd+Shift+Option+J |                         |              |              |                              |            |              |
|            |             |                    | Extract variable        | Ctrl+Alt+V   | Cmd+Option+V |                              |            |              |
Switch to tab Ctrl+Shift+. Ctrl+Shift+. Previous plot Ctrl+Alt+F11 Cmd+Option+F11
Reindent lines Ctrl+I Cmd+I Next plot Ctrl+Alt+F12 Cmd+Option+F12
| Previous tab | Ctrl+F11 | Ctrl+F11 |                   |              |             |     |     |     |
| ------------ | -------- | -------- | ----------------- | ------------ | ----------- | --- | --- | --- |
|              |          |          | (Un)Comment lines | Ctrl+Shift+C | Cmd+Shift+C |     |     |     |
Next tab Ctrl+F12 Ctrl+F12 Reflow Comment Ctrl+Shift+/ Cmd+Shift+/ Show Keyboard Shortcuts Alt+Shift+K Option+Shift+K
First tab Ctrl+Shift+F11 Ctrl+Shift+F11 Reformat Selection Ctrl+Shift+A Cmd+Shift+A
Why RStudio Server Pro?
Last tab Ctrl+Shift+F12 Ctrl+Shift+F12 Select within braces Ctrl+Shift+E Ctrl+Shift+E
Do everything you would do with the open source server with a
Navigate back Ctrl+F9 Cmd+F9 Show Diagnostics Ctrl+Shift+Alt+P Cmd+Shift+Alt+P
|                  |          |         | Transpose Letters  |         | Ctrl+T     | commercial license, support, and more. |     |     |
| ---------------- | -------- | ------- | ------------------ | ------- | ---------- | -------------------------------------- | --- | --- |
| Navigate forward | Ctrl+F10 | Cmd+F10 |                    |         |            |                                        |     |     |
|                  |          |         | Move Lines Up/Down | Alt+!/" | Option+!/" | •                                      |     |     |
Jump to Brace Ctrl+P Ctrl+P edit the same project at the same time as others
|     |     |     | Copy Lines Up/Down | Shift+Alt+!/" | Cmd+Option+!/" | •   |     |     |
| --- | --- | --- | ------------------ | ------------- | -------------- | --- | --- | --- |
Select within Braces Ctrl+Shift+Alt+E Ctrl+Shift+Alt+E switch easily from one version of R to a different version
|     |     |     | Add New Cursor Above | Ctrl+Alt+Up | Ctrl+Alt+Up |     |     |     |
| --- | --- | --- | -------------------- | ----------- | ----------- | --- | --- | --- |
Use Selection for Find Ctrl+F3 Cmd+E • open and run multiple R sessions simultaneously
|     |     |     | Add New Cursor Below | Ctrl+Alt+Down | Ctrl+Alt+Down |     |     |     |
| --- | --- | --- | -------------------- | ------------- | ------------- | --- | --- | --- |
Find in Files Ctrl+Shift+F Cmd+Shift+F • see what you and others are doing on your server
|     |     |     | Move Active Cursor Up | Ctrl+Alt+Shift+Up | Ctrl+Alt+Shift+Up |     |     |     |
| --- | --- | --- | --------------------- | ----------------- | ----------------- | --- | --- | --- |
Find Next Win: F3, Linux: Ctrl+G Cmd+G • tune your resources to improve performance
|     |     |     | Move Active Cursor Down | Ctrl+Alt+Shift+Down | Ctrl+Alt+Shift+Down |     |     |     |
| --- | --- | --- | ----------------------- | ------------------- | ------------------- | --- | --- | --- |
Find Previous W: Shift+F3, L: Ctrl+Shift Cmd+Shift+G • integrate with your authentication, authorization, and audit practices
|              |             |             | Find and Replace       | Ctrl+F  | Cmd+F |                                        |     |     |
| ------------ | ----------- | ----------- | ---------------------- | ------- | ----- | -------------------------------------- | --- | --- |
| Jump to Word | +CGtrl+ $/# | Option+ $/# |                        |         |       |                                        |     |     |
|              |             |             | Use Selection for Find | Ctrl+F3 | Cmd+E | Download a free 45 day evaluation at   |     |     |
Jump to Start/End Ctrl+!/" Cmd+!/" www.rstudio.com/products/rstudio-server-pro/
|     |     |     | Replace and Find | Ctrl+Shift+J | Cmd+Shift+J |     |     |     |
| --- | --- | --- | ---------------- | ------------ | ----------- | --- | --- | --- |
RStudio® is a trademark of RStudio, Inc.  •  CC BY RStudio •  info@rstudio.com  •  844-448-1212 • rstudio.com  More cheat sheets at http://www.rstudio.com/resources/cheatsheets/ Learn more at support.rstudio.com  •  RStudio IDE  0.99.832  •  Updated: 01/16