const ms = require('parse-ms')
const timeout = 300000;

module.exports = {
  config: {
    name: 'create',
    aliases: ["ticketcreate"],
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'tickets'
  },
  run: async (bot, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send('No Perms')

    result = await bot.mongo.db("tickets").collection("messages");

      let embed = new bot.MessageEmbed()
      .setColor("GREEN")
      .setTitle('TICKETS')
      .setDescription('React with :e_mail: to open a support ticket.')


      message.channel.send(embed).then(async x => {
        x.react('📧')

        await result.updateOne({ _id: x.id }, { $set: { ticket: true, emoji: '📧' }}, { upsert: true })
      })
    
    

  }
}