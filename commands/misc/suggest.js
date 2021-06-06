const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: 'suggestion',
    usage: '',
    accessableby: 'Members',
    category: 'misc'
  },
  run: async (bot, message, args) => {

    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have perms to run this command.");

    let embed = new MessageEmbed()
    .setColor("#000000")
     .setAuthor("SUGGESTIONS", bot.user.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 2048
      }))
      .setDescription(`Welcome! Thanks for taking the time to suggest features that can be added to the server!  \n \n> __**How do you suggest something?**__ \n \nIt's simple really! All you have to do is send your suggestion in this channel, the bot will automatically delete your message and send it to a private staff channel for staff to review it, once a staff member approves it, it will be sent in this channel for the community to vote. If staff disapprove it, you will be sent a message saying that it was denied. \n \n>  __**Reasons why you suggestion may have been denied or is not visible here:**__ \n \n- It has already been seen before in this channel. \n- Developers will be unable to implement it so there is no point of it being here. \n- It may have been saved! Suggestions with over 10 upvotes are saved in a private channel! \n- It is a silly suggestion that we do not think should be displayed to the public. \n- It was a random topic and not helpful or would contribute to our server in any way, shape or form.`)

      message.channel.send(embed)

  }
}