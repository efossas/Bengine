/* eslint-env node, es6 */
/* eslint no-console: "off" */

'use strict';

var request = require('request');

/*
	Section: Check Config File
	Check config file for required arguments.
*/

module.exports = function(config) {

	/* any bad config will be added here and printed later */
	var report = [];
	
	/* check "accounts" */
	if(!config.hasOwnProperty("accounts") || typeof config["accounts"] !== "boolean") {
		report.push("Missing/Invalid -> 'accounts' : Must be boolean.");
		config["accounts"] = false;
	}
	
	/* check "cache" */
	if(!config.hasOwnProperty("cache") || typeof config["cache"] !== "object" || typeof config["cache"] === null) {
		report.push("Missing/Invalid -> 'cache' : Must be object.");
		config["cache"] = {
			"database":"",
			"host":"",
			"password":"",
			"type":"",
			"user":""
		}
	} else {
		if(typeof config["cache"]["database"] !== "string") {
			report.push("Missing/Invalid -> 'cache.database' : Must be string.");
			config["cache"]["database"] = "";
		}
		if(typeof config["cache"]["host"] !== "string") {
			report.push("Missing/Invalid -> 'cache.host' : Must be string.");
			config["cache"]["host"] = "";
		}
		if(typeof config["cache"]["password"] !== "string") {
			report.push("Missing/Invalid -> 'cache.password' : Must be string.");
			config["cache"]["password"] = "";
		}
		if(typeof config["cache"]["type"] !== "string") {
			report.push("Missing/Invalid -> 'cache.type' : Must be string.");
			config["cache"]["type"] = "";
		}
		if(typeof config["cache"]["user"] !== "string") {
			report.push("Missing/Invalid -> 'cache.user' : Must be string.");
			config["cache"]["user"] = "";
		}
	}
	
	/* check "filesizelimit" */
	if(!config.hasOwnProperty("filesizelimit") || typeof config["filesizelimit"] !== "number") {
		report.push("Missing/Invalid -> 'filesizelimit' : Must be number.");
		config["filesizelimit"] = 100 * 1024 * 1024;
	}
	
	/* check "level" */
	var invalidlevel = true;
	if(typeof config["level"] !== "string") {
		return {"fatal":"Config error. 'level' must be defined, must be string: [dev|stage|prod]"};
	} else if(config["level"].indexOf("dev") > -1) {
		invalidlevel = false;
		process.env.NODE_ENV = "development";
	} else if(config["level"].indexOf("sta") > -1) {
		invalidlevel = false;
		process.env.NODE_ENV = "development";
	} else if(config["level"].indexOf("pro") > -1) {
		invalidlevel = false;
		process.env.NODE_ENV = "production";
	}
	
	if(invalidlevel) {
		return {"fatal":"Incorrect value for 'level'. Must be: development | stage | production"};
	}
	
	/* check "logging" */
	if(typeof config["logging"] !== "boolean" && typeof config["logging"] !== "number") {
		report.push("Missing/Invalid -> 'logging' : Must be boolean, 0, -1, or 1.");
		config["logging"] = false;
	} else {
		config["logging"] = Number(config["logging"]);
		if (config["logging"] > 1) {
			config["logging"] = 1;
		} else if (config["logging"] < -1) {
			config["logging"] = -1;
		}
	}
	
	/* check "persistence" */
	if(!config.hasOwnProperty("persistence") || typeof config["persistence"] !== "object" || typeof config["persistence"] === null) {
		report.push("Missing/Invalid -> 'persistence' : Must be object.");
		config["persistence"] = {
			"database":"",
			"host":"",
			"password":"",
			"type":"",
			"user":""
		}
	} else {
		if(typeof config["persistence"]["database"] !== "string") {
			report.push("Missing/Invalid -> 'persistence.database' : Must be string.");
			config["persistence"]["database"] = "";
		}
		if(typeof config["persistence"]["host"] !== "string") {
			report.push("Missing/Invalid -> 'persistence.host' : Must be string.");
			config["persistence"]["host"] = "";
		}
		if(typeof config["persistence"]["password"] !== "string") {
			report.push("Missing/Invalid -> 'persistence.password' : Must be string.");
			config["persistence"]["password"] = "";
		}
		if(typeof config["persistence"]["type"] !== "string") {
			report.push("Missing/Invalid -> 'persistence.type' : Must be string.");
			config["persistence"]["type"] = "";
		}
		if(typeof config["persistence"]["user"] !== "string") {
			report.push("Missing/Invalid -> 'persistence.user' : Must be string.");
			config["persistence"]["user"] = "";
		}
	}
	
	/* check "port" */
	if(!config.hasOwnProperty("port")) {
		report.push("Missing/Invalid -> 'port' : Must be object. Defaults to HTTP and port 2020");
		config["port"] = {
			"http":2020
		};
	} else {
		if(typeof config["port"]["http"] !== "number" && typeof config["port"]["https"] !== "number") {
			return {"fatal":"Config error. Either ['port']['http'] or ['port']['https'] must be defined and must be a number"};
		}
		var httpset = false;
		var httpsset = false;
		if(typeof config["port"]["http"] === "number") {
			if(config["port"]["http"] > 65535 || config["port"]["http"] < 1024) {
				return {"fatal":"Invalid http port number. Port must be between 1024 & 65535"};
			}
			httpset = true;
		}
		if(typeof config["port"]["https"] === "number") {
			if(config["port"]["https"] > 65535 || config["port"]["https"] < 1024) {
				return {"fatal":"Invalid https port number. Port must be between 1024 & 65535"};
			}
			httpsset = true;
		}
		if(httpset && httpsset) {
			if(config["port"]["http"] === config["port"]["https"]) {
				return {"fatal":"Invalid ports. http and https ports cannot be the same"};
			}
		}
		if (!httpset && config["port"]["http"] !== null) {
			config['port']['http'] = null;
		}
		if (!httpsset && config["port"]["https"] !== null) {
			config['port']['https'] = null;
		}
	}
	
	/* check "processes" */
	try {
		var cpus = require('os').cpus().length;
	} catch(err) {
		var cpus = 2;
	}
	const numCPUs = cpus;
	
	if(!config.hasOwnProperty("processes")) {
		report.push("Missing/Invalid -> 'processes' : Must be number, defaults to available CPUs.");
		config["processes"] = numCPUs;
	} else if(config["processes"] === null) {
		config["processes"] = numCPUs;
	} else if (typeof config["processes"] !== "number") {
		return {"fatal":"Config error. 'processes' must be number or null (defaults to available CPUs)"};
	} else if(config["processes"] < 0 || config["processes"] > numCPUs) {
		return {"fatal":"Invalid processes number. This server can only run up to " + numCPUs + " processes."};
	}
	
	if(config["processes"] === 0) {
		config["processes"] = numCPUs;
	}
	
	/* check "services" */
	if(!config.hasOwnProperty("services")) {
		report.push("Missing/Invalid -> 'services' : Must be object or null.");
		config["services"] = null;
	} else if(config["services"] !== null) {
		for(let service in config["services"]) {
			request.get(config["services"][service])
			.on('response',function(response) {
				if(response.statusCode !== 200) {
					return {"fatal":"Could not connect to service: " + service + " : status code = " + response.statusCode};
				}
			}).on('error', function(err) {
				return {"fatal":"Could not connect to service: " + service + " : error = " + err};
			});
		}
	}
	
	/* check "session" */
	if(!config.hasOwnProperty("session") || typeof config["session"] !== "object" || typeof config["session"] === null) {
		report.push("Missing/Invalid -> 'session' : Must be object or null.");
		config["session"] = null;
	} else {
		if(typeof config["session"]["key"] !== "string") {
			report.push("Missing/Invalid -> 'session.key' : Must be string.");
			config["session"]["key"] = "benginekey";
		}
		if(typeof config["session"]["secret"] !== "string") {
			report.push("Missing/Invalid -> 'session.secret' : Must be string.");
			config["session"]["secret"] = "benginesecret";
		}
		if(typeof config["session"]["resave"] !== "boolean") {
			report.push("Missing/Invalid -> 'session.resave' : Must be boolean.");
			config["session"]["resave"] = false;
		}
		if(typeof config["session"]["saveUninitialized"] !== "boolean") {
			report.push("Missing/Invalid -> 'session.saveUninitialized' : Must be boolean.");
			config["session"]["saveUninitialized"] = false;
		}
	}
	
	/* check "sessionstore" */
	if(!config.hasOwnProperty("sessionstore") || typeof config["sessionstore"] !== "object" || typeof config["sessionstore"] === null) {
		report.push("Missing/Invalid -> 'sessionstore' : Must be object.");
		config["sessionstore"] = {
			"database":"",
			"host":"",
			"password":"",
			"type":"",
			"user":""
		}
	} else {
		if(typeof config["sessionstore"]["type"] !== "string") {
			report.push("Missing/Invalid -> 'sessionstore.type' : Must be string.");
			config["sessionstore"]["type"] = "";
		}
		
		// mysql specific sessionstore args
		if(config["sessionstore"]["type"] === "mysql") {
			if(typeof config["sessionstore"]["database"] !== "string") {
				report.push("Missing/Invalid -> 'sessionstore.database' : Must be string.");
				config["sessionstore"]["database"] = "";
			}
			if(typeof config["sessionstore"]["user"] !== "string") {
				report.push("Missing/Invalid -> 'sessionstore.user' : Must be string.");
				config["sessionstore"]["user"] = "";
			}
		}

		// redis specific sessionstore args
		if(config["sessionstore"]["type"] === "redis") {
			if(typeof config["sessionstore"]["db"] !== "number") {
				report.push("Missing/Invalid -> 'sessionstore.db' : Must be number.");
				config["sessionstore"]["db"] = 6379;
			}
			if(typeof config["sessionstore"]["port"] !== "number") {
				report.push("Missing/Invalid -> 'sessionstore.port' : Must be number.");
				config["sessionstore"]["port"] = 15;
			}
		}
		
		if(typeof config["sessionstore"]["host"] !== "string") {
			report.push("Missing/Invalid -> 'sessionstore.host' : Must be string.");
			config["sessionstore"]["host"] = "";
		}
		if(typeof config["sessionstore"]["password"] !== "string") {
			report.push("Missing/Invalid -> 'sessionstore.password' : Must be string.");
			config["sessionstore"]["password"] = "";
		}
	}
	
	if(report.length > 0) {
		console.log(report);
	}
	
	return config;
}