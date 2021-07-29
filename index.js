require("dotenv").config()
var cron = require("cron")
const keepAlive = require("./server")
const fetch = require("node-fetch")
const axios = require("axios")
const url = "https://globoesporte.globo.com/rj/futebol/campeonato-carioca/"
const commands = require("./commands.js")
const fs = require("fs")
const { Client, MessageAttachment } = require("discord.js")

const puppeteer = require("puppeteer")

async function getImage() {
  const browser = await puppeteer.launch()

  const page = await browser.newPage()

  var date1 = new Date()
  var date2 = new Date(`05/27/${new Date().getFullYear() + 1}`)
  var Difference_In_Time = date2.getTime() - date1.getTime()
  var Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24))

  await page.goto(
    `https://www.google.com/search?q=faltam ${Difference_In_Days} dias para o aníversário&sxsrf=ALeKk01ozhh07s0YjJSeINGBFxK5sHBA0g:1627393177786&source=lnms&tbm=isch&sa=X&ved=2ahUKEwje3ZWCsIPyAhXwqZUCHQdpATQQ_AUoAXoECAEQAw&biw=1129&bih=854`
  )
  await page.waitForSelector(
    "#islrg > div.islrc > div:nth-child(1) > a.wXeWr.islib.nfEiy > div.bRMDJf.islir > img"
  )
  const imageSrc = await page.evaluate(() => {
    let src = document.querySelector(
      "#islrg > div.islrc > div:nth-child(1) > a.wXeWr.islib.nfEiy > div.bRMDJf.islir > img"
    ).currentSrc
    return src
  })


  await browser.close()
  return imageSrc
}

const client = new Client()
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`)
  const general_channel = client.channels.cache.get(
    process.env.general_channel_id
  )
  const thiago_channel = client.channels.cache.get(process.env.channel_id)
  const image64 = await getImage()
  let base64String = image64

  let base64Image = base64String.split(";base64,").pop()

  fs.writeFile(
    "image.png",
    base64Image,
    { encoding: "base64" },
    function (err) {
      console.log("File created")
    }
  )

  // general_channel.send(image)
  let scheduledMessage = new cron.CronJob("21 21 21 * * *", () => {
    general_channel.send(
      "@here! Vamos jogar Valheim amigos? posso entrar no servidor com vocês? :D"
    )
  })

  var date1 = new Date()
  var date2 = new Date("05/27/2022")
  var Difference_In_Time = date2.getTime() - date1.getTime()
  var Difference_In_Days = Math.ceil(Difference_In_Time / (1000 * 3600 * 24))

  let niverMessage = new cron.CronJob("00 00 10 * * *", () => {
    if (Difference_In_Days != 0) {
      thiago_channel.send(
        `@here! faltam ${Difference_In_Days} dias até o meu aniversáriooo! :D`
      )
      // thiago_channel.send(gifOfDayMessage)
    } else {
      thiago_channel.send(
        `@everyone! Hoje é meu aniversáriooo! :birthday: :birthday:  :D \n obs: do galishel também rs `
      )
      thiago_channel.send(
        "https://3.bp.blogspot.com/-RwMzTXHc-OQ/WRfBDA-V6KI/AAAAAAAA990/dLxC0hZlb8IbNWZtUnrjw7NkhBlRL-2LQCEw/s400/niver-thiago.jpg"
      )
    }
  })

  // When you want to start it, use:
  scheduledMessage.start()
  niverMessage.start()
})

client.on("guildMemberAdd", (member) => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find((ch) => ch.name === "geral")
  // Do nothing if the channel wasn't found on this server
  if (!channel) return
  // Send the message, mentioning the member
  channel.send(`Seja bem-vindo, amigo ${member}`)
})

function getCombn(arr, pre) {
  pre = pre || ""
  if (!arr.length) {
    return pre
  }
  var ans = arr[0].reduce(function (ans, value) {
    return ans.concat(getCombn(arr.slice(1), pre + value))
  }, [])
  return ans
}

client.on("message", async (message) => {
  const nomes = ["amigo", "thiago", "thiagão", "thiagao"]
  const obrigado = [
    ["obrigado ", "valeu ", "obg ", "brigado ", "tmj ", "tamo junto ", "vlw"],
    nomes,
  ]
  const oi = [["oi ", "olá "], nomes]

  if (message.content === "ping") {
    // Send "pong" to the same channel
    message.channel.send("pong")
  }
  if (message.content === "que") {
    message.channel.send("jo")
  }

  // If the message is '!rip'
  if (message.content === "!rip") {
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment("https://i.imgur.com/w3duR07.png")
    // Send the attachment in the message channel
    message.channel.send(attachment)
  }
  if (message.content === "!aspargos") {
    message.channel.send(`${message.author}, Pra vocês entenderem tudo`, {
      files: [
        "https://i0.wp.com/opas.org.br/wp-content/uploads/2018/08/sindrome-de-asperger-1.jpg?w=696&ssl=1",
      ],
    })
  }

  if (getCombn(obrigado).includes(message.content.toLowerCase())) {
    message.channel.send(`De nada amigo ${message.author}`)
  }
  if (getCombn(oi).includes(message.content.toLowerCase())) {
    message.channel.send(`Oi  ${message.author}, quer jogar pokemon comigo?`)
  }
  if (message.content == "!t") {
    message.channel.send("Me chamou?")
  }
  const { file } = await fetch("https://aws.random.cat/meow").then((response) =>
    response.json()
  )
  if (message.content == "!t cat") {
    message.channel.send(file)
  }
  const dog = await fetch("https://dog.ceo/api/breeds/image/random/1").then(
    (response) => response.json()
  )
  if (message.content == "!t dog") {
    message.channel.send(dog.message)
  }
  if (message.content.startsWith("!t movie")) {
    const query = message.content.split(" ").splice(2).join(" ")
    console.log(query)
    const movie = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=3b2bcb92952fe99e873976e3f34134cc&language=pt-BR&query=${query}&page=1`
    )
      .then((response) => response.json())
      .catch((err) => {
        console.error(err)
      })
    const imageOfMovie = "https://www.themoviedb.org/t/p/w220_and_h330_face"
    console.log(movie.results)
    if (query.length <= 0) {
      message.channel.send(
        "Qual filme você quer pesquisar? Ex: !t movie shrek terceiro"
      )
    } else {
      for (i = 0; i < 3; i++) {
        console.log([i])
        message.channel.send("**" + movie.results[i].title + "**")
        message.channel.send(movie.results[i].overview)
        message.channel.send("**Nota:** " + movie.results[i].vote_average)
        message.channel.send(imageOfMovie + movie.results[i].poster_path)
      }
    }
  }

  if (message.content == "!t rmovie") {
    const page = Math.floor(Math.random() * 10) + 1
    const imageOfMovie = "https://www.themoviedb.org/t/p/w220_and_h330_face"

    const movie = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=3b2bcb92952fe99e873976e3f34134cc&language=pt-BR&sort_by=popularity.desc&include_adult=true&include_video=false&page=${page}`
    )
      .then((response) => response.json())
      .catch((err) => {
        console.error(err)
      })

    const randomNumber = Math.floor(Math.random() * 20) + 1
    console.log(movie)
    message.channel.send("**" + movie.results[randomNumber].title + "**")
    message.channel.send(movie.results[randomNumber].overview)
    message.channel.send(
      "**Nota:** " + movie.results[randomNumber].vote_average
    )
    message.channel.send(imageOfMovie + movie.results[randomNumber].poster_path)
  }
  if (message.content.startsWith("!t like ")) {
    const name = message.content.split(" ").splice(2).join(" ")
    console.log(name)
    if (message.content.split(" ").length > 2) {
      message.channel.send(
        `Eu gosto ${Math.ceil(Math.random() * 100)}% do ${name}`
      )
    } else {
      message.channel.send("Gosto do que?")
    }
  }

  if ((message.content == "boa noite thiago")) {
    message.channel.send(`Boa noite, amigo!`)
  }

  if (message.content == "!t help") {
    message.channel.send(`Comandos:\n${commands.join(", \n")} \n`)
  }
})

keepAlive()
client.login(process.env.token)
