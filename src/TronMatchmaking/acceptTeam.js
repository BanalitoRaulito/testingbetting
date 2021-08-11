const betting = require("./betting.js")

module.exports = async (data, adr, ready, tronWeb) => {
  let team = ready.filter(player => player.status === true)
                  .find(player => player.data
                  .find(player => player.address === data.address));

  let send_msg = msg => team.data.forEach(s => {
    s.socket && s.socket.emit("msg", {msg})
  })
  // if player exists
  if(!team){console.log("readySet doesn't exist"); return "notIn_readyTeams"}
  let player = team.data.find(player => player.address === data.address);
  // save the TX signsature
  player.signedTx = data.signed
  send_msg("waitingRes")

  // timeout if doesnt accept
  if(!team.timeout){
    team.timeout = setTimeout(() => {
      team.status = false;
      console.log("team set to false")
      send_msg("cancel")
    }, 52000)
  }

  let sentSign = team.data.filter(f => f.signedTx !== undefined)
  // if both have sent the Tx, check it and broadcast
  if(sentSign.length < player.teamSize*2){
    console.log("waiting for more signs")
    send_msg("waitingSignatures")
    return "waitingSignatures"
  }

  send_msg("confirming")
  clearTimeout(team.timeout)
  console.log(team.timeout)
  team.status = false;
  if(await betting(adr, tronWeb.toSun(player.betAmount), sentSign, tronWeb)){
    //connect
    send_msg("complete")
    return {complete: true, sentSign}
  }else{
    send_msg("failed")
    console.log("sending fail")
    return "failed"
  }
}
