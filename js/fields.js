class Field {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.owner = {};
    this.free = true;
  }

  renderSymbol(fieldContainer) {
    const symbol = document.createElement('div');

    if ( this.owner.symbol === 'cross') {
      symbol.classList.add('cross');
    } else {
      symbol.classList.add('circle');
    }

    fieldContainer.appendChild(symbol);
  }
}

export {Field};
