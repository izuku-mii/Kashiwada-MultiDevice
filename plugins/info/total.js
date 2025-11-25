let oota = async (m) => {
    const fileAll = Object.keys(pg.plugins);

    const pluginFile = [];
    for (let fold of fileAll) {
        if (!fold.endsWith('.js')) continue;
        pluginFile.push(pg.plugins[fold]);
    };

    const tags = new Set();

    for (let v of pluginFile) {
        if (Array.isArray(v.tags)) {
            for (let t of v.tags) tags.add(t);
        };
    };

    let fitur = 0;

    for (let v of pluginFile) {
        fitur += (v.help?.length || 0)
    };

    m.reply(`〆 ━━━[TOTAL FITUR/TAGS]━━━〆
     々 Fitur: ${fitur}
     々 Tags: ${tags.size}
〆 ━━━━━━━━━━━━━〆`);
};

oota.help = ["total", "totalfitur", "totaltags"];
oota.command = /^(total|totalfitur|totaltags)$/i;
oota.info = ["info"];

export default oota;