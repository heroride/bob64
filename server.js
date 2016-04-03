var pixelbox = require('../pixelbox/index.js');
var fs       = require('fs');
var path     = require('path');

pixelbox.on('tools/saveMaps', function (str) {
	fs.writeFileSync(path.join(process.cwd(), '../Assets/Resources/Pixelbox/maps.json'), str);
});
