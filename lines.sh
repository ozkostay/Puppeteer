#!/bin/bash
echo Начало ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.txt

cd /mnt/arch/linestat_prod/Puppeteer/




node bk_tennis_2.js
node bk_football.js





echo Конец ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.txt

echo ========================================================================================

