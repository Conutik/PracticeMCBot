module.exports = {
  config: {
    name: "permadd",
    description: "Gives a role permission to run a certain command",
    usage: "(command) (role)",
    category: "moderation",
    accessableby: "Moderator",
    aliases: ["permissionadd"]
  },
  run: async (bot, message, args) => {

    if(!message.member.hasPermission(["ADMINISTRATOR"])) return message.channel.send("You do not have permission to perform this command!");

    result = await bot.mongo.db("staff").collection("perms");

    let array = ["ban", "unban", "clear", "kick", "mute", "unmute", "warn", "warns", "strike", "strikecheck", "messages", "ticketrole", "reactionrole", "automod", "removestrike", "capbypass"];

    let blacklist = args[0]
    if (!blacklist) {
      let r = array.join('\n ')
      return message.channel.send(`The command must be one of these: \`\`\`${r}\`\`\``)
    }
    blacklist = blacklist.toLowerCase()

    let role = message.guild.roles.cache.find(r => r.name == args[1]) || message.guild.roles.cache.find(r => r.id == args[1]) || message.mentions.roles.first()

    

    if(array.includes(blacklist)) {

      if(!role) return message.channel.send("Please provide a role to give access to this command.");

      await result.updateOne({ _id: blacklist }, { $push: { roles: role.id } }, { upsert: true })
      

      message.channel.send(`Gave role ${role.name} permission to use the command: ${blacklist}`);

    } else {

      let r = array.join('\n ')
      message.channel.send(`The command must be one of these: \`\`\`${r}\`\`\``)

    }
  }
}