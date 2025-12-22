import cheerio from 'cheerio';
import axios from 'axios';

export default async function oota(m, {
    conn,
    args
}) {
    try {
        let link = args[0] || "";
        if (!/www.mediafire.com/.test(link)) return m.reply("⚠️ Masukan Link MediaFire!");

        const f = await fetch(link, {
            headers: {
                'accept-encoding': 'gzip, deflate, br, zstd',
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
            }
        })

        if (!f.ok) return m.reply('❌Terjadi kesalahan pada situs web.')

        const t = await f.text()
        const $ = cheerio.load(t)
        const url = $('.input.popsok').attr('href')

        if (!url || !/\/\/download\d+\.mediafire\.com\//.test(url)) return m.reply('❌Gagal Link Mf Buat Download Gada!')

        const [name, date, size, type] = [
            $('.intro .filename').text(),
            $('.details li:nth-child(2) span').text(),
            $('.details li:nth-child(1) span').text(),
            $('.intro .filetype').text()
        ]

        const cont = {
            'af': 'Africa',
            'an': 'Antarctica',
            'as': 'Asia',
            'eu': 'Europe',
            'na': 'North America',
            'oc': 'Oceania',
            'sa': 'South America'
        }

        const $lo = $('.DLExtraInfo-uploadLocation')

        const [continent, location, flag] = [
            $lo.find('.DLExtraInfo-uploadLocationRegion').attr('data-lazyclass').replace('continent-', ''),
            $lo.find('.DLExtraInfo-sectionDetails p').text().match(/from (.*?) on/)?.[1],
            $lo.find('.flag').attr('data-lazyclass').replace('flag-', '')
        ]

        const {
            data
        } = await axios.get(url, {
            responseType: "arraybuffer"
        });
        const {
            mime
        } = await conn.getFile(data);

        let caption = ` -(☘️MediaFire Download☘️)-
 *-(Name)-:* ${name}
 *-(Size)-:* ${size}
 *-(Continent)-:* ${cont[continent] || 'Unkown'}
 *-(Mimetype)-:* ${mime}
 *-(Location)-:* ${location}
 *-(Flag)-:* ${flag}
 *-(Url_Dl)-:* ${url}`;

        await conn.sendMessage(m.chat, {
            document: data,
            mimetype: mime,
            fileName: name,
            caption,
        }, {
            quoted: m
        });
    } catch (e) {
        m.reply("❌Gomene Error Mungkin lu kebanyakan request");
        console.error({
            status: false,
            msg: e.message
        })
    }
}

oota.help = oota.command = ["mediafire", "mediafire", "mf", "mfdl"];
oota.tags = ["downloader"];
