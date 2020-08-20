module.exports = class Player{
  constructor(adr, socket, teamSize){
    this.address = adr;
    this.socket = socket;
    this.teamSize = teamSize;
    this.status = false;
  }
}
