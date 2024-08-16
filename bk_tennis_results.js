import puppeteer from "puppeteer";
import fetch from "node-fetch";
import { config } from "dotenv";
config();

const bd = [];
//==========
const app = async () => {
  console.log("process.env.HEADLESS", process.env.HEADLESS);
  console.log("process.env.SPORT_URL", process.env.SPORT_URL);
  console.log("process.env.SPORT_PORT", process.env.SPORT_PORT);

  const url_del = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/tennis/results`;
  console.log(url_del);

  const browser = await puppeteer.launch({
    headless: false, // TRUE - не показывать браузер
  });

  const url = "https://www.marathonbet.ru/su/unionresults.htm";

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Press 'PageDown' until we load the page completely
  console.log(111);
  for (let i = 0; i < 500; i += 1) {
    await new Promise((r) => setTimeout(r, 10));
    // page.keyboard.press("PageDown");
  }

  // Нажимаем чекбокс Теннис
  const data = await page.$$eval("label.v-label", (els) => {
    const labels = Array.from(els);
    labels.forEach((label) => {
      console.log("===", label.innerText);
      if (label.innerText.trim().toLowerCase() === "теннис") {
        label.click();
        return;
      }
    });
  });
  console.log("=== 1.5");

  // Нажимаем выбор временного диапазона
  const buttonDate = await page.$$eval("button.date-picker-btn", (els) => {
    console.log("=== BUTTON", els);
    els[0].click();
  });
  console.log(222);

  // Нажимаем последние 3 дня
  const threeDays = await page.$$eval("div.v-list-item__content", (els) => {
    const timeWhen = Array.from(els);
    timeWhen.forEach((div) => {
      console.log("=====", div.innerText);
      // if (div.innerText.trim().toLowerCase() === "последние 3 дня") {
      if (div.innerText.trim().toLowerCase() === "последние 7 дней") {
        div.click();
      }
    });
    return "последние 7 дней";
  });
  console.log(333);

  for (let i = 0; i < 1400; i += 1) {
    await new Promise((r) => setTimeout(r, 50));
    // page.keyboard.press("End");
    page.keyboard.press("PageDown");
  }

  console.log(3331);

  const rowsResults = await page.$$eval("div.result-event", async (els) => {
    const gameRowsDOM = Array.from(els);
    const gameRows = [];
    gameRowsDOM.forEach((game) => {
      console.log("+++", game.querySelector("td.value"));
      console.log("---", game.querySelector("td.value")?.innerText);
      const newObj = {
        players: game
          .querySelector("td.event-name-container")
          .innerText?.trim(),
        result: game.querySelector("td.value")?.innerText.trim(),
        dataResult: game.querySelector("td.date")?.innerText.trim(),
      };

      // const newObj = {
      //   players: game.querySelector("td.event-name-container").innerText?.trim(),
      //   result: game.querySelector("td.value").innerText?.trim(),
      //   dataResult: game.querySelector("td.date").innerText?.trim(),
      // };

      if (newObj.dataResult) {
        // Если есть дата в таблице
        // Обрабатываем результат
        // console.log('=!====', players,'===', result,'===', dataResult);
        gameRows.push(newObj);
      }
    });

    console.log("ALL", gameRows); // Есть массив с результатами
    return gameRows;
  });

  console.log("", rowsResults);

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
      const url = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/tennis/results`;
      console.log('URL', url);
      const res = await fetch(url, options);
      console.log("res", await res.json());
    } catch (e) {
      console.log("ERROR UPLOAD", e);
    }
  };

  sendOnBackend(rowsResults);

  console.log(444);

  // await browser.close(); //========================================================== = = = =
};

app();
