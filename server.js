const express = require('express');
const server = express();

async function keepAlive(bot){
  

 server.get('/', async (req, res) => {
   res.send('use api.practicemc.club/player/IGN')
 })

  server.get('/:thing/:userId', async (req, res) => {

    result = await bot.mongo.db("data").collection("players");

    if(req.params.thing === "player") {

    

    let std = await result.findOne({ name: req.params.userId })

    if(!std) return res.send({"code": "invalid", "error": "Invalid username"})
  return res.send({"name": std.name, "rank": std.rank});
    } else if(req.params.thing === "uuid" || "id") {

      if(!req.params.userId.includes("-")) {

      req.params.userId = req.params.userId.split("-").join("")

      req.params.userId = req.params.userId.split("")

      req.params.userId.splice(8, 0, '-')
      req.params.userId.splice(13, 0, '-')
      req.params.userId.splice(18, 0, '-')
      req.params.userId.splice(23, 0, '-')

      ytd = req.params.userId.join("").replace(" ", "")

      } else {

      ytd = req.params.userId
      }

      let std = await result.findOne({ id: ytd })

    if(!std) return res.send({"code": "invalid", "error": "Invalid uuid"})

    console.log(std)
  return res.send({"name": std.name, "rank": std.rank});

    }
});

  server.listen(3000, ()=>{console.log("Server is Ready!")});
}

module.exports = keepAlive