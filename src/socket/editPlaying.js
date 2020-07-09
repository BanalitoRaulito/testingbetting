module.exports = (data, gamesOn) => {
  let id = data.thisServerId
  if(!data.delete){
    gamesOn.set(id, {
      t1: data.t1,
      t2: data.t2,
      t1_score: data.t1_score,
      t2_score: data.t2_score
    })
  }else{
    gamesOn.delete(id)
  }
  console.log("games ON mapping", gamesOn)
}
