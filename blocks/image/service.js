exports.command = ["-verbose -monitor ","INPUT"," -resize '1280x720>' ","OUTPUT.png"," 2>&1"];

exports.process = function(response,data) {
    var dataStr = data.toString();
    
	var printCount = 0;
    var dataArray;
    var completion;
    var current;
    
	if(printCount === 0) {
        response.write(",300");
        printCount = 1;
    } else if(printCount === 1) {
        /* load progress 0-100 */
        dataArray = dataStr.match(/, [0-9]{2,3}% com/g);
        current = dataArray[dataArray.length - 1];
        completion = current.slice(2,4);
        if(current[5] === "%") {
            response.write(",100");
            printCount = 2;
        } else {
            response.write("," + completion);
        }
    } else if (printCount === 2) {
        /* resize progress 0-100 */
        dataArray = dataStr.match(/, [0-9]{2,3}% com/g);
        if(dataArray !== null) {
            current = dataArray[dataArray.length - 1];
            completion = current.slice(2,4);
            if(current[5] === "%") {
                response.write(",200");
                printCount = 3;
            } else {
                response.write("," + String(Number(completion) + 100));
            }
        }
    } else if (printCount === 3) {
        /* save progress 0-100 */
        dataArray = dataStr.match(/, [0-9]{2,3}% com/g);
        if(dataArray !== null) {
            current = dataArray[dataArray.length - 1];
            completion = current.slice(2,4);
            if(current[5] === "%") {
                response.write(",300");
                printCount = 4;
            } else {
                response.write("," + String(Number(completion) + 200));
            }
        }
    }
    
    var results = dataStr.match(/DONE:.+/g);
    if(results !== null) {
        return results[0].substr(6);
    }
};