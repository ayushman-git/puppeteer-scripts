const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");
const url =
  "https://www.imdb.com/list/ls072365661/?sort=list_order,asc&st_dt=&mode=detail&page=";
const pages = 3;
const fileName = "astronomyMovies.js";

(async () => {
  for (let i = 1; i <= pages; i++) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url + i, { waitUntil: "networkidle0" });
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    const result = await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
      const rawNames = document.querySelectorAll(".lister-item-header>a");
      const rawImages = document.querySelectorAll(
        ".lister-item-image>a>img,.ribbonize>a>img"
      );
      const rawRating = document.querySelectorAll(
        ".ipl-rating-star.small>.ipl-rating-star__rating"
      );
      const rawDescription = document.querySelectorAll(
        ".lister-item-content>:nth-child(5)"
      );
      const data = [];
      for (let i in rawNames) {
        data.push({
          link: rawNames[i].href,
          title: rawNames[i].innerText,
          poster: rawImages[i].currentSrc,
          rating: rawRating[i].innerText,
          description: rawDescription[i].innerText,
        });
      }
      return data;
    });
    let dataString = JSON.stringify(result);
    fs.writeFile(path.join(__dirname, "assets", fileName), dataString, () => {
      console.log("Added page - ", i);
    });
    await browser.close();
  }
  
})();