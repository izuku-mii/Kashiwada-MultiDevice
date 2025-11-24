import { exec as _exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(_exec);

const handler = async (m, { conn, isOwner, command, text }) => {
  if (global.conn.user.jid !== conn.user.jid) return;

  let o;
  try {
    o = await exec(command.trimStart() + ' ' + text.trimEnd());
  } catch (e) {
    o = e;
  } finally {
    const { stdout, stderr } = o;
    if (stdout?.trim()) {
      await m.reply(`📤 output:\n\n\`\`\`${stdout}\`\`\``);
    }
  }
};

handler.customPrefix = /^[$] /;
handler.command = new RegExp();
handler.rowner = true;

export default handler;