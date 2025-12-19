import fs from "fs";
import { exec } from "child_process";
import cp from "child_process";
import { promisify } from "util";

const exec_ = promisify(exec).bind(cp);

const handler = async (m, { conn, isROwner }) => {
   try {
      const zipFileName = "Alya-MD.zip";

      m.reply("Sedang memulai proses backup. Harap tunggu...");

      setTimeout(() => {
         const zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;
         exec_(zipCommand, (err) => {
            if (err) {
               m.reply("Terjadi kesalahan saat membuat file zip.");
               console.error(err);
               return;
            }

            setTimeout(() => {
               if (fs.existsSync(zipFileName)) {
                  const file = fs.readFileSync(zipFileName);
                  conn.sendMessage(
                     m.chat,
                     {
                        document: file,
                        mimetype: "application/zip",
                        fileName: zipFileName,
                        caption: "Backup selesai. Silakan unduh file backup.",
                     },
                     { quoted: m }
                  );

                  setTimeout(() => {
                     fs.unlinkSync(zipFileName);
                     m.reply("File backup telah dihapus.");
                  }, 5000);
               } else {
                  m.reply("File zip tidak ditemukan.");
               }
            }, 60000); // tunggu 1 menit
         });
      }, 1000);
   } catch (error) {
      m.reply("Terjadi kesalahan saat melakukan backup.");
      console.error(error);
   }
};

handler.help = ["backupsc"];
handler.tags = ["owner"];
handler.command = ["backupsc"];
handler.owner = true;

export default handler;
