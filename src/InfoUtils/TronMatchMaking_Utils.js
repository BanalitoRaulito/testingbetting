const TronMatchMaking = require("../TronMatchmaking/index.js")
const connect = require("./connect.js")
const jwt = require('jsonwebtoken');

module.exports = class TronMatchMaking_Utils extends TronMatchMaking{
  constructor(adr, key, tronWeb_options = {fullHost: 'https://api.shasta.trongrid.io'} ){
    super(adr, tronWeb_options)
    this.oldGames = []
    this.gamesOn = new Map()
    this.key = key;
  }

  // info to front
  sendInfo(socket){
    let n_searching = this.searchingPlayers.map(a => {return {...a, socket: undefined}})
    var info = {
      searching: n_searching,
      oldGames: this.oldGames,
      gamesOn: [...this.gamesOn.values()]
    }
    socket.emit("sendInfo", {info})
  }

  // push to oldGames
  saveBet(data){
    jwt.verify(data.game, this.key, (err, res) => {
      if(!err){
        this.oldGames.push(res)
        // always 5 element
        if(this.oldGames.length > 3){
          this.oldGames.splice(0, 1)
          console.log("cleaning history", this.oldGames.length, this.oldGames)
        }
      }
      console.log(res, err, this.oldGames)
    })
  }

  // removes or adds to gamesOn (playing now)
  editPlaying(data){
    let id = data.thisServerId
    if(!data.delete){
      this.gamesOn.set(id, {
        t1: data.t1,
        t2: data.t2,
        t1_score: data.t1_score,
        t2_score: data.t2_score
      })
    }else{
      this.gamesOn.delete(id)
    }
    console.log("games ON mapping", this.gamesOn)
  }

  // connects to Free server
  connect(sentSign, key){
    return connect(sentSign, key)
  }
}
