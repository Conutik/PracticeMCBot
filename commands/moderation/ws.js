const { MessageEmbed } = require('discord.js')
const { permCheck } = require('../../functions.js')
  module.exports = {
  config: {
    name: 'warnings',
    aliases: ["warns"],
    usage: '',
    accessableby: 'Members',
    category: 'moderation'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'warns', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');

    result = await bot.mongo.db("punishments").collection("queue");

    let embed = new MessageEmbed()
    

    let user = message.mentions.members.first() || message.member;

    let warns = await result.findOne({ _id: user.id });

    if(!warns) {
      info = `**${user.user.username}'s Warns:**\n`;
      embed.setTitle(info)
      embed.setColor("GREEN")
      embed.setDescription(`\`\`\`No warns found for ${user.user.username}\`\`\``)

      message.channel.send(embed)
    } else { 

      info = `**${user.user.username}'s Warns:**\n`;

      //warnNumber: warns.warns.length+1
      // reason: reason
      // moderator: message.author.id
      // time: date.toDateString()

      warns.warns.forEach(x => {
        info = `${info} \n**${x.warnNumber}:** \`\`\`Reason: ${x.reason} \nModerator: ${x.moderator} \nDate: ${x.time}\`\`\``;
      })

      embed.setColor("RED")
      embed.setDescription(info)

      message.channel.send(embed)
    }
    }
  }