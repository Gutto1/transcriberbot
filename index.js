const { Client, Intents, Collection } = require('discord.js')
const { discordToken } = require('./config.json')
const fs = require('fs')

// config inicial do bot
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
client.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.data.name, command)
}

client.once('ready', () => {
  console.log('Ready!')
})

// Interação com comandos
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(err)
    await interaction.reply({ content: 'Erro ao executar o comando', ephemeral: true })
  }
})

// loga no discord
client.login(discordToken)
