let handler = m => m

handler.before = async (m) => {
  if (m.text.endsWith("bot") || m.text.endsWith("Bot")  || m.text.endsWith("corazon") || m.text.endsWith("Corazon")) return m.reply("_Hmm, Doishtano? senpai!_")
}

export default handler;