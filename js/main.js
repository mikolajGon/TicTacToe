const
  boardDiv = document.querySelector('#board'),
  startNewGame = document.querySelector('#start_new'),
  beginning = document.querySelector('#beginning'),
  options = document.querySelector('#options'),
  vsPlayer = document.querySelector('#vs_player'),
  vsComputer = document.querySelector('#vs_computer'),
  player1 = document.querySelector('#player1'),
  player2 = document.querySelector('#player2'),
  optionsParams = document.querySelector('#options_params')
  start = document.querySelector('#start'),
  restart = document.querySelector('#restart'),
  message = document.querySelector('#message'),
  messageContainer = document.querySelector('#message_container'),
  config = new Config(boardDiv),
  game = new Game(config);

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
  const name = player.value;
  if (name.length < 2) {
    displayMessage(`Please enter ${player} name`);
  } else {
    return { player: player, name: name };
  }
}

function displayMessage(messageText) {
  message.textContent = messageText;
  messageContainer.classList.remove('invisible');
  setTimeout(() => {
    messageContainer.classList.add('invisible');
  }, 2500);
}

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
  clearBoard();
  game.startNewGame();
  addListenersToBoardFields();
  options.classList.add('invisible');
});

restart.addEventListener('click', () => {
  clearBoard();
  game.startGame();
  addListenersToBoardFields();
  beginning.classList.add('invisible');
});



