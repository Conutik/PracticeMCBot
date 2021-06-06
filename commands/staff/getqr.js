const { MessageEmbed } = require('discord.js');
const { Long } = require('mongodb');

function sendEmbed(channel, color, title, description) {
  channel.send(new MessageEmbed().setColor(color).setTitle(title).setDescription(description));
}

function sendEmbed2(channel, color, title, description, functionIdk) {
  channel.send(new MessageEmbed().setColor(color).setTitle(title).setDescription(description)).catch(async e => {functionIdk(e)})
}

module.exports = {
  config: {
    name: 'getqr',
    usage: '<ign>',
    description: "Set rank of someone",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    if(args.length>=1) {
      if(message.member.hasPermission('ADMINISTRATOR')) {

        const correctRanks = ['BUILDER', 'HELPER', 'MOD', 'ADMIN', 'DEV', 'MANAGER', 'OWNER'];

          
          var asId = args[0].startsWith('<@') && args[0].endsWith('>');

          var result = await bot.mongo.db("data").collection("players");

          var player;

          if(asId) {
            player = await result.findOne({'discord': {'account': Long.fromString(args[0].substring(2, args[0].length-1).replace('!', ''))}});
            if(player===null) {
              sendEmbed(message.channel, 'RED', 'Error', 'Unknown player!');
              return;
            }
          }else {
            player = await result.findOne({name: { $regex: new RegExp("^" + args[0].toLowerCase(), "i") }});
            if(player===null) {
              sendEmbed(message.channel, 'RED', 'Error', 'Unknown player!');
              return;
            }
          }

          if(correctRanks.includes(player.rank)) {
            var doc = player.auth?player.auth:{};
            if(doc.qrUrl) {
              sendEmbed(message.channel, 'GREEN', 'Success', 'QR Code sent in DMs');

              sendEmbed2(message.author, 'AQUA', 'PracticeMC QR Code', `QR Code of ${player.name}: ${doc.qrUrl}`, function(error) {
                sendEmbed(message.channel, 'RED', 'Error', `Failed to send DM: Cannot DM this user!`)
              })
            }else {
              sendEmbed(message.channel, 'RED', 'Error', 'Player does not have qr code generated!');
            }
          }else {
            sendEmbed(message.channel, 'RED', 'Error', 'Player has a Non-Staff rank: ' + player.rank);
          }

      }else {
        sendEmbed(message.channel, 'RED', 'Permission Denied', 'You do not have permissions to use this command!');
      }
    }else {
        sendEmbed(message.channel, 'RED', 'Usage', 'Usage: ' + message.content.split(' ')[0] + ' <ign>');
    }
  
  }
}