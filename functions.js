const Discord = require('discord.js')
const ms = require("parse-ms");
const randomstring = require("randomstring");

module.exports = {
  tickets: async function(message, array, mon) {

    let category = message.guild.channels.cache.find(channel => channel.type === "category" && channel.id === "822642658295414804");


    

  const channelsend1 = new Discord.MessageEmbed()
    .setColor('#e64b0e')
    .setTitle(`Match Making Ticket`)
    .setDescription('Please wait for a host to come and invite you to a party. If one of you is mvp++ please invite the other player and enter a bedwars 1v1 match in the map "lighthouse", choose the teams red and blue. After your finish the game please send proof in this channel so we can add your scores.')

    const numbers = randomstring.generate({
      length: 5,
      charset: 'numeric'
    });



            var name = `ticket-${numbers}`;
            message.guild.channels.create(name, {
                type: 'text',
                parent: category,
                permissionOverwrites: [
                  {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                  }
                ],
              }).then(async createdchannel => { 


                let roles = await result.findOne({ _id: "roles" })

                console.log(roles)
                  if(roles) {


                  roles.roles.forEach(x => {
                    
                  let role = message.guild.roles.cache.find(r => r.id === x)
                  
                  if(!role) return;

                  console.log('s')


                  createdchannel.updateOverwrite(role, { 
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGE_HISTORY: true,
                    ATTACH_FILES: true
                  });


                })
                  }

                createdchannel.send(channelsend1)
                createdchannel.send(`${array[1]} ${array[0]}`)
                createdchannel.setTopic(`Match Making Ticket ${numbers}`)
                const chname = createdchannel.id


                array.forEach(user2 => {
                  createdchannel.updateOverwrite(user2, { 


                  VIEW_CHANNEL: true,
                  SEND_MESSAGES: true,
                  READ_MESSAGE_HISTORY: true
                  });

                })

                  let incase = createdchannel.id;
                  await mon.updateOne({ _id: `${chname}-ticket` }, { $set: { ticket: true } }, { upsert: true });


                  


                  
                
              })

  },

  cataCheck: function(guild) {
    let category = guild.channels.cache.find(channel => channel.type === "category" && channel.name === "「TICKETS」");
    if(!category) {
      guild.channels.create("「TICKETS」", {
        type: 'category',
      })
    }
  },

  permCheck: async function(message,perms,command,mon) {

    result = await mon.db("staff").collection("perms");
      let array = await result.findOne({ _id: command })
      if(!array) {
        if(message.member.hasPermission(["ADMINISTRATOR"])) {
          perms = true
        }
        
      } else {
        array.roles.forEach(x => {
          if(message.member.roles.cache.some(r => r.id === x)) {
            perms = true
          }
        })

        if(perms === false) {
          if(message.member.hasPermission("ADMINISTRATOR")) {
            perms = true
          }
        }
      }

        
      return perms;
      
    },

    //return false -> dont do anything
    //return true -> delete the message
    filterMessage: async function(message, mon) {
      let perm = await module.exports.permCheck(message, false, 'capbypass', mon) 
      if(perm) return false;
      const amountUpperCase = function(str) {
        var letters = 0;
        var caps = 0;
        for(const char of str) {
          if (isNaN(char * 1)) {
            if(char.toLowerCase() != char.toUpperCase()) {
              letters++;
              if (char != char.toLowerCase() && char == char.toUpperCase()) {
                  caps++;
              }
            }
          }
        }
        if(letters==0) return 0;
        return (caps/letters)*100;
      };
      if(message.content.length>=4 && amountUpperCase(message.content)>=95) {
        return true;
      }
      return false;
    }
}