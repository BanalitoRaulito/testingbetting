module.exports = (data, gamesOn) => {
  let id = data.thisServerId
  if(data.team1.bets.length > 0){
    data.team1.bets = data.team1.bets.map(m => {return {...m, key: undefined}})
    data.team2.bets = data.team2.bets.map(m => {return {...m, key: undefined}})
    gamesOn.set(id, {team1: data.team1, team2: data.team2})
  }else{
    gamesOn.delete(id)
  }
  console.log("games ON mapping", gamesOn)
}
