const Lobby = require("./test_lobby")
const matchTeam = require("./socket/matchTeam")

var makeLobby = () => {
  const socket = {
    emit: jest.fn(),
  }
  const data = {
    address: "TPyeiZZ32LwQgv8AVdoq6XCpaJK8jbJ1Pj",
    type: "connect",
  }
  const searching = []
  const teams = []

  return new Lobby(socket, data, searching, teams)
}

// test 1
test("matchTeam 1 player connect", () => {
  let l = makeLobby()

  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWithOne()
})


// test 2
test("matchTeam 1 player connects and then cancels", () => {
  let l = makeLobby()

  // 1 and cancel
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.data.type = "cancel"
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWithCancel()
})


// test 3
test("matchTeam 2 player connect", () => {
  let l = makeLobby()

  // 1
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWithOne()

  // 2
  l.data.address = "TEL1u2FV3yTh6iiPFC3KCXFzeXbnU7SxLR"
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWithTwo()
})
