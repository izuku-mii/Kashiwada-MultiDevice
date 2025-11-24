import util from 'util'
import fs from 'fs/promises'
import path from 'path'
import {
    pathToFileURL
} from 'url'
import crypto from 'crypto'

const tmpDir = './.eval-tmp'

export default async function handler(m, _2) {
    const {
        conn,
        noPrefix
    } = _2
    let _return = null
    let _syntax = ''
    let _text = noPrefix.trim()
    const old = m.exp * 1

    const importLines = []
    const bodyLines = []

    for (const line of _text.split('\n')) {
        if (/^\s*import\s.+from\s.+/.test(line)) importLines.push(line)
        else bodyLines.push(line)
    }

    const isAsyncIIFE = m.text.startsWith('^π')

    let moduleContent;
    if (isAsyncIIFE) {
        moduleContent = `import util from 'util'

export default async ({ m, conn, argument }) => {
return ${bodyLines.join('\n')}
}`.trim();
    } else {

        moduleContent = `
${importLines.join('\n')}
import util from 'util'

export default async ({ m, conn, argument }) => {
${bodyLines.join('\n')}
}
`.trim();
    };

    const filename = `.eval-${crypto.randomUUID()}.mjs`
    const filepath = path.resolve(tmpDir, filename)

    try {
        await fs.mkdir(tmpDir, {
            recursive: true
        })
        await fs.writeFile(filepath, moduleContent)

        const imported = await import(pathToFileURL(filepath).href + `?t=${Date.now()}`)
        _return = await imported.default({
            m,
            conn,
            argument: [conn, _2]
        })
    } catch (e) {
        _return = e
    } finally {
        await fs.unlink(filepath).catch(() => {})
        m.reply(`📤 output:\n\n\`\`\`${_syntax + util.format(_return)}\`\`\``)
        m.exp = old
    }
}

handler.help = ['π <code>']
handler.tags = ['owner']
handler.command = /(?:)/i
handler.rowner = true
handler.customPrefix = /^(\^?π)\s*/