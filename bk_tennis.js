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
  const data = await page.$$eval("a.category-label-link", (els) => {
    return els.map((el) => {
      const spans = Array.from(el.querySelectorAll("span"));
      const spansText = spans.map((i) => i.innerText);
      return {
        href: el.getAttribute("href"),
        spans: spansText.join(" "),
      };
    });
  });

  console.log("retrun", data);
  console.log("retrun LENGTH", data.length);
  await browser.close();

  console.log(999);
}; //end =======

app();
