import up from "@izumi/uploader";
import api from "@izumi/api";
import axios from "axios";

export default async function hy(m, {
    conn
}) {
    try {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted || {}).mimetype;
        if (!/image/.test(mime)) return m.reply("⚠️ Masukan Gambar / Reply Gambar Buat Hytamkan");

        const media = await quoted.download();
        const uguu = await up.uguu(media);
        const tmp = uguu.files[0].url;

        const { result: re } = await (await api.get('/ai-image/hytamkan?imageUrl=' + tmp)).data;

        await conn.sendMessage(m.chat, {
            image: {
                url: re.download
            },
            caption: `✅ Done Penghitaman Nya`
        }, {
            quoted: m
        });
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request!");
        console.error(e);
    };
};

hy.command = /^(hytamkan|hytam|hitam|hitamkan)$/i;
hy.help = ["hytamkan", "hytam", "hitam", "hitamkan"];
hy.tags = ["tools"];
hy.limit = true;