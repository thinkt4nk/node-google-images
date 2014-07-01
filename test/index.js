var imageSearch = require ('../index')
var fs = require('fs')

var params = {
	imgsz: 'huge',
	rsz: 8 
}
var q = 'wallpaper'
var images = []
var outFile = '/Users/thinkt4nk/Desktop/images.json'
var results = imageSearch.search(q, { params: params, callback: function(err, results) {
	if (results != null) {
		results.forEach(function(result) {
			images.push(result.url)
		});
	}
	if (images.length < 100 && results != null)
		return imageSearch.search(q, { params: params, page: images.length, callback: arguments.callee })
	fs.writeFile(outFile, JSON.stringify(images), function() {
		console.log("\n\n...Done!\n")
	})
}})
