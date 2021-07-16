require("dotenv").config()
var cron = require("cron")
var axios = require("axios")
const fetch = require("node-fetch")

const { Client, MessageAttachment } = require("discord.js")

// Create an instance of a Discord client
const client = new Client()

const getBirthdayGif = (daysLeft = "0") => {
  try {
    return axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=xYwItClY2vReAamPQLIJUHCIJovIwPWF&q=${daysLeft} days left birthday&lang=pt&limit=1`
    )
  } catch (error) {
    console.error(error)
  }
}

const gifOfTheDay = async (daysLeft) => {
  const gif = await getBirthdayGif(daysLeft)
  if (gif.data.data[0]) {
    return gif.data.data[0].images.original.url.json()
  }
  return "https://media.tenor.com/images/44417803b4984c1ffbca13e39b4c7266/tenor.gif"
}

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`)
  general_channel.send("Tô on")
  const general_channel = client.channels.cache.get(
    process.env.general_channel_id
  )
  const thiago_channel = client.channels.cache.get(process.env.channel_id)

  let scheduledMessage = new cron.CronJob("21 21 21 * * *", () => {
    // const channel = client.channels.cache.get(process.env.channel_id)
    general_channel.send(
      "@here! Vamos jogar Valheim amigos? posso entrar no servidor com vocês? :D"
    )
  })

 
  var date1 = new Date()
  var date2 = new Date("05/27/2022")

  // To calculate the time difference of two dates
  var Difference_In_Time = date2.getTime() - date1.getTime()

  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)
  // const { gifOfDayMessage } = await gifOfTheDay(Difference_In_Days)
  const {gifOfDayMessage} = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=xYwItClY2vReAamPQLIJUHCIJovIwPWF&q=3&lang=pt&limit=1`).then((response) =>
  console.log(response.json())
)
  let niverMessage = new cron.CronJob("30 * * * * *", () => {

    thiago_channel.send(
      `@here! faltam ${Math.ceil(
        Difference_In_Days
      )} dias até o meu aniversáriooo! :D`
    )

    thiago_channel.send(gifOfDayMessage.data[0].images.original.url)
  })

  // When you want to start it, use:
  scheduledMessage.start()
  niverMessage.start()
})

// axios.get('api.giphy.com/v1/gifs/search?api_key=xYwItClY2vReAamPQLIJUHCIJovIwPWF&q=23 days left birthday&lang=pt').then((res) =>{
//     console.log(res)
// })
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
    ["obrigado ", "valeu ", "obg ", "brigado ", "tmj ", "tamo junto ", "vlw "],
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
    // const attachmentAsperger = new MessageAttachment("https://prnt.sc/1bfjq7u");
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
  const { dog } = await fetch("https://dog.ceo/api/breeds/image/random/1").then((response) =>
  response.json()
  )
  if (message.content == "!t dog") {
    message.channel.send(dog.message)
  }

  if (message.content == "!t help") {
    message.channel.send("tô com preguiça de fazer essa parte agr")
  }
})
client.login(process.env.token)
