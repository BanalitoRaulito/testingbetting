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



var msg_searching = ["msg", { "msg": "searching" }]
var msg_acceptNow = ["msg", { "msg": "acceptNow" }]
var defaultMSG_grup = [
  msg_searching,  msg_searching,
  msg_acceptNow,  msg_acceptNow
]

// test 1
test("matchTeam 1 player connects and then cancels", () => {
  let l = makeLobby()

  // 1 and cancel
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.data.type = "cancel"
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWithCancel()
})

// msg_length, msg, searching_length, teams_length, searching = 0, teams = 0
// test 2
test("matchTeam 1 player joins 2x", () => {
  let l = makeLobby()

  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWith(
    1,
    [msg_searching],
    1,
    0,
    [{
      address: "TPyeiZZ32LwQgv8AVdoq6XCpaJK8jbJ1Pj",
      socket: l.socket,
    }],
    []
  )

  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWith(
    2,
    [msg_searching, msg_searching],
    1,
    0,
    [{
      address: "TPyeiZZ32LwQgv8AVdoq6XCpaJK8jbJ1Pj",
      socket: l.socket,
    }],
    []
  )
})


// test 3
test("matchTeam 4 player connect", () => {
  let l = makeLobby()

  // 1
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWith(
    1,
    [msg_searching],
    1,
    0,
    [{
      address: "TPyeiZZ32LwQgv8AVdoq6XCpaJK8jbJ1Pj",
      socket: l.socket,
    }],
    []
  )

  // 2
  l.data.address = "TEL1u2FV3yTh6iiPFC3KCXFzeXbnU7SxLR"
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWith(4, defaultMSG_grup, 0, 1)

  // 2 - forcing 2nd twice
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWith(4, defaultMSG_grup, 0, 1)

  // 3
  l.data.address = "TBzs1vEYLkWRasgrt9r6CfzC1tvxuLv8GZ"
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWith(5, defaultMSG_grup.concat([msg_searching]), 1, 1)

  // 4
  l.data.address = "TNDd8X6vH16ougLhtUjPNeXPT5rkAuCp2m"
  matchTeam(l.socket, l.data, l.searching, l.teams)
  l.expectWith(8, defaultMSG_grup.concat(defaultMSG_grup), 0, 2)
})
