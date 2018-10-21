import {Game} from './game.js';


const game = new Game();
const boardDiv = document.querySelector('#board');

//add listener

  // tsrating game
  game.startGame(boardDiv);

  // assing listeners to rendered board fields
  const fieldDivs = document.querySelectorAll('[data-field]');
  fieldDivs.forEach(field => {
    field.addEventListener('click', e => {
      game.handleInteraction(e);
    });
  });
