module.exports = (s, searching, oldGames, gamesOn) => {
  let n_searching = searching.map(a => {return {...a, socket: undefined}})
  var info = {
    searching: n_searching,
    oldGames,
    gamesOn: [...gamesOn.values()]
  }
  s.emit("sendInfo", {info})
}
