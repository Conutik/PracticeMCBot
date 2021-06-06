const { MessageEmbed } = require ('discord.js');
const fetch = require('node-fetch')
const { permCheck } = require('../../functions.js')
module.exports = {
  config: {
    name: 'automod',
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'automod', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');

  }
}