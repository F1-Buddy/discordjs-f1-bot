// import DiscordJS, { ClientVoiceManager, IntentsBitField, time } from 'discord.js'
//const DiscordJS = require("discord.js")

import DiscordJS, { ButtonStyle } from "discord.js"
//import paginationEmbed from "discordjs-button-pagination"
//import { MessageActionRow, ButtonInteraction } from "discord.js"
//import { ButtonInteraction } from "discord.js"
//const { MessageActionRow, MessageButton } = import('discord.js')



import fetch from "node-fetch"
import dotenv from 'dotenv'
import fs from 'fs'
import { ButtonBuilder, ActionRowBuilder, EmbedBuilder } from 'discord.js'


const client = new DiscordJS.Client(
    {
        intents: [
            DiscordJS.IntentsBitField.Flags.MessageContent,
            DiscordJS.IntentsBitField.Flags.Guilds,
            DiscordJS.IntentsBitField.Flags.GuildMessages
        ]
    }
)


dotenv.config()


client.on('ready', () => {
    // const channel = client.channels.cache.get('1013448201522655283');
    console.log(`${client.user.tag}  logged in`);
    // console.log('Bot ready')
})

//get settings from settings.txt
var settingsArr = []
var settingsString = fs.readFileSync('settings.txt').toString()
settingsArr = settingsString.split('\n')
settingsString = ''
var botPrefix = '' + settingsArr[0].substring(5, 6)

// superceded by newNextCommand
async function nextCommand(message) {
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
    message.reply({
        content: 'Next event is ' + nextEventName + ' on ``' + nextEventTime + '``'
    })
}

async function newNextCommand(message) {
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
    var finalOutString = "**Schedule for upcoming race weekend:**\n"
    var nextEventName = eventTimes[(nextIndex) * 2 + 1].substring(0, eventTimes[(nextIndex) * 2 + 1].length - 1);
    var nextEventTime = eventDateArr[(nextIndex)].toLocaleString()

    // gets whole weekend 
    if (nextEventName.indexOf('Practice 1') >= 0) {
        // console.log("next event includes \"Practice 1\"\nNext event = " + nextEventName)
        for (let i = 0; i < 5; i++) {
            nextEventName = eventTimes[(nextIndex+i) * 2 + 1].substring(0, eventTimes[(nextIndex+i) * 2 + 1].length - 1);
            nextEventTime = eventDateArr[(nextIndex+i)].toLocaleString()
            // console.log(nextEventName)
            // console.log(nextEventTime)
            finalOutString += '' + nextEventName + ' on ``' + nextEventTime + '``\n'
        }
    }
    else {
        // console.log('next event does not include \"Practice 1\"\nNext event = ' + nextEventName)
        // let i = 0
        while (nextEventName.indexOf('Practice 1') < 0){
            nextEventName = eventTimes[(nextIndex) * 2 + 1].substring(0, eventTimes[(nextIndex) * 2 + 1].length - 1);
            nextEventTime = eventDateArr[(nextIndex)].toLocaleString()
            nextIndex--
        }
        // finalOutString += '' + nextEventName + ' on ``' + nextEventTime + '``\n'
        // console.log(nextEventName)
        // console.log(nextEventTime)
        for (let i = 1; i < 6; i++) {
            nextEventName = eventTimes[(nextIndex+i) * 2 + 1].substring(0, eventTimes[(nextIndex+i) * 2 + 1].length - 1);
            nextEventTime = eventDateArr[(nextIndex+i)].toLocaleString()
            // console.log(nextEventName)
            // console.log(nextEventTime)
            finalOutString += '' + nextEventName + ' on ``' + nextEventTime + '``\n'
        }
        //console.log(nextEventName.indexOf('Practice 1'))
    }



    // var finalOutString = 'Next event is ' + nextEventName + ' on ``' + nextEventTime + '``\n'
    message.reply({
        content: finalOutString
    })
}

async function resultsCommand(message) {
    var finalOutString = ''
    // var requestOptions = {
    //     method: 'GET',
    //     redirect: 'follow'
    //   };

    //   fetch("http://ergast.com/api/f1/current/last/results.json", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));
    var dataURL = "http://ergast.com/api/f1/current/last/results.json"
    const fetchedPage = await fetch(dataURL)
    const pageData = await fetchedPage.json();

    // console.log(fetchedPage)

    var resultsArr = pageData.MRData.RaceTable.Races[0].Results;
    var title = 'Formula 1 ' + pageData.MRData.RaceTable.Races[0].raceName + ' '
    title += pageData.MRData.RaceTable.Races[0].Circuit.circuitName + ' '
    title += pageData.MRData.RaceTable.Races[0].season + '\n'


    //console.log(finalOutString)
    finalOutString += "```\nPosition\t\t\tDriver\t\t\tLap Time\n```\n"
    if (pageData.MRData.RaceTable.Races.length != 0) {
        var resultsArr = pageData.MRData.RaceTable.Races[0].Results;
        for (let i = 0; i < resultsArr.length; i++) {
            var positionString = '```P' + pageData.MRData.RaceTable.Races[0].Results[i].position
            var driverNameString = pageData.MRData.RaceTable.Races[0].Results[i].Driver.givenName + ' ' +
                pageData.MRData.RaceTable.Races[0].Results[i].Driver.familyName
            var finishingStatus = ''
            if (pageData.MRData.RaceTable.Races[0].Results[i].Time != null) {
                finishingStatus = pageData.MRData.RaceTable.Races[0].Results[i].Time.time
            } else {
                finishingStatus = pageData.MRData.RaceTable.Races[0].Results[i].status
            }

            finalOutString += "\t" + positionString + "\t\t\t" + driverNameString + "\t\t\t"
            finalOutString += finishingStatus + '```'



        }

    }


    const resultsEmbed = new EmbedBuilder()
        .setColor([255, 24, 1])
        .setTitle(title)
        .setURL('https://www.formula1.com/en/results.html')
        // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
        // .setDescription('Some description here')
        // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
        // .addFields(
        //	{ name: 'description', value: ':checkered_flag: Race Results :checkered_flag:ss' },
        // 	{ name: '\u200B', value: '\u200B' },
        // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
        // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
        // )
        .addFields({ name: ':checkered_flag: Race Results :checkered_flag:', value: title })
        .addFields({ name: 'Current Classification', value: finalOutString })

        // .setImage('https://i.imgur.com/AfFp7pu.png')
        .setTimestamp()
    // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

    message.reply({ embeds: [resultsEmbed] });
}

// superceded by newDriverCommand
async function driverCommand(message) {
    function invalidDNumInput() {
        message.reply({
            content: 'Please enter a valid driver number (2020 - 2022): $driver 33'
        })
    }
    var statArr = ['starts', 'wins', 'podiums', 'careerpoints', 'poles', 'fastestlaps']
    var statStringsArr = ['Started ', ' times', 'Won ', ' times', 'Been on the podium ', ' times', 'Scored ', ' points', 'Claimed ', ' poles', 'Claimed ', ' fastest laps']
    var drivers = new Map([
        [33, ['Max Verstappen', 'VER', 'Max_Verstappen']],
        [1, ['Max Verstappen', 'VER', 'Max_Verstappen']],
        [11, ['Sergio Pérez', 'PER', 'Sergio_Pérez']],
        [16, ['Charles Leclerc', 'LEC', 'Charles_Leclerc']],
        [55, ['Carlos Sainz_Jr.', 'SAI', 'Carlos_Sainz_Jr.']],
        [63, ['George Russell', 'RUS', 'George_Russell_(racing_driver)']],
        [44, ['Lewis Hamilton', 'HAM', 'Lewis_Hamilton']],
        [23, ['Alex Albon', 'ALB', 'Alex_Albon']],
        [6, ['Nicholas Latifi', 'LAT', 'Nicholas_Latifi']],
        [14, ['Fernando Alonso', 'ALO', 'Fernando_Alonso']],
        [30, ['Esteban Ocon', 'OCO', 'Esteban_Ocon']],
        [77, ['Valtteri Bottas', 'BOT', 'Valtteri_Bottas']],
        [24, ['Zhou Guanyu', 'ZHO', 'Zhou_Guanyu']],
        [10, ['Pierre Gasly', 'GAS', 'Pierre_Gasly']],
        [22, ['Yuki Tsunoda', 'TSU', 'Yuki_Tsunoda']],
        [20, ['Kevin Magnussen', 'MAG', 'Kevin_Magnussen']],
        [47, ['Mick Schumacher', 'SCH', 'Mick_Schumacher']],
        [4, ['Lando Norris', 'NOR', 'Lando_Norris']],
        [3, ['Daniel Ricciardo', 'RIC', 'Daniel_Ricciardo']],
        [18, ['Lance Stroll', 'STR', 'Lance_Stroll']],
        [5, ['Sebastian Vettel', 'VET', 'Sebastian_Vettel']],
        [99, ['Antonio Giovinazzi', 'GIO', 'Antonio_Giovinazzi']],
        [88, ['Robert Kubica', 'KUB', 'Robert_Kubica']],
        [9, ['Nikita Mazepin', 'MAZ', 'Nikita_Mazepin']],
        [26, ['Daniil Kvyat', 'KVY', 'Daniil_Kvyat']],
        [8, ['Romain Grosjean', 'GRO', 'Romain_Grosjean']]
    ]);
    var driverNumber = 0
    var driverName = ''
    if (message.content.length >= 8 && message.content.includes('driver ')) {

        //get driver num from user
        driverNumber = (Number)(message.content.substring(8))
        if (drivers.get(driverNumber) != undefined) {
            var driverProfile = 'https://en.wikipedia.org/wiki/' + drivers.get(driverNumber)[2]
        }


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
                    var finalOutString = ''
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
                        finalOutString += statStringsArr[i * 2] + '**' + outString + '**' + statStringsArr[i * 2 + 1] + '\n'
                    }
                    finalOutString += ''
                    //set profileURL to wikipedia article of driver
                    var profileURL = 'https://en.wikipedia.org/w/api.php?action=parse&page=' + drivers.get(driverNumber)[2] + '&contentmodel=wikitext&format=json'
                    const fetchedPage = await fetch(profileURL)
                    const pageData = await fetchedPage.json()
                    var statString = JSON.stringify(pageData)
                    // get link to image on right side of article
                    var indexOfImage = statString.indexOf('src', (statString.indexOf('infobox-image')))
                    var imageURL = 'https:' + statString.substring(indexOfImage + 6, (statString.indexOf('decoding', indexOfImage) - 3))
                    // create embed
                    const resultsEmbed = new EmbedBuilder()
                        .setColor([255, 24, 1])
                        .setTitle(driverName)
                        .setURL(driverProfile)
                        //.setThumbnail(imageURL)
                        .setImage(imageURL)
                        // .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                        // .setDescription('Some description here')
                        // .addFields(
                        //	{ name: 'description', value: ':checkered_flag: Race Results :checkered_flag:ss' },
                        // 	{ name: '\u200B', value: '\u200B' },
                        // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
                        // 	{ name: 'Inline field title', value: 'Some value here', inline: true },
                        // )
                        .addFields({ name: driverName + '\'s Stats:\n', value: finalOutString })
                    //
                    //.setTimestamp()
                    // .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

                    // message.reply({ embeds: [resultsEmbed] });
                    await message.reply({
                        embeds: [resultsEmbed],
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

async function newDriverCommand(message) {
    function invalidDriverInput() {
        message.reply({
            content: 'Please enter a valid driver number or name: $driver 33 / $driver hamilton / $driver max_verstappen'
        })
    }
    //get stats and reply with them
    async function replyStats(message, item) {
        var driverInfoArray = [item.code, item.givenName + ' ' + item.familyName, item.permanentNumber, item.url]
        var statURL = ''
        var finalOutString = ''
        var outString = ''
        var fetchArr = []
        for (let i = 0; i < statArr.length; i++) {
            statURL = ''
            statURL += 'https://en.wikipedia.org/w/api.php?action=parse&text={{F1stat|'
            statURL += item.code + '|' + statArr[i] + '}}&contentmodel=wikitext&format=json'
            //console.log(statURL)

            //push urls for statistics to an array
            fetchArr.push(statURL)
            //fetch each url
            const fetchedPage = await fetch(fetchArr[i])
            const pageData = await fetchedPage.json()
            var statString = JSON.stringify(pageData.parse.text)
            //add stats to final string to be returned
            outString = statString.substring((statString.indexOf('<p>') + 3), (statString.indexOf('n') - 1))
            //console.log(outString)
            if (!outString.includes('mw-parser-output')) {
                finalOutString += statStringsArr[i * 2] + '**' + outString + '**' + statStringsArr[i * 2 + 1] + '\n'
            }
        }
        if (outString.includes('mw-parser-output')) {
            finalOutString = await altStats(item)
        }
        finalOutString += ''
        //set profileURL to wikipedia article of driver
        var profileURL = 'https://en.wikipedia.org/w/api.php?action=parse&page=' + item.url.substring(item.url.indexOf('wiki/') + 5) + '&contentmodel=wikitext&format=json'
        const fetchedPage = await fetch(profileURL)
        const pageData = await fetchedPage.json()
        var statString = JSON.stringify(pageData)
        // get link to image on right side of article
        var indexOfImage = statString.indexOf('src', (statString.indexOf('infobox-image')))
        var imageURL = 'https:' + statString.substring(indexOfImage + 6, (statString.indexOf('decoding', indexOfImage) - 3))

        // get flag icon
        var flagiconIndex = statString.indexOf('flagicon')
        //console.log(flagiconIndex)
        //checks to see if flagicon is at top of page, sometimes drivers like senna have no flagicon but have hidden UK flagicon at bottom
        if (flagiconIndex < 20000) {
            var thumbURL = 'https:' + statString.substring(
                statString.indexOf('src', flagiconIndex) + 6,
                statString.indexOf('decoding', flagiconIndex) - 3
            )
            //console.log(thumbURL)
        }


        // this is dumb as shit
        // if flag isn't on driver's article, goes to article about to drivers nationality, gets flag image from there
        // senna -> brazilians -> get flag from brazilians article
        // some real stupid shit
        else {
            //console.log('getting from nationality article')
            var natArticle = statString.substring(
                statString.indexOf('a href', statString.indexOf('Nationality')) + 15,
                statString.indexOf('title', statString.indexOf('Nationality')) - 3
            )
            var nationalityURL = 'https://en.wikipedia.org/w/api.php?action=parse&page=' + natArticle
                + '&contentmodel=wikitext&format=json';
            //console.log(nationalityURL)
            const fetchedPage = await fetch(nationalityURL)
            const pageData = await fetchedPage.json()
            var statString = JSON.stringify(pageData)
            var flagURL = 'https:' + statString.substring(
                statString.indexOf('src', statString.indexOf('img alt=\\\"Flag')) + 6,
                statString.indexOf('decoding', statString.indexOf('img alt=\\\"Flag')) - 3
            )
            //console.log(flagURL)
            thumbURL = flagURL
        }
        //console.log('thumbURL = ' + thumbURL)

        //create embed and reply
        const driverEmbed = new EmbedBuilder()
            .setColor([255, 24, 1])
            .setTitle(driverInfoArray[1])
            .setThumbnail(thumbURL)
            .setURL(item.url)
            .setImage(imageURL)
            .addFields({ name: driverInfoArray[1] + '\'s Stats:\n', value: finalOutString })
        await message.reply({
            embeds: [driverEmbed],
        })
    }
    //alternate method to get stats if driver not in 2020-2022 grid
    async function altStats(item) {
        //console.log("using alternate method to get stats...")
        var outString = ''
        //var driverInfoArray = [item.code, item.givenName + ' ' + item.familyName, item.permanentNumber, item.url]
        var profileURL = 'https://en.wikipedia.org/w/api.php?action=parse&page=' + item.url.substring(item.url.indexOf('wiki/') + 5) + '&contentmodel=wikitext&format=json'
        for (let i = 0; i < altStatArr.length; i++) {
            //console.log(statStringsArr[i])
            const fetchedPage = await fetch(profileURL)
            const pageData = await fetchedPage.text()
            //console.log(altStatArr[i])
            var searchIndex = pageData.indexOf(altStatArr[i])
            var currentStatString = pageData.substring(pageData.indexOf('data\\\">', searchIndex) + 7, pageData.indexOf('</td>', searchIndex))
            //console.log(currentStatString)
            if (!currentStatString.includes('/a')) {
                outString += altStatArr[i] + ': ' + currentStatString + '\n'
            }
            else {
                if (currentStatString.indexOf('<') == 0) {
                    outString += altStatArr[i] + ': ' + currentStatString.substring(currentStatString.indexOf('\\\">') + 3, currentStatString.indexOf('</a>')) + '\n'
                }
                else {
                    outString += altStatArr[i] + ': ' + currentStatString.substring(0, currentStatString.indexOf('<')) + '\n'
                }
            }
        }

        return outString
    }
    var statArr = ['starts', 'wins', 'podiums', 'careerpoints', 'poles', 'fastestlaps']
    var altStatArr = ['Entries', 'Wins', 'Podiums', 'Career points', 'Pole positions', 'Fastest laps']
    var statStringsArr = ['Started ', ' times', 'Won ', ' times', 'Been on the podium ', ' times', 'Scored ', ' points', 'Claimed ', ' poles', 'Claimed ', ' fastest laps']
    //var drivers = new Map()

    if (message.content.length >= 8 && message.content.includes('driver ')) {

        //get driver num from user
        var driverNumber = (message.content.substring(8))
        const fetchedPage = await fetch('https://ergast.com/api/f1/drivers.json?limit=1000&offset=0')
        const pageData = await fetchedPage.json()
        var driverArray = pageData.MRData.DriverTable.Drivers
        var driverFound = false;
        driverArray.forEach(async function (item) {
            var driverInfoArray = [item.code, item.givenName + ' ' + item.familyName, item.permanentNumber, item.url]
            //console.log(item.givenName + " " + item.familyName)
            if ((Number)(driverNumber) > 0) {

                if (item.permanentNumber == driverNumber) {
                    driverFound = true
                    replyStats(message, item)
                }
            }
            else if (item.driverId == driverNumber) {

                //console.log(driverInfoArray)
                if (driverInfoArray != undefined) {
                    driverFound = true
                    replyStats(message, item)
                }
            }


        })
        if (!driverFound) {
            invalidDriverInput()
        }
    }
    else {
        invalidDriverInput()
    }
}

// superceded by newQualiCommand
async function qualiCommand(message) {
    var rounds = new Map([]);
    var icsAsString = ''
    var icsArr = []

    //get round names and numbers into rounds Map
    async function getRounds() {
        var calendarURL = 'https://www.formula1.com/calendar/Formula_1_Official_Calendar.ics'
        const fetchedPage = await fetch(calendarURL)
        icsAsString = await fetchedPage.text()
        icsArr = icsAsString.split('\n')
        for (let i = 0, c = 1; i < icsArr.length; i++) {
            if (icsArr[i].includes(' - Qualifying')) {
                rounds.set(c, icsArr[i].substring(8, icsArr[i].length - 1))
                c++
            }
        }
        if (message.content.length >= 7) {
            // get round number from user
            roundNumber = Number(message.content.substring(7));
            if (Number.isFinite(roundNumber)) {
                if (rounds.get(roundNumber) == undefined) {
                    invalidDNumInput();
                } else {
                    roundName = rounds.get(roundNumber);

                    //generate URL for ergast quali stats using round number
                    var statURL = "";
                    var finalOutString = roundName + " results:\n\n";
                    var outString = "";
                    statURL = "http://ergast.com/api/f1/2022/";
                    statURL += roundNumber + "/" + "qualifying.json";


                    const fetchedPage = await fetch(statURL);
                    const pageData = await fetchedPage.json();
                    // create the final string to be printed by extracting json elements
                    if (pageData.MRData.RaceTable.Races.length != 0) {
                        var qualiArr = pageData.MRData.RaceTable.Races[0].QualifyingResults;
                        for (let i = 0; i < qualiArr.length; i++) {
                            var positionString = 'P' + pageData.MRData.RaceTable.Races[0].QualifyingResults[i].position
                            var driverNameString = pageData.MRData.RaceTable.Races[0].QualifyingResults[i].Driver.givenName + ' ' +
                                pageData.MRData.RaceTable.Races[0].QualifyingResults[i].Driver.familyName
                            var q1Time = pageData.MRData.RaceTable.Races[0].QualifyingResults[i].Q1
                            var q2Time = pageData.MRData.RaceTable.Races[0].QualifyingResults[i].Q2
                            var q3Time = pageData.MRData.RaceTable.Races[0].QualifyingResults[i].Q3
                            finalOutString += '```c\n'
                            finalOutString += positionString + '\n\n' + driverNameString + '\n'
                            if (q3Time != undefined) {
                                finalOutString += 'Q3 Time = ' + q3Time + '\n'
                            }
                            if (q2Time != undefined) {
                                finalOutString += 'Q2 Time = ' + q2Time + '\n'
                            }
                            if (q1Time != undefined) {
                                finalOutString += 'Q1 Time = ' + q1Time + '\n'
                            }
                            finalOutString += '```'
                        }
                    }
                    else {
                        finalOutString = 'Please enter a round number that has occured'
                    }
                    await message.reply({
                        content: finalOutString,
                    });
                }
            } else {
                invalidDNumInput();
            }
        }
    }
    getRounds()

    var roundNumber = 1;
    var roundName = "";
    function invalidDNumInput() {
        message.reply({
            content: "Please enter a valid round number (2022): $quali 1",
        });
    }

}

async function newQualiCommand(message) {

    var messageContent = message.content
    function invalidInput(message) {
        message.reply({
            content: 'Invalid Input'
        })
    }
    if (messageContent.length > 7) {
        var roundNumber = (Number)(messageContent.substring(messageContent.indexOf('quali ') + 6))
        //console.log('round number = ' + roundNumber)
        if (roundNumber != NaN) {
            var roundURL = 'https://ergast.com/api/f1/2022/'
            roundURL += roundNumber + '/qualifying.json'
            const fetchedPage = await fetch(roundURL);
            const pageData = await fetchedPage.json();
            // await console.log(pageData)
            if (pageData.MRData.RaceTable.Races.length > 0) {
                var qualiArray = pageData.MRData.RaceTable.Races[0].QualifyingResults
                var raceName = pageData.MRData.RaceTable.Races[0].raceName
                var finalOutString = '\n'
                // await console.log(raceName)
                for (let i = 0; i < qualiArray.length; i++) {
                    var positionString = '**P' + qualiArray[i].position + '**'
                    var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                    var constructorName = qualiArray[i].Constructor.name
                    var q1Time = qualiArray[i].Q1
                    var q2Time = qualiArray[i].Q2
                    var q3Time = qualiArray[i].Q3
                    // await console.log(positionString)
                    // await console.log(driverNameString)
                    // await console.log(q1Time)
                    // await console.log(q2Time)
                    // await console.log(q3Time)
                    if (q3Time != undefined) {
                        finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + q3Time + '```\n'
                    }
                    else if (((Number)(qualiArray[i].position)) < 11) {
                        finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + 'No Time' + '```\n'
                    }


                }
                finalOutString += '\n'
                // create embed
                var qualiEmbed = new EmbedBuilder()
                    .setColor([255, 24, 1])
                    .setTitle('Quali Results for ' + raceName)
                    //.setURL(item.url)
                    //.setImage(imageURL)
                    .addFields({ name: 'Q3 Results', value: finalOutString })


                //reply with embed
                const messageReply = await message.reply({
                    embeds: [qualiEmbed],
                    //content: 'testing reactions',
                    components: [
                        new ActionRowBuilder().setComponents(
                            new ButtonBuilder()
                                .setCustomId('lastButton')
                                .setLabel('<<')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('nextButton')
                                .setLabel('>>')
                                .setStyle(ButtonStyle.Success)
                        )
                    ],
                })
                client.on('interactionCreate', async (interaction) => {
                    if (interaction.isButton) {
                        if (interaction.customId == 'lastButton') {
                            if (qualiEmbed.data.fields[0].name.includes('Q1')) {
                                finalOutString = '\n'
                                for (let i = 0; i < qualiArray.length; i++) {
                                    if (((Number)(qualiArray[i].position)) > 10) {
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var constructorName = qualiArray[i].Constructor.name
                                        var q2Time = qualiArray[i].Q2
                                        if (q2Time != undefined) {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + q2Time + '```\n'
                                        }
                                        else if (((Number)(qualiArray[i].position)) < 16) {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + 'No Time' + '```\n'
                                        }
                                    }

                                }
                                qualiEmbed.setTitle('Q2 Results for ' + raceName)
                                qualiEmbed.setFields({ name: 'Knocked out in Q2', value: finalOutString })
                                await messageReply.edit({
                                    embeds: [qualiEmbed]
                                })
                            }
                            else if (qualiEmbed.data.fields[0].name.includes('Q2')) {
                                finalOutString = '\n'
                                for (let i = 0; i < qualiArray.length; i++) {
                                    if (((Number)(qualiArray[i].position)) < 11) {
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var constructorName = qualiArray[i].Constructor.name
                                        var q3Time = qualiArray[i].Q3
                                        if (q3Time != undefined) {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + q3Time + '```\n'
                                        }
                                        else {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + 'No Time' + '```\n'
                                        }
                                    }

                                }
                                qualiEmbed.setTitle('Q3 Results for ' + raceName)
                                qualiEmbed.setFields({ name: 'Q3 Results', value: finalOutString })
                                await messageReply.edit({
                                    embeds: [qualiEmbed]
                                })
                            }
                            //console.log('last button clicked')
                            await interaction.update({})
                        }
                        else if (interaction.customId == 'nextButton') {
                            if (qualiEmbed.data.fields[0].name.includes('Q3')) {
                                finalOutString = '\n'
                                for (let i = 0; i < qualiArray.length; i++) {
                                    if (((Number)(qualiArray[i].position)) > 10) {
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var constructorName = qualiArray[i].Constructor.name
                                        var q2Time = qualiArray[i].Q2
                                        if (q2Time != undefined) {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + q2Time + '```\n'
                                        }
                                        else if (((Number)(qualiArray[i].position)) < 16) {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + 'No Time' + '```\n'
                                        }
                                    }

                                }
                                qualiEmbed.setTitle('Q2 Results for ' + raceName)
                                qualiEmbed.setFields({ name: 'Knocked out in Q2', value: finalOutString })
                                await messageReply.edit({
                                    embeds: [qualiEmbed]
                                })
                            }
                            else if (qualiEmbed.data.fields[0].name.includes('Q2')) {
                                finalOutString = '\n'
                                for (let i = 0; i < qualiArray.length; i++) {
                                    if (((Number)(qualiArray[i].position)) > 15) {
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var positionString = '**P' + qualiArray[i].position + '**'
                                        var driverNameString = qualiArray[i].Driver.givenName + ' ' + qualiArray[i].Driver.familyName
                                        var constructorName = qualiArray[i].Constructor.name
                                        var q1Time = qualiArray[i].Q1
                                        if (q1Time != undefined) {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + q1Time + '```\n'
                                        }
                                        else {
                                            finalOutString += positionString + '\n*' + constructorName + '*\n' + '**' + driverNameString + '**' + '\n```c\n' + 'No Time' + '```\n'
                                        }
                                    }

                                }
                                qualiEmbed.setTitle('Q1 Results for ' + raceName)
                                qualiEmbed.setFields({ name: 'Knocked out in Q1', value: finalOutString })
                                await messageReply.edit({
                                    embeds: [qualiEmbed]
                                })
                            }

                            await interaction.update({})
                        }

                        //interaction.deferReply()
                    }
                })
            }
            else {
                invalidInput(message)
            }
        }
        else {
            invalidInput(message)
        }
    }
}

function changeCommand(message) {
    function invalidChangeInput() {
        message.reply({
            content: 'Please enter a valid prefix: $driver &'
        })
    }
    if (message.content.length >= 8) {
        console.log('prefix changed to ' + message.content[8])
        botPrefix = message.content[message.content.indexOf('change') + 7]
        settingsArr[0] = 'char=' + botPrefix
        for (let i = 0; i < settingsArr.length; i++) {
            settingsString += settingsArr[i] + '\n'
        }
        fs.writeFileSync('settings.txt', settingsString, (err) => {
            if (err) throw err;
        })
        settingsString = ''
        message.reply({
            content: 'Bot prefix changed to ' + botPrefix,
        })
    }
    else {
        invalidChangeInput();
    }
}
async function standingsCommand(message) {
    var today = new Date()
    var year = today.getFullYear().toString()
    var finalOutString = ''
    var standingsURL = 'http://ergast.com/api/f1/'
    if (message.content.includes('wcc') && !message.content.includes('wdc')) {
        year = (Number)(message.content.substring(message.content.indexOf('wcc') + 3))
        if (year == 0) { year = today.getFullYear().toString() }
        //console.log(year)
        if (year > 1957) {
            standingsURL += year + '/constructorStandings.json'
            const checkPage = await fetch(standingsURL);
            const pageDataRawText = await checkPage.text();
            if (pageDataRawText.toLowerCase().includes('bad request')) {
                message.reply({
                    content: 'Enter a valid year'
                })
            }
            else {
                finalOutString += "```c\n\t" + year + " CONSTRUCTORS STANDINGS\n\nPosition\t\tPoints\t\tConstructor\n"
                const fetchedPage = await fetch(standingsURL);
                const pageJSON = await fetchedPage.json();
                const standingsResults = pageJSON.MRData.StandingsTable.StandingsLists[0]
                for (let i = 0; i < standingsResults.ConstructorStandings.length; i++) {
                    finalOutString += "\t" + standingsResults.ConstructorStandings[i].position + "\t\t\t" + standingsResults.ConstructorStandings[i].points + "\t\t\t"
                    finalOutString += standingsResults.ConstructorStandings[i].Constructor.name + "\n"
                }
                finalOutString += "\n```"
                message.reply({
                    content: finalOutString.toString()
                })
            }
        }
        else {
            message.reply({
                content: 'Enter a valid year'
            })
        }

    }
    else if (message.content.includes('wdc') && !message.content.includes('wcc')) {
        year = (Number)(message.content.substring(message.content.indexOf('wdc') + 3))
        if (year == 0) { year = today.getFullYear().toString() }
        //console.log(year)
        if (year > 1957) {
            standingsURL += year + '/driverStandings.json'
            const checkPage = await fetch(standingsURL);
            const pageDataRawText = await checkPage.text();
            if (pageDataRawText.toLowerCase().includes('bad request')) {
                message.reply({
                    content: 'Enter a valid year'
                })
            }
            else {
                finalOutString += finalOutString += "```c\n\t" + year + " DRIVERS STANDINGS\n\nPosition\t\tPoints\t\tDriver\n"
                const fetchedPage = await fetch(standingsURL);
                const pageJSON = await fetchedPage.json();
                const standingsResults = pageJSON.MRData.StandingsTable.StandingsLists[0]
                for (let i = 0; i < standingsResults.DriverStandings.length; i++) {
                    finalOutString += "\t" + standingsResults.DriverStandings[i].position + "\t\t\t" + standingsResults.DriverStandings[i].points + "\t\t\t"
                    finalOutString += standingsResults.DriverStandings[i].Driver.givenName + ' ' + standingsResults.DriverStandings[i].Driver.familyName + '\n'
                }
                finalOutString += "\n```"
                message.reply({
                    content: finalOutString.toString()
                })
            }
        }
        else {
            message.reply({
                content: 'Enter a valid year'
            })
        }

    }
    else {
        message.reply("Please use wcc and wdc separately!")
    }
    // wdcURL += '/driverStandings'

}



client.on("messageCreate", message => {
    if (message.author.bot == false) {
        if (message.content.toLowerCase().includes(botPrefix + 'n') && message.content.toLowerCase().indexOf(botPrefix + 'n') == 0) {
            newNextCommand(message)
        }
        else if (message.content.toLowerCase().includes(botPrefix + 'driver') &&
            message.content.toLowerCase().indexOf(botPrefix + 'driver') == 0
        ) {
            //driverCommand(message)
            newDriverCommand(message)
        }
        else if (message.content.toLowerCase().includes(botPrefix + 'quali') &&
            message.content.toLowerCase().indexOf(botPrefix + 'quali') == 0
        ) {
            if (message.content.toLowerCase().includes(botPrefix + 'quali') && message.content.length == 6) {
                message.reply("Add a round number at the end! \"" + botPrefix + "quali 14\" for example")
            }
            //qualiCommand(message)
            newQualiCommand(message)
        }
        else if (message.content.toLowerCase().includes(botPrefix + 'results') &&
            message.content.toLowerCase().indexOf(botPrefix + 'results') == 0
        ) {
            resultsCommand(message)
        }
        else if (message.content.toLowerCase().includes(botPrefix + 'change') &&
            message.content.toLowerCase().indexOf(botPrefix + 'change') == 0
        ) {
            changeCommand(message)
        }
        else if ((message.content.toLowerCase().includes(botPrefix + 'standings') &&
            message.content.toLowerCase().indexOf(botPrefix + 'standings') == 0) ||
            (message.content.toLowerCase().includes(botPrefix + 'wdc') &&
                message.content.toLowerCase().indexOf(botPrefix + 'wdc') == 0) ||
            (message.content.toLowerCase().includes(botPrefix + 'wcc') &&
                message.content.toLowerCase().indexOf(botPrefix + 'wcc') == 0)
        ) {
            if (message.content.toLowerCase().includes('standings')) {
                message.reply("Try \"" + botPrefix + "wcc\" or \"" + botPrefix + "wdc 2013\" for example")
            }
            else {
                standingsCommand(message)
            }
        }
    }

})

client.login(process.env.TOKEN)


