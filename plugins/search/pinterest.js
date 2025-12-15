import api from "@izumi/api";

export default async function oota(m, {
    conn,
    text
}) {
    try {
        if (!text) return m.reply("⚠️ Masukan Query!")
        const res = await api.get('/search/pinterest', {
            params: {
                query: text
            }
        });

        const data = res.data;
        const result = Array.isArray(data.result) ? data.result : [];

        const random5 = result
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

        const list = random5.map((a) => ({
            image: {
                url: a.media.images.large.url
            }
        }));

        await conn.sendAlbum(m.chat, list, {
            delay: 200
        });
    } catch (e) {
        m.reply("❌Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

oota.help = oota.command = ["pin", "pinterest"];
oota.tags = ["search"];
