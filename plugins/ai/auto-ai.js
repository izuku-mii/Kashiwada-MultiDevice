import api from "@izumi/api";

let oota = async (m, {
    conn,
    args
}) => {
    conn.ai = conn.ai ? conn.ai : {}

    const online = args[0] || "";
    if (!online) return m.reply(`⚠️ Pilih Yang Mana!

\`--On\` Buat Aktifkan Auto Ai
\`--Off\` Buat Matikan Auto Ai`)

    switch (online) {
        case "--on": {
            conn.ai[m.chat] = {
                sender: m.sender,
                time: Date.now()
            };

            m.reply("✅ Done Udah di Aktifkan")
            break
        };
        case "--off": {
            delete conn.ai[m.chat];
            m.reply("❌ Done Udah di Matikan");
            break
        };
    };
};

oota.before = async (m, {
    conn
}) => {
    if (!m?.quoted) return;
    if (!m?.quoted?.isBaileys) return;

    conn.ai = conn.ai ? conn.ai : {}

    const autoai = conn.ai[m.chat]
    if (!autoai) return

    if (autoai.sender !== m.sender) return

    const text = m.text || ""
    if (!text) return

    const playRegex = /^(ai\s)?(putarkan|playkan|play)\s(lagu|music)\s?/i
    if (playRegex.test(m.text)) {
        let wa = `%judul. Lagu *%artists*, kan? Hmm. *Wakatta*. Sistem bakal *play* sekarang`

        const query = m.text.replace(playRegex, "").trim()
        if (!query) return m.reply("🎵 Sebutin judul lagunya")

        try {
            const res = await api.get(
                `/downloader/youtube-play?query=${encodeURIComponent(query)}`
            )

            const music = res.data.result
            const wait = wa
                .replace(/%judul/g, music?.title || "")
                .replace(/%artists/g, music?.author?.channelTitle || "")

            await m.reply(wait)
            if (!music?.download) return m.reply("❌ Lagu tidak ditemukan")

            return conn.sendMessage(m.chat, {
                audio: {
                    url: music.download
                },
                mimetype: "audio/mpeg",
                ptt: false
            }, {
                quoted: m
            })
        } catch {
            return m.reply("⚠️ Gagal memutar lagu")
        }
    } else {
        const {
            message
        } = await (
            await api.get(
                `/character/kashiwada-san?message=${encodeURIComponent(text)}`
            )
        ).data

        m.reply(message)
    };

    setTimeout(() => {
        if (conn.ai?.[m.chat]) {
            delete conn.ai[m.chat]
        }
    }, 10800000)
}

oota.command = oota.help = ["autoai", "auto-ai"];
oota.tags = ["ai"];
oota.group = true;

export default oota;
