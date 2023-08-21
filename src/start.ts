import puppeteer from "puppeteer";

import { BASE_URL } from "./measures/consts";

(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(BASE_URL);
})();
