/* eslint-env node, es6 */
/* eslint no-console: "off" */

const fs = require('fs');
const https = require("https");

const pathDev = '/../public/dev';
const pathPro = '/../public/bengine';

console.log("\nWelcome. This will optimize Bengine by minifying and downloading block dependencies.\n");
console.log("Usage: node optimize.js [block, ...]\n");
console.log("To optimize everything, don't enter any arguments.");
console.log("To optimize only Bengine, just enter 'bengine' as the only argument.");
console.log("To optimize specific blocks, enter the block names as arguments.\n");

var getRequestSaveFile = (url,path) => {
	console.log("getting... " + url);
	https.get(url, (response) => {
		response.setEncoding("utf8");
		let body = "";
		response.on("data", (data) => {
			body += data;
		});
	  	response.on("end", () => {
		  	let fpath = url.split("/").pop().split("?")[0];
		  	console.log("writing... " + fpath);
	    	fs.writeFile(path + "/" + fpath, body, function(error) {
			    if(error) {
			        console.log(error);
			    }
			});
		});
	});
};

var readBlocks = (resolve,reject) => {
	var blocks = {};
	var optimize = [];
	fs.readdir(__dirname + "/../blocks", (err, files) => {
		files.forEach((file) => {
			blocks[file] = __dirname + "/../blocks/" + file + "/" + file + ".js";
			if(process.argv.length < 3) {
				optimize.push(file);
			}
		});
		
		if(optimize.length <= 0) {
			for(let i = 2; i < process.argv.length; i++) {
				optimize.push(process.argv[i]);
			}
		}
		
		resolve({"blocks":blocks,"optimize":optimize});
	});
};

var evalBlocks = (result) => {
	var blocks = result["blocks"];
	var optimize = result["optimize"];

	var Bengine = {"extensibles":{}};
	var Blocks = Object.keys(blocks);
	optimize.forEach((block) => {
		if(Blocks.indexOf(block) > -1) {
			console.log("reading... " + block);
			var data = fs.readFileSync(blocks[block], {encoding: 'utf-8'});
			eval(data);
			
			// minify block while we're at it
			console.log("minifying... " + block);
			var result = UglifyJS.minify(data);
			if(result.error) {
				console.log(result.error);
			} else {
				console.log("writing... " + block + ".min.js");
				fs.writeFile(__dirname + pathPro + "/blocks/" + block + ".min.js", result.code, function(error) {
				    if(error) {
				        console.log(error);
				    }
				});
			}
		}
	});
	
	return Bengine;
};

var getBlockDependencies = (Bengine) => {
	let depDir = __dirname + pathPro + "/libs";
	console.log("checking for directory: " + depDir);
	if (!fs.existsSync(depDir)){
	    fs.mkdirSync(depDir);
	}
	
	let minDir = __dirname + pathPro + "/blocks";
	console.log("checking for directory: " + minDir);
	if (!fs.existsSync(minDir)){
	    fs.mkdirSync(minDir);
	}
	
	let retrievedScripts = []; // used to stop repetitive dependency requests
	for(var prop in Bengine.extensibles)(function(prop) {
		if(Bengine.extensibles.hasOwnProperty(prop)) {
			var scriptArray = Bengine.extensibles[prop].fetchDependencies();
			if(scriptArray !== null) {
				scriptArray.forEach((script) => {
					if(script.source && retrievedScripts.indexOf(script.source) === -1) {
						retrievedScripts.push(script.source);
						getRequestSaveFile(script.source,depDir);
					} 
				})
			}
		}
	})(prop);
};

/* download block dependencies */
new Promise(readBlocks).then(evalBlocks).then((Bengine) => {
	getBlockDependencies(Bengine);
});

/* minify bengine js */
const UglifyJS = require("uglify-es");

fs.readFile(__dirname + pathDev + "/js/bengine.js", {encoding: 'utf-8'}, (err, data) => {
	console.log("minifying... bengine.js");
	var result = UglifyJS.minify(data);
	if(result.error) {
		console.log(result.error);
	} else {
		console.log("writing... bengine.min.js");
		fs.writeFile(__dirname + pathPro + "/js/bengine.min.js", result.code, function(error) {
		    if(error) {
		        console.log(error);
		    }
		});
	}
});

/* minify bengine default display */
fs.readFile(__dirname + pathDev + "/js/bengine-default-display.js", {encoding: 'utf-8'}, (err, data) => {
	console.log("minifying... bengine-default-display.js");
	var result = UglifyJS.minify(data);
	if(result.error) {
		console.log(result.error);
	} else {
		console.log("writing... bengine.min.js");
		fs.writeFile(__dirname + pathPro + "/js/bengine-default-display.min.js", result.code, function(error) {
		    if(error) {
		        console.log(error);
		    }
		});
	}
});

/* minify bengine css */
var CleanCSS = require('clean-css');
fs.readFile(__dirname + pathDev + "/css/bengine.css", {encoding: 'utf-8'}, (err, data) => {
	console.log("minifying... bengine.css");
	var options = {
		returnPromise:true
	};
	new CleanCSS(options)
	.minify(data)
	.then(function (output) { 
		console.log("writing... bengine.min.css");
		fs.writeFile(__dirname + pathPro + "/css/bengine.min.css", output.styles, function(error) {
		    if(error) {
		        console.log(error);
		    }
		});
	})
	.catch(function (error) { 
		console.log(error);
	});
});






