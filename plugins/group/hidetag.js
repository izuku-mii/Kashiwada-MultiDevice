// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: hidetag-group.mjs

let izumi = async (m, {
    conn,
    groupMetadata,
    text
}) => {
    const tag = groupMetadata.participants

    let input = m.quoted?.text ? m.quoted?.text : text ? text : ''
    conn.sendMessage(m.chat, {
        text: input,
        mentions: tag.map(a => a.jid || a.id)
    }, {
        quoted: m
    })
}

izumi.help = ['h', 'hidetag'];
izumi.tags = ['group'];
izumi.command = ['h', 'hidetag'];

izumi.admin = true;
izumi.group = true;

export default izumi;