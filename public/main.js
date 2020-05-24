const adr = "TRLSHUmxVA8EPED6vnnsDPxpcqefQHqNjM";
var address = '';
var myPort = 3000;
var socket = io.connect(window.location.hostname +':'+ myPort, {secure: true});
let signed;
const options = {
  shouldPollResponse: true,
  keepTxID: true,
  callValue: 100000000
}

window.onload = () => {
  const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});
}

var play = async () => {
  address = window.tronWeb.defaultAddress.base58;
  if(address){
    console.log("play")
    tronWeb.setAddress(address)

    try{
      console.log("looking for oponent")
      address = window.tronWeb.defaultAddress.base58;
      tronWeb.setAddress(address)

      let inst = await tronWeb.contract().at(adr);
      let res = await inst.showBet(address).call()
      let howMuchOnSmartContract = res.toNumber()

      if(howMuchOnSmartContract === 0){
        socket.emit("play", {address})
      }else{
        $("#data").html("You already bet")
      }
    }catch(err){console}
  }else{
    console.log("not logged in")
  }
}

var signNow = async () => {
  address = window.tronWeb.defaultAddress.base58;
  if(address){
    tronWeb.setAddress(address)
    try{
      let tx = await tronWeb.transactionBuilder.triggerSmartContract(adr, "bet()", options, [], address)
      signed = await tronWeb.trx.sign(tx.transaction)

      socket.emit("signed", {address, signed})
    }catch(err){ console.log(err) }
  }
}

socket.on("connectKey", data => {
  document.cookie = "connectKey="+data.key+"; path=/";
})

socket.on("signNow", async () => {
  //await signNow()
})


socket.on("msg", async data => {
  $("#data").html(data.msg)
  console.log(data)
})
