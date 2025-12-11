import os from "node:os";
import fs from "node:fs";
import path from 'path';
import {
    fileURLToPath
} from 'url';
let num = "13135550002@s.whatsapp.net";
import but from "baileys_helper";
import convert from "@library/toAll.js";
import axios from "axios";
const { prepareWAMessageMedia } = await  import("@adiwajshing/baileys");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pluginFolder = path.join(__dirname, '../plugins');
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

let handler = async (m, {
    conn,
    text,
    isROwner,
    usedPrefix,
    command
}) => {

    async function loadPlugins() {
        const fileAll = Object.keys(pg.plugins);

        const pluginFile = []
        for (let fold of fileAll) {
            if (!fold.endsWith('.js')) continue
            const plu = pg.plugins[fold]
            pluginFile.push(plu)
        }

        return pluginFile
    };

    const plugins = await loadPlugins();

    const url = await conn.profilePictureUrl(num, 'image');
    const res = await fetch(url);
    const metre = Buffer.from(await res.arrayBuffer());
    const resize = await conn.resize(metre, 200, 200);
    
    const floc = {
        key: {
            participant: num,
            ...(m.chat ? {
                remoteJid: 'status@broadcast'
            } : {})
        },
        message: {
            locationMessage: {
                name: botname,
                jpegThumbnail: resize
            }
        }
    };

    function getPluginsByTags(selectedTags = []) {
        const tagCount = {};
        const tagHelpMapping = {};
        const selectedTagsLower = selectedTags.map(tag => tag.toLowerCase());

        Object.keys(plugins)
            .filter(pluginName => !plugins[pluginName].disabled)
            .forEach(pluginName => {
                const plugin = plugins[pluginName];
                const tagsArray = Array.isArray(plugin.tags) ? plugin.tags : [];
                const helpArray = Array.isArray(plugin.help) ? plugin.help : [plugin.help];

                tagsArray.forEach(tag => {
                    if (!tag) return;
                    const tagLower = tag.toLowerCase();
                    if (selectedTags.length > 0 && !selectedTagsLower.includes(tagLower)) return;

                    if (tagCount[tag]) {
                        tagCount[tag]++;
                        tagHelpMapping[tag].push(...helpArray);
                    } else {
                        tagCount[tag] = 1;
                        tagHelpMapping[tag] = [...helpArray];
                    }
                });
            });

        if (!Object.keys(tagCount).length) return "No plugins found with the specified tags.";

        return Object.keys(tagCount)
            .map(tag => {
                const helpList = tagHelpMapping[tag]
                    .map((helpItem, index) => `     々 ${usedPrefix + helpItem}`)
                    .join("\n");

                return `〆 ━━━[${tag.toUpperCase()}]━━━〆
${helpList}  
〆 ━━━━━━━━━━━━━〆`;
            })
            .join("\n\n");
    }

    // === Info User & Bot ===
    const jidsen = await (await conn?.signalRepository?.lidMapping?.getPNForLID(m.sender).catch(() => null))?.replace(/:\d+@/, '@')
    const user = {
        name: m.pushName || 'User',
        number: (jidsen || '').split('@')[0] || '62xxx-xxx-xxx',
        limit: db.data.users[m.sender]?.limit || 0,
        status: isROwner ? 'Pemilik' : 'Orang Bisaa'
    };

    const botNumber = Array.isArray(global.owner) ? global.owner[0] : typeof global.owner === 'string' ? global.owner : '62xxx-xxx-xxx';
    const cleanBotNumber = botNumber.replace('@s.whatsapp.net', '').split('@')[0];

    const botInfo = {
        name: global.botname || 'rin-okumura-bot',
        number: cleanBotNumber
    };

    const demonSlayerHeader = `*Hello there 👋*  
I'm *${global.botname}*, a WhatsApp bot created by *${global.ownername}*.

This bot can be used for *educational purposes*, *media downloads*, *games*, *group moderation*, and *many other features*.

➤ *Main Menu:* \`.menu all\`  
➤ *Feature List:* \`.menu list\`  
➤ *Contact Creator:* \`.owner\``;

    const teksdx = `_*Thank you for using ${botInfo.name}!*_`;

    const userInfoSection = `
〆 ━━━[INFO USER]━━━〆
     々 Name: ${user.name}  
     々 Number: ${user.number}  
     々 Limit: ${user.limit}  
     々 Status: ${user.status}  
〆 ━━━━━━━━━━━━━〆
`;

    // === Menu ===
    async function sendAudioFallback() {
        try {
            const { data: bufferAu } = await axios.get(global?.audioUrl, { responseType: "arraybuffer" });
            await sendWhatsAppVoice(conn, m.chat, bufferAu)
        } catch (err) {
            console.error("⚠️ Audio fetch failed:", err.message);
        }
    }

    if (text === "all") {
        await conn.delay(2000);
        const allCommands = getPluginsByTags();

        const caption = `${demonSlayerHeader}

${getVpsSpecs()}
${userInfoSection}
${allCommands}

${teksdx}`;

        await menuBut(m, conn, caption);
        await sendAudioFallback();
    } else if (text === "list") {
        const allTags = [];
        Object.values(plugins).forEach(plugin => {
            if (!plugin.disabled && plugin.tags) plugin.tags.forEach(tag => {
                if (tag && !allTags.includes(tag.toLowerCase())) allTags.push(tag.toLowerCase());
            });
        });

        const tagsList = allTags.map(tag => `     々 ${tag.charAt(0).toUpperCase() + tag.slice(1)}`).join('\n');

        const caption = `${demonSlayerHeader}

〆 ━━━[MENU TAGS]━━━〆
${tagsList}
〆 ━━━━━━━━━━━━━〆
        
${teksdx}`;

        await menuBut(m, conn, caption);
        await sendAudioFallback();
    } else if (text) {
        await conn.delay(2000);
        const tags = text.split(/[,\s]+/).filter(t => t);
        const filteredCommands = getPluginsByTags(tags);

        const caption = `${demonSlayerHeader}

${getVpsSpecs()}
${userInfoSection}
${filteredCommands}

${teksdx}`;

        await menuBut(m, conn, caption);
        await sendAudioFallback();
    } else {
        const caption = `${demonSlayerHeader}\n\n${getVpsSpecs()}\n${userInfoSection}\n${teksdx}`;

        await menuBut(m, conn, caption);
        await sendAudioFallback();
    }
};

handler.help = [];
handler.command = ["menu", "rinmenu"];
handler.tags = ["run"];

const menuBut = async (m, conn, text) => {
    const url = await conn.profilePictureUrl(num, 'image');
    const res = await fetch(url);
    const metre = Buffer.from(await res.arrayBuffer());
    const resize = await conn.resize(metre, 200, 200);
    
    const floc = {
        key: {
            participant: num,
            ...(m.chat ? {
                remoteJid: 'status@broadcast'
            } : {})
        },
        message: {
            locationMessage: {
                name: botname,
                jpegThumbnail: resize
            }
        }
    };

    const category = {
        limited_time_offer: {
            text: global?.botname,
            url: "https://t.me/izuku-mii",
            copy_code: global?.ownername,
            expiration_time: Date.now() * 999
        },
        tap_target_configuration: {
            title: "▸ X ◂",
            description: "bomboclard",
            canonical_url: "https://t.me/izuku-mii",
            domain: global?.web,
            button_index: 0
        },
        product_category: {
            surface: 1,
            category_id: "cat_1437",
            biz_jid: "0@s.whatsapp.net",
            title: global?.botname,
            description: "Hmmm, Ntah",
            button_label: "Lihat Produk"
        }
    };

    const header = {
        ...(await prepareWAMessageMedia({
            image: fs.readFileSync('./media/thumbnail.jpg')
        }, {
            upload: conn.waUploadToServer
        })),
        hasMediaAttachment: false
    };

    await but.sendInteractiveMessage(conn, m.chat, {
        interactiveMessage: {
            nativeFlowMessage: {
                messageParamsJson: JSON.stringify(category),
                buttons: [{
                    /*name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: 'FOLLOW MY CHANNEL!',
                        url: global.linkch || "https://whatsapp.com/channel/0029VbAQBR6CxoAow9hLZ13Z"
                    })*/
                }],
            },
            header: header,
            body: {
                text: text
            },
            contextInfo: {
               mentionedJid: [m.sender]
            },
        }
    }, {
        quoted: floc
    });
}

/**
 * Convert audio buffer ke WhatsApp voice note + waveform
 */
async function toWhatsAppVoice(inputBuffer) {
    const audioBuffer = await convert.toVN(inputBuffer)
    const waveform = await convert.generateWaveform(audioBuffer)
    return {
        audio: audioBuffer,
        waveform
    }
}

/**
 * Kirim WhatsApp PTT dan auto-play
 */
async function sendWhatsAppVoice(conn, chatId, inputBuffer, options = {}, options2 = {}) {
    try {
        const {
            audio,
            waveform
        } = await toWhatsAppVoice(inputBuffer)

        // Kirim ke WhatsApp
        await conn.sendMessage(chatId, {
            audio: audio,
            waveform: waveform,
            mimetype: "audio/ogg; codecs=opus",
            ptt: true,
            ...options,
        }, {
            ...options2
        })

    } catch (err) {
        console.error("Failed to send voice:", err)
    }
}

// === Styles Function ===
function Styles(text, style = 1) {
    const xStr = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
    const yStr = Object.freeze({
        1: "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890",
    });
    const replacer = xStr.map((v, i) => ({
        original: v,
        convert: yStr[style].split("")[i]
    }));
    return text.toLowerCase().split("").map(v => replacer.find(x => x.original == v)?.convert || v).join("");
}

function getVpsSpecs() {
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
  const cpu = os.cpus()[0];
  const cpuModel = cpu.model;
  const cpuSpeed = cpu.speed;
  const cpuCores = os.cpus().length;

  return `\n〆 ━━━[INFO USER]━━━〆
     々 Model: ${cpuModel}
     々 Total RAM: ${totalMem} GB
     々 Free RAM: ${freeMem} GB
     々 Speed: ${cpuSpeed} MHz
     々 Cores: ${cpuCores}
〆 ━━━━━━━━━━━━━〆`.trim();
}

export default handler;
