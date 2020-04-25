var express = require("express");
var puppeteer = require("puppeteer");
var bodyParser = require("body-parser");
var cors = require("cors");

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/search/:search", (req, res) => {
  console.log(req.params.search);
  const it = req.params.search;
  const o = it.split(" ");
  let first = o[0];
  let second = o[1];
  var cfirst = first.charAt(0).toUpperCase() + first.slice(1);
  var csecond = second.charAt(0).toUpperCase() + second.slice(1);

  // personal information
  (async () => {
    const browser = await puppeteer.launch();
    ({ headless: false });
    const page = await browser.newPage();
    await page.goto(`https://en.wikipedia.org/wiki/${cfirst}_${csecond}`);
    const html = await page.content();
    await page.waitForSelector("img", {
      visible: true,
    });
    const data = await page.evaluate(() => {
      const images = document.querySelectorAll(".image");
      const urls = Array.from(images).map((v) => v.firstChild.src);
      const name = document.querySelector(".nickname").innerText;
      const dob = document.querySelector(".bday").innerText;
      const wife = Array.from(
        document.querySelectorAll("abbr[title='married']")
      );
      const spouse = wife.map((a) => a.parentElement.textContent)[0];
      const aboutsel = Array.from(document.querySelectorAll("p"));
      const about = aboutsel.map((a) => a.innerText);
      const profess = Array.from(document.querySelectorAll("p"));
      const professional = profess.map((a) => a.textContent);

      return [urls[0], name, dob, spouse, about[2], professional[3]];
    });

    //for Patent data
    const page2 = await browser.newPage();
    await page2.goto(`https://patents.justia.com/inventor/${first}-${second}`);
    const html2 = await page.content();
    await page2.waitForSelector("div", {
      visible: true,
    });
    const patentdata = await page2.evaluate(() => {
      const patentArray = [];
      const patent = Array.from(document.querySelectorAll("h6.heading-6"));
      const patents = patent.map((a) => a.textContent.replace(/\s\s+/g, " "));
      const abstract = Array.from(document.querySelectorAll("div.abstract"));
      const abstracts = abstract.map((a) =>
        a.textContent.replace(/\s\s+/g, " ")
      );

      for (var i = 0; i < patents.length; i++) {
        patentArray.push(patents[i]);
        patentArray.push(abstracts[i]);
      }
      return patentArray;
    });

    const [url, name, dob, spouse, about, professional] = data;
    const obj = {
      url: url,
      name: name,
      dob: dob,
      spouse: spouse,
      about: about,
      professional: professional,
      patent: patentdata,
    };

    // console.log(obj);
    res.send(obj);
  })();
});

app.listen(5000);
