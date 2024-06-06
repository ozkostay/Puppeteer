import puppeteer from "puppeteer";

//==========
const app = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://www.marathonbet.ru/su/betting/Tennis+-+2398", {
    waitUntil: "domcontentloaded",
  });

  // Press 'PageDown' until we load the page completely
  console.log(111);
  for (let i = 0; i < 1000; i += 1) {
    await new Promise((r) => setTimeout(r, 10));
    page.keyboard.press("PageDown");
  }

  console.log(222);

  // work with data
  const data = await page.$$eval("div.category-container", (els) => {
    const retData = [];
    els.forEach((el) => {
      const turnamentId = el.id;
      const lineRows = [];

      // find line_rows
      const rows = Array.from(
        el.querySelectorAll("table.member-area-content-table")
      );
      const rowsInTurnament = rows.length;

      rows.forEach((row, rowIndex) => {
        // find players in row
        const spans = Array.from(
          row.querySelectorAll("span[data-member-link]")
        );
        const players = [];
        spans.forEach((i) => players.push(i.innerText));

        lineRows.push({ rowIndex, players });
      });

      // Add data in turnament
      retData.push({ turnamentId, lineRows, rowsInTurnament });
    });
    return retData;
  });

  console.log("retrun", data[0]);
  console.log("retrun", JSON.stringify(data[0]));
  console.log("retrun LENGTH", data.length);
  await browser.close();

  console.log(999);
}; //end =======

app();
