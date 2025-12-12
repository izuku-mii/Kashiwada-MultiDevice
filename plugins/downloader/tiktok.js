llet old = new Date();
import axios from "axios";
import convert from "@library/toAll.js";


export default async function izuku(m, {
    conn,
    text,
    usedPrefix,
    command,
    args
}) {
    try {
        if (!text) return m.reply(` *– 乂 Example Cara Pake Fitur ini ${usedPrefix + command}*
 *-* Search 
 ${usedPrefix + command} Asta Black Clover 

 *-* Download 
 ${usedPrefix + command} https://vt.tiktok.com/xxxx`)
        const tiktokRegex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w.-]+\/video\/\d+|\w+|t\/\w+)/i;
        const hasTiktokLink = tiktokRegex.test(args[0]) || null;

        if (hasTiktokLink) {
            const oota = await conn.sendMessage(m.chat, {
                text: "Sabar Lagi Nyari Method Dulu!"
            }, {
                quoted: m
            });

            let ttanter;
            try {
                const snaptik = await (await api.get('/downloader/snaptik?url=' + encodeURIComponent(args[0]))).data;
                ttanter = snaptik?.result
                await conn.sendMessage(m.chat, {
                    text: "Gass Method: SnapTik",
                    edit: oota.key
                }, {
                    quoted: m
                });
            } catch (e) {
                try {
                    const tikwm = await (await api.get('/downloader/tiktok?url=' + encodeURIComponent(args[0]))).data;
                    ttanter = tikwm?.result
                    await conn.sendMessage(m.chat, {
                        text: "Gass Method: Tikwm Tapi Bedah",
                        edit: oota.key
                    }, {
                        quoted: m
                    });
                } catch (e) {
                    try {
                        const ssstik = await (await axios.get('/downloader/ssstiktok?url=' + encodeURIComponent(args[0]))).data;
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

                    const alre = await conn.sendAlbum(m.chat, list, {
                        delay: 500,
                        quoted: m
                    });
                    await conn.sendMessage(m.chat, { text: `☘️ *Process*: ${((new Date - old) * 1)} ms` }, { quoted: alre });
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

            const audioUrl = ttanter?.audioUrl || ttanter?.music || null;

            const {
                data: audioBuffer
            } = await axios.get(audioUrl, {
                responseType: "arraybuffer"
            });
            const audio = await convert.toVN(audioBuffer);
            const waveform = await convert.generateWaveform(audioBuffer);

            if (audio) return conn.sendMessage(m.chat, {
                audio,
                waveform,
                mimetype: "audio/ogg; codecs=opus",
                ptt: true
            }, {
                quoted: m
            })

        } else {
            const src = await (await api.get("/search/tiktok", {
                params: {
                    query: text
                }
            })).data;
            const search = src.result;
            let pick = search.sort(() => 0.5 - Math.random()).slice(0, 5);
            let list = pick.map((a, i) => ({
                video: {
                    url: a.play
                }
            }));

            const ootare = await conn.sendAlbum(m.chat, list, {
                delay: 500,
                quoted: m
            });

            await conn.sendMessage(m.chat, { text: `☘️ *Process*: ${((new Date - old) * 1)} ms` }, { quoted: ootare });
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
