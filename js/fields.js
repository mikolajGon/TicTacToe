class Field {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.owner = {};
    this.free = true;
  }

  renderSymbol(fieldContainer) {
    const symbol = document.createElement('div');
    const symbolClass = this.owner.symbol === 'cross' ?  'cross' : 'circle';
    symbol.classList.add(symbolClass);
    fieldContainer.appendChild(symbol);
  }
}