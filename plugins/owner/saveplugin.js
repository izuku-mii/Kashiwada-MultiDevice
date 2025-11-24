import fs from 'fs';
import path from 'path';

let sp = async (m, { text }) => {
  try {
    if (!text) return m.reply('⚠️ Contoh: *.sp downloader/play.js* (reply dengan isi plugin-nya)');
    if (!m.quoted || !m.quoted.text) return m.reply('⚠️ Harus reply ke pesan yang berisi kode plugin!');

    const filePath = text.trim();
    const fileContent = m.quoted.text;

    if (!filePath.endsWith('.js') && !filePath.endsWith('.cjs'))
      return m.reply('⚠️ Nama file harus diakhiri dengan .js atau .cjs');

    const fullPath = path.join('./plugins', filePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, fileContent, 'utf-8');

    await m.reply(`✅ Plugin *${filePath}* berhasil disimpan!\n\n📁 Lokasi: ${fullPath}`);
    console.log(`✅ Plugin saved: ${fullPath}`);

  } catch (e) {
    console.log('Error Save Plugin:', e);
    m.reply('❌ Gagal menyimpan plugin! Pastikan format benar dan reply ke pesan yang berisi kode.');
  }
};

sp.command = ["sp", "saveplugin"];
sp.help = ["sp", "saveplugin"];
sp.tags = ["owner"];
sp.owner = true;

export default sp;