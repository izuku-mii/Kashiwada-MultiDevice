import axios from 'axios';
import bu from '@library/sticker.js';

let izuku = async (m, {
    conn,
    text
}) => {
    if (!text) throw ' *[ ! ]* Masukan Teks Nya !'
    return new Promise(async (revolse, reject) => {
        await axios.get(
            `https://izukumii-brat.hf.space/api`, {
                params: {
                    text: text
                },
                responseType: 'arraybuffer'
            }).then(async (response) => {
            const sticker = await bu.writeExif({ data: response.data }, { packName: `- Project ${botname} || Owner By: ${ownername} -` });
            await conn.sendMessage(m.chat, { sticker }, { quoted: m });
        }).catch((err) => {
            reject({
                msg: ' *[ ! ]* Maaf Mungkin Lu Kebanyakan Request'
            });
            console.error('Error', err)
        })
    })
}

izuku.limit = true;
izuku.loading = true;

izuku.help = ['brat', 'bratgenerator'];
izuku.command = /^(brat|bratgenerator)$/i;
izuku.tags = ['sticker'];

export default izuku;
