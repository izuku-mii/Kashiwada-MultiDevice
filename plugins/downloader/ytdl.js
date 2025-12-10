import axios from "axios";

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
                const params = new URLSearchParams({
                    url: link,
                    format: f
                });
                let resp = await (await fetch(global?.apikey?.izumi + '/downloader/youtube?' + params)).json()

                const yt = resp.result;
                let ytcap = ' ------- ( DOWNLOADER - YOUTUBE ) -------\n'
                ytcap += ' -(TITLE)-: %title\n'
                ytcap += ' -(AUTHOR)-: %author\n'
                ytcap += ' -(UPLOADED)-: %uploaded\n'
                ytcap += ' -(URL)-: %link\n\n'
                ytcap += ' -(LIKE)-: %like, -(COMMENT)-: %comment, -(DURATION)-: %duration'

                let caption = ytcap
                    .replace(/%title/g, yt.title || '')
                    .replace(/%author/g, yt.author.channelTitle || '')
                    .replace(/%uploaded/g, yt.metadata.jadwal_upload || '')
                    .replace(/%link/g, yt.url || '')
                    .replace(/%like/g, yt.metadata.like || '')
                    .replace(/%comment/g, yt.metadata.comment || '')
                    .replace(/%duration/g, yt.metadata.duration || '')

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
                        caption 
                    }, {
                        quoted: reply
                    });
                } else {
                    await conn.sendMessage(m.chat, {
                        video: buffer.data,
                        caption
                    }, {
                        quoted: reply
                    });
                }
            }
            break;
            case "ytmp3": {
                if (!text.includes('youtu')) return m.reply('⚠️ Masukan Link Youtube')
                const params = new URLSearchParams({
                    url: text,
                    format: 'mp3'
                });
                let resp = await (await fetch(global?.apikey?.izumi + '/downloader/youtube?' + params)).json()

                const yt = resp.result;
                let ytcap = ' ------- ( DOWNLOADER - YOUTUBE ) -------\n'
                ytcap += ' -(TITLE)-: %title\n'
                ytcap += ' -(AUTHOR)-: %author\n'
                ytcap += ' -(UPLOADED)-: %uploaded\n'
                ytcap += ' -(URL)-: %link\n\n'
                ytcap += ' -(LIKE)-: %like, -(COMMENT)-: %comment, -(DURATION)-: %duration'

                let caption = ytcap
                    .replace(/%title/g, yt.title || '')
                    .replace(/%author/g, yt.author.channelTitle || '')
                    .replace(/%uploaded/g, yt.metadata.jadwal_upload || '')
                    .replace(/%link/g, yt.url || '')
                    .replace(/%like/g, yt.metadata.like || '')
                    .replace(/%comment/g, yt.metadata.comment || '')
                    .replace(/%duration/g, yt.metadata.duration || '')

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
                        mimetype: 'audio/mpeg'
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
