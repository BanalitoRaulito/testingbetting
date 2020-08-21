const socket = require("socket.io")
const express = require("express")
var TronMachmaking = require("./InfoUtils/TronMatchMaking_Utils.js")
const key = "secret"

const port = 3000
var app = express()
var server = app.listen(port, () => {
  console.log('Running on localhost:', port)
})
app.use(express.static('../public'));


var tronMachmaking = new TronMachmaking(
  "TNR4oeTsvfAfAbYGP2qmEWynFCfSXV6yH7",
  key,
  {fullHost: 'https://api.nileex.io'}
)

var io = socket(server);
io.on('connect', async socket => {
  //make teams
  socket.on("play", data => {
    console.log("connect")
    tronMachmaking.addPlayer({...data, teamSize: 2, betAmount: 100}, socket)
    tronMachmaking.matchTeam()
    tronMachmaking.sendInfo(io)
  })

  // deal sigs and connect
  socket.on('signed', async data => {
    console.log("sig recived")
    let sentSign = await tronMachmaking.acceptTeam(data)
    sentSign && await tronMachmaking.connect(sentSign, key)
    tronMachmaking.sendInfo(io)
  })


  //save oldBet
  socket.on("saveBet", data => {
    console.log("saving old bet", data)
    tronMachmaking.saveBet(data)
    tronMachmaking.sendInfo(io)
  })

  //send info back
  socket.on("showInfo", () => tronMachmaking.sendInfo(socket))

  // edit gamesOn list
  socket.on("editPlaying", data => {
    console.log("edit playing")
    tronMachmaking.editPlaying(data)
    tronMachmaking.sendInfo(io)
  })
})
