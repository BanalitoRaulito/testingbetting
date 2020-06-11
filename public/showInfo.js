let scanLink = adr => {
  let adr_ = adr.substring(0, 4)
  return `<a href='https://tronscan.org/#/address/${adr}' target='_blank'> ${adr_} </a>`;
}

socket.on("sendInfo", data => {
  console.log(data)
  let looking = ""
  let playing = ""
  let oldGames = ""

  if(data.info.searching.length > 0){
    data.info.searching.forEach(s => looking += s.address + "<br>")
  }else{ looking = "<br>" }

  if(data.info.gamesOn.length > 0){
    data.info.gamesOn.forEach(s => {
      playing += s.team1.score +" - "+ s.team2.score +"<br>";

      s.team1.bets.forEach(t => playing += " "+scanLink(t.adr)+" ")

      playing += " - "
      s.team2.bets.forEach(t => playing += " "+scanLink(t.adr)+" ")
      playing += "<br><br>"
    })
  }else{ playing = "<br>" }

  if(data.info.oldGames.length > 0){
    data.info.oldGames.reverse().forEach(s => {
      oldGames += s.team1.score +" - "+ s.team2.score +"<br>";

      s.team1.bets.forEach(t => oldGames += " "+scanLink(t.adr)+" ")

      oldGames += " - "
      s.team2.bets.forEach(t => oldGames += " "+scanLink(t.adr)+" ")
      oldGames += "<br><br>"
    })
  }else{ oldGames = "<br>" }

  $("#lobby > .looking").html(looking)
  $("#lobby > .inGame").html(playing)
  $("#lobby > .oldGames").html(oldGames)
})
socket.emit("showInfo")
