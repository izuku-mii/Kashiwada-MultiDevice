import convert from "@library/toAll.js";
import stickerr from "@library/sticker.js";

export default async function oota(m, {
    conn,
    text
}) {
    const quoted = m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted || {}).mimetype || ""

    if (!text && !mime) {
        return m.reply("⚠️Pilih Mau Masukan Teks Atau, Kirim Media Aja?.")
    }

    const ppBot = await conn.profilePictureUrl(m.sender, "image").catch(() => "https://f.top4top.io/p_3636c29bw1.jpg");

    const contextInfo = {
        forwardingScore: 1,
        isForwarded: true,
        externalAdReply: {
            title: m.pushName,
            body: "Request: " + m.pushName,
            mediaType: 1,
            thumbnailUrl: ppBot,
            sourceUrl: global.web,
            renderLargerThumbnail: false
        }
    }

    if (mime.startsWith("audio/")) {
        const media = await quoted.download();
        const audio = await convert.toVN(media);
        const waveform = await convert.generateWaveform(audio);

        await conn.sendMessage(global?.saluran, {
            audio,
            waveform,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            contextInfo
        });
    } else if (mime === "image/webp") {
        const media = await quoted.download();
        const sticker = await stickerr.writeExif({
            data: media
        }, {
            packName: `${m.pushName} PushCh`
        });
        await conn.sendMessage(global?.saluran, {
            sticker,
            contextInfo
        });
    } else if (mime.startsWith("image/")) {
        let caption =  m?.quoted?.text || text || "";
        const image = await quoted.download();
        await conn.sendMessage(global?.saluran, {
            image,
            caption,
            contextInfo
        });
    } else if (mime.startsWith("video/")) {
        let caption =  m?.quoted?.text || text || "";
        const video = await quoted.download();
        await conn.sendMessage(global?.saluran, {
            video,
            contextInfo
        });
    } else if (text) {
        await conn.sendMessage(global?.saluran, {
            text,
            contextInfo
        });
    } else {
        return m.reply("❌ Kirim pesan atau media yang valid")
    }
    m.reply("✅ Done Liat Di Saluran!")
}

oota.command = /^(pushch|pushchannel)$/i;
oota.help = ["pushch", "pushchannel"];
oota.tags = ["tools"];
oota.owner = true;
