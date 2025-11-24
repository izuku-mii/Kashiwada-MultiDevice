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
    const linkig = text.includes('ins')
    if (!linkig) throw `Maaf Anda Masukkan Link Dulu Contoh ${usedPrefix + command} https://www.instagram.com/xxxx`;

    let url;
    if (linkig) {
        try {
            const {
                result: ig
            } = await (await fetch(apikey.izumi + '/downloader/instagram?url=' + encodeURIComponent(args[0]))).json();
            if (ig.isVideo === false) {
                const ft = ig.media.map(v => v);
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
                } = await axios.get(ig.media, {
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

izuku.help = ['instagram', 'igdl', 'ig', 'igdl'].map(v => `${v} *[ Link Instagram ]* `);
izuku.tags = ['downloader'];
izuku.command = ['instagram', 'igdl', 'ig', 'igdl'];
izuku.loading = true;
izuku.limit = true;

export default izuku;