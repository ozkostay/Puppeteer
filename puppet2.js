// const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // Navigate to page
  // await page.goto("https://infinite-scroll.com/demo/masonry/");
  await page.goto("https://www.marathonbet.ru/su/betting/Tennis+-+2398");

  // Function to check if we've reached the bottom of the page
  const isBottom = async () => {
    return await page.evaluate(() => {
      return window.innerHeight + window.scrollY >= document.body.offsetHeight;
    });
  };

  // Loop until we've reached the bottom of the page
  // This is because as new elements load we will no longer
  // at the bottom of the page.
  while (!(await isBottom())) {
    // Scroll to the bottom of the page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait 1s (1000ms) before scrolling again
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Take a screenshot
  await page.screenshot({
    path: "wait-hardcode.png",
  });

  // Close the browser
  await browser.close();
})();