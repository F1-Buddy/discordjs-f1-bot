// import DiscordJS, { ClientVoiceManager, IntentsBitField, time } from 'discord.js'
//const DiscordJS = require("discord.js")
import DiscordJS from "discord.js"
import fetch from "node-fetch";
const client = new DiscordJS.Client(
    {
        intents: [
            DiscordJS.IntentsBitField.Flags.MessageContent,
            DiscordJS.IntentsBitField.Flags.Guilds,
            DiscordJS.IntentsBitField.Flags.GuildMessages
        ]
    }
)
import dotenv from 'dotenv'
dotenv.config()

client.on('ready', () => {
    console.log('Bot ready')
})

//import { RequestInfo, RequestInit } from "node-fetch";

//const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));
async function nextCommand(msg) {
    var calendarURL = 'https://www.formula1.com/calendar/Formula_1_Official_Calendar.ics'
    var calendarAsString = ''
    const fetchedPage = await fetch(calendarURL)
    calendarAsString = await fetchedPage.text()
    console.log(calendarAsString)
    msg.reply({
        content: 'next command called'
    })
}



client.on("messageCreate", msg => {
    if (msg.author.bot == false) {
        if (msg.content.includes('$n')) {
            nextCommand(msg)
        }
        // msg.reply({
        //     content: 'testing not bot',
        // })
    }
    // msg.reply("test")
    // msg.reply({
    //     content: 'testing',
    // })
})

client.login(process.env.TOKEN)


