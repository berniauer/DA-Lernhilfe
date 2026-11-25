library(DBI)
library(tidyr)
library(dplyr)
library(ggplot2)
library(rstanarm)
library(daatools)

source('patel-utils.R')

###############
# Hilfsfunktionen, die uns die Daten hübsch aufbereiten
# Details können Sie getrost ignorieren

get_raw_data = function(db_path=.db_path) {
  con = DBI::dbConnect(RSQLite::SQLite(), db_path, flags=RSQLite::SQLITE_RO)
  
  daily_sql = "SELECT date, FATALS as fatals, DAY_WEEK as dow,
     HOUR as hour, WEATHER as weather, DRUNK_DR as drunk
     FROM nhtsa_accidents 
     ORDER BY date"
  
  stream_sql =
    "SELECT r.date,
              SUM(r.streams)/1e8 AS streams_m100,
              SUM(CASE WHEN r.date = t.release_date
                      THEN r.streams ELSE 0 END)/1e8 AS new_streams_m100,
              SUM(CASE WHEN r.date <> t.release_date
                      THEN r.streams ELSE 0 END)/1e8 AS old_streams_m100
      FROM spotify_ranking AS r
      JOIN spotify_track AS t ON t.id = r.track_id
      GROUP BY r.date
      ORDER BY r.date"
  
  vm_sql = "SELECT * FROM fhwa_miles";
  
  daily_fars = DBI::dbGetQuery(con,daily_sql) |> mutate(date=as.Date(date))
  daily_spotify = DBI::dbGetQuery(con,stream_sql) |> mutate(date=as.Date(date))
  daily_vm = DBI::dbGetQuery(con,vm_sql)
  
  DBI::dbDisconnect(con)
  
  daily_vm = daily_vm |> rename(year_n=year, month_n=month)
  
  df = daily_fars |> 
    filter(date >= '2017-01-01', date <= '2024-12-31') |>
    left_join(daily_spotify, by='date') |>
    mutate(dow=factor(.dow_num(date)),
           week_n = pmin(52L,(as.numeric(format(date,'%j'))-1)%/%7+1),
           month_n = as.numeric(format(date, '%m')),
           year_n = as.numeric(format(date,'%Y')),
           year=factor(year_n),
           holiday=as.integer(date %in% holidays$date),
           weather = as.factor(weather),
           drunk = factor(ifelse(drunk > 0, "yes", "no"))) |>
    left_join(daily_vm, by=c("month_n", "year_n"))
}

get_daily_drunk_data = function(df) {
  df |>
    group_by(date, drunk) |>
    summarize(n=n(),
              fatalities=sum(fatals),
              dow=first(dow),
              holiday=first(holiday),
              streams_m100=first(streams_m100),
              new_streams_m100=first(new_streams_m100),
              old_streams_m100=first(old_streams_m100),
              week_n=first(week_n),
              year=first(year),
              vmt=first(vmt)/1000, # in Mrd Meilen
              .groups='drop')
}

#############

 # neue DB! Laden Sie sich streaming-unfaelle.zip aus Moodle herunter
raw_data = get_raw_data('streaming-unfaelle.db')
daily_drunk = get_daily_drunk_data(raw_data)
info(daily_drunk)

ggplot(daily_drunk, aes(date, vmt)) +
  geom_line() +
  theme_light() +
  labs(title="Gefahrene Meilen (je Monat, in Mrd)")

m1=stan_glm(
  fatalities ~ dow + new_streams_m100 + old_streams_m100 + holiday + year + drunk + vmt,
  data = daily_drunk)
m1
plotcoef(m1, "dow")
plotcoef(m1, "year")
plothist(m1, "drunkyes")
plothist(m1, "new_streams_m100", compVal = 0)

# Interaktion
m2=stan_glm(
  fatalities ~ dow + new_streams_m100*drunk + old_streams_m100 + holiday + year + vmt,
  data = daily_drunk)
m2

params2 = as.matrix(m2)
slope_no = params2[, "new_streams_m100"]
slope_yes = params2[, "new_streams_m100"] + params2[, "new_streams_m100:drunkyes"]
rbind(
  no = hdi(slope_no, add=median),
  yes = hdi(slope_yes, add=median)
)

int_no = margin_curve(m2, daily_drunk|>filter(drunk=="no"), 'new_streams_m100', 0)
int_yes = margin_curve(m2, daily_drunk|>filter(drunk=="yes"), 'new_streams_m100', 0)

m2_lines = data.frame(
  drunk = c("no", "yes"),
  intercept = c(int_no$estimate, int_yes$estimate),
  slope     = c(median(slope_no), median(slope_yes))
)
m2_lines

ggplot(daily_drunk, aes(new_streams_m100, fatalities)) +
  geom_point(alpha=.2) + 
  facet_grid(~drunk) +
  geom_abline(data=m2_lines, aes(intercept=intercept, slope=slope), color="green4") +
  theme_light()

compare_coef(m1, m2)

###

## Bonus: wieder Week mit ins Modell einbeziehen
m3=stan_glm(
  fatalities ~ dow + new_streams_m100*drunk + old_streams_m100 + 
    holiday + year + vmt + ns(week_n, 5),
  data = daily_drunk)

params3 = as.matrix(m3)
slope_no3 = params3[, "new_streams_m100"]
slope_yes3 = params3[, "new_streams_m100"] + params3[, "new_streams_m100:drunkyes"]
rbind(
  no = hdi(slope_no3, add=median),
  yes = hdi(slope_yes3, add=median)
)

m3
compare_coef(m2, m3)

plotcoef(m3, "streams")
