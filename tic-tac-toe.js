
const GameBoard = (() => {
    const gameArray = [null, null, null, null, null, null, null, null, null];
    
    const validIndicies = [0,1,2,3,4,5,6,7,8];

    const getValIndiciesLength = () => {
        return validIndicies.length;
    }

    const getValidIndex = (randomIndex) => {
        return validIndicies[randomIndex];
    }

    const insertMove = (move, index) => {
        gameArray[index] = move;
        const validIndex = validIndicies.indexOf(index);
        validIndicies.splice(validIndex, 1);
    }

    const validMove = (index) => {
        return gameArray[index] === null;
    }

    const returnPlayerEntry = (index) => {
        return gameArray[index];
    }


    return {insertMove, validMove, getValIndiciesLength, getValidIndex, returnPlayerEntry};
})();

const Player = (playerMove) => {
    const move = playerMove;

    const returnPlayerMove = () => {
        return move;
    }

    return {returnPlayerMove}
}

function getPlayer1Move() {
    let playerMoveX = false;
    buttons[0].classList.forEach((className) => {
        if (className === 'selected') playerMoveX = true;
    });
    
    if (playerMoveX === true) return 'x';
    else return 'o';
}

function getPlayer2Move(player1Move) {
    if (player1Move == 'x') return 'o';
    else return 'x';
}

function toggleSelectedClass() {
    buttons[0].classList.toggle('selected');
    buttons[1].classList.toggle('selected');
}

function playComputerTurn(player2Move) {
    const randomIndex = Math.floor(Math.random() * GameBoard.getValIndiciesLength());
    const gameArrayIndex = GameBoard.getValidIndex(randomIndex);
    GameBoard.insertMove(player2Move, gameArrayIndex);

    const GUIid = 'sq' + String(gameArrayIndex + 1);
    for (let i = 0; i < gridElements.length; i++) {
        if (gridElements[i].id === GUIid) {
            gridElements[i].textContent = player2Move;
            break;
        }
    }
}

function checkForGameWin(playerMove) {
    if (GameState.getP1MoveCount() < 3) return false;
    
    if (GameBoard.returnPlayerEntry(0) === playerMove && GameBoard.returnPlayerEntry(1) === playerMove 
    && GameBoard.returnPlayerEntry(2) === playerMove) return true;
    
    if (GameBoard.returnPlayerEntry(3) === playerMove && GameBoard.returnPlayerEntry(4) === playerMove 
    && GameBoard.returnPlayerEntry(5) === playerMove) return true;

    if (GameBoard.returnPlayerEntry(6) === playerMove && GameBoard.returnPlayerEntry(7) === playerMove 
    && GameBoard.returnPlayerEntry(8) === playerMove) return true;

    if (GameBoard.returnPlayerEntry(0) === playerMove && GameBoard.returnPlayerEntry(3) === playerMove 
    && GameBoard.returnPlayerEntry(6) === playerMove) return true;

    if (GameBoard.returnPlayerEntry(1) === playerMove && GameBoard.returnPlayerEntry(4) === playerMove 
    && GameBoard.returnPlayerEntry(7) === playerMove) return true;

    if (GameBoard.returnPlayerEntry(2) === playerMove && GameBoard.returnPlayerEntry(5) === playerMove 
    && GameBoard.returnPlayerEntry(8) === playerMove) return true;

    if (GameBoard.returnPlayerEntry(0) === playerMove && GameBoard.returnPlayerEntry(4) === playerMove 
    && GameBoard.returnPlayerEntry(8) === playerMove) return true;

    if (GameBoard.returnPlayerEntry(2) === playerMove && GameBoard.returnPlayerEntry(4) === playerMove 
    && GameBoard.returnPlayerEntry(6) === playerMove) return true;

    else return false;
}

function game() {
    if (this.textContent != '') return;
    GameState.incrementP1MoveCount();
    const player1Move = player1.returnPlayerMove();
    const player2Move = player2.returnPlayerMove();

    this.textContent = player1Move;
    const gameArrayIndex = Number(this.id.substring(2, 3)) - 1;
    GameBoard.insertMove(player1Move, gameArrayIndex);
    const gameWonP1 = checkForGameWin(player1Move);
    
    if (gameWonP1) {
        console.log('Player 1 wins!');
        return;
    }

    if (GameState.getP1MoveCount() >= 5) {
        console.log("It's a draw!");
        return;
    }

    playComputerTurn(player2Move);
    if (checkForGameWin(player2Move)) {
        console.log('Player 2 wins!');
        return; 
    }
}

const gridElements = document.querySelectorAll('.grid-element');
gridElements.forEach((gridElement) => {
    gridElement.addEventListener('click', game);
});

const buttons = document.querySelectorAll('.choice-bttn');
buttons.forEach((button) => {
    button.addEventListener('click', toggleSelectedClass);
});

const GameState = (() => {
    player1MoveCount = 0;

    const incrementP1MoveCount = () => {
        player1MoveCount++;
    }

    const getP1MoveCount = () => {
        return player1MoveCount;
    }

    return {incrementP1MoveCount, getP1MoveCount}
})();

const player1 = Player(getPlayer1Move());
const player2 = Player(getPlayer2Move(player1.returnPlayerMove()));
