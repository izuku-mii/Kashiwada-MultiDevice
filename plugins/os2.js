import os from 'os'
import osu from 'node-os-utils'

const cpu = osu.cpu
const mem = osu.mem
const drive = osu.drive
const osUtil = osu.os

let handler = async (m) => {
  let totalMem = os.totalmem()
  let freeMem = os.freemem()
  let usedMem = totalMem - freeMem

  let driveInfo = await drive.info()
  let cpuModel = os.cpus()[0]?.model || 'Unknown CPU'
  let coreCount = await cpu.count()

  let uptimeOS = os.uptime()
  let runtime = process.uptime()

  let teks = `
❄️ *Alya Kujou — System Monitor*

╭─🖥️ *OS*
│ ${osUtil.platform()} ${os.release()}
│
├─🧠 *RAM*
│ ${progressBar(usedMem, totalMem)}
│ ${formatGB(usedMem)} / ${formatGB(totalMem)} GB
│
├─💽 *Storage*
│ ${progressBar(driveInfo.usedGb, driveInfo.totalGb)}
│ ${driveInfo.usedGb} / ${driveInfo.totalGb} GB
│
├─🔧 *CPU*
│ ${coreCount} Cores
│ ${cpuModel}
│
├─⏱️ *Uptime OS*
│ ${formatTime(uptimeOS)}
│
├─📆 *Runtime Bot*
│ ${Math.floor(runtime / 3600)} jam
│
╰─ Не пойми неправильно…
   aku cuma memantau sistem.
   Bukan karena kamu 😒
`.trim()

  await m.reply(teks)
}

handler.customPrefix = /^(os|p|system)$/i
handler.command = new RegExp

export default handler

function formatGB(bytes) {
  return (bytes / (1024 ** 3)).toFixed(2)
}

function progressBar(used, total, length = 10) {
  let percent = used / total
  let filled = Math.round(percent * length)
  return `[${'█'.repeat(filled)}${'░'.repeat(length - filled)}]`
}

function formatTime(seconds) {
  let h = Math.floor(seconds / 3600)
  let m = Math.floor((seconds % 3600) / 60)
  let s = Math.floor(seconds % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
