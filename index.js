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
    var calSubs = []
    var eventTimes = []
    var today = new Date();
    var nextBool = false;
    var nextIndex = -1;
    var eventDateArr = []
    //fetch .ics file and convert it to string, and split lines into an array
    const fetchedPage = await fetch(calendarURL)
    calendarAsString = await fetchedPage.text()
    //console.log(calendarAsString)
    calSubs = calendarAsString.split('\n')

    //check for start times and add the times to dateArr as a Date()
    //also add event names to eventTimes array which contains start times and event names as strings
    for (let i = 0; i < calSubs.length; i++) {
        if (calSubs[i].includes('DTSTART;')) {
            var eventYear = calSubs[i].substring(27, 31)
            var eventMonth = calSubs[i].substring(31, 33) - 1
            var eventDay = calSubs[i].substring(33, 35)
            var eventHour = calSubs[i].substring(36, 38) //- 5
            var eventMinute = calSubs[i].substring(38, 40)
            eventDateArr.push(new Date(Date.UTC(eventYear, eventMonth, eventDay, eventHour - 1, eventMinute)))
            eventTimes.push(calSubs[i].substring(27))
            eventTimes.push(calSubs[i + 2].substring(8))
        }
    }

    //check which event is next by comapring Date objects and use that index to get it into the message
    while (!nextBool) {
        nextIndex++
        if (eventDateArr[nextIndex] > today) {
            nextBool = true
        }
    }

    var nextEventName = eventTimes[nextIndex * 2 + 1].substring(0, eventTimes[nextIndex * 2 + 1].length - 1);
    var nextEventTime = eventDateArr[nextIndex].toLocaleString()
    msg.reply({
        content: 'Next event is ' + nextEventName + ' on ``' + nextEventTime + '``'
    })
}
async function driverCommand(msg) {
    function invalidDNumInput() {
        msg.reply({
            content: 'Please enter a valid driver number (2020 - 2022): $driver 33'
        })
    }
    var statArr = ['starts', 'wins', 'podiums', 'careerpoints', 'poles', 'fastestlaps']
    var statStringsArr = ['Started ', ' times', 'Won ', ' times', 'Been on the podium ', ' times', 'Scored ', ' points', 'Claimed ', ' poles', 'Claimed ', ' fastest laps']
    var drivers = new Map([
        [33, ['Max Verstappen', 'VER']],
        [1, ['Max Verstappen', 'VER']],
        [11, ['Sergio Pérez', 'PER']],
        [16, ['Charles Leclerc', 'LEC']],
        [55, ['Carlos Sainz_Jr.', 'SAI']],
        [63, ['George Russell', 'RUS']],
        [44, ['Lewis Hamilton', 'HAM']],
        [23, ['Alex Albon', 'ALB']],
        [6, ['Nicholas Latifi', 'LAT']],
        [14, ['Fernando Alonso', 'ALO']],
        [30, ['Esteban Ocon', 'OCO']],
        [77, ['Valtteri Bottas', 'BOT']],
        [24, ['Zhou Guanyu', 'ZHO']],
        [10, ['Pierre Gasly', 'GAS']],
        [22, ['Yuki Tsunoda', 'TSU']],
        [20, ['Kevin Magnussen', 'MAG']],
        [47, ['Mick Schumacher', 'SCH']],
        [4, ['Lando Norris', 'NOR']],
        [3, ['Daniel Ricciardo', 'RIC']],
        [18, ['Lance Stroll', 'STR']],
        [5, ['Sebastian Vettel', 'VET']],
        [99, ['Antonio Giovinazzi', 'GIO']],
        [88, ['Robert Kubica', 'KUB']],
        [9, ['Nikita Mazepin', 'MAZ']],
        [26, ['Daniil Kvyat', 'KVY']],
        [8, ['Romain Grosjean', 'GRO']]
    ]);
    var driverNumber = 0
    var driverName = ''
    if (msg.content.length >= 8) {
        //get driver num from user
        driverNumber = (Number)(msg.content.substring(8))
        if (Number.isFinite(driverNumber)) {
            if (drivers.get(driverNumber) == undefined) {
                invalidDNumInput()
            }
            else {
                let dCode
                let reqDriverArray = []
                reqDriverArray = drivers.get(driverNumber)
                if (reqDriverArray != undefined) {
                    dCode = reqDriverArray[1]
                    driverName = reqDriverArray[0]
                    var statURL = ''
                    var finalOutString = driverName + ' has\n```'
                    var outString = ''
                    var fetchArr = []
                    for (let i = 0; i < statArr.length; i++) {
                        statURL = ''
                        statURL += 'https://en.wikipedia.org/w/api.php?action=parse&text={{F1stat|'
                        statURL += dCode + '|' + statArr[i] + '}}&contentmodel=wikitext&format=json'

                        //push urls for statistics to an array
                        fetchArr.push(statURL)
                        //fetch each url
                        const fetchedPage = await fetch(fetchArr[i])
                        const pageData = await fetchedPage.json()
                        var statString = JSON.stringify(pageData.parse.text)
                        //add stats to final string to be returned
                        outString = statString.substring((statString.indexOf('<p>') + 3), (statString.indexOf('n') - 1))
                        finalOutString += statStringsArr[i * 2] + outString + statStringsArr[i * 2 + 1] + '\n'
                    }
                    finalOutString += '```'
                    await msg.reply({
                        content: finalOutString
                    })
                }

            }
        }
        else {
            invalidDNumInput()
        }
    }
    else {
        invalidDNumInput()
    }
}



client.on("messageCreate", msg => {
    if (msg.author.bot == false) {
        if (msg.content.includes('$n') && msg.content.indexOf('$n') == 0) {
            nextCommand(msg)
        }
        else if (msg.content.includes('$driver') && msg.content.indexOf('$driver') == 0) {
            driverCommand(msg)
        }
    }
})

client.login(process.env.TOKEN)


