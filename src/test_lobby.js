var defaultMSG_grup = [
  ["msg", { "msg": "searching" }],
  ["msg", { "msg": "searching" }],
  ["msg", { "msg": "acceptNow" }],
  ["msg", { "msg": "acceptNow" }]
]

module.exports = class Lobby{
  constructor(socket, data, searching, teams){
    this.socket = socket;
    this.data = data;
    this.searching = searching;
    this.teams = teams;
  }

  //cancel
  expectWithCancel(){
    expect(this.socket.emit.mock.calls.length).toBe(2)
    expect(this.socket.emit.mock.calls).toEqual([
      ["msg", { "msg": "searching" }],
      ["msg", { "msg": "cancel" }]
    ])
    expect(this.searching.length).toBe(0)
  }

  // 1
  expectWithOne(){
    expect(this.socket.emit.mock.calls.length).toBe(1)
    expect(this.socket.emit.mock.calls[0]).toEqual([
      "msg", { msg: "searching" }
    ])
    expect(this.searching).toEqual([{
      address: "TPyeiZZ32LwQgv8AVdoq6XCpaJK8jbJ1Pj",
      socket: this.socket,
    }])
    expect(this.teams).toEqual([])
  }

  // 2
  expectWithTwo(){
    expect(this.socket.emit.mock.calls.length).toBe(4)
    expect(this.socket.emit.mock.calls).toEqual(defaultMSG_grup)
    expect(this.searching.length).toBe(0)
    expect(this.teams.length).toBe(1)
  }

  // 3
  expectWithThree(){
    expect(this.socket.emit.mock.calls.length).toBe(5)
    expect(this.socket.emit.mock.calls)
      .toEqual(defaultMSG_grup.concat([
        ["msg", { "msg": "searching" }]
      ]))
    expect(this.searching.length).toBe(1)
    expect(this.teams.length).toBe(1)
  }

  // 4
  expectWithFour(){
    expect(this.socket.emit.mock.calls.length).toBe(8)
    expect(this.socket.emit.mock.calls)
      .toEqual(defaultMSG_grup.concat(defaultMSG_grup))
    expect(this.searching.length).toBe(0)
    expect(this.teams.length).toBe(2)
  }
}
