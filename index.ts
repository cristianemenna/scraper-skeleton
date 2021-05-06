const puppeteer = require('puppeteer');
import { Browser } from "puppeteer";
import { Controller } from "./src/controller/controller";

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--disable-setuid-sandbox"],
    'ignoreHTTPSErrors': true
  }) as Browser;

  console.log("Browser initialized");

  const controller = new Controller(browser);
  const url = `https://github.com/cristianemenna`;
  await controller.scrap(url);
})();

