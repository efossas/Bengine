Bengine.extensibles.qstore = new function Qstore() {
	this.type = "qstore";
	this.name = "store";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var storeVars = document.createElement("textarea");
		storeVars.setAttribute("class","xQst");
		
		var blockNS = document.createElement("input");
		blockNS.setAttribute("type","text");
		blockNS.setAttribute("class","bengine-x-ns-cond col col-50");
		blockNS.setAttribute("placeholder","Block Namespace");
		
		var blockCond = document.createElement("input");
		blockCond.setAttribute("type","text");
		blockCond.setAttribute("class","bengine-x-ns-cond col col-50");
		blockCond.setAttribute("placeholder","Block Conditional (optional)");

		if(!thisBlock.p.emptyObject(bcontent)) {
			storeVars.value = bcontent['content'];
			blockNS.value = bcontent['namespace'];
			blockCond.value = bcontent['conditional'];
		}
		
		storeVars.setAttribute("placeholder","Comma or newline separated variables you want to keep for the next quiz step.\n");

		block.appendChild(blockNS);
		block.appendChild(blockCond);
		block.appendChild(storeVars);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		/* nothing to do */
	};
	
	this.runBlock = null;
	
	this.runData = function(data,iframe,task) {
		var result = null;
		if(thisBlock.p.checkConditional(data)) {
			result = data.content.split(/\n|,/);
		}
		task.done = true;
		return result;
	};

	this.saveContent = function(bid) {
		let namespace = document.getElementById(bid).children[0].value.trim();
		let conditional = document.getElementById(bid).children[1].value.trim();
		let content = document.getElementById(bid).children[2].value;
		return {'content':content,'namespace':namespace,'conditional':conditional};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
		var str = '<div class="xQst-show">' + bcontent['content'] + '</div>';
		block.innerHTML = str;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xQst {
			max-width: 100%;
			margin: 0px auto 0 auto;
			width: 100%;
	    	height: 100px;
	    	border: 1px solid black;
	    	border-radius: 2px;
	    	background-color: white;
	
	    	padding: 8px;
	    	margin: 0px;
	    	box-sizing: border-box;
	
	    	font-family: Arial, Helvetica, sans-serif;
	    	font-size: 1em;
	    	font-weight: 300;
	    	color: black;
	    	
	    	resize: vertical;
		}

		.xQst-show {
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
			color: black;
		}`;
		return stylestr;
	};
};
