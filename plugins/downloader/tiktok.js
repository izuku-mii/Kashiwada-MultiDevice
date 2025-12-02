let old = new Date();
import axios from "axios";

const izuku = async (m, {
    conn,
    text,
    usedPrefix,
    command,
    args
}) => {
    const tiktokRegex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w.-]+\/video\/\d+|\w+|t\/\w+)/i;
    const hasTiktokLink = tiktokRegex.test(text) || null;

    if (!hasTiktokLink)
        return m.reply(`Maaf Anda Masukkan Link Dulu\nContoh: ${usedPrefix + command} https://vt.tiktok.com/xxxx`);

    try {
        const oota = await conn.sendMessage(m.chat, {
            text: "Sabar Lagi Nyari Method Dulu!"
        }, {
            quoted: m
        });

        let ttanter;
        try {
            const tikwm = await (await axios.get(apikey.izumi + '/downloader/tiktok?url=' + encodeURIComponent(args[0]))).data;
            ttanter = tikwm?.result
            await conn.sendMessage(m.chat, {
                text: "Gass Method: Tikwm Tapi Bedah",
                edit: oota.key
            }, {
                quoted: m
            });
        } catch (e) {
            try {
                const ssstik = await (await axios.get(apikey.izumi + '/downloader/ssstiktok?url=' + encodeURIComponent(args[0]))).data;
                ttanter = ssstik?.result
                await conn.sendMessage(m.chat, {
                    text: "Gass Method: Ssstik",
                    edit: oota.key
                }, {
                    quoted: m
                });
            } catch (e) {
                return conn.sendMessage(m.chat, {
                    text: "Method Tidak Dapet Di Temukan!",
                    edit: oota.key
                }, {
                    quoted: m
                });
            };
        };

        const slide = ttanter?.image || ttanter?.images;

        if (slide) {
            if (slide.length > 1) {
                const list = slide.map(v => ({
                    image: {
                        url: v,
                        caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                    }
                }));

                await conn.sendAlbum(m.chat, list, {
                    delay: 5000,
                    quoted: m
                });
            } else {
                await conn.sendMessage(
                    m.chat, {
                        image: {
                            url: slide[0]
                        },
                        caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`,
                    }, {
                        quoted: m
                    }
                );
            }
        } else {
            const video = ttanter?.hd || ttanter?.hdplay

            await conn.sendMessage(
                m.chat, {
                    video: {
                        url: video
                    },
                    mimetype: "video/mp4",
                    caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`,
                }, {
                    quoted: m
                }
            );
        }

    } catch (e) {
        m.reply('❌ Maaf Error, kemungkinan terlalu banyak request.');
        console.error('Error:', e);
    }
};

izuku.help = ['tiktok', 'ttdl', 'tt', 'tiktokdl'].map(v => `${v} *[ Link TikTok ]* `);
izuku.tags = ['downloader'];
izuku.command = ['tiktok', 'ttdl', 'tt', 'tiktokdl'];
izuku.loading = true;
izuku.limit = true;

export default izuku;
