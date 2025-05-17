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

  const sport = "football";
  const headless = process.env.HEADLESS === "false" ? false : true;

  console.log("headless", headless);

  const browser = await puppeteer.launch({
    headless: headless, // TRUE - не показывать браузер
    // headless: true, // TRUE - не показывать браузер
  });

  // const url = "https://www.marathonbet.ru/su/live/popular?ecids=11500730,3219999,6899838,3241271,13765822,6899932,6843737,11945367,7236917,4357735,15801188,15742892,18877691,16059890,7194839,7198288,6765552";
  const url = "https://www.marathonbet.ru/su/betting/Football+-+11";

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Press 'PageDown' until we load the page completely
  console.log(111);
  for (let i = 0; i < 2000; i += 1) {
    let delTimeout;
    await new Promise((resolve) => {
      const idTimeOut = setTimeout(() => resolve(), 30);
      delTimeout = idTimeOut;
    });
    page.keyboard.press("PageDown");
    clearTimeout(delTimeout);
  }
  console.log(222);

  // work with data
  const data = await page.$$eval("div.category-container", (els) => {
    const retData = [];
    els.forEach((el) => {
      const turnamentId = el.id;

      // ==== Make name of tunament
      const turnamentNameTemp = el.querySelectorAll("h2.category-label");
      const turnamentNameArr = [];
      turnamentNameTemp.forEach((item) => {
        const spans = item.querySelectorAll("span");
        spans.forEach((span) => {
          const spanText = span.innerText.trim();
          if (
            spanText.toLowerCase().includes("финал") ||
            spanText.toLowerCase().includes("полуфинал") ||
            spanText.toLowerCase().includes("раунд") ||
            spanText.toLowerCase().includes("квалификация") ||
            spanText.toLowerCase().includes("1/16 финала") ||
            spanText.toLowerCase().includes("1/8 финала") ||
            spanText.toLowerCase().includes("1/4 финала") ||
            spanText.toLowerCase().includes("1/2 финала")
          ) {
          } else {
            turnamentNameArr.push(spanText);
          }
        });
      });
      const turnamentName = turnamentNameArr.join(" ");

      // surface
      let surface = null;
      const surfaceContainer = el.querySelectorAll(
        "div.tennis-court-surface-container"
      );

      surfaceContainer.forEach((item) => {
        const spans = item.querySelectorAll("span.btn__label");
        if (spans.length > 0) {
          surface = spans[0].innerText.trim();
        }
      });

      //Исключаем по
      const arrWords = ["Итоги", "Парный разряд", "Женщины"];
      const check = arrWords.reduce((acc, cur) => {
        const plus = turnamentName.includes(cur) ? 1 : 0;
        return acc + plus;
      }, 0);
      if (check > 0) return;

      // Исключаем если не в списке
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
      ];
      // const turnamentFullName = turnDiv.firstChild.textContent.trim();

      let championatInList = false;
      arrChempionat.forEach((championat) => {
        // console.log('987 ', championat, ' ==8== ', turnamentName)
        if (championat === turnamentName) championatInList = true;
      });
      if (!championatInList) return;

      console.log("= Проходим ===== ", turnamentName, surface);

      // ========== Labels
      const labels = [];
      const labelTableSource = Array.from(
        el.querySelectorAll(".coupone-labels")
      );

      labelTableSource.forEach((i) => {
        // console.log("333", i);
        const ths = i.querySelectorAll("th");
        ths.forEach((th) => {
          // console.log('======= 444' , th.textContent.trim().slice(' ')[0]);
          // console.log(
          //   "======= 444=" + th.textContent.trim().split(" ")[0] + "="
          // );
          labels.push(th.textContent.trim().split(" ")[0].replace(/\n/g, ""));
        });
      });

      // find line_rows
      const lineRows = [];
      const rows = Array.from(el.querySelectorAll("table.coupon-row-item"));
      const rowsInTurnament = rows.length;

      rows.forEach((row, rowIndex) => {
        // =================== find players in row
        const nameSpans = Array.from(
          row.querySelectorAll("span[data-member-link]")
        );
        const players = [];
        nameSpans.forEach((i) => players.push(i.innerText.trim()));

        // Дата события
        const dateDiv = row.querySelector(".date-wrapper");
        const willDate = dateDiv?.innerText.trim();

        // ===================  find data-market-type
        const kefsAll = Array.from(row.querySelectorAll("[data-market-type]"));
        const kefsAllTemp = [];
        kefsAll.forEach((i) =>
          kefsAllTemp.push(`${i.innerText.trim().replace(/\n/g, "=&=")}`)
        );

        if (players.length > 0) {
          lineRows.push({ rowIndex, labels, players, kefsAllTemp, date: willDate });
        }
      });

      // Add data in turnament

      retData.push({
        turnamentId,
        turnamentName,
        surface,
        lineRows,
        rowsInTurnament,
        timestamp: Date(),
      });
    });
    return retData;
  });

  //=================== object preparation
  data.forEach((turnament, idx) => {
    turnament.lineRows.forEach((lineRow) => {
      const tempSoursObj = lineRow;
      if (idx === 0) {
        console.log("=== lineRow", lineRow, "length", data.length);
      }

      const prepObj = {
        timestamp: turnament.timestamp,
        turnament: turnament.turnamentName,
        surface: turnament.surface,
        date: null,
        name1: null,
        name2: null,
        win1_odds: null,
        draw_odds: null,
        win2_odds: null,
        double_1x_odds: null,
        double_12_odds: null,
        double_x2_odds: null,
        handicap1_value: null,
        handicap1_odds: null,
        handicap2_value: null,
        handicap2_odds: null,
        total_value: null,
        total_under_odds: null,
        total_over_odds: null,
      };

      prepObj.name1 = tempSoursObj.players[0];
      prepObj.name2 = tempSoursObj.players[1];
      prepObj.date = tempSoursObj.date;
      if (tempSoursObj.kefsAllTemp[0] !== "—") {
        prepObj.win1_odds = Number(tempSoursObj.kefsAllTemp[0]);
        prepObj.draw_odds = Number(tempSoursObj.kefsAllTemp[1]);
        prepObj.win2_odds = Number(tempSoursObj.kefsAllTemp[2]);
        prepObj.double_1x_odds = Number(tempSoursObj.kefsAllTemp[3]);
        prepObj.double_12_odds = Number(tempSoursObj.kefsAllTemp[4]);
        prepObj.double_x2_odds = Number(tempSoursObj.kefsAllTemp[5]);
      }
      if (tempSoursObj.kefsAllTemp[6].split("=&=")[0] !== "—") {
        prepObj.handicap1_value = Number(
          tempSoursObj.kefsAllTemp[6].split("=&=")[0].replace(/\(|\)/g, "")
        );

        prepObj.handicap1_odds = Number(
          tempSoursObj.kefsAllTemp[6].split("=&=")[1]
        );

        prepObj.handicap2_value = Number(
          tempSoursObj.kefsAllTemp[7].split("=&=")[0].replace(/\(|\)/g, "")
        );

        prepObj.handicap2_odds = Number(
          tempSoursObj.kefsAllTemp[7].split("=&=")[1]
        );
      }
      if (tempSoursObj.kefsAllTemp[8].split("=&=")[0] !== "—") {
        prepObj.total_value = Number(
          tempSoursObj.kefsAllTemp[8].split("=&=")[0].replace(/\(|\)/g, "")
        );

        prepObj.total_under_odds = Number(
          tempSoursObj.kefsAllTemp[8].split("=&=")[1]
        );

        prepObj.total_over_odds = Number(
          tempSoursObj.kefsAllTemp[9].split("=&=")[1]
        );
      }
      bd.push(prepObj);
    });
  });

  // console.log(bd[0]);
  bd.forEach((i) => {
    // console.log(i.turnament, i.name1);
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
      // const url = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/${sport}/pars`;
      const url = `${process.env.SPORT_URL}:${process.env.SPORT_PORT}/${sport}/pars`;
      const res = await fetch(url, options);
      // console.log("res", await res.json());
    } catch (e) {
      console.log("ERROR UPLOAD", e);
    }
  };

  const startToBackend = new Date();

  // console.log(bd);
  bd.forEach((i) => {
    console.log('!!!- ', i.turnament, " - ", i.name1, " - ", i.name2, " - ", i.date);
  })
  

  // sendOnBackend(bd);
  
  console.log("Время выполнения ", new Date() - startToBackend);
  console.log(999);

}; //end =======

app();
