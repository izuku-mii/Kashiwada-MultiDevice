/**
 * @SCRIPT      🔥 KASHIWADA-BOTWA 🔥
 * @INFO        Script ini GRATIS, bukan untuk dijual belikan.
 * @WARNING     Jangan ngaku-ngaku, jangan jual script gratis, dosa bro 😭
 * 
 * @BASE        NAO-MD
 * @BASE_OWNER  SHIROKAMI RYZEN
 * 
 * @AUTHOR      IZUKU-MII
 * @REMAKE      IZUKU-MII
 * 
 * @NOTE        SEMOGA YANG COLONG SCRIPT INI DAPET HIKMAH DAN TOBAT 🙏
 * 
 * @COPYRIGHT   © 2025 IZUKU-MII | All Rights Free.
 */

import fs from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'
import axios from "axios";
/*============= WAKTU =============*/
let wibh = moment.tz('Asia/Jakarta').format('HH')
let wibm = moment.tz('Asia/Jakarta').format('mm')
let wibs = moment.tz('Asia/Jakarta').format('ss')
let wktuwib = `${wibh} H ${wibm} M ${wibs} S`
let wktugeneral = `${wibh}:${wibm}:${wibs}`

let d = new Date(new Date + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
})
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
global.Func = (await import('./lib/function.js')).default

/*============= Config =============*/
global.owner = ["6283136099660", "6282172589188"]
global.costumpairing = "OOTA1234"
global.mods = []
global.prems = []
global.audioUrl = "https://h.top4top.io/m_3622t3r7l1.mp3";
global.readMore = readMore
global.linkch = "https://whatsapp.com/channel/0029VbAQBR6CxoAow9hLZ13Z"
global.tz = "Asia/Jakarta"
global.nomor = "6282172589188" // "201145800785" // "6288705772295" //"6288991835149"
global.botname = 'Kashiwada-San'
global.ownername = 'Izuku Midoriya'
global.git = {
  owner: ["Your_Owner"],
  token: ["Your_Token"]
}
global.thumbnailUrl = "https://raw.githubusercontent.com/Leoojon/dat1/main/uploads/25eb4e-1767859162744.jpg"
global.saluran = '120363423286058962@newsletter'

/*============= Message =============*/
global.wait = 'Please Wait...'
global.eror = 'Error!'

global.apikey = {
   izumi: "https://api.ootaizumi.web.id"
};
global.web = "https://api.ootaizumi.web.id/"
global.thumbnail = (await axios.get(thumbnailUrl, { responseType: "arraybuffer" })).data

global.menu = {
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: global.saluran,
    serverMessageId: 103,
    newsletterName: global.botname
  },
  externalAdReply: {
    title: global.botname,
    body: global.ownername,
    mediaType: 1,
    thumbnail: global.thumbnail,
    sourceUrl: global.web,
    renderLargerThumbnail: true
  }
}

global.replyCostum = async (text) => {
    return {
        text: text
    }
}

let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
