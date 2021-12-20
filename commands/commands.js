const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice')
const fs = require('fs')

const joinChannel = (command) => {
  const connection = joinVoiceChannel({
    channelId: command.member.voice.channelId,
    guildId: command.member.voice.guild.id,
    adapterCreator: command.member.voice.channel.guild.voiceAdapterCreator,
    selfDeaf: false,
  })
}

const leaveChannel = (command) => {
  const connection = getVoiceConnection(command.member.voice.guild.id)
  connection.destroy()
}

module.exports = {
  handleCommands: (command) => {
    switch (command.content.toLowerCase()) {
      case '!join':
        joinChannel(command)
        command.reply('Conectado!')
        break
      case '!leave':
        leaveChannel(command)
        command.reply('Conexão encerrada, até a próxima!')
        break
      case '!lang':
        console.log('Comando lang')
        break
      default:
        console.log('Comando inexistente!')
        break
    }
  },
}

// module.exports = {
//   data: new SlashCommandBuilder().setName('join').setDescription('Entra no canal de voz'),
//   async execute(interaction) {
//     if (!interaction.member.voice.channelId) {
//       return interaction.reply('Erro: Entre em um canal de voz primeiro!')
//     }
//     const channel = interaction.member.voice.channel

//     const connection = joinVoiceChannel({
//       channelId: channel.id,
//       guildId: interaction.guild.id,
//       adapterCreator: channel.guild.voiceAdapterCreator,
//     })

//     return connection
//   },
// }
