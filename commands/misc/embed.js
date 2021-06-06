const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: 'embed',
    aliases: ["embed"],
    usage: '',
    accessableby: 'Members',
    category: 'misc'
  },
  run: async (bot, message, args) => {
    
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send("No perms.");

    let embed = new MessageEmbed()
    .setTitle("Title")

    let msg = await message.channel.send(embed);

    message.channel.send('You have started the embed builder, please remember that you will have a maximum of 15 seconds to enter your choice. \n\n **__Please choose the title of the embed__**')

    const filter = m => m.author.id === message.author.id;

    const ticketcol = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });

    

    ticketcol.on('collect', async m => {
      embed.setTitle(m.content)
      

      message.channel.send(`**__Please choose what you want the body to be. \n\nTIME LIMIT: 5 MINUTE__**`)
    })

    ticketcol.on('end', collected => {
      if(collected.size < 1) return message.channel.send('Cancelled.');

      const bodycol = message.channel.createMessageCollector(filter, { max: 1, time: 300000 });

    bodycol.on('collect', m => {
      embed.setDescription(m.content)
      msg.edit(embed)

      message.channel.send(`**__Please choose what you want the colour to be. Using hex code \n\nTIME LIMIT: 15 SECONDS__**`)
    })

    bodycol.on('end', collected => {
      if(collected.size < 1) return message.channel.send('Cancelled.');

      const colorcol = message.channel.createMessageCollector(filter, { max: 1, time: 60000 });

    colorcol.on('collect', m => {

      if(!m.content.startsWith("#")) m.content = "#" + m.content
      embed.setColor(m.content)
      msg.edit(embed)
    })

    colorcol.on('end', collected => {
      if(collected.size < 1) return message.channel.send('Cancelled.');

      message.channel.send(embed)

      message.channel.send(`**__Please choose what channel you want to send it in.__**`)


      const chnl = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });

    

    chnl.on('collect', async m => {

      let chn = m.mentions.channels.first();
      if(!chn) return message.channel.send(embed);

      chn.send(embed)

    })

    chnl.on('end', collected => {
      if(collected.size < 1) return message.channel.send('Cancelled.');

      message.channel.send('Embed has been sent.')
      
    })

    
    })
    })
    })


    
    }
}