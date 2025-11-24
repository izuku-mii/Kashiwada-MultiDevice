import up from "../../lib/uploader.js";

let handler = async (m, {
    conn,
    usedPrefix,
    command
}) => {
    try {
        const q = m.quoted ? m.quoted : m;
        const mime = q?.msg?.mimetype || q?.mimetype || "";

        if (!/image/.test(mime)) return m.reply(`⚠️ Reply Gambar / Kirim Gambar Caption Buat ${usedPrefix + command}`);

        const media = await q.download();
        const tmp = await up.tempfiles(media);
        const { result: re } = await (await fetch(global?.apikey?.izumi + '/tools/upscale?imageUrl=' + tmp)).json();

        await conn.sendMessage(m.chat, {
            image: {
                url: re.imageUrl
            },
            caption: ` 📷 Remini Gambar\n\n 🔗Url: ${re?.imageUrl || ""}\n ☘️Size: ${re?.size || ""}`
        }, {
            quoted: m
        })
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

handler.help = handler.command = ["hd", "remini", "hdr"];
handler.tags = ["tools"];
handler.limit = true;

export default handler;