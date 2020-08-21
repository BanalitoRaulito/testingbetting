const Player = require('./Player.js')

module.exports = (socket, data, searching, ready, tronWeb) => {
  if(!tronWeb.isAddress(data.address)){ console.log("not a Tron address"); return }
  let address = data.address;
  // if not in for searching. push()
  let player = searching.find(f => f.address === address);
  // is active team
  let team = ready
    .filter(player => player.status === true)
    .find(player =>
      player.data.find(p => p.address === data.address
    ));

  //connect or cancel
  if(data.type === "connect"){
    player || team || searching.push(
      new Player(socket, data.address, data.teamSize, data.betAmount)
    )
    if(player && socket){ player.socket = socket; }

    return "searching"
  }else if(data.type === "cancel"){
    let playerIndex = searching.findIndex(player => player.address === address);
    searching.splice(playerIndex, 1)

    console.log("cancel", searching)
    return "cancel"
  }
}
