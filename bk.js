import puppeteer from "puppeteer";

//=====================================
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

//=====================================
const app = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.goto("https://www.marathonbet.ru/su/betting/Tennis+-+2398", {
    waitUntil: "domcontentloaded",
  });

  
  // Press 'PageDown' until we load the page completely
  for (let i = 0; i < 1000; i += 1) {
    await new Promise((r) => setTimeout(r, 10));
    page.keyboard.press("PageDown");  
  }
  
   
  console.log("000-3");

  console.log(111);
  let data = await page.evaluate(async () => {
    //return Array.from(document.querySelectorAll("article h3")).map((el) => {
    console.log(222);
    window.scrollTo(0, document.body.scrollHeight);

    const aLink = Array.from(
      document.querySelectorAll("a.category-label-link")
    ).map((el) => {
      return {
        title: "title",
        link: el.getAttribute("href"),
      };
    });

    return aLink.length;
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
