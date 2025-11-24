let Izumi = async (m, { conn, command, text }) => {
  switch (command) {
    case 'swlc':
    case 'setwelcome': {
      const twlc = m?.quoted?.text || text

      if (!twlc) return m.reply(`⚠️ Masukan Query/Reply Pesan Nya!`)
      
      // simpan apa adanya tanpa ubah \n
      const converted = twlc.trim()

      db.data.chats[m.chat].sWelcome = converted
      db.data.chats[m.chat].welcome = true

      m.reply('✅ Done! Welcome Nya Disimpan, Coba Tes.')
    }
    break

    case 'dwlc':
    case 'delwelcome': {
      db.data.chats[m.chat].sWelcome = ''
      db.data.chats[m.chat].welcome = true

      m.reply('🗑️ Done! Welcome Nya Dihapus, Coba Tes.')
    }
    break

    case 'owlc':
    case 'offwelcome': {
      db.data.chats[m.chat].welcome = false
      m.reply('🚫 Done! Welcome Nya Dimatikan, Coba Tes.')
    }
    break

    case 'onwlc':
    case 'onwelcome': {
      db.data.chats[m.chat].welcome = true
      m.reply('✅ Done! Welcome Nya Dihidupkan, Coba Tes.')
    }
    break
  }
}

Izumi.help = ["swlc", "setwelcome", "dwlc", "delwelcome", "owlc", "offwelcome", "onwlc", "owlc"]
Izumi.command = ["swlc", "setwelcome", "dwlc", "delwelcome", "owlc", "offwelcome", "onwlc", "owlc"]
Izumi.tags = ["group"]
Izumi.admin = true

export default Izumi