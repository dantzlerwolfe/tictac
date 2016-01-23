function runGame() {
  var grid = document.getElementById('game-grid');
  var gridImage = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var messenger = document.getElementById('message-board');
  var players = ["Computer","Human"];
  var turnCount = 0;
  var gameStatus = "new"
  var winningSums;
  var connectedSums;
  var computerGo = null;

  grid.addEventListener("click", function (event) { 
    tryTurn(event);
  }, false);

  function turnPrompt () {
    if (gameStatus == "new") {
      compTurn = Boolean(Math.round(Math.random()));
      currentPlayer = players[Math.round(Math.random())];
      gameStatus = "playing";
    }
    messenger.textContent = currentPlayer + "\'s turn. Click on the desired square.";
    if (currentPlayer == players[0]) takeTurn();
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
        messenger.textContent = "X wins! Refresh the page to play again.";
        gameStatus = "won";
        return null;
      } else if (winningSums[i] == -3) {
        messenger.textContent = "O wins! Refresh the page to play again.";
        gameStatus = "won";
        return null;
      } else gameStatus = "playing";
    }
  }

  function compStrat () {
    var selection = Math.round(8 * Math.random());
    if (!gridImage[selection]) return selection;
    else return compStrat();
  }

  function tryTurn (event) {
    if (!gridImage[event.target.id]) {
      takeTurn(event);
    } else {
      messenger.textContent = "Choose a different square!";
    }
  }

  function takeTurn(event) {
    var compMove;
    if (currentPlayer == players[1]) {
      gridImage[event.target.id] = 1;
      document.getElementById(event.target.id).textContent = "X";
      turnCount++;
    } else if (currentPlayer == players[0]) {
      compMove = compStrat();
      gridImage[compMove] = -1;
      document.getElementById(compMove).textContent = "O";
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
    } else if (turnCount >= 9) {
      console.log(turnCount);
      gameStatus = "draw";
      messenger.textContent = "It's a draw! Refresh the page to play again.";
    }
  }
  turnPrompt();
}