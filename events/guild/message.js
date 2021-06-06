const fs = require('fs');
const readline = require('readline');
const prefix = "="

const timeout = 20000;

module.exports = async (bot, message) => { 

  if(message.author.bot || message.channel.type === "dm") return;

  //it would be here but im putting it in functions.js

  let { filterMessage } = require('../../functions.js');

  let perm = await filterMessage(message, bot.mongo);
  if(perm == true) return message.delete();


   /*Start of Level Handler

   if(!message.content.startsWith(prefix)) {



     result = await bot.mongo.db("levelling").collection("everything");
    
    
     await result.updateOne({ _id: `${message.author.id}` }, { $inc: { points: 1 } }, { upsert: true });

     let info = await result.findOne({ _id: message.author.id })

     if(!info.level) {
       await result.updateOne({ _id: `${message.author.id}` }, { $set: { level: 1 } }, { upsert: true });

       info = await result.findOne({ _id: message.author.id })
     }



     let level = info.level;
     let points = info.points;

     let nextlvl = (level + 1) * 100


     if(points >= nextlvl) {
       let embed = new bot.MessageEmbed()
       .setColor("AQUA")
       .setTitle(`Level UP`)
       .setDescription(`**${message.author} has levelled up to level ${level + 1}!**`)

       await result.updateOne({ _id: `${message.author.id}` }, { $inc: { level: 1 }, $set: { points: 0 } }, { upsert: true });


        let role = await result.findOne({ _id: `roles.${level + 1}`})
        if(role) {
         let roles = message.guild.roles.cache.find(r => r.id === role.rol)
          if(roles) {
            message.member.roles.add(roles.id)
            embed.setDescription(`**${message.author} has levelled up to level ${level + 1}, and has gotten the role ${roles}!**`)
          }
        }

       message.channel.send(embed).then(msg => {
         setTimeout(function(){msg.delete()}, 10000)
       })
     }


   }


    


   End of Level Handler */

  // start of staff message logger

  if(message.member.roles.cache.some(r => r.id === "844312739261448243")) {

    if(!message.channel.parent) return;

    if(message.channel.parent.id !== "833673194895966208") {
      result = await bot.mongo.db("staff").collection("chat");
      await result.updateOne({ _id: message.author.id }, { $inc: { msgCount: 1 } }, { upsert: true })
      await result.updateOne({ _id: message.author.id }, { $push: { msg: { message: message.content, time: Date.now().toString(), channel: message.channel.id } } }, { upsert: true })
    } 
  } else {
    result = await bot.mongo.db("general").collection("chat");
    await result.updateOne({ _id: message.author.id }, { $inc: { msgCount: 1 } }, { upsert: true })
  }

  // end of staff message logger

  // start of suggestion logger

  if(message.channel.id === "845350877111648267") {
    suggest = await bot.mongo.db("general").collection("suggestions");
    let embed = new bot.MessageEmbed()
    .setColor("#949494")
    .setTitle(`New Suggestion From ${message.author.tag}`)
    .setAuthor("SUGGESTIONS", bot.user.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 2048
    }))
    .setDescription(`\`\`\`Suggestion: \n${message.content} \`\`\` \n\n**REACT WITH <:PMC_Upvote:847454244852203530> to approve it, or <:PMC_Downvote:847454244247830549> to disapprove it.**`)
    let suggestionchannel = message.guild.channels.cache.find(r => r.id === "845361546934747136");
    if(suggestionchannel) {
      suggestionchannel.send(embed).then(c => {
        message.delete()
        c.react('<:PMC_Upvote:847454244852203530>')
        c.react('<:PMC_Downvote:847454244247830549>')

        suggest.updateOne({ _id: c.id }, { $set: { user: message.author.id, messageid: c.id, embed: embed } }, { upsert: true })
      })
    }
  }
  // end of suggestion logger



  let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();

    if(!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd))
    
    if(commandfile) commandfile.run(bot, message, args)
}