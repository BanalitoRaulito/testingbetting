module.exports = class Lobby{
  constructor(socket, data, searching, teams){
    this.socket = socket;
    this.data = data;
    this.searching = searching;
    this.teams = teams;
  }


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


  expectWithTwo(){
    expect(this.socket.emit.mock.calls.length).toBe(4)
    expect(this.socket.emit.mock.calls).toEqual([
      ["msg", { "msg": "searching" }],
      ["msg", { "msg": "searching" }],
      ["msg", { "msg": "acceptNow" }],
      ["msg", { "msg": "acceptNow" }]
    ])
    expect(this.searching.length).toBe(0)
    expect(this.teams.length).toBe(1)
  }


  expectWithCancel(){
    expect(this.socket.emit.mock.calls.length).toBe(2)
    expect(this.socket.emit.mock.calls).toEqual([
      ["msg", { "msg": "searching" }],
      ["msg", { "msg": "cancel" }]
    ])
    expect(this.searching.length).toBe(0)
  }
}
