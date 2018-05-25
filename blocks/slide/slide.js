Bengine.extensibles.slide = new function Slide() {
	this.type = "slide";
	this.name = "slide";
	this.category = "media";
	this.upload = true;
	this.accept = ".pdf,.ppt,.pptx,.pps,.ppsx";

	var thisBlock = this;
	var _private = {
    	files:{}
	};
	
	_private.pdfObjects = {};
	
	_private.renderPDF = function(pdfDoc,pageNum,canvas) {
		/*
			pdfDoc - pdf object from pdfObject global array
			pageNum - pdf page to render, found in data-page attribute of <canvas>
			canvas - the <canvas> tag to render pdf page to
		*/

		/// I have no idea what scale does, but it's needed
		var scale = 0.8;

		/* call pdfDoc object's getPage function to get desired page to render */
		pdfDoc.getPage(pageNum).then(function(page) {

			/* define <canvas> attributes */
			var viewport = page.getViewport(scale);
			canvas.height = viewport.height;
			canvas.width = viewport.width;

			/* define more <canvas> attributes for render() function */
			var renderContext = {
				canvasContext: canvas.getContext('2d'),
				viewport: viewport
			};

			/* finally, render the pdf page to canvas */
			var renderTask = page.render(renderContext);

			renderTask.promise.then(function() {
				/// update stuff here, page has been rendered
			});
		});
	};
	
	_private.pageTurn = function(event) {
    	// click event - ((viewport width - pdf width) / 2) <- margin from pdf to left side of browser
    	var X = event.pageX - ((window.innerWidth - this.clientWidth) / 2);

		/* get the <canvas> tag, current page, pdf url/id, and the pdf total page count */
		var canvas = this.childNodes[0];
		var pageNum = canvas.getAttribute("data-page");
		var pdfID = canvas.getAttribute("id");
		var pageCount = _private.pdfObjects[pdfID].numPages;

		/* determine whether left or right side was clicked, then render prev or next page */
		if(X > this.clientWidth / 2) {
			if(pageNum < pageCount) {
				pageNum++;
				canvas.setAttribute("data-page",pageNum);
				_private.renderPDF(_private.pdfObjects[pdfID],pageNum,canvas);
			}
		} else {
			if(pageNum > 1) {
				pageNum--;
				canvas.setAttribute("data-page",pageNum);
				_private.renderPDF(_private.pdfObjects[pdfID],pageNum,canvas);
			}
		}
	};
	
	this.destroy = function() {
		return;
	};
	
	this.fetchDependencies = function() {
		var pdfjs = {
			inner: '',
			integrity: '',
			source: 'https://mozilla.github.io/pdf.js/build/pdf.js',
			type: 'text/javascript',
			wait: 'pdfjsLib'
		};
		
		return [pdfjs];
	}

	this.insertContent = function(block,bcontent) {
		/* data-page attribute keeps track of which page is being displayed */
		var canvas = document.createElement("canvas");
		canvas.setAttribute("class","xSli");
		canvas.setAttribute("id",content);
		canvas.setAttribute("data-page","1");
		canvas.setAttribute("data-sid", thisBlock.p.createUUID());

		block.appendChild(canvas);

		/* if block was just made, don't try to load pdf */
		if (!thisBlock.p.emptyObject(bcontent)) {
			pdfjsLib.getDocument(bcontent['content']).then(function(pdfObj) {
				_private.pdfObjects[bcontent['content']] = pdfObj;

				var tag = block.childNodes[0];

				_private.renderPDF(pdfObj,1,tag);
			});
		}

		/* event listener for changing slides left & right */
		block.onmouseup = _private.pageTurn;

		return block;
	};

	this.afterDOMinsert = function(bid,url,data) {
		var objCopy = this;
		
		if(url !== null) {        	
        	url = window.location.origin + url;
        	
        	var xhr = new XMLHttpRequest();
            xhr.open('GET',url);
            xhr.responseType = 'arraybuffer';
			xhr.onload = function(e) {
    			var canvas = document.getElementById(bid).childNodes[0];
				var sid = canvas.getAttribute('data-sid');
				var urlParts = url.split('/');
				_private.files[sid] = new File([e.target.response], urlParts[urlParts.length-1], {type: "application/pdf"});
            };
            xhr.send();
    		
			/* add the pdf to the pdfObjects array and render the first page */
			pdfjsLib.getDocument(url).then(function(pdfObj) {

				_private.pdfObjects[url] = pdfObj;

				var slidetag = document.getElementById(bid).childNodes[0];
				slidetag.setAttribute("id",url);

				_private.renderPDF(pdfObj,1,slidetag);
			});
		}
	};
	
	this.runBlock = null;
	this.runData = null;

	this.saveContent = function(bid) {
		/* replace() is for escaping backslashes and making relative path */
		var slidestr = document.getElementById(bid).children[0].id;
		return {'content':slidestr.replace(location.href.substring(0,location.href.lastIndexOf('/') + 1),"")};
	};
	
	this.saveFile = function(bid) {
		return _private.files[document.getElementById(bid).children[0].getAttribute('data-sid')];
	};

	this.showContent = function(block,bcontent) {		
		/* data-page attribute keeps track of which page is being displayed */
		var canvas = document.createElement("canvas");
		canvas.setAttribute("class","xSli-show");
		canvas.setAttribute("id",bcontent['content']);
		canvas.setAttribute("data-page","1");

		block.appendChild(canvas);

		/* if block was just made, don't try to load pdf */
		if (bcontent !== "") {
			pdfjsLib.getDocument(content).then(function(pdfObj) {
				_private.pdfObjects[content] = pdfObj;

				var tag = block.childNodes[0];

				_private.renderPDF(pdfObj,1,tag);
			});
		}

		/* event listener for changing slides left & right */
		block.onmouseup = _private.pageTurn;

		return block;
	};

	this.styleBlock = function() {
		var stylestr = `.xSli, .xSli-show {
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
