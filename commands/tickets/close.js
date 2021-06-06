const ms = require('parse-ms')
const timeout = 300000;

module.exports = {
  config: {
    name: 'close',
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'tickets'
  },
  run: async (bot, message, args) => {

    use = await bot.mongo.db("tickets").collection("users");

    if(!message.channel.parent === "「TICKETS」") return message.channel.send('You can only close tickets');

    let ticket = await use.findOne({ ticketid: message.channel.id })
    console.log(ticket)
    if(!ticket) return message.channel.send("You may only close tickets.")

    await use.deleteOne({ _id: ticket._id })

    let msg1 = new bot.MessageEmbed()
    .setAuthor("TICKETS", bot.user.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 2048
    }))
    .setColor("AQUA")
    .setTitle(`Ticket`)
    .setDescription("**Ticket will close in 15 seconds.**")

    message.channel.send(msg1)

    setTimeout(function(){ message.channel.delete() }, 15000)
    
    

  }
}