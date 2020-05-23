const TronWeb = require("TronWeb")
const tronWeb = new TronWeb({fullHost: 'https://api.shasta.trongrid.io'});

module.exports = async (adr, bets) => {
  let check = true;

  bets.forEach(async b => {
    try{
      const feeLimit = b.signedTx.raw_data.fee_limit
      const address = b.address;
      const value =  b.signedTx.raw_data.contract[0].parameter.value;
      const address_form_tx = value.owner_address;
      const contract_address = value.contract_address;
      tronWeb.setAddress(address)
      console.log(address, adr)

      let inst = await tronWeb.contract().at(adr);
      let res = await inst.showBet(address).call()
      let howMuchOnSmartContract = res.toNumber()

      console.log("howmuch", howMuchOnSmartContract, howMuchOnSmartContract !== 0)
      //howMuchOnSmartContract !== 0
      if(howMuchOnSmartContract !== 0
     || feeLimit < 1000000
     || address_form_tx !== tronWeb.address.toHex(address)
     || contract_address !== tronWeb.address.toHex(adr)){
        check = false;
        console.log("failed here", false)
      }

    }catch(err){ console.log(err) }
  })

  return check
}
