import fs from 'fs';
import path from 'path';

let lp = async (m) => {
    try {
        // Fungsi rekursif untuk ambil semua plugin
        const getAllPlugins = (dir) => {
            let results = [];
            const list = fs.readdirSync(dir);
            for (const file of list) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);
                if (stat.isDirectory()) {
                    results = results.concat(getAllPlugins(filePath));
                } else if (file.endsWith('.js') || file.endsWith('.cjs')) {
                    results.push(filePath);
                }
            }
            return results;
        };

        // Ambil semua file dari ./plugins
        const files = getAllPlugins('./plugins');
        if (files.length === 0) return m.reply('⚠️ Folder plugin kosong!');

        // Format caption list plugin
        let cap = '*->* List Plugin *<-*\n';
        cap += files
            .map((a, i) => {
                // Hapus prefix "plugins/" dari path
                const cleanPath = a.replace(/^plugins\//, '').replace(/\\/g, '/');
                return ` *-(${i + 1})-*: ${cleanPath}`;
            })
            .join('\n');

        await m.reply(cap);
    } catch (e) {
        console.error('Error List Plugin:', e);
        m.reply('❌ Maaf Error Mungkin Gada File Plugins');
    }
};

lp.command = ["lp", "listplugin"];
lp.help = ["lp", "listplugin"];
lp.tags = ["owner"];
lp.owner = true;

export default lp;