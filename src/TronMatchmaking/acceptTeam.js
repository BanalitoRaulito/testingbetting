const betting = require("./betting.js")

module.exports = async (data, adr, ready, tronWeb) => {
  let send_msg = msg => team.data.forEach(s => {
    s.socket && s.socket.emit("msg", {msg})
  })

  let team = ready.filter(player => player.status === true)
                  .find(player => player.data
                  .find(player => player.address === data.address));
  // if player exists
  if(!team){console.log("readySet doesn't exist"); return}
  // the Player
  let player = team.data.find(player => player.address === data.address);
  if(player === undefined){return}

  // save the TX signsature
  player.signedTx = data.signed
  console.log(player.signedTx)
  send_msg("waitingRes")

  // timeout if doesnt accept
  if(!team.timeout){
    team.timeout = setTimeout(() => {
      team.status = false;
      send_msg("cancel")
      console.log("team set to false")
    }, 52000)
  }

  let sentSign = team.data.filter(f => f.signedTx !== undefined)
  console.log(sentSign)
  // if both have sent the Tx, check it and broadcast
  if(sentSign.length === player.teamSize*2){
    clearTimeout(team.timeout)
    console.log(team.timeout, tronWeb)
    if(await betting(adr, tronWeb.toSun(player.betAmount), sentSign, tronWeb)){
      //connect
      send_msg("complete")
      return sentSign
    }else{
      send_msg("failed")
      console.log("sending fail")
    }
    team.status = false;
  }else{
    console.log("waiting for more signs 1")
  }

}
