Bengine.extensibles.video = new function Video() {
	this.type = "video";
	this.name = "video";
	this.category = "media";
	this.upload = true;
	this.accept = ".avi,.flv,.mov,.mp4,.mpeg,.ogg,.rm,.webm,.wmv";

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
		var video = document.createElement("video");
		video.setAttribute("class","xVid");
		video.volume = 0.8;
		video.setAttribute("controls","controls");
		video.setAttribute('data-url', null);

		var videosource = document.createElement("source");
		videosource.setAttribute("type","video/mp4");
		
		if (bcontent['content']) {
			var url = bcontent['content'];
			var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + url;
			
			thisBlock.p.getMediaFile(fullUrl,function(e) {
				_private.files[url] = new File([e.target.response], url, {type: "video/mp4"});				
				videosource.src = _private.objectURLs[url] = URL.createObjectURL(new Blob([e.target.response],{type: "video/mp4"}));
				video.load();
	        });
			
			video.setAttribute('data-url', url);
		}

		video.appendChild(videosource);
		block.appendChild(video);

		return block;
	};

    // 'video/mp4; codecs="avc1.640020"'
	this.afterDOMinsert = function(bid,url,data) {
		/* audio & video divs have their src set in an extra child node */
		if (url) {
			var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + url;
			var videotag = document.getElementById(bid).childNodes[0];

			thisBlock.p.getMediaFile(fullUrl,function(e) {
				_private.files[url] = new File([e.target.response], url, {type: "video/mp4"});				
				videotag.childNodes[0].src = _private.objectURLs[url] = URL.createObjectURL(new Blob([e.target.response],{type: "video/mp4"}));
				videotag.load();
	        });
    		
    		videotag.setAttribute('data-url', url);
    	}
	};
	
	this.runBlock = null;
	this.runData = null;

	this.saveContent = function(bid) {
		var mediastr = document.getElementById(bid).children[0].getAttribute('data-url');
		return {'content':mediastr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"")};
	};
	
	this.saveFile = function(bid) {
    	return _private.files[document.getElementById(bid).children[0].getAttribute('data-url')];
	};

	this.showContent = function(block,bcontent) {
		var video = document.createElement("video");
		video.setAttribute("class","xVid-show");
		video.volume = 0.8;
		video.setAttribute("controls","controls");

		var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + bcontent['content'];

		var videosource = document.createElement("source");
		videosource.setAttribute("src",fullUrl);
		videosource.setAttribute("type","video/mp4");

		video.appendChild(videosource);
		block.appendChild(video);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xVid, .xVid-show {
			display: inline-block;
			width: 100%;
			height: 100%;
			border: 1px solid black;
			border-radius: 2px;

			padding: 0px;
			margin: 0px;
			box-sizing: border-box;
		}`;
		return stylestr;
	};
};
