Bengine.extensibles.mkdwn = new function ShowdownJS() {
  this.type = "mkdwn";
  this.name = "markdown";
  this.category = "text";
  this.upload = false;
  this.accept = null;

  var thisBlock = this; // it's helpful to keep a reference to this object
  var _private = {}; // attach private methods to this

  this.destroy = function(bid) {};

  this.fetchDependencies = function() {
    return [{
      source: 'https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.5/showdown.min.js',
      type: 'application/javascript',
      integrity: null,
      inner: '',
      wait: ''
    }];
  };

  this.insertContent = function(block,content) {
    var xpreview = document.createElement("div");
    xpreview.setAttribute("class","xShowdown-show");

    var xtarea = document.createElement("textarea");
    xtarea.setAttribute("class","xShowdown");

    if(thisBlock.p.emptyObject(content)) {
      xtarea.value = `# Markdown Block

1. <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown Cheat Sheet</a>

Sample | Table
|---|---|
Your | Data
Goes | Here
  `;
    } else {
      xtarea.value = content;
    }

    block.appendChild(xpreview);
    block.appendChild(xtarea);

    return block;
  };

  this.afterDOMinsert = function(bid,data) {  
    var show = document.getElementById(bid).children[0];
    var editor = document.getElementById(bid).children[1];

    var converter = new showdown.Converter({
	    'omitExtraWLInCodeBlocks':true,
	    'tables':true,
	    'emoji':true
    });
    show.innerHTML = converter.makeHtml(editor.value);
  };

  this.runBlock = function(bid) {
    var show = document.getElementById(bid).children[0];
    var editor = document.getElementById(bid).children[1];

    var converter = new showdown.Converter({
	    'omitExtraWLInCodeBlocks':true,
	    'tables':true,
	    'emoji':true
    });
    show.innerHTML = converter.makeHtml(editor.value);
  };

  this.runData = null;

  this.saveContent = function(bid) {
    var textstr = document.getElementById('bengine-a' + bid).children[1].value;
    return textstr;
  };

  this.saveFile = null;

  this.showContent = function(block,content) {
    var xpreview = document.createElement("div");
    xpreview.setAttribute("class","xShowdown-show");

    var xtarea = document.createElement("textarea");
    xtarea.setAttribute("class","xShowdown");
    xtarea.style = "visibility:hidden;display:none";

    try {
      xtarea.value = content['content'];
    } catch(err) {
      console.log(err);
    }

    block.appendChild(xpreview);
    block.appendChild(xtarea);

    return block;
  };

  this.styleBlock = function() {
      var stylestr = `
      .xShowdown {
	      height: 200px;
	  }
	      
      .xShowdown, .xShowdown-show {
        display: block;
        overflow-y: auto;
        width: 100%;
        
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

          resize: none;
      }

      .xShowdown-show {
        padding: 8px;
        height: 300px;
      }
      `;

      return stylestr;
  };
};