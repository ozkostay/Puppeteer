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

  const url = "https://betcity.ru/ru/results/cybersport";

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Press 'PageDown' until we load the page completely
  console.log(111);

  for (let i = 0; i < 500; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 30);
      delTimeout = idTimeOut;
    });
    // page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }

  // // Нажимаем чекбокс Все события
  // const checkEvents = await page.$$eval("span", (els) => {
  //   const div_checkboxs = Array.from(els);
  //   let one = false;
  //   div_checkboxs.forEach((div_checkbox) => {
  //     if (one) return;
  //     console.log("===", div_checkbox.innerText);
  //     if (div_checkbox.innerText.trim().toLowerCase() === "Все события".toLowerCase()) {
  //       div_checkbox.click();
  //       one = true
  //       return;
  //     }
  //   });
  // });

  // for (let i = 0; i < 200; i += 1) {
  //   let delTimeout;
  //   await new Promise((resolve) => {
  //     const idTimeOut = setTimeout(() => resolve(), 30);
  //     delTimeout = idTimeOut;
  //   });
  //   // page.keyboard.press("PageDown");
  //   clearTimeout(delTimeout);
  // }

  // const showButton = await page.$$eval("button", (els) => {
  //   const buttonShow = Array.from(els);
  //   console.log("button", buttonShow);
  //   buttonShow.forEach((button) => {
  //     console.log("===", button.innerText);
  //     if (button.innerText.trim().toLowerCase() === "Показать".toLowerCase()) {
  //       button.click();
  //       return;
  //     }
  //   });
  // });

  // console.log(222, "Опять ждем");
  // for (let i = 0; i < 200; i += 1) {
  //   let delTimeout;
  //   await new Promise((resolve) => {
  //     const idTimeOut = setTimeout(() => resolve(), 30);
  //     delTimeout = idTimeOut;
  //   });
  //   page.keyboard.press("PageDown");
  //   clearTimeout(delTimeout);
  // }

  // work with data
  console.log("222", "Начинаем работать с данными");
  // const resultsCyber = await page.$$eval("div.results-wrapper", (els) => {
  const resultsCyber = await page.$$eval("app-results", (els) => {
    const retData = [];

    // console.log("els", els);
    const resultsSection = Array.from(els)[0];
    // console.log("resultsWrapper", resultsWrapper);

    const dateB = resultsSection.querySelector("b.datepicker__current-date");
    
    // console.log('==== DATE ===', new Date(dateB.innerText));

    const championships = resultsSection.querySelectorAll("div.results-champ:not([hidden])");
    // console.log("championships", championships);

    championships.forEach((championship) => {
      console.log(" ");
      console.log("el ========================================= ", championship);
      const spansTitle = championship.querySelector("span.results-champ__title-text");
      const championShipName = spansTitle.innerText.trim();

      if (championShipName.includes("Женщины")) return;

      let championShipSport = championShipName.split(". ")[1].trim();
      let championShipTurnament = championShipName.split(". ")[2]?.split("(")[0].trim();
      let championShipDate = null;
      let championShipLineTime = null;
      console.log(333, championShipSport, championShipTurnament);

      const gameDivs = Array.from(championship.querySelectorAll("app-results-event"));
      // const spans = {};
      // spans.time = 
      gameDivs.forEach((div) => {
      //   console.log("==========", div);
        const spansDivs = Array.from(div.querySelectorAll("span"));
        let result = spansDivs[4].innerText.replace('\n', '').trim();
        if (result.length < 1) return
        result = result.toLowerCase().includes('отмена') ? 'отмена' : result;

        const gameObj = {};
        gameObj.time = spansDivs[0].innerText.replace('\n', '').trim();
        gameObj.teams = spansDivs[2].innerText.replace('\n', '').trim().split(' — ');
        // console.log();
        gameObj.result = result;
        
        const objOneResult = {};
        objOneResult.sport =championShipSport
        // console.log(`DATE-TIME ${dateB.innerText.trim()} ${gameObj.time}`)
        arrDateB = dateB.innerText.trim().split('.');
        const dateToObj = `${arrDateB[2]}.${arrDateB[1]}.${arrDateB[0]}`;
        console.log('DATE-TIME ' + `${dateToObj} ${gameObj.time}`);
        objOneResult.date = String(new Date(`${dateToObj} ${gameObj.time}`));
        objOneResult.player1 = gameObj.teams[0];
        objOneResult.player2 = gameObj.teams[1];
        objOneResult.result = gameObj.result;
        console.log(444, objOneResult)
      
        retData.push(objOneResult)
      });
    });
    return retData;
  });

  // console.log('777', retData);
  // return retData;
  // };

  // await browser.close(); //========================================================== = = = =

  // Отправляем на backend ================================================================s
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

  console.log("resultsCyber-", resultsCyber);
  // dataAllChamps.forEach((item) => {
  //   console.log("name1", item.name1, "name2", item.name2, "date", item.date);
  //   if (item.name2.trim().length === 0) {
  //     console.log("Пропускаем");
  //   }
  //  })

  // sendOnBackend(dataAllChamps);

  console.log("Время выполнения ", new Date() - startToBackend);
  console.log(999);
}; //end =======

app();
