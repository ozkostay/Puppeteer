import puppeteer from "puppeteer";
import fetch from "node-fetch";
import { config } from "dotenv";
config();

const bd = [];
//==========
const app = async () => {
  console.log("process.env.HEADLESS1", process.env.HEADLESS);
  console.log("process.env.SPORT_URL", process.env.SPORT_URL);
  console.log("process.env.SPORT_PORT", process.env.SPORT_PORT);

  const sport = "cybersport";
  const headless = process.env.HEADLESS === "false" ? false : true;

  console.log("headless", headless);

  const browser = await puppeteer.launch({
    headless: headless, // TRUE - не показывать браузер
  });

  const url = "https://betcity.ru/ru/line/cybersport?ts=48";

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Press 'PageDown' until we load the page completely
  console.log(111);

  for (let i = 0; i < 100; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 30);
      delTimeout = idTimeOut;
    });
    page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  // Нажимаем чекбокс Все события
  const checkEvents = await page.$$eval("span", (els) => {
    const div_checkboxs = Array.from(els);
    div_checkboxs.forEach((div_checkbox) => {
      console.log("===", div_checkbox.innerText);
      if (div_checkbox.innerText.trim().toLowerCase() === "Все события".toLowerCase()) {
        div_checkbox.click();
        return;
      }
    });
  });

  const showButton = await page.$$eval("button", (els) => {
    const buttonShow = Array.from(els);
    console.log("button", buttonShow);
    buttonShow.forEach((button) => {
      console.log("===", button.innerText);
      if (button.innerText.trim().toLowerCase() === "Показать".toLowerCase()) {
        button.click();
        return;
      }
    });
  });

  console.log(222, "Опять ждем");
  for (let i = 0; i < 200; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 30);
      delTimeout = idTimeOut;
    });
    page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  // work with data
  const dataAllChamps = await page.$$eval("div.line__champ", (els) => {
    const retData = [];
    els.forEach((championship) => {
      console.log(" ");
      console.log("el ========================================= ", championship);
      const title = championship.querySelector("a.line-champ__header-link");
      const championShipName = title.innerText.trim();

      let championShipSport = championShipName.split(". ")[1].trim();
      let championShipTurnament = championShipName.split(". ")[2]?.split("(")[0].trim();
      let championShipDate = null;
      let championShipLineTime = null;

      const childrens = Array.from(championship.children);
      
      childrens.forEach((children) => {
        if (children.tagName === "DIV" && children.classList.contains("line-champ__date")) {
          championShipDate = children.innerText;
          championShipLineTime = null;
        }

        if (children.tagName === "APP-LINE-EVENT-UNIT") {
          console.log("children.tagName", children.tagName);
          championShipLineTime = children.querySelector("span.line-event__time")?.innerText;

          let team1 = null;
          let team2 = null;

          const championShipTeams = children.querySelector("span.line-event__name-teams");

          if (!championShipTeams) {
            console.log("Проблема с именами команд");
            return;
          }

          team1 = championShipTeams.children[0]?.innerText;
          team2 = championShipTeams.children[1]?.innerText;
          
          // Далее выбераем коэффициенты для каждой линии
          const kefsContainer = children.querySelector("div.line-event__main-bets");
          const betsChildrens = Array.from(kefsContainer.children);
          
          const lineObj = {
            timestamp: Date(),
            sport: championShipSport,
            turnament: championShipTurnament,
            surface: null,
            date: `${championShipDate} ${championShipLineTime}`,
            name1: team1,
            name2: team2,
            win1_odds: Number(betsChildrens[0]?.innerText || 1),
            win2_odds: Number(betsChildrens[2]?.innerText || 1),
            handicap1_value: Number(betsChildrens[3]?.innerText || 0),
            handicap1_odds: Number(betsChildrens[4]?.innerText || 1),
            handicap2_value: Number(betsChildrens[5]?.innerText || 0),
            handicap2_odds: Number(betsChildrens[6]?.innerText || 1),
            total_value: Number(betsChildrens[7]?.innerText || 0),
            total_under_odds: Number(betsChildrens[8]?.innerText || 1),
            total_over_odds: Number(betsChildrens[9]?.innerText || 1),
          };
          console.log("999 ====== lineObj", lineObj);
          retData.push(lineObj);
        }
      });
    });

    console.log('777', retData);
    return retData;
  });

  // await browser.close(); //========================================================== = = = =

  // Отправляем на backend
  const sendOnBackend = async (lines) => {
    console.log("Длина массива", lines.length);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(lines),
    };
    try {
      const url = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/${sport}/pars`;
      console.log("url", url);
      const res = await fetch(url, options);
      console.log("res", await res.json());
    } catch (e) {
      console.log("ERROR UPLOAD", e);
    }
  };

  const startToBackend = new Date();

  console.log("dataAllChamps-", dataAllChamps);

  sendOnBackend(dataAllChamps);

  console.log("Время выполнения ", new Date() - startToBackend);
  console.log(999);
}; //end =======

app();
