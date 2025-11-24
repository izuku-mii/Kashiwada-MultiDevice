import convert from "../../lib/toAll.js";
import axios from "axios";
let num = "13135550002@s.whatsapp.net";

let Izumi = async (m, {
    conn,
    text
}) => {

    const url = await conn.profilePictureUrl(num, 'image');
    const res = await fetch(url);
    const metre = Buffer.from(await res.arrayBuffer());
    const resize = await conn.resize(metre, 200, 200);
    
    const floc = {
        key: {
            participant: num,
            ...(m.chat ? {
                remoteJid: 'status@broadcast'
            } : {})
        },
        message: {
            locationMessage: {
                name: botname,
                jpegThumbnail: resize
            }
        }
    };
    try {
        if (!text) return m.reply('⚠️ Masukan Nama Lagu Yang Ini Anda Cari !')
        let resp = await (await fetch(global?.apikey?.izumi + '/downloader/youtube-play?query=' + encodeURIComponent(text))).json()
        const play = resp.result;
        /**
                let playcap = ' ------- ( PLAY - YOUTUBE ) -------\n'
                playcap += ' -(TITLE)-: %title\n'
                playcap += ' -(AUTHOR)-: %author\n'
                playcap += ' -(UPLOADED)-: %uploaded\n'
                playcap += ' -(URL)-: %link\n\n'
                playcap += ' -(LIKE)-: %like, -(COMMENT)-: %comment, -(DURATION)-: %duration'

                let caption = playcap
                    .replace(/%title/g, play.title || '')
                    .replace(/%author/g, play.author.channelTitle || '')
                    .replace(/%uploaded/g, play.metadata.jadwal_upload || '')
                    .replace(/%link/g, play.url || '')
                    .replace(/%like/g, play.metadata.like || '')
                    .replace(/%comment/g, play.metadata.comment || '')
                    .replace(/%duration/g, play.metadata.duration || '')

                const reply = await conn.sendMessage(m.chat, {
                    text: caption,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: saluran,
                            serverMessageId: 103,
                            newsletterName: botname
                        },
                        externalAdReply: {
                            title: play.title,
                            body: play.author.channelTitle,
                            mediaType: 1,
                            thumbnailUrl: play.thumbnail,
                            sourceUrl: global.apikey,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: floc
                });
        **/

        const toBuffer = await axios.get(play.download, {
            responseType: 'arraybuffer'
        });

        await sendWhatsAppVoice(conn, m.chat, toBuffer.data, {
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1,
                isForwarded: true,
                externalAdReply: {
                    title: play.title,
                    body: play.author.channelTitle,
                    mediaType: 1,
                    thumbnailUrl: play.thumbnail,
                    sourceUrl: global.web,
                    renderLargerThumbnail: true
                }
            },
        }, {
            quoted: floc
        });
    } catch (e) {
        m.reply(' ❌ Maaf Error Mungkin lu kebanyakan request');
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

Izumi.command = Izumi.help = ["play-v2", "music-v2", "musik-v2"];
Izumi.tags = ["downloader"];
Izumi.limit = true;

export default Izumi;