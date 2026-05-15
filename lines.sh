#!/bin/bash

#exit

script_dir="/var/Puppeteer"
log_file="$script_dir/log-lines.log"


echo = >> $log_file

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


echo Начало ===  `date` >> $log_file

cd $script_dir

echo    Старт ТЕННИС    ===  `date` >> $log_file
$node_bin bk_tennis_2.js

echo    Старт ФУТБОЛ    ===  `date` >> $log_file
$node_bin bk_football2025.js

echo    Старт БАСКЕТБОЛ ===  `date` >> $log_file
$node_bin bk_basketball.js

echo    Страт ХОККЕЙ    ===  `date` >> $log_file
$node_bin bk_hockey.js

echo    Старт КИБЕРСПОРТ    ===  `date` >> $log_file
$node_bin bk_cybersport.js

echo Конец ===  `date` >> $log_file
