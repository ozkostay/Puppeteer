import puppeteer from "puppeteer";

const app = async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.marathonbet.ru/su/betting/Tennis+-+2398", {
    waitUntil: "domcontentloaded",
  });

  console.log(111);
  let data = await page.evaluate(() => {
    //return Array.from(document.querySelectorAll("article h3")).map((el) => {
    console.log(222);

    const aLink = Array.from(document.querySelectorAll("a.category-label-link"))
    .map((el) => {
      return { link: el.getAttribute("href") };
    });

    return aLink;    
    // return .map((el) => {
    //   return {
    //     // title: el.querySelector("a").getAttribute("title"),
    //     link: el.querySelector("a").getAttribute("href"),
    //   };
    // });
  });

  console.log("retrun", data);
  await browser.close();
  console.log(999);
};

app();
