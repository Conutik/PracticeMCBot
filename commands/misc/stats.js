const { MessageEmbed } = require ('discord.js');
const Long = require('mongodb').Long;

function sendEmbed(channel, color, title, description) {
  channel.send(new MessageEmbed().setColor(color).setTitle(title).setDescription(description));
}

module.exports = {
  config: {
    name: 'stats',
    usage: '<ign>',
    description: "Gets stats of someone",
    accessableby: 'Members',
    category: 'misc'
  },
  run: async (bot, message, args) => {

    if(args.length>=1) {

          
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
            player = await result.findOne({name:{ $regex: new RegExp("^" + args[0].toLowerCase(), "i")}});
            if(player===null)  {
              sendEmbed(message.channel, 'RED', 'Error', 'Unknown player!');
              return;
            }
          }

          var bp = player.bridging_practice ? player.bridging_practice : {};
          var stats = bp.stats ? bp.stats : {};

          var desc = "";

          var date = player.lastLogin?new Date(player.lastLogin):null;

          desc += 'Diamonds: ' + (player.diamonds ? player.diamonds : 0) + '\n';
          //for some reason lastLogin is actually firstLogin... which will make confusion
          desc += 'First Login: ' + (date ? date.toLocaleDateString() : 'Unknown') + '\n';
          desc += '**Bridging Practice**' + '\n';
          desc += 'Best Time: ' + (bp.best_time ? (bp.best_time/1000) + 's' : 'Unknown') + '\n';
          desc += 'Blocks Placed: ' + (stats.total_blocks ? stats.total_blocks : 'Unknown') + '\n';
          desc += 'Bridges Finished: ' + (stats.total_completes ? stats.total_completes : 'Unknown') + '\n';
          desc += 'Fails: ' + (stats.fails ? stats.fails : 'Unknown') + '\n';

          message.channel.send(
            new MessageEmbed()
            .setColor('#52BF10')
            .setTitle(player.rank + ' ' + player.name)
            .setDescription(desc)
            );

    }else {
        sendEmbed(message.channel, 'RED', 'Usage', 'Usage: ' + message.content.split(' ')[0] + ' <ign>');
    }
  
  }
}