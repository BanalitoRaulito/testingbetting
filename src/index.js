const socket = require("socket.io")
const express = require("express")
const betting = require("./betting.js")
const connect = require("./connect.js")
const TronWeb = require("tronweb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});
const adr = "TEWsz4AJPAL7nctQbv56kT7fr6MVu7bwj7";
var key = "secret";

const port = 80
var app = express()
var server = app.listen(port, () => {
  console.log('Running on localhost:', port)
})
app.use(express.static('../public'));


const teamSize = 1;
var searching = [];
var teams = []

var io = socket(server);
io.on('connect', async socket => {
  //make teams
  socket.on("play", data => {
    console.log("connect")
    if(tronWeb.isAddress(data.address)){
      let address = data.address;
      // if not in for searching. push()
      let isSearching = searching.find(f => f.address === address);
      //connect or cancel
      if(data.type === "connect"){
        if(isSearching === undefined){
          searching.push({address: data.address, socket})
        }else{
          isSearching.socket = socket
        }
      }else if(data.type === "cancel"){
        let isSearchingIndex = searching.findIndex(f => f.address === address);
        searching.splice(isSearchingIndex, -1)
        console.log("cancel", searhing)
      }
    }

    //if 2 in searhing. move them to teams[]
    if(searching.length === teamSize*2){
      teams.push({ data: [searching[0], searching[1]], status: true })
      searching.splice(0, 2)
      console.log(searching, teams)

      teams[teams.length-1].data.forEach(s => s.socket.emit("msg", {msg: "acceptNow"}))
      console.log("sign now")
    }else{
      console.log("wait")
    }
  })


  // deal sigs and connect
  socket.on('signed', async data => {
    console.log("sig recived")
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

      //set timeout if
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
  })
})
