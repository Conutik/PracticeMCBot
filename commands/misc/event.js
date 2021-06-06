const { MessageEmbed } = require('discord.js')
module.exports = {
  config: {
    name: 'events',
    aliases: ["event"],
    usage: '',
    accessableby: 'Members',
    category: 'misc'
  },
  run: async (bot, message, args) => {

    const thisisaword = new MessageEmbed()
      .setAuthor("EVENTS", bot.user.displayAvatarURL({
            format: "png",
            dynamic: true,
            size: 2048
          }))
      .setColor('RANDOM')
      .setDescription('The last person the leave the vc will win a prize.')
      .addFields(
        {name: 'How it will work', value: 'When the event is about to start you will be notified. Apon joining the voice channel a private text channel will be created. Every 10 minutes you will be asked to do a task. If the task is failed you will be booted from the vc and your channel will be deleted. Last person left wins the prize.'},
        {name: 'Prize', value: 'Hypixel rank upgrate!'},
        {name: 'Time', value: 'Undecided'},
        {name: 'Rquirements', value: 'Must me a member of Melon Client discord and must remain in this discord as well. If you are not in the server the second place winner will be granted the prize. So on after that.'},

      )
    .setFooter('Dont bot your account idot')
      message.channel.send(thisisaword)
  }
}