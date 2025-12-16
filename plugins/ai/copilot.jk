import api from "@izumi/api";

let oota = async (m, {
    text
}) => {
    try {
        if (!text) return m.reply("⚠️ Masukan Mau Nanya Apa Ke Eay Copilot");
        const {
            result
        } = await (await api.get('/ai/copilot', {
            params: {
                prompt: text
            }
        })).data;

        let caption = `${result?.text || ""}

*Result Search:*
${result?.citations?.map((a) => `*Title:* ${a.title || ""}\n${a.url || ""}`).join("\n\n")}`;

        await m.reply(caption);
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

oota.command = /^(copilot)$/i;
oota.help = ["copilot"];
oota.tags = ["ai"];
oota.limit = true;

export default oota;
