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
 
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

import './config.js'

import path, { join } from 'path'
import pino from 'pino'
import ws from 'ws'
import syntaxerror from 'syntax-error'
import chalk from 'chalk'
import { platform } from 'process'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module' // Bring in the ability to create the 'require' method
import fs from 'fs'
const {
  readdirSync,
  statSync,
  unlinkSync,
  existsSync,
  readFileSync,
  watch
} = fs
import yargs from 'yargs/yargs';
import { spawn, exec } from 'child_process'
import { tmpdir } from 'os'
import { format, promisify } from 'util'
import { Boom } from "@hapi/boom";
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, fetchLatestWaWebVersion, Browsers, makeCacheableSignalKeyStore, } = await import('@adiwajshing/baileys')
import { Low, JSONFile } from 'lowdb'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
const run = promisify(exec);

const { CONNECTING } = ws

protoType()
serialize()

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') { return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString() }; global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }; global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
const __dirname = global.__dirname(import.meta.url)

global.prefix = new RegExp('^[' + '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-'.replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
global.db = new Low(new JSONFile('database.json'));

global.loadDatabase = async function loadDatabase() {
  if(db.READ) return new Promise((resolve) => setInterval(async function () {
    if(!db.READ) {
      clearInterval(this)
      resolve(db.data == null ? global.loadDatabase() : db.data)
    }
  }, 1 * 1000))
  if(db.data !== null) return
  db.READ = true
  await db.read().catch(console.error)
  db.READ = null
  db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(db.data || {})
  }
}
loadDatabase()

const { version } = await fetchLatestBaileysVersion()
const { state, saveCreds } = await useMultiFileAuthState('./sessions')
const connectionOptions = {
    version,
    logger: pino({
        level: 'silent'
    }),
    printQRInTerminal: false,
    // Optional If Linked Device Could'nt Connected
    // browser: ['Mac OS', 'chrome', '125.0.6422.53']
    browser: Browsers.ubuntu("Safari"),
    auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino().child({
            level: 'silent',
            stream: 'store'
        })),
    },
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
            message.buttonsMessage ||
            message.templateMessage ||
            message.listMessage
        );
        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        ...message,
                    },
                },
            };
        }

        return message;
    },
    connectTimeoutMs: 60000,
    defaultQueryTimeoutMs: 0,
    generateHighQualityLinkPreview: true,
    syncFullHistory: true,
    markOnlineOnConnect: false
}

global.conn = makeWASocket(connectionOptions)
conn.isInit = false

async function downloadBinary() {
  try {
    await run('curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp');
    await run('chmod +x yt-dlp');
    conn.logger.info('✅ yt-dlp binary downloaded! Run with ./yt-dlp');
  } catch (err) {
    conn.logger.error('❌ Error:', err.stderr || err.message);
  }
}

await downloadBinary();

if(global.db) {
   setInterval(async () => {
    if(global.db.data) await global.db.write().catch(console.error);
    if(global.support?.find) {
      const tmp = [tmpdir(), 'tmp'];
      tmp.forEach(filename => spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']));
    }
  }, 60000);
}

if(existsSync('./sessions/creds.json') && !conn.authState.creds.registered) {
  conn.logger.warn('Maaf File Sessions Error!, Tolong Di Hapus File Sessions Nya');
  process.exit(0);
}

async function connectionUpdate(update) {
    const {
        connection,
        lastDisconnect
    } = update
    if (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output && lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut && conn.ws.readyState !== ws.CONNECTING) {
        conn.logger.warn('Nomor Kamu Kena Banned Session Logout / Kalo Bukan Cek Version Di Socket')
    }
    if (global.db.data == null) await loadDatabase()
    // console.log(JSON.stringify(update, null, 4))
}

if (!conn.authState.creds.registered) {
    console.log(chalk.bgWhite(chalk.blue('Generating code...')))
    setTimeout(async () => {
        let code = await conn.requestPairingCode(global.nomor, global.costumpairing)
        code = code?.match(/.{1,4}/g)?.join('-') || code
        conn.logger.info(`Code Pairing Anda: ${code}`)
    }, 3000)
}
process.on('uncaughtException', console.error)

conn.ev.on("connection.update", async (update) => {
    const {
        connection,
        lastDisconnect
    } = update;
    if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
            process.exit(0)
        } else if (reason === DisconnectReason.badSession) {
            conn.logger.warn(`Session Anda Buruk Koneksikan Ulang.... Restarting`);
            process.exit(0)
        } else if (reason === DisconnectReason.connectionClosed) {
            conn.logger.warn(`Koneksi Ini Terputus, Restarting Koneksi Ulang`);
            process.exit(0)
        } else if (reason === DisconnectReason.connectionLost) {
            conn.logger.warn(`Koneksi Terputus, Restarting`);
            process.exit(0)
        } else if (reason === DisconnectReason.connectionReplaced) {
            conn.logger.error(`Session Udah Di Ganti, Coba Cek Session Kamu Kalo Ganti Atau Logout Pairing Ulang`);
            conn.logout();
        } else if (reason === DisconnectReason.loggedOut) {
            conn.logger.error(`Pairing Session Anda Logout Segera Pairing Ulang`);
            conn.logout();
        } else if (reason === DisconnectReason.restartRequired) {
            conn.logger.warn(`Pairing / Qr Terhubung Ngerestart Dulu! `);
            process.exit(0)
        } else if (reason === DisconnectReason.timedOut) {
            conn.logger.warn(`Koneksi Kamu Kena Timeout Menghubungkan Ulang`);
            process.exit(0)
        }
    } else if (connection === "connecting") {
        conn.logger.info(`Menghubungkan Di Tunggu Proses Nya`);
    } else if (connection === "open") {
        conn.logger.info(`Koneksi Terhubung`);
    }
});

//=====[ Setelah Pembaruan Koneksi ]========//
conn.ev.on("creds.update", saveCreds);

// let strQuot = /(["'])(?:(?=(\\?))\2.)*?\1/

let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function (restatConn) {
  /*try {
      const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)*/
  try {
    // Jika anda menggunakan replit, gunakan yang sevenHoursLater dan tambahkan // pada const Handler
    // Default: server/vps/panel, replit + 7 jam buat jam indonesia Jika Tidak Faham Pakai Milidetik 3600000 = 1 Jam Dan Kalikan 7 = 25200000
    // const sevenHoursLater = Dateindonesia 7 * 60 * 60 * 1000;
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    // const Handler = await import(`./handler.js?update=${sevenHoursLater}`).catch(console.error)
    if(Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e)
  }
  if(restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    isInit = true
  }
  if(!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.welcome = 'Welcome @user!\n\nIntro Dulu Lek Ga Intro Admin Mana Kenal :3\n\n╭──🌸→ [ Intro ]\n│ Nama: \n│ Gender: \n│ Hobi: \n│ Umur: \n│ Kelas: \n│ Askot: \n╰──────────────────→'
  conn.bye = 'Sayonara @user🥲'
  conn.spromote = '@user Sekarang jadi admin!'
  conn.sdemote = '@user Sekarang bukan lagi admin!'
  conn.sDesc = 'Deskripsi telah diubah menjadi \n@desc'
  conn.sSubject = 'Judul grup telah diubah menjadi \n@subject'
  conn.sIcon = 'Icon grup telah diubah!'
  conn.sRevoke = 'Link group telah diubah ke \n@revoke'
  conn.sAnnounceOn = 'Group telah di tutup!\nsekarang hanya admin yang dapat mengirim pesan.'
  conn.sAnnounceOff = 'Group telah di buka!\nsekarang semua peserta dapat mengirim pesan.'
  conn.sRestrictOn = 'Edit Info Grup di ubah ke hanya admin!'
  conn.sRestrictOff = 'Edit Info Grup di ubah ke semua peserta!'

  conn.handler = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn)

  conn.ev.on('call', async (call) => {
    console.log('Panggilan diterima:', call);
    if(call.status === 'ringing') {
      await conn.rejectCall(call.id);
      console.log('Panggilan ditolak');
    }
  })
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true

}

async function loadingPlugin() {
    const {
        default: PluginLoader
    } = await import(
        `file://${process.cwd()}/lib/loader.js`
    );

    global.pg = new PluginLoader(process.cwd() + "/plugins");

    await pg.watch();
    setInterval(async () => {
        await pg.load();
    }, 2000);
}

loadingPlugin()
    .then(() => conn.logger.info("✅ Plugin Udah Berhasil Loader"))
    .catch((err) => conn.logger.error("❌ Gagal load plugin:", err));
await global.reloadHandler()

setInterval(() => {
  fs.readdir(`sessions`, async function (err, files) {
    if (err) {
      console.log('Unable to scan directory\n' + err);
    }
    const list = ["pre-key", "sender-key", "session-"];
    
    let filter = await files.filter(item => list.some(type => item.startsWith(type)));
    if(filter.length == 0) return
    await filter.forEach(function (file) {
      fs.unlinkSync(`./sessions/${file}`)
    });
    process.send("reset")
  });
}, 130 * 60 * 1000) // 3 jam

// Quick Test

async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127);
        });
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false));
      })
    ]);
  }));

  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  console.log(test);

  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  };

  Object.freeze(global.support);

  if(!s.ffmpeg) {
    conn.logger.warn(`Silahkan install ffmpeg terlebih dahulu agar bisa mengirim video`);
  }

  if(s.ffmpeg && !s.ffmpegWebp) {
    conn.logger.warn('Sticker Mungkin Tidak Beranimasi tanpa libwebp di ffmpeg (--enable-libwebp while compiling ffmpeg)');
  }

  if(!s.convert && !s.magick && !s.gm) {
    conn.logger.warn('Fitur Stiker Mungkin Tidak Bekerja Tanpa imagemagick dan libwebp di ffmpeg belum terinstall (pkg install imagemagick)');
  }
}

_quickTest().then(() => conn.logger.info('☑️ Quick Test Done , nama file session ~> creds.json')).catch(console.error);
