function BengineDefaultDisplay(engineID,dataHandlers) {
	_bdd = this;
	
	this.engineID = engineID;
	this.dataHandlers = dataHandlers;
	
	// create save status bar if it doesn't exist
	if(document.getElementById("bengine-display-" + this.engineID) === null) {
		var divDisplay = document.createElement('div');
		divDisplay.id = "bengine-savebar-" + this.engineID;
		divDisplay.className = "bengine-savebar row";
		divDisplay.innerHTML = `
			<div class="row">
				<div class="col col-50">
						<div id="bengine-savestatus-${engineID}" class="bengine-savestatus">Saved</div>
				</div>
				<div class="col col-25">
					<button id="bengine-downloadpage-${engineID}" class="bengine-blockbtn bengine-menubtn" style="font-size:0.83em">&#x2B07</button>
				</div>
				<div class="col col-25">
					<button id="bengine-savepage-${engineID}" class="bengine-blockbtn bengine-menubtn">&#x2713</button>
				</div>
			</div>
			<div class="row">
				<div class="col col-100">
					<progress id="bengine-progressbar-${engineID}" class="bengine-progressbar" value=100 max=100></progress>
				</div>
			</div>
		`;
		var mainDiv = document.getElementById(engineID);
		mainDiv.insertBefore(divDisplay, mainDiv.firstChild);
		
		document.getElementById("bengine-savepage-" + this.engineID).onclick = function() {
			_bdd.dataHandlers.saveBlocks();
			this.blur();
		}
		
		document.getElementById("bengine-downloadpage-" + this.engineID).onclick = function() {
			_bdd.dataHandlers.createFile();
			this.blur();
		}
	}
	
	// add css
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = `
		.bengine-menubtn {
			background-color: white;
		}
		.bengine-menubtn:hover {
			background-color: lightgray;
		}
		.bengine-progressbar {
			border: 1px solid black;
			height: 22px;
			width: 100%;
			
			color: blue;
			background: blue;
		}
		progress.bengine-progressbar {
			color: blue;
		}
		progress.bengine-progressbar::-webkit-progress-value {
			background: blue;
		}
		progress.bengine-progressbar::-moz-progress-bar {
			background: white;
		}
		progress.bengine-progressbar::-webkit-progress-value {
			background: blue;
		}
		progress.bengine-progressbar::-webkit-progress-bar {
			background: white;
		}
		.bengine-savebar {
			background-color: grey;
			box-sizing: border-box;
			color: white;
			display: inline-block;
			height: 54px;
			text-align: center;
			width: 100%;
		}
		.bengine-savestatus {
			border: 1px solid black;
			font: 16px system-ui;
			padding: 6px 12px;
		}
	`;
	document.getElementsByTagName('head')[0].appendChild(style);
}

BengineDefaultDisplay.prototype.progressFinalize = function(msg,max) {
	let progressbar = document.getElementById("bengine-progressbar-" + this.engineID);
	if(progressbar !== null) {
		progressbar.setAttribute("value",max);
	}
	
	let savebar = document.getElementById("bengine-savestatus-" + this.engineID)
	if(savebar !== null) {
		savebar.innerHTML = msg;
	}
};

BengineDefaultDisplay.prototype.progressInitialize = function(msg,max) {
	let progressbar = document.getElementById("bengine-progressbar-" + this.engineID);
	if(progressbar !== null) {
		progressbar.setAttribute("value",0);
		progressbar.setAttribute("max",max);
	}
	
	let statusbar = document.getElementById("bengine-savestatus-" + this.engineID);
	if(statusbar !== null) {
		statusbar.innerHTML = msg;
	}
};

BengineDefaultDisplay.prototype.progressUpdate = function(value) {
	let progressbar = document.getElementById("bengine-progressbar-" + this.engineID);
	if(progressbar !== null) {
		progressbar.setAttribute("value",value);
	}
};

BengineDefaultDisplay.prototype.updateSaveStatus = function(status) {
	document.getElementById("bengine-savestatus-" + this.engineID).innerHTML = status;
}