module.exports = (searching, teams) => {
  //filter isSearching
  for(var i = 1; i < 4; i++){
    let searching_filter = searching.filter(player => player.teamSize === i)
    //if 2 in searhing. move them to teams[]
    console.log(searching_filter.length, i*2)
    if(searching_filter.length === i*2){
      teams.push({ data: searching_filter, status: true })
      searching.splice(0, i*2)
      console.log(searching, searching_filter, teams, i)

      let y = teams.length-1;
      teams[y].data.forEach(p => p.socket && p.socket.emit("msg", {msg: "acceptNow"}))

      console.log("sign now")
      return "signNow"
    }else{
      console.log("wait")
    }
  }
}
