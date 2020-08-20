# Tron MatchMaker

### To get you started:

```javascript
let tronMatchMaking = new TronMachMaking(
  "TNR4oeTsvfAfAbYGP2qmEWynFCfSXV6yH7",
  {fullHost: 'https://api.nileex.io'}
)

var io = socket(server);
io.on('connect', async socket => {
  // make teams
  socket.on("play", data => {
    tronMatchMaking.addPlayer(data, socket) // add a player in searching list
    tronMatchMaking.matchTeam()             // tries to match
  })

  // deal with signatures
  socket.on('signed', async data => {
    await tronMatchMaking.acceptTeam(data) // waits for all the signatures (max 50sec from team creation)
                                           // then checks signatures and broadcasts then to Tron blockchain
  })
})
```

#
#
#### Only three simple functions: 1) add 2) match 3) accept
 - Add players with different team sizes
 - All transactions will be broadcasted once all of them have been recived and verified
#
#

#### Initialize new TronMatchMaking(contract_adr, tronWeb_options)
```javascript
// Inputs
let contract_adr = "TNR4oeTsvfAfAbYGP2qmEWynFCfSXV6yH7" // Smart Contract Hash (Address)
let tronWeb_options = {fullHost: 'https://api.nileex.io'} // Select the network (other tronWeb options)
```

#### 1) addPlayer(data, socket)
```javascript
// Inputs
let data = {
    address: "TU5BFJopkor7gV82pBwBNxPpafYYViz1my", // client public key
    type: "connect", // or "cancel"
    teamSize: 1, // x amount of people in one team (in this case 1 means there is 1 player in Each team)
}
let socket // clients socket to send response msg <optional> but recommended

// if player has socket, catch the msg (front-end)
socket.on("msg", msg => {console.log(msg)})
// socket msg can be: "searching", "cancel"

// RETURNS <str> "searching" or "cancel"
```

#### matchTeam()
```javascript
// socket msg can be: "acceptNow"

// RETURNS <str> undefined or "signNow"
```

#### acceptTeam(data)
```javascript
// Inputs
let data = {
    address: "TU5BFJopkor7gV82pBwBNxPpafYYViz1my", // client public key
    signed: await tronWeb.trx.sign( // signed transaction with tronWeb in the front-end (look front-end example)
        await tronWeb.transactionBuilder.triggerSmartContract(adr, "bet()", options, [], address)
    )
}

// socket msg can be: "searching", "acceptNow", "waitingRes", "failed", "complete"

// RETURNS <obj> undefined or teamObject
```
