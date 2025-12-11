let old = new Date()
import api from "@izumi/api";

export default async function izuku(m, {
    conn,
    text,
    usedPrefix,
    command,
    args
}) {
    const linkig = text.includes('ins')
    if (!linkig) m.reply(`Maaf Anda Masukkan Link Dulu Contoh ${usedPrefix + command} https://www.instagram.com/xxxx`);

    let url;
    if (linkig) {
        try {
            const {
                result: ig
            } = await (await api.get('/downloader/instagram?url=' + encodeURIComponent(args[0]))).data;
            if (ig.isVideo === false) {
                const slide = ig.media
                if (slide.length > 1) {
                    const list = slide.map(v => ({
                        image: {
                            url: v,
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
                            url: slide[0]
                        },
                        caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                    }, {
                        quotes: m
                    });
                }
            } else {
                let {
                    data: res
                } = await axios.get(ig.media, {
                    responseType: 'arraybuffer'
                });
                conn.sendFile(m.chat, Buffer.from(res), null, `☘️ *Process*: ${((new Date - old) * 1)} ms`, m);
            }
        } catch (e) {
            m.reply('❌ Maaf Error Mungkin Kebanyakan Request kali');
            console.error('Error: ', e);
        }
    } else {
        m.reply('❌Maaf Gada Link Gabisa Dl')
    };
};

izuku.help = ['instagram', 'igdl', 'ig', 'igdl'].map(v => `${v} *[ Link Instagram ]* `);
izuku.tags = ['downloader'];
izuku.command = ['instagram', 'igdl', 'ig', 'igdl'];
izuku.loading = true;
izuku.limit = true;
