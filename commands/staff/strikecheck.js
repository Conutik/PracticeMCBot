const ms = require('ms')
const { MessageEmbed } = require ('discord.js');
const { permCheck } = require('../../functions.js')
module.exports = {
  config: {
    name: 'strikecheck',
    aliases: ["checkstrikes", "strikes"],
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'strikecheck', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');
    

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
                  value: "```strikes <user>```"
              }, {
                  name: "EXAMPLES",
                  value: "`strikes @Conutik#5777`"
              });

    let user = message.mentions.users.first();
    if(!user) return message.channel.send(invalidEmbed)
    
    

    let strikes = await result.findOne({ _id: "strikes" });

    if(!strikes) return message.channel.send('No strikes found for anyone.');

    strikes = strikes.strikes.filter(x => x.user === user.id);

    if(strikes.length < 1) {
      let embed = new bot.MessageEmbed()
      .setColor("#FF0000")
      .setAuthor("STRIKE", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          })) 
      .setDescription(`\`\`\`User ${user.username} does not have any strikes.\`\`\``)

      return message.channel.send(embed)
    }

    let desc = "\`\`\`";

    i = 0;

    strikes.forEach(x => {
      i++

      let time = new Date(x.time)
      time = time.toString().split(" ")
      time = time[0] + " " + time[1] + " " + time[2] + " " + time[3];
      var by = bot.users.cache.get(x.strikedBy);
      var bys = "Unknown";
      if(by) {
        bys = by.username;
      }
      desc = desc + `${i} \n  -Reason: ${x.reason} \n  -Expires at: ${time} \n  -Striked by: ${bys} \n  -Id: ${x.id} \n`
    })

    desc = desc+"\`\`\`";
    

      let embed = new bot.MessageEmbed()
      .setColor("BLACK")
      .setAuthor("STRIKE", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          })) 
      .setDescription(desc)


      message.channel.send(embed)
  }
}