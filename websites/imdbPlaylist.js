const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.imdb.com/list/ls072365661/?sort=list_order,asc&st_dt=&mode=detail&page=1",
    { waitUntil: "networkidle0"}
  );
  const result = await page.evaluate(() => {
    document.body.scrollIntoView(false);
    const rawNames = document.querySelectorAll(".lister-item-header>a");
    const rawImages = document.querySelectorAll(".lister-item-image>a>img,.ribbonize>a>img");
    const rawRating = document.querySelectorAll(".ipl-rating-star.small>.ipl-rating-star__rating");
    const data = [];
    for (let i in rawNames) {
      data.push({
        link: rawNames[i].href,
        title: rawNames[i].innerText,
        poster: rawImages[i].currentSrc,
        rating: rawRating[i].innerText
      })
    }
    return data;
  });
  console.log(result);
  await browser.close();
})();
