
const Player = (playerMove) => {
    let move = playerMove;

    const returnPlayerMove = () => {
        return move;
    }

    const setPlayerMove = (newMove) => {
        move = newMove;
    }
    return {returnPlayerMove, setPlayerMove}
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
            const gridElementChild = gridElements[i].childNodes[1];
            gridElementChild.classList.add('insertMove');
            gridElementChild.textContent = player2Move;
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

function insertGameEndMessage(winStatus) {
    setTimeout(function() {body.prepend(gameEndMessage);}, 600);
    const gameMessage = gameEndMessage.childNodes[1].childNodes[1];
    const gameWinner = gameEndMessage.childNodes[1].childNodes[3];

    if (winStatus === 'p1Win') {
        gameWinner.textContent = GameState.player1.returnPlayerMove();
    }

    else if (winStatus === 'p2Win') {
        gameWinner.textContent = GameState.player2.returnPlayerMove();
    }

    else {
        gameMessage.textContent = "It's a Draw";
        gameWinner.textContent = '';
    }
}

function restartGame() {
    GameState.restartGameState();
    GameBoard.resetGameBoard();

    gridElements.forEach((gridElement) => {
        gridElement.childNodes[1].textContent = "";
        gridElement.childNodes[1].className = '';
    });
}

function hidePopUp() {
    gameEndMessage.remove();
    restartGame();
}

function game() {
    const gridElementChild = this.childNodes[1];
    
    if (gridElementChild.textContent != '') return;
    GameState.incrementP1MoveCount();
    const player1Move = GameState.player1.returnPlayerMove();
    const player2Move = GameState.player2.returnPlayerMove();

    gridElementChild.classList.add('insertMove');
    gridElementChild.textContent = player1Move;
    const gameArrayIndex = Number(this.id.substring(2, 3)) - 1;
    GameBoard.insertMove(player1Move, gameArrayIndex);
    
    if (checkForGameWin(player1Move)) {
        insertGameEndMessage('p1Win');
        return;
    }

    if (GameState.getP1MoveCount() >= 5) {
        insertGameEndMessage('draw');
        return;
    }

    playComputerTurn(player2Move);
    if (checkForGameWin(player2Move)) {
        insertGameEndMessage('p2Win');
        return; 
    }
}

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

    const returnPlayerEntry = (index) => {
        return gameArray[index];
    }

    const resetGameBoard = () => {
        for (let i = 0; i < gameArray.length; i++) {
            gameArray[i] = null;
            validIndicies[i] = i;
        }
    }

    return {insertMove, getValIndiciesLength, getValidIndex, returnPlayerEntry, resetGameBoard};
})();

const gridElements = document.querySelectorAll('.grid-element');
gridElements.forEach((gridElement) => {
    gridElement.addEventListener('click', game);
});

const buttons = document.querySelectorAll('.choice-bttn');
buttons.forEach((button) => {
    button.addEventListener('click', toggleSelectedClass);
    button.addEventListener('click', restartGame);
});

const gameEndMessage = document.querySelector('#endGameMessage-container');
gameEndMessage.addEventListener('click', hidePopUp);
gameEndMessage.remove();

const body = document.querySelector('body');

document.querySelector('#restart').addEventListener('click', restartGame);


const GameState = (() => {
    let player1MoveCount = 0;

    const player1 = Player(getPlayer1Move());

    const player2 = Player(getPlayer2Move(player1.returnPlayerMove()));

    const incrementP1MoveCount = () => {
        player1MoveCount++;
    }

    const getP1MoveCount = () => {
        return player1MoveCount;
    }

    const restartGameState = () => {
        player1MoveCount = 0;
        player1.setPlayerMove(getPlayer1Move());
        player2.setPlayerMove(getPlayer2Move(player1.returnPlayerMove()));
    }

    return {incrementP1MoveCount, getP1MoveCount, player1, player2, restartGameState};
})();
