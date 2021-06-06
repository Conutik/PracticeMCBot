console.log('Starting...')

let dotenv = require('dotenv');
const Discord = require('discord.js');
dotenv.config();

const ms = require('ms');

const { Client, Collection } = require('discord.js');
const bot = new Client({ partials: ['MESSAGE', 'REACTION']});

const { MessageEmbed } = require('discord.js')
bot.MessageEmbed = MessageEmbed;


const { MongoClient }  = require('mongodb');
const uri = process.env.MONGO;
    
bot.mongo = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

bot.mongo.connect().then(() => {
  console.log("Connected to Database")
})

const keepAlive = require('./server.js');
keepAlive(bot);


['aliases', 'commands'].forEach(x => (bot[x] = new Collection()));
['console', 'command', 'event'].forEach(x => require(`./handlers/${x}`)(bot));

// bot.on('messageReactionAdd', (reaction, user) => {
//   if(reaction.bot) return;

//   let messageid = reaction.message.id

//   let guilds = reaction.message.channel.guild
  

//   let guild = bot.guilds.cache.get(guilds.id)


//   let check = db.get(`reactionroles.${guild.id}.${messageid}`)
//   if(!check) return;

//   if(reaction.emoji.name === check.reaction) {

//   let mem = guild.members.cache.get(user.id)

//   let role = guild.roles.cache.get(check.role)

//   let roleCheck = mem.roles.cache.has(check.role)
//   if(!roleCheck) {
//     mem.roles.add(role)

//     let embed = new MessageEmbed()
//     .setColor('#1df2af')
//     .setTitle('Role Added')
//     .setDescription(`The role ${role.name} has been added to you in ${guild.name}`)
//     mem.send(embed).catch(e => {
      
//     })
//   }

//   }
// })


// bot.on('messageReactionRemove', (reaction, user) => {
//   if(user.bot) return;

//   let messageid = reaction.message.id

//   let guilds = reaction.message.channel.guild
  

//   let guild = bot.guilds.cache.get(guilds.id)


//   let check = db.get(`reactionroles.${guild.id}.${messageid}`)
//   if(!check) return;

//   if(reaction.emoji.name === check.reaction) {

//   let mem = guild.members.cache.get(user.id)

//   let role = guild.roles.cache.get(check.role)

//   let roleCheck = mem.roles.cache.has(check.role)
//   if(roleCheck) {
//     mem.roles.remove(role)

//     let embed = new MessageEmbed()
//     .setColor('#1df2af')
//     .setTitle('Role Removed')
//     .setDescription(`The role ${role.name} has been removed from you in ${guild.name}`)
//     mem.send(embed).catch(e => {
      
//     })
//   }

//   }
// })
/* bot.on("message", msg => {

 let wordArray = msg.content.split(" ");
  console.log(wordArray);

   let filterWords = ["fuck", "asshole", "ass", "bitch", "nigga", "niggar", "shit", "negro", "cunt","Fuck", "Asshole", "Ass", "Bitch", "Nigga", "Niggar", "Shit", "Negro", "Cunt", "FUCK", "SHIT", "ASSHOLE", "NIGGA", "BITCHES", "Bitches", "Retard", "retard", "Retarded", "retarded", "fucking", "Fucking", "Bitchs", "bitchs",]

   for (var i = 0; i < filterWords.length; i++) {
     if (wordArray.includes(filterWords[i])) {
       msg.delete();
       msg.channel.send(`${msg.author.username}, swearing is not permitted.`).then((msg) => {
          setTimeout(() => msg.delete(), 7000);
      
       })
  }
   }

//Conutik move this somewhere else idk how to put in anywhere else just you do it urself
  
   });*/
bot.login(process.env.TOKEN)