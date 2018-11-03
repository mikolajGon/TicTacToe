class Game {
  constructor(config) {
    this.board = [];
    this.players = [];
    this.ready = false;
    this.fieldsLeft = 0;
    this.config = config;
  }

  get activePlayer() {
    return this.players.find(player => player.active);
  }

  get unactivePlayer() {
    return this.players.find(player => !player.active);
  }

  createPlayers(getPlayers) {
    this.players = getPlayers;
  }

  newBoard(board) {
    this.board = board;
  }

  switchPlayers() {
    this.players.forEach(player => player.active = !player.active);
  }

  startNewGame() {
    this.createPlayers(this.config.getPlayers);
    this.startGame( this.config.boardDiv);
  }

  startGame() {
    this.newBoard(new Board);
    this.board.renderFields(this.config.boardDiv);
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
      displayMessage(`${this.activePlayer.name} has won!`);
      config.renderScores();
      this.switchPlayers();
      beginning.classList.remove('invisible');
    }else if (this.fieldsLeft === 0) {
      displayMessage('Draw');
      config.renderScores();
      this.switchPlayers();
      beginning.classList.remove('invisible');
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
      if (field.free) this.makeMove(x, y);
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

    const checkNextMove = (depth, player) => {
      if (this.checkForWin(this.board, computer)) {
        return 10-depth;
      } else if (this.checkForWin(this.board, human)) {
        return depth-10;
      } else if ((this.fieldsLeft - depth) === 0) {
        return 0;
      }

      let moves = [];
      for (const field of this.board.freeFields) {
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
    };

    const bestMove = checkNextMove(0, computer);
    this.makeMove(bestMove.x, bestMove.y);
  }

}



