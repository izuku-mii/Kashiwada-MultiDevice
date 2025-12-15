import axios from "axios"

export default async function Oota(m, {
    conn,
    text,
    usedPrefix,
    command
}) {
    try {
        const [messageText, carrierName, batteryPercentage, signalStrength] = text.split('|');

        if (!messageText || !carrierName || !batteryPercentage || !signalStrength) return m.reply(`⚠️Masukan Teks|Nama Jaringan|baterai|sinyal nya berapa\n\n ⚠️Contoh: ${usedPrefix + command} hai saya penguna baru wangcap|Smartfren|68|2`)

        const params = {
            messageText,
            carrierName,
            batteryPercentage,
            signalStrength,
        };

        await conn.delay(500);

        const {
            data
        } = await axios.get("https://brat.siputzx.my.id/iphone-quoted", {
            params,
            responseType: "arraybuffer"
        })

        conn.sendMessage(m.chat, {
            image: data,
            caption: `✅Done Min\n\n✉️Chat: ${messageText || ""}\n📶Sinyal: ${carrierName || "Smartfren"}\n🔋Baterei: ${batteryPercentage || 0}\n📶Sinyal Length: ${signalStrength || ""}`
        }, { quoted: m })
    } catch (e) {
        m.reply("❌Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    }
}

Oota.command = Oota.help = ["iqc", "iphone-qc"];
Oota.tags = ["generator"];
