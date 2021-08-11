pragma solidity 0.5.8;

contract BetContract{
  address payable owner;
  constructor() public { owner = msg.sender; }

  modifier onlyOwner(){ require(msg.sender == owner); _; }



  struct Person{
    address adr;
    uint betAmount;
    uint256 timestamp;
    string mkey;
  }
  mapping(address => Person) public people;
  address[] public betAdr;



  event eventBet(address indexed adr);


  function bet() public payable{
    require(msg.value >= 100000000, "Low bet");
    require(people[msg.sender].betAmount == 0, "Already made a bet");

    betAdr.push(msg.sender);
    people[msg.sender].betAmount = msg.value;
    people[msg.sender].timestamp = block.number;

    emit eventBet(msg.sender);
  }


  function showBetCount() public view returns(uint){
    return betAdr.length;
  }

  function showBet(address _adr) public view returns(uint){
    return people[_adr].betAmount;
  }


  function withdraw() public{
      require(people[msg.sender].betAmount > 0, "low balance");
      require(block.number > 400 + people[msg.sender].timestamp, "you have to wait");

      address payable _send = msg.sender;
      uint amount = people[msg.sender].betAmount;
      people[_send].betAmount = 0;
      people[_send].timestamp = 0;

      _send.transfer(amount);
  }

  function payOut(
    uint ownerAmount,
    uint team1Amount,
    uint team2Amount,
    address payable[] memory team1,
    address payable[] memory team2
  ) public onlyOwner{

    owner.transfer(ownerAmount);

    for(uint i = 0; i < team1.length; i++){
      if(team1Amount > 0){
        people[ team1[i] ].betAmount = 0;
        team1[i].transfer(team1Amount);
      }else{
        people[ team1[i] ].betAmount = 0;
      }

      if(team2Amount > 0){
        people[ team2[i] ].betAmount = 0;
        team2[i].transfer(team2Amount);
      }else{
        people[ team2[i] ].betAmount = 0;
      }
    }
  }
}
