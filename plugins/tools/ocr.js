import up from "@izumi/uploader";
import api from "@izumi/api";

let oota = async (m, {
    text
}) => {
    try {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted || {}).mimetype || "";
        if (!/image/.test(mime)) return m.reply("⚠️Masukan Gambar Buat Copy Text Di Gambar!");
        const media = await quoted.download();
        const uguu = await up.uguu(media);
        const tmp = uguu.files[0].url;

        const {
            result
        } = await (await api.get('/tools/ocr', {
            params: {
                imageUrl: tmp
            }
        })).data;

        await m.reply(result);
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

oota.command = /^(ocr)$/i;
oota.help = ["ocr"];
oota.tags = ["tools"];
oota.limit = true;

export default oota;
