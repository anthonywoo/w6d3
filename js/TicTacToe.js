(function() {

function Game() {

	this.board = [["", "", ""],
								["", "", ""],
								["", "", ""]];

	this.place_piece = function(letter, loc) {
		if (this.valid_loc(loc)){
			this.set(loc, letter);
			return true;
		}
		else 
			return false; 
	};

	this.valid_loc = function(loc){
		return loc[0] >= 0 && loc[0] <= 2 && loc[1] >= 0 && loc[1] <= 2 && this.at(loc) == ""; 
	};
	
	this.at = function(loc){
		return this.board[loc[0]][loc[1]];
	};

	this.set = function(loc, value) {
		this.board[loc[0]][loc[1]] = value;
	}

	this.winner = function() {
		for(i = 0; i <= 2; i ++) {
			if (this.at([i, 0]) === this.at([i, 1]) && this.at([i, 2]) === this.at([i, 1]) && this.at([i, 0]) != "")
				return this.at([i,0]);
			if (this.at([0, i]) === this.at([1, i]) && this.at([2, i]) === this.at([1, i]) && this.at([0, i]) != "")
				return this.at([0, i]);
		}
		// DIAGONALS.
		if (this.at([0,0]) === this.at([1, 1]) && this.at([1, 1]) === this.at([2, 2]) && this.at([0, 0]) != "")
				return this.at([0,0]);
		if (this.at([0,2]) === this.at([1, 1]) && this.at([1, 1]) === this.at([2, 0]) && this.at([0, 2]) != "")
				return this.at([0,2]);
		
		return null;
	}

	this.win = function() {
		return this.winner() !== null;
	};

	this.boardFull = function() {
		return !_.chain(this.board).flatten().any(function(item){
			return item === "";
		}).value();
	};

	this.gameOver = function() {
		return this.win() || this.boardFull();
	};
};


function TicTacToeWidget() {
	var turn;
	var promptEl = $("#prompt");

	var prompt = function(str) {
		promptEl.html(str);
	};

	this.newGame = function() {
		this.game = new Game();
		$(".square").html("");
		turn = "x";
		prompt("New game! " + turn + " goes first!");
	};

	this.newGame();

	this.registerSquareClicks = function() {
		var that = this;
		$(".square").click(function() {
			that.handleSquareClick(this);
		});
		return this;
	};

	this.registerNewGameButton = function() {
		var that = this;
		$("#new-game-button").click(function() {
			that.newGame();
		});
		return this;
	}

	this.handleSquareClick = function(clickedEl) {
		if (this.game.gameOver()) { return; }
		if (this.game.place_piece(turn, getRowColFromID($(clickedEl).attr("id")))) {
			$(clickedEl).html("<p class='symbol'>" + turn + "</p>");
			if (this.game.gameOver()) {
				this.handleGameOver();
			} else {
				toggleTurn();
				prompt("It's " + turn + "'s turn!");
			}
		} else {
			prompt("Invalid move!");
		}
	};

	var getRowColFromID = function(id) {
		var squareIndex = id;
		squareIndex = parseInt(squareIndex.substring(squareIndex.length - 1));
		var row = Math.floor(squareIndex / 3), col = squareIndex % 3;
		return [row, col];
	}

	var toggleTurn = function() {
		turn = (turn === "x" ? "o" : "x");
	};

	this.handleGameOver = function() {
		if (this.game.win()) {
			prompt(this.game.winner() + " has won!");
		} else {
			prompt("Draw!");
		}
	};
};

$(function(){
	new TicTacToeWidget().registerSquareClicks().registerNewGameButton();
});

})();