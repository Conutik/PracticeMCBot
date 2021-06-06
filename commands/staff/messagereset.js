const ms = require('ms')
const { MessageEmbed } = require ('discord.js');
const { permCheck } = require('../../functions.js')
module.exports = {
  config: {
    name: 'messagesreset',
    aliases: ["messagereset"],
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'messages', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');

    result = await bot.mongo.db("staff").collection("chat");
    
    let role = await message.guild.roles.cache.find(r => r.id == "844312739261448243");

    let desc = "";
    
    role.members.forEach(async user => {

      await result.updateOne({ _id: user.id }, { $set: { msgCount: 0 } }, { upsert: true })
    })

    message.channel.send('Done')

    

  }
}

