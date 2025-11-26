/**
 * @SCRIPT      🔥 KASHIWADA-BOTWA 🔥
 * @INFO        Script ini GRATIS, bukan untuk dijual belikan.
 * @WARNING     Jangan ngaku-ngaku, jangan jual script gratis, dosa bro 😭
 * 
 * @BASE        NAO-MD
 * @BASE_OWNER  SHIROKAMI RYZEN
 * 
 * @AUTHOR      IZUKU-MII
 * @REMAKE      IZUKU-MII
 * 
 * @NOTE        SEMOGA YANG COLONG SCRIPT INI DAPET HIKMAH DAN TOBAT 🙏
 * 
 * @COPYRIGHT   © 2025 IZUKU-MII | All Rights Free.
 */

import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import moment from 'moment-timezone'
import util from 'util'
import knights from 'knights-canvas'

const isNumber = x => typeof x === 'number' && !isNaN(x)

/**
 * Handle messages upsert
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['messages.upsert']} groupsUpdate 
 */

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (global.db.data == null) await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m) return
        m.exp = 0
        m.limit = false

        async function getTargetLid(id, conn) {
            if (id.endsWith('@lid')) return id
            let res;
            try {
                res = await (await conn.signalRepository.lidMapping.getLIDForPN(id).catch(() => null))?.replace(/:\d+@/, '@')
            } catch (_) {
                res = await conn.onWhatsApp(id).then(a => a?.[0]?.lid).catch(() => [])
            }
            return res || null
        }

        global.getTargetLid = getTargetLid
        m.senderlid = await getTargetLid(m.sender, this)

        try {
            let user = global.db.data.users[m.senderlid]
            if (typeof user !== 'object') global.db.data.users[m.senderlid] = {}
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 20
                if (!isNumber(user.limit))
                    user.limit = 20
                if (!isNumber(user.afk))
                    user.afk = -1
                if (!('afkReason' in user))
                    user.afkReason = ''
                if (!('warn' in user))
                    user.warn = 0
                if (!('banned' in user))
                    user.banned = false
                if (!('banReason' in user))
                    user.banReason = ''
                if (!('role' in user))
                    user.role = 'Free user'
                if (!('autolevelup' in user))
                    user.autolevelup = true
            } else
                global.db.data.users[m.senderlid] = {
                    exp: 20,
                    limit: 20,
                    name: m.name,
                    age: -1,
                    regTime: -1,
                    afk: -1,
                    afkReason: '',
                    banned: false,
                    banReason: '',
                    warn: 0,
                    role: 'Free user',
                }

            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object') global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('welcome' in chat)) chat.welcome = false
                if (!('sWelcome' in chat)) chat.sWelcome = ''
                if (!('sBye' in chat)) chat.sBye = ''
                if (!('sPromote' in chat)) chat.sPromote = '@user telah di promote'
                if (!('sDemote' in chat)) chat.sDemote = '@user telah di demote'
                if (!('delete' in chat)) chat.delete = true
                if (!('blacklist' in chat)) chat.blacklist = []
                if (!('tagsw' in chat)) chat.tagsw = {
                    delete: false,
                    kick: false
                }
                if (!isNumber(chat.expired)) chat.expired = 0
            } else global.db.data.chats[m.chat] = {
                welcome: false,
                blacklist: [],
                tagsw: {
                    delete: false,
                    kick: false
                },
                sWelcome: '',
                sBye: '',
                sPromote: '@user telah di promote!',
                sDemote: '@user telah di demote',
                expired: 0,
            }

            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('resetlimit' in settings)) settings.resetlimit = moment.tz(global.tz).format("HH:mm")
                if (!('autoleveling' in settings)) chat.autoleveling = false
                if (!('restrict' in settings)) settings.restrict = true
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                resetlimit: moment.tz(global.tz).format("HH:mm"),
                autoleveling: false,
                restrict: true,
            }
        } catch (e) {
            console.error(e)
        }

        if (db.data.settings[this.user.jid].autoread) await this.readMessages([m.key])
        if (opts['nyimak']) return
        if (opts['pconly'] && m.chat.endsWith('g.us')) return
        if (opts['gconly'] && !m.chat.endsWith('g.us')) return
        if (opts['swonly'] && m.chat !== 'status@broadcast') return
        if (typeof m.text !== 'string') m.text = ''

        const msg = m;
        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

        const mappedOwners = await Promise.all(
            owner.map(async num => {
                const jid = `${num}@s.whatsapp.net`
                let lid;
                try {
                    lid = await (await conn.signalRepository.lidMapping.getLIDForPN(jid).catch(() => null))?.replace(/:\d+@/, '@')
                } catch (_) {
                    lid = await conn.onWhatsApp(jid).then(a => a?.[0]?.lid).catch(() => null)
                }
                return lid || null
            })
        )

        let lidsen = await (await conn?.signalRepository?.lidMapping?.getLIDForPN(m.sender).catch(() => null))?.replace(/:\d+@/, '@') || m.sender
        let isROwner = mappedOwners.includes(lidsen);

        const isOwner = isROwner || m.fromMe
        const isPrems = global.db.data.users[m.senderlid].premium
        const isBans = global.db.data.users[m.senderlid].banned

        const groupMetadata = (m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}) || {}
        const participants = (m.isGroup ? groupMetadata.participants : []) || []
        const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.jid) === m.sender || conn.decodeJid(u.id) === m.sender || u.id === m.sender || u.lid === m.sender) : {}) || {} // User Data
        const bot = (m.isGroup ? participants.find(u => conn.decodeJid(u.jid) == this.user.jid || conn.decodeJid(u.id) == this.user.jid || u.id == this.user.lid.replace(/:\d+@/, '@') || u.lid == this.user.lid.replace(/:\d+@/, '@')) : {}) || {} // Your Data
        const isRAdmin = user?.admin == 'superadmin' || false
        const isAdmin = isRAdmin || user?.admin == 'admin' || false // Is User Admin?
        const isBotAdmin = bot?.admin || false // Are you Admin"

        if (!isOwner && db.data.settings[this.user.jid].self) return
        if (!isOwner && db.data.chats[m.chat].mute) return
        const isBot = m?.id?.startsWith("3EB0") ||
            m?.id?.startsWith("FELZ") ||
            m?.id?.startsWith("F3FD") ||
            m?.id?.startsWith("SSA") ||
            m?.id?.startsWith("B1EY") ||
            m?.id?.startsWith("BAE5") ||
            m?.id?.startsWith("HSK") ||
            m?.id?.indexOf("-") > 1;
        if (isBot) return

        // Variabel kontrol reset
        let isResetting = false
        let lastResetTime = 0

        // Pengecekan reset limit yang anti-spam
        const now = Date.now()
        const resetTime = db.data.settings[this.user.jid].resetlimit

        if (resetTime && !isResetting) {
            const [targetHour, targetMinute] = resetTime.split(':').map(Number)
            const currentTime = moment.tz(global.tz)

            // Cek jika waktu sekarang sama dengan waktu reset
            if (currentTime.hours() === targetHour &&
                currentTime.minutes() === targetMinute &&
                now - lastResetTime > 60000) { // Minimal 1 menit antara reset

                isResetting = true
                lastResetTime = now

                try {
                    const users = Object.keys(db.data.users)
                    for (const user of users) {
                        db.data.users[user].limit = 20
                    }

                    console.log(`[ LIMIT RESET ] Berhasil direset pukul ${resetTime} untuk ${users.length} pengguna`)
                } catch (e) {
                    console.error('[ LIMIT RESET ERROR ]', e)
                } finally {
                    isResetting = false
                }
            }
        }

        if (isROwner) {
            db.data.users[m.senderlid].limit = 20
        }

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque,
                time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function() {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                else await delay(time)
            }, time)
        }

        m.exp += Math.ceil(Math.random() * 10)

        for (let name in pg.plugins) {
            let plugin
            if (typeof pg.plugins[name].code === "function") {
                let anu = pg.plugins[name]
                plugin = anu.code
                for (let prop in anu) {
                    if (prop !== "run") {
                        plugin[prop] = anu[prop]
                    }
                }
            } else {
                plugin = pg.plugins[name]
            }
            if (!plugin) return
            if (plugin.disabled) continue

            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [
                    [_prefix.exec(m.text), _prefix]
                ] :
                Array.isArray(_prefix) ? // Array?
                _prefix.map(p => {
                    let re = p instanceof RegExp ? // RegExp in Array?
                        p :
                        new RegExp(str2Regex(p))
                    return [re.exec(m.text), re]
                }) :
                typeof _prefix === 'string' ? // String?
                [
                    [new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]
                ] : [
                    [
                        [], new RegExp
                    ]
                ]
            ).find(p => p[1])
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                        match,
                        conn: this,
                        participants,
                        groupMetadata,
                        user,
                        bot,
                        isROwner,
                        isOwner,
                        isRAdmin,
                        isAdmin,
                        isBotAdmin,
                        isPrems,
                        chatUpdate,
                    }))
                    continue
            }
            if (typeof plugin !== 'function') continue
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                    plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                        cmd.test(command) :
                        cmd === command
                    ) :
                    typeof plugin.command === 'string' ? // String?
                    plugin.command === command :
                    false

                if (!isAccept) continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.senderlid in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.senderlid]
                    if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned) return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned) return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    // m.reply('Ngecit -_-') // Hehehe
                    console.log("ngecit -_-");
                else
                    m.exp += xp
                /*if(plugin.level > _user.level) {
                    this.reply(m.chat, `[💬] Diperlukan level ${plugin.level} untuk menggunakan perintah ini\n*Level mu:* ${_user.level} 📊`, m)
                    continue // If the level has not been reached
                }*/
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
                    conn: this,
                    participants,
                    groupMetadata,
                    user,
                    bot,
                    isROwner,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                }
                try {
                    await plugin.call(this, m, extra).then(async (a) => {
                        if (plugin?.limit) {
                            let usersli = db.data.users[m.senderlid]
                            if (usersli.limit > plugin.limit) {
                                usersli.limit -= plugin.limit
                                conn.reply(
                                    m.chat,
                                    `> 🍀 Kashiwada: Limit Mu Tinggal: ${usersli.limit}\n> 💢 Oota: LAIN KALI JANGAN BOROS\n> 🍀 Kashiwada: Oota-kun, Jangan Marah Marah lah lagian, cuman limit doang....`,
                                    m
                                )
                                if (usersli.limit === plugin.limit) {
                                    conn.reply(
                                        m.chat,
                                        `> 🍞 Oota-kun: Kan Limit Mu: ${usersli.limit},\n> 🍀 Kashiwada: Yaudahlah Limit Mu Dikit Nunggu Riset Jam: 2:00`,
                                        m
                                    )
                                }
                            } else {
                                conn.reply(
                                    m.chat,
                                    `> 🍀 Kashiwada: Yaah Limit Mu Habis...\n> 💢 Oota: Mangka Nya Jangan Boros Sayang Tuh Limit`,
                                    m
                                )
                            }
                        }
                    })
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        conn.logger.error(text);
                        for (let key of Object.values(global.apikey))
                            text = util.format(e);
                        if (e.name) {
                            for (let [jid] of global.owner.filter(([number]) => number)) {
                                let data = (await conn.onWhatsApp(jid))[0] || {}
                                if (data.exists)
                                    m.reply(`*🗂️ Plugin:* ${m.plugin}\n*👤 Sender:* ${m.sender}\n*💬 Chat:* ${m.chat}\n*💻 Command:* ${usedPrefix}${command} ${args.join(' ')}\n📄 *Error Logs:*\n\n\`\`\`${text}\`\`\``.trim(), data.jid)
                            }
                            m.reply(text)
                        }
                        m.reply(e);
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.senderlid && (user = global.db.data.users[m.senderlid])) {
                user.exp += m.exp
                user.limit -= m.limit * 1
            }
            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }
        try {
            await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (db.data.settings[this.user.jid].autoread) await conn.readMessages([m.key])
    }
}
/**
 * Handle groups participants update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['group-participants.update']} groupsUpdate 
 */
export async function participantsUpdate({
    id,
    participants,
    action
}) {
    // if(id in conn.chats) return // First login will spam
    if (this.isInit) return
    if (global.db.data == null) await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add':
        case 'remove':
            if (chat?.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                for (let user of participants) {
                    let seni = user?.phoneNumber || user?.id || user?.lid
                    let pp = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
                    let ppgc = 'https://telegra.ph/file/24fa902ead26340f3df2c.png'
                    let userName = seni.split('@')[0];
                    try {
                        pp = await this.profilePictureUrl(seni, 'image')
                        ppgc = await this.profilePictureUrl(id, 'image')
                        const userData = global.db.data.users[seni.split('@')[0]];
                        if (userData && userData.name) {
                            userName = userData.name;
                        }

                    } catch (e) {} finally {
                        text = (action === 'add' ?
                            (chat.sWelcome || this.welcome || conn.welcome || 'Welcome, @user!').replace('@subject', await this.getName(id)).replace('@desc', groupMetadata.desc?.toString() || 'unknown') :
                            (chat.sBye || this.bye || conn.bye || 'Bye, @user!')).replace('@user', `@` + seni.split('@')[0])
                        let wel = await new knights.Welcome2()
                            .setAvatar(pp)
                            .setUsername(await this?.getName(seni) || "Gada Nama")
                            .setBg("https://c.top4top.io/p_36048izxw1.jpg")
                            .setGroupname(groupMetadata.subject)
                            .setMember(groupMetadata.participants.length)
                            .toAttachment()

                        let lea = await new knights.Goodbye()
                            .setUsername(await this?.getName(seni) || "Gada Nama")
                            .setGuildName(groupMetadata.subject)
                            .setGuildIcon(ppgc)
                            .setMemberCount(groupMetadata.participants.length)
                            .setAvatar(pp)
                            .setBackground("https://l.top4top.io/p_36040fspy1.jpg")
                            .toAttachment()

                        this.sendMessage(id, {
                            text,
                            contextInfo: {
                                mentionedJid: [seni],
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: global?.saluran,
                                    serverMessageId: 103,
                                    newsletterName: global?.botname
                                },
                                externalAdReply: {
                                    title: action === 'add' ? "Welcome" : "GoodBye",
                                    body: global?.ownername + " / " + global?.botname,
                                    mediaType: 1,
                                    thumbnail: action === 'add' ? wel.toBuffer() : lea.toBuffer(),
                                    sourceUrl: global?.web,
                                    renderLargerThumbnail: true
                                }
                            }
                        })
                    }
                }
            }
            break
        case 'promote':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user ```is now Admin```')
        case 'demote':
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ```is no longer Admin```')
            text = text.replace('@user', '@' + participants[0].split('@')[0])
            if (chat.detect)
                this.sendMessage(id, {
                    text,
                    mentions: this.parseMention(text)
                })
            break
    }
}

/**
 * Handler groups update
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['groups.update']} groupsUpdate 
 */
export async function groupsUpdate(groupsUpdate) {
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id],
            text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || '```Description has been changed to```\n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || '```Subject has been changed to```\n@subject').replace('@subject', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || '```Icon has been changed to```').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || '```Group link has been changed to```\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (groupUpdate.announce == true) text = (chats.sAnnounceOn || this.sAnnounceOn || conn.sAnnounceOn || '*Group has been closed!*')
        if (groupUpdate.announce == false) text = (chats.sAnnounceOff || this.sAnnounceOff || conn.sAnnounceOff || '*Group has been open!*')
        if (groupUpdate.restrict == true) text = (chats.sRestrictOn || this.sRestrictOn || conn.sRestrictOn || '*Group has been all participants!*')
        if (groupUpdate.restrict == false) text = (chats.sRestrictOff || this.sRestrictOff || conn.sRestrictOff || '*Group has been only admin!*')
        if (!text) continue
        this.reply(id, text.trim(), m)
    }
}

global.dfail = (type, m, conn) => {
    let msg = {
        rowner: '🚫 *( ACCESS DENIED )* ANDA BUKAN OWNERKU!',
        owner: '🚫 *( ACCESS DENIED )* ANDA BUKAN OWNERKU!',
        mods: '🚫 *( ACCESS DENIED )* BOT KHUSUS MODS!',
        premium: '🚫 *( ACCESS DENIED )* ANDA HARUS PREMIUM DULU!',
        group: '🚫 *( ACCESS DENIED )* KHUSUS GRUP INI!',
        private: '🚫 *( ACCESS DENIED )* KHUSUS CHAT PRIVATE',
        admin: '🚫 *( ACCESS DENIED )* KHUSUS ADMIN!',
        botAdmin: '🚫 *( ACCESS DENIED )* ADMININ DULU BOT NYA!',
        unreg: '🚫 *( ACCESS DENIED )* ANDA HARUS DAFTAR ULANG!',
        restrict: '🚫 *( ACCESS DENIED )* ANDA BELUM MENYALAKAN CHAT!',
        disable: '🚫 *( ACCESS DENIED )* COMMAND IN DI MATIIN DULU!',
    } [type]
    if (msg) return conn.reply(m.chat, msg, m)
}


let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.redBright("Update 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})
