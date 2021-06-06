module.exports = {
  config: {
    name: 'link',
    usage: '',
    accessableby: 'Members',
    category: 'misc'
  },
  run: async (bot, message, args) => {

    result = await bot.mongo.db("data").collection("players");

    let key = args[0];
    if(!key) return message.channel.send("Please send your code");

    console.log(key)

    // let check = await result.findOne({ discord: { key: key });

    let check = await result.findOne({ key: key });

    console.log(check)
    console.log(await result.findOne({ name: "Chikko6" }))

    if(!check) return message.channel.send("Invalid key");

    message.delete();

    let embed = new bot.MessageEmbed()
    .setColor("GREEN")
    .setTitle("SUCCESS")
    .setDescription(`\`\`\`You have successfully linked your discord account (${message.author.tag}) to ${check.name}\`\`\``)

    message.author.send(embed)

    await result.updateOne({ discord: { key: key } }, { $unset: { discord: { key: "" } } })

    await result.updateOne({ id: check.id }, { $set: { discord: { account: message.author.id } } }, { upsert: true })

  }
}