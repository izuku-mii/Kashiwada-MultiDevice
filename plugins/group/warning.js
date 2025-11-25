let oota = async (m, {
    conn,
    args,
    participants
}) => {

    let num = "13135550002@s.whatsapp.net";
    const url = await conn.profilePictureUrl(num, 'image');
    const res = await fetch(url);
    const metre = Buffer.from(await res.arrayBuffer());
    const resize = await conn.resize(metre, 200, 200);

    const floc = {
        key: {
            participant: num,
            ...(m.chat ? {
                remoteJid: 'status@broadcast'
            } : {})
        },
        message: {
            locationMessage: {
                name: botname,
                jpegThumbnail: resize
            }
        }
    };

    let target = m.mentionedJid?.[0] || m.quoted?.sender || null;

    if (!target && args[0]) {
        const pn = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
        const lid = await conn.signalRepository.lidMapping.getLIDForPN(pn);
        if (lid) target = lid;
    }

    if (!target && args[0]) {
        const raw = args[0].replace(/[^0-9]/g, "") + "@lid";
        if (participants.some((p) => p.id === raw)) target = raw;
    }

    if (!target || !participants.some((p) => p.id === target)) return m.reply("⚠️ Lu Reply / Tag Orang Buat Warning!");
    let users = db.data.users[target]
    users.warn += 1

    if (users.warn >= 3) {
        users.warn = 0
        conn.reply(m.chat, ` *– 乂 Warn - Detector* 
Kamu Udah Kena Warn Sampai 3/3, Gomen Lu Harus Di Kick`, floc, { contextInfo: { mentionedJid: [target] } });
       await conn.groupParticipantsUpdate(m.chat, [target], "remove");
    } else {
        conn.reply(m.chat, ` *– 乂 Warn - Detector*
Kamu Kena Warn Sama @${target.split("@")[0] || ""} ${users.warn}/3`, floc, { contextInfo: { mentionedJid: [target] } })
    }
}

oota.help = oota.command = ["wrn", "warning", "warn"];
oota.tags = ["group"];
oota.group = true;
oota.admin = true;
oota.botAdmin = true;

export default oota;
