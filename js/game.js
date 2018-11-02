function returnAccumulatedScores(data) {
  let dataToAccumulate = [];
  do {
  let elementToCompare = data.shift();
  elementToCompare ={ ...elementToCompare, apperances: 0 };
  for (let i = 0; i < data.length; i++) {
    const { x, y, score } = data[i];
    if (elementToCompare.x === x && elementToCompare.y === y) {
    elementToCompare.score += score;
    elementToCompare.apperances += 1;
    data.splice(i, 1);
    i--;
    }
  }
  dataToAccumulate = [
    ...dataToAccumulate,
    elementToCompare
  ];
  } while (data.length > 0);

  const dataToReturn = dataToAccumulate.map(element => {
    element.evaluate = (element.score / element.apperances);
    return element;
  });

 return dataToReturn;
}

class Game {
  constructor() {
    this.board = [];
    this.players = [];
    this.ready = false;
    this.fieldsLeft = 0;
  }

  get activePlayer() {
    return this.players.find(player => player.active);
  }

  get unactivePlayer() {
    return this.players.find(player => !player.active);
  }

  createPlayers(player1, player2) {
    this.players = [
      new Player(player1),
      new Player(player2)
    ];
  }

  newBoard(board) {
    this.board = board;
  }

  switchPlayers() {
    this.players.forEach(player => player.active = !player.active);
  }

  startNewGame(boardDiv, player1, player2) {
    this.createPlayers(player1, player2);
    this.startGame(boardDiv);
  }

  startGame(boardDiv) {
    this.newBoard(new Board);
    this.board.renderFields(boardDiv);
    this.fieldsLeft = 9;
    this.ready = true;
    this.activePlayer.isComputer && this.computerMove();
  }

  makeMove(x, y) {
    this.ready = false;
    const element = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    const field = this.board.fields[x][y];
    field.free = false;
    field.owner = this.activePlayer;
    field.renderSymbol(element);
    this.fieldsLeft -= 1;

    if (this.checkForWin(this.board, this.activePlayer)){
      this.activePlayer.score += 1;
      alert(`${this.activePlayer.name} wins`);
      this.switchPlayers();
    }else if (this.fieldsLeft === 0) {
      alert('draw!');
      this.switchPlayers();
    }else{
      this.switchPlayers();
      if (this.activePlayer.isComputer) this.computerMove();
      this.ready = true;
    }
  }

  handleInteraction(e) {
    if (this.ready){
      const { dataset: { x, y } } = e.target;
      const field = this.board.fields[x][y];
      if (!field.free) return;
      this.makeMove(x,y);
    }
  }

  checkForWin(board, player) {

    /***************************************************************************
     *
     *  We need to check if board state is equal to the terminal state
     *  Terminal state is when player owns 3 cells in one column, one row or one diamater
     *  x represents columns
     *  y represents row
     *
    ***************************************************************************/

    const checkFieldOwner = (board, x, y, owner) => {
      return board.fields[x][y].owner === owner;
    };

    if (
      (
        checkFieldOwner(board, 0, 0, player) &&
        checkFieldOwner(board, 0, 1, player) &&
        checkFieldOwner(board, 0, 2, player)
      )
      ||
      (
        checkFieldOwner(board, 1, 0, player) &&
        checkFieldOwner(board, 1, 1, player) &&
        checkFieldOwner(board, 1, 2, player)
      )
      ||
      (
        checkFieldOwner(board, 2, 0, player) &&
        checkFieldOwner(board, 2, 1, player) &&
        checkFieldOwner(board, 2, 2, player)
      )
      ||
      (
        checkFieldOwner(board, 0, 0, player) &&
        checkFieldOwner(board, 1, 0, player) &&
        checkFieldOwner(board, 2, 0, player)
      )
      ||
      (
        checkFieldOwner(board, 0, 1, player) &&
        checkFieldOwner(board, 1, 1, player) &&
        checkFieldOwner(board, 2, 1, player)
      )
      ||
      (
        checkFieldOwner(board, 0, 2, player) &&
        checkFieldOwner(board, 1, 2, player) &&
        checkFieldOwner(board, 2, 2, player)
      )
      ||
      (
        checkFieldOwner(board, 0, 0, player) &&
        checkFieldOwner(board, 1, 1, player) &&
        checkFieldOwner(board, 2, 2, player)
      )
      ||
      (
        checkFieldOwner(board, 0, 2, player) &&
        checkFieldOwner(board, 1, 1, player) &&
        checkFieldOwner(board, 2, 0, player)
      )
    ) return true;
  }

  computerMove() {

    const computer = this.activePlayer;
    const human = this.unactivePlayer;
    let allFields = [];
    this.board.fields.forEach(field => allFields = [...allFields, ...field]);


    const checkNextMove = (depth, player) => {
      const avaliableFields = allFields.filter(field => field.free);

      if (this.checkForWin(this.board, computer)) {
        return 10-depth;
      } else if (this.checkForWin(this.board, human)) {
        return depth-10;
      } else if ((this.fieldsLeft - depth) === 0) {
        return 0
      }

      let moves = [];
      for (const field of avaliableFields) {
        field.owner = player;
        field.free = false;
        const value = checkNextMove(depth + 1, (player === human) ? computer : human);
        moves = [...moves, Object.assign({}, { x: field.x, y: field.y, value: value })];
        field.owner = {};
        field.free = true;
      };

      if (player === human) {
        const movesOrderedByMin = moves.sort((a, b) => a.value < b.value ? -1 : 1);
        if (depth === 0) {
          return movesOrderedByMin.shift();
        } else {
          return movesOrderedByMin.shift().value;
        }
      }
      if (player === computer) {
        const movesOrderedByMax = moves.sort((a, b) => a.value < b.value ? 1 : -1);
        if (depth === 0) {
          return movesOrderedByMax.shift();
        } else {
          return movesOrderedByMax.shift().value;
        }
      }

    }

    const bestMove = checkNextMove(0, computer);

    this.makeMove(bestMove.x, bestMove.y);

  }

}



