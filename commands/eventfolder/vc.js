const { MessageEmbed } = require('discord.js')
const ms = require ('ms');
module.exports = {
  config: {
    name: 'join',
    aliases: ["j", "eventjoin"],
    usage: '',
    accessableby: 'Members'
  },
  run: async (bot, message, args) => {
    const non = new MessageEmbed()
      .setTitle('Stop non you cant do this. Event has not started yet.')

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(non)

    //result = await bot.mongo.db("name of folder").collection("name of collection"); idk if I did this right lol
    
    message.channel.send('worked');
    const embed = new MessageEmbed()
      .setTitle('Did this work?')
      .setColor('Aqua')
      .setDecription('ur an idiot')
      .setFooter('lel')

      message.channel.send(embed)
  }
 }


 //Can you create a new collections folder for this event like a main folder called events and under that folder files or folders idk that are named for each corrisponding event. Just dm me with yes or no also I do have access to the database. If you do just name it Events or something then inside make it called LastToLeaveVC or something idk just so I can use that collection for this event