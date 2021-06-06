const { MessageEmbed } = require('discord.js')
const randomstring = require("randomstring");


module.exports = async (bot, reaction, user) => {

  if(user.bot) return;


  result = await bot.mongo.db("tickets").collection("messages");

  results = await bot.mongo.db("tickets").collection("roles");

  use = await bot.mongo.db("tickets").collection("users");

  suggest = await bot.mongo.db("general").collection("suggestions");

  let messageid = reaction.message.id

  let chan = reaction.message.channel;
  let guilds = reaction.message.channel.guild
  

  let guild = bot.guilds.cache.get(guilds.id)

  let check = await result.findOne({ _id: messageid })
  if(!check) {
    // suggest.updateOne({ _id: c.id }, { $set: { user: message.author.id, messageid: c.id } }, { upsert: true })
    let sug = await suggest.findOne({ _id: messageid })
    if(!sug) return;
    
    if(reaction.emoji.name === 'PMC_Upvote') {
      let embed = sug.embed
      embed.color = "GREEN"
      reaction.message.edit({ embed: embed })
      embed.color = "BLACK"
      let sc = guilds.channels.cache.find(r => r.id === "845350877111648267");
      embed.title = embed.title.split(" ")
      embed.title = embed.title.slice(1)
      console.log(embed.title)
      embed.title = embed.title.join(" ")
      sc.send({ embed: embed }).then(c => {
        c.react('<:PMC_Upvote:847454244852203530>')
        c.react('<:PMC_Downvote:845346528004276285>')
      })
      suggest.deleteOne({ _id: messageid })
    } else if(reaction.emoji.name === 'PMC_Downvote') {
      let embed = sug.embed
      embed.color = "RED"
      reaction.message.edit({ embed: embed })

      let embed2 = new MessageEmbed()
      .setColor("#949494")
      .setAuthor("SUGGESTIONS", bot.user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 2048
      }))
      .setDescription(`Your suggestion has been disapproved by the staff team. \nThis maybe due to the following reasons: \n \n- It has already been seen before in this channel. \n- Developers will be unable to implement it so there is no point of it being here. \n- It may have been saved! Suggestions with over 10 upvotes are saved in a private channel! \n- It is a silly suggestion that we do not think should be displayed to the public. \n- It was a random topic and not helpful or would contribute to our server in any way, shape or form.`)
      let user = guilds.members.cache.find(r => r.id === sug.user);
      if(user) {
        user.send(embed2)
      }
      suggest.deleteOne({ _id: messageid })
    }
  } else {

  console.log(check)

  if(!check.ticket === true) return;

  if(!reaction.emoji.name === '📧') return;


  reaction.message.reactions.cache.get('📧').users.remove(user);

  let category = null;

  let ch = await results.findOne({ _id: chan.id })
  if(!ch) {

  const { cataCheck } = require('../../functions.js')


  cataCheck(guild);

  category = guild.channels.cache.find(channel => channel.type === "category" && channel.name === "「TICKETS」");

  } else {
    category = ch.cata;
  }


  let exist = new MessageEmbed()
    .setAuthor("TICKETS", bot.user.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 2048
    }))
    .setColor("#eb0936")
    .addFields({
      name: "ERROR",
      value: "```You already have an open ticket```"
    });

  let msg1 = new MessageEmbed()
    .setAuthor("TICKETS", bot.user.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 2048
    }))
    .setColor("#eb0936")
    .setTitle(`${user.username}'s Ticket`)
    .setDescription("**Welcome to PracticeMC's support tickets. \nPlease wait until a staff member reviews your ticket**")


  let cd = await use.findOne({ _id: user.id })

  if(cd) {
    if(cd.current === true) return user.send(exist)
  } else {
    
    const num = randomstring.generate({
      length: 5,
      charset: 'numeric'
    });
    guild.channels.create(`ticket-${num}`, {
        type: 'text',
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone,
            deny: ['VIEW_CHANNEL'],
          }
        ],
    }).then(async chnl => {

      await use.updateOne({ _id: user.id }, { $set: { current: true, ticketid: chnl.id } }, { upsert: true })

      chnl.updateOverwrite(user, { 
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGE_HISTORY: true,
        ATTACH_FILES: true
      });

      let roles = await results.findOne({ _id: "roles" })
      if(roles) {

      roles.roles.forEach(x => {
                    
        let role = guild.roles.cache.find(r => r.id === x)
        if(!role) return;
        
        chnl.updateOverwrite(role, { 
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          READ_MESSAGE_HISTORY: true,
          ATTACH_FILES: true
        });


      })
      }

      chnl.setTopic(`Support Ticket ${num}`)

      


      chnl.send(msg1)


    })
  }
  }
}