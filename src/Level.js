var TILE_WIDTH  = settings.spriteSize[0];
var TILE_HEIGHT = settings.spriteSize[1];

var EMPTY   = { isEmpty: true,  isSolid: false, isTopSolid: false };
var SOLID   = { isEmpty: false, isSolid: true,  isTopSolid: true  };
var ONE_WAY = { isEmpty: false, isSolid: false, isTopSolid: true  };

function getTileFromMapItem(mapItem) {
	if (!mapItem) return EMPTY;
	switch (mapItem.sprite) {
		case 0: return SOLID;
		case 1: return ONE_WAY;
		default: return EMPTY;
	}
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Level(map) {
	var bobPosition = map.find(255)[0];

	this.map    = map;
	this.bob    = { x: bobPosition.x * TILE_WIDTH, y: bobPosition.y * TILE_HEIGHT };
	this.grid   = map.copy().items;
	this.width  = map.width;
	this.height = map.height;

	for (var x = 0; x < map.width;  x++) {
	for (var y = 0; y < map.height; y++) {
		this.grid[x][y] = getTileFromMapItem(map.items[x][y]);
	}}
}

Level.prototype.getTileAt = function (x, y) {
	x = ~~(x / TILE_WIDTH);
	y = ~~(y / TILE_HEIGHT);
	if (x < 0 || y < 0 || x >= this.width || y >= this.height) return EMPTY;
	return this.grid[x][y];
};

module.exports = Level;