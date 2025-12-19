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
 * @RENAME      HANZOFFC 
 * @NOTE        SEMOGA YANG COLONG SCRIPT INI DAPET HIKMAH DAN TOBAT 🙏
 * 
 * @COPYRIGHT   © 2025 IZUKU-MII | All Rights Free.
 */

import './config.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { createRequire } from 'module';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import pino from "pino"

const logger = pino({
    level: "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "HH:MM",
            ignore: "pid,hostname",
        },
    },
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, author, version } = require(join(__dirname, './package.json'));

const [major] = process.versions.node.split('.').map(Number);

if (major < 20) {
  logger.error("Node Mu Harus Versi 20!")
  process.exit(1);
};

logger.info(`Welcome To`);
logger.debug(`Script: ${name} Baileys Bot Wa Creator: ${author}`);
logger.info(`Base Script: Nao-MD Author: Ryzumi`)

async function sleep(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

await sleep(500);
const tablet = {
  nameScript: name,
  author: author,
  node: major,
  version: version
};

console.table(tablet)

await sleep(700);
logger.info(`Okay, Start Index.js Welcome To Script: ${name} Please Enjoy the Script!`)

var isRunning = false;

/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;

  let args = [join(__dirname, file), ...process.argv.slice(2)];

  setupMaster({ exec: args[0], args: args.slice(1) });
  let p = fork();

  p.on('exit', (_, code) => {
    isRunning = false;
    logger.error('Exited with code:', code);
    if (code !== 0) {
      logger.info('Restarting worker due to non-zero exit code...');
      return start(file);
    }

    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });
}

start('main.js');
