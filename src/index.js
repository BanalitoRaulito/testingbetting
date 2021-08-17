const socket = require("socket.io")
const express = require("express")
var TronMatchmaking = require("./InfoUtils/TronMatchMaking_Utils.js")
const key = "secret"
const {smartContractInfo} = require('./env.js')

const port = 80
var app = express()
var server = app.listen(port, () => {
  console.log('Running on localhost:', port)
})
app.use(express.static('../public'));


var tronMatchmaking = new TronMatchmaking(
    smartContractInfo.address,
  key,
  {fullHost: smartContractInfo.network}
)

var io = socket(server);
io.on('connect', async socket => {
  //make teams
  socket.on("play", data => {
    console.log("connect")
    tronMatchmaking.addPlayer({...data, teamSize: 1, betAmount: 100}, socket)
    tronMatchmaking.matchTeam()
    console.log("match ", tronMatchmaking.searchingPlayers.length, tronMatchmaking.searchingPlayers.map(p => p.status))
    tronMatchmaking.sendInfo(io)
  })

  // deal sigs and connect
  socket.on('signed', async data => {
    console.log("sig recived")
    let signs = await tronMatchmaking.acceptTeam(data)
    signs.complete && await tronMatchmaking.connect(signs.sentSign, key)
    tronMatchmaking.sendInfo(io)
  })


  //save oldBet
  socket.on("saveBet", data => {
    console.log("saving old bet", data)
    tronMatchmaking.saveBet(data)
    tronMatchmaking.sendInfo(io)
  })

  //send info back
  socket.on("showInfo", () => tronMatchmaking.sendInfo(socket))

  // edit gamesOn list
  socket.on("editPlaying", data => {
    console.log("edit playing")
    tronMatchmaking.editPlaying(data)
    tronMatchmaking.sendInfo(io)
  })
})
