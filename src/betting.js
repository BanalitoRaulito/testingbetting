const TronWeb = require("TronWeb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});

// (contract_address, bet_amount_in_sun, [{address: client_address, signedTx: object_signed_tx}, ...])
module.exports = async (adr, betAmount, bets) => {
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

    const feeLimit = b.signedTx.raw_data.fee_limit > 10000000;
    const check_address = value.owner_address === address;
    const check_adr = value.contract_address === contract_adr;
    const check_betAmount = value.call_value == betAmount;
    tronWeb.setAddress(address)

    if(feeLimit && check_address && check_adr && check_betAmount){
      console.log("checks", feeLimit, check_address, check_adr, check_betAmount)
      return true
    }else{
      console.log("checks", feeLimit, check_address, check_adr, check_betAmount)
      console.log(check_betAmount, value.call_value, betAmount)
    }
  })
  if(!sigValues){
    console.log("tests failed")
    return
  }

  // check sign valid?
  let isValidSigMap = bets.map(b => tronWeb.trx.verifyMessage(b.signedTx.raw_data_hex, b.signedTx.signature[0]).catch(err => console.log));
  let isValidSig = await Promise.all(isValidSigMap)
  if(!isValidSig){
    console.log("not valid sig", bets[0].signedTx.raw_data_hex, bets[0].signedTx.signature[0])
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

  // still both not expired
  let timestamp = new Date().getTime()
  if(bets.every(b => b.signedTx.raw_data.expiration > timestamp + 2000)){
    console.log("still valid", bets.map(b => b.signedTx.raw_data.expiration))
  }else{
    console.log("one on tx expired")
    return
  }

  //send tx to chain
  let sent_to_chainMap = bets.map(h => tronWeb.trx.sendRawTransaction(h.signedTx))
  let sent_to_chain = await Promise.all(sent_to_chainMap)
  if(!sent_to_chain.every(tx => !!tx.result)){
    console.log("sent", sent_to_chain, sent_to_chain.every(tx => !!tx.result))
    return
  }

  //wait 19 blocks
  let waitBlocks = await promiseBlocks(sent_to_chain)
  if(!waitBlocks){
    console.log("waiting block err", waitBlocks)
    return
  }
  console.log("block have been waited")

  //check if both valid
  let getTxInfoMap = sent_to_chain.map(t => tronWeb.trx.getTransactionInfo(t.txid))
  let txInfo = await Promise.all(getTxInfoMap)
  if(!txInfo){
    console.log("failed to see tx info")
    return
  }
  console.log("tx are valid?", txInfo.every(b => b.receipt.result === "SUCCESS"), txInfo.map(b => b.receipt.result))

  return txInfo.every(b => b.receipt.result === "SUCCESS")
}


// waits 19 blocks
let promiseBlocks = async sent_to_chain => {
  return new Promise( async (resolve,reject) => {
    try {
      const timeout = 1000;
      const timeout_limit = timeout * 120;
      let timeout_count = 0;

      let interCan = setInterval(async () => {
        let getTxInfoMap = sent_to_chain.map(t => tronWeb.trx.getTransactionInfo(t.txid))
        let txInfo = await Promise.all(getTxInfoMap)
        timeout_count += timeout;
        //if tx goes in block, we will have a number
        if(txInfo.every(b => !!Number.isInteger(b.blockNumber))){
          //get biggest blockNr
          const blockNumber = Math.max(...txInfo.map(a => a.blockNumber))
          let getBlock = await tronWeb.trx.getCurrentBlock()
          let getBlockNr = getBlock.block_header.raw_data.number
          console.log("on block", getBlockNr, "- waited", getBlockNr - blockNumber)
          if(getBlockNr - blockNumber > 18){
            //when 19 blocks have been waited
            console.log("done 19 blocks")
            clearInterval(interCan)
            resolve(true);
          }
        }else if(timeout_count > timeout_limit){
          clearInterval(interCan)
          reject("timeout limit reached. 2min");
        }else{
          console.log("timeout block nr not number still", timeout_count)
        }
      }, timeout);
    } catch(err) {
      clearInterval(interCan)
      reject(`Error during setup: ${err}`);
    }
  });
}
