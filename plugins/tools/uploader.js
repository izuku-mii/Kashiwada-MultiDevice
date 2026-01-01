import but from "baileys_helper";
import up from "@izumi/uploader";

let izuku = async (m, { conn }) => {
    try {
        const q = m.quoted ? m.quoted : m;
        let mime = q?.msg?.mimetype || q?.mimetype || "";

        if (!/^(image|video|audio|document)\//.test(mime)) {
            return m.reply("⚠️ Khusus Image/Video/Audio/Document!");
        };

        const media = await q.download();
        const ryzumi = await up.ryzumi(media).catch(() => null);
        const github = await up.github(media).catch(() => null);
        const cloudku = await up.cloudku(media).catch(() => null);
        const top4 = await up.top4top(media).catch(() => null);
        const catb = await up.catbox(media).catch(() => null);

        let button = [];

        if (github) {
            button.push({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: 'Github-Uploader',
                    copy_code: github
                })
            });
        }
        
        if (ryzumi?.url) {
            button.push({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: 'Ryzumi-Uploader',
                    copy_code: ryzumi.url
                })
            });
        }

        if (cloudku?.data?.url) {
            button.push({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: 'Cloudku-Uploader',
                    copy_code: cloudku.data.url
                })
            });
        }

        if (top4?.downloadUrl) {
            button.push({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: 'Top4top-Uploader',
                    copy_code: top4.downloadUrl
                })
            });
        }

        if (catb) {
            button.push({
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: 'CatBox-Uploader',
                    copy_code: catb
                })
            });
        }

        if (button.length === 0) {
            return m.reply("⚠️ Semua uploader gagal!");
        }

        await but.sendInteractiveMessage(
            conn,
            m.chat,
            {
                text: "Salin Uploader Url",
                footer: "© Uploader",
                interactiveButtons: button
            },
            { quoted: m }
        );

    } catch (e) {
        m.reply("❌ Error! Mungkin terlalu banyak request.");
        console.error(e);
    }
};

izuku.help = ["tourl", "touploader"];
izuku.command = /^(tourl|touploader)$/i;
izuku.tags = ["tools"];
izuku.limit = true;

export default izuku;
