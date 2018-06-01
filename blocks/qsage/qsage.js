Bengine.extensibles.sage = new function Sage() {
	this.type = "sage";
	this.name = "sagemath";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.runCode = function(data,task) {		
		var promise = thisBlock.p.sendData('/code',data);
		
		promise.then(function(result) {
			thisBlock.d.variables[data['namespace']] = result['data'][data['namespace']]['variables'];
			thisBlock.p.alerts.log('complete','success');
			if(task) task.done = true;
		},function(error) {
			thisBlock.p.alerts.alert(error.msg);
			if(task) task.done = true;
		});
	};
	
	this.destroy = function() {
		return;
	};

	this.fetchDependencies = function() {		
		var cmjs = {
			inner: '',
			source: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.24.2/codemirror.js',
			type: 'text/javascript',
			wait: 'CodeMirror'
		};
		var pylang = {
			inner: '',
			source: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.24.2/mode/python/python.min.js',
			type: 'text/javascript'
		};
		
		return [cmjs,pylang];
	};

	this.insertContent = function(block,bcontent) {
	    var sageBlock = document.createElement("div");
		sageBlock.setAttribute("class","xSgx");
		
		var text = "";
		var ns = "";
		var cond = "";
		var vars = "";
		if(thisBlock.p.emptyObject(bcontent)) {
			if(thisBlock.d.options.defaultText) {
				text = 'This is a CodeMirror text editor. Use it to add & run your SageMath code.\n';
			}
		} else {
			text = bcontent['content'];
			ns = bcontent['namespace'];
			cond = bcontent['conditional'];
			vars = bcontent['vars'] ? bcontent['vars'] : ''; // this may have been lost when downloading/uploading to/from njn file
		}
		
		var CodeMirrorBlock = CodeMirror(sageBlock,{
		    value: text,
		    mode:  "python",
		    lineNumbers: true,
		    lineWrapping: true
		});
		CodeMirrorBlock.setSize('100%','auto');
		
		var sageNS = document.createElement("input");
		sageNS.setAttribute("type","text");
		sageNS.setAttribute("class","bengine-x-ns-cond col col-50");
		sageNS.setAttribute("placeholder","Enter The Namespace For This Code Block.");
		sageNS.setAttribute("value",ns);
		
		var blockCond = document.createElement("input");
		blockCond.setAttribute("type","text");
		blockCond.setAttribute("class","bengine-x-ns-cond col col-50");
		blockCond.setAttribute("placeholder","Block Conditional (optional)");
		blockCond.setAttribute("value",cond);
		
		var sageVars = document.createElement("textarea");
		sageVars.setAttribute("class","xSgx-Vars");
		sageVars.value = vars;
		sageVars.setAttribute("placeholder","Comma or newline separated variables you want to keep from your code run.");

		block.appendChild(sageBlock);
		block.appendChild(sageNS);
		block.appendChild(blockCond);
		block.appendChild(sageVars);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		document.getElementById(bid).children[0].children[0].CodeMirror.refresh();
	};
	
	this.runBlock = function(bid) {
		var data = {};
		data['code'] = thisBlock.p.replaceVars(document.getElementById(bid).children[0].children[0].CodeMirror.getValue());
		data['namespace'] = document.getElementById(bid).children[1].value;
		data['conditional'] = document.getElementById(bid).children[2].value;
		data['vars'] = document.getElementById(bid).children[3].value;
		data['type'] = thisBlock.type;
		data['fpath'] = thisBlock.d.getPagePath();
		
		_private.runCode(data,null);
	};
	
	this.runData = function(data,iframe,task) {
		var rdata = {};
		rdata['code'] = data['content'];
		rdata['namespace'] = data['namespace'];
		rdata['conditional'] = data['conditional'];
		rdata['vars'] = data['vars'];
		rdata['type'] = thisBlock.type;
		rdata['fpath'] = thisBlock.d.getPagePath();	
		
		_private.runCode(rdata,task);
	};

	this.saveContent = function(bid) {
		var blockContent = document.getElementById(bid).children[0].children[0].CodeMirror.getValue();
		var blockNamespace = document.getElementById(bid).children[1].value;
		var blockConditional = document.getElementById(bid).children[2].value;
		var blockVars = document.getElementById(bid).children[3].value;
		return {'content':blockContent,'namespace':blockNamespace,'conditional':blockConditional,'vars':blockVars};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
	    var sageBlock = document.createElement("div");
		sageBlock.setAttribute("class","xSgx-show");
		
		var CodeMirrorBlock = CodeMirror(cmBlock,{
		    value: bcontent['code'],
		    mode:  'python',
		    lineNumbers: true,
		    lineWrapping: true
		});
		CodeMirrorBlock.setSize('100%','100%');

		block.appendChild(sageBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xSgx, .xSgx-show {
			min-height: 62px;
			height: auto;
			
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;
		}
		
		.xSgx-Vars {
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
		`;
		
		stylestr += `.CodeMirror{font-family:monospace;height:300px;color:#000}.CodeMirror-lines{padding:4px 0}.CodeMirror pre{padding:0 4px}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background-color:#fff}.CodeMirror-gutters{border-right:1px solid #ddd;background-color:#f7f7f7;white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:#999;white-space:nowrap}.CodeMirror-guttermarker{color:#000}.CodeMirror-guttermarker-subtle{color:#999}.CodeMirror-cursor{border-left:1px solid #000;border-right:none;width:0}.CodeMirror div.CodeMirror-secondarycursor{border-left:1px solid silver}.cm-fat-cursor .CodeMirror-cursor{width:auto;border:0!important;background:#7e7}.cm-fat-cursor div.CodeMirror-cursors{z-index:1}.cm-animate-fat-cursor{width:auto;border:0;-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite;background-color:#7e7}@-moz-keyframes blink{50%{background-color:transparent}}@-webkit-keyframes blink{50%{background-color:transparent}}@keyframes blink{50%{background-color:transparent}}.cm-tab{display:inline-block;text-decoration:inherit}.CodeMirror-rulers{position:absolute;left:0;right:0;top:-50px;bottom:-20px;overflow:hidden}.CodeMirror-ruler{border-left:1px solid #ccc;top:0;bottom:0;position:absolute}.cm-s-default .cm-header{color:#00f}.cm-s-default .cm-quote{color:#090}.cm-negative{color:#d44}.cm-positive{color:#292}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-strikethrough{text-decoration:line-through}.cm-s-default .cm-keyword{color:#708}.cm-s-default .cm-atom{color:#219}.cm-s-default .cm-number{color:#164}.cm-s-default .cm-def{color:#00f}.cm-s-default .cm-variable-2{color:#05a}.cm-s-default .cm-variable-3{color:#085}.cm-s-default .cm-comment{color:#a50}.cm-s-default .cm-string{color:#a11}.cm-s-default .cm-string-2{color:#f50}.cm-s-default .cm-meta,.cm-s-default .cm-qualifier{color:#555}.cm-s-default .cm-builtin{color:#30a}.cm-s-default .cm-bracket{color:#997}.cm-s-default .cm-tag{color:#170}.cm-s-default .cm-attribute{color:#00c}.cm-s-default .cm-hr{color:#999}.cm-s-default .cm-link{color:#00c}.cm-invalidchar,.cm-s-default .cm-error{color:red}.CodeMirror-composing{border-bottom:2px solid}div.CodeMirror span.CodeMirror-matchingbracket{color:#0f0}div.CodeMirror span.CodeMirror-nonmatchingbracket{color:#f22}.CodeMirror-matchingtag{background:rgba(255,150,0,.3)}.CodeMirror-activeline-background{background:#e8f2ff}.CodeMirror{position:relative;overflow:hidden;background:#fff}.CodeMirror-scroll{overflow:scroll!important;margin-bottom:-30px;margin-right:-30px;padding-bottom:30px;height:100%;outline:0;position:relative}.CodeMirror-sizer{position:relative;border-right:30px solid transparent}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;min-height:100%;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;display:inline-block;vertical-align:top;margin-bottom:-30px}.CodeMirror-gutter-wrapper{position:absolute;z-index:4;background:0 0!important;border:none!important;-webkit-user-select:none;-moz-user-select:none;user-select:none}.CodeMirror-gutter-background{position:absolute;top:0;bottom:0;z-index:4}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre{-moz-border-radius:0;-webkit-border-radius:0;border-radius:0;border-width:0;background:0 0;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:20px;color:inherit;z-index:2;position:relative;overflow:visible;-webkit-tap-highlight-color:transparent;-webkit-font-variant-ligatures:contextual;font-variant-ligatures:contextual}.CodeMirror-wrap pre{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;overflow:auto}.CodeMirror-code{outline:0}.CodeMirror-gutter,.CodeMirror-gutters,.CodeMirror-linenumber,.CodeMirror-scroll,.CodeMirror-sizer{-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-cursor{position:absolute;pointer-events:none}.CodeMirror-measure pre{position:static}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}.CodeMirror-focused div.CodeMirror-cursors,div.CodeMirror-dragcursors{visibility:visible}.CodeMirror-selected{background:#d9d9d9}.CodeMirror-focused .CodeMirror-selected,.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection{background:#d7d4f0}.CodeMirror-crosshair{cursor:crosshair}.CodeMirror-line::-moz-selection,.CodeMirror-line>span::-moz-selection,.CodeMirror-line>span>span::-moz-selection{background:#d7d4f0}.cm-searching{background:#ffa;background:rgba(255,255,0,.4)}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}.cm-tab-wrap-hack:after{content:''}span.CodeMirror-selectedtext{background:0 0}`;
		
		return stylestr;
	};
};
