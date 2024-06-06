import puppeteer from "puppeteer";

//==========
const takeArray = (arr) => {
  return arr.map((el) => {
    return {
      title: "title",
      link: el.getAttribute("href"),
    };
  });
}; //end =======

//==========
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

  console.log(111);

  let data = await page.evaluate(async () => {
    //=====
    function takeArray(arr) {
      return arr.map((el) => {
        return {
          title: "title",
          link: el.getAttribute("href"),
        };
      });
    } //end =======

    const aLink = Array.from(
      document.querySelectorAll("a.category-label-link")
    );
    const arrTitleTournament = takeArray(aLink);

    return arrTitleTournament;
  });

  console.log("retrun", data);
  console.log("retrun LENGTH", data.length);
  await browser.close();
  console.log(999);
}; //end =======

app();
