import conv from "@library/toAll.js";
import axios from "axios";
let handler = m => m;

handler.before = async (m, {
    conn,
    participants
}) => {
    conn.autoshalat = conn.autoshalat ? conn.autoshalat : {}
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.id : m.sender;

    let id = m.chat
    if (id in conn.autoshalat) {
        return false
    }
    let jadwalSholat = {
        subuh: '04:24',
        terbit: '06:11',
        // dhuha: '—',
        dzuhur: '11:57',
        ashar: '15:22',
        magrib: '18:05',
        isya: '19:19',
    }

    const datek = new Date((new Date).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    }))
    const hours = datek.getHours()
    const minutes = datek.getMinutes()
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    for (let [sholat, waktu] of Object.entries(jadwalSholat)) {
        if (timeNow === waktu) {
            conn.autoshalat[id] = [
                await conn.sendMessage(m.chat, {
                    audio: { url: "https://media.vocaroo.com/mp3/1ofLT2YUJAjQ" },
                    mimetype: "audio/mpeg",
                    contextInfo: {
                        externalAdReply: {
                            showAdAttribution: true,
                            mediaType: 1,
                            mediaUrl: '',
                            title: `Sholat Di Desa Macang Sakti`,
                            body: `🕑 ${waktu}`,
                            sourceUrl: '',
                            thumbnailUrl: "https://g.top4top.io/p_3622kvf4r1.jpg",
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m,
                    mentions: participants.map(a => a.id)
                }),
                setTimeout(async () => {
                    delete conn.autoshalat[m.chat]
                }, 57000)
            ]
        }
    }
}

export default handler;
