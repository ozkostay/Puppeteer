import puppeteer from 'puppeteer';

const app = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://books.toscrape.com/index.html", {
    waitUntil: "domcontentloaded",
  });
  
  let data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("article h3")).map((el) => {
      return {
        title: el.querySelector("a").getAttribute("title"),
        link: el.querySelector("a").getAttribute("href"),
      };
    });
  });
  
  console.log(data)
  await browser.close();
  
}

app();
