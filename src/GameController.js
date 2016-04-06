var level = require('./Level.js');
var bob   = require('./Bob.js');

var background = new Map();
var textWindow = new Texture(64, 19).pen(10);

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 2;


var nextLevel, nextDoor, inTransition, transitionCount, nextSide;
var displayedText = false;
var textParts = [];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function GameController() {
	this.level = level;
	this.bob   = bob;

	level.controller = this;
	bob.controller   = this;
}

module.exports = new GameController();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.loadLevel = function (id, doorId, side) {
	var def = assets.levels[id];
	level.init(def);
	if (doorId !== undefined) level.setBobPositionOnDoor(doorId);
	if (side) level.setBobPositionOnSide(bob, side);
	bob.setPosition(level.bobPos); // TODO
	background = getMap(def.background);
	paper(def.bgcolor);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.changeLevel = function (id, doorId) {
	inTransition = true;
	transitionCount = -30;
	nextLevel = id;
	nextDoor  = doorId;
	nextSide  = undefined;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.goToSideLevel = function (direction) {
	if (!level[direction]) return false;
	inTransition = true;
	transitionCount = -30;
	nextLevel = level[direction];
	nextDoor  = undefined;
	nextSide  = direction;
	return true;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype._displayText = function () {
	camera(0, 0);
	draw(textWindow, 0, 0); // TODO character by character animation
	if (btnp.A) {
		if (textParts.length === 0) {
			displayedText = false;
			return;
		}
		textWindow.println(textParts.shift());
	}
};

GameController.prototype.displayText = function (text) {
	textWindow.cls();
	displayedText = true;
	// split text
	textParts = text.split('\n');
	// TODO check each line length and further split if too long
	// print the first 3 lines
	for (var i = 0; i < 3; i++) {
		if (textParts.length === 0) break;
		textWindow.println(textParts.shift());
	}
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.ditherTransition = function () {
	camera(0, 0);
	draw(assets.ditherFondu, 0, transitionCount * TILE_HEIGHT);
	if (++transitionCount > 0) {
		this.loadLevel(nextLevel, nextDoor, nextSide);
		inTransition = false;
	}
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
GameController.prototype.update = function () {
	if (inTransition)  return this.ditherTransition();
	if (displayedText) return this._displayText();

	if (btnp.B) return this.displayText(assets.dialogs.bobIntro);

	bob.update();

	var scrollX = clip(bob.x - 28, 0, level.width  * TILE_WIDTH  - 64);
	var scrollY = clip(bob.y - 28, 0, level.height * TILE_HEIGHT - 64);

	cls();
	camera(scrollX, scrollY);
	background.draw();
	bob.draw();
};