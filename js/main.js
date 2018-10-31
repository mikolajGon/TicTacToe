const game = new Game();
const boardDiv = document.querySelector('#board');
const vsPlayer = document.querySelector('#vs_player');
const vsComputer = document.querySelector('#vs_computer');
const restart = document.querySelector('#restart');
const options = document.querySelector('#options');
const message = document.querySelector('#message');


function clearBoard() {
  while (boardDiv.firstChild) {
    boardDiv.removeChild(boardDiv.firstChild);
  }
}

function addListenersToBoardFields() {
  const fieldDivs = document.querySelectorAll('[data-field]');
  fieldDivs.forEach(field => {
    field.addEventListener('click', e => {
      game.handleInteraction(e);
    });
  });
}

function getPlayerName(player) {
  const name = document.querySelector(`#${player}`).value;
  console.log(name);
  if (name.length < 2) {
    message.textContent = `Please enter ${player} name`;
    return false;
  } else {
    return name;
  }

}

//add listener

vsComputer.addEventListener('click', () => {
  clearBoard();
  const player1 = getPlayerName('player1');
  if (player1) {
    game.startNewGame(
      boardDiv,
      { name: player1, symbol: 'cross', active: true },
      { name: 'Computer', symbol: 'circle', isComputer: true }
    );
    addListenersToBoardFields();
    // options.classList.add('invisible');
  }
});

vsPlayer.addEventListener('click', () => {
  clearBoard();
  const player1 = getPlayerName('player1');
  const player2 = getPlayerName('player2');
  if (player1 && player2) {
    game.startNewGame(
      boardDiv,
      { name: player1, symbol: 'cross', active: true },
      { name: player2, symbol: 'circle' }
    );
    addListenersToBoardFields();
    // options.classList.add('invisible');
  }
});

restart.addEventListener('click', () => {
  clearBoard();
    game.startGame(boardDiv);
    addListenersToBoardFields();
    // options.classList.add('invisible');
});