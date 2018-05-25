Bengine.extensibles.qstep = new function Qstep() {
	this.type = "qstep";
	this.name = "step";
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
		if(!thisBlock.p.emptyObject(bcontent)) {
			str = `<input type="text" class="xQstep" maxlength="${_private.blocklimit}" value="${bcontent['content']}" placeholder="Variable that must exist for next step to run.">`;
		} else {
			str = `<input type="text" class="xQstep" maxlength="${_private.blocklimit}" placeholder="Variable that must exist for next step to run.">`;
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
			result = data.content;
		}
		task.done = true;
		return result;
	};

	this.saveContent = function(bid) {
		return {'content':document.getElementById(bid).children[0].value.split("\n")[0]};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
		var str = '<div class="xQstep-show">' + bcontent['content'] + '</div>';
		block.innerHTML = str;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xQstep {
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

		.xQstep-show {
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
