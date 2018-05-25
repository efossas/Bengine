Bengine.extensibles.mcode = new function Mcode() {
	this.type = "mcode";
	this.name = "codemirror";
	this.category = "text";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.availableModes = ['apl','ebnf','http','octave','scheme','ttcn','asciiarmor','ecl','idl','oz','shell','ttcn','cfg','asn','1','eiffel','index','html','pascal','sieve','turtle','asterisk','elm','javascript','pegjs','slim','twig','brainfuck','erlang','jinja2','perl','smalltalk','vb','clike','factor','jsx','php','smarty','vbscript','clojure','fcl','julia','pig','solr','velocity','cmake','forth','livescript','powershell','soy','verilog','cobol','fortran','lua','properties','sparql','vhdl','coffeescript','gas','markdown','protobuf','spreadsheet','vue','commonlisp','gfm','mathematica','pug','sql','webidl','crystal','gherkin','mbox','puppet','stex','xml','css','go','meta','js','python','stylus','xquery','cypher','groovy','mirc','q','swift','yacas','d','haml','mllike','r','tcl','yaml','dart','handlebars','modelica','rpm','textile','yaml','frontmatter','diff','haskell','mscgen','rst','tiddlywiki','z80','django','haskell','literate','mumps','ruby','tiki','dockerfile','haxe','nginx','rust','toml','dtd','htmlembedded','nsis','sas','tornado','dylan','htmlmixed','ntriples','sass','troff'];
	
	_private.setMode = function(block) {
		var mode = block.children[0].value;
		
		if(mode === "") {
			mode = "javascript";
		}
		
		if(_private.availableModes.indexOf(mode) < 0) {
			thisBlock.p.alerts.alert("That Mode Is Not Available");
			return;
		}
		
		var source = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.24.2/mode/' + mode + '/' + mode + '.min.js';
		
		var allScripts = document.getElementsByTagName('script');
		
		var not = true;
		for(let i = allScripts.length - 1; i >= 0; i--) {
			if(allScripts[i].src === source) {
				not = false;
				break;
			}
		}
		
		if(not) {
			var script = document.createElement('script');
			script.src = source;
			script.type = 'text/javascript';
			
			document.getElementsByTagName('head')[0].appendChild(script);
		}

		setTimeout(function() {
			block.children[1].children[0].CodeMirror.setOption("mode",mode);
			block.children[1].children[0].CodeMirror.refresh();
			thisBlock.p.alerts.log("Mode set to: <b>" + block.children[1].children[0].CodeMirror.getMode().name + "</b>","success");
		}, 1000);
	}
	
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
		var jslang = {
			inner: '',
			source: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.24.2/mode/javascript/javascript.min.js',
			type: 'text/javascript'
		};
		
		return [cmjs,jslang];
	}

	this.insertContent = function(block,bcontent) {
		var cmMode = document.createElement("input");
		cmMode.setAttribute("type","text");
		cmMode.setAttribute("class","mCde-mode");
		cmMode.setAttribute("placeholder","Enter Programming Language Here, Defaults To Javascript");
		
		var cmBlock = document.createElement("div");
		cmBlock.setAttribute("class","mCde");

		/* defaul text */
		var text = "";
		var mode = "";
		if(thisBlock.p.emptyObject(bcontent)) {
			if(thisBlock.d.options.defaultText) {
				text = `This is a CodeMirror text editor. A list of commands can be found here: https://codemirror.net/doc/manual.html#commands
A list of supported programming languages can be found here: https://github.com/codemirror/CodeMirror/tree/master/mode`;
			}
			mode = "javascript";
		} else {
			mode = bcontent['mode'];
			text = bcontent['content'];
			
			cmMode.setAttribute("value", mode);
		}
		
		var CodeMirrorBlock = CodeMirror(cmBlock,{
		    value: text,
		    mode:  mode,
		    lineNumbers: true,
		    lineWrapping: true
		});
		CodeMirrorBlock.setSize('100%','auto');

		block.appendChild(cmMode);
		block.appendChild(cmBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		try {
			document.getElementById(bid).children[0].children[0].CodeMirror.refresh();
		} catch(err) {
			document.getElementById(bid).children[1].children[0].CodeMirror.refresh();
		}
	};
	
	this.runBlock = function(bid) {
		var block = document.getElementById(bid);
		_private.setMode(block);
	}

	this.runData = function(data,iframe) {
		//// needs implementing
		return null;
	};

	this.saveContent = function(bid) {
		var blockMode = document.getElementById(bid).children[0].value;
		var blockContent = document.getElementById(bid).children[1].children[0].CodeMirror.getValue();
		return {'mode':blockMode,'content':blockContent};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
		var cmBlock = document.createElement("div");
		cmBlock.setAttribute("class","mCde-show");
		
		var mode = bcontent['mode'];
		var text = bcontent['content'];

		var CodeMirrorBlock = CodeMirror(cmBlock,{
		    value: text,
		    mode:  mode,
		    lineNumbers: true,
		    lineWrapping: true,
		    readOnly: true
		});
		CodeMirrorBlock.setSize('100%','auto');

		block.appendChild(cmBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.mCde-mode {
			width: 100%;
			padding: 5px 8px;
			border: 1px solid black;
			
			display: inline-block;
			box-sizing: border-box;
			
			font-size: 0.9em;
		}
		
		.mCde, .mCde-show {
			min-height: 62px;
			height: auto;
			
			border: 1px solid black;
			border-radius: 2px;
			background-color: white;
		}`;
		
		/* codemirror js styles */
		stylestr += `.CodeMirror{font-family:monospace;height:300px;color:#000}.CodeMirror-lines{padding:4px 0}.CodeMirror pre{padding:0 4px}.CodeMirror-gutter-filler,.CodeMirror-scrollbar-filler{background-color:#fff}.CodeMirror-gutters{border-right:1px solid #ddd;background-color:#f7f7f7;white-space:nowrap}.CodeMirror-linenumber{padding:0 3px 0 5px;min-width:20px;text-align:right;color:#999;white-space:nowrap}.CodeMirror-guttermarker{color:#000}.CodeMirror-guttermarker-subtle{color:#999}.CodeMirror-cursor{border-left:1px solid #000;border-right:none;width:0}.CodeMirror div.CodeMirror-secondarycursor{border-left:1px solid silver}.cm-fat-cursor .CodeMirror-cursor{width:auto;border:0!important;background:#7e7}.cm-fat-cursor div.CodeMirror-cursors{z-index:1}.cm-animate-fat-cursor{width:auto;border:0;-webkit-animation:blink 1.06s steps(1) infinite;-moz-animation:blink 1.06s steps(1) infinite;animation:blink 1.06s steps(1) infinite;background-color:#7e7}@-moz-keyframes blink{50%{background-color:transparent}}@-webkit-keyframes blink{50%{background-color:transparent}}@keyframes blink{50%{background-color:transparent}}.cm-tab{display:inline-block;text-decoration:inherit}.CodeMirror-rulers{position:absolute;left:0;right:0;top:-50px;bottom:-20px;overflow:hidden}.CodeMirror-ruler{border-left:1px solid #ccc;top:0;bottom:0;position:absolute}.cm-s-default .cm-header{color:#00f}.cm-s-default .cm-quote{color:#090}.cm-negative{color:#d44}.cm-positive{color:#292}.cm-header,.cm-strong{font-weight:700}.cm-em{font-style:italic}.cm-link{text-decoration:underline}.cm-strikethrough{text-decoration:line-through}.cm-s-default .cm-keyword{color:#708}.cm-s-default .cm-atom{color:#219}.cm-s-default .cm-number{color:#164}.cm-s-default .cm-def{color:#00f}.cm-s-default .cm-variable-2{color:#05a}.cm-s-default .cm-variable-3{color:#085}.cm-s-default .cm-comment{color:#a50}.cm-s-default .cm-string{color:#a11}.cm-s-default .cm-string-2{color:#f50}.cm-s-default .cm-meta,.cm-s-default .cm-qualifier{color:#555}.cm-s-default .cm-builtin{color:#30a}.cm-s-default .cm-bracket{color:#997}.cm-s-default .cm-tag{color:#170}.cm-s-default .cm-attribute{color:#00c}.cm-s-default .cm-hr{color:#999}.cm-s-default .cm-link{color:#00c}.cm-invalidchar,.cm-s-default .cm-error{color:red}.CodeMirror-composing{border-bottom:2px solid}div.CodeMirror span.CodeMirror-matchingbracket{color:#0f0}div.CodeMirror span.CodeMirror-nonmatchingbracket{color:#f22}.CodeMirror-matchingtag{background:rgba(255,150,0,.3)}.CodeMirror-activeline-background{background:#e8f2ff}.CodeMirror{position:relative;overflow:hidden;background:#fff}.CodeMirror-scroll{overflow:scroll!important;margin-bottom:-30px;margin-right:-30px;padding-bottom:30px;height:100%;outline:0;position:relative}.CodeMirror-sizer{position:relative;border-right:30px solid transparent}.CodeMirror-gutter-filler,.CodeMirror-hscrollbar,.CodeMirror-scrollbar-filler,.CodeMirror-vscrollbar{position:absolute;z-index:6;display:none}.CodeMirror-vscrollbar{right:0;top:0;overflow-x:hidden;overflow-y:scroll}.CodeMirror-hscrollbar{bottom:0;left:0;overflow-y:hidden;overflow-x:scroll}.CodeMirror-scrollbar-filler{right:0;bottom:0}.CodeMirror-gutter-filler{left:0;bottom:0}.CodeMirror-gutters{position:absolute;left:0;top:0;min-height:100%;z-index:3}.CodeMirror-gutter{white-space:normal;height:100%;display:inline-block;vertical-align:top;margin-bottom:-30px}.CodeMirror-gutter-wrapper{position:absolute;z-index:4;background:0 0!important;border:none!important;-webkit-user-select:none;-moz-user-select:none;user-select:none}.CodeMirror-gutter-background{position:absolute;top:0;bottom:0;z-index:4}.CodeMirror-gutter-elt{position:absolute;cursor:default;z-index:4}.CodeMirror-lines{cursor:text;min-height:1px}.CodeMirror pre{-moz-border-radius:0;-webkit-border-radius:0;border-radius:0;border-width:0;background:0 0;font-family:inherit;font-size:inherit;margin:0;white-space:pre;word-wrap:normal;line-height:20px;color:inherit;z-index:2;position:relative;overflow:visible;-webkit-tap-highlight-color:transparent;-webkit-font-variant-ligatures:contextual;font-variant-ligatures:contextual}.CodeMirror-wrap pre{word-wrap:break-word;white-space:pre-wrap;word-break:normal}.CodeMirror-linebackground{position:absolute;left:0;right:0;top:0;bottom:0;z-index:0}.CodeMirror-linewidget{position:relative;z-index:2;overflow:auto}.CodeMirror-code{outline:0}.CodeMirror-gutter,.CodeMirror-gutters,.CodeMirror-linenumber,.CodeMirror-scroll,.CodeMirror-sizer{-moz-box-sizing:content-box;box-sizing:content-box}.CodeMirror-measure{position:absolute;width:100%;height:0;overflow:hidden;visibility:hidden}.CodeMirror-cursor{position:absolute;pointer-events:none}.CodeMirror-measure pre{position:static}div.CodeMirror-cursors{visibility:hidden;position:relative;z-index:3}.CodeMirror-focused div.CodeMirror-cursors,div.CodeMirror-dragcursors{visibility:visible}.CodeMirror-selected{background:#d9d9d9}.CodeMirror-focused .CodeMirror-selected,.CodeMirror-line::selection,.CodeMirror-line>span::selection,.CodeMirror-line>span>span::selection{background:#d7d4f0}.CodeMirror-crosshair{cursor:crosshair}.CodeMirror-line::-moz-selection,.CodeMirror-line>span::-moz-selection,.CodeMirror-line>span>span::-moz-selection{background:#d7d4f0}.cm-searching{background:#ffa;background:rgba(255,255,0,.4)}.cm-force-border{padding-right:.1px}@media print{.CodeMirror div.CodeMirror-cursors{visibility:hidden}}.cm-tab-wrap-hack:after{content:''}span.CodeMirror-selectedtext{background:0 0}`;
		
		return stylestr;
	};
};
