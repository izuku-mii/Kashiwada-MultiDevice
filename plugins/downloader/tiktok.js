let old = new Date()

import * as baileys from "@adiwajshing/baileys";
import axios from "axios";

const izuku = async (m, {
    conn,
    text,
    usedPrefix,
    command,
    args
}) => {
    const tiktokRegex = /https?:\/\/(?:www\.|vm\.|vt\.)?tiktok\.com\/(?:@[\w.-]+\/video\/\d+|[\w.-]+\/video\/\d+|\w+|t\/\w+)/i;
    const hasTiktokLink = tiktokRegex.test(text) || null;
    if (!hasTiktokLink) throw `Maaf Anda Masukkan Link Dulu Contoh ${usedPrefix + command} https://vt.tiktok.com/xxxx`;

    let url;
    if (hasTiktokLink) {
        try {
            const {
                result: ttwm
            } = await (await fetch(apikey.izumi + '/downloader/tiktok?url=' + encodeURIComponent(args[0]))).json();
            if (ttwm.images) {
                const ft = ttwm.images.map(v => v);
                let push = [];
                for (let i = 0; i < ft.length; i++) {
                    let cap = `☘️ *Process*: ${((new Date - old) * 1)} ms`;
                    const mediaMessage = await baileys.prepareWAMessageMedia({
                        image: {
                            url: ft[i]
                        }
                    }, {
                        upload: conn.waUploadToServer
                    });
                    push.push({
                        body: baileys.proto.Message.InteractiveMessage.Body.fromObject({
                            text: cap
                        }),
                        footer: baileys.proto.Message.InteractiveMessage.Footer.fromObject({
                            text: botname
                        }),
                        header: baileys.proto.Message.InteractiveMessage.Header.create({
                            title: `☘️ *Slide*: ${i + 1}/${ft.length}`,
                            subtitle: '',
                            hasMediaAttachment: true,
                            ...mediaMessage
                        }),
                        nativeFlowMessage: baileys.proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                            buttons: [{}]
                        })
                    });
                }
                const msg = baileys.generateWAMessageFromContent(m.chat, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: baileys.proto.Message.InteractiveMessage.fromObject({
                                body: baileys.proto.Message.InteractiveMessage.Body.create({
                                    text: ownername
                                }),
                                footer: baileys.proto.Message.InteractiveMessage.Footer.create({
                                    text: botname
                                }),
                                header: baileys.proto.Message.InteractiveMessage.Header.create({
                                    hasMediaAttachment: false
                                }),
                                carouselMessage: baileys.proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                                    cards: push
                                }),
                                contextInfo: {
                                    mentionedJid: [m.sender],
                                    forwardingScore: 999,
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: saluran,
                                        newsletterName: ownername,
                                        serverMessageId: 143
                                    }
                                }
                            })
                        }
                    }
                }, {
                    quoted: m
                });
                await conn.relayMessage(m.chat, msg.message, {
                    messageId: msg.key.id
                });
            } else {
                let {
                    data: res
                } = await axios.get(ttwm.play, {
                    responseType: 'arraybuffer'
                });
                conn.sendFile(m.chat, Buffer.from(res), null, `☘️ *Process*: ${((new Date - old) * 1)} ms`, m);
            }
        } catch (e) {
            m.reply('❌ Maaf Error Mungkin Kebanyakan Request kali');
            console.error('Error: ', e);
        }
    } else {
        m.reply('❌Maaf Gada Link Gabisa Dl')
    };
};

izuku.help = ['tiktok', 'ttdl', 'tt', 'tiktokdl'].map(v => `${v} *[ Link TikTok ]* `);
izuku.tags = ['downloader'];
izuku.command = ['tiktok', 'ttdl', 'tt', 'tiktokdl'];
izuku.loading = true;
izuku.limit = true;

export default izuku;