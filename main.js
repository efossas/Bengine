/* eslint-env node, es6 */
/* eslint no-console: "off" */

/* globals */
global.ENGINE_MAIN_DIR = __dirname;

'use strict';

const cluster = require('cluster');
const fs = require("fs");
const _ = require("./lib/util.js");

function crash(err) {
	_.log([err],"fatal");
	process.exit();
}

/*
	Section: Process Config File
	Open config file and check for required arguments.
	
	accounts (boolean)		- enable or disable the ability to create accounts
	cache (object)			- configuration info to connect/use a database cache
		type (string)			- [redis]
	domain (string)			- the root url where Bengine can be accessed
	filesizelimit (number)	- the max file size limit for uploaded files in bytes
	host (string)			- ???
	level (string)			- [.*dev.*] | [.*sta.*] | [.*pro.*] : run Bengine in development, staging, or production mode
	logging (number)		- 1: all logging turned on, 0: all logging turned off, -1: only log errors (logs/ directory) (can be boolean)
	persistence (object)	- configuration info to connect/use for persistent data
		type (string)			- [.*mysql.*] | [.*mongo.*] | [.*file.*]
	port (number)			- the port Bengine will run on
	process (number)		- how many processes to fork. 0 to use the number of available CPUs
	services (object)		- urls to docker containers for running back-end services
	session (object)		- configuration info for sessions
	sessionstore (object)	- configuration info to connect/use a database for persistent sessions
		type (string)			- [.*mysql.*] | [.*redis.*]
	
*/

var configFile;
switch(process.argv.length) {
	case 3:
		configFile = process.argv[2];
		break;
	case 2:
		configFile = "config/config.json";
		break;
	default:
		crash("Usage: node main [config file name]");
}

try {
	var config = JSON.parse(fs.readFileSync(configFile));
} catch(err) {
	crash("Error reading configuration file: " + configFile + "\n" + err);
}

config = require('./configcheck.js')(config);

if(config.hasOwnProperty("fatal")) {
	crash(config["fatal"]);
}

/* set any global config variables here */
global.ENGINE_LOGGING = config["logging"];

/*
	Section: Fork Server Processes
	Use Node cluster object to fork processes.
*/

if(cluster.isMaster) {
	/* fork workers */
	for (var i = 0; i < config["processes"]; i++) {
		var worker = cluster.fork();

		/* receive message from worker to master */
		worker.on('message',function(msg) {
			if(msg.code === 'fatal') {
				console.log('fatal message received');
				cluster.disconnect();
			}
		});
	}

	/* report dead forks */
	cluster.on('exit',function(worker,code,signal) {
		console.log(`Worker Died > process-pid: ${worker.process.pid}, code: ${code}, signal: ${signal}`);
		/* 0 is clean exit, like process.exit(0), so we can fork a replacement */
		if(code === 0) {
			cluster.fork();
		}
	});
} else {
	var server = require('./server.js')(config);
}
