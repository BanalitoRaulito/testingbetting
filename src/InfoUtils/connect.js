const ioc = require('socket.io-client');
const {v4} = require('uuid');
const jwt = require('jsonwebtoken');
const servers = require('../serversFile.js')

module.exports = async (sentSign, key) => {
  console.log("start game", servers)
  try{
    let serverMap = servers.map(s => promiseRecive(s))
    console.log("server map", serverMap)
    let server = await Promise.race(serverMap)
    console.log("server", server.id)
  }catch(err){
    console.log(err)
  }

  let betInfo = sentSign.map(s => {
    return {
      ...s,
      adr: s.address,
      uuid: v4(),
      key: v4(),
      isJoined: false,
      signedTx: undefined,
      socket: undefined
    }
  })
  console.log("betsssss")
  console.log(betInfo)
  // let betInfo = [
  //   {uuid: v4(), adr: sentSign[0].address, key: v4(), isJoined: false},
  //   {uuid: v4(), adr: sentSign[1].address, key: v4(), isJoined: false},
  // ]

  let bet = jwt.sign({betInfo}, key)
  console.log("bet", bet)
  //let connect = server
  let connect = ioc("http://localhost:4000")
  connect.emit("addBet", {bet});

  // send key to client an redirect
  sentSign.forEach((t, i) => t.socket.emit("connectKey", {key: betInfo[i].key}))
}

let promiseRecive = s => {
  return new Promise((resolve, reject) => {
    let server = ioc('http://'+ s.ip +':'+ s.port)
    server.emit("getInfo")
    server.on("reciveInfo", data => {
      console.log("players", data.players)
      if(data.players < 1){
        console.log("server", s.port)
        resolve(server)
      }else{
        reject(false)
      }
    })
  })
}
