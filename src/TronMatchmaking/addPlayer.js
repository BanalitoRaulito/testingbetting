const Player = require('./Player.js')

module.exports = (socket, data, searching, ready, tronWeb) => {
  if(!tronWeb.isAddress(data.address)){ console.log("not a Tron address"); return }
  let address = data.address;
  // if not in for searching. push()
  let theSearching = searching.find(f => f.address === address);
  // is active team
  let theReady = ready
    .filter(player => player.status === true)
    .find(player =>
      player.data.find(p => p.address === data.address
    ));

  //connect or cancel
  if(data.type === "connect"){
    theSearching || theReady || searching.push(
      new Player(data.address, socket, data.teamSize)
    )
    if(theSearching && socket){ theSearching.socket = socket; }

    return "searching"
  }else if(data.type === "cancel"){
    let theSearchingIndex = searching.findIndex(player => player.address === address);
    searching.splice(theSearchingIndex, 1)

    console.log("cancel", searching)
    return "cancel"
  }
}
