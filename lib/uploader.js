import fetch from 'node-fetch';
import FormData from 'form-data';
import cloudku from 'cloudku-uploader';
import {
    fileTypeFromBuffer
} from "file-type"
// Module Versi Lama
// import fileType from "file-type*;
import axios from 'axios';
import fs from 'fs';
import chalk from 'chalk';
import crypto from 'crypto';

const i = Math.floor(Math.random() * global.git.owner.length)

const owner = global.git.owner[i]
const githubToken = global.git.token[i]

const branch = 'main'

let repos = [
    'dat1',
    'dat2',
    'dat3',
    'dat4'
]

async function ensureRepoExists(repo) {
    try {
        await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
            headers: {
                Authorization: `Bearer ${githubToken}`
            }
        })
    } catch (e) {
        if (e.response?.status === 404) {
            await axios.post(
                `https://api.github.com/user/repos`, {
                    name: repo,
                    private: false
                }, {
                    headers: {
                        Authorization: `Bearer ${githubToken}`
                    }
                }
            )
            if (!repos.includes(repo)) repos.push(repo)
        } else throw e
    }
}

function generateRepoName() {
    return `dat-${crypto.randomBytes(3).toString('hex')}`
}

const file = async (buffer) => {

    // versi lama fungsi :v
    // const { ext } = await fileType.fromBuffer(buff)
    const {
        ext
    } = await fileTypeFromBuffer(buffer);
    const filename = 'izumi-' + Date.now() + '.' + ext;
    return {
        filename,
        ext
    };
};

export default {
    top4top: async function top4top(buffer) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!buffer) return console.warn('Mana Buffer Nya !');
                const origin = 'https://top4top.io';
                const data = new FormData();
                const {
                    filename,
                    ext
                } = await file(buffer);
                data.append('file_1_', buffer, {
                    filename
                });
                data.append('submitr', '[ رفع الملفات ]');

                const options = {
                    method: 'POST',
                    body: data
                };

                console.log('uploading file.. ' + filename)
                const r = await fetch(origin + '/index.php', options)
                if (!r.ok) throw Error(`${r.status} ${r.statusText}\n${await r.text()}`)
                const html = await r.text()
                const matches = html.matchAll(/<input readonly="readonly" class="all_boxes" onclick="this.select\(\);" type="text" value="(.+?)" \/>/g)
                const arr = Array.from(matches)
                if (!arr.length) throw Error(`gagal mengupload file`)
                const downloadUrl = arr.map(v => v[1]).find(v => v.endsWith(ext))
                const deleteUrl = arr.map(v => v[1]).find(v => v.endsWith('html'))
                const qrcodeUrl = origin + '/' + html.match(/<div class="qr_img"><img src="(.+?)"/)?.[1]
                const result = {
                    downloadUrl,
                    deleteUrl,
                    qrcodeUrl
                }
                resolve(result);
            } catch (e) {
                reject({
                    msg: 'Gomene Error Tourl'
                });
                console.error('Error', e);
            };
        });
    },

    ryzumi: async function ryzumi(buffer) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!buffer) return console.warn('Mana Buffer Nya !');

                const {
                    filename
                } = await file(buffer);
                const data = new FormData();
                data.append('file', buffer, {
                    filename
                });

                const {
                    data: ryzumi
                } = await axios.post('https://api-02.ryzumi.vip/api/uploader/ryzencdn', data, {
                    headers: {
                        ...data.getHeaders(),
                        referrer: "https://api.ryzumi.vip/"
                    }
                })
                resolve(ryzumi);
            } catch (e) {
                reject({
                    msg: 'Gomene Error Tourl'
                });
                console.error('Error', e);
            };
        });
    },

    cloudku: async function(buffer) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    filename
                } = await file(buffer);
                resolve(await cloudku.uploadFile(buffer, filename));
            } catch (err) {
                reject({
                    msg: 'Gomene Error Tourl'
                });
                console.error('Error', err);
            };
        });
    },

    catbox: async function(buffer) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    filename
                } = await file(buffer);
                const data = new FormData();
                data.append('reqtype', 'fileupload');
                data.append('userhash', '');
                data.append('fileToUpload', buffer, {
                    filename
                });

                const api = await axios.post('https://catbox.moe/user/api.php', data, {
                    headers: {
                        ...data.getHeaders(),
                        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0'
                    }
                });

                resolve(api.data);
            } catch (err) {
                reject({
                    msg: 'Gomene Error Tourl'
                });
                console.error('Error', err);
            }
        });
    },

    github: function uploadFile(buffer) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    ext
                } = await file(buffer);
                const code = crypto.randomBytes(3).toString('hex')
                const fileName = `${code}-${Date.now()}.${ext}`
                const filePathGitHub = `uploads/${fileName}`

                const base64Content = Buffer.from(buffer).toString('base64')

                let targetRepo = repos[Math.floor(Math.random() * repos.length)]

                try {
                    await ensureRepoExists(targetRepo)
                } catch {
                    targetRepo = generateRepoName()
                    await ensureRepoExists(targetRepo)
                }

                await axios.put(
                    `https://api.github.com/repos/${owner}/${targetRepo}/contents/${filePathGitHub}`, {
                        message: `Upload file ${fileName}`,
                        content: base64Content,
                        branch
                    }, {
                        headers: {
                            Authorization: `Bearer ${githubToken}`
                        }
                    }
                )

                resolve(`https://raw.githubusercontent.com/${owner}/${targetRepo}/${branch}/${filePathGitHub}`);
            } catch (err) {
                reject({
                    msg: 'Gomene Error Tourl'
                });
                console.error('Error', err);
            }
        });
    },

    uguu: async function(buffer) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    filename
                } = await file(buffer);
                const data = new FormData();
                data.append('files[]', buffer, {
                    filename
                });

                const api = await axios.post('https://uguu.se/upload.php', data, {
                    headers: {
                        ...data.getHeaders(),
                        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                        "Referer": "https://uguu.se/"
                    }
                });

                resolve(api.data);
            } catch (err) {
                reject({
                    msg: 'Gomene Error Tourl'
                });
                console.error('Error', err);
            }
        });
    },

    tempfiles: async function(buffer) {
        return new Promise(async (resolve, reject) => {
            try {
                const {
                    filename
                } = await file(buffer);
                const data = new FormData();
                data.append('file', buffer, {
                    filename
                });

                const {
                    data: api
                } = await axios.post('https://tmpfiles.org/api/v1/upload', data, {
                    headers: {
                        ...data.getHeaders(),
                        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
                        "Referer": "https://tmpfiles.org/"
                    }
                });

                const match = /tmpfiles\.org\/([^"]+)/.exec(api.data.url);
                resolve('https://tmpfiles.org/dl/' + match[1]);
            } catch (err) {
                reject({
                    msg: 'Gomene Error Tourl'
                });
                console.error('Error', err);
            }
        });
    }
}


const filee = new URL(import.meta.url);
fs.watchFile(filee, () => {
    fs.unwatchFile(filee);
    console.log(chalk.redBright(`Update 'uploader.js'`));
});
