
<p align="center">
  <img src="https://files.catbox.moe/caaoet.jpg" width="250"/>
</p>

<h1 align="center">Kashiwada-MultiDevice - WhatsApp Bot</h1>


---

## 👤 Owner

> GitHub: [izuku-mii](https://github.com/izuku-mii.png)  
> Project: **Kashiwada-MultiDevice WhatsApp Bot**

---

> Bot WhatsApp modular yang kuat menggunakan JavaScript, dibuat dengan sistem plugin untuk fleksibilitas maksimal. Terinspirasi oleh **Kashiwada-san** dari *Kao ni Denai Kashiwada-san to Kao ni Deru Oota-kun*, bot ini menghadirkan semangat dan disiplin dalam obrolan Anda!

---

## 📌 Features

- Arsitektur berbasis plugin
- Ditulis dalam JavaScript
- Kompatibel dengan ESModule
- Pembuatan perintah yang mudah
- Terinspirasi oleh karakter anime kashiwada

---

## ⚙️ nama config.expired.js ganti ke config.js
## ⚙️ nama database.expired.js ganti ke database.js

## ⚙️ Install
```bash
$ git clone https://github.com/izuku-mii/Kashiwada-MultiDevice
$ cd Kashiwada-MultiDevice
$ npm install
$ npm start
```

## ⚙️ Kalo Play Sama Fitur Downloader YouTube Ku Saranin Vps Nya Legal Atau Bagus Kalo Do Gini
```tutorial
1. Download Firefox atau Browser Lain
2. Download Extension get cookies.txt Locally
3. Taro Di file cookies.js tadi

Selamat Mencoba Ingat Jangan Malas Yang Malas Atur Sendiri😒
```

## 🌐 Example Plugin File
## 🧠 Example Plugin (No Regex)

```javascript
let handler = async (m, { conn, text, args usedPrefix, command }) => {
  // code
};

handler.command = ['expired', 'exp'];
handler.help = ['expired', 'exp'];
handler.tags = ['run'];
handler.limit = false;
handler.loading = false;
hendler.mods = false
handler.rowner = false;
handler.group = false;
handler.premium = false;
handler.admin = false;
handler.register = false;
handler.botAdmin = false;

export default handler;
```

---

## ⚡ Example Plugin (With Regex)

```javascript
let handler = async (m, { conn, text, args usedPrefix, command }) => {
  // code
};

handler.command = /^(expired|exp)$/i;
handler.help = ['expired', 'exp'];
handler.tags = ['run'];
handler.limit = false;
handler.loading = false;
hendler.mods = false
handler.rowner = false;
handler.group = false;
handler.premium = false;
handler.admin = false;
handler.register = false;
handler.botAdmin = false;

export default handler;
```

---

## 💡 Command Fitur Plugin

```Plugin
.lp - buat liat list plugins
.sp file/file.js
.gp file/file.js
.dp file/file.js
```

---

## 💡 Menu Command

```
.menu       - Show main menu
.menu all   - Show all commands
.menu tags  - Show commands by tags
```

---

### Thx Atau Fungsi Di Script Atau Fitur
| [![ShirokamiRyzen](https://github.com/ShirokamiRyzen.png?size=100)](https://github.com/ShirokamiRyzen) | [![naruyaizumi](https://github.com/naruyaizumi.png?size=100)](https://github.com/naruyaizumi) | [![AndhikaGG](https://github.com/AndhikaGG.png?size=100)](https://github.com/AndhikaGG) |
|:--:|:--:|:--:|
| **[ShirokamiRyzen](https://github.com/ShirokamiRyzen)**<br/>Base Original | **[naruyaizumi](https://github.com/naruyaizumi)**<br/>Fungsi Base / Fungsi Di Script | **[AndhikaGG](https://github.com/AndhikaGG)**<br/>Penyumbang fitur |

> *"Hmmm...."*
