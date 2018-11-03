class Config{
    constructor(boardDiv) {
        this.vsComputer = true;
        this.players = this.createNewPlayers();
        this.boardDiv = boardDiv;
    }

    createNewPlayers() {
        return [
            new Player({ name: 'Player 1', symbol: 'cross', active: true }),
            new Player({ name: 'Player 2', symbol: 'circle' }),
            new Player({ name: 'Computer', symbol: 'circle', isComputer: true })
        ];
    }

    set newSymbol(symbol) {
        if (symbol === this.players[0].symbol) return;
        else{
            this.players.forEach(player => {
                player.symbol = (symbol === 'circle') ? 'cross' : 'circle';
            });
        }
    }

    set newName({player, name}) {
        player === 'player1' ? player[0].name = name : player[1] = name;
    }

    get getPlayers() {
        const players = this.players;
        return vsComputer ? [players[0], players[2]] : [players[0], players[1]];
    }

    renderScores() {
        const
            player1 = this.getPlayers[0],
            player2 = this.getPlayers[1];
        document.querySelector(`#player1_name`).textContent = player1.name;
        document.querySelector(`#player1_score`).textContent = player1.score;
        document.querySelector(`#player2_name`).textContent = player2.name;
        document.querySelector(`#player2_score`).textContent = player2.score;
    }

    resetScores() {
        this.players.forEach(player => player.score = 0);
    }
}