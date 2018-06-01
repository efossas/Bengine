exports.command = ["-f pdf -o ","OUTPUT.pdf","INPUT"," 2>&1"];

exports.process = function(response,data) {
	/* unfortunately, unoconv & libreoffice don't stdout progress */

	var results = data.toString().match(/DONE:.+/g);
    if(results !== null) {
        return results[0].substr(6);
    }
};