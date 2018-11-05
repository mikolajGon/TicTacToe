const
  boardDiv = document.querySelector('#board'),
  startNewGame = document.querySelector('#start_new'),
  beginning = document.querySelector('#beginning'),
  options = document.querySelector('#options'),
  vsPlayer = document.querySelector('#vs_player'),
  vsComputer = document.querySelector('#vs_computer'),
  player2 = document.querySelector('#player2_input'),
  optionsParams = document.querySelector('#options_params'),
  start = document.querySelector('#start'),
  restart = document.querySelector('#restart'),
  message = document.querySelector('#message'),
  messageContainer = document.querySelector('#message_container'),
  isStarting = document.querySelector('#is_starting'),
  inputs = document.querySelectorAll('input'),
  config = new Config(boardDiv),
  game = new Game(config);

let readyForStart = true;

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

function getPlayerName(input) {
  const player = input.dataset.player;
  const name = input.value;
  console.log(name);
  if (name.length < 4) {
    displayMessage(`Please enter ${player} name`);
    readyForStart = false;
  } else {
    config.newName({ player: player, name: name });
    readyForStart = true;
  }
}

function displayMessage(messageText) {
  message.textContent = messageText;
  messageContainer.classList.remove('invisible');
}

function changeSymbols(obj) {
  const symbol = obj.dataset.symbol;
  config.newSymbol(symbol);
}

inputs.forEach(input => {
  input.addEventListener('change', (e) => {
    input.dataset.player && getPlayerName(e.target);
    input.dataset.symbol && changeSymbols(e.target);
  });
});

vsPlayer.addEventListener('click', () => {
  config.vsComputer = false;
  vsComputer.classList.remove('active');
  vsPlayer.classList.toggle('active');
  optionsParams.classList.remove('invisible');
  player2.classList.remove('invisible');
});

vsComputer.addEventListener('click', () => {
  config.vsComputer = true;
  vsComputer.classList.toggle('active');
  vsPlayer.classList.remove('active');
  optionsParams.classList.remove('invisible');
  player2.classList.add('invisible');
});

startNewGame.addEventListener('click', () => {
  clearBoard();
  config.resetScores();
  beginning.classList.add('invisible');
  restart.classList.remove('invisible');
  options.classList.remove('invisible');
});

start.addEventListener('click', (e) => {
  if (readyForStart){
    clearBoard();
    config.changeStartingPlayer(isStarting.checked);
    game.startNewGame();
    config.renderScores();
    addListenersToBoardFields();
    options.classList.add('invisible');
  }
});

restart.addEventListener('click', () => {
  clearBoard();
  game.startGame();
  addListenersToBoardFields();
  beginning.classList.add('invisible');
});



