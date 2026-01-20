import {
    downloadContentFromMessage
} from "baileys"

let Izumi = async (m, {
    conn
}) => {
    try {
        if (!(m?.quoted?.mtype === "viewOnceMessageV2")) {
            m.reply("⚠️Replykan Pesan Rvo Nya viewOnce!")
        }

        const msg = m.quoted ? m.quoted : m
        const content = msg.message

        const mediaType = content.imageMessage ?
            "imageMessage" :
            content.videoMessage ?
            "videoMessage" :
            null

        if (!mediaType) return m.reply("❌Gada Media Nya!")

        const mediaMsg = content[mediaType]

        const stream = await downloadContentFromMessage(mediaMsg, mediaType.replace("Message", ""))
        let buffer = Buffer.from([])
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

        await conn.sendMessage(
            m.chat, {
                [mediaType.replace("Message", "")]: buffer,
                caption: mediaMsg.caption || "",
                mimetype: mediaMsg.mimetype,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            }, {
                quoted: m
            }
        );
    } catch (e) {
        m.reply("❌ Maaf Error, Mungkin lu kebanyakan request");
        console.error(e);
    };
};

Izumi.help = ["rvo", "viewonce"];
Izumi.command = ["rvo", "viewonce"];
Izumi.tags = ["tools"];
Izumi.limit = true;

export default Izumi;
