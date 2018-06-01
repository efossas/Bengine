Bengine.extensibles.qhtml = new function Qhtml() {
	this.type = "qhtml";
	this.name = "html";
	this.category = "quiz";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.makeShortcode = function(parts,prefix) {
		if(parts.length === 3) {
			let input = ['<input name="','','" type="','','" ','',' style="width:100%;box-sizing:border-box;">'];
			
			input[1] = parts[0];
			
			let tparts = parts[1].split('-');
			let tconfig = '';
			if (tparts.length == 2) {
				tconfig = tparts[1];
			}
			
			let finput = '';
			let itype = tparts[0].toLowerCase();
			if (itype === 'checkbox') {
				let olabel = '<label style="display:block" for="' + input[1] + '">';
				input[3] = 'checkbox';
				input[5] = 'id="' + input[1] + '" value="' + parts[2].split(',')[0] + '"';
				finput = olabel + input.join('') + parts[2].split(',')[1] + '</label>';
			} else if (itype === 'text') {
				input[3] = 'text';
				input[5] = 'placeholder="' + parts[2] + '"';
				finput = input.join('');
			} else if (itype === 'number') {
				input[3] = 'number';
				input[5] = 'placeholder="' + parts[2] + '"';
				finput = input.join('');
			} else if (itype === 'submit') {
				input[3] = 'submit';
				input[5] = 'value="' + parts[2] + '"';
				finput = input.join('');
			} else if (itype === 'reset') {
				input[3] = 'reset';
				input[5] = 'value="' + parts[2] + '"';
				finput = input.join('');
			} else if (itype === 'textarea') {
				let rows = '20'
				if (tconfig !== '') {
					rows = tconfig;
				}	
				finput = '<textarea name="' + input[1] + '" placeholder="' + parts[2] + '" style="width:100%" rows="' + rows + '"></textarea>';
			} else {
				thisBlock.p.alerts.log('Invalid Qengine shortcode type: ' + tparts[0],'error');
			}
			
			return finput;
		} else if(parts.length === 2) {
			let mediatag;
			
			let src = thisBlock.p.getResourcePath(parts[0]);
			
			if(typeof src !== 'undefined') {
				let itype = parts[1].toLowerCase();
				if (itype === 'audio') {
					mediatag = '<audio src="' + src + '"></audio>';
				} else if (itype === 'embed') {
					mediatag = '<embed src="' + src + '">';
				} else if (itype === 'image') {
					mediatag = '<img src="' + src + '">';
				} else if (itype === 'script') {
					mediatag = '<script src="' + src + '"></script>';
				} else if (itype === 'video') {
					mediatag = '<video src="' + src + '"></video>';
				}
			} else {
				mediatag = '';
			}
			return mediatag;
		} else {
			return '';
		}
	};
	
	_private.renderHTML = function(bvalue,preview) {
		let replaced = thisBlock.p.replaceVars(bvalue);
		let subbed = _private.replaceShortcodes(replaced);
		
		/* get the html input */
		var str = '<div class="xQhtml-parent">' + subbed + '</div>';

		/* put the html into the preview block, renders automatically */
		preview.innerHTML = str;
		
		return preview;
	};
	
	_private.replaceShortcodes = function(str) {
		let re = /~~~(.*?)~~~/g;
		
		var nstr = str;
		var allmatches = [];
		var matches;
		do {
		    matches = re.exec(str);
		    if (matches) {
			    let parts = matches[1].split(':');
			    let replacer;
			    if(parts.length !== 3 && parts.length !== 2) {
				    replacer = '';
				    thisBlock.p.alerts.log('Invalid Qengine shortcode, must be: ~~~namespace.variable:TYPE[:extra]','error');
			    } else {
				    try {
					    replacer = _private.makeShortcode(parts);
				    } catch(err) {
					    replacer = '';
					    thisBlock.p.alerts.log('Qengine variable not found: ' + matches[1],'error');
				    }
			    }
			    nstr = nstr.replace(matches[0],replacer);
		    }
		} while (matches);
		
		return nstr;
	}
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		var qhtmlpreview = document.createElement('form');
		qhtmlpreview.setAttribute('class','xQhtml-show');
		qhtmlpreview.onsubmit = function(event) {
			event.preventDefault();
			
			let length = this.length;
			for(let i = 0; i < length; i++) {
				let name = this[i].name;
				let value = this[i].value;
				
				let parts = name.split(/\.(.+)/).filter(function(el) {return el.length != 0});
				if(parts.length !== 2) {
					thisBlock.p.alerts.log('Invalid variable: ' + name + ', must be: namespace.variable');
					continue;
				}
				
				let keys = Object.keys(thisBlock.d.variables);
				if(keys.includes(parts[0])) {
					thisBlock.d.variables[parts[0]][parts[1]] = value;
				} else {
					thisBlock.d.variables[parts[0]] = {};
					thisBlock.d.variables[parts[0]][parts[1]] = value;
				}
			}
			
			thisBlock.p.alerts.log('complete','success');
			console.log(thisBlock.d.variables);
			
			return null;
		};

		var qhtmlBlock = document.createElement('textarea');
		qhtmlBlock.setAttribute('class','xQhtml');
		
		var blockNS = document.createElement("input");
		blockNS.setAttribute("type","text");
		blockNS.setAttribute("class","bengine-x-ns-cond col col-50");
		blockNS.setAttribute("placeholder","Block Namespace");
		
		var blockCond = document.createElement("input");
		blockCond.setAttribute("type","text");
		blockCond.setAttribute("class","bengine-x-ns-cond col col-50");
		blockCond.setAttribute("placeholder","Block Conditional (optional)");
		
		if(!thisBlock.p.emptyObject(bcontent)) {
			qhtmlBlock.value = bcontent['content'];
			blockNS.value = bcontent['namespace'];
			blockCond.value = bcontent['conditional'];
		} else {
			qhtmlBlock.innerText = '<p>Place HTML Content Here</p>';
		}

		block.appendChild(qhtmlpreview);
		block.appendChild(blockNS);
		block.appendChild(blockCond);
		block.appendChild(qhtmlBlock);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		var block = document.getElementById(bid).childNodes[3];
		_private.renderHTML(block.value,block.parentNode.childNodes[0]);
	};
	
	this.runBlock = function(bid) {
		var block = document.getElementById(bid).childNodes[3];
		_private.renderHTML(block.value,block.parentNode.childNodes[0]);
	}
	
	this.runData = function(data,iframe,task) {
		if(thisBlock.p.checkConditional(data)) {
			iframe.contentDocument.body.children[0].appendChild(_private.renderHTML(data.content,document.createElement('div')));
		}
		task.done = true;
	};

	this.saveContent = function(bid) {
		var namespace = document.getElementById(bid).children[1].value;
		var conditional = document.getElementById(bid).children[2].value;
		var html = document.getElementById(bid).children[3].value;
		return {'content':html,'namespace':namespace,'conditional':conditional};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
		var qhtmlpreview = document.createElement('div');
		qhtmlpreview.setAttribute('class','xQhtml-show');

		var qhtmlBlock = document.createElement('div');
		qhtmlBlock.setAttribute('class','xQhtml');
		qhtmlBlock.setAttribute('style','display:none;visibility:hidden;');
		qhtmlBlock.innerHTML = bcontent['content'];

		block.appendChild(qhtmlpreview);
		block.appendChild(qhtmlBlock);

		var qhtmlBlock = document.getElementById(bid).childNodes[3];
		_private.renderHTML(qhtmlBlock.value,qhtmlBlock.parentNode.childNodes[0]);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xQhtml {
			display: inline-block;
			width: 100%;
			height: 200px;
			border: 1px solid black;
			background-color: white;

			padding: 8px 6px;
			margin: 0;
			box-sizing: border-box;

			font-family: Lucida Console, Monaco, monospace;
			font-size: 0.8em;
			resize: vertical;
		}

		.xQhtml-show {
			display: flex;
			width: 100%;
			height: auto;
			min-height: 64px;
			border: 1px solid black;
			background-color: white;

			margin: 0px;
			box-sizing: border-box;
			overflow: hidden;
		}
		
		.xQhtml-parent {
			margin: 0px;
			width: 100%;
			height: 100%;
		}`;
		return stylestr;
	};
};
