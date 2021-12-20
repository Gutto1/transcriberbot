const {
  joinVoiceChannel,
  getVoiceConnection,
  entersState,
  VoiceConnectionStatus,
  EndBehaviorType,
} = require('@discordjs/voice')
const { GuildMember } = require('discord.js')
const fs = require('fs')
const prism = require('prism-media')

const joinChannel = async (command, client) => {
  if (command.member instanceof GuildMember && command.member.voice.channel) {
    const connection = joinVoiceChannel({
      channelId: command.member.voice.channelId,
      guildId: command.member.voice.guild.id,
      adapterCreator: command.member.voice.channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true,
    })

    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 20e3)
      command.reply('Conectado!')
      const rec = connection.receiver

      rec.speaking.on('start', async (userId) => {
        const user = client.users.cache.get(userId)
        console.log('listening to: ', user.username)
        const opusStream = rec.subscribe(userId, {
          end: {
            behavior: EndBehaviorType.AfterSilence,
          },
        })
        const decoder = new prism.opus.Decoder({
          frameSize: 960,
          channels: 1,
          rate: 48000,
        })
        const rawAudio = opusStream.pipe(decoder)
        const buffers = []
        for await (const chunk of rawAudio) {
          buffers.push(chunk)
        }
        const buffer = Buffer.concat(buffers)
        const duration = buffer.length / 48000 / 4
        if (duration < 1 || duration > 19) {
          console.log('Muito curto / Muito longo, pula')
          return
        }
        // transcrever e retornar
      })
    } catch (e) {
      console.warn(e)
      await command.reply('Falhei em me conectar ao canal de voz =( tente mais tarde')
    }
  } else {
    command.reply('Conecte-se a um canal de voz!')
    return
  }
}

const leaveChannel = (command) => {
  const connection = getVoiceConnection(command.member.voice.guild.id)
  connection.destroy()
}

module.exports = {
  handleCommands: (command, client) => {
    switch (command.content.toLowerCase()) {
      case '!join':
        joinChannel(command, client)
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
