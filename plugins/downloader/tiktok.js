let old = new Date();
import convert from "@library/toAll.js";
import api from "@izumi/api";

function isUrl(v) {
    return typeof v === "string" && /^https?:\/\//.test(v);
}

function isBuffer(v) {
    return Buffer.isBuffer(v) || v?.type === "Buffer" || Array.isArray(v?.data);
}

function validateImage(img) {
    if (isUrl(img)) return true;
    const buf = Buffer.from(img?.data || img || []);
    if (!Buffer.isBuffer(buf) || buf.length < 512) throw new Error("IMAGE_BUFFER_INVALID");
    return true;
}

function validateVideo(video) {
    if (isUrl(video)) return true;
    const buf = Buffer.from(video?.data || video || []);
    if (!Buffer.isBuffer(buf) || buf.length < 1024) throw new Error("VIDEO_BUFFER_INVALID");
    return true;
}

export default async function izuku(m, { conn, text, usedPrefix, command, args }) {
    try {
        if (!text) return m.reply(` *– 乂 Example Cara Pake Fitur ini ${usedPrefix + command}*
 *-* Search 
 ${usedPrefix + command} Asta Black Clover 

 *-* Download 
 ${usedPrefix + command} https://vt.tiktok.com/xxxx`);

        const tiktokRegex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w.-]+\/video\/\d+|\w+|t\/\w+)/i;
        const hasTiktokLink = tiktokRegex.test(args[0]) || null;

        if (hasTiktokLink) {
            const oota = await conn.sendMessage(m.chat, {
                text: "Sabar Lagi Nyari Method Dulu!"
            }, { quoted: m });

            let ttanter;

            try {
                const tikv1 = await (await api.get('/downloader/tiktok/v1?url=' + encodeURIComponent(args[0]))).data;
                ttanter = tikv1?.result;

                const slide =
                    Array.isArray(ttanter?.image) ? ttanter.image :
                    Array.isArray(ttanter?.images) ? ttanter.images : null;

                if (slide) slide.forEach(validateImage);
                else validateVideo(ttanter?.play || ttanter?.nowm);

                await conn.sendMessage(m.chat, { text: "Gass Method: V1", edit: oota.key });
            } catch {
                try {
                    const tikv2 = await (await api.get('/downloader/tiktok/v2?url=' + encodeURIComponent(args[0]))).data;
                    ttanter = tikv2?.result;

                    const slide =
                        Array.isArray(ttanter?.image) ? ttanter.image :
                        Array.isArray(ttanter?.images) ? ttanter.images : null;

                    if (slide) slide.forEach(validateImage);
                    else validateVideo(ttanter?.play || ttanter?.nowm);

                    await conn.sendMessage(m.chat, { text: "Mental V1, pindah ke V2", edit: oota.key });
                } catch {
                    try {
                        const tikv3 = await (await api.get('/downloader/tiktok/v3?url=' + encodeURIComponent(args[0]))).data;
                        ttanter = tikv3?.result;

                        const slide =
                            Array.isArray(ttanter?.image) ? ttanter.image :
                            Array.isArray(ttanter?.images) ? ttanter.images : null;

                        if (slide) slide.forEach(validateImage);
                        else validateVideo(ttanter?.play || ttanter?.nowm);

                        await conn.sendMessage(m.chat, { text: "Mental V2, pake V3", edit: oota.key });
                    } catch {
                        return conn.sendMessage(m.chat, {
                            text: "❌ Semua downloader TikTok gagal.",
                            edit: oota.key
                        });
                    }
                }
            }

            const slide =
                Array.isArray(ttanter?.image) ? ttanter.image :
                Array.isArray(ttanter?.images) ? ttanter.images : null;

            if (slide) {
                if (slide.length > 1) {
                    const list = slide.map(v => ({
                        image: isUrl(v) ? { url: v } : Buffer.from(v?.data || v),
                        caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                    }));
                    const alre = await conn.sendAlbum(m.chat, list, { delay: 500, quoted: m });
                    await conn.sendMessage(m.chat, {
                        text: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                    }, { quoted: alre });
                } else {
                    await conn.sendMessage(m.chat, {
                        image: isUrl(slide[0]) ? { url: slide[0] } : Buffer.from(slide[0]?.data || slide[0]),
                        caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                    }, { quoted: m });
                }
            } else {
                let ttbuffer;
                const video = ttanter?.play || ttanter?.nowm;
                if (isUrl(video)) {
                    const res = await fetch(video);
                    const arr = await res.arrayBuffer();
                    ttbuffer = Buffer.from(arr);
                } else {
                    ttbuffer = Buffer.from(video?.data || video);
                }
                await conn.sendMessage(m.chat, {
                    video: ttbuffer,
                    mimetype: "video/mp4",
                    caption: `☘️ *Process*: ${((new Date - old) * 1)} ms`
                }, { quoted: m });
            }

            const audioUrl = ttanter?.audioUrl || ttanter?.music?.url || ttanter?.music || null;
            if (audioUrl) {
                const audioBuffer = isUrl(audioUrl)
                    ? Buffer.from(await (await fetch(audioUrl)).arrayBuffer())
                    : isBuffer(audioUrl)
                        ? Buffer.from(audioUrl.data || audioUrl)
                        : null;

                if (audioBuffer && Buffer.isBuffer(Buffer.from(audioBuffer))) {
                    const audio = await convert.toVN(audioBuffer);
                    const waveform = await convert.generateWaveform(audioBuffer);
                    await conn.sendMessage(m.chat, {
                        audio,
                        waveform,
                        mimetype: "audio/ogg; codecs=opus",
                        ptt: true
                    }, { quoted: m });
                }
            }

        } else {
            const src = await (await api.get("/search/tiktok", {
                params: { query: text }
            })).data;

            const pick = src.result.sort(() => 0.5 - Math.random()).slice(0, 5);
            const list = pick.map(a => ({
                video: isUrl(a.play) ? { url: a.play } : a.play
            }));

            const ootare = await conn.sendAlbum(m.chat, list, { delay: 500, quoted: m });
            await conn.sendMessage(m.chat, {
                text: `☘️ *Process*: ${((new Date - old) * 1)} ms`
            }, { quoted: ootare });
        }

    } catch (e) {
        m.reply('❌ Maaf Error, kemungkinan terlalu banyak request.');
        console.error(e);
    }
}

izuku.help = ['tiktok', 'ttdl', 'tt', 'tiktokdl'].map(v => `${v} *[ Link TikTok ]* `);
izuku.tags = ['downloader'];
izuku.command = ['tiktok', 'ttdl', 'tt', 'tiktokdl'];
izuku.loading = true;
izuku.limit = true;
