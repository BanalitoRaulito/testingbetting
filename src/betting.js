const TronWeb = require("TronWeb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});

module.exports = async (adr, bets) => {
  const contract_adr = tronWeb.address.toHex(adr);
  // get contract instance
  let inst = await tronWeb.contract().at(adr);
  if(!inst){
    console.log("failed to see contract")
    return
  }

  // test signature
  let sigValues = bets.every(b => {
    const address = tronWeb.address.toHex(b.address);
    const value =  b.signedTx.raw_data.contract[0].parameter.value;

    const feeLimit = b.signedTx.raw_data.fee_limit > 1000000;
    const check_address = value.owner_address === address;
    const check_adr = value.contract_address === contract_adr;
    tronWeb.setAddress(address)

    if(feeLimit && check_address && check_adr){
      console.log("checks", feeLimit, check_address, check_adr)
      return true
    }
  })
  if(!sigValues){
    console.log("tests failed")
    return
  }

  //how much on contract
  let muchMap = bets.map(b => inst.showBet(b.address).call())
  let much = await Promise.all(muchMap)
  if(!much.every(b => b.toNumber() === 0)){
    console.log("failed", much, much.every(b => b.toNumber() === 0))
    return
  }

  // how much on acc
  let balanceMap = bets.map(b => tronWeb.trx.getBalance(b.address))
  let balance = await Promise.all(balanceMap)
  if(!balance.every(b => b > 100000000)){
    console.log(balance, balance.every(b => b > 100000000))
    return
  }

  //send tx to chain
  let sent_to_chain = bets.map(h => tronWeb.trx.sendRawTransaction(h.signedTx))
  return await Promise.all(sent_to_chain).then(b => {
    console.log("sent", b, b.every(tx => !!tx.result))
    return b.every(tx => !!tx.result)
  })
}
