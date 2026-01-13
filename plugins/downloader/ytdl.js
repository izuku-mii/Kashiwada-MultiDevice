import axios from "axios";
import api from "@izumi/api";

let Izumi = async (m, {
    conn,
    text,
    command
}) => {
    try {
        switch (command) {
            case "ytmp4": {
                if (!text.includes('youtu')) return m.reply('⚠️ Masukan Link YouTube Sama Format !')
                let [link, format] = text.split(' ')
                const f = format || "360"
                const quality = ['360', '720', '1080']
                if (!quality.includes(f)) return m.reply(' ⚠️Quality Tersedia Hanya: ' + format.video.map((a => a)).join(', '))
                const params = {
                    url: link,
                    format: f
                };
                let resp = await (await api.get('/downloader/youtube', { params })).data

                const yt = resp.result;
                const capy = Func.Styles(`. .╭── ︿︿︿︿︿ 🎥   .   .   .   .   . 
. .┊ ‹‹ *Title* :: ${yt?.title || ""}
. .┊•*⁀➷ °... ℛᥱᥲᴅ ᴛʜι᥉ ... 🎥
. .╰─── ︶︶︶︶ ♡⃕  ⌇. . .
 . . ┊⿻ [ *Channel* :: ${yt?.author?.name || ""}] . .
 . . ┊⿻ [ *VideoId* :: ${yt?.videoId || ""}] . .
 . . ┊⿻ [ *Duration* :: ${yt?.duration?.timestamp || ""}] . .
 . . ┊⿻ [ *Link* :: ${yt?.url || ""}] . .
 . . ╰─────────╮`)

                const reply = await conn.sendMessage(m.chat, {
                    text: capy,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: saluran,
                            serverMessageId: 103,
                            newsletterName: botname
                        },
                        externalAdReply: {
                            title: yt.title,
                            body: yt.author.channelTitle,
                            mediaType: 1,
                            thumbnailUrl: yt.thumbnail,
                            sourceUrl: global.web,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m
                });

                const buffer = await axios.get(yt.download, { responseType: 'arraybuffer' });
                if (buffer.data.length > 1024 * 1024 * 10) {
                    await conn.sendMessage(m.chat, {
                        document: buffer.data,
                        fileName: yt.title + '.mp4',
                        mimetype: 'video/mp4',
                        caption: "✅Done"
                    }, {
                        quoted: reply
                    });
                } else {
                    await conn.sendMessage(m.chat, {
                        video: buffer.data,
                        caption: "✅Done"
                    }, {
                        quoted: reply
                    });
                }
            }
            break;
            case "ytmp3": {
                if (!text.includes('youtu')) return m.reply('⚠️ Masukan Link Youtube')
                const params = {
                    url: text,
                    format: 'mp3'
                };
                let resp = await (await api.get('/downloader/youtube', { params })).data

                const yt = resp.result;
                const capy = Func.Styles(`. .╭── ︿︿︿︿︿ 🎧   .   .   .   .   . 
. .┊ ‹‹ *Title* :: ${yt?.title || ""}
. .┊•*⁀➷ °... ℛᥱᥲᴅ ᴛʜι᥉ ... 🎧
. .╰─── ︶︶︶︶ ♡⃕  ⌇. . .
 . . ┊⿻ [ *Channel* :: ${yt?.author?.name || ""}] . .
 . . ┊⿻ [ *VideoId* :: ${yt?.videoId || ""}] . .
 . . ┊⿻ [ *Duration* :: ${yt?.duration?.timestamp || ""}] . .
 . . ┊⿻ [ *Link* :: ${yt?.url || ""}] . .
 . . ╰─────────╮`)

                const reply = await conn.sendMessage(m.chat, {
                    text: capy,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: saluran,
                            serverMessageId: 103,
                            newsletterName: botname
                        },
                        externalAdReply: {
                            title: yt.title,
                            body: yt.author.channelTitle,
                            mediaType: 1,
                            thumbnailUrl: yt.thumbnail,
                            sourceUrl: global.web,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: m
                });

                const buffer = await axios.get(yt.download, { responseType: 'arraybuffer' });
                if (buffer.data.length > 1024 * 1024 * 100) {
                    await conn.sendMessage(m.chat, {
                        document: buffer.data,
                        fileName: yt.title + '.mp3',
                        mimetype: 'audio/mpeg',
                        caption: "✅Done"
                    }, {
                        quoted: reply
                    });
                } else {
                    await conn.sendMessage(m.chat, {
                        audio: buffer.data,
                        mimetype: 'audio/mpeg'
                    }, {
                        quoted: reply
                    });
                }
            }
            break;
        };
    } catch (e) {
        m.reply(' ❌ Maaf Error Mungkin lu kebanyakan request');
        console.error('Error', e);
    };
};

Izumi.command = Izumi.help = ["ytmp4", "ytmp3"];
Izumi.tags = ["downloader"];
Izumi.limit = true;

export default Izumi;
