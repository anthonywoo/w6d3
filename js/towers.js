(function() {

 // Creating a Single Tower 

function Tower(disks) {
 	this.disks = disks
 };

 	Tower.prototype.peek = function(){
 		return this.disks[this.disks.length-1];
 	};

// Game with multiple towers 
function Game() {

	this.towers = [ new Tower([4,3,2,1]), new Tower([]), new Tower([]) ];
				  				
	this.move = function(from, to) {
		if (this.valid_move(from, to)) {
			this.towers[to].disks.push(this.towers[from].disks.pop());
			return true; 
		} else {
			return false;
		}
	};

	this.valid_move = function(from, to) {
		return (this.towers[from].disks.length > 0 && 
			(this.towers[to].disks.length === 0 || this.towers[to].peek() > this.towers[from].peek()));
	};

	this.win =  function(){
		return this.towers[0].disks.length == 0 && (this.towers[1].disks.length == 0 || this.towers[2].disks.length == 0)
	};

	this.print = function(){
		console.log(this.towers[0])
		console.log(this.towers[1])
		console.log(this.towers[2])
	};
};

var game, from;

var initNewGame = function(){
	game = new Game();
	render();
	prompt("Please choose a tower to move from!");
};

var prompt = function(string) {
	$("#prompt").html(string);
}

var render = function(){
	var towers = game.towers
	for (var i = 0; i < towers.length; i++) {
		var html = "";
		towers[i].disks.forEach(function(disk){
			html = "<div class='disk span" + (disk * 2) + " offset" + (6 - disk) + "'></div>" + html;
		});
		for (var j = 0; j < 6 - towers[i].disks.length; j++) {
			html = "<div class='emptydisk span12'></div>" + html;
		}
		$("#tower"+i).html(html);
	}
};

var doMove = function(from, to){
	if(game.move(from,to)) {
		render();
		if (game.win()) {
			prompt("You win!");
		} else {
			prompt("Please choose a tower to move from!");
		}
	} else {
		prompt("Invalid move! Please choose another tower to move from!");
	}
}

$(document).ready(function(){
	$("#new_game_btn").click(function(){
		initNewGame();
	});

	$(".tower").click(function(){
		if (game.win()) { return; }
		var id = $(this).attr("id");
		id = parseInt(id.substring(id.length - 1));
		if (from === undefined) {
			from = id;
			prompt("Please choose a tower to move to!");
		} else {
			doMove(from, id);
			from = undefined;
		}
	})

	initNewGame();
});

})();
