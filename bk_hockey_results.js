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

  const sport = "hockey";
  const headless = (process.env.HEADLESS = "false" ? false : true);

  // const url_del = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/tennis/results`;
  // console.log(url_del);

  const browser = await puppeteer.launch({
    headless: headless, // TRUE - не показывать браузер
  });

  const url = "https://www.marathonbet.ru/su/unionresults.htm";

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Ждем загрузку страницы
  for (let i = 0; i < 500; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 10);
      delTimeout = idTimeOut;
    });
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
      if (div.innerText.trim().toLowerCase() === "последние 7 дней") {
        // if (div.innerText.trim().toLowerCase() === "последние 7 дней") {
        div.click();
      }
    });
    return "последние 7 дней";
  });
  console.log(333);

  for (let i = 0; i < 500; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 30);
      delTimeout = idTimeOut;
    });
    page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  console.log(3331);

  // Проверка нужных турниров
  const arrGames = await page.$$eval("div.result-category", async (el) => {
    const arrGamesReturn = [];
    // console.log('TTT', el);
    const arrChempionat = [
      "NHL",
      "КХЛ",
    ];
    const arrTurnamentDOM = Array.from(el);
    arrTurnamentDOM.forEach((turnDiv) => {
      const turnamentName = turnDiv.firstChild.textContent.trim();

      let championatInList = false;
      arrChempionat.forEach((championat) => {
        if (championat === turnamentName) championatInList = true;
      });

      if (!championatInList) return;
        
      console.log('Проходим', turnamentName);
      // Далее обрабатываем если чеммпионат из списка
      const gameRows = turnDiv.lastChild;
      const arrGame = Array.from(gameRows.querySelectorAll("div.result-event"));
      console.log("Tурнир", turnamentName);

      arrGame.forEach((oneGame) => {
        const newObj = {
          turnament: turnamentName,
          players: oneGame
            .querySelector("td.event-name-container")
            .innerText?.trim(),
          result: oneGame.querySelector("td.value")?.innerText.trim(),
          dataResult: oneGame.querySelector("td.date")?.innerText.trim(),
        };
        console.log('=+=',newObj);
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
      const url = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/${sport}/results`;
      console.log("URL", url);
      const res = await fetch(url, options);
      console.log("res", await res.json());
    } catch (e) {
      console.log("ERROR UPLOAD", e);
    }
  };

  sendOnBackend(arrGames);

  console.log(444, arrGames);

  // await browser.close(); //========================================================== = = = =
};

app();
