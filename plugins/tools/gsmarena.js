import axios from "axios";
import * as cheerio from "cheerio";
import but from "baileys_helper";

const base = 'https://m.gsmarena.com'

const ins = axios.create({
    baseURL: base,
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Origin': base,
        'Referer': base + '/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 16; Pixel 10 Fold Build/BP1A.251105.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/136.0.0.0 Mobile Safari/537.36',
        'Cookie': 'sSiteVersion=mobile'
    }
})

async function search(input) {
    try {
        const response = await ins.get('/results.php3', {
            params: {
                'sQuickSearch': 'yes',
                'sName': input
            }
        })

        const $ = cheerio.load(response.data);

        const devices = [];
        $('.general-menu ul li').each((_, li) => {
            const anchor = $(li).find('a');
            const img = anchor.find('img');
            const name = anchor.find('strong').html().replace(/<br\s*\/?>/gi, ' ');

            devices.push({
                url: 'https://m.gsmarena.com/' + anchor.attr('href'),
                image: img.attr('src'),
                name: name.trim(),
            });
        });

        return devices
    } catch (e) {
        throw e
    }
}

async function detail(url) {
    try {
        let response = await ins.get(url)
        const $ = cheerio.load(response.data);

        const processTable = (table) => {
            const sectionName = $(table).find('th').first().text().trim()
                .toLowerCase()
                .replace(' ', '_')
            const details = {};

            $(table).find('tr').each((_, row) => {
                const key = $(row).find('.ttl').text().trim()
                    .toLowerCase()
                    .replace(' ', '_')
                    .replace(/\./gi, '_')
                    .replace(/(\(|\))/gi, '');
                let value = $(row).find('.nfo').html();

                if (value) {
                    value = value
                        .replace(/<br\s*\/?>/gi, ' ')
                        .replace(/<sup>|<\/sup>/gi, '')
                        .replace(/<a[^>]*>/gi, '')
                        .replace(/<\/a>/gi, '')
                        .replace(/<div[^>]*>/gi, '')
                        .replace(/<\/div>/gi, '')
                        .replace(/\&nbsp\; /g, ' ')
                        .replace(/ \&nbsp\;/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();
                }

                if (key && value) {
                    details[key] = value;
                }
            });

            return {
                sectionName,
                details
            };
        };

        const specs = {};
        $('table').each((_, table) => {
            const {
                sectionName,
                details
            } = processTable(table);
            if (!sectionName) return
            specs[sectionName] = details;
        });
        const rankid = $('div[id="ranks-list"]');

        const result = {
            url: url,
            main: {
                title: $('h1.section.nobor').text(),
                image: $('div.specs-cp-pic-rating').find('img').attr('src'),
                release: $('span[data-spec="released-hl"]').text(),
                thickness: $('span[data-spec="body-hl"]').text(),
                os: $('span[data-spec="os-hl"]').text(),
                storage: $('span[data-spec="storage-hl"]').text(),
                popularity: rankid.find('span[id="popularity-vote"] strong').text().trim(),
                hits: rankid.find('span[id="popularity-vote"]').text().split('%')[1].trim(),
                fans: rankid.find('span[id="fan-vote"] strong').text().trim(),
            },
            ...specs
        }

        return result
    } catch (e) {
        throw e
    }
}

let oota = async (m, {
    conn,
    text,
    usedPrefix,
    command
}) => {
    try {
        if (!text) return m.reply("⚠️ Masukan Link / Query!");
        if (/gsmarena/.test(text)) {
            const resp = await detail(text)

            const caption = `
〆 ━━━[INFO SMARTPHONE]━━━〆
     々 Title: ${resp?.main?.title || "'"}
     々 Release: ${resp?.main?.release || "'"}
     々 OS: ${resp?.main?.os || "'"}
     々 Storage: ${resp?.main?.storage || "'"}
     々 Popularity: ${resp?.main?.popularity || "'"}
     々 Hits: ${resp?.main?.hits || "'"}
     々 Fans: ${resp?.main?.fans || "'"}

     々 Network: ${resp?.network?.technology || "'"}
     々 2G: ${resp?.network?.["2g_bands"] || "'"}
     々 3G: ${resp?.network?.["3g_bands"] || "'"}
     々 4G: ${resp?.network?.["4g_bands"] || "'"}

     々 Dimensions: ${resp?.body?.dimensions || "'"}
     々 Weight: ${resp?.body?.weight || "'"}
     々 Build: ${resp?.body?.build || "'"}
     々 SIM: ${resp?.body?.sim || "'"}

     々 Display: ${resp?.display?.type || "'"}
     々 Size: ${resp?.display?.size || "'"}
     々 Resolution: ${resp?.display?.resolution || "'"}

     々 Chipset: ${resp?.platform?.chipset || "'"}
     々 CPU: ${resp?.platform?.cpu || "'"}
     々 GPU: ${resp?.platform?.gpu || "'"}

     々 Memory: ${resp?.memory?.internal || "'"}
     々 Card Slot: ${resp?.memory?.card_slot || "'"}

     々 Main Camera: ${resp?.main_camera?.single || "'"}
     々 Features: ${resp?.main_camera?.features || "'"}
     々 Video: ${resp?.main_camera?.video || "'"}

     々 Selfie: ${resp?.selfie_camera?.single || "'"}
     々 Selfie Video: ${resp?.selfie_camera?.video || "'"}

     々 Speaker: ${resp?.sound?.loudspeaker || "'"}
     々 Jack: ${resp?.sound?.["3_5mm_jack"] || "'"}

     々 WiFi: ${resp?.comms?.wlan || "'"}
     々 Bluetooth: ${resp?.comms?.bluetooth || "'"}
     々 GPS: ${resp?.comms?.positioning || "'"}
     々 NFC: ${resp?.comms?.nfc || "'"}
     々 Infrared: ${resp?.comms?.infrared_port || "'"}
     々 Radio: ${resp?.comms?.radio || "'"}
     々 USB: ${resp?.comms?.usb || "'"}

     々 Sensors: ${resp?.features?.sensors || "'"}

     々 Battery: ${resp?.battery?.type || "'"}
     々 Charging: ${resp?.battery?.charging || "'"}

     々 Colors: ${resp?.misc?.colors || "'"}
     々 Models: ${resp?.misc?.models || "'"}
     々 Price: ${resp?.misc?.price || "'"}
〆 ━━━━━━━━━━━━━〆
`;

            conn.sendMessage(m.chat, {
                image: {
                    url: resp?.main?.image
                },
                caption
            }, {
                quoted: m
            });
        } else {

            const searchSmart = await search(text);
            const sections = [{
                title: "📱Pilih SmartPhone!",
                highlight_label: `Total ${searchSmart.length} SmartPhone`,
                rows: searchSmart.map((x, i) => ({
                    header: `#${i + 1}`,
                    title: `${x.name}`,
                    description: `${x.url}`,
                    id: `${usedPrefix + command} ${x.url}`,
                })),
            }];

            await but.sendInteractiveMessage(conn,
                m.chat, {
                    text: "Pilih Di Sini!",
                    footer: "Cari SmartPhone",
                    interactiveButtons: [{
                        name: "single_select",
                        buttonParamsJson: JSON.stringify({
                            title: "📱Pilih SmartPhone!",
                            sections,
                        }),
                    }, ],
                }, {
                    quoted: m
                }
            );
        }
    } catch (e) {
        m.reply(" ❌ Gomene Error Mungkin lu kebanyakan request");
        console.error(e);
    };
};

oota.help = oota.command = ["gsmarena", "ssp", "gs", "searchsmartphone"];
oota.tags = ["search"];

export default oota;
