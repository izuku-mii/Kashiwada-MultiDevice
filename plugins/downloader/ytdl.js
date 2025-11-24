import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);

const TMP_DIR = path.join(process.cwd(), "tmp");

async function ensureTmp() {
    try { await fs.mkdir(TMP_DIR); } catch {}
}

function sanitizeFileName(name) {
    return encodeURIComponent(name)
        .replace(/%20/g, "_")
        .replace(/\*/g, "")
        .replace(/%/g, "");
}

async function getMetadata(url) {
    try {
        const { stdout } = await execPromise(`./yt-dlp --dump-json "${url}"`);
        return JSON.parse(stdout);
    } catch {
        const { stdout } = await execPromise(`./yt-dlp --cookies ./cookies.txt --dump-json "${url}"`);
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
    try { await fs.unlink(file); } catch {}
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
        baseCmd   = `./yt-dlp -x --audio-format mp3 -o "${outFile}" "${url}"`;
        cookieCmd = `./yt-dlp --cookies ./cookies.txt -x --audio-format mp3 -o "${outFile}" "${url}"`;
    } else {
        const ytFormat = `bestvideo[height=${format}]+bestaudio/best[height=${format}]`;
        baseCmd   = `./yt-dlp -f "${ytFormat}" -o "${outFile}" "${url}"`;
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
    };
}

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
                const yt = await ytdlAuto(link, f)
                
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

                const buffer = yt.buffer
                if (buffer.length > 1024 * 1024 * 50) {
                    await conn.sendMessage(m.chat, {
                        document: buffer,
                        fileName: yt.title + ".mp4",
                        mimetype: 'video/mp4',
                        caption 
                    }, {
                        quoted: reply
                    });
                } else {
                    await conn.sendMessage(m.chat, {
                        video: buffer,
                        caption,
                        fileName: yt.title + ".mp4"
                    }, {
                        quoted: reply
                    });
                }
            }
            break;
            case "ytmp3": {
                if (!text.includes('youtu')) return m.reply('⚠️ Masukan Link Youtube')

                const yt = await ytdlAuto(text, "mp3");
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

                const buffer = yt.buffer
                if (buffer.length > 1024 * 1024 * 50) {
                    await conn.sendMessage(m.chat, {
                        document: buffer,
                        fileName: yt.title + ".mp3",
                        mimetype: 'audio/mpeg'
                    }, {
                        quoted: reply
                    });
                } else {
                    await conn.sendMessage(m.chat, {
                        audio: buffer,
                        mimetype: 'audio/mpeg',
                        fileName: yt.title + ".mp3"
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

Izumi.command = /^(ytmp4|ytmp3)$/i
Izumi.help = ["ytmp4", "ytmp3"];
Izumi.tags = ["downloader"];
Izumi.limit = true;

export default Izumi;