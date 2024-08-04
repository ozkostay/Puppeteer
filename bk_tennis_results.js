import puppeteer from "puppeteer";
import fetch from "node-fetch";

const bd = [];
//==========
const app = async () => {
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
  for (let i = 0; i < 1000; i += 1) {
    await new Promise((r) => setTimeout(r, 10));
    // page.keyboard.press("PageDown");
  }

  // Нажимаем чекбокс Теннис
  const data = await page.$$eval("label.v-label", (els) => {
    const labels = Array.from(els);
    labels.forEach((label) => {
      console.log('===', label.innerText);
      if(label.innerText.trim().toLowerCase() === 'теннис') {
        label.click();
        return;
      }
    })
  })
  console.log('=== 1.5');

  // Нажимаем выбор временного диапазона
  const buttonDate = await page.$$eval("button.date-picker-btn", (els) => {
    console.log('=== BUTTON', els)
    els[0].click();
  })
  console.log(222);
  
  // Нажимаем последние 3 дня
  const threeDays = await page.$$eval("div.v-list-item__content", (els) => {
    const timeWhen = Array.from(els);
    timeWhen.forEach((div) => {
      console.log('=====', div.innerText);
      if(div.innerText.trim().toLowerCase() === 'последние 3 дня') {
        div.click();
      }
    })
  })
  console.log(333);

  const rowsResults = await page.$$eval("div.result-event", (els) => {
    const timeWhen = Array.from(els);
    timeWhen.forEach((div) => {
      const dataResult = div.querySelector('td.date');
      const divDate = dataResult.firstChild;
      if(divDate.innerText) { // Если есть дата в таблице
        // Обрабатываем результат

      }
    })
  })
  console.log(444);



  // await browser.close(); //========================================================== = = = =
}

app();
