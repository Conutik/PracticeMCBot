const ms = require('parse-ms')
const timeout = 300000;
const { MessageEmbed } = require('discord.js')
const { permCheck } = require('../../functions.js')

module.exports = {
  config: {
    name: 'roleadd',
    aliases: ["role", "addrole", "ticketrole", "ticket-role", "roleticket", "role-ticket"],
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'tickets'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'ticketrole', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');

    result = await bot.mongo.db("tickets").collection("roles");

    let role = message.guild.roles.cache.find(r => r.name == args[0]) || message.guild.roles.cache.find(r => r.id == args[0]) || message.mentions.roles.first()
    if(!role) return message.channel.send('Please run the command with a valid role');

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
      .setDescription(`${role.name} now have the ability to see tickets!`)


      message.channel.send(embed)

        await result.updateOne({ _id: "roles" }, { $push: { roles: role.id }}, { upsert: true });
    
    

  }
}