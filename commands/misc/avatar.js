const { MessageEmbed } = require('discord.js')

 module.exports = {
  config: {
    name: 'avatar',
    aliases: ["pfp", "icon", "av", "profilepicture", "proficepic"],
    usage: '',
    accessableby: 'Members',
    category: 'misc'
  },
  run: async (bot, message, args) => {

    let user = message.mentions.members.first() || message.member;

    const embed = new MessageEmbed()
    .setAuthor("Profile Picture", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          }))
      .setColor("AQUA")
      .setTitle(`${user.user.username}'s Profile Picture`)
      .setImage(user.user.displayAvatarURL({ 
        dynamic: true,
        format: "png",
        size: 2048
        }))

      


            message.channel.send(embed);
    }
}