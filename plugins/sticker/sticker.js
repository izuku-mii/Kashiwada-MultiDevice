import sticker from '@library/sticker.js';

let Izumi = async (m, { conn }) => {
  const q = m.quoted ? m.quoted : m;
  let msg = q.msg || q;

  if (!msg.mimetype) return m.reply(' ⚠️ Masukan Video / Image Buat Sticker !');

  let st = {
    packName: `╭───── ( ${global?.botname} ) ─────
│ -(AUTHOR)-: ${global?.ownername}
│ -(WEB)-: ${global?.web}
╰──────────────`
  };

  const buffer = await q.download();

  if (/image/.test(msg.mimetype)) {
    const stik = await sticker.writeExif({ data: buffer }, { ...st });
    await conn.sendMessage(m.chat, { sticker: stik }, { quoted: m });
  } else if (/video/.test(msg.mimetype)) {
    if (msg.seconds > 10) return m.reply(' ⚠️ Masukan Video Max 10 Detik !');
    const stik = await sticker.writeExif({ data: buffer }, { ...st });
    await conn.sendMessage(m.chat, { sticker: stik }, { quoted: m });
  } else {
    m.reply(' ⚠️ Gada Type Buat Sticker Video/Image!');
  }
};

Izumi.command = /^(s|sticker|stiker)$/i;
Izumi.help = ["s", "sticker", "stiker"];
Izumi.tags = ["sticker"];
Izumi.limit = true;

export default Izumi;
