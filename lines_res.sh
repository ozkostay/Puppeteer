#!/bin/bash

#dirPupet=' /mnt/arch/linestat_prod/Puppeteer/'
dirPupet='/home/konst/Документы/konst/IT/MyNew/Puppeteer'
log_file='log-lines-res.log'
cd $dirPupet

echo = >> $log_file
echo Начало ===  `date` = >> $log_file

echo    Страт РЕЗУЛЬТАТЫ ТЕННИС ===  `date` = >> $log_file
node bk_tennis_results.js
echo    Страт РЕЗУЛЬТАТЫ ФУТБОЛ ===  `date` = >> $log_file
node bk_football_results.js
echo    Страт РЕЗУЛЬТАТЫ БАСКЕТБОЛ ===  `date` = >> $log_file
node bk_basketball_results.js
echo    Страт РЕЗУЛЬТАТЫ ХОККЕЙ ===  `date` = >> $log_file
node bk_hockey_results.js
#node bk_basketball.js
#ls >> $log_file

echo Конец ===  `date` = >> $log_file



