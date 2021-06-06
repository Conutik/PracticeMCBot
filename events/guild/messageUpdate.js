module.exports = async (bot, oldmessage, newmessage) => {
  if(oldmessage.partial) oldmessage = await oldmessage.fetch();

  if(oldmessage.author.bot || oldmessage.channel.type === "dm") return;

  
  let { filterMessage } = require('../../functions.js');

  let perm = await filterMessage(newmessage, bot.mongo);
  if(perm == true) newmessage.delete();

  let embed = new bot.MessageEmbed()
  .setColor("AQUA")
  .setAuthor(oldmessage.author.tag, oldmessage.author.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 2048
    }))
  .setTimestamp()
  .setDescription(`**Message edited in ${oldmessage.channel}** [Jump to message](${oldmessage.url}) \n**BEFORE:** \n${oldmessage.content} \n**AFTER:** \n${newmessage.content}`)
  .setFooter(`USER ID: ${oldmessage.author.id}`)

  let logs = oldmessage.guild.channels.cache.find(r => r.id === "709450379825250375");

  logs.send(embed)
}