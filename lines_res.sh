#!/bin/bash

#cd /mnt/arch/linestat_prod/Puppeteer/
dirPupet='/home/konst/Документы/konst/IT/MyNew/Puppeteer'
log_file='log-lines-res.log'
cd $dirPupet

echo = >> $log_file
echo Начало ===  `date` = >> $log_file

echo    Страт РЕЗУЛЬТАТЫ БАСКЕТБОЛ ===  `date` = >> $log_file
#node bk_basketball_results.js
#node bk_basketball.js
ls >> $log_file

echo Конец ===  `date` = >> $log_file



