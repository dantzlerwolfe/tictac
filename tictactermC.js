function runInConsole() {
  var grid = [" "," "," ",
              " "," "," ",
              " "," "," "];
  var gridImage = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var players = ["O","X"];
  var turnCount = 0;
  var gameStatus = "new"
  var currentPlayer;
  var currentMove;
  var winningSums;

  function drawGrid() {
    console.log("  1   2   3 ");
    console.log("    |   |   ");
    console.log("A " + grid[0] + " | " + grid[1] + " | " + grid[2] + " ");
    console.log("    |   |   ");
    console.log(" -----------");
    console.log("    |   |   ");
    console.log("B " + grid[3] + " | " + grid[4] + " | " + grid[5] + " ");
    console.log("    |   |   ");
    console.log(" -----------");
    console.log("    |   |   ");
    console.log("C " + grid[6] + " | " + grid[7] + " | " + grid[8] + " ");
    console.log("    |   |   ");
  }

  function turnPrompt () {
    if (gameStatus == "new") {
      currentPlayer = players[Math.round(Math.random())];
      gameStatus = "playing";
    }
    currentMove = prompt(currentPlayer + "\'s turn. Enter desired square.");
    tryTurn(currentMove);
  }

  function gridMapper(coordinates) {
    switch(coordinates) {
      case "A1" : return 0;
      case "A2" : return 1;
      case "A3" : return 2;
      case "B1" : return 3;
      case "B2" : return 4;
      case "B3" : return 5;
      case "C1" : return 6;
      case "C2" : return 7;
      case "C3" : return 8;
      case null : 
        console.log("Game canceled. Type \"runInConsole();\" to play again.");
        return null;
      default : 
        currentMove = prompt("Please input valid coordinates.");
        gridMapper(currentMove);
        break;
    }
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
        console.log("X wins! Type \"runInConsole();\" to play again.");
        gameStatus = "won";
        return undefined;
      } else if (winningSums[i] == -3) {
        console.log("O wins! Type \"runInConsole();\" to play again.");
        gameStatus = "won";
        return undefined;
      } else gameStatus = "playing";
    }
  }

  function tryTurn (move) {
    if(gridMapper(move) == null) return null;
    currentMove = gridMapper(move);
    if (!gridImage[currentMove]) {
      takeTurn(currentMove);
    } else {
      currentMove = prompt("Choose a different square!");
      tryTurn(currentMove);
    }
  }

  function takeTurn(move) {
    if (currentPlayer == players[1]) {
      gridImage[move] = 1;
      grid[move] = players[1];
      turnCount++;
    } else if (currentPlayer == players[0]) {
      gridImage[move] = -1;
      grid[move] = players[0];
      turnCount++;
    }
    drawGrid();
    winScan();
    if (gameStatus == "playing" && turnCount < 9) {
      switchPlayer();
      turnPrompt();
    } else if (turnCount >= 9) {
      gameStatus = "draw";
      console.log("It's a draw! Type \"runInConsole();\" to play again.");
    }
  }
  drawGrid();
  turnPrompt();
}