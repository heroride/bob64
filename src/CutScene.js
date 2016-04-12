var TextDisplay = require('./TextDisplay.js');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function CutScene() {
	this.onFinishCallback = null;
	this.displayingText = false;
}

module.exports = CutScene;

CutScene.prototype.textDisplay = new TextDisplay();

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
CutScene.prototype.start = function (data, cb) {
	this.onFinishCallback = cb;

	///------------------
	// TODO
	paper(0); // TODO save background color ?
	cls();
	var background = getMap('bossCutScene');
	draw(background);
	this.textDisplay.start(assets.dialogs.bobIntro);
	this.displayingText = true;

	///------------------

	return this;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
/** return true if it needs to continue, or false when it ends */
CutScene.prototype.update = function () {
	camera(0, 0);

	///------------------
	// TODO
	if (this.displayingText) {
		this.displayingText = this.textDisplay.update();
	} else {
		if (btnp.A) return this.finish();
	}

	///------------------

	return true;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
CutScene.prototype.finish = function () {
	this.onFinishCallback && this.onFinishCallback();
	this.onFinishCallback = null;
	return false;
};
