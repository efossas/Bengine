Bengine.extensibles.qans = new function Qans() {
	this.type = "qans";
	this.name = "grade";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.blocklimit = 64;
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var str;
		let explain = 'title="Put a variable here that resolves to a value between 0 and 1. It is the final student grade."'
		if(!thisBlock.p.emptyObject(bcontent)) {
			str = `<input class='bengine-x-ns-cond col col-50' type='text' placeholder='Block Namespace' value='${bcontent['namespace']}'>
					<input class='bengine-x-ns-cond col col-50' type='text' placeholder='Block Conditional (optional)' value='${bcontent['conditional']}'>
					<input type="text" class="xQans" maxlength="${_private.blocklimit}" value="${bcontent['content']}" placeholder="Variable That Equals 0-1 For Grade">`;
		} else {
			str = `<input class='bengine-x-ns-cond col col-50' type='text' placeholder='Block Namespace'>
					<input class='bengine-x-ns-cond col col-50' type='text' placeholder='Block Conditional (optional)'>
					<input type="text" class="xQans" maxlength="${_private.blocklimit}" placeholder="Variable That Equals 0-1 For Grade">`;
		}

		block.innerHTML = str;

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		/* nothing to do */
	};
	
	this.runBlock = null;
	
	this.runData = function(data,iframe,task) {
		var result = null;
		if(thisBlock.p.checkConditional(data)) {
			result = Number(thisBlock.p.replaceVars(data.content.trim()));
		}
		task.done = true;
		return result;
	};

	this.saveContent = function(bid) {
		var namespace = document.getElementById(bid).children[0].value.trim();
		var conditional = document.getElementById(bid).children[1].value.trim();
		var variable = document.getElementById(bid).children[2].value.split("\n")[0]; // only accept one line
		if(variable.match(/@@(.*)@@/g) === null) {
			variable = '@@' + variable + '@@';
		}
		return {'content':variable,'namespace':namespace,'conditional':conditional};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
		var str = '<div class="xQans-show">' + bcontent['content'] + '</div>';
		block.innerHTML = str;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xQans {
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

		.xQans-show {
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
