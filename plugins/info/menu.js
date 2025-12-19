import os from "node:os";
import fs from "node:fs";
import path from 'path';
import {
    fileURLToPath
} from 'url';
let num = "13135550002@s.whatsapp.net";
import convert from "@library/toAll.js";
import axios from "axios";

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
                    .map((helpItem, index) => `     ⧉ ${usedPrefix + helpItem}`)
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

⧉ *Main Menu:* \`.menu all\`  
⧉ *Feature List:* \`.menu list\`  
⧉ *Contact Creator:* \`.owner\``;

    const teksdx = `> _*Thank you for using ${botInfo.name}!*_`;

    const userInfoSection = `
〆 ━━━[INFO USER]━━━〆
     ⧉ Name: ${user.name}  
     ⧉ Number: ${user.number}  
     ⧉ Limit: ${user.limit}  
     ⧉ Status: ${user.status}  
〆 ━━━━━━━━━━━━━〆
`;

    // === Menu ===
    async function sendAudioFallback() {
        try {
            const {
                data: bufferAu
            } = await axios.get(global?.audioUrl, {
                responseType: "arraybuffer"
            });
            await sendWhatsAppVoice(conn, m.chat, bufferAu, {
                contextInfo: {
                    mentionedJid: [m.sender]
                },
                quoted: floc
            })
        } catch (err) {
            console.error("⚠️ Audio fetch failed:", err.message);
        }
    }

    if (text === "all") {
        await conn.delay(2000);
        const allCommands = getPluginsByTags();

        const caption = `${demonSlayerHeader}${readmore}

${getVpsSpecs()}
${userInfoSection}
${allCommands}

${teksdx}`;

        await menuBut(m, conn, caption, {
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });
        await sendAudioFallback();
    } else if (text === "list") {
        const allTags = [];
        Object.values(plugins).forEach(plugin => {
            if (!plugin.disabled && plugin.tags) plugin.tags.forEach(tag => {
                if (tag && !allTags.includes(tag.toLowerCase())) allTags.push(tag.toLowerCase());
            });
        });

        const tagsList = allTags.map(tag => `     ⧉ ${tag.charAt(0).toUpperCase() + tag.slice(1)}`).join('\n');

        const caption = `${demonSlayerHeader}${readmore}

〆 ━━━[MENU TAGS]━━━〆
${tagsList}
〆 ━━━━━━━━━━━━━〆
        
${teksdx}`;

        await menuBut(m, conn, caption, {
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });
        await sendAudioFallback();
    } else if (text) {
        await conn.delay(2000);
        const tags = text.split(/[,\s]+/).filter(t => t);
        const filteredCommands = getPluginsByTags(tags);

        const caption = `${demonSlayerHeader}${readmore}

${getVpsSpecs()}
${userInfoSection}
${filteredCommands}

${teksdx}`;

        await menuBut(m, conn, caption, {
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });
        await sendAudioFallback();
    } else {
        const caption = `${demonSlayerHeader}${readmore}\n\n${getVpsSpecs()}\n${userInfoSection}\n${teksdx}`;

        await menuBut(m, conn, caption, {
            contextInfo: {
                mentionedJid: [m.sender]
            }
        });
        await sendAudioFallback();
    }
};

handler.help = [];
handler.command = ["menu", "rinmenu"];
handler.tags = ["run"];

const menuBut = async (m, conn, text, options = {}) => {
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
        bottom_sheet: {
            in_thread_buttons_limit: 2,
            divider_indices: [1, 2, 3, 4, 5, 999],
            list_title: "⧉ 𝐒𝐇𝐄┃𝐇𝐄𝐑",
            button_title: "𖤍"
        },
    };


    await conn.sendButton(
        m.chat, {
            product: {
                productImage: fs.readFileSync("./media/thumbnail.jpg"),
                productId: '0',
                title: global?.botname,
                description: `By: ${global?.ownername}`,
                currencyCode: '0',
                priceAmount1000: '0',
                retailerId: global?.ownername,
                url: global?.web,
                productImageCount: 1
            },
            businessOwnerJid: global?.owner[0] + "@s.whatsapp.net",
            caption: text,
            footer: global?.botname,
            buttons: [
                {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        has_multiple_buttons: true
                    })
                },
                {
                    name: "call_permission_request",
                    buttonParamsJson: JSON.stringify({
                        has_multiple_buttons: true
                    })
                },
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '⧉ ꜰᴏʟʟᴏᴡ ᴍʏ ᴄʜᴀɴɴᴇʟ !',
                        url: global.linkch || "https://whatsapp.com/channel/0029Vb67i65Fi8xX7rOtIc2S"
                    })
                },
                {
                name: 'open_webview',
                buttonParamsJson: JSON.stringify({
                    title: '⧉ ᴊᴏɪɴ ᴍʏ ɢʀᴏᴜᴘ !',
                    link: {
                        in_app_webview: true, // or false
                        url: 'https://chat.whatsapp.com/IAL24adNQhD2jkhlvCvx0T?mode=hqrc'
                    }
                })
            },
                {
                name: "cta_call",
                buttonParamsJson: JSON.stringify({
                    display_text: "⧉ ᴄᴀʟʟ ᴍᴇ !",
                    phone_number: "6283143694217"
                })
              },
              {
                name: "cta_copy",
                buttonParamsJson: JSON.stringify({
                    display_text: "⧉ ᴄʟɪᴄᴋ ᴍᴇ !",
                    id: "123456789",              
                    copy_code: "KONTOL"
                })
             },
             {
                name: 'cta_catalog',
                buttonParamsJson: JSON.stringify({
                    business_phone_number: '6285861898415'
                })
            },
            {
                name: 'cta_reminder',
                buttonParamsJson: JSON.stringify({
                    display_text: 'Hehe'
                })
            },
            ],
            hasMediaAttachment: false, // or true
            messageJson: category,
            ...options
        }, {
            ...options,
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
async function sendWhatsAppVoice(conn, chatId, inputBuffer, options = {}) {
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
            ...options
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
     ⧉ Model: ${cpuModel}
     ⧉ Total RAM: ${totalMem} GB
     ⧉ Free RAM: ${freeMem} GB
     ⧉ Speed: ${cpuSpeed} MHz
     ⧉ Cores: ${cpuCores}
〆 ━━━━━━━━━━━━━〆`.trim();
}

export default handler;
