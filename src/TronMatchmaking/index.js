const TronWeb = require("tronweb")
const addPlayer = require("./addPlayer.js")
const matchTeam = require("./matchTeam.js")
const acceptTeam = require("./acceptTeam.js")

module.exports = class TronMachmaking{
  constructor(adr, tronWeb_options = {fullHost: 'https://api.shasta.trongrid.io'}){
    this.adr = adr;
    this.tronWeb = new TronWeb(tronWeb_options);

    // searching people and ready are matched teams
    this.searching = [];
    this.ready = []
  }

  addPlayer(data, socket){
    let msg = addPlayer(socket, data, this.searching, this.ready, this.tronWeb)
    socket && socket.emit("msg", {msg})
    return msg
  }
  matchTeam(){
    return matchTeam(this.searching, this.ready)
  }
  acceptTeam(data){
    return acceptTeam(data, this.adr, this.ready, this.tronWeb)
  }
}
