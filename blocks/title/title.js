Bengine.extensibles.title = new function Title() {
	this.type = "title";
	this.name = "title";
	this.category = "text";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.blocklimit = 64;
	
	_private.componentToHex = function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}
	
	// expects [r,g,b]
	_private.rgbToHex = function(arr) {
	    return _private.componentToHex(arr[0]) + _private.componentToHex(arr[1]) + _private.componentToHex(arr[2]);
	}
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var str;
		if(!thisBlock.p.emptyObject(bcontent)) {
			str = '<input type="text" class="xTit" maxlength="' + _private.blocklimit + '" value="' + bcontent['content'] + '">';
		} else {
			str = '<input type="text" class="xTit" maxlength="' + _private.blocklimit + '" placeholder="Title">';
		}

		block.innerHTML = str;

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		/* nothing to do */
	};
	
	this.runBlock = null;
	this.runData = null;

	this.saveContent = function(bid) {
		return {'content':document.getElementById(bid).children[0].value};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {		
		try {
			var bcolor = window.getComputedStyle(document.getElementsByTagName('body')[0])['background-color'];
			var cvalue = parseInt(_private.rgbToHex(bcolor.match(/[0-9]+/g)), 16);
		} catch(err) {
			var cvalue = 0;
		}

		if(cvalue > 10027008) {
			var titleStyle = 'xTit-dark';
		} else {
			var titleStyle = 'xTit-bright';
		}
		
		var str = `<div class="xTit-show ${titleStyle}">` + bcontent['content'] + '</div>';
		block.innerHTML = str;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xTit {
			display: inline-block;
			width: 100%;
			height: 32px;
			border: 1px solid black;

			padding: 4px 6px;
			margin: 0px;
			box-sizing: border-box;

			text-align: center;

			font-family: Arial, Helvetica, sans-serif;
			font-size: 1em;
			font-weight: 300;
			color: black;
		}

		.xTit-show {
			display: inline-block;
			width: 100%;
			height: auto;
			background-color: rgba(118, 118, 118, 0.15);
			border: 1px solid black;
			border-bottom-color: rgba(118, 118, 118, 0.15);
			padding: 6px 6px;
			margin: 0px;
			box-sizing: border-box;
			text-align: center;
			font-family: Arial, Helvetica, sans-serif;
			font-size: 2em;
			font-weight: 900;
		}
		
		.xTit-bright {
			background-color: white;
			color: black;
		}
		
		.xTit-dark {
			background-color: black;
			color: white;
		}
		
		`;
		return stylestr;
	};
};
