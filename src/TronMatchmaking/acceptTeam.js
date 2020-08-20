const betting = require("./betting.js")

module.exports = async (data, adr, ready, tronWeb) => {
  let send_msg = msg => theReady.data.forEach(s => {
    s.socket && s.socket.emit("msg", {msg})
  })

  let theReady = ready.filter(player => player.status === true)
                      .find(player => player.data
                      .find(player => player.address === data.address));
  // if player exists
  if(!theReady){console.log("readySet doesn't exist"); return}
  // the Player
  let thePlayer = theReady.data.find(player => player.address === data.address);
  if(thePlayer === undefined){return}

  // save the TX signsature
  thePlayer.signedTx = data.signed
  console.log(thePlayer.signedTx)
  send_msg("waitingRes")

  // timeout if doesnt accept
  if(!theReady.timeout){
    theReady.timeout = setTimeout(() => {
      theReady.status = false;
      send_msg("cancel")
      console.log("team set to false")
    }, 52000)
  }

  let sentSign = theReady.data.filter(f => f.signedTx !== undefined)
  console.log(sentSign)
  // if both have sent the Tx, check it and broadcast
  if(sentSign.length === thePlayer.teamSize*2){
    clearTimeout(theReady.timeout)
    console.log(theReady.timeout, tronWeb)
    if(await betting(adr, tronWeb.toSun(100), sentSign, tronWeb)){
      //connect
      send_msg("complete")
      return sentSign
    }else{
      send_msg("failed")
      console.log("sending fail")
    }
    theReady.status = false;
  }else{
    console.log("waiting for more signs 1")
  }

}
