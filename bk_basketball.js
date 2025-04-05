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

  const url = "https://www.marathonbet.ru/su/betting/Basketball+-+6";

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });

  // Press 'PageDown' until we load the page completely
  console.log(111);

  for (let i = 0; i < 1000; i += 1) {
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
        console.log("WWW==============================");
        spans.forEach((span) => {
          const spanText = span.innerText.trim();
          console.log("WWW", spanText);
          if (
            spanText.toLowerCase().includes("финал") ||
            spanText.toLowerCase().includes("раунд") ||
            spanText.toLowerCase().includes("квалификация") ||
            spanText.toLowerCase().includes("1/8 финала") ||
            spanText.toLowerCase().includes("1/4 финала") ||
            spanText.toLowerCase().includes("1/2 финала") ||
            spanText.toLowerCase().includes("полуфинал") ||
            spanText.toLowerCase().includes("финал")
          ) {
          } else {
            turnamentNameArr.push(spanText);
          }
        });
      });
      let turnamentName = turnamentNameArr.join(" ");
      // Убераем точку если она есть в конце
      turnamentName =
        turnamentName.at(-1) === "."
          ? turnamentName.slice(0, turnamentName.length - 1)
          : turnamentName;

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
      const arrWords = ["Итоги", "Женщины"];
      const check = arrWords.reduce((acc, cur) => {
        const plus = turnamentName.includes(cur) ? 1 : 0;
        return acc + plus;
      }, 0);
      if (check > 0) return;

      // Исключаем если не в списке
      const arrChempionat = [
        "NBA",
        "Лига ВТБ. Мужчины",
        "WNBA",
        "Германия. Мужчины. Бундеслига",
        "Испания. Мужчины. Лига ACB",
        "Греция. Мужчины. GBL",
        "Австралия. Мужчины. NBL",
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

        // Ищем дату события
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
        win2_odds: null,
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
        prepObj.win2_odds = Number(tempSoursObj.kefsAllTemp[1]);
      }

      console.log("sss1", prepObj.win1_odds);
      console.log("sss2", prepObj.win2_odds);
      console.log("sss3", tempSoursObj.kefsAllTemp.length);

      if (tempSoursObj.kefsAllTemp[2].split("=&=")[0] !== "—") {
        prepObj.handicap1_value = Number(
          tempSoursObj.kefsAllTemp[2].split("=&=")[0].replace(/\(|\)/g, "")
        );

        prepObj.handicap1_odds = Number(
          tempSoursObj.kefsAllTemp[2].split("=&=")[1]
        );

        prepObj.handicap2_value = Number(
          tempSoursObj.kefsAllTemp[3].split("=&=")[0].replace(/\(|\)/g, "")
        );

        prepObj.handicap2_odds = Number(
          tempSoursObj.kefsAllTemp[3].split("=&=")[1]
        );
      }
      if (tempSoursObj.kefsAllTemp[4].split("=&=")[0] !== "—") {
        prepObj.total_value = Number(
          tempSoursObj.kefsAllTemp[4].split("=&=")[0].replace(/\(|\)/g, "")
        );

        prepObj.total_under_odds = Number(
          tempSoursObj.kefsAllTemp[4].split("=&=")[1]
        );

        prepObj.total_over_odds = Number(
          tempSoursObj.kefsAllTemp[5].split("=&=")[1]
        );
      }
      bd.push(prepObj);
    });
  });


  await browser.close(); //========================================================== = = = =

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

  sendOnBackend(bd);

  console.log("Время выполнения ", new Date() - startToBackend);
  console.log(999);
}; //end =======

app();
