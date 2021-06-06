module.exports = async (bot, message) => { 

  
  if(message.partial) return;

  if(message.author.bot || message.channel.type === "dm") return;

  let embed = new bot.MessageEmbed()
  .setColor("RED")
  .setAuthor(message.author.tag, message.author.displayAvatarURL({
      format: "png",
      dynamic: true,
      size: 2048
    }))
  .setTimestamp()
  .setDescription(`**Message sent by ${message.author} deleted in ${message.channel}** \n${message.content}`)
  .setFooter(`Author: ${message.author.id} | Message ID: ${message.id}`)

  let logs = message.guild.channels.cache.find(r => r.id === "709450379825250375");

  logs.send(embed)
  
}