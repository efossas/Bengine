Bengine.extensibles.image = new function Image() {
	this.type = "image";
	this.name = "image";
	this.category = "media";
	this.upload = true;
	this.accept = ".bmp,.bmp2,.bmp3,.jpeg,.jpg,.pdf,.png,.svg";

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
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg");
		ximg.setAttribute('data-url', null);
		ximg.setAttribute('data-iid', thisBlock.p.createUUID());
		
		if (bcontent['content']) {
			ximg.src = bcontent['content'];
		}

		block.appendChild(ximg);

		return block;
	};

	this.afterDOMinsert = function(bid,url,data) {
    	var imagetag = document.getElementById(bid).childNodes[0];
		if (data) {
    		var iid = imagetag.getAttribute('data-iid');
			_private.files[iid] = data;;
    		
            imagetag.src = URL.createObjectURL(data);
		} else if (url !== null) {
    		var xhr = new XMLHttpRequest();
            xhr.open('GET',url);
            xhr.responseType = 'arraybuffer';
			xhr.onload = function(e) {
				var iid = imagetag.getAttribute('data-iid');
				var urlParts = url.split('/');
				_private.files[iid] = new File([e.target.response], urlParts[urlParts.length-1], {type: "image/png"});
				
				imagetag.src = URL.createObjectURL(new Blob([e.target.response],{type: "image/png"}));
            };
            xhr.send();
    		
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
    	var iid = document.getElementById(bid).children[0].getAttribute('data-iid');
    	return _private.files[iid];
	};

	this.showContent = function(block,content) {
		var ximg = document.createElement("img");
		ximg.setAttribute("class","xImg-show");
		ximg.src = bcontent['content'];

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
