const { MessageEmbed } = require('discord.js');
const { Long } = require('mongodb');

function sendEmbed(channel, color, title, description) {
  channel.send(new MessageEmbed().setColor(color).setTitle(title).setDescription(description));
}

module.exports = {
  config: {
    name: 'setrank',
    aliases: ["sr", "playerrank"],
    usage: '<ign> <rank>',
    description: "Set rank of someone",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    if(args.length>=2) {
      if(message.member.hasPermission('ADMINISTRATOR')) {

        const correctRanks = ['PLAYER', 'VIP', 'ULTRA', 'LEGEND', 'CRYSTAL', 'YOUTUBE', 'TWITCH', 'BUILDER', 'HELPER', 'MOD', 'ADMIN', 'DEV', 'MANAGER', 'OWNER'];

        if(correctRanks.includes(args[1].toUpperCase())) {
          
          var asId = args[0].startsWith('<@') && args[0].endsWith('>');

          var result = await bot.mongo.db("data").collection("players");

          if(asId) {
            var player = await result.findOne({'discord': {'account': Long.fromString(args[0].substring(2, args[0].length-1).replace('!', ''))}});
            if(player!==null) {
              if(player.rank!==args[1].toUpperCase()) {
                result = await result.updateOne({id: player.id}, {$set: {rank: args[1].toUpperCase()}}, {});
                if(result.matchedCount===0) {
                  sendEmbed(message.channel, 'RED', 'Success', 'Player not found!');
                }else if(result.matchedCount===1) {
                  sendEmbed(message.channel, 'GREEN', 'Success', 'Player ' + player.name + ' has now rank ' + args[1].toUpperCase());
                }else {
                  sendEmbed(message.channel, 'GREEN', 'Success', 'Player ' + player.name + ' has now rank ' + args[1].toUpperCase() + ', but found multiple players with the same nick!');
                }
              }else {
                sendEmbed(message.channel, 'RED', 'Error', 'Player already has that rank!');
              }
            }else {
              sendEmbed(message.channel, 'RED', 'Error', 'Unknown player!');
            }
          }else {
            var player = await result.findOne({name: { $regex: new RegExp("^" + args[0].toLowerCase(), "i") }});
            if(player!==null) {
              if(player.rank!==args[1].toUpperCase()) {
                result = await result.updateOne({name: { $regex: new RegExp("^" + args[0].toLowerCase(), "i") }}, {$set: {rank: args[1].toUpperCase()}}, {});
                if(result.matchedCount===0) {
                  sendEmbed(message.channel, 'RED', 'Error', 'Player not found!');
                }else if(result.matchedCount===1) {
                  sendEmbed(message.channel, 'GREEN', 'Success', 'Player ' + player.name + ' has now rank ' + args[1].toUpperCase());
                }else {
                 sendEmbed(message.channel, 'GREEN', 'Success', 'Player ' + player.name + ' has now rank ' + args[1].toUpperCase() + ', but found multiple players with the same nick!');
                }
              }else {
                sendEmbed(message.channel, 'RED', 'Error', 'Player already has that rank!');
              }
            }else {
              sendEmbed(message.channel, 'RED', 'Error', 'Unknown player!');
            }
          }

        }else {
          sendEmbed(message.channel, 'RED', 'Error', 'Unknown rank: ' + args[1]);
        }

      }else {
        sendEmbed(message.channel, 'RED', 'Permission Denied', 'You do not have permissions to use this command!');
      }
    }else {
        sendEmbed(message.channel, 'RED', 'Usage', 'Usage: ' + message.content.split(' ')[0] + ' <ign> <rank>');
    }
  
  }
}