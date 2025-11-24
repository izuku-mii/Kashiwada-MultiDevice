const izumi = async (m) => {
    const old = new Date()
    m.reply(Func.Styles(`☘️ Pong!\nResponse time: ${((new Date() - old) *  1)}ms`));
};

izumi.command = ['ping'];
izumi.help = ['ping'];
izumi.tags = ['run'];

export default izumi;