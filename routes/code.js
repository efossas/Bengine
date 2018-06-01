exports.process = function(request,response) {
	const orequest = require('request');
	const rest = require('../lib/rest.js');

	var body = '';
    request.on('data',function(data) {
        body += data;
        
        if (body.length > 1e6) {
			request.connection.destroy();
			rest.respond(response,413,'Body Is Too Large',{});
			return;
		}
    });

	var rData = {};
    request.on('end',function() {
	    /*
		    json should contain:
		    	code.fpath		- path to file assets
		    	code.type		- the service, like 'sage'
		    	code.code		- the code to run
		    	code.namespace	- the namespace to store variables under
		    	code.vars		- any variables to store from the run
		*/
	    var code = JSON.parse(body);
	    code.fpath = code.fpath.replace(/^\/(.+)?\/$/g,"$1");
    
	    var serviceURL = null;
	    try {
	    	serviceURL = request.app.get("services")[code.type].url;
	    } catch(err) {
		    rest.respond(response,400,String(error),{});
			return;
	    }
	    
	    /*
		    Code Services Expect:
		    	{
			    	'code' : '$code-to-run'
			    	'vars' : [variables,to,keep]
			    }
		*/
	    var requestData = {};
	    requestData['code'] = code['code'];
	    requestData['vars'] = code['vars'].replace(/ /g,'').replace(/\n$/,'').split(/\n|,/g); // split into array
	    
	    orequest({
		    url: serviceURL + "/service",
		    method: "POST",
		    body: requestData,
		    json: true
		}, function (error, oresponse, obody) {
			if(error) {
				rest.respond(response,400,String(error),{});
				return;
			} else if (oresponse.statusCode !== 200) {
				rest.respond(response,400,'service return status code: ' + oresponse.statusCode,{});
				return;
			} else {
				if('error' in obody) {
					rest.respond(response,400,obody.error[0],{});
					return;
				}
				
				rData[code['namespace']] = {'variables':{},'resources':[]};
				
				/* grab variables and resource names */
				var resourceQueue = [];
				for(var key in obody) {
					if(!obody.hasOwnProperty(key)) continue;
					if(key[0] === '_') {
						let rpromise = new Promise((resolve,reject) => {
							orequest({
								url: serviceURL + "/static/" + obody[key],
								method:"GET",
								encoding: null
							}, function(error,sresponse,sbody) {
								if(error) {
									reject(error);
								} else if (sresponse.statusCode !== 200) {
									reject(sresponse.statusCode);
								} else {
									resolve({'name':key,'file':obody[key][0],'content':sbody});
								}
							});
						});
						resourceQueue.push(rpromise);
					} else {
						rData[code['namespace']]['variables'][key] = obody[key][0];
					}
				}
				
				/* fetch any requested resources*/
				if(resourceQueue.length > 0) {
					const mime = require('mime');
					const fs = require('fs');
					Promise.all(resourceQueue).then(values => {
						writeQueue = [];
						values.forEach(function(fdata) {							
							let wpromise = new Promise((resolve,reject) => {
								let path = ["./public/content/",code.fpath,'/',fdata['file']].join('');
								fs.writeFile(path,fdata['content'],function(err) {
									if(err) {
										reject(err);
									} else {
										resolve('');	
									}
								});
							});
							writeQueue.push(wpromise);

							let path = ["/content/",code.fpath,'/',fdata['file']].join('');
							rData[code['namespace']]['variables'][fdata['name']] = path;
						});
						
						Promise.all(writeQueue).then(values => {
							rest.respond(response,200,'done',rData);
						}).catch(error => {
							rest.respond(response,400,'Error writing requested resource: ' + String(error),rData);
						});
					}).catch(error => {
						rest.respond(response,400,'Error retrieving requested resource: ' + String(error),rData);
					});
				} else {
					rest.respond(response,200,'done',rData);
				}
	        }	        
	    });
	});
};