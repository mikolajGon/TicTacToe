import {Player} from './players.js';
import {Board} from './board.js';

function returnAccumulatedScores(data) {

  let dataToAccumulate = [];

  do {
    let elementToCompare = data.shift();
    elementToCompare.z = 0;
    for (let i = 0; i < data.length; i++) {
      if (elementToCompare.x === data[i].x && elementToCompare.y === data[i].y) {
        elementToCompare.score += data[i].score;
        elementToCompare.z++;
        data.splice(i, 1);
        i--;
      }
    }
    dataToAccumulate = [
      ...dataToAccumulate,
      elementToCompare
    ];

  } while (data.length > 0)

  const dataToReturn = dataToAccumulate.map(element => {
    element.evaluate = (element.score / element.z)
    return element;
  });

  return dataToReturn
}

class Game {
  constructor() {
    this.board = new Board;
    this.players = this.createPlayers()
    this.ready = false;
    this.fieldsLeft = 9;
  }

  createPlayers() {
    return [
      new Player('Player 1', 'cross', true),
      new Player('Player 2', 'circle')
    ];

  }

  get activePlayer() {
    return this.players.find(player => player.active);
  }

  get unactivePlayer() {
    return this.players.find(player => !player.active);
  }

  switchPlayers() {
    this.players.forEach(player => player.active = !player.active);
  }

  startGame(boardDiv) {
    this.board.renderFields(boardDiv);
    this.ready = true;
  }

  makeMove(x,y){
    const element = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    const field = this.board.fields[x][y];
    field.free = false;
    field.owner = this.activePlayer;
    field.renderSymbol(element);
    this.fieldsLeft--;

    if (this.checkForWin(this.activePlayer)){
      alert(`${this.activePlayer.name} wins`);
    }else if (this.fieldsLeft === 0) {
      alert('draw!');
    }else{
      this.switchPlayers();
      if (this.activePlayer.name === 'Player 2') this.computerMove();
      this.ready = true;
    }
  }

  handleInteraction(e) {
    if (this.ready){
      this.ready = false;
      const element = e.target;
      const x = element.dataset.x;
      const y = element.dataset.y;
      const field = this.board.fields[x][y];
      if (!field.free) return;
      else {
        this.makeMove(x,y);
      }
    }
  }

  checkForWin(player) {
    if(
        (
          this.board.fields[0][0].owner === player&&
          this.board.fields[0][1].owner === player&&
          this.board.fields[0][2].owner === player
        )
        ||
        (
          this.board.fields[1][0].owner === player&&
          this.board.fields[1][1].owner === player&&
          this.board.fields[1][2].owner === player
        )
        ||
        (
          this.board.fields[2][0].owner === player&&
          this.board.fields[2][1].owner === player&&
          this.board.fields[2][2].owner === player
        )
        ||
        (
          this.board.fields[0][0].owner === player&&
          this.board.fields[1][0].owner === player&&
          this.board.fields[2][0].owner === player
        )
        ||
        (
          this.board.fields[0][1].owner === player&&
          this.board.fields[1][1].owner === player&&
          this.board.fields[2][1].owner === player
        )
        ||
        (
          this.board.fields[0][2].owner === player&&
          this.board.fields[1][2].owner === player&&
          this.board.fields[2][2].owner === player
        )
        ||
        (
          this.board.fields[0][0].owner === player&&
          this.board.fields[1][1].owner === player&&
          this.board.fields[2][2].owner === player
        )
        ||
        (
          this.board.fields[0][2].owner === player&&
          this.board.fields[1][1].owner === player&&
          this.board.fields[2][0].owner === player
        )
      ) return true;
  }

  computerMove() {

    if(this.fieldsLeft === 8) {
      if (this.board.fields[0][0].free){
        this.makeMove(0,0)
      }
      else {
        this.makeMove(2,2)
      }
    }
    else{
      let cases = [];

      const computer = this.activePlayer;
      const human = this.unactivePlayer;

      let allFields = [];
      this.board.fields.forEach(field => allFields = [...allFields, ...field]);

      const avaliableFields = allFields.filter(field => field.free);
      avaliableFields.forEach(field => {
        field.owner = computer;
        field.free = false;
        let step1 = Object.assign({}, { x: field.x, y: field.y })
        if (this.checkForWin(computer)) {
          step1.score = 10;
          cases = [...cases, Object.assign({}, step1)];
        }else {
          step1.score = 0;
          cases = [...cases, Object.assign({}, step1)];
          const avaliableFields = allFields.filter(field => field.free);
          avaliableFields.forEach(field => {
            field.owner = human;
            field.free = false;
            if (this.checkForWin(human)) {
              avaliableFields.forEach(() => {
                step1.score = -10;
                cases = [...cases, Object.assign({}, step1)];
              });
            } else {
              step1.score = 0;
              cases = [...cases, Object.assign({}, step1)];
              const avaliableFields = allFields.filter(field => field.free);
              avaliableFields.forEach(field => {
                field.owner = computer;
                field.free = false;
                if (this.checkForWin(computer)) {
                  step1.score = 9;
                  cases = [...cases, Object.assign({}, step1)];
                } else {
                  step1.score = 0;
                  cases = [...cases, Object.assign({}, step1)];
                  const avaliableFields = allFields.filter(field => field.free);
                  avaliableFields.forEach(field => {
                    field.owner = human;
                    field.free = false;
                    if (this.checkForWin(human)) {
                      avaliableFields.forEach(() => {
                        step1.score = -9;
                        cases = [...cases, Object.assign({}, step1)];
                      });
                    } else {
                      step1.score = 0;
                      cases = [...cases, Object.assign({}, step1)];

                    }
                    field.owner = {};
                    field.free = true;
                  });
                }
                field.owner = {};
                field.free = true;
              });
            }
            field.owner = {};
            field.free = true;
          });
        }
        field.owner = {};
        field.free = true;
      });

      const evaluatedMoves = returnAccumulatedScores(cases);
      const evaluetedMovesOrdered = evaluatedMoves.sort((a,b) => a.evaluate < b.evaluate ? 1: -1);
      const bestMove = evaluetedMovesOrdered.shift();
      this.makeMove(bestMove.x, bestMove.y);

    }
  }

}

export {Game};

