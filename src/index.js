const socket = require("socket.io")
const express = require("express")
const {v4} = require('uuid');
const ioc = require('socket.io-client');
const jwt = require('jsonwebtoken');
const sendTx = require("./sendTx.js")
const checkSignedTx = require("./checkSignedTx.js")
const TronWeb = require("TronWeb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});
const adr = "TQuRmZh8G6CZF3J43NZ33MwjWRbGPrH3iC";
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

var io = socket(server);
io.on('connect', async socket => {
  socket.on("play", data => {
    // if not in for searching. push()
    let isSearching = searching.find(f => f.address === data.address);
    if(isSearching === undefined){
      searching.push({address: data.address, socket})
    }else{
      isSearching.socket = socket
    }
    socket.join("searching")

    //if 2 in searhing. move them to teams[]
    if(searching.length === teamSize*2){
      teams.push([ searching[0], searching[1] ])
      searching.splice(0, 2)
      console.log(searching, teams)

      io.to("searching").emit("signNow")
      console.log("sign now")
    }else{
      console.log("wait")
    }
  })

  socket.on('signed', async data => {
    console.log("sig recived")

    let isTeam = teams.find(t => t.find(f => f.address === data.address));
    let isPlayer = isTeam.find(f => f.address === data.address);
    // if player exists
    if(isPlayer !== undefined){
      // save the TX signsature
      isPlayer.signedTx = data.signed
      console.log(isPlayer)

      let sentSign = isTeam.filter(f => f.signedTx !== undefined)
      console.log(sentSign)
      // if both have sent the Tx, check it and broadcast
       if(sentSign.length === teamSize*2){
        if(await checkSignedTx(adr, sentSign)){
          if(await sendTx(io, teamSize, sentSign)){
            //connect
            console.log("start game")
            let connect = ioc("http://localhost:4000")
            let betInfo = [
              {uuid: v4(), adr: sentSign[0].address, key: v4()},
              {uuid: v4(), adr: sentSign[1].address, key: v4()},
            ]

            let bet = jwt.sign({betInfo}, key)
            console.log("bet", bet)
            connect.emit("addBet", {bet});

            // send key to client an redirect
            sentSign.forEach((t, i) => t.socket.emit("connectKey", {key: betInfo[i].key}))
          }
        }

      }else{
        console.log("waiting for more signs")
      }
    }
  })


})
