const TronWeb = require("tronweb")
const addPlayer = require("./addPlayer.js")
const matchTeam = require("./matchTeam.js")
const acceptTeam = require("./acceptTeam.js")
const {smartContractInfo} = require('./env.js')

module.exports = class TronMatchmaking{
  constructor(adr, tronWeb_options = {fullHost: smartContractInfo.address}){
    this.adr = adr;
    this.tronWeb = new TronWeb(tronWeb_options);

    // searching people and ready are matched teams
    this.searchingPlayers = [];
    this.readyTeams = []
  }

  addPlayer(data, socket){
    let msg = addPlayer(socket, data, this.searchingPlayers, this.readyTeams, this.tronWeb)
    socket && socket.emit("msg", {msg})
    return msg
  }
  matchTeam(){
    return matchTeam(this.searchingPlayers, this.readyTeams)
  }
  acceptTeam(data){
    return acceptTeam(data, this.adr, this.readyTeams, this.tronWeb)
  }
}
