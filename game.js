window.onload = function () {

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.translate(0.5, 0.5); 			// The translate() method remaps the (0,0) position on the canvas.

//var ctx = canvas.getContext("2d");
//canvas = $("#myCanvas");
var numofPlayers = 1; //process.argv[2];
var round = 0;
var namesofPlayers = ["dag1"] //, "dag2", "dag3", "dag4"];
var players = new Array();
var loc;
var rowSizeX = 32;
var colSizeY = 48;
var gridSizeX = 640;
var gridSizeY = 960;


GameGrid = function(){
	this.setGrid(rowSizeX, colSizeY);
	this.drawGrid(gridSizeX, gridSizeY);
	this.blockSize = 20;
};

GameGrid.prototype.drawGrid = function(width, height){
	for (var x = 0; x < height /*960*/; x += 20) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height /*960*/);
	}
	for (var y = 0; y < height /*960*/; y += 20) {
		ctx.moveTo(0, y);
		ctx.lineTo(width /*640*/, y);
	}

//ctx.moveTo(0,0);
//ctx.lineTo(381,100);
ctx.strokeStyle = "#ddd";
ctx.stroke();
};

GameGrid.prototype.drawGhostStones = function(visible){

	var alpha;
	if (visible) alpha = 0.2;
	else alpha = 0;

	ctx.beginPath();
	ctx.arc(loc.x,loc.y,10,0,2*Math.PI);
	ctx.fillStyle = "black";
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.globalAlpha=alpha;
	ctx.stroke();	
};

GameGrid.prototype.drawStone = function(loc, color){

	ctx.beginPath();
	ctx.arc(loc.x,loc.y,10,0,2*Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.stroke();
	//ctx.globalAlpha=4;
};

GameGrid.prototype.removeStone = function(loc){
	this.Grid[loc.x/this.blockSize][loc.y/this.blockSize] = undefined;
};

GameGrid.prototype.addStone = function(loc, player) {
	this.Grid[loc.x/this.blockSize][loc.y/this.blockSize] = new Stone(loc, player.playerID);
	//console.log(gameGrid.Grid);
};

GameGrid.prototype.setGrid = function(rows, columns){
	var i, j;
	this.Grid = new Array(rows);
	for (i = 0; i < rows; i++) {
		this.Grid[i] = new Array(columns);
	}
	console.log(this.Grid);
};

GameGrid.prototype.placeStone = function(loc, player){
	if (loc.x/this.blockSize !== 0 && loc.y/this.blockSize !== 0 && loc.x/this.blockSize !== rowSizeX && loc.y/this.blockSize !== colSizeY) {
		if (typeof this.Grid[loc.x/this.blockSize][loc.y/this.blockSize] !== 'object'){
			this.addStone(loc, player);
			this.drawStone(loc, player.playerID);
			this.checkPoints(loc, player);
			round++;										// increase round.
		}
	else console.log("There is already a stone there.")
	}
	else console.log("Out of border.")

};

GameGrid.prototype.checkPoints = function(location, player){

	var stone = this.Grid[location.x/this.blockSize][location.y/this.blockSize];
	player.points = 0;
	var locY = location.y/this.blockSize;
	var locX = location.x/this.blockSize;
	var index = 0;

	var dirList = {
		n: { x: [locX,locX,locX,locX,locX], y: [locY-1,locY-2,locY-3,locY-4,locY-5] },
		s: { x: [locX,locX,locX,locX,locX], y: [locY+1,locY+2,locY+3,locY+4,locY+5] },
		e: { x: [locX+1,locX+2,locX+3,locX+4,locX+5], y: [locY,locY,locY,locY,locY] },
		w: { x: [locX-1,locX-2,locX-3,locX-4,locX-5], y: [locY,locY,locY,locY,locY] },
		ne: { x: [locX+1,locX+2,locX+3,locX+4,locX+5], y: [locY-1,locY-2,locY-3,locY-4,locY-5] },
		sw: { x: [locX-1,locX-2,locX-3,locX-4,locX-5], y: [locY+1,locY+2,locY+3,locY+4,locY+5] },
		nw: { x: [locX-1,locX-2,locX-3,locX-4,locX-5], y: [locY-1,locY-2,locY-3,locY-4,locY-5] },
		se: { x: [locX+1,locX+2,locX+3,locX+4,locX+5], y: [locY+1,locY+2,locY+3,locY+4,locY+5] }
	 };

	this.checkBlocks = function(dir, numBlocks, points){
		for (index = 0; index <= numBlocks; index++){
			if (dir.x[index] === 0 || dir.x[index] === rowSizeX || dir.y[index] === 0 || dir.y[index] === colSizeY) return points;
			if (typeof this.Grid[dir.x[index]][dir.y[index]] === 'object' && this.Grid[dir.x[index]][dir.y[index]].color === player.playerID) points++;
			else return points;
		}
	};

	player.points = this.checkBlocks(dirList.n, 5, 0); 
	if (player.points >= 4) console.log(player.playerID + " Got 5 in a row!");
	else if (this.checkBlocks(dirList.s, 5, player.points) >=4) console.log(player.playerID + " Got 5 in a row!");
	else player.points = 0;

	player.points = this.checkBlocks(dirList.e, 5, 0); 
	if (player.points >= 4) console.log(player.playerID + " Got 5 in a row!");
	else if (this.checkBlocks(dirList.w, 5, player.points) >=4) console.log(player.playerID + " Got 5 in a row!");
	else player.points = 0;

	player.points = this.checkBlocks(dirList.ne, 5, 0); 
	if (player.points >= 4) console.log(player.playerID + " Got 5 in a row!");
	else if (this.checkBlocks(dirList.sw, 5, player.points) >=4) console.log(player.playerID + " Got 5 in a row!");
	else player.points = 0;

	player.points = this.checkBlocks(dirList.nw, 5, 0); 
	if (player.points >= 4) console.log(player.playerID + " Got 5 in a row!");
	else if (this.checkBlocks(dirList.se, 5, player.points) >=4) console.log(player.playerID + " Got 5 in a row!");
	else player.points = 0;

}; 

Player = function(name, playerID, score) {
	var colors = ["orange", "black", "red", "blue", "green", "yellow"];
	this.playerID = colors[playerID];
	this.name = name;
	this.score = score;
};

Stone = function(loc, color) {
	this.loc = loc
	this.color = color;
};

Location = function(x ,y) {
	this.x = x;
	this.y = y;
};


function main() {

	for (var i = 0; i < numofPlayers; i++) {
		players[i] = new Player(namesofPlayers[i], i, 0); // name, player, score;
	}

	for (i=0; i<players.length; i++) {
		console.log(players[i]);
	}

};


canvas.onmousedown = function(event) {					// Event, on mouse click perform function.
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;

	var _x = Math.round(x / 20) * 20; 				// rounds off to the closest 20.
	var _y = Math.round(y / 20) * 20;

	if (round === numofPlayers) round = 0;			// check round, if round > number of players, set to zero.

	loc = new Location(_x, _y);
	console.log(loc.x/20, loc.y/20);

	//console.log(typeof gameGrid.Grid[loc.x/10][loc.y/10]);
	gameGrid.placeStone(loc,players[round]);
};	




var	gameGrid = new GameGrid();
main();

};



/*

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
			x: Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*canvas.width),
		y: Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height)
	};
};


canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    console.log(message);
  }, false);

*/

/*
canvas.onmousemove = function(event){
	var x = event.pageX - canvas.offsetLeft;
	var y = event.pageY - canvas.offsetTop;

	x = x / 20;
	y = y / 20;
	//x = Math.round(x / 20) * 20; 				// rounds off to the closest 20.
	//y = Math.round(y / 20) * 20;

	console.log(x, y);


}; */