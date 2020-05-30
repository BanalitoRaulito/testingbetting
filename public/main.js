const adr = "TJHMzKKRqScDu46Zwu7JvigX27arjrot82";
var address = '';
var myPort = 80;
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
        socket.emit("play", {type: "connect", address})
        $("#searching").removeClass("hidden")
      }else{
        $("#haveBetted").removeClass("hidden")
        $("#play").addClass("hidden")
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

var startCount = () => {
  var count = 50;
  let int = setInterval(() => {
    $("#timeLeft").text(count +" seconds left")
    count--;
    if(count <= 0){clearInterval(int)}
  }, 1000)
}

var cancel = () => { if(address){ socket.emit("play", {type: "cancel", address}) } }

socket.on("connectKey", data => {
  console.log("key recived")
  document.cookie = "connectKey="+data.key+"; path=/";
})

socket.on("msg", async data => {
  const msg = data.msg;
  console.log(msg)

  if(msg === "acceptNow"){
    await signNow()
    $("#acceptNow").show()
    $("#play, #searching, #cancel, #failed").hide()
    startCount()
  }else if(msg === "waitingRes"){
    $("#waitingRes").show()
    $("#play, #acceptNow, #searching, #cancel, #failed").hide()
  }else if(msg === "failed"){
    $("#play, #failed").show()
    $("#acceptNow, #searching, #waitingRes, #cancel").hide()
  }else if(msg === "cancel"){
    $("#play, #cancel").show()
    $("#acceptNow, #searching, #waitingRes, #failed").hide()
  }else if(msg === "complete"){
    $("#complete").show()
    $("#play, #acceptNow, #searching, #waitingRes, #failed, #cancel").hide()
  }

})
