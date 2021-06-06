const ms = require('parse-ms')
const timeout = 300000;
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: 'category',
    aliases: ["categoryset"],
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'tickets'
  },
  run: async (bot, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('No Perms');

    result = await bot.mongo.db("tickets").collection("roles");

    let role = message.guild.channels.cache.find(channel => channel.type === "category" && channel.id === args[0]);
    if(!role) return message.channel.send('Please run the command with a valid channel');

    let check = await result.findOne({ _id: "roles" })
    if(check) {
      if(check.roles.includes(role.id)) {
        return message.channel.send('This role already has the ability to see tickets.');
      }
    }


      let embed = new MessageEmbed()
      .setAuthor("TICKETS", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          }))
      .setColor("AQUA")
      .setTitle("Role added")
      .setDescription(`**${role.name}** will now have the tickets from this channel.`)


      message.channel.send(embed)

        await result.updateOne({ _id: message.channel.id }, { $set: { cata: role.id }}, { upsert: true });
    
    

  }
}