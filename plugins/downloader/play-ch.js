import axios from "axios";
import convert from "@library/toAll.js";
import api from "@izumi/api";

let Izumi = async (m, {
    conn,
    text
}) => {
     if (!text) return m.reply('⚠️ Masukan Nama Lagu Yang Ini Anda Cari !')
     const oota = await conn.sendMessage(m.chat, { text: "Wait...., Fitur Play Akan Di Process....!" }, { quoted: m })
     try {
        let resp = await (await api.get('/downloader/youtube/play?query=' + encodeURIComponent(text))).data
        const play = resp.result;
        const { data: toBuffer } = await axios.get(play.download, {
            responseType: 'arraybuffer'
        });
        if (toBuffer.length > 1024 * 1024 * 50) {
            await conn.sendMessage(saluran, { text: "📃 Document Nya Besar Gajadi Lah Gw Up", edit: oota.key }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: "☘️Lagu No Size Gede, Ok Otw Up", edit: oota.key }, { quoted: m });
            await sendWhatsAppVoice(conn, global?.saluran, toBuffer, {
                fileName: play.filename,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 1,
                    isForwarded: true,
                    externalAdReply: {
                        title: play.title + " / " + play.author.channelTitle,
                        body: 'Request_Dari: ' + m.pushName,
                        mediaType: 1,
                        thumbnailUrl: play.thumbnail,
                        sourceUrl: global.web,
                        renderLargerThumbnail: true
                    }
                },
            });
        }

    } catch (e) {
        await conn.sendMessage(m.chat, { text: "❌ Maaf Error Mungkin lu kebanyakan request", edit: oota.key }, { quoted: m });
        console.error('Error', e);
    };
};

/**
 * Convert audio buffer ke WhatsApp voice note + waveform
 */
async function toWhatsAppVoice(inputBuffer) {
    const audioBuffer = await convert.toVN(inputBuffer)
    const waveform = await convert.generateWaveform(audioBuffer)
    return {
        audio: audioBuffer,
        waveform
    }
}

/**
 * Kirim WhatsApp PTT dan auto-play
 */
async function sendWhatsAppVoice(conn, chatId, inputBuffer, options = {}, options2 = {}) {
    try {
        const {
            audio,
            waveform
        } = await toWhatsAppVoice(inputBuffer)

        // Kirim ke WhatsApp
        await conn.sendMessage(chatId, {
            audio: audio,
            waveform: waveform,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            ...options,
        }, {
            ...options2
        })

    } catch (err) {
        console.error("Failed to send voice:", err)
    }
}

Izumi.command = /^(playch|musich|musikch)$/i
Izumi.help = ["playch", "musich", "musikch"];
Izumi.tags = ["downloader"];
Izumi.limit = true;
Izumi.owner = true;

export default Izumi;
