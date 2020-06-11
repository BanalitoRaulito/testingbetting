const jwt = require('jsonwebtoken');
var sendInfo = require("../utils/sendInfo.js")

module.exports = (io, data, key, searching, oldGames, gamesOn) => {
  jwt.verify(data.game, key, (err, res) => {
    if(!err){
      oldGames.push(res)
      // always 5 element
      if(oldGames.length > 3){
        oldGames.splice(0, 1)
        console.log("cleaning history", oldGames.length, oldGames)
      }
      sendInfo(io, searching, oldGames, gamesOn)
    }
    console.log(res, err, oldGames)
  })
}
