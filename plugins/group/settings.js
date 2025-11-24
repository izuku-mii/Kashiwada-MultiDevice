let izuku = async (m, {
    conn,
    text
}) => {
    if (!text) throw ' *[ ! ]* Pilih Buka or Tutup ?';
    return new Promise(async (revolse) => {
        try {
            await conn.groupSettingUpdate(m.chat, text === "open" || text === 'buka' ? 'not_announcement' : 'announcement').then(() =>
                conn.reply(
                    m.chat,
                    `Grup Udah, Di ${text === 'open' || text === 'buka' ? 'Buka' : 'Tutup'}`,
                    m)
            )
        } catch (err) {
            conn.reply(m.chat, ' *[ ! ]* Maaf Error Silahkan Di Coba Lagi !', m)
            console.log('Error', err)
        }
    })
}

izuku.group = true;
izuku.admin = true;
izuku.botAdmin = true;

izuku.help = ['settings', 'setgc', 'settingsgc']
izuku.tags = ['group']
izuku.command = ['settings', 'setgc', 'settingsgc']

export default izuku
