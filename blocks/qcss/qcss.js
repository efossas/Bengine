Bengine.extensibles.qcss = new function Qcss() {
	this.type = "qcss";
	this.name = "css";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.renderCSS = function(cssText,sid,doc) {
		var cdoc = doc || document;
		
		/* get or make style block */
		var styleblock = cdoc.getElementById('qengine-styles-' + sid);

		if(!styleblock) {
			styleblock = document.createElement('style');
			styleblock.setAttribute("id", 'qengine-styles-' + sid);
			cdoc.getElementsByTagName('head')[0].appendChild(styleblock);
		}
		
		/* render css */
		styleblock.innerHTML = cssText.replace(/\s\s/g,"");
	};
	
	this.destroy = function(block) {
		var sid = block.childNodes[2].getAttribute('data-sid');
		var styletag = document.getElementById('qengine-styles-' + sid);
		try {
			styletag.parentNode.removeChild(styletag);
		} catch(err) {
			// just ignore, couldn't find tag, probably block hasn't been run yet
		}
	}
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var qcssBlock = document.createElement('div');
		qcssBlock.setAttribute('class','xQcss');
		
		var blockNS = document.createElement("input");
		blockNS.setAttribute("type","text");
		blockNS.setAttribute("class","bengine-x-ns-cond col col-50");
		blockNS.setAttribute("placeholder","Block Namespace");
		
		var blockCond = document.createElement("input");
		blockCond.setAttribute("type","text");
		blockCond.setAttribute("class","bengine-x-ns-cond col col-50");
		blockCond.setAttribute("placeholder","Block Conditional (optional)");
		
		let sid = thisBlock.p.createUUID();
		qcssBlock.setAttribute('data-sid',sid);
		qcssBlock.contentEditable = true;
		
		if(!thisBlock.p.emptyObject(bcontent)) {
			qcssBlock.innerText = bcontent['content'];
			blockNS.setAttribute("value",bcontent['namespace']);
			blockCond.setAttribute("value",bcontent['conditional']);
		} else {
			qcssBlock.innerText = '.place-css-here { background-color:white; }';
		}

		block.appendChild(blockNS);
		block.appendChild(blockCond);
		block.appendChild(qcssBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		return null;
	};
	
	this.runBlock = function(bid) {
		var qcssBlock = document.getElementById(bid).childNodes[2];
		var sid = qcssBlock.getAttribute('data-sid');
		_private.renderCSS(qcssBlock.innerText,sid,null);
	}
	
	this.runData = function(data,iframe,task) {
		if(thisBlock.p.checkConditional(data)) {
			var sid = thisBlock.p.createUUID();
			var style = document.createElement('style');
			style.setAttribute('id','qengine-styles-' + sid);
			
			var idoc = iframe.contentDocument;
			idoc.head.appendChild(style);
			
			_private.renderCSS(data.content,sid,idoc);
		}
		task.done = true;
	};

	this.saveContent = function(bid) {
		let namespace = document.getElementById(bid).children[0].value.trim();
		let conditional = document.getElementById(bid).children[1].value.trim();
		let content = document.getElementById(bid).children[2].innerText;
		return {'content':content,'namespace':namespace,'conditional':conditional};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
		var qcssBlock = document.createElement('div');
		qcssBlock.setAttribute('class','xQcss');
		qcssBlock.setAttribute('style','display:none;visibility:hidden;');
		qcssBlock.innerHTML = bcontent['content'];
		
		block.appendChild(qcssBlock);

		_private.renderCSS(qcssBlock.innerText,thisBlock.p.createUUID(),null);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xQcss {
			display: inline-block;
			width: 100%;
			height: auto;
			border: 1px solid black;
			background-color: white;

			padding: 8px 6px;
			margin: 0;
			box-sizing: border-box;

			font-family: Arial, Helvetica, sans-serif;
		}`;
		return stylestr;
	};
};
