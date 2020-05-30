const ioc = require('socket.io-client');
const {v4} = require('uuid');
const jwt = require('jsonwebtoken');
const servers = require('./serversFile.js')

module.exports = async (sentSign, key) => {
  console.log("start game", servers)
  let server = servers.find(async n => {
    try{
      let s = ioc('http://'+ n.ip +':'+ n.port)
      s.emit("getInfo")
      let recive = await promiseRecive(s)
      console.log("recive ", recive)
      if(recive < 1){
        console.log("this server", n.port)
        return true
      }
    }catch(err){console.log(err)}
  })
  console.log("server", server)

  let betInfo = [
    {uuid: v4(), adr: sentSign[0].address, key: v4()},
    {uuid: v4(), adr: sentSign[1].address, key: v4()},
  ]

  let bet = jwt.sign({betInfo}, key)
  console.log("bet", bet)
  let connect = ioc("http://"+ server.ip +":"+ server.port)
  //let connect = ioc("http://localhost:4000")
  connect.emit("addBet", {bet});

  // send key to client an redirect
  sentSign.forEach((t, i) => t.socket.emit("connectKey", {key: betInfo[i].key}))
}

let promiseRecive = server => {
  return new Promise((resolve, reject) => {
    server.on("reciveInfo", data => {
      console.log("players", data.players)
      resolve(data.players);
      return;
    })
  })
}
