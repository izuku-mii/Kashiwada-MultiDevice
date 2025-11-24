// 🔥® Rin-Okumura™ 🔥
// 👿 Creator: Dxyz
// ⚡ Plugin: remini-tools.mjs

import fs from 'fs';
import path from 'path';
import axios from 'axios';

let handler = async (m, {
    conn
}) => {
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || ''
    if (!/image/.test(mime)) return m.reply(' *[ ! ]* Kirim Gambar/Reply Mau Di Hdkan');
    try {
        const download = await quoted.download();
        const tmpDir = './tmp';
        const filePath = path.join(process.cwd() + `/tmp/image-${Date.now()}.jpg`);
        
        if (!fs.existsSync(tmpDir)) {
           fs.mkdirSync(tmpDir);
        }

        fs.writeFileSync(filePath, download);
        console.log(`File ${filePath} dibuat.`);
        const url = await upscale(filePath);
        const buffer = await (await axios.get(url.result.imageUrl, {
            responseType: 'arraybuffer'
        }).catch(e => e.response)).data;
        let caption = `📁Remini Photo
> • Size: ${url.result.size || ''}`;
        conn.sendMessage(
            m.chat, {
                image: Buffer.from(buffer),
                caption
            });
    } catch (e) {
        conn.reply('❌Maaf Error Mungkin Kebanyakan Request Mungkin');
        console.error('Error:', e);
    }
};

// ambil di npm nya @vioo/apis 
// izin ya bg
async function upscale(filePath) {
    const buffer = fs.readFileSync(filePath)
    const ext = path.extname(filePath).slice(1) || 'bin'
    const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream'
    const fileName = Math.random().toString(36).slice(2, 8) + '.' + ext

    const {
        data
    } = await axios.post("https://pxpic.com/getSignedUrl", {
        folder: "uploads",
        fileName
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    })

    await axios.put(data.presignedUrl, buffer, {
        headers: {
            "Content-Type": mime
        }
    })
    const url = "https://files.fotoenhancer.com/uploads/" + fileName

    const api = await (await axios.post("https://pxpic.com/callAiFunction", new URLSearchParams({
        imageUrl: url,
        targetFormat: 'png',
        needCompress: 'no',
        imageQuality: '100',
        compressLevel: '6',
        fileOriginalExtension: 'png',
        aiFunction: 'upscale',
        upscalingLevel: ''
    }).toString(), {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept-language': 'id-ID'
        }
    }).catch(e => e.response)).data;

    const formatSize = size => {
        function round(value, precision) {
            var multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        }
        var kiloByte = 1024;
        var megaByte = kiloByte * kiloByte;
        var gigaByte = kiloByte * megaByte;
        var teraByte = kiloByte * gigaByte;
        if (size < kiloByte) {
            return size + "B";
        } else if (size < megaByte) {
            return round(size / kiloByte, 1) + "KB";
        } else if (size < gigaByte) {
            return round(size / megaByte, 1) + "MB";
        } else if (size < teraByte) {
            return round(size / gigaByte, 1) + "GB";
        } else {
            return round(size / teraByte, 1) + "TB";
        }
    };

    const buffersize = await (await axios.get(api.resultImageUrl, {
        responseType: 'arraybuffer'
    }).catch(e => e.response)).data;
    const size = await formatSize(buffersize.length);
    return {
        status: 200,
        success: true,
        result: {
            size,
            imageUrl: api.resultImageUrl
        }
    }
    fs.unlinkSync(filePath)
}

handler.help = ['remini', 'hdr', 'hd'].map(v => v + ' *[ Kirim Gambar/Reply Gambar ]* ');
handler.tags = ['tools'];
handler.command = /^(remini|hdr|hd)$/i;
handler.loading = true;

export default handler
