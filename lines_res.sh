#!/bin/bash

log_file='lines-res.log'
dirPupet=$(pwd)

echo =$HOSTNAME=

if [[ "$HOSTNAME" == "konst-ub22" ]]; then
  echo "Host work PROD"
  node_bin=/home/konst/.nvm/versions/node/v20.14.0/bin/node
elif [[ "$HOSTNAME" == "linestat-mate" ]]; then
  echo "Host home PROD"
  node_bin=/home/konst/.nvm/versions/node/v20.17.0/bin/node
else
  echo "Host NOT PROD"
  node_bin=/home/konst/.nvm/versions/node/v20.15.1/bin/node
fi

cd $dirPupet

echo = >> $log_file
echo Начало ===  `date` = >> $log_file

echo    Страт РЕЗУЛЬТАТЫ ТЕННИС ===  `date` = >> $log_file
$node_bin bk_tennis_results.js

echo    Страт РЕЗУЛЬТАТЫ ФУТБОЛ ===  `date` = >> $log_file
$node_bin bk_football_results.js

echo    Страт РЕЗУЛЬТАТЫ БАСКЕТБОЛ ===  `date` = >> $log_file
$node_bin bk_basketball_results.js

echo    Страт РЕЗУЛЬТАТЫ ХОККЕЙ ===  `date` = >> $log_file
$node_bin bk_hockey_results.js

echo Конец ===  `date` = >> $log_file



