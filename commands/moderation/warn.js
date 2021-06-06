const { MessageEmbed } = require('discord.js')
const ms = require ('ms');
const { permCheck } = require('../../functions.js')
  module.exports = {
  config: {
    name: 'warning',
    aliases: ["w", "warn"],
    usage: '',
    accessableby: 'Members',
    category: 'moderation'
  },
  run: async (bot, message, args) => {
    
    result = await bot.mongo.db("punishments").collection("queue");

        let perm = await permCheck(message, false, 'warn', bot.mongo)
        if(perm === false) return message.channel.send('Not enough perms.');

        const target = message.mentions.users.first();

          const invalid = new MessageEmbed()
            .setTitle('Please specify a vaild user to warn')
            .setColor('#FF0000')

        if(!target) return message.channel.send(invalid);

        let reason = args.slice(1).join(" ");
        if(!reason) reason = "No reason given";

        let date = new Date();

        let warns = await result.findOne({ _id: target.id });
        if(!warns) {
          await result.updateOne({ _id: target.id }, { $push: { warns: {warnNumber: 1, reason: reason, moderator: message.author.id, time: date.toDateString() } } }, { upsert: true })

          let embed = new MessageEmbed()
          .setAuthor("WARNS", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          }))
          .setColor("AQUA")
          .setDescription(`**${target.username}** has been warned by **${message.author.username}** \n\n\`\`\`Reason: ${reason} \nWarning Number: 1 \nTime: ${date.toDateString()}\`\`\``)

          message.channel.send(embed)

        } else {

          
          await result.updateOne({ _id: target.id }, { $push: { warns: {warnNumber: warns.warns.length+1, reason: reason, moderator: message.author.id, time: date.toDateString() } } }, { upsert: true })

          let embed = new MessageEmbed()
          .setAuthor("WARNS", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          }))
          .setColor("AQUA")
          .setDescription(`**${target.username}** has been warned by **${message.author.username}** \n\n\`\`\`Reason: ${reason} \nWarning Number: ${warns.warns.length + 1} \nTime: ${date.toDateString()}\`\`\``)

          message.channel.send(embed)
        }
    }

  }