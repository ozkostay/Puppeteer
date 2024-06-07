import puppeteer from "puppeteer";

//==========
const app = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://www.marathonbet.ru/su/live/popular", {
    waitUntil: "domcontentloaded",
  });

  // // Press 'PageDown' until we load the page completely
  // console.log(111);
  // for (let i = 0; i < 1000; i += 1) {
  //   await new Promise((r) => setTimeout(r, 10));
  //   page.keyboard.press("PageDown");
  // }

  // console.log(222);

  // // work with data
  // const data = await page.$$eval("div.category-container", (els) => {
  //   const retData = [];
  //   els.forEach((el) => {
  //     const turnamentId = el.id;
      
  //     // ========== Labels
  //     const labels = [];
  //     const labelTableSource = Array.from(
  //       el.querySelectorAll(".coupone-labels")
  //     );

  //     labelTableSource.forEach((i) => {
  //       console.log('333', i);
  //       const ths = i.querySelectorAll("th");
  //       ths.forEach((th) => {
  //         // console.log('======= 444' , th.textContent.trim().slice(' ')[0]);
  //         console.log('======= 444=' + th.textContent.trim().split(' ')[0] + '=');
  //         labels.push(th.textContent.trim().split(' ')[0].replace(/\n/g, ''));
  //       })

  //     })
  //     // let LabelThs = [];
  //     // console.log('234', labelTableSource[0],'654');
  //     // const labelSellsSource = labelTableSource[0].querySelectorAll("th")
  //     // console.log('777', labelSellsSource.length,'888');
  //     //LabelThs = labelTableSource[0].querySelectorAll("th");
  //     // LabelThs.forEach((i, idx) => {
  //     //   console.log('123', idx, '===', i);
  //     // })
      
  //     // labels.push(labelThs.length);
      
  //     // find line_rows
  //     const lineRows = [];
  //     const rows = Array.from(el.querySelectorAll("table.coupon-row-item"));
  //     const rowsInTurnament = rows.length;

  //     rows.forEach((row, rowIndex) => {
        
        
  //       // labelSource.forEach((i) => labels.push(i.innerText));
        
  //       // =================== find players in row
  //       const nameSpans = Array.from(
  //         row.querySelectorAll("span[data-member-link]")
  //       );
  //       const players = [];
  //       nameSpans.forEach((i) => players.push(i.innerText));

  //       // ===================  find data-market-type
  //       const kefsAll = Array.from(row.querySelectorAll("[data-market-type]"));
  //       const kefsAllTemp = [];
  //       kefsAll.forEach((i) => kefsAllTemp.push(`${i.innerText}`));

  //       if (players.length > 0) {
  //         lineRows.push({ rowIndex, labels, players, kefsAllTemp });
  //       }
  //     });

  //     // Add data in turnament
  //     retData.push({ turnamentId, lineRows, rowsInTurnament });
  //   });
  //   return retData;
  // });

  // console.log("retrun", data[0]);
  // console.log("retrun", JSON.stringify(data[0]));
  // console.log("retrun LENGTH", data.length);
  // await browser.close();

  console.log(999);
}; //end =======

app();
