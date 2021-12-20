const { Client, Intents, Collection } = require('discord.js')
const { discordToken } = require('./config.json')
const fs = require('fs')
const commands = require('./services/commands')

// config inicial do bot
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
})

client.once('ready', () => {
  console.log('Ready!')
})

// ler msgs para pegar os comandos
client.on('messageCreate', (msg) => {
  if (msg.author.bot) return //ignora mensagem de bots

  //se for comando joga pra função que lida com comandos
  if (msg.content.startsWith('!')) {
    commands.handleCommands(msg, client)
  }
})

// loga no discord
client.login(discordToken)
