// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: spotify-downloader.mjs

import axios from 'axios';

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
            await axios.get(`${apikey.izumi}/downloader/spotify?url=${text}`).then(async (a) => {
                const x = a.data.result
                const caption = `
╭───────────────────────────────╮
│  🔥 RIN'S SPOTIFY DOWNLOADER  │
├───────────────────────────────┤
│ 🎵 ${x.title || ''}               
│ 🎤 ${x.artists || ''}          
│ 💿 ${x.album || ''} 
│ 🔗 ${x.external_url || ''} 
├───────────────────────────────┤
│ 🗡️ (•̀ᴗ•́)و ︻デ═一            
│ 📥 Downloading...              
│ 💽 Format: MP3               
╰───────────────────────────────╯
"Not bad... for human music." - Rin Okumura`;
                await conn.sendMessage(m.chat, {
                    text: caption
                }, {
                    quoted: m
                })
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
            await axios.get(`${apikey.izumi}/search/spotify?query=${text}`).then(async (a) => {
                const x = a.data.result

                const messageText = `
╭────────────────────────────╮
│ 🔥 RIN'S SPOTIFY PICKS     │
├────────────────────────────┤
│ Pilih lagu dari hasil acak:
│
${x.map((a, i) => `│ ${i + 1}. ${a.title} - ${a.artist}`).join('\n')}
╰────────────────────────────╯
Balas dengan nomor (1-${x.length}).`;

                await conn.sendMessage(m.chat, {
                    react: {
                        text: '😆',
                        key: m.key
                    }
                })
                await conn.sendAliasMessage(m.chat, {
                    text: messageText
                }, x.map((a, i) => ({
                    alias: `${i + 1}`,
                    response: `${usedPrefix + command} ${a.url || ''}`
                })), m);
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

export default handler;