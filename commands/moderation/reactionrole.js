const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const { permCheck } = require('../../functions.js')

module.exports = {
  config: {
    name: 'reactionrole',
    aliases: ["reactionroles", "rr"],
    usage: '',
    accessableby: 'Members',
    category: 'moderation'
  },
  run: async (bot, message, args) => {

    let perm = await permCheck(message, false, 'reactionrole', bot.mongo)
      if(perm === false) return message.channel.send('Not enough perms.');

    const embed = new MessageEmbed()
      .setColor('#1df2af')
      .setTitle('Reaction Roles')

    embed.setDescription('Send the role you would like to make a reaction role for!')

    message.channel.send(embed)

    const filter = m => m.author.id === message.author.id;

    let role = await roleCollect(message, '');




    function roleCollect(message, role) {
      const rolec = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });



      rolec.on('collect', m => {

        let snt = m.content

        role = m.guild.roles.cache.find(r => r.name == snt) || m.guild.roles.cache.find(r => r.id == snt) || m.mentions.roles.first()

        if (!role) {
          embed.setDescription('Invalid role please resend a valid role')
          message.channel.send(embed)
          roleCollect(message, '')
        }
      })

      rolec.on('end', collected => {
        if (!collected.size > 0) return message.channel.send('Reaction role cancelled');
        if (!role) {

        } else {
          embed.setDescription('Choose the emoji you would like the role to represent!')
          message.channel.send(embed)

          emoji(message, role, '')
        }


      })

    }




    function emoji(message, role, emo) {


      const emojic = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });

      emojic.on('collect', m => {


        let emojis = /\p{Emoji}/u.test(`${m.content}`)
        if (!emojis) {

          embed.setDescription('Invalid emoji please resend a valid emoji')
          message.channel.send(embed)

          emoji(message, role, emo)

        } else {
          emo = m.content
        }
      })

      emojic.on('end', collected => {
        if (!collected.size > 0) return message.channel.send('Reaction role cancelled');
        if (!emo) {

        } else {

          embed.setDescription('Choose the channel you would like to send the reaction role to')
          message.channel.send(embed)

          sendEmbed(message, role, emo)
        }
      })
    }


    function sendEmbed(message, role, reaction) {


      const chnl = message.channel.createMessageCollector(filter, { max: 1, time: 15000 });

      chnl.on('collect', m => {
        let channel = m.mentions.channels.first()
        if (!channel) {
          embed.setDescription('Invalid channel please resend a valid channel')
          message.channel.send(embed)
          sendEmbed(message, role, reaction)
        } else {

          let embed = new MessageEmbed()
            .setColor('#1df2af')
            .setDescription(`React with ${reaction} to get the ${role} role!`)
          channel.send(embed).then(m => {
            m.react(reaction)

            db.set(`reactionroles.${message.guild.id}.${m.id}`, { role: role.id, reaction: reaction })

            embed.setDescription(`Reaction role successfully completed.`)
            message.channel.send(embed)
          })
        }
      })

      chnl.on('end', collected => {
        if (!collected.size > 0) return message.channel.send('Reaction role cancelled. Took to long. You may retry at anytime.');
      })
    }


  }
}
