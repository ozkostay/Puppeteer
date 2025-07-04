import puppeteer from "puppeteer";
import fetch from "node-fetch";
import { config } from "dotenv";
import fs from "node:fs";

config();

function writeToLog(content) {
  fs.writeFile(`res_log.log`, content, { flag: "a" }, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
}

const bd = [];
//==========
writeToLog(`Старт результатов Футбол\n`);
const app = async () => {
  console.log("process.env.HEADLESS", process.env.HEADLESS);
  console.log("process.env.SPORT_URL", process.env.SPORT_URL);
  console.log("process.env.SPORT_PORT", process.env.SPORT_PORT);

  // const url_del = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/tennis/results`;
  // console.log(url_del);
  const headless = process.env.HEADLESS === "false" ? false : true;
  console.log("HEADLESS", headless);

  const browser = await puppeteer.launch({
    headless: headless, // TRUE - не показывать браузер
  });

  const url = "https://www.marathonbet.ru/su/unionresults.htm";

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Ждем загрузку страницы
  console.log(111);
  writeToLog(`Футбол 111 ${Date()}\n`);

  for (let i = 0; i < 5; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 1000);
      delTimeout = idTimeOut;
    });
    // page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  // Нажимаем чекбокс Футбол
  const data = await page.$$eval("label.v-label", (els) => {
    const labels = Array.from(els);
    labels.forEach((label) => {
      console.log("===", label.innerText);
      if (label.innerText.trim().toLowerCase() === "футбол") {
        label.click();
        return;
      }
    });
  });
  console.log("=== 1.5");
  writeToLog(`Футбол 1,5 ${Date()}\n`);

  // Ждем 3 секунды ============================================
  for (let i = 0; i < 3; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 1000);
      delTimeout = idTimeOut;
    });
    // page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  // Нажимаем ЗАВЕРШИВШИЕСЯ
  const buttons = await page.$$eval(".other-filters span", (els) => {
    const arrSpans = Array.from(els);
    let buttonFinished = null;
    arrSpans.forEach((item) => {
      if (item.outerText == "Завершившиеся") {
        if (!buttonFinished) buttonFinished = item.closest("button");
      }
    });
    if (buttonFinished) buttonFinished.click();
  });

  // Ждем 3 секунды ============================================
  for (let i = 0; i < 3; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 1000);
      delTimeout = idTimeOut;
    });
    // page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  // Нажимаем выбор временного диапазона
  const buttonDate = await page.$$eval("button.date-picker-btn", (els) => {
    console.log("=== BUTTON", els);
    els[0].click();
  });
  console.log(222);
  writeToLog(`Футбол 222 ${Date()}\n`);

  // Нажимаем последние 3 дня
  const threeDays = await page.$$eval("div.v-list-item__content", (els) => {
    const timeWhen = Array.from(els);
    timeWhen.forEach((div) => {
      console.log("=====", div.innerText);
      // if (div.innerText.trim().toLowerCase() === "последние 7 дней") {
      if (div.innerText.trim().toLowerCase() === "последние 3 дня") {
        div.click();
      }
    });
    return "последние 7 дней";
  });
  console.log(333, Date());
  writeToLog(`Футбол 333 ${Date()}\n`);

  // PageDown пока не прочитаются все линии
  for (let i = 0; i < 500; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 50);
      delTimeout = idTimeOut;
    });
    page.keyboard.press("PageDown");
    if (i % 10 === 0) {
      page.keyboard.press("PageUp");
    }
    // console.log("clearTimeout", delTimeout);
    clearTimeout(delTimeout);
  }

  // for (let i = 0; i < 400; i += 1) {
  //   let delTimeout;
  //   await new Promise((resolve) => {
  //     const idTimeOut = setTimeout(() => resolve(), 50);
  //     delTimeout = idTimeOut;
  //   });
  //   page.keyboard.press("PageDown");
  //   // console.log("clearTimeout", delTimeout);
  //   clearTimeout(delTimeout);
  // }

  console.log(3331, Date());
  writeToLog(`Футбол 3331 ${Date()}\n`);

  // Проверка нужных турниров
  const arrGames = await page.$$eval("div.result-category", async (el) => {
    const arrGamesReturn = [];
    // console.log('TTT', el);
    const arrChempionat = [
      "Россия. Премьер-лига",
      "Англия. Премьер-лига",
      "Германия. Бундеслига",
      "Испания. Примера дивизион",
      "Италия. Серия A",
      "Франция. Лига 1",
      "Португалия. Примейра-лига",
      "Англия. Чемпион-лига",
      "Аргентина. Примера дивизион",
      "Бразилия. Серия A",
      "Мексика. Примера дивизион",
      "Футбол. США. MLS",
      "Турция. Суперлига",
    ];
    const arrTurnamentDOM = Array.from(el);
    console.log('Длина массива arrTurnamentDOM', arrTurnamentDOM);

    arrTurnamentDOM.forEach((turnDiv) => {
      let turnamentName = turnDiv.firstChild.textContent.trim();
      console.log(turnamentName);

      //>========= Обрезаем ненужные хвосты
      const arrTailForDel = [". 1/16 финала", ". 1/8 финала", ". 1/4 финала", ". 1/2 финала", ". Финал"];

      arrTailForDel.forEach((i) => {
        if (turnamentName.includes(i)) {
          turnamentName = turnamentName.replace(i, "");
        }
      });
      //<===========================

      let championatInList = false;
      arrChempionat.forEach((championat) => {
        if (championat === turnamentName) championatInList = true;
      });
      // const checkChempionat = arrChempionat.reduce((acc, cur) => {
      //   const plus = turnamentName.includes(cur) ? 1 : 0;
      //   return acc + plus;
      // }, 0);

      if (!championatInList) return;
      // Далее обрабатываем если чеммпионат из списка

      const gameRows = turnDiv.lastChild;
      const arrGame = Array.from(gameRows.querySelectorAll("div.result-event"));
      console.log("Tурнир", turnamentName);

      arrGame.forEach((oneGame) => {
        const newObj = {
          turnament: turnamentName,
          players: oneGame.querySelector("td.event-name-container").innerText?.trim(),
          result: oneGame.querySelector("td.value")?.innerText.trim(),
          dataResult: oneGame.querySelector("td.date")?.innerText.trim(),
        };
        console.log("=+=", newObj);
        arrGamesReturn.push(newObj);
      });
    });

    return arrGamesReturn;
  });

  // console.log("", rowsResults);
  await browser.close(); //========================================================== = = = =

  // Отправляем на backend
  const sendOnBackend = async (resultLines) => {
    console.log("Длина массива", resultLines.length);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(resultLines),
    };
    try {
      const url = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/football/results`;
      console.log("URL", url);
      const res = await fetch(url, options);
      console.log("res", await res.json());
    } catch (e) {
      console.log("ERROR UPLOAD", e);
    }
  };

  sendOnBackend(arrGames);

  console.log(444, "Отправили на бекенд", arrGames);
  writeToLog(`Футбол 444 ${Date()}\n\n`);

  // await browser.close(); //========================================================== = = = =
};

app();
