/** ═══[ 🎵 Fitur Ocr 🎧 ]═══ **
 *  ✍️ Author: [ Dxyz ]
 *  📌 Type: [ Esm ]
 *  🤖 NameBot: [ Rin Okumura ⚡ ]
 *  👨‍💻 Source Scrape: [ https://whatsapp.com/channel/0029VbANq6v0VycMue9vPs3u/162 ]
 *  🔗 Link_Channel: [ https://whatsapp.com/channel/0029Vb6Q4eA1Hsq5qeBu0G1z ]
**/

/**
    @ ✨ Scrape DocsBot Image Tools (OCR, To Prompt, To Description, To Caption)
    @ Base: https://docsbot.ai/tools/
**/

import axios from 'axios';
import ua from 'user-agents';

let handler = async (m, { conn }) => {
    const quoted = m.quoted ? m.quoted : m;
    let mime = quoted.msg.mimetype || quoted.mimetype || ''
    if (!/image/.test(mime)) throw '  *[ ! ]* Maaf Anda Kirim Foto/Reply Foto Buat Ocr';
    const buffer = await quoted.download();
    await docsbot(buffer, {
        type: 'ocr'
    }).then(async (response) => {
        await conn.reply(m.chat, response, m);
    }).catch(async (error) => {
        await m.reply(' *[ ! ]* Maaf Mungkin Lu Kebanyakan Request');
        await console.log('Msg', error);
    });
};

async function docsbot(buffer, {
    type = 'ocr',
    vibe = 'fun'
} = {}) {
    const vibeList = ['fun', 'joke', 'funny', 'happy', 'serious', 'sad', 'angry', 'ecstatic', 'curious', 'informative', 'cute', 'cool', 'controversial'];
    const typeList = ['ocr', 'toprompt', 'todesc', 'tocaption'];

    if (!type || !typeList.includes(type)) throw new Error(`List available type: ${typeList.join(', ')}`);
    if (!buffer || !Buffer.isBuffer(buffer)) throw new Error('Image buffer is required');
    if (type === 'tocaption' && !vibeList.includes(vibe)) throw new Error(`List available vibe: ${vibeList.join(', ')}`);

    const {
        data
    } = await axios.post(`https://docsbot.ai/api/tools/image-prompter`, {
        image: buffer.toString('base64'),
        type: type === 'toprompt' ? 'prompt' : type === 'todesc' ? 'description' : type === 'ocr' ? 'text' : 'caption',
        ...(type === 'tocaption' && {
            vibe
        })
    }, {
        headers: {
            'content-type': 'application/json',
            'user-agent': (new ua()).toString()
        }
    }).catch(error => {
        throw new Error('No result found')
    });

    return data;
}

handler.help = ['ocr', 'copyimagetext'];
handler.tags = ['tools'];
handler.command = /^(ocr|copyimagetext)$/i
handler.limit = true;

export default handler;
