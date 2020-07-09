const socket = require("socket.io")
const express = require("express")
var sendInfo = require("./utils/sendInfo.js")
var acceptTeam = require("./socket/acceptTeam.js")
var matchTeam = require("./socket/matchTeam.js")
var editPlaying = require("./socket/editPlaying.js")
var saveBet = require("./socket/saveBet.js")
var connect = require("./utils/connect.js")
const adr = "TV1oVqcdJKKF9M554ir1GcJpDnXyWVCeRf";
var key = "secret";

const port = 3000
var app = express()
var server = app.listen(port, () => {
  console.log('Running on localhost:', port)
})
app.use(express.static('../public'));


const teamSize = 1;
var searching = [];
var teams = []
var oldGames = []
var gamesOn = new Map()

//connect([{address: "kod"}, {address: "kods"}], key)

var io = socket(server);
io.on('connect', async socket => {
  //make teams
  socket.on("play", data => {
    console.log("connect")
    matchTeam(socket, data, searching, teams, teamSize)
    sendInfo(io, searching, oldGames, gamesOn)
  })


  // deal sigs and connect
  socket.on('signed', async data => {
    console.log("sig recived")
    await acceptTeam(socket, data, adr, searching, teams, teamSize, key)
    sendInfo(io, searching, oldGames, gamesOn)
  })


  //save oldBet
  socket.on("saveBet", data => {
    console.log("saving old bet", data)
    saveBet(io, data, key, searching, oldGames, gamesOn)
  })

  //send info back
  socket.on("showInfo", () => sendInfo(socket, searching, oldGames, gamesOn))

  // edit gameOn list
  socket.on("editPlaying", data => {
    console.log("edit playing")
    editPlaying(data, gamesOn)
    sendInfo(io, searching, oldGames, gamesOn)
  })
})
