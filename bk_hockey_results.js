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

writeToLog(`Старт результатов Хоккей\n`);
const bd = [];

//==========
const app = async () => {
  console.log("process.env.HEADLESS", process.env.HEADLESS);
  console.log("process.env.SPORT_URL", process.env.SPORT_URL);
  console.log("process.env.SPORT_PORT", process.env.SPORT_PORT);

  const sport = "hockey";
  const headless = process.env.HEADLESS === "false" ? false : true;
  console.log("HEADLESS", headless);

  // const url_del = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/tennis/results`;
  // console.log(url_del);

  console.log("qqq-1");
  const browser = await puppeteer.launch({
    headless: headless, // TRUE - не показывать браузер
  });

  console.log("qqq-2");
  const url = "https://www.marathonbet.ru/su/unionresults.htm";

  console.log("qqq-3");
  const page = await browser.newPage();
  console.log("qqq-4");
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  console.log(111);
  writeToLog(`Хоккей 111 ${Date()}\n`);

  // Ждем загрузку страницы
  for (let i = 0; i < 5; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 1000);
      delTimeout = idTimeOut;
    });
    page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  // Нажимаем чекбокс Хоккей
  const data = await page.$$eval("label.v-label", (els) => {
    const labels = Array.from(els);
    labels.forEach((label) => {
      console.log("===", label.innerText);
      if (label.innerText.trim().toLowerCase() === "хоккей") {
        label.click();
        return;
      }
    });
  });
  console.log("=== 1.5");

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
  writeToLog(`Хоккей 222 ${Date()}\n`);

  // Нажимаем последние 3 дня
  const threeDays = await page.$$eval("div.v-list-item__content", (els) => {
    const timeWhen = Array.from(els);
    timeWhen.forEach((div) => {
      console.log("=====", div.innerText);
      if (div.innerText.trim().toLowerCase() === "последние 3 дня") {
        // if (div.innerText.trim().toLowerCase() === "последние 7 дней") {
        div.click();
      }
    });
    return "последние 7 дней";
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

  console.log(333, Date());
  writeToLog(`Хоккей 333 ${Date()}\n`);

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
    clearTimeout(delTimeout);
  }

  console.log(3331, Date());
  writeToLog(`Хоккей 3331 ${Date()}\n`);

  // Проверка нужных турниров
  const arrGames = await page.$$eval("div.result-category", async (el) => {
    const arrGamesReturn = [];
    // console.log('TTT', el);
    const arrChempionat = ["NHL", "КХЛ"];
    const arrTurnamentDOM = Array.from(el);
    arrTurnamentDOM.forEach((turnDiv) => {
      let turnamentNameTemp = turnDiv.firstChild.textContent.trim();

      // Удаляем хвосты в турнире
      const arrTailForDel = [". 1/16 финала", ". 1/8 финала", ". 1/4 финала", ". 1/2 финала", ". Финал"];

      arrTailForDel.forEach((i) => {
        if (turnamentNameTemp.includes(i)) {
          turnamentNameTemp = turnamentNameTemp.replace(i, "");
        }
      });

      const turnamentNameFromDOM = turnamentNameTemp;

      let championatInList = false;
      arrChempionat.forEach((championat) => {
        if (championat === turnamentNameFromDOM) championatInList = true;
      });

      if (!championatInList) return;

      console.log("Проходим", turnamentNameFromDOM);
      // Далее обрабатываем если чемпионат из списка
      const gameRows = turnDiv.lastChild;
      const arrGame = Array.from(gameRows.querySelectorAll("div.result-event"));
      console.log("Tурнир", turnamentNameFromDOM);

      // Заполняем результаты и дату
      arrGame.forEach((oneGame) => {
        const newObj = {
          turnament: turnamentNameFromDOM,
          players: oneGame.querySelector("td.event-name-container").innerText?.trim().replace("@", "-"),
          result: oneGame.querySelector("td.value")?.innerText.trim(),
          dataResult: oneGame.querySelector("td.date")?.innerText.trim(),
        };
        console.log("=+=", newObj);
        arrGamesReturn.push(newObj);
      });
    });

    return arrGamesReturn;
  });

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
      const url = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/${sport}/results`;
      console.log("111URL", url);
      const res = await fetch(url, options);
      console.log("res111", await res.json());
    } catch (e) {
      console.log("111 ERROR UPLOAD", e);
    }
  };

  sendOnBackend(arrGames);

  console.log(444, "Отправили на бекенд");
  writeToLog(`Хоккей 444 ${Date()}\n\n`);

  // await browser.close(); //========================================================== = = = =
};

app();
