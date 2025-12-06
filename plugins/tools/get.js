import cloudscraper from "cloudscraper";
const { html } = await (await import("js-beautify")).default;
import convert from "../../lib/toAll.js";
async function checkCF(url) {
    try {
        const res = await cloudscraper({
            url,
            resolveWithFullResponse: true,
            encoding: null // supaya body jadi Buffer
        });

        const h = res.headers;

        const isCF =
            h["server"]?.includes("cloudflare") ||
            h["cf-ray"] ||
            h["cf-cache-status"] ||
            h["cf-chl-bypass"] ||
            h["cf-chl-bypass-resp"];

        let statusResp = "🟢 OK";

        if (res.statusCode === 403) {
            statusResp = "🟥 Forbidden";
        } else if (
            (res.statusCode === 503 && isCF) ||
            (res.statusCode === 429 && isCF)
        ) {
            statusResp = "🔴 Challenge / Block";
        } else if (isCF) {
            statusResp = "🟠 Cloudflare Active";
        }

        let json = null;
        if (h["content-type"]?.includes("application/json")) {
            try {
                json = JSON.parse(res.body.toString());
            } catch {}
        }

        return {
            status: res.statusCode,
            cloudflare: isCF,
            statusResp,
            headers: h,
            body: String(res.body),
            buffer: Buffer.from(res.body),
            json,
        };

    } catch (err) {
        return {
            error: true,
            statusResp: "🔴 Request Failed",
            message: err.message
        };
    }
}

export default async function Izu(m, { conn, args }) {
    try {
        const url = args[0] || "";
        if (!url) return m.reply("⚠️ Masukan Link Get Contoh: https://");

        const ox = await checkCF(url);

        if (ox.error) {
            console.error("Error:", ox.message);
            return m.reply("❌ Gagal request, coba lagi!");
        }

        const content = (ox.headers["content-type"] || "").split(";")[0];
        const caption = ` *<------> ( GET URL ) <------>*
 *-(Mimetype)-:* ${content}
 *-(Status)-:* ${ox?.statusResp || ""} (${ox?.status || null})
 *-(Cloudflare)-:* ${ox?.cloudflare ? "✅" : "❌"}
 *-(Server)-:* ${ox?.headers?.server}`;

        await m.reply(caption);
        if (content.includes("mpeg") || content.includes("m4a")) {
            await conn.sendMessage(m.chat, {
                audio: ox.buffer,
                mimetype: content
            }, { quoted: m });

        } else if (content.includes("ogg") || content.includes("aac") || content.includes("wav") || content.includes("opus")) {
            const audio = await convert.toVN(ox.buffer);
            const waveform = await convert.generateWaveform(ox.buffer);

            await conn.sendMessage(m.chat, {
                audio,
                waveform,
                mimetype: "audio/ogg; codecs=opus",
                ptt: true
            }, { quoted: m });

        } else if (/image/.test(content)) {
            await conn.sendMessage(m.chat, {
                image: ox.buffer,
                mimetype: content,
                caption: "✅ Nih Get Type: Foto!"
            }, { quoted: m });

        } else if (/video/.test(content)) {
            await conn.sendMessage(m.chat, {
                video: ox.buffer,
                mimetype: content,
                caption: "✅ Nih Get Type: Video!"
            }, { quoted: m });

        } else if (content.includes("html")) {
            const resht = html(ox.body);
            await conn.sendMessage(m.chat, {
                document: Buffer.from(resht),
                mimetype: "text/html",
                fileName: "result.html",
                caption: "✅ Nih Get Type: Html!"
            }, { quoted: m });

        } else if (/json/.test(content)) {
            const jsres = JSON.stringify(ox.json, null, 2);
            m.reply(jsres);

        } else if (/application/.test(content)) {
            await conn.sendMessage(m.chat, {
                document: ox.buffer,
                mimetype: content,
                fileName: "application." + content.split("/")[1],
                caption: "✅ Nih Get Type: Document!"
            }, { quoted: m });

        } else {
            m.reply("❌ Gomene Gada Media Buat lu get!");
        }

    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    }
}

Izu.help = Izu.command = ["get", "fetch"];
Izu.tags = ["tools"];
Izu.limit = true;
