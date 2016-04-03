var Level = require('./Level.js');
var Bob   = require('./Bob.js');

var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];
var GRAVITY     = 0.5;
var MAX_GRAVITY = 2;

var scrollX = 0;
var scrollY = 0;

paper(6);

var level = new Level(getMap("geo0"));
var background = getMap("bg0");


var bob = new Bob(level);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {
	cls();
	bob.sx *= 0.8;
	// bob.sy *= 0.8;
	if (btn.up)    bob.jump();
	// if (btn.down)  bob.sy = 1;
	if (btn.right) bob.goRight();
	if (btn.left)  bob.goLeft();
	bob.update();

	scrollX = clip(bob.x - 28, 0, level.width  * TILE_WIDTH  - 64);
	scrollY = clip(bob.y - 28, 0, level.height * TILE_HEIGHT - 64);

	camera(scrollX, scrollY);
	background.draw();
	bob.draw();
};
