let old = new Date()
import api from "@izumi/api";
import axios from "axios";

export default async function izuku(m, {
    conn,
    text,
    usedPrefix,
    command,
    args
}) {
    const linkig = text.includes('ins')
    
    let url;
    if (linkig) {
        try {
            const {
                result: ig
            } = await (await api.get('/downloader/instagram/v1?url=' + encodeURIComponent(args[0]))).data;
            if (ig?.media?.[0]?.isVideo === false) {
                const slide = ig.media
                if (slide.length > 1) {
                    const list = slide.map(v => ({
                        image: {
                            url: v.url,
                            caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                        }
                    }));

                    const alse = await conn.sendAlbum(m.chat, list, {
                        delay: 500,
                        quoted: m
                    });
                    await conn.reply(m.chat, `☘️ *Process*: ${((new Date - old) * 1)} ms`, alse);
                } else {
                    await conn.sendMessage(m.chat, {
                        image: {
                            url: slide?.[0]?.url
                        },
                        caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                    }, {
                        quotes: m
                    });
                }
            } else {
                let {
                    data: video
                } = await axios.get(ig?.media?.[0]?.url, {
                    responseType: 'arraybuffer'
                });
                await conn.sendMessage(m.chat, { video, caption: `☘️ *Process*: ${((new Date - old) * 1)} ms` }, { quoted: m });
            }
        } catch (e) {
            m.reply('❌ Maaf Error Mungkin Kebanyakan Request kali');
            console.error('Error: ', e);
        }
    } else {
        m.reply(`Maaf Anda Masukkan Link Dulu Contoh ${usedPrefix + command} https://www.instagram.com/xxxx`);
    };
};

izuku.help = ['instagram', 'igdl', 'ig', 'igdl'].map(v => `${v} *[ Link Instagram ]* `);
izuku.tags = ['downloader'];
izuku.command = ['instagram', 'igdl', 'ig', 'igdl'];
izuku.loading = true;
izuku.limit = true;
