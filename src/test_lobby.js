

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



  expectWith(length, msg, searching_l, teams_l, searching = 0, teams = 0){
    expect(this.socket.emit.mock.calls.length).toBe(length)
    expect(this.socket.emit.mock.calls).toEqual(msg)
    expect(this.searching.length).toBe(searching_l)
    expect(this.teams.length).toBe(teams_l)
    
    if(searching){
      expect(this.searching).toEqual(searching)
    }
    if(teams){
      expect(this.teams).toEqual(teams)
    }
  }
}
