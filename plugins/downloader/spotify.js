import axios from 'axios';
import canvafy from 'canvafy';
import api from "@izumi/api";

let handler = async (m, {
    conn,
    usedPrefix,
    command,
    text
}) => {
    await conn.sendMessage(m.chat, {
        react: {
            text: '🔥',
            key: m.key
        }
    })
    if (!text) return m.reply(' *[ ! ]* Maaf Anda Masukan Link/Query ')
    return new Promise(async (revolse) => {
        if (/open\.spotify\.com/.test(text)) {
            if (!/open\.spotify\.com/.test(text)) return m.reply("⚠️ Link bukan dari Spotify!");
            await api.get(`/downloader/spotify?url=${text}`).then(async (a) => {
                const x = a.data.result
                const spotifyThu = await new canvafy.Spotify()
                    .setAuthor(x.artists)
                    .setAlbum(x.album)
                    .setTimestamp(121000, x.duration_ms)
                    .setImage(x.image)
                    .setTitle(x.title)
                    .setBlur(5)
                    .setOverlayOpacity(0.7)
                    .build();

                const caption = ` ------ *(Downloader Spotify)* ------
 *-(Name)-:* ${x.title || ''}               
 *-(Artist)-:* ${x.artists || ''}          
 *-(Album)-:* ${x.album || ''} 
 *-(Link)-:* ${x.external_url || ''} `;
                await conn.sendMessage(m.chat, {
                    image: spotifyThu,
                    caption,
                }, {
                    quoted: m
                });

                await conn.sendMessage(m.chat, {
                    react: {
                        text: '😆',
                        key: m.key
                    }
                })
                await conn.sendMessage(m.chat, {
                    audio: {
                        url: x.download
                    },
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: m
                })
            }).catch((err) => {
                m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
                console.log('msg:', err);
            });
        } else {
            await api.get(`/search/spotify?query=${text}`).then(async (a) => {
                const x = a.data.result

                const messageText = `Pilih Lagu Nya Total Nya: (${x.length}).`;

                await conn.sendMessage(m.chat, {
                    react: {
                        text: '😆',
                        key: m.key
                    }
                });

                const sections = [{
                    title: "🎧Pilih Lagu Spotify Di Sini!",
                    highlight_label: `Total ${x.length} Search Spotify Nya`,
                    rows: x.map((ox, i) => ({
                        title: `${ox.title}`,
                        description: `${ox.artist}`,
                        id: `${usedPrefix + command} ${ox.url}`,
                    })),
                }];

                await conn.sendButton(m.chat, {
                    text: "Pilih Di Sini!",
                    footer: "Cari Lagu Di Spotify",
                    buttons: [{
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "🎧Pilih Lagu Spotify Di Sini!",
                            sections,
                        }),
                    }, ],
                }, {
                    quoted: m
                })
            }).catch((err) => {
                m.reply(' *[ ! ]* Maaf Error Mungkin Lu Kebanyakan Request');
                console.log('msg:', err);
            });
        };
    });
};

handler.help = ['spotify', 'spdl'].map(v => v + ' *[ query/link ]* ');
handler.tags = ['downloader'];
handler.command = /^(spotify|spdl)$/i;
handler.limit = true;

export default handler;
