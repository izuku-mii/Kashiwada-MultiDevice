/**
 * @SCRIPT      🔥 KASHIWADA-BOTWA 🔥
 * @INFO        Script ini GRATIS, bukan untuk dijual belikan.
 * @WARNING     Jangan ngaku-ngaku, jangan jual script gratis, dosa bro 😭
 * 
 * @BASE        NAO-MD
 * @BASE_OWNER  SHIROKAMI RYZEN
 * 
 * @AUTHOR      IZUKU-MII
 * @REMAKE      IZUKU-MII
 * 
 * @NOTE        SEMOGA YANG COLONG SCRIPT INI DAPET HIKMAH DAN TOBAT 🙏
 * 
 * @COPYRIGHT   © 2025 IZUKU-MII | All Rights Free.
 */

import fs from 'fs'
import { fileURLToPath } from 'url'
import chalk from "chalk"

const hairColors = [
  "#C0C0C0", "#A9A9A9",
  "#064420", "#16A085", "#013220",
  "#E0FFFF", "#B0E0E6"
]

function pickRandomHairColor() {
  const randomHex = hairColors[Math.floor(Math.random() * hairColors.length)];
  return randomHex;
}

// 🔥 Convert HEX → RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

export default async function printInfo(m, conn = { user: {} }) {
        if (!m || !m.sender || !m.chat || !m.mtype) return;
        const sender = conn.decodeJid(m.sender);
        const chat = conn.decodeJid(m.chat);
        const user = (await conn.getName(sender)) || "Unknown";

        const { subject } = (await conn.groupMetadata(m.chat) || "No Group Name")
        const getIdFormat = (id) => {
            if (id?.endsWith("@lid")) return "LID";
            if (id?.endsWith("@s.whatsapp.net")) return "PN";
            if (id?.startsWith("@")) return "Username";
            return "Unknown";
        };

        const getChatContext = (id) => {
            if (id?.endsWith("@g.us")) return "Group";
            if (id?.endsWith("@broadcast")) return "Broadcast";
            if (id?.endsWith("@newsletter")) return "Channel";
            if (id?.endsWith("@lid") || id?.endsWith("@s.whatsapp.net")) return "Private";
            return "Unknown";
        };

        const pesan = m.text ? m.text : "";
        const idFormat = getIdFormat(sender);
        const chatContext = getChatContext(chat);
        const time = new Date().toTimeString().slice(0,5);

        let colorh = pickRandomHairColor();
        const reset = "\x1b[0m";

        // 🔥 Convert HEX → ANSI 24bit
        const { r, g, b } = hexToRgb(colorh);
        const colorANSI = `\x1b[38;2;${r};${g};${b}m`;

        let phoneNumber;
        if (idFormat === "PN") {
           phoneNumber = conn.user.jid;
        } else {
           phoneNumber = await (await conn?.signalRepository?.lidMapping?.getPNForLID(m.sender)?.catch(() => m.sender))?.replace(/:\d+@/, '@');
        };

        // 🔥 FINAL OUTPUT: time reset, user+pesan warna HEX ANSI
        console.log(`[${time}] ${colorANSI}${user}: ${pesan}${reset}\n`);
        conn.logger.debug(` ~> ${subject ? subject : ""}`);
        conn.logger.debug(` ~> ${chatContext} - ${phoneNumber.split("@")[0]} - ${idFormat}`);
}

// Hot reload watcher
const __filename = fileURLToPath(import.meta.url)

fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename)
  console.log("\x1b[91mUpdate 'lib/print.js'\x1b[0m")
})