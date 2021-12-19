const { SlashCommandBuilder } = require('@discordjs/builders')
const { joinVoiceChannel } = require('@discordjs/voice')

module.exports = {
  data: new SlashCommandBuilder().setName('join').setDescription('Entra no canal de voz'),
  async execute(interaction) {
    if (!interaction.member.voice.channelId) {
      return interaction.reply('Erro: Entre em um canal de voz primeiro!')
    }
    const channel = interaction.member.voice.channel

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: interaction.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    })

    return connection
  },
}
