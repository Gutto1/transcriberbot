const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { clientId, discordToken, guildId } = require('./config.json')

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Returns Pong'),
  new SlashCommandBuilder().setName('server').setDescription('Return server info'),
  new SlashCommandBuilder().setName('user').setDescription('Return user info'),
].map((command) => command.toJSON())

const rest = new REST({ version: '9' }).setToken(discordToken)

rest
  .get(Routes.applicationGuildCommands(clientId, guildId))
  .then((data) => {
    const promises = []
    for (const command of data) {
      const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`
      promises.push(rest.delete(deleteUrl))
    }
    return Promise.all(promises)
  })
  .catch((err) => console.error(err))
