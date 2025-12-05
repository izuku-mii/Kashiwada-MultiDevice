import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";
import yts from "yt-search";
import convert from "../../lib/toAll.js";

const execPromise = promisify(exec);

const TMP_DIR = path.join(process.cwd(), "tmp");

async function ensureTmp() {
    try {
        await fs.mkdir(TMP_DIR);
    } catch {}
}

function sanitizeFileName(name) {
    return encodeURIComponent(name)
        .replace(/%20/g, "_")
        .replace(/\*/g, "")
        .replace(/%/g, "");
}

async function getMetadata(url) {
    try {
        const {
            stdout
        } = await execPromise(`./yt-dlp --dump-json "${url}"`);
        return JSON.parse(stdout);
    } catch {
        const {
            stdout
        } = await execPromise(`./yt-dlp --cookies ./cookies.txt --dump-json "${url}"`);
        return JSON.parse(stdout);
    }
}

function formatNumber(num) {
    if (!num || isNaN(num)) return "0";

    if (num >= 1_000_000_000)
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";

    if (num >= 1_000_000)
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";

    if (num >= 1_000)
        return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";

    return num.toString();
}

function convertMeta(meta) {
    return {
        title: meta.title || "",
        author: {
            channelTitle: meta.channel || meta.uploader || ""
        },
        thumbnail: meta.thumbnail || (meta.thumbnails?.slice(-1)[0]?.url || ""),
        metadata: {
            jadwal_upload: meta.upload_date || "",
            like: formatNumber(meta.like_count || 0),
            comment: formatNumber(meta.comment_count || 0),
            duration: meta.duration_string || (
                meta.duration ? `${Math.floor(meta.duration/60)}:${(meta.duration%60)
                    .toString()
                    .padStart(2,"0")}` : ""
            )
        },
        url: meta.webpage_url || ""
    };
}

async function safeUnlink(file) {
    try {
        await fs.unlink(file);
    } catch {}
}

async function ytdlAuto(url, format = "360") {
    const supported = ["360", "720", "1080", "mp3"];
    if (!supported.includes(format)) throw new Error("Format tidak valid!");

    await ensureTmp();

    // Ambil metadata awal dulu → untuk ambil judul
    const meta = await getMetadata(url);

    let safeTitle = sanitizeFileName(meta.title || `ytdl_${Date.now()}`);

    // Limit judul 200 karakter → fallback ke ytdl_timestamp
    if (safeTitle.length > 200) {
        safeTitle = `ytdl_${Date.now()}`;
    }

    // Lokasi output FINAL
    const outFile = path.join(TMP_DIR, `${safeTitle}.%(ext)s`);

    let baseCmd = "";
    let cookieCmd = "";

    if (format === "mp3") {
        baseCmd = `./yt-dlp -x --audio-format mp3 -o "${outFile}" "${url}"`;
        cookieCmd = `./yt-dlp --cookies ./cookies.txt -x --audio-format mp3 -o "${outFile}" "${url}"`;
    } else {
        const ytFormat = `bestvideo[height=${format}]+bestaudio/best[height=${format}]`;
        baseCmd = `./yt-dlp -f "${ytFormat}" -o "${outFile}" "${url}"`;
        cookieCmd = `./yt-dlp --cookies ./cookies.txt -f "${ytFormat}" -o "${outFile}" "${url}"`;
    }

    // TRY 1
    try {
        await execPromise(baseCmd);
    } catch {
        console.log("[YTDL] fallback cookies...");
        try {
            await execPromise(cookieCmd);
        } catch (e) {
            console.log(e);
            throw new Error("❌ VPS kamu diblokir YouTube / cookie salah.");
        }
    }

    // Cari file hasil download
    const files = await fs.readdir(TMP_DIR);
    const found = files.find(f => f.startsWith(safeTitle));

    if (!found) throw new Error("File tidak ditemukan!");

    const filePath = path.join(TMP_DIR, found);
    const buffer = await fs.readFile(filePath);
    await safeUnlink(filePath);

    const metadata = convertMeta(meta);

    return {
        ...metadata,
        buffer,
        filename: decodeURIComponent(found),
    };
}

let Izumi = async (m, {
    conn,
    text
}) => {
    const oota = await conn.sendMessage(m.chat, { text: "Wait.... Lagu Lagi Di Download Mengunakan Ytdlp...." }, { quoted: m });

     try {
        if (!text) return m.reply('⚠️ Masukan Nama Lagu Yang Ini Anda Cari !')
        const { all: search } = await yts(text);
        const play = await ytdlAuto(search[0].url, "mp3");
        const toBuffer = play.buffer
        if (toBuffer.length > 1024 * 1024 * 50) {
            await conn.sendMessage(saluran, { text: "📃 Document Nya Besar Gajadi Lah Gw Up", edit: oota.key }, { quoted: m });
        } else {
            await conn.sendMessage(m.chat, { text: "☘️Lagu No Size Gede, Ok Otw Up", edit: oota.key }, { quoted: m });
            await sendWhatsAppVoice(conn, global?.saluran, toBuffer, {
                fileName: play.filename,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 1,
                    isForwarded: true,
                    externalAdReply: {
                        title: play.title + " / " + play.author.channelTitle,
                        body: 'Request_Dari: ' + m.pushName,
                        mediaType: 1,
                        thumbnailUrl: play.thumbnail,
                        sourceUrl: global.web,
                        renderLargerThumbnail: true
                    }
                },
            });
        }

    } catch (e) {
        await conn.sendMessage(m.chat, { text: "❌ Maaf Error Mungkin lu kebanyakan request", edit: oota.key }, { quoted: m });
        console.error('Error', e);
    };
};

/**
 * Convert audio buffer ke WhatsApp voice note + waveform
 */
async function toWhatsAppVoice(inputBuffer) {
    const audioBuffer = await convert.toVN(inputBuffer)
    const waveform = await convert.generateWaveform(audioBuffer)
    return {
        audio: audioBuffer,
        waveform
    }
}

/**
 * Kirim WhatsApp PTT dan auto-play
 */
async function sendWhatsAppVoice(conn, chatId, inputBuffer, options = {}, options2 = {}) {
    try {
        const {
            audio,
            waveform
        } = await toWhatsAppVoice(inputBuffer)

        // Kirim ke WhatsApp
        await conn.sendMessage(chatId, {
            audio: audio,
            waveform: waveform,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            ...options,
        }, {
            ...options2
        })

    } catch (err) {
        console.error("Failed to send voice:", err)
    }
}

Izumi.command = /^(playch|musich|musikch)$/i
Izumi.help = ["playch", "musich", "musikch"];
Izumi.tags = ["downloader"];
Izumi.limit = true;
Izumi.owner = true;

export default Izumi;
