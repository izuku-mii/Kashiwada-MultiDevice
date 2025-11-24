import * as baileys from "@adiwajshing/baileys";
import crypto from "node:crypto";
import { Readable, PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';

let Izumi = async (m, { conn, text }) => {
  let [textInput, warna, url] = text.split('|');

  let id;
  if (url) {
    const inviteCode = url.split('/').pop().split('?')[0];
    let geti = await conn.groupGetInviteInfo(inviteCode);
    id = geti.id;
  } else {
    id = m.chat;
  }

  // fallback quoted/media
  let quoted = m.quoted || m;
  let cap = quoted.caption || textInput;

  // ambil info mime
  let q = quoted;
  let mime = q?.mimetype || q?.msg?.mimetype || '';

  // kalau media
  if (/image/.test(mime)) {
    const buffer = await quoted.download().catch(() => null);
    if (!buffer) return m.reply('⚠️ Gagal ambil gambar!');

    const sta = await groupStatus(conn, id, {
      image: buffer,
      caption: cap
    });
    return conn.reply(m.chat, '✅ Dah UpStatus Nya Tengok Di Reply', sta);
  } else if (/video/.test(mime)) {
    const buffer = await quoted.download().catch(() => null);
    if (!buffer) return m.reply('⚠️ Gagal ambil video!');

    const sta = await groupStatus(conn, id, {
      video: buffer,
      caption: cap
    });
    return conn.reply(m.chat, '✅ Dah UpStatus Nya Tengok Di Reply', sta);
  } else if (/audio/.test(mime)) {
    const buffer = await quoted.download().catch(() => null);
    const audioVn = await toVN(buffer)
    const audioWaveform = await generateWaveform(buffer)
    if (!buffer) return m.reply('⚠️ Gagal ambil audio!');

    const sta = await groupStatus(conn, id, {
      audio: audioVn,
      waveform: audioWaveform,
      mimetype: "audio/ogg; codecs=opus",
      ptt: true
    });
    return conn.reply(m.chat, '✅ Dah UpStatus Nya Tengok Di Reply', sta);
  } else if (warna) {
    if (!cap) return m.reply('⚠️ Gada Text Buat Upload Ke Status Grup!');

    const warnaStatusWA = new Map([
      ['biru',    '#34B7F1'],
      ['hijau',   '#25D366'],
      ['kuning',  '#FFD700'],
      ['jingga',  '#FF8C00'],
      ['merah',   '#FF3B30'],
      ['ungu',    '#9C27B0'],
      ['abu',     '#9E9E9E'],
      ['hitam',   '#000000'],
      ['putih',   '#FFFFFF'],
      ['cyan',    '#00BCD4']
    ]);

    const textWarna = warna.toLowerCase();
    let color = null;
    for (const [nama, kode] of warnaStatusWA.entries()) {
      if (textWarna.includes(nama)) {
        color = kode;
        break;
      }
    }

    if (!color) return m.reply('⚪ Tidak ada warna yang cocok ditemukan dalam teks kamu.');

    const sta = await groupStatus(conn, id, {
      text: cap,
      backgroundColor: color
    });
    return conn.reply(m.chat, '✅ Dah UpStatus Nya Tengok Di Reply', sta);
  } else {
    return m.reply('⚠️ Reply media (gambar/video/audio) atau kirim teks berwarna. sama bisa kirim ke link gc yang anda mau, atau up disini juga bisa');
  }
};

/**
 * Send WhatsApp status on group.
 * @param {import("@adiwajshing/baileys").WASocket} conn
 * @param {string} jid
 * @param {import("@adiwajshing/baileys").AnyMessageContent} content
 */
async function groupStatus(conn, jid, content) {
  const { backgroundColor } = content;
  delete content.backgroundColor;

  const inside = await baileys.generateWAMessageContent(content, {
    upload: conn.waUploadToServer,
    backgroundColor
  });

  const messageSecret = crypto.randomBytes(32);
  const m = baileys.generateWAMessageFromContent(jid, {
    messageContextInfo: { messageSecret },
    groupStatusMessageV2: {
      message: {
        ...inside,
        messageContextInfo: { messageSecret }
      }
    }
  }, {});

  await conn.relayMessage(jid, m.message, { messageId: m.key.id });
  return m;
}

Izumi.help = ["swgc", "upswgc"];
Izumi.command = ["swgc", "upswgc"];
Izumi.tags = ["tools"];
Izumi.admin = true;

async function toVN(inputBuffer) {
  return new Promise((resolve, reject) => {
    const inStream = new PassThrough();
    const outStream = new PassThrough();
    const chunks = [];

    inStream.end(inputBuffer);

    ffmpeg(inStream)
      .noVideo()
      .audioCodec('libopus')
      .format('ogg')
      .audioBitrate('48k')
      .audioChannels(1)
      .audioFrequency(48000)
      .outputOptions([
        '-map_metadata', '-1',
        '-application', 'voip',
        '-compression_level', '10',
        '-page_duration', '20000'
      ])
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(outStream, { end: true });

    outStream.on('data', c => chunks.push(c));
  });
}

async function generateWaveform(inputBuffer, bars = 64) {
  return new Promise((resolve, reject) => {
    const inputStream = new PassThrough();
    inputStream.end(inputBuffer);

    const chunks = [];

    ffmpeg(inputStream)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("s16le")
      .on("error", reject)
      .on("end", () => {
        const rawData = Buffer.concat(chunks);
        const samples = rawData.length / 2;

        const amplitudes = [];
        for (let i = 0; i < samples; i++) {
          let val = rawData.readInt16LE(i * 2);
          amplitudes.push(Math.abs(val) / 32768);
        }

        let blockSize = Math.floor(amplitudes.length / bars);
        let avg = [];
        for (let i = 0; i < bars; i++) {
          let block = amplitudes.slice(i * blockSize, (i + 1) * blockSize);
          avg.push(block.reduce((a, b) => a + b, 0) / block.length);
        }

        let max = Math.max(...avg);
        let normalized = avg.map(v => Math.floor((v / max) * 100));

        let buf = Buffer.from(new Uint8Array(normalized));
        resolve(buf.toString("base64"));
      })
      .pipe() 
      .on("data", chunk => chunks.push(chunk));
  });
}

export default Izumi;