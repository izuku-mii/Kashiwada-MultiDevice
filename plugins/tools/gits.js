import axios from "axios";

function extractId(url) {
    try {
        const parts = new URL(url).pathname.split('/').filter(Boolean);
        const id = parts.pop();
        return id || null;
    } catch (e) {
        return null;
    }
};

let oota = async (m, {
    conn,
    text
}) => {
    try {
        let [link, type] = text.split(" ");
        if (!link.includes("github")) return m.reply(`⚠️ Masukan Link Gits Code!

 \`--doc\` kirim pesan code pake document`);

        const id = extractId(link)
        const getRaw = await (await axios.get(`https://api.github.com/gists/${id}`)).data;
        const files = Object.values(getRaw?.files || []);

        for (let i = 0; files.length > 0 && i < files.length; i++) {
            const file = files[i]

            if (type?.endsWith("--doc")) {
                const buffer = Buffer.from(file.content, "utf-8")

                await conn.sendMessage(m.chat, {
                    document: buffer,
                    fileName: file.filename,
                    mimetype: file.type
                }, {
                    quoted: m
                })
            } else {
                await m.reply(file.content)
            };
        };

    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

oota.help = oota.command = ["gits", "getgits"];
oota.tags = ["tools"];

export default oota;
