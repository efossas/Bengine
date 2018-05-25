exports.respond = function (res,code,msg,data) {
	
	if(typeof msg !== 'string') msg = '';
	if(typeof data !== 'object') data = {};
	let result = {
		msg:msg,
		status:code,
		data:data
	};
	
	res.status(code);
	res.setHeader('content-type','application/json');
	res.json(result);
}