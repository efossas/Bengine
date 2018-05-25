Bengine.extensibles.video = new function Video() {
	this.type = "video";
	this.name = "video";
	this.category = "media";
	this.upload = true;
	this.accept = ".avi,.flv,.mov,.mp4,.mpeg,.ogg,.rm,.webm,.wmv";

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
		var video = document.createElement("video");
		video.setAttribute("class","xVid");
		video.volume = 0.8;
		video.setAttribute("controls","controls");
		video.setAttribute('data-url', null);
        video.setAttribute('data-vid', thisBlock.p.createUUID());

		var videosource = document.createElement("source");
		if(bcontent['url']) {
			videosource.setAttribute("src",bcontent['content']);
		}
		videosource.setAttribute("type","video/mp4");

		video.appendChild(videosource);
		block.appendChild(video);

		return block;
	};

    // 'video/mp4; codecs="avc1.640020"'
	this.afterDOMinsert = function(bid,url,data) {
		/* audio & video divs have their src set in an extra child node */
		var videotag = document.getElementById(bid).childNodes[0];
		
		if (data) {
			var vid = videotag.getAttribute('data-vid');
			_private.files[vid] = data;
			
			videotag.childNodes[0].src = URL.createObjectURL(data);
            videotag.load();
		} else if (url !== null) {
			var xhr = new XMLHttpRequest();
            xhr.open('GET',url);
            xhr.responseType = 'arraybuffer';
			xhr.onload = function(e) {
				var vid = videotag.getAttribute('data-vid');
				var urlParts = url.split('/');
				_private.files[vid] = new File([e.target.response], urlParts[urlParts.length-1], {type: "video/mp4"});
				
				videotag.childNodes[0].src = URL.createObjectURL(new Blob([e.target.response],{type: "video/mp4"}));
				videotag.load();
            };
            xhr.send();
            
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
    	var vid = document.getElementById(bid).children[0].getAttribute('data-vid');
    	return _private.files[vid];
	};

	this.showContent = function(block,bcontent) {
		var video = document.createElement("video");
		video.setAttribute("class","xVid-show");
		video.volume = 0.8;
		video.setAttribute("controls","controls");

		var videosource = document.createElement("source");
		videosource.setAttribute("src",bcontent['content']);
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
