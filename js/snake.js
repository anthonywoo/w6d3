var Direction = {
	SOUTH: [1, 0],
	EAST: [0, 1],
	WEST: [0, -1], 
	NORTH: [-1, 0]
};

function Snake(initialHead, initialLength) {
	var direction = Direction.NORTH;

	(function(snake) {
		var body = [];
		for(var i = 0; i < initialLength; i++) {
			body.push([initialHead[0] + i, initialHead[1]]);
		}
		snake.body = body;
	})(this);

	this.move = function(grow) {
		var head = this.body[0];
		var newHead = this.newHeadLocation();
		this.body.unshift(newHead);
		if (!grow)
			this.body.pop();
	};

	this.bodyOverlaps = function(row, col) {
		for (var i = 0; i < this.body.length; i++) {
			if (this.body[i][0] === row && this.body[i][1] === col)
				return true;
		}
		return false;
	};

	this.newHeadLocation = function() {
		var head = this.body[0];
		return [head[0] + direction[0], head[1] + direction[1]];
	};

	this.selfCollision = function() {
		var head = this.body[0];
		for(var i = 1; i < this.body.length; i++) {
			if (this.body[i][0] === head[0] && this.body[i][1] === head[1])
				return true;
		}
		return false;
	};

	this.changeDirection = function(newDirection) {
		if (direction[0] + newDirection[0] !== 0 || 
			direction[1] + newDirection[1] !== 0) {
			direction = newDirection;
		}
	};
}

var SquareType = {
	EMPTY: 0,
	WALL: 1,
	APPLE: 2,
	SNAKE: 3
}

function Board() {
	var ROWS = 15, COLS = 20;

	(function(board) {
		var rows = [];
		for(var i = 0; i < ROWS; i++) {
			var row = [];
			for (var j = 0; j < COLS; j++) {
				if (i === 0 || i === ROWS - 1) {
					row.push(SquareType.WALL);
				} else {
					if (j === 0 || j === COLS - 1) {
						row.push(SquareType.WALL);
					} else {
						row.push(SquareType.EMPTY);
					}
				}
			}
			rows.push(row);
		}
		board.rows = rows;
	})(this);

	this.console_print = function() {
		console.log(this.rows);
	};

	this.update_rows = function(snake) {
		var rows = this.rows;
		this.rows.forEach(function(row, row_index) {
			row.forEach(function(square, col_index) {
				if (snake.bodyOverlaps(row_index, col_index))
					rows[row_index][col_index] = SquareType.SNAKE;
				else if (rows[row_index][col_index] === SquareType.SNAKE)
					rows[row_index][col_index] = SquareType.EMPTY;
			});
		});
	};

	this.getAt = function(location) {
		return this.rows[location[0]][location[1]];
	};

	this.placeRandomApple = function() {
		while (true) {
			var randomRow = Math.floor(Math.random() * ROWS);
			var randomCol =  Math.floor(Math.random() * COLS);
			if (this.rows[randomRow][randomCol] == SquareType.EMPTY) {
				this.rows[randomRow][randomCol] = SquareType.APPLE;
				break;
			}
		}
	};
}

function Game() {
	this.board = new Board();
	this.snake = new Snake([7,6], 3);
	this.board.update_rows(this.snake);
	this.board.placeRandomApple();
	this.gameOver = false;

	this.step = function() {
		if (this.gameOver) { return; }
		var snakeHead = this.snake.newHeadLocation();
		// board checks
		var onBoard = this.board.getAt(snakeHead);

		if (onBoard === SquareType.WALL) {
			this.gameOver = true;
		} else {
			var eatenApple = (onBoard === SquareType.APPLE);
			this.snake.move(eatenApple);
			this.board.update_rows(this.snake);
			if (eatenApple)
				this.board.placeRandomApple();
			if (this.snake.selfCollision())
				this.gameOver = true;
		}
	};
}