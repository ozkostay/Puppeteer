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

  const sport = "basketball";
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

  // (function () {
  //   // Функция для поиска и клика
  //   const clickAllEvents = () => {
  //     // Ищем span, который содержит именно этот текст

  //     const spans = Array.from(document.querySelectorAll("span"));
  //     const targetSpan = spans.find((el) => el.textContent.trim() === "Все события");

  //     if (targetSpan) {
  //       // Находим ближайший родительский контейнер, который обычно отвечает за клик
  //       const parentContainer = targetSpan.closest(".champs__champ");

  //       if (parentContainer) {
  //         parentContainer.click();
  //         console.log('✅ Клик по "Все события" выполнен');
  //       } else {
  //         // Если контейнер не найден, кликаем по самому тексту
  //         targetSpan.click();
  //         console.log("⚠️ Контейнер не найден, кликнули по тексту");
  //       }
  //     } else {
  //       console.log('❌ Элемент "Все события" пока не найден на странице');
  //     }
  //   };

  //   // Запускаем поиск
  //   clickAllEvents();
  // })();

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
    // console.log("div_checkboxs", div_checkboxs);
    div_checkboxs.forEach((div_checkbox) => {
      //const label = div_checkbox.querySelector("label");
      console.log("===", div_checkbox.innerText);
      if (div_checkbox.innerText.trim().toLowerCase() === "Все события".toLowerCase()) {
        // console.log("=== CLICK", div_checkbox);
        div_checkbox.click();

        return;
      }
    });
  });

  const showButton = await page.$$eval("button", (els) => {
    const buttonShow = Array.from(els);
    console.log("button", buttonShow);
    buttonShow.forEach((button) => {
      //const label = div_checkbox.querySelector("label");
      console.log("===", button.innerText);
      if (button.innerText.trim().toLowerCase() === "Показать".toLowerCase()) {
        // console.log("=== BUTTON click button");
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
      console.log("el ========================================= ", championship);
      const title = championship.querySelector("a.line-champ__header-link");
      const championShipName = title.innerText; //===============================

      let championShipDate = null;
      let championShipLineTime = null;

      const childrens = Array.from(championship.children);
      // console.log('667', childrens)
      childrens.forEach((children) => {
        // console.log("TAG", children.tagName, "class", children.classList);
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
          console.log("======== team1", championShipName, "222", championShipDate, "333", championShipLineTime, "NAMEteam1", team1);
          console.log("======== team2", championShipName, "222", championShipDate, "333", championShipLineTime, "NAMEteam2", team2);

          // Далее выбераем коэффициенты для каждой линии
          // const kefsContainer = children.querySelector("app-line-main-dops-container");
            const kefsContainer = children.querySelector("div.line-event__main-bets");
          console.log("=== kefsContainer", kefsContainer);

          const betsChildrens = Array.from(kefsContainer.children);
          console.log("=== betsChildrens", betsChildrens);
          betsChildrens.forEach((betChildren) => {
            console.log("=== betChildren", betChildren.innerText);
          });
          // const kefsTags = kefsContainer.children.querySelectorAll("line-event__main-bets-button");  
          // console.log("=== kefsTags", kefsTags);


          
        }
      });

      // Выбераем линии чемпионата
      // const lines = championship.querySelectorAll()

      return retData;
    });
    // //=================== object preparation
    // data.forEach((turnament, idx) => {
    //   turnament.lineRows.forEach((lineRow) => {
    //     const tempSoursObj = lineRow;
    //     if (idx === 0) {
    //       console.log("=== lineRow", lineRow, "length", data.length);
    //     }
    //     const prepObj = {
    //       timestamp: turnament.timestamp,
    //       turnament: turnament.turnamentName,
    //       surface: turnament.surface,
    //       date: null,
    //       name1: null,
    //       name2: null,
    //       win1_odds: null,
    //       win2_odds: null,
    //       handicap1_value: null,
    //       handicap1_odds: null,
    //       handicap2_value: null,
    //       handicap2_odds: null,
    //       total_value: null,
    //       total_under_odds: null,
    //       total_over_odds: null,
    //     };
    //     prepObj.name1 = tempSoursObj.players[0];
    //     prepObj.name2 = tempSoursObj.players[1];
    //     prepObj.date = tempSoursObj.date;
    //     if (tempSoursObj.kefsAllTemp[0] !== "—") {
    //       prepObj.win1_odds = Number(tempSoursObj.kefsAllTemp[0]);
    //       prepObj.win2_odds = Number(tempSoursObj.kefsAllTemp[1]);
    //     }
    //     console.log("sss1", prepObj.win1_odds);
    //     console.log("sss2", prepObj.win2_odds);
    //     console.log("sss3", tempSoursObj.kefsAllTemp.length);
    //     if (tempSoursObj.kefsAllTemp[2].split("=&=")[0] !== "—") {
    //       prepObj.handicap1_value = Number(
    //         tempSoursObj.kefsAllTemp[2].split("=&=")[0].replace(/\(|\)/g, "")
    //       );
    //       prepObj.handicap1_odds = Number(
    //         tempSoursObj.kefsAllTemp[2].split("=&=")[1]
    //       );
    //       prepObj.handicap2_value = Number(
    //         tempSoursObj.kefsAllTemp[3].split("=&=")[0].replace(/\(|\)/g, "")
    //       );
    //       prepObj.handicap2_odds = Number(
    //         tempSoursObj.kefsAllTemp[3].split("=&=")[1]
    //       );
    //     }
    //     if (tempSoursObj.kefsAllTemp[4].split("=&=")[0] !== "—") {
    //       prepObj.total_value = Number(
    //         tempSoursObj.kefsAllTemp[4].split("=&=")[0].replace(/\(|\)/g, "")
    //       );
    //       prepObj.total_under_odds = Number(
    //         tempSoursObj.kefsAllTemp[4].split("=&=")[1]
    //       );
    //       prepObj.total_over_odds = Number(
    //         tempSoursObj.kefsAllTemp[5].split("=&=")[1]
    //       );
    //     }
    //     bd.push(prepObj);
    //   });
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

  console.log("BD-", bd);

  // sendOnBackend(bd);

  console.log("Время выполнения ", new Date() - startToBackend);
  console.log(999);
}; //end =======

app();
