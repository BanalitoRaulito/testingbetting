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
    tronMatchmaking.addPlayer(data, socket) // add a player in searching list
    tronMatchmaking.matchTeam()             // tries to match
  })

  // deal with signatures
  socket.on('signed', async data => {
    await tronMatchmaking.acceptTeam(data) // waits(max 50sec) for all the signatures
                                           // then checks signatures and broadcasts then to Tron blockchain
  })
})
```

#### new TronMatchMaking(contract_adr, tronWeb_options)
```javascript
// Inputs
let contract_adr = "TNR4oeTsvfAfAbYGP2qmEWynFCfSXV6yH7" // Smart Contract Hash (Address)
let tronWeb_options = {fullHost: 'https://api.nileex.io'} // Select the network (other tronWeb options)
```
#
#
#### Only three simple functions: 1) add 2) match 3) accept
#
#
#### addPlayer(data, socket)
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
