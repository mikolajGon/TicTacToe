class Player {
  constructor({name, symbol, active = false, isComputer = false}) {
    this.name = name;
    this.symbol = symbol;
    this.active = active;
    this.isComputer = isComputer;
    this.score = 0;
  }
}
