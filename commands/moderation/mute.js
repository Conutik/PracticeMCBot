const { MessageEmbed } = require("discord.js")
const ms = require("ms");
const db = require('quick.db')
const color = require('../../color.json')
const { permCheck } = require('../../functions.js')
 
module.exports = {
    config: {
        name: "mute",
        description: "tempmutes a user from the server",
        usage: "(user) (time. forever for perm) (reason)",
        category: "moderation",
        accessableby: "Moderators",
        aliases: ["m"]
    },
    run: async (bot, message, args) => {


const { permCheck } = require('../../functions.js');
let perm = await permCheck(message, false, 'mute', bot.mongo)
      if(perm === false) return message.channel.send('No Perms');


let mutee = message.mentions.members.first() || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.get(args[0])


  if(!mutee) return message.channel.send("Please mention the user that you want to mute");
    if (mutee.id === message.author.id) {
      return message.reply("You can't mute yourself...");
      }
  
  let reason = args.slice(1).join(" ");
  if(!reason) reason = "No reason given"
  
  let muterole = message.guild.roles.cache.find(r => r.name === "Muted")
  if(!muterole) {
        message.guild.roles.create({
          data: {
            name: 'Muted',
          }
        }).then(role => {
          message.guild.channels.cache.forEach(x => {
            x.updateOverwrite(role, { SEND_MESSAGES: false });
          })
        })
        muterole = message.guild.roles.cache.find(r => r.name === "Muted")
      }
  mutee.roles.add(muterole).then(() => {
    message.channel.send(`${mutee.user.username} was successfully muted.`)
    })
    let embed = new MessageEmbed()
        .setColor(color.green)
        .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL)
        .addField("Moderation:", "mute")
        .addField("Mutee:", mutee.user.tag)
        .addField("Moderator:", message.author.tag)
        .addField("Reason:", reason)
        .setTimestamp()

        let chnl = message.guild.channels.cache.find(r => r.id === "709450419105038407")
        if(chnl) {
          chnl.send(embed)
        }
        
          // db.push(`punishment.${message.guild.id}.${mutee.id}`, `Type: Mute - Reason: ${reason} - Staff: ${message.author.username}`)

        let wembed = new MessageEmbed()
          .setColor(color.green)
          .setAuthor(``, message.guild.iconURL)
          .addField(`You have been muted on ${message.guild.name} by ${message.author.tag}`, `Reason: ${reason}`)
        mutee.send(wembed).catch(err => {
          return;
        })
    }
}
