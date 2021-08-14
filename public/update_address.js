let promiseAdr = () => {
  return new Promise((resolve, reject) => {
    let i = 0;
    setTimeout(() => {
      if(i > 300){
        reject()
      }else{
        i++
        let hex = window.tronWeb.defaultAddress.base58
        if(hex !== address && hex !== undefined && address !== ""){
          console.log("found", hex, address)
          resolve(hex)
          //window.location.reload();
        }
      }
    }, 200)
  })
}

window.addEventListener('message', async (res) => {
  if (res.data.message
   && res.data.message.action == "setAccount") {
     console.log("promise")
      await promiseAdr()
  }
  if (res.data.message
   && res.data.message.action == "setNode") {
     //window.location.reload();
  }
})
