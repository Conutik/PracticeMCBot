const { MessageEmbed } = require ('discord.js');
const { permCheck } = require('../../functions.js')
module.exports = {
  config: {
    name: 'delstrike',
    aliases: ["removestrike"],
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'removestrike', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');

    // use the custom perm check idiot
    // i was going to do that in beginning but then i wasnt sure if i want mods with admin perms to do it.

    // they have admin perms, I think that means duff has to deal with it xD
    // ok    

    result = await bot.mongo.db("staff").collection("strikes");

    const invalidEmbed = new bot.MessageEmbed()
              .setAuthor("Strikes", bot.user.displayAvatarURL({
                  format: "png",
                  dynamic: true,
                  size: 2048
              }))
              .setColor("#eb0936")
              .setTitle("Invalid Arguments")
              .addFields({
                  name: "USAGE",
                  value: "```delstrike <id>```"
              }, {
                  name: "EXAMPLES",
                  value: "`delstrike tg7`"
              });

    if(!args[0]) return message.channel.send(invalidEmbed)
    
    

    let strikes = await result.findOne({ _id: "strikes" });

    if(!strikes) return message.channel.send('No strikes found for anyone.');

    var strikes2 = strikes.strikes.filter(x => x.id === args[0]);

    if(strikes2.length <= 0) {
      let embed = new bot.MessageEmbed()
      .setColor("#FF0000")
      .setAuthor("STRIKE", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          })) 
      .setDescription("```Strike not found!```")

      return message.channel.send(embed)
    }
    
    strikes = strikes.strikes.filter(x => x.id !== args[0]);
    await result.updateOne({_id: "strikes"}, {$set: {strikes}})

      let embed = new bot.MessageEmbed()
      .setColor("#ef2019")
      .setAuthor("STRIKE", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          })) 
      .setDescription("```Strike removed!```")


      message.channel.send(embed)
  }
}