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
    if (gameStatus != "won") tryTurn(event);
  }, false);

  function turnPrompt () {
    if (gameStatus == "new") {
      compTurn = Boolean(Math.round(Math.random()));
      currentPlayer = players[Math.round(Math.random())];
      gameStatus = "playing";
    }
    messenger.textContent = currentPlayer + "\'s turn. Click on the desired square.";
    if (currentPlayer == players[0] && gameStatus != "won") takeTurn();
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
    var selection
    var openSq = everyTime(gridImage, 0);
    // Inital square ranks
    var initialSqRanks = [3, 2, 3, 2, 4, 2, 3, 2, 3];
    // Make initial move.
    if (openSq.length == 9) {
      return firstMoves();
    }
    // List indices of all winningSums associated with a given square.
    console.log(winningSums);
    var winSumIndex = [
      [0, 3, 6],
      [0, 4],
      [0, 5, 7],
      [1, 3],
      [1, 4, 6, 7],
      [1, 5],
      [2, 3, 7],
      [2, 4],
      [2, 5, 6]
    ]
    // List all winningSums associated with each square.
    var winSums = function () {
      var outerLength = winSumIndex.length;
      var innerLength;
      var sums = [];
      for (var i = 0; i < outerLength; i++) {
        innerLength = winSumIndex[i].length;
        sums[i] = [];
        for (var j = 0; j < innerLength; j++) {
          sums[i].push(winningSums[winSumIndex[i][j]]);
        }
      }
      return sums;
    }();
    console.log(winSums);
    // Calculate new square ranks based on winSums.
    var newSqRanks = function () {
      var ranks = [];
      winSums.forEach(function (element) {
        ranks.push(arraySum(element));
      });
      return ranks;
    }();
    // Test for win.
    function selfWin() {
      // use winSums to see if there are any -2s associated with a given square.
      var wsLength = winSums.length
      var winners = [];
      for (i = 0; i < wsLength; i++) {
        if (arrayMin(winSums[i]) == -2 && gridImage[i] == 0) winners.push(i)
      }
      var randomIndex = Math.floor(Math.random() * (winners.length));
      if (winners.length) return winners[randomIndex];
        else return null;
    }
    // Test for opponent win.
    function opponentWin() {
      var wsLength = winSums.length
      var losers = [];
      for (i = 0; i < wsLength; i++) {
        if (arrayMax(winSums[i]) == 2 && gridImage[i] == 0) losers.push(i)
      }
      var randomIndex = Math.floor(Math.random() * (losers.length));
      if (losers.length) return losers[randomIndex];
        else return null;
    }
    // Test for forks (note this won't work if we don't first 
    // filter for winning moves). We'd have to add a second condition
    // to make sure that we only counted forks and not winners.
    function forkTest () {
      for(var i = 0; i < newSqRanks.length; i++) {
        if (newSqRanks[i] == -2 && gridImage[i] == 0) return i;
      }
      return null;
    }
    // Test for pins.
    function pinTest () {
      for(var i = 0; i < newSqRanks.length; i++) {
        if (newSqRanks[i] == -1 && gridImage[i] == 0) return i;
      }
      return null;
    }
    // Make initial move.
    function firstMoves () {
      var maxRank = 0;
      var testValue;
      var oLength = openSq.length;
      var moveOptions = [];
      for (var i = 0; i < oLength; i++) {
        testValue = initialSqRanks[openSq[i]];
        if (testValue >= maxRank && gridImage[openSq[i]] == 0) 
          maxRank = testValue;
          moveOptions.push(openSq[i]);
      }
      var randomIndex = Math.floor(Math.random() * (moveOptions.length))
      return moveOptions[randomIndex];
    }
    // 

    // STRATEGIC RULES
    // Test for winning move.
    if ((selection = selfWin()) != null) return selection;
      // Test for opponent win.
      else if ((selection = opponentWin()) != null) return selection;
      // Test for a fork.
      else if ((selection = forkTest()) != null) return selection;
      // Test for a pin.
      else if ((selection = pinTest()) != null) return selection;
      // Make initial move (if after Human)
      else if ((selection = firstMoves()) != null) return selection;
      // 

    // if (!gridImage[selection]) return selection;
    // else return compStrat();
  }

  function tryTurn(event) {
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

  /*************/
  /* UTILITIES */
  /*************/

  // Return all occurrences of an element in an array.
  function everyTime (array, element) {
    var hits = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i] == element) hits.push(i);
    }
    return hits;
  }

  // Get max value of an array.
  function arrayMax (numArray) {
    return Math.max.apply(null, numArray);
  }

  // Get min value of an array.
  function arrayMin (numArray) {
    return Math.min.apply(null, numArray);
  }

  // Sum over an array.
  function arraySum (numArray) {
    return numArray.reduce(function(preV, curV, curI, arr) {
      return preV + curV;
    })
  }


  turnPrompt();
}