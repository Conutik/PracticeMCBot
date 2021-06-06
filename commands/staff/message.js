const ms = require('ms')
const { MessageEmbed } = require ('discord.js');
const { permCheck } = require('../../functions.js')
module.exports = {
  config: {
    name: 'messages',
    usage: '(ign)',
    description: "Checks bot's ping!",
    accessableby: 'Members',
    category: 'staff'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'messages', bot.mongo)
    if(perm === false) return message.channel.send('Not enough perms.');

    result = await bot.mongo.db("staff").collection("chat");

    let user = message.mentions.users.first() || message.member;

    let check = await result.findOne({ _id: user.id });

    if(!check) return message.channel.send('No Messages');

    message.channel.send(`The user has sent a total of \`${check.msgCount}\` messages in public channels.`)

  }
}