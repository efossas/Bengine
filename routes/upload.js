exports.process = function(request,response) {
    const _ = require('../lib/util.js');
	const rest = require('../lib/rest.js');
	const fs = require('fs');
	const orequest = require('request');
	const path = require('path');

    // mp3 mp4 jpg
    
    /*
	    query should contain:
	    	query.fpath		- path to file assets
	    	query.btype		- the service, like 'sage', if not exists, only upload the file
	*/
	request.pipe(request.busboy);

    request.busboy.on('file',function(fieldname,file,filename) {
	    /* handle file size limits */
		file.on('limit',function(data) {
			file.resume();
			rest.respond(response,413,'File Is Too Large',{});
		});
		
		/* create page directory if not exists */
		var astdir = "/assets/";
		var reldir = '/content/' + decodeURIComponent(request.query.fpath).replace(/^\/(.+)?\/$/g,"$1") + astdir;
		var absdir = './public' + reldir;
		const initDir = path.isAbsolute(absdir) ? path.sep : '';
		
		absdir.split(path.sep).reduce((parentDir, childDir) => {
			const curDir = path.resolve(parentDir, childDir);
			if (!fs.existsSync(curDir)) {
				fs.mkdirSync(curDir);
			}
			
			return curDir;
		}, initDir);
		
		/* replace spaces with underscores, fixes issues with shell commands */
		var fileinput = filename.replace(/ /g,"_");
		var fullpath = absdir + fileinput;

		/* save the file, then process it */
		var fstream = fs.createWriteStream(fullpath);
		file.pipe(fstream);

		fstream.on('close',function() {
			/* check that service was requested, otherwise, this is just an upload route */
			if (!request.query.hasOwnProperty('btype')) {
			    response.end('');
				return;
			}
			
			try {
				const service = require('../blocks/' + request.query.btype + '/service.js');
				
				/* this is necessary to allow browsers to continually receive responses, opposed to just one at the end */
				response.writeHead(200,{'Content-Type':'text/plain','X-Content-Type-Options':'nosniff'});
				
				/*
					Media Services Expect:
						{
							'input' : '$file-name-to-convert'
							'cmd'   : [command,to,run]
						}
					* cmd array requires 'INPUT' & 'OUTPUT' to tell service where to insert input and output file names
				*/
				var serveData = {
					'input': fileinput,
					'cmd': service.command
				};
			
				serviceURL = request.app.get("services")[request.query.btype].url;

                /* read original file */
                fs.readFile(fullpath, (err,data) => {
                    if (err) {
                        response.end(String(err));
                        _.log([err,uploadData],"error");
                        return;
                    }
                    /* upload file to service */
                    var uploadData = {
                        url: serviceURL + "/upload/" + fileinput,
                        body: data
                    };
                    orequest.put(uploadData,function(err,res,body) {
                        if (err) {
                            response.end(String(err));
                            _.log([err,uploadData],"error");
                            return;
                        }
                        if (res.statusCode !== 200) {
                            response.end('Error:' + body);
                            _.log([body,uploadData],"error");
                            return;
                        }
                        /* send service request to transform file */
                        var getFile;
                        orequest.post({
        				    url: serviceURL + "/service",
        				    body: serveData,
        				    json: true
        				}).on('data', function(data) {
        					getFile = service.process(response,data);
        				}).on('response', function(res) {
            				res.on('end', function() {
                				/* get transformed file */
                                if (getFile) {
                                    var fstream = fs.createWriteStream(absdir + getFile);
                                    orequest.get(serviceURL + "/static/" + getFile).pipe(fstream);
                                    
                                    /* respond with file name */
                                    fstream.on('close',function() {
                                        response.end("," + astdir + getFile);
                                    });
                                    
                                    return;
                                }
                                response.end('');
            				});
                        });
                    });
                });
			} catch(err) {
				// could not load service, just return uploaded file path
				response.end("," + reldir + fileinput);
				_.log([err],"error");
			}
		});
	});	
};