exports.command = ["-i ","INPUT","OUTPUT.mp3"," 2>&1"];

exports.process = function(response,data) {

    var dataStr = data.toString();

	/* check for error first */
	if(dataStr.substr(0,5) === "ERROR") {
		response.write('err');
		return;
	}

    /* search for initial value, which is media length */
    var initial = dataStr.match(/Duration: .{11}/g);
    if(initial !== null) {
        var istr = initial[0];
        var ihours = Number(istr[10] + istr[11]);
        var iminutes = Number(istr[13] + istr[14]);
        var iseconds = Number(istr[16] + istr[17]);

        /* return time duration as seconds */
        var totaltime = (ihours * 360) + (iminutes * 60) + iseconds;
        response.write("," + String(totaltime));
    }

    /* search for time marker indicating position of conversion */
    var matches = dataStr.match(/time=.{11}/g);
    if(matches !== null) {
        var str = matches[0];
        var hours = Number(str[5] + str[6]);
        var minutes = Number(str[8] + str[9]);
        var seconds = Number(str[11] + str[12]);

        /* return time progress as seconds */
        var timeprogress = (hours * 360) + (minutes * 60) + seconds;
        response.write("," + String(timeprogress));
    }
    
    var results = dataStr.match(/DONE:.+/g);
    if(results !== null) {
        return results[0].substr(6);
    }
}