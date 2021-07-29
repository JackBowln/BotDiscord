const puppeteer = require("puppeteer")

;(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  })

  const page = await browser.newPage()

  await page.goto("https://aluno.uvv.br")

  //   await page.waitForNavigation()
  await page.type("#Matricula", "202090728") // click link to cause navigation
  await page.type("#Password", "v1ru55ur1v") // click link to cause navigation
  await Promise.all([
    page.click(
      "#PageWrapper > div > div > div:nth-child(1) > div > form > div.row > div.col-lg-12 > button"
    ), // click link to cause navigation
    page.waitForNavigation(),
  ])
  await Promise.all([
    page.click("#side-menu > li:nth-child(6) > a"),
    page.waitForNavigation(),
  ])

  var today = new Date()
  var dd = String(today.getDate()).padStart(2, "0")
  var mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
  var yyyy = today.getFullYear()

  today = dd + "/" + mm + "/" + yyyy

  // const today = "20/07/2021"


  await page.waitForXPath("//td/div[contains(.,'" + today + "')]")
  const [projects] = await page.$x("//td/div[contains(.,'" + today + "')]")
  projects.click()


  await page.waitForSelector("#irPraAula")

  const link = await page.$eval("#irPraAula", (elm) => {
      return elm.link
  })

  console.log(link)


  //   await browser.close()
})()
