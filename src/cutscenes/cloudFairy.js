var CutScene = require('../CutScene.js');

function cloudFairy() {

	//------------------------------------------------------------
	// create an empty cutscene
	var cutscene = new CutScene();

	//------------------------------------------------------------
	// add a fading transition animation
	cutscene.addFade();

	//------------------------------------------------------------
	// enqueue a function: this one clear screen and draw the boss room
	var bossRoom = getMap('bossCutScene');
	cutscene.enqueue(function () {
		camera(0, 0);   // camera needs to be reset before drawing scene
		paper(0).cls(); // set background color to 0 (black) and clear screen
		draw(bossRoom); // draw boss room
		// TODO draw the boss
	});

	//------------------------------------------------------------
	// add a waiting delay of 0.2 seconds
	cutscene.addDelay(0.2);

	//------------------------------------------------------------
	// add an animation.
	// an animation is a function that will be called every frame until its returns true
	var bobX = -7;
	var bobFrame = 0;
	cutscene.addAnimation(function () {
		bobX += 0.5;

		// to make the onion guy walk animation. TODO: create an animator to abstract this
		bobFrame += 0.2;
		if (bobFrame > 3) bobFrame = 0;
		var bobImage = assets.entities.bob['walk' + ~~bobFrame];
		var fairyImage = assets.entities.onion['walk0'];

		// draw the scene
		cls();
		draw(bossRoom);
		// TODO draw the boss
		draw(bobImage, bobX, 50);
		if (bobX < 10) {
			draw(fairyImage, 40, 30);
			return false;
		} // continue the animation
		
		draw(fairyImage, 40, 30, true);
		return true; // ends the animation
	});
	
	//------------------------------------------------------------
	// display a dialog
	cutscene.addDialog(assets.dialogs.cloudFairy);

	//------------------------------------------------------------
	// add a last fade before going back to the game
	cutscene.addFade();

	//------------------------------------------------------------
	// return the cutscene	
	return cutscene;
}

module.exports = cloudFairy;
