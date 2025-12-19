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
 * @RENANE      HANZOFFC 
 *
 * @NOTE        SEMOGA YANG COLONG SCRIPT INI DAPET HIKMAH DAN TOBAT 🙏
 * 
 * @COPYRIGHT   © 2025 IZUKU-MII | All Rights Free.
 */

import fs from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'

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
global.owner = ["6283143694217"]
global.costumpairing = "HANZOFFC"
global.mods = []
global.prems = []
global.audioUrl = "https://tmpfiles.org/dl/15597438/upload_1765818508261.opus";
global.readMore = readMore
global.linkch = "https://whatsapp.com/channel/0029Vb67i65Fi8xX7rOtIc2S"
global.tz = "Asia/Jakarta"
global.nomor = "6283871173087" // "201145800785" // "6288705772295" //"6288991835149"
global.botname = 'Alya-Md'
global.ownername = '𝐇𝐚𝐧𝐳𝐗𝐃'
global.saluran = '120363404849776664@newsletter',

/*============= Message =============*/
global.wait = 'Please Wait...'
global.eror = 'Error!'

global.apikey = {
   izumi: "https://api.ootaizumi.web.id"
};
global.web = "https://hanzofc.my.id"

global.menu = {
   contextInfo: {
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
         thumbnail: fs.readFileSync('./media/thumbnail.jpg'),
         sourceUrl: global.apikey,
         renderLargerThumbnail: true
      }
   }
}

global.chnl = {
   contextInfo: {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
         newsletterJid: global.saluran,
         serverMessageId: 103,
         newsletterName: global.botname
      },
   }
}

global.replyCostum = async (text) => {
    return {
        text: text,
        /**
        document: fs.readFileSync("./package.json"),
        mimetype: "image/null",
        jpegThumbnail: (await resize(fs.readFileSync("./media/thumbnail2.jpg"), 300, 300)),
        contextInfo: global?.chnl?.contextInfo,
        fileName: botname,
        productCategory: {
            limited_time_offer: {
                text: global?.botname,
                url: "https://t.me/izuku-mii",
                copy_code: global?.ownername,
                expiration_time: Date.now() * 999
            },
            tap_target_configuration: {
                title: "▸ X ◂",
                description: "bomboclard",
                canonical_url: "https://t.me/izuku-mii",
                domain: global?.web,
                button_index: 0
            },
            product_category: {
                surface: 1,
                category_id: "cat_1437",
                biz_jid: "0@s.whatsapp.net",
                title: global?.botname,
                description: "Hmmm, Ntah",
                button_label: "Lihat Produk"
            }
        },
        **/
    }
}

global.adReply = {
   contextInfo: {
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
         thumbnail: fs.readFileSync('./media/thumbnail2.jpg'),
         sourceUrl: global.apikey,
         renderLargerThumbnail: false
      }
   }
}

let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright("Update 'config.js'"))
    import(`${file}?update=${Date.now()}`)
})
    
