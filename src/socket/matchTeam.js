const TronWeb = require("tronweb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});

module.exports = (socket, data, searching, teams, teamSize) => {
  if(tronWeb.isAddress(data.address)){
    let address = data.address;
    // if not in for searching. push()
    let isSearching = searching.find(f => f.address === address);
    // is active team
    let isTeam = teams.filter(k => k.status === true).find(t => t.data.find(f => f.address === data.address));

    //connect or cancel
    if(data.type === "connect"){
      if(isSearching === undefined){
        if(isTeam === undefined){
          searching.push({address: data.address, socket})
          socket.emit("msg", {msg: "searching"})
        }
      }else{
        isSearching.socket = socket
        socket.emit("msg", {msg: "searching"})
      }
    }else if(data.type === "cancel"){
      let isSearchingIndex = searching.findIndex(f => f.address === address);
      searching.splice(isSearchingIndex, 1)
      socket.emit("msg", {msg: "cancel"})
      console.log("cancel", searching)
    }
  }

  //if 2 in searhing. move them to teams[]
  if(searching.length === teamSize*2){
    teams.push({ data: [searching[0], searching[1]], status: true })
    searching.splice(0, 2)
    console.log(searching, teams)

    let i = teams.length-1;
    teams[i].data.forEach(s => s.socket.emit("msg", {msg: "acceptNow"}))
    console.log("sign now")
  }else{
    console.log("wait")
  }
}
