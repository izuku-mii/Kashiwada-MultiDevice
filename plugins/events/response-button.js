let handler = (m) => m;
handler.before = async (m, {
    conn
}) => {
    //============= [LIST RESPONCE CHECKING START ]================
    if (m.mtype === "interactiveResponseMessage") {
        console.log("interactiveResponseMessage Detected!")
        let msg = m.message[m.mtype] || m.msg
        if (msg.nativeFlowResponseMessage && !m.isBot) {
            let {
                id
            } = JSON.parse(msg.nativeFlowResponseMessage.paramsJson) || {}
            if (id) {
                let emit_msg = {
                    key: {
                        ...m.key
                    }, // SET RANDOME MESSAGE ID  
                    message: {
                        extendedTextMessage: {
                            text: id
                        }
                    },
                    pushName: m.pushName,
                    messageTimestamp: m.messageTimestamp || 754785898978
                }
                return conn.ev.emit("messages.upsert", {
                    messages: [emit_msg],
                    type: "notify"
                })
            }
        }
    } else if (m.mtype === 'buttonsResponseMessage') {
        console.log('Button Bubble Detected!');
        let msg = m.message[m.mtype] || m.msg;

        if (msg.selectedButtonId && !m.isBot) {
            let emit_msg = {
                key: {
                    ...m.key
                }, // pakai ID asli dari tombol
                message: {
                    extendedTextMessage: {
                        text: msg.selectedButtonId
                    }
                },
                pushName: m.pushName,
                messageTimestamp: m.messageTimestamp || Date.now()
            };

            return conn.ev.emit("messages.upsert", {
                messages: [emit_msg],
                type: "notify"
            });
        }
    } else if (m.mtype === 'templateButtonReplyMessage') {
        console.log('templateButtonReplyMessage Detected!');
        let msg = m.message[m.mtype] || m.msg;

        if (msg.selectedId && !m.isBot) {
            let emit_msg = {
                key: {
                    ...m.key
                }, // pakai ID asli dari tombol
                message: {
                    extendedTextMessage: {
                        text: msg.selectedId
                    }
                },
                pushName: m.pushName,
                messageTimestamp: m.messageTimestamp || Date.now()
            };

            return conn.ev.emit("messages.upsert", {
                messages: [emit_msg],
                type: "notify"
            });
        }
    }
    //============= [LIST RESPONCE CHECKING END ]================
}

export default handler;