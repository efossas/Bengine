Bengine.extensibles.audio = new function Audio() {
	this.type = "audio";
	this.name = "audio";
	this.category = "media";
	this.upload = true;
	this.accept = ".aac,.aiff,.m4a,.mp3,.ogg,.ra,.wav,.wma";

	var thisBlock = this;
	var _private = {
    	files:{},
    	objectURLs:{}
	};
	
	this.destroy = function(block) {
		var url = block.childNodes[0].getAttribute('data-url');
		delete _private.files[url];
		URL.revokeObjectURL(_private.objectURLs[url]);
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

		var audiosource = document.createElement("source");
		audiosource.setAttribute("type","audio/mpeg");
		
		if (bcontent['content']) {
			var url = bcontent['content'];
			var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + url;
			
			thisBlock.p.getMediaFile(fullUrl,function(e) {
				_private.files[url] = new File([e.target.response], url, {type: "audio/mpeg"});		
				audiosource.src = _private.objectURLs[url] = URL.createObjectURL(new Blob([e.target.response],{type: "audio/mpeg"}));
				audio.load();
	        });
			
			audio.setAttribute('data-url', url);
		}

		audio.appendChild(audiosource);
		block.appendChild(audio);

		return block;
	};

	this.afterDOMinsert = function(bid,url) {
		/* audio & video divs have their src set in an extra child node */
		if (url) {
			var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + url;
			var audiotag = document.getElementById(bid).childNodes[0];

			thisBlock.p.getMediaFile(fullUrl,function(e) {
				_private.files[url] = new File([e.target.response], url, {type: "audio/mpeg"});				
				audiotag.childNodes[0].src = _private.objectURLs[url] = URL.createObjectURL(new Blob([e.target.response],{type: "audio/mpeg"}));
				audiotag.load();
	        });
    		
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
    	return _private.files[document.getElementById(bid).children[0].getAttribute('data-url')];
	};

	this.showContent = function(block,bcontent) {
		var audio = document.createElement("audio");
		audio.setAttribute("class","xAud-show");
		audio.volume = 0.8;
		audio.setAttribute("controls","controls");
		
		var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + bcontent['content'];

		var audiosource = document.createElement("source");
		audiosource.setAttribute("src",fullUrl);
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
