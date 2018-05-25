Bengine.extensibles.xtext = new function Xtext() {
	this.type = "xtext";
	this.name = "text";
	this.category = "text";
	this.upload = false;
	this.accept = null;

	var thisBlock = this;
	var _private = {};
	
	_private.blocklimit = 4095;
	
	/*
		This function is attached as the event listener to the WYSIWIG block. It detects key presses and calls the corresponding js built in execCommand() function on the block to apply html tags to the text. It's useful to note that iframe.contentDocument is the same as iframe.contentWindow.document.

		iframe - an iframe node
		event - the keydown event that triggers the function
	*/
	_private.detectKey = function(iframe,event) {
		/* set limit */
		// iframe . document . html . body
		if(event.keyCode !== 8 && iframe.contentDocument.children[0].childNodes[1].innerHTML.length > _private.blocklimit) {
			event.preventDefault();
		} else {
			/* p : plain */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 80) {
				iframe.contentDocument.execCommand('removeFormat',false,null);
			}
			/* b : bold */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 66) {
				iframe.contentDocument.execCommand('bold',false,null);
			}
			/* i : italics */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 73) {
				iframe.contentDocument.execCommand('italic',false,null);
			}
			/* h : highlight */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 72) {
				iframe.contentDocument.execCommand('backColor',false,"yellow");
			}
			/* l : list */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 76) {
				iframe.contentDocument.execCommand('insertUnorderedList',false,null);
			}
			/* + : superscript */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 187) {
				iframe.contentDocument.execCommand('superscript',false,null);
			}
			/* - : subscript */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 189) {
				iframe.contentDocument.execCommand('subscript',false,null);
			}
			/* j : justify left */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 74) {
				iframe.contentDocument.execCommand('justifyLeft',false,null);
			}
			/* f : justify full */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 70) {
				iframe.contentDocument.execCommand('justifyFull',false,null);
			}
			/* tab : indent */
			if(event.keyCode === 9) {
				iframe.contentDocument.execCommand('insertHTML',false,'&nbsp;&nbsp;&nbsp;&nbsp;');
			}
			/* a - anchor */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 65) {
				function callback(event,str) {
					if(event) {
						if (str.indexOf("http://") < 0 && str.indexOf("https://") < 0) {
							iframe.contentDocument.execCommand('createLink',false,"http://" + str);
						} else if (str.indexOf("http://") === 0 || str.indexOf("https://") === 0) {
							iframe.contentDocument.execCommand('createLink',false,str);
						} else {
							thisBlock.p.alerts.log("Not A Valid Link!","error");
						}
					} else { /* cancel */ }
				}
				thisBlock.p.alerts.prompt('Enter the link: ',callback,'http://');
			}

			/* Command + letter, works for these, but include for consistency */
			/* x : cut */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 88) {
				iframe.contentDocument.execCommand('cut',false,null);
			}
			/* c : copy */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 67) {
				iframe.contentDocument.execCommand('copy',false,null);
			}
			/* v : paste */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 86) {
				iframe.contentDocument.execCommand('paste',false,null);
			}
			/* z : undo */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 90) {
				iframe.contentDocument.execCommand('undo',false,null);
			}
			/* y : redo */
			if(event.shiftKey && event.ctrlKey && event.keyCode === 89) {
				iframe.contentDocument.execCommand('redo',false,null);
			}

			/// is this necessary ??
			event.stopPropagation();
		}
	};
	
	this.destroy = function() {
		return;
	};

	this.fetchDependencies = function() {
		return null;
	}

	this.insertContent = function(block,bcontent) {
		/* WYSIWIG uses iframe */
		var textBlock = document.createElement("iframe");
		textBlock.setAttribute("class","xTex");

		block.appendChild(textBlock);

		/* have to make a copy to use "this", when setTimout is called, this will refer to window, not block obj */
		var objCopy = this;

		/* iframe has to be put with document first or some bullshit, so wait one millisecond for that to happen and then insert content */
		setTimeout(function() {
			var iframe = block.childNodes[0].contentDocument;
			iframe.open();

			/* create link to css style for iframe content
			var cssLink = document.createElement("link");
			cssLink.href = "http://abaganon.com/css/block.css";
			cssLink.rel = "stylesheet";
			cssLink.type = "text/css";
			iframe.head.appendChild(cssLink); this can be used in show mode,not in edit mode
			*/

			/* defaul text */
			if(thisBlock.p.emptyObject(bcontent)) {
				if(thisBlock.d.options.defaultText) {
					iframe.write("You can turn this default text off on your Profile Page.<br><br>Press&nbsp;<kbd>shift</kbd>&nbsp;and&nbsp;<kbd>ctrl</kbd>&nbsp;with the following keys to style text:<br><br><kbd>p</kbd>&nbsp;plain<br><kbd>b</kbd>&nbsp;<b>bold</b><br><kbd>i</kbd>&nbsp;<i>italics</i><br><kbd>h</kbd>&nbsp;<span style='background-color: yellow;'>highlight</span><br><kbd>+</kbd>&nbsp;<sup>superscript</sup><br><kbd>-</kbd>&nbsp;<sub>subscript</sub><br><kbd>a</kbd>&nbsp;<a href='http://abaganon.com/'>anchor link</a><ul><li><kbd>l</kbd>&nbsp;list</li></ul><kbd>j</kbd>&nbsp;justify left<br><i>For the things we have to learn before we can do them, we learn by doing them</i>. -Aristotle &nbsp;<i>I hear and I forget.&nbsp;I&nbsp;see and I remember. I do and I understand</i>. &nbsp;-? &nbsp;<i>If you want to go fast, go it alone. If you want to go far, go together.&nbsp;</i>-? &nbsp;<i>If you can't explain it simply, you don't understand it well enough.&nbsp;</i>-Einstein &nbsp;<i>Age is an issue of mind over matter. If you don't mind, it doesn't matter.</i>&nbsp;-Twain<br><br><kbd>f</kbd>&nbsp;justify full<div style='text-align: justify;'><i style='text-align: start;'>For the things we have to learn before we can do them, we learn by doing them</i><span style='text-align: start;'>. -Aristotle &nbsp;</span><i style='text-align: start;'>I hear and I forget.&nbsp;I&nbsp;see and I remember. I do and I understand</i><span style='text-align: start;'>. &nbsp;-? &nbsp;</span><i style='text-align: start;'>If you want to go fast, go it alone. If you want to go far, go together.&nbsp;</i><span style='text-align: start;'>-? &nbsp;</span><i style='text-align: start;'>If you can't explain it simply, you don't understand it well enough.&nbsp;</i><span style='text-align: start;'>-Einstein &nbsp;</span><i style='text-align: start;'>Age is an issue of mind over matter. If you don't mind, it doesn't matter.</i><span style='text-align: start;'>&nbsp;-Twain</span>");
				}
			} else {
				iframe.write(bcontent['content']);
			}
			iframe.close();

			var retblock = block.childNodes[0];

			/* attach keyboard shortcuts to iframe */
			if (iframe.addEventListener) {
				iframe.addEventListener("keydown",_private.detectKey.bind(null,retblock),false);
			} else if (iframe.attachEvent) {
				iframe.attachEvent("onkeydown",_private.detectKey.bind(null,retblock));
			} else {
				iframe.onkeydown = _private.detectKey.bind(null,retblock);
			}

			/* set limit on paste */
			iframe.onpaste = function(event) {
				var ptext;
				if (window.clipboardData && window.clipboardData.getData) {
					ptext = window.clipboardData.getData('Text');
				} else if (event.clipboardData && event.clipboardData.getData) {
					ptext = event.clipboardData.getData('text/plain');
				}

				if((this.children[0].childNodes[1].innerHTML.length + ptext.length) > _private.blocklimit) {
					return false;
				} else {
					return true;
				}
			};
		},1);

		return block;
	};

	this.afterDOMinsert = function(bid,data) {
		try {
			/* grab the block iframe that was just made */
			var blocki = document.getElementById(bid).childNodes[0];
			var blockDoc = blocki.contentDocument;
	
			/* make iframe editable */
			blockDoc.designMode = "on";
		} catch(err) {
			// pass
		}
	};
	
	this.runBlock = null;
	this.runData = null;

	this.saveContent = function(bid) {
		/* execCommand() applies style tags to <body> tag inside <iframe>, hence .getElementsByTagName('body')[0] */
		var blockContent = document.getElementById(bid).children[0].contentDocument.getElementsByTagName('body')[0].innerHTML;
		return {'content':blockContent};
	};
	
	this.saveFile = null;

	this.showContent = function(block,bcontent) {
		var textBlock = document.createElement("div");
		textBlock.setAttribute("class","xTex-show");
		textBlock.innerHTML = bcontent['content'];

		block.appendChild(textBlock);

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xTex, .xTex-show {
			display: inline-block;
			overflow-y: auto;

			width: 100%;
			height: auto;
			border: 1px solid black;
			background-color: white;

			padding: 0px;
			margin: 0px;
			box-sizing: border-box;

			font-family: Arial, Helvetica, sans-serif;
			font-size: 1em;
			font-weight: 300;
			color: black;
		}

		.xTex-show {
			padding: 8px;
		}`;
		return stylestr;
	};
};
