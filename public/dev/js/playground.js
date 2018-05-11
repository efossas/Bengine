/***
	PG global is for working with cookies and UUID
***/

function PG() {};

PG.uuidv4 = function(a) {
  return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,PG.uuidv4)
};

PG.findCookieValue = function(cookieString,key) {
    var name = key + "=";
    var cookies = decodeURIComponent(cookieString).split(';');
    for(var i = 0; i <cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return null;
};

PG.createCookieString = function(key,value,date,path) {
    var expires = date.toUTCString();
    return `${key}=${value}; expires=${expires}; path='${path}'; domain=`;
};

/***
	Set file name if page is loaded in 'play' mode	
***/

if(window.location.href.indexOf('bengine') > 1) {
	var bengineFileName;
	var query = window.location.href.split('?').pop().split('#').shift().split('&');
	
	for(value of query) {
		var parts = value.split('=');
		if(parts[0] === 'demo') {
			bengineFileName = 'demo/pid-bengine/1.0';
		}
	}
	
	if(!bengineFileName) {
		// bengine file
		var existingBengineFile = PG.findCookieValue(document.cookie,'bengineFileName');
		if(existingBengineFile) {
			bengineFileName = existingBengineFile;
		} else {
			bengineFileName = PG.uuidv4();
		}
		var expiration = new Date(new Date().setFullYear(new Date().getFullYear() + 10));
		var cookie = PG.createCookieString('bengineFileName',bengineFileName,expiration,'/');
		document.cookie = cookie;
	}
} else if(window.location.href.indexOf('qengine') > 1) {
	var qengineFileName;
	var query = window.location.href.split('?').pop().split('#').shift().split('&');
	
	for(value of query) {
		var parts = value.split('=');
		if(parts[0] === 'demo') {			
			qengineFileName = 'demo/pid-qengine/1.0';
		}
	}
	
	if(!qengineFileName) {
		// qengine file
		var existingQengineFile = PG.findCookieValue(document.cookie,'qengineFileName');
		if(existingQengineFile) {
			qengineFileName = existingQengineFile;
		} else {
			qengineFileName = PG.uuidv4();
		}
		var expiration = new Date(new Date().setFullYear(new Date().getFullYear() + 10));
		var cookie = PG.createCookieString('qengineFileName',qengineFileName,expiration,'/');
		document.cookie = cookie;
	}
}

















