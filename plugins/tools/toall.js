import conv from "@library/toAll.js";
let old = new Date()

let toAll = async (m, {
    command
}) => {
    try {
        switch (command) {
            case "tomp3":
            case "mp3": {
                const q = m.quoted ? m.quoted : m
                if (q.mtype !== "videoMessage" && q.mtype !== "audioMessage") return m.reply(" ⚠️ Masukan Video/Audio / Reply Video/Audio!");
                const buffer = await q.download();
                const mp3Buffer = await conv.toMP3(buffer);
                await conn.sendMessage(m.chat, {
                    audio: mp3Buffer,
                    mimetype: 'audio/mpeg'
                }, {
                    quoted: m
                })
            }
            break;
            case "tovn":
            case "vn": {
                const q = m.quoted ? m.quoted : m
                if (q.mtype !== "videoMessage" && q.mtype !== "audioMessage") return m.reply(" ⚠️ Reply Audio!");
                const buffer = await q.download();
                const vnBuffer = await conv.toVN(buffer);
                await conn.sendMessage(m.chat, {
                    audio: vnBuffer,
                    mimetype: 'audio/ogg; codecs=opus',
                    ptt: true
                }, {
                    quoted: m
                })
            }
            break;
            case "toimage":
            case "toimg": {
                if (!m?.quoted || m.quoted?.mtype !== "stickerMessage") return m.reply(" ⚠️ Reply Sticker To Image!");
                const q = m.quoted ? m.quoted : m
                const buffer = await q.download();
                await conn.sendMessage(m.chat, {
                    image: buffer,
                    caption: `☘️ *Process*: ${((new Date() - old) * 1)}`,
                    mimetype: "image/webp"
                }, {
                    quoted: m
                })
            }
            break;
            case "tomp4":
            case "mp4": {
                if (!m?.quoted || m.quoted?.mtype !== "stickerMessage") return m.reply(' ⚠️ Reply Sticker To Video!');
                const buffer = await m.quoted.download();
                const stickervideo = await conv.webp2mp4(buffer);
                await conn.sendMessage(m.chat, {
                    video: stickervideo,
                    caption: `☘️ *Process*: ${((new Date() - old) * 1)}`,
                    mimetype: "video/mp4"
                }, {
                    quoted: m
                })
            }
            break;
        }
    } catch (_e) {
        m.reply(' ❌ Maaf Error Mungkin lu kebanyakan request')
        console.error(_e)
    }
}

toAll.command = /^(tomp3|mp3|tovn|vn|toimage|toimg|tomp4|mp4)$/i;
toAll.help = ["tomp3", "mp3", "tovn", "vn", "toimage", "toimg", "tomp4", "mp4"];
toAll.tags = ["tools"];
toAll.limit = true;

export default toAll;
