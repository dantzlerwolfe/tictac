function runGame() {
  var grid = document.getElementById('game-grid');
  var gridImage = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var messenger = document.getElementById('message-board');
  var players = ["O","X"];
  var turnCount = 0;
  var gameStatus = "new"
  var currentPlayer;
  var winningSums;

  grid.addEventListener("click", function (event) { 
    tryTurn(event);
  }, false);

  function turnPrompt () {
    if (gameStatus == "new") {
      currentPlayer = players[Math.round(Math.random())];
      gameStatus = "playing";
    }
    messenger.textContent = currentPlayer + "\'s turn. Click on desired square.";
  }

  function switchPlayer () {
    if (currentPlayer == players[1]) currentPlayer = players[0];
    else if (currentPlayer == players[0]) currentPlayer = players[1];
  }

  function winScan () {
    winningSums = [
      gridImage[0] + gridImage[1] + gridImage[2], 
      gridImage[3] + gridImage[4] + gridImage[5],
      gridImage[6] + gridImage[7] + gridImage[8],
      gridImage[0] + gridImage[3] + gridImage[6],
      gridImage[1] + gridImage[4] + gridImage[7],
      gridImage[2] + gridImage[5] + gridImage[8],
      gridImage[0] + gridImage[4] + gridImage[8],
      gridImage[2] + gridImage[4] + gridImage[6],
    ];
    var sumsLength = winningSums.length;
    for(var i = 0; i < sumsLength; i++) {
      if (winningSums[i] == 3) {
        messenger.textContent = "X wins! Refresh page to play again.";
        gameStatus = "won";
        return undefined;
      } else if (winningSums[i] == -3) {
        messenger.textContent = "O wins! Refresh page to play again.";
        gameStatus = "won";
        return undefined;
      } else gameStatus = "playing";
    }
  }

  function tryTurn (event) {
    if (!gridImage[event.target.id]) {
      takeTurn(event);
    } else {
      messenger.textContent = "Choose a different square!";
    }
  }

  function takeTurn(event) {
    if (currentPlayer == players[1]) {
      gridImage[event.target.id] = 1;
      document.getElementById(event.target.id).textContent = "X";
      turnCount++;
    } else if (currentPlayer == players[0]) {
      gridImage[event.target.id] = -1;
      document.getElementById(event.target.id).textContent = "O";
      turnCount++;
    }
    winScan();
    if (gameStatus == "won") {
      grid.removeEventListener("click", function (event) { 
        tryTurn(event);
      }, false);
    } else if (gameStatus == "playing" && turnCount < 9) {
      switchPlayer();
      turnPrompt();
    } else if (turnCount => 9) {
      console.log(turnCount);
      gameStatus = "draw";
      messenger.textContent = "It's a draw! Refresh page to play again.";
    }
  }
  turnPrompt();
}