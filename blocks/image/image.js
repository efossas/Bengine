Bengine.extensibles.image = new function Image() {
	this.type = "image";
	this.name = "image";
	this.category = "media";
	this.upload = true;
	this.accept = ".bmp,.bmp2,.bmp3,.jpeg,.jpg,.pdf,.png,.svg";

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
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg");
		ximg.setAttribute('data-url', null);
		
		if (bcontent['content']) {
			var url = bcontent['content'];
			var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + url;
			
			thisBlock.p.getMediaFile(fullUrl,function(e) {
				_private.files[url] = new File([e.target.response], url, {type: "image/png"});				
				ximg.src =_private.objectURLs[url] = URL.createObjectURL(new Blob([e.target.response],{type: "image/png"}));
	        });
			
			ximg.setAttribute('data-url', url);
		}

		block.appendChild(ximg);

		return block;
	};

	this.afterDOMinsert = function(bid,url) {
		if (url) {
			var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + url;
			var imagetag = document.getElementById(bid).childNodes[0];

			thisBlock.p.getMediaFile(fullUrl,function(e) {
				_private.files[url] = new File([e.target.response], url, {type: "image/png"});				
				imagetag.src = _private.objectURLs[url] = URL.createObjectURL(new Blob([e.target.response],{type: "image/png"}));
	        });
    		
    		imagetag.setAttribute('data-url', url);
    	}
	};
	
	this.runBlock = null;
	this.runData = null;

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes and making relative path */
		var imagestr = document.getElementById(bid).children[0].getAttribute('data-url');
		return {'content':imagestr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"")};
	};
	
	this.saveFile = function(bid) {
    	return _private.files[document.getElementById(bid).children[0].getAttribute('data-url')];
	};

	this.showContent = function(block,bcontent) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg-show");
		
		var fullUrl = thisBlock.d.getContentPath() + thisBlock.d.getPagePath() + bcontent['content'];
		ximg.src = fullUrl;

		block.appendChild(ximg);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xImg, .xImg-show {
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
