const game = new Game();
const boardDiv = document.querySelector('#board');
const vsPlayer = document.querySelector('#vs_player');
const vsComputer = document.querySelector('#vs_computer');
const options = document.querySelector('#options');

//add listener

vsComputer.addEventListener('click', () => {
  options.classList.add('invisible');
  while (boardDiv.firstChild) {
    boardDiv.removeChild(boardDiv.firstChild);
  }
  game.startGame(boardDiv);
  const fieldDivs = document.querySelectorAll('[data-field]');
  fieldDivs.forEach(field => {
    field.addEventListener('click', e => {
      game.handleInteraction(e);
    });
  });
});