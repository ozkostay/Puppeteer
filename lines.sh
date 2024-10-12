#!/bin/bash


script_dir=$(pwd)
log_file="$script_dir/log-lines.log"

echo = >> $log_file


echo Начало ===  `date` >> $log_file

cd $script_dir

echo    Старт ТЕННИС ===  `date` >> $log_file
node bk_tennis_2.js

echo    Страт ФУТБОЛ ===  `date` >> $log_file
node bk_football.js

echo    Страт БАСКЕТБОЛ ===  `date` >> $log_file
node bk_basketball.js

echo    Страт ХОККЕЙ ===  `date` >> $log_file
node bk_hockey.js

echo Конец ===  `date` >> $log_file

