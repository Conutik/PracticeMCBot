const { Manager } = require("erela.js");

module.exports = async bot => {

  bot.music = new Manager({
      nodes: [
        {
          host: process.env.HOST, 
          port: 3030,
          password: process.env.PASS
          },
          ],
            autoPlay: true,
            send: (id, payload) => {
              const guild = bot.guilds.cache.get(id);
              if (guild) guild.shard.send(payload);
            } 
          })
        .on("nodeConnect", node => console.log(`Node connected.`))
        .on("nodeError", (node, error) => console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`))
        .on("trackStart", (player, track) => {
          const channel = bot.channels.cache.get(player.textChannel);
          channel.send(`Now playing: \`${track.title}\`, requested by \`${track.requester.tag}\`.`);
          })
          .on("queueEnd", player => {
            const channel = bot.channels.cache.get(player.textChannel);
            channel.send("Queue has ended.");
            player.destroy();
            });

    bot.music.init(bot.user.id);
    bot.on("raw", d => bot.music.updateVoiceState(d))



    bot.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25);

  let guild = bot.guilds.cache.get("707753771945426984")


  await guild.members.fetch()

  console.log(`${bot.user.username} is now online!`)

  result = await bot.mongo.db("staff").collection("strikes");
  

  let strikes = await result.findOne({ _id: "strikes" });
  if(strikes) {
    strikes.strikes.forEach(x => {
      if(Date.now() >= x.time) {
        result.updateOne({ _id: "strikes"}, { $pull: { strikes: { id: x.id }}})
      }
      //  else {
      //   let time = x.time - Date.now();
      //   setTimeout(function(){
      //     result.updateOne({ _id: "strikes"}, { $pull: { strikes: { id: x.id }}})
      //   }, time)
      // }
    })
  }



  setInterval(() => bot.user.setActivity(`=help`, { type: "LISTENING" }), 15000)

    
}