#!/bin/bash
echo Начало ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log

cd /mnt/arch/linestat_prod/Puppeteer/




echo    Старт ТЕННИС ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log
node bk_tennis_2.js
echo    Страт ФУТБОЛ ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log
node bk_football.js
echo    Страт ХОККЕЙ ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log
node bk_hockey.js
echo    Страт БАСКЕТБОЛ ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log
node bk_baskenball.js
echo КонецЛ ===  `date` >> /mnt/arch/linestat_prod/Puppeteer/log-lines.log






echo ========================================================================================

