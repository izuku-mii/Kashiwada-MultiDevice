import fs from 'fs';
import path from 'path';

let gp = async (m, { text }) => {
  try {
    if (!text) return m.reply('⚠️ Get Plugin Apa Contoh: Wen/Izumi.js')
    if (!text.endsWith('.js') && !text.endsWith('.cjs')) 
      return m.reply('⚠️ Get File Itu Yang Bener Dong!');

    const filePath = path.join('./plugins', text);
    if (!fs.existsSync(filePath)) 
      return m.reply('⚠️ File Tidak Ditemukan!');

    const file = fs.readFileSync(filePath, 'utf-8');
    await m.reply(file);

  } catch (e) {
    m.reply('⚠️ Udah Di Hapus!');
    console.log('Error', e);
  }
};

gp.command = ["gp", "getplugin"];
gp.help = ["gp", "getplugin"];
gp.tags = ["owner"];
gp.owner = true;

export default gp;