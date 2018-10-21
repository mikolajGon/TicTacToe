import {Field} from './fields.js';

class Board{
  constructor(){
    this.rows = 3;
    this.columns = 3;
    this.fields = this.createFields();
  }

  createFields() {
    let fields = [];

    for (var x = 0; x < this.columns; x++) {
      let columns = [];

      for (var y = 0; y < this.rows;y++) {
        const field = new Field(x,y);
        columns = [...columns, field];
      }

      fields = [...fields, columns];
    }

    return fields;
  }

  renderFields(boardContainer){
    const frag = document.createDocumentFragment()

    this.fields.forEach(row => {
      row.forEach(field => {
        const tile = document.createElement('div');
        tile.dataset.field = '';
        tile.dataset.x = field.x;
        tile.dataset.y = field.y;
        tile.classList.add('field');
        frag.appendChild(tile);
      });
    });

    boardContainer.appendChild(frag);

  }
}

export {Board};
