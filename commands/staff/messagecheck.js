const ms = require('ms')
const { MessageEmbed } = require ('discord.js');
const { permCheck } = require('../../functions.js')
module.exports = {
  config: {
    name: 'messagescheck',
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

    let i = 0;
    
    role.members.forEach(async user => {
      i++
      let thing = await result.findOne({ _id: user.id })
      if(!thing) return desc = desc + `\n${user} ~ 0 messages`;

      desc = `${desc}\n${user.name} ~ ${thing.msgCount} messages`
      message.channel.send(`${user.user.username} ~ ${thing.msgCount} messages`)
    })

    // message.channel.send(desc)

    

  }
}

