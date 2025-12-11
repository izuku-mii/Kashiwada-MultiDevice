import sharp from "sharp";
import {
    PDFDocument
} from "pdf-lib";
import api from "@izumi/api";

let oota = async (m, {
    conn,
    usedPrefix,
    text,
    command
}) => {
    try {
         const { result: komiklast } = await (await api.get('/manga/komiku-latest')).data
        const cap = `⚠️ Cari Manga Favorit Lu Contoh: .komiku Kagurabachi / link manga

⟢━⟣ 📚 Manga Terbaru Komiku ⟢━⟣
📅 Update terbaru oleh ${global.botname}

${komiklast?.slice(0, 5).map(x => `〆 ${x?.title}\n々 Chapter  ${x?.chapter}\n🔗 ${x?.url}`).join("\n\n")}

⟢━━━━━━━━━━━━━━⟣
🌀 Sumber: komiku.id`

        if (!text) return m.reply(cap);
        if (/^https?:\/\/(www\.)?komiku\.id\/manga\/[a-zA-Z0-9-_]+/i.test(text)) {
            const resp = await api.get(`/manga/komiku-detail?url=${encodeURIComponent(text)}`);
            const {
                result: hasil
            } = await resp.data;

            const meta = hasil.metadata;
            const chapters = hasil.chapter;

            let caption = `╭─❖『 *${meta.judul_komik || "Tanpa Judul"}* 』\n`;
            caption += `│ 🏷️ *Judul Indonesia*: ${meta.judul_indonesia || "-"}\n`;
            caption += `│ 📚 *Jenis*: ${meta.jenis_komik || "-"}\n`;
            caption += `│ 💞 *Genre*: ${meta.konsep_cerita || "-"}\n`;
            caption += `│ ✍️ *Pengarang*: ${meta.pengarang || "-"}\n`;
            caption += `│ 🔖 *Status*: ${meta.status || "-"}\n`;
            caption += `│ 👤 *Umur Pembaca*: ${meta.umur_pembaca || "-"}\n`;
            caption += `│ 📖 *Cara Baca*: ${meta.cara_baca || "-"}\n`;
            caption += `╰──────────────────❖\n\n`;
            caption += `📖 *Sinopsis*:\n${meta.sinopsis?.trim() || "-"}\n`;

            const sections = [{
                title: "📖 Daftar Chapter",
                highlight_label: `Total ${chapters.length} chapter`,
                rows: chapters.map((x, i) => ({
                    header: `#${i + 1}`,
                    title: `${x.chapter} (${x.reader})`,
                    description: `Rilis: ${x.released}`,
                    id: `${usedPrefix + command} ${x.url}`,
                })),
            }];

            await conn.sendButton(m.chat, {
                image: {
                    url: meta.thumbnail
                },
                footer: `© Project: ${global?.botname} || by: ${global?.ownername}`,
                caption,
                buttons: [{
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: "📂 Pilih Chapter",
                        sections,
                    }),
                }, ],
            }, {
                quoted: m
            });
        } else if (/^https?:\/\/(www\.)?komiku\.id\//i.test(text)) {
            const resp = await api.get(`/manga/komiku-chapter?url=${encodeURIComponent(text)}`);
            const {
                result: komikuch
            } = await resp.data;

            const pdfDoc = await PDFDocument.create();

            for (const img of komikuch?.images || []) {
                const res = await fetch(img.url);
                const buffer = await res.arrayBuffer();
                const pngBuffer = await sharp(Buffer.from(buffer)).png().toBuffer();

                const image = await pdfDoc.embedPng(pngBuffer);
                const page = pdfDoc.addPage([image.width, image.height]);
                page.drawImage(image, {
                    x: 0,
                    y: 0,
                    width: image.width,
                    height: image.height
                });
            }

            const pdfBytes = await pdfDoc.save();
            await conn.sendMessage(m.chat, {
                document: Buffer.from(pdfBytes),
                mimetype: "application/pdf",
                fileName: `${komikuch?.judul || "komiku"}.pdf`,
            }, {
                quoted: m
            });
        } else {
            const resp = await fetch(`${global?.apikey?.izumi}/manga/komiku-search?query=${encodeURIComponent(text)}`);
            const {
                result: komikuse
            } = await resp.json();

            let caption = `╭─❖『 *Hasil Pencarian Komiku* 』\n`;
            caption += komikuse
                .map(
                    (x, i) =>
                    `│ ${i + 1}. *${x?.title || "Tanpa Judul"}*\n` +
                    `│ 📚 ${x?.chapter?.awal || "-"} ➜ ${x?.chapter?.akhir || "-"}\n` +
                    `│ 🔗 ${x?.url || "-"}`
                )
                .join(`\n│───────────────────────\n`);
            caption += `\n╰──────────────────❖`;
            const sections = [{
                title: "📖 Daftar Chapter",
                rows: komikuse.map((x, i) => ({
                    title: `(${i + 1}). ${x?.title || ''}`,
                    description: `${x?.chapter?.awal || "-"} ➜ ${x?.chapter?.akhir || "-"}`,
                    id: `${usedPrefix + command} ${x?.url}`,
                })),
            }];

            await conn.sendButton(m.chat, {
                footer: `© Project: ${global?.botname} || by: ${global?.ownername}`,
                text: caption,
                buttons: [{
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                        title: "📂 Pilih Chapter",
                        sections,
                    }),
                }, ],
            }, {
                quoted: m
            });
        };
    } catch (e) {
        m.reply('❌ Maaf Error Mungkin lu kebanyakan request');
        console.error(e);
    };
};

oota.help = ["komiku", "komikuid"];
oota.command = /^(komiku|komikuid)$/i;
oota.tags = ["manga"];

export default oota
