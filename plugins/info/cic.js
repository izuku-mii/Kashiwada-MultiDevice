let oota = async (m, {
    conn,
    args
}) => {
    try {
        let text = args[0] || "";
        if (!text.includes('whatsapp')) return m.reply("⚠️ Masukan Link Channel Wangcap Nya Dulu!")

        const regex = text.replace(/https:\/\/(www\.)?whatsapp\.com\/channel\//, "").split("/")[0];
        const ch = await conn.newsletterMetadata("invite", regex);
        const metadata = ch.thread_metadata;

        const caption = `〆 ━━━[METADATA CH]━━━〆
     々 Name: ${metadata?.name?.text || ""}
     々 State: ${ch.state?.type || ""}
     々 Followers: ${metadata?. subscribers_count || ""}
     々 Verification: ${metadata?. verification || ""}
〆 ━━━━━━━━━━━━━━━━━〆`

        const buttons = [{
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
                display_text: "Copy ID Channel",
                copy_code: ch.id,
            }),
        }, ];

        await conn.sendButton(m.chat, {
            image: {
                url: "https://mmg.whatsapp.net" + metadata.preview.direct_path
            },
            caption,
            buttons
        }, {
            quoted: m
        })
    } catch (e) {
        m.reply("❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

oota.help = ["cic", "cekidch"];
oota.command = /^(cic|cekidch)$/i;
oota.tags = ["info"];
oota.limit = true;

export default oota;