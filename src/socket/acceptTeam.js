const TronWeb = require("tronweb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});
const betting = require("../utils/betting.js")
const connect = require("../utils/connect.js")

module.exports = async (socket, data, adr, searching, teams, teamSize, key) => {
  let isTeam = teams.filter(k => k.status === true).find(t => t.data.find(f => f.address === data.address));
  if(!isTeam){console.log("team doesn't exist"); return}
  let isPlayer = isTeam.data.find(f => f.address === data.address);
  // if player exists
  if(isPlayer !== undefined){
    // save the TX signsature
    isPlayer.signedTx = data.signed
    console.log(isPlayer)

    isPlayer.socket = socket;
    socket.emit("msg", {msg: "waitingRes"})

    // timeout if not acc
    if(!isTeam.timeout){
      isTeam.timeout = setTimeout(() => {
        isTeam.status = false;
        isTeam.data.forEach(s => s.socket.emit("msg", {msg: "cancel"}))
        console.log("team set to false")
      }, 52000)
    }

    let sentSign = isTeam.data.filter(f => f.signedTx !== undefined)
    console.log(sentSign)
    // if both have sent the Tx, check it and broadcast
    if(sentSign.length === teamSize*2){
      clearTimeout(isTeam.timeout)
      console.log(isTeam.timeout)
      if(await betting(adr, tronWeb.toSun(100), sentSign)){
        //connect
        isTeam.data.forEach(s => s.socket.emit("msg", {msg: "complete"}))
        await connect(sentSign, key)
      }else{
        isTeam.data.forEach(s => s.socket.emit("msg", {msg: "failed"}))
        console.log("sending fail")
      }
      isTeam.status = false;
    }else{
      console.log("waiting for more signs 1")
    }
  }
}
