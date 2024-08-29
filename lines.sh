#!/bin/bash
echo Начало ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log

cd /mnt/arch/linestat_prod/Puppeteer/




node bk_tennis_2.js
node bk_football.js
node bk_hockey.js





echo Конец ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log

echo ========================================================================================

