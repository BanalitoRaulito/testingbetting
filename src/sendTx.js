const TronWeb = require("TronWeb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});

module.exports = async (io, teamSize, lookingPool) => {
  //set up
  //check balance before
  const a = await checkBalances(io, lookingPool)
  if(!a){
    console.log("low on money")
    return
  }

  //send tx to chain
  let sent_to_chain = setUpToSend(io, lookingPool)

  const v = await Promise.all(sent_to_chain).then(b => {
    console.log("sent", b, b.every(tx => !!tx.result))
    return b.every(tx => !!tx.result)
  })

  return v
}



// setup func
var setUpToSend = (io, lookingPool) => {
  return lookingPool.map(l =>
    tronWeb.trx.sendRawTransaction(l.signedTx)
  )
}


// check balance func
var checkBalances = async (io, lookingPool) => {
  let everyOneHasMoney = true;

  lookingPool.forEach(async f => {
    if(everyOneHasMoney){
      try{
        let balance = await tronWeb.trx.getBalance(f.address)
        console.log(balance)
        if(balance < 100000000){
          everyOneHasMoney = false;
          console.log("Someone has low balance. Match making failed")
        }
      }catch(err){ console.log(err) }
    }
  })

  return everyOneHasMoney
}
