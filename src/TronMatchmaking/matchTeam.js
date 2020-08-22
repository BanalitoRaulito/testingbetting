module.exports = (unmatchedPlayers, ready) => {
  const matchGroups = Object.entries(
    unmatchedPlayers.reduce((o, player) => {
      const key = `${player.teamSize}-${player.betAmount}`
      o[key] = o[key] || []
      o[key].push(player)
      console.log(o)
      return o
    }, {})
  ).filter(([key, matches]) => {
    const teamSize = +key.split("-")[0]
    return matches.length === teamSize * 2
  })

  if(matchGroups.length > 1){ throw new Error("2 matches ???") }
  if(matchGroups.length === 0){ return null }

  const matchedPlayers = matchGroups[0][1]
  ready.push({data: matchedPlayers, status: true})
  matchedPlayers.forEach(player => {
    player.socket && player.socket.emit("msg", {msg: "acceptNow"})
    unmatchedPlayers.splice(unmatchedPlayers.indexOf(player), 1)
  })
  return "signNow"
}
