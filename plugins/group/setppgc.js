// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: setppgc-group.js

let izuku = async (m, {
    conn
}) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/image/.test(mime)) throw ' *[ ! ]* Mana Foto Buat Set Photo Profile Group !'
    let media = await q.download();
    await conn.updateProfilePicture(m.chat, media).then(() =>
        conn.reply(
            m.chat,
            " *π* Oke Photo Profil Grup Udah Di Ganti\n *π* Liat Aja Di Grub😁",
            m
        )
    );
};

izuku.group = true;
izuku.admin = true;
izuku.botAdmin = true;

izuku.help = ['setppgc', 'setppgroup'];
izuku.command = /^(setppgc|setppgroup)$/i;
izuku.tags = ['group']

export default izuku;
