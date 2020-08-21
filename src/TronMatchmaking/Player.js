module.exports = class Player{
  constructor(socket, adr, teamSize, betAmount){
    this.address = adr;
    this.socket = socket;
    this.teamSize = teamSize;
    this.betAmount = betAmount;
    this.status = false;
  }
}
