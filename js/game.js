function returnAccumulatedScores(data) {
  let dataToAccumulate = [];
  do {
  let elementToCompare = data.shift();
  elementToCompare = { ...elementToCompare, apperances: 0 }
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
    this.board = {};
    this.players = [];
    this.ready = false;
    this.fieldsLeft = 9;
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
    this.ready = true;
  }

  makeMove(x,y){
    const element = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    const field = this.board.fields[x][y];
    field.free = false;
    field.owner = this.activePlayer;
    field.renderSymbol(element);
    this.fieldsLeft -= 1;

    if (this.checkForWin(this.activePlayer)){
      this.activePlayer.score += 1;
      alert(`${this.activePlayer.name} wins`);
    }else if (this.fieldsLeft === 0) {
      alert('draw!');
    }else{
      this.switchPlayers();
      if (this.activePlayer.isComputer) this.computerMove();
      this.ready = true;
    }
  }

  handleInteraction(e) {
    if (this.ready){
      this.ready = false;
      const { dataset: { x, y } } = e.target;
      const field = this.board.fields[x][y];
      if (!field.free) return;
      this.makeMove(x,y);
    }
  }

  checkForWin(player) {

    /***************************************************************************
     *
     *  We need to check if board state is equal to the terminal state
     *  Terminal state is when player owns 3 cells in one column, one row or one diamater
     *  x represents columns
     *  y represents row
     *
    ***************************************************************************/

    const checkFieldOwner = (x, y, owner) => {
      return this.board.fields[x][y].owner === owner;
    };

    if (
      (
        checkFieldOwner(0, 0, player) &&
        checkFieldOwner(0, 1, player) &&
        checkFieldOwner(0, 2, player)
      )
      ||
      (
        checkFieldOwner(1, 0, player) &&
        checkFieldOwner(1, 1, player) &&
        checkFieldOwner(1, 2, player)
      )
      ||
      (
        checkFieldOwner(2, 0, player) &&
        checkFieldOwner(2, 1, player) &&
        checkFieldOwner(2, 2, player)
      )
      ||
      (
        checkFieldOwner(0, 0, player) &&
        checkFieldOwner(1, 0, player) &&
        checkFieldOwner(2, 0, player)
      )
      ||
      (
        checkFieldOwner(0, 1, player) &&
        checkFieldOwner(1, 1, player) &&
        checkFieldOwner(2, 1, player)
      )
      ||
      (
        checkFieldOwner(0, 2, player) &&
        checkFieldOwner(1, 2, player) &&
        checkFieldOwner(2, 2, player)
      )
      ||
      (
        checkFieldOwner(0, 0, player) &&
        checkFieldOwner(1, 1, player) &&
        checkFieldOwner(2, 2, player)
      )
      ||
      (
        checkFieldOwner(0, 2, player) &&
        checkFieldOwner(1, 1, player) &&
        checkFieldOwner(2, 0, player)
      )
    ) return true;
  }

  computerMove() {

    /***************************************************************************
     *
     *  If this is a first move, we don't have to calculate it
     *  added math.random to randomize first move a bit
     *
    ***************************************************************************/

    if(this.fieldsLeft >= 8) {
       const random = Math.random();

      if (this.board.fields[1][1].free){
        this.makeMove(1,1);
      }else if (random > 0.75){
        this.makeMove(2,2);
      }else if (random > 0.5) {
        this.makeMove(2, 0);
      }else if (random > 0.25) {
        this.makeMove(0, 2);
      }else {
        this.makeMove(0, 0);
      }
    }
    else {

    /***************************************************************************
     *
     *  This is bread and butter of the whole AI
     *  empty array cases will store all possible scenarios created by loop
     *  First we filter only empty fields from all fields
     *  Secondly for each field we check if we would make that move we would won
     *  If yes -> we evaluate a score positevely
     *  if not we evaluate this move as zero (tie) and we create another loop
     *  that makes the same thing but for another reound, since we have already one field taken
     *  and we repeat above steps, with one difference:
     *  if there is winning move we evaluate a score negatively -> since it is our opponent turn
     *
    ***************************************************************************/
      let cases = [];

      const computer = this.activePlayer;
      const human = this.unactivePlayer;

      let allFields = [];
      this.board.fields.forEach(field => allFields = [...allFields, ...field]);

      const avaliableFields = allFields.filter(field => field.free);
      avaliableFields.forEach(field => {
        field.owner = computer;
        field.free = false;
        let step1 = Object.assign({}, { x: field.x, y: field.y });

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

     /***************************************************************************
     *
     *  After loop is done we have all possibles scenarios of 3 moves ahead,
     *  each scenario has its own score and first move (since we are doing only one move atm)
     *  but what we really need is average evaluation (score divided by instances) of each move
     *  So we created helper function that loops through scores
     *  then we sort it and use the one with best score
     *
    ***************************************************************************/

      const evaluatedMoves = returnAccumulatedScores(cases);
      const evaluetedMovesOrdered = evaluatedMoves.sort((a,b) => a.evaluate < b.evaluate ? 1: -1);

      const bestMove = evaluetedMovesOrdered.shift();
      this.makeMove(bestMove.x, bestMove.y);

    }
  }

}



