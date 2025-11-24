let izuku = async (m, {
    conn
}) => {
    const owner = global?.owner
    let list = []
    for (let i of owner) {

        let senli = await (await conn?.signalRepository?.lidMapping?.getLIDForPN(i + '@s.whatsapp.net').catch(() => null))?.replace(/:\d+@/, '@')

        list.push({
            displayName: await await conn.getName(senli) || global?.ownername,
            vcard: `BEGIN:VCARD\n
VERSION:3.0\n
N:${await conn.getName(senli) || global?.ownername}\n
FN:${await conn.getName(senli) || global?.ownername}\n
item1.TEL;waid=${i}:${i}\n
item1.X-ABLabel:Ponsel\n
END:VCARD`
        })
    }

    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: `${list.length} Contact`,
            contacts: list
        }
    }, {
        quoted: m
    })
}

izuku.help = izuku.command = ["owner", "own"];
izuku.tags = ["info"];

export default izuku;