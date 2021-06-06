module.exports = {
  config: {
    name: 'unlink',
    usage: '',
    accessableby: 'Members',
    category: 'misc'
  },
  run: async (bot, message, args) => {

    result = await bot.mongo.db("data").collection("players");
    let check = await result.findOne({ discord: { account: message.author.id } });

    console.log(await result.findOne({ name: "Conutik" }))

    if(!check) return message.channel.send("You aren't linked.");

    message.delete();

    let embed = new bot.MessageEmbed()
    .setColor("GREEN")
    .setTitle("SUCCESS")
    .setDescription(`\`\`\`You have successfully unlinked your discord account ${message.author.tag}\`\`\``)

    message.author.send(embed)

    await result.updateOne({ id: check.id }, { $set: { discord: { account: "" } } }, { upsert: true })

  }
}