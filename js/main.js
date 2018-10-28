const game = new Game(new Board);
const boardDiv = document.querySelector('#board');
const vsPlayer = document.querySelector('#vs_player');
const vsComputer = document.querySelector('#vs_computer');
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
  if ( player1 ) {
    game.startGame(boardDiv, player1, 'Computer');
    addListenersToBoardFields();
    options.classList.add('invisible');
  }
});
