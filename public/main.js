const adr = "TUp8qy9Gztb665D7XzcFFkD74vfL8KvHqT";
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

// window.addEventListener("beforeunload", function (e) {
//   var confirmationMessage = "\o/";
//   (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//   socket.emit("play", {type: "cancel", address})
//   return confirmationMessage;
// });

var play = async () => {
  address = window.tronWeb.defaultAddress.base58;
  if(address){
    tronWeb.setAddress(address)

    try{
      console.log("looking for oponent", address)
      tronWeb.setAddress(address)

      let inst = await tronWeb.contract().at(adr);
      let res = await inst.showBet(address).call()
      let howMuchOnSmartContract = res.toNumber()

      if(howMuchOnSmartContract === 0){
        console.log("play")
        socket.emit("play", {type: "connect", address})
      }else{
        $("#haveBetted").show()
        $("#play").hide()
      }
    }catch(err){console}
  }else{
    $("#loginPlz").show()
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

var cancel = () => { if(address){ console.log(2); socket.emit("play", {type: "cancel", address}) } }

socket.on("connectKey", data => {
  console.log("key recived")
  document.cookie = "connectKey="+data.key+"; path=/";
})

var hideAll = () => $("#play, #acceptNow, #waitingRes, #searching, #cancel, #failed, #loginPlz").hide()
socket.on("msg", async data => {
  const msg = data.msg;
  console.log(msg)

  hideAll()
  switch (msg) {
    case "searching":
      $("#searching").show()
      break;

    case "acceptNow":
      $("#acceptNow").show()
      startCount()
      await signNow()
      break;

    case "waitingRes":
      $("#waitingRes").show()
      break;

    case "failed":
      $("#play, #failed").show()
      break;

    case "cancel":
      $("#play, #cancel").show()
      break;

    case "complete":
      $("#complete").show()
      break;
  }

})
