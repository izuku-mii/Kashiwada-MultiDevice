import up from "@izumi/uploader";
import api from "@izumi/api";
import axios from "axios";
import FormData from "form-data";
const form = new FormData();

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
        form.append("image", media, {
            filename: "remini-" + Date.now() + ".jpg",
            contentType: "image/jpeg"
       });

        const { result: re } = await (await api.post('/tools/upscale', form, { headers: { ...form.getHeaders() } })).data;
        const { data } = await axios.get(re.imageUrl, { responseType: "arraybuffer" })

        await conn.sendMessage(m.chat, {
            image: {
                url: re.imageUrl
            },
            caption: ` 📷 Remini Gambar\n\n 🔗Url: ${re?.imageUrl || ""}\n ☘️Size: ${Func.formatSize(data.length) || ""}`
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
