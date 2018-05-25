Bengine.extensibles.audio = new function Audio() {
	this.type = "audio";
	this.name = "audio";
	this.category = "media";
	this.upload = true;
	this.accept = ".aac,.aiff,.m4a,.mp3,.ogg,.ra,.wav,.wma";

	var thisBlock = this;
	var _private = {
    	files:{}
	};
	
	this.destroy = function() {
		return;
	};

	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {		
		var audio = document.createElement("audio");
		audio.setAttribute("class","xAud");
		audio.volume = 0.8;
		audio.setAttribute("controls","controls");
		audio.setAttribute('data-url', null);
		audio.setAttribute('data-aid', thisBlock.p.createUUID());

		var audiosource = document.createElement("source");
		if(bcontent['url']) {
			audiosource.setAttribute("src",bcontent['content']);
		}
		audiosource.setAttribute("type","audio/mpeg");

		audio.appendChild(audiosource);
		block.appendChild(audio);

		return block;
	};

	this.afterDOMinsert = function(bid,url,data) {
		/* audio & video divs have their src set in an extra child node */
		var audiotag = document.getElementById(bid).childNodes[0];
		
		if (data) {
			var aid = audiotag.getAttribute('data-aid');
			_private.files[aid] = data;
			
			audiotag.childNodes[0].src = URL.createObjectURL(data);
            audiotag.load();
		} else if (url !== null) {
			var xhr = new XMLHttpRequest();
            xhr.open('GET',url);
            xhr.responseType = 'arraybuffer';
			xhr.onload = function(e) {
				var aid = audiotag.getAttribute('data-aid');
				var urlParts = url.split('/');
				_private.files[aid] = new File([e.target.response], urlParts[urlParts.length-1], {type: "audio/mp3"});
				
				audiotag.childNodes[0].src = URL.createObjectURL(new Blob([e.target.response],{type: "audio/mp3"}));
				audiotag.load();
            };
            xhr.send();
            
			audiotag.setAttribute('data-url', url);
		}
	};
	
	this.runBlock = null;
	this.runData = null;

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes and making relative path */
		var mediastr = document.getElementById(bid).children[0].getAttribute('data-url');
		return {'content':mediastr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"")};
	};
	
	this.saveFile = function(bid) {
    	var aid = document.getElementById(bid).children[0].getAttribute('data-aid');
    	return _private.files[aid];
	};

	this.showContent = function(block,bcontent) {
		var audio = document.createElement("audio");
		audio.setAttribute("class","xAud-show");
		audio.volume = 0.8;
		audio.setAttribute("controls","controls");

		var audiosource = document.createElement("source");
		audiosource.setAttribute("src",bcontent['content']);
		audiosource.setAttribute("type","audio/mpeg");

		audio.appendChild(audiosource);
		block.appendChild(audio);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xAud, .xAud-show {
			display: inline-block;
			width: 100%;

			padding: 0px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};
};
