const ms = require('ms')
const { permCheck } = require('../../functions.js')

module.exports = {
  config: {
    name: 'strike',
    usage: '(ign)',
    description: "Strike staff members for doing stuff wrong lol",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'strike', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');

    result = await bot.mongo.db("staff").collection("strikes");

    const invalidEmbed = new bot.MessageEmbed()
              .setAuthor("Strike", bot.user.displayAvatarURL({
                  format: "png",
                  dynamic: true,
                  size: 2048
              }))
              .setColor("#eb0936")
              .setTitle("Invalid Arguments")
              .addFields({
                  name: "USAGE",
                  value: "```strike <user> <time> [reason]```"
              }, {
                  name: "EXAMPLES",
                  value: "`strike @Conutik#5777 10d Not being Cool`"
              });

    let user = message.mentions.users.first();
    if(!user) return message.channel.send(invalidEmbed)

    if(!args[1]) return message.channel.send(invalidEmbed);

    let time = ms(args[1]);

    if(!time) return message.channel.send(invalidEmbed);

    time = Date.now() + time;

    let reason = args.slice(2).join(" ");
    if(!reason) reason = "No Reason Specified";

    let letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()".split("")
    code = [];

    for(i =0; i < 4; i++) {
      let num = Math.floor((Math.random() * 72) + 1);
      code.push(letters[num])
    }

    code = code.join("");
  

    await result.updateOne({ _id: "strikes" }, { $push: { strikes: { user: user.id, reason: reason, time: time, id: code, strikedBy: message.author.id } } }, { upsert: true });

    let number = 1;

    let writtentime = new Date(time)
    writtentime = writtentime.toString().split(" ")
    writtentime = writtentime[0] + " " + writtentime[1] + " " + writtentime[2] + " " + writtentime[3];
    

      let embed = new bot.MessageEmbed()
      .setColor("BLACK")
      .setAuthor("STRIKE", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          })) 
      .setDescription(`\`\`\`${user.username} has recieved a strike. \n  -Strike Number: ${number} \n  -Reason: ${reason} \n  -Expires at: ${writtentime} \`\`\``)


      message.channel.send(embed)
    
    
    
    

  }
}