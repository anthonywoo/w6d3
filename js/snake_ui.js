function SnakeUI() {
	var STEP_TIME_MILLIS = 250;
	var timeoutID;

	this.start = function() {
		$('#board').html(this.boardString());
		timeoutID = window.setTimeout(run_loop, STEP_TIME_MILLIS); 
	};

	var snakeUI = this;
	var run_loop = function() {
		snakeUI.game.step();
		if (snakeUI.game.gameOver) {
			var score = snakeUI.game.snake.body.length - 3;
			$('#board').html("Game over!\nYou ate " + score + 
				" apple(s)!\nPress [Space] or [Enter] to restart.");
		} else {
			$('#board').html(snakeUI.boardString());
			STEP_TIME_MILLIS = Math.max(100, STEP_TIME_MILLIS -= 1);
			timeoutID = window.setTimeout(run_loop, STEP_TIME_MILLIS); 
		}
	};

	var changeDirection = function(newDirection, that) {
		window.clearTimeout(timeoutID);
		that.game.snake.changeDirection(newDirection); 
		run_loop();
	};

	this.registerKeydown = function() {
		var that = this;
		$('html').keydown(function (event) {
			switch(event.keyCode) {
				case 38: // up
					changeDirection(Direction.NORTH, that); break;
				case 40: // down
					changeDirection(Direction.SOUTH, that); break;
				case 37: // left
					changeDirection(Direction.WEST, that); break;
				case 39: // right
					changeDirection(Direction.EAST, that); break;
				case 32:
				case 13:
					that.newGame().start();
			}
		});
		return this;
	};

	this.newGame = function() {
		window.clearTimeout(timeoutID);
		STEP_TIME_MILLIS = 250;
		this.game = new Game();
		return this;
	};

	this.boardString = function() {
		var str = "";
		var snake = this.game.snake;
		this.game.board.rows.forEach(function(row, row_index) {
			row.forEach(function(square, col_index) {
				switch(square) {
					case SquareType.EMPTY:
						str += "   "; break;
					case SquareType.WALL:
						str += " + "; break;
					case SquareType.APPLE:
						str += " o "; break;
					case SquareType.SNAKE:
						if (snake.body[0][0] === row_index && snake.body[0][1] === col_index) 
							str += " S "; 
						else
							str += " s "; 
						break;
				}
			});
			str += "\n";
		});
		return str;
	}
};


$(function(){
	// new SnakeUI().registerKeydown();
	new SnakeUI().newGame().registerKeydown().start();
});