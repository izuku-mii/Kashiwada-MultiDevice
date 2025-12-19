import fs from "fs";

let Izumi = async (m, {
    conn
}) => {
    await conn.sendButton(
        m.chat, {
            product: {
                productImage: fs.readFileSync("./media/thumbnail2.jpg"),
                productId: '0',
                title: ` ⧉ Script ${global?.botname}`,
                description: `Script Gratis No Jual Ygy`,
                currencyCode: '0',
                priceAmount1000: '0',
                retailerId: global?.ownername,
                url: global?.web,
                productImageCount: 1
            },
            businessOwnerJid: global?.owner[0] + "@s.whatsapp.net",
            caption: `〆 ━━━[SCRIPT BOT]━━━〆
     々 No Di Jual / Ini Gratis Ygy
     々 Remake: ${global.ownername}
〆 ━━━━━━━━━━━━━〆`,
            footer: global?.botname,
            buttons: [{
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: 'Script Bot Wa',
                    url: 'https://github.com/hanz-27/Alya-MultiDevice.git'
                })
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '⧉ ꜰᴏʟʟᴏᴡ ᴍʏ ᴄʜᴀɴɴᴇʟ !',
                        url: global.linkch || "https://whatsapp.com/channel/0029Vb67i65Fi8xX7rOtIc2S"
                    })
                },
            }],
            hasMediaAttachment: false // or true
        }, {
            quoted: m
        });
};

Izumi.help = Izumi.command = ["sc", "script"];
Izumi.tags = ["info"];

export default Izumi;
