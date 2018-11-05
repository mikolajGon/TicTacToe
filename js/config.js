class Config{
    constructor(boardDiv) {
        this.vsComputer = true;
        this.players = this.createNewPlayers();
        this.boardDiv = boardDiv;
    }

    get getPlayers() {
        const players = this.players;
        return this.vsComputer ? [players[0], players[2]] : [players[0], players[1]];
    }

    createNewPlayers() {
        return [
            new Player({ name: 'Player 1', symbol: 'cross', active: true }),
            new Player({ name: 'Player 2', symbol: 'circle' }),
            new Player({ name: 'Computer', symbol: 'circle', isComputer: true })
        ];
    }

    newSymbol(symbol) {
        if (symbol === this.players[0].symbol) return;
        else{
            this.players.forEach(player => {
                player.symbol = (player.symbol === 'circle') ? 'cross' : 'circle';
            });
        }
    }

    changeStartingPlayer(isStarting) {
        this.players[0].active = isStarting;
        this.players[1].active = !isStarting;
        this.players[2].active = !isStarting;
    }

    newName({player, name}) {
        player === 'Player 1' ? this.players[0].name = name : this.players[1].name = name;
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