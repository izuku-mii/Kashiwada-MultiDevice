let handler = async (m, { teks, conn, args }) => {
  let ownerGroup = m.chat.split`-`[0] + "@s.whatsapp.net";
  if (m.quoted) {
    if (m.quoted.sender === ownerGroup || m.quoted.sender === conn.user.jid)
      return;
    let usr = m.quoted.sender;
    await conn.groupParticipantsUpdate(m.chat, [usr], "remove");
    return;
  }
  if (!m.mentionedJid[0]) return m.reply(`*• Example :* .kick *[reply/tag use]*`);
  let users = m.mentionedJid.filter(
    (u) => !(u == ownerGroup || u.includes(conn.user.jid)),
  );
  for (let user of users)
    if (user.endsWith("@s.whatsapp.net") || user.endsWith("@lid"))
      await conn.groupParticipantsUpdate(m.chat, [user], "remove").then(() => m.reply("Beban Selesai Di Kick!"));
};

handler.help = ["kick", "kik", "dor", "kon"].map((a) => a + " *[reply/tag user]*");
handler.tags = ["group"];
handler.command = ["kick", "kik", "dor", "kon"];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;