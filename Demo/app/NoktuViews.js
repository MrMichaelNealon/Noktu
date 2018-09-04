///////////////////////////////////////////////////////////
// NoktuViews.js
//
// As you'd expect, builds and maintains the player
// interface.
//
// Has a direct reference to the model for quick access
// to config, playlist, etc.
//
// M. Nealon, 2018.
//


var	NoktuViews = function(model) {

	this.model = model;
	
	
///////////////////////////////////////////////////////////
//	Calls both refreshActons() and refreshControls()
//	methods.
//
	this.refreshActions = function() {
		this.refreshActions();
		this.refreshControls();
	};
	
///////////////////////////////////////////////////////////
//	Controls are basically the prev, play, stop, next and
//	pause buttons.
//
//	All this really does is make sure the "play" button
//	is shown if the player is in a state of NOKTU_STOPPED
//	or NOKTU_PAUSED and that the "pause" button is shown
//	when in a state of NOKTU_PLAYING.
//
	this.refreshControls = function() {
		var	cfg = this.model.config;
		
		if (this.model.currentState == NOKTU_PLAYING) {
			$("#" + cfg.control[1].elementId).attr({
				"src": cfg.control[4].src,
				"title": cfg.control[4].title
			});
		}
		else {
			$("#" + cfg.control[1].elementId).attr({
				"src": cfg.control[1].src,
				"title": cfg.control[1].title
			});
		}
	};
	
///////////////////////////////////////////////////////////
//	Actions are the 3 options that we can enabled/disable
//	with a mouse click - they're booleans defined n the
//	model as:
//
//		playerActions[NOKTU_REPEAT]
//		playerActions[NOKTU_LOOP]
//		playerActions[NOKTU_RANDOM]
//
//	This method just ensures that the icon being displayed
//	reflects the state (enabled/disabled) of that option.
//
	this.refreshActions = function() {
		var	cfg = this.model.config;
		
		for (var a = 0; a < this.model.playerActions.length; a++) {
			if (this.model.playerActions[a]) {
				if (cfg.actions.hasOwnProperty("mouseover"))
					$("#" + cfg.action[a].elementId).css(cfg.actions.selected.style);
			}
			else {
				if (cfg.actions.hasOwnProperty("deselected"))
				$("#" + cfg.action[a].elementId).css(cfg.actions.deselected.style);
			}
		}
	};
	
///////////////////////////////////////////////////////////
//	Updates the playlist to reflect the current state
//	of the player. For example, if no tracks are playing
//	then no tracks in the playlist should be highlighted.
//
	this.refreshPlaylist = function() {
		var	cfg = this.model.config;
		
		$("." + cfg.track.trackReference).css(
			cfg.track.deselected.style
		);
		
		if (this.model.currentTrack > -1) {
			var	t = this.model.currentTrack;
			$("#" + cfg.track.trackIdPrefix + t.toString() + " > div").css(
				cfg.track.selected.style
			);
		}
	};
	
///////////////////////////////////////////////////////////
//	This should be called when the player is first
//	created (the getInterface() method will call this
//	automatically).
//
//	It also must be called any time the display dimensions
//	change (resize) which is taken care of at the bottom
//	of this class (constructor code).
//
	this.refreshInterface = function() {
		var	cfg = this.model.config;
	
		// Get the dimensions of the player - we need these
		// to figure out how big the playlist area will be,
		// etc.
		var	playerWidth = parseInt($("#" + cfg.player.elementId).css("width").replace('px', ''));
		var	playerHeight = parseInt($("#" + cfg.player.elementId).css("height").replace('px', ''));
		
		var	playlistHeight = (playerHeight - (cfg.header.height + cfg.actions.height + cfg.controls.height));
		var	playlistInnerHeight = (playlistHeight - 12);
		var	actionsTop = (cfg.header.height + playlistHeight);
		var	seekerWidth = (playerWidth - ((cfg.actions.height * 3) + 36));
		var	controlsTop = (actionsTop + cfg.actions.height);
	
		// All pretty boring - just setting the positions
		// and heights of player elements based on the
		// above values.
		$("#" + cfg.header.elementId).css({
			"top": "0px", "height": cfg.header.height.toString() + "px"
		});
		$("#" + cfg.playlist.elementId).css({
			"top": cfg.header.height.toString() + "px", "height": playlistHeight.toString() + "px"
		});
		$("#" + cfg.playlist.elementId + "-inner").css({
			"height": playlistInnerHeight.toString() + "px"
		});
		$("#" + cfg.actions.elementId).css({
			"top": actionsTop.toString() + "px", "height": cfg.actions.height.toString() + "px"
		});
		$("#" + cfg.seeker.elementId).css({
			"width": seekerWidth.toString() + "px"
		});
		$("#" + cfg.controls.elementId).css({
			"top": controlsTop.toString() + "px", "height": cfg.controls.height.toString() + "px"
		});
		
		if (this.model.currentState == NOKTU_STOPPED)
			$("#" + cfg.header.elementId).html(NOKTU_HEADER);
		
		this.refreshActions();
		this.refreshControls();
	};
	
///////////////////////////////////////////////////////////
//	Will create a bunch of buttons.
//
//	We have two types of button - thee are controls (the
//	prev, play, stop, next and pause buttons) and the
//	actions (the repeat, loop and random actions).
//
//	Will assume controls by default untill the buttonType
//	specified "actions"
//
	this.getButtons = function(buttonType) {
		var	cfg = this.model.config;
		
		// Assume controls.
		var	btnEl = $("#" + cfg.controls.elementId);
		var	btnClass = cfg.controls.controlClass;
		var	btnArray = cfg.control;
		
		if (buttonType == "action") {
			// Assumption wrong!
			btnEl = $("#" + cfg.actions.elementId);
			btnClass = cfg.actions.actionClass;
			btnArray = cfg.action;
		}
		
		// Create the buttons.
		for (var btn = 0; btn < btnArray.length; btn++) {
			if (buttonType == "control" && btnArray[btn].action == "Pause")
				continue;
			
			btnEl.append('\
				<img \
					id="' + btnArray[btn].elementId + '" \
					class="' + btnClass + '" \
					src="' + btnArray[btn].src + '" \
					title="' + btnArray[btn].title + '"\
				/>\
			');
		}
	};
	
///////////////////////////////////////////////////////////
//	Enables mouse events for action buttons.
//
	this.enableActions = function() {
		var	cfg = this.model.config;
		
		if (cfg.actions.hasOwnProperty("mouseover")) {
			$("." + cfg.actions.referenceClass).on("mouseover", function() {
				var	action = $(this).index();
				if (objThis.model.playerActions[action])
					return false;
				$(this).animate(
					cfg.actions.mouseover.style,
					cfg.actions.mouseover.duration,
					cfg.actions.mouseover.easing
				);
			});
		}

		if (cfg.actions.hasOwnProperty("deselected")) {
			$("." + cfg.actions.referenceClass).on("mouseout", function() {
				var	action = $(this).index();	
				if (objThis.model.playerActions[action])
					return false;
				$(this).stop().animate(
					cfg.actions.deselected.style,
					cfg.actions.deselected.duration,
					cfg.actions.deselected.easing
				);
			});
		}
		
		$("." + cfg.actions.referenceClass).on("click", function() {
			var	action = $(this).index();
			if (objThis.model.playerActions[action]) {
				if (cfg.actions.hasOwnProperty("deselected")) 
					$(this).css(cfg.actions.deselected.style);
				objThis.model.playerActions[action] = false;
			}
			else {
				if (cfg.actions.hasOwnProperty("mouseover"))
					$(this).css(cfg.actions.selected.style);
				objThis.model.playerActions[action] = true;
			}
		});
	};
	
///////////////////////////////////////////////////////////
//	Enables moue events for control buttons.
//
	this.enableControls = function() {
		var	cfg = this.model.config;
		
		$("." + cfg.controls.referenceClass).on("mouseover", function() {
			$(this).animate(
				cfg.controls.mouseover.style,
				cfg.controls.mouseover.duration,
				cfg.controls.mouseover.easing
			);
		});
		$("." + cfg.controls.referenceClass).on("mouseout", function() {
			$(this).stop().animate(
				cfg.controls.deselected.style,
				cfg.controls.deselected.duration,
				cfg.controls.deselected.easing
			);
		});
		$("." + cfg.controls.referenceClass).on("click", function() {
			var	action = $(this).index();
			
			if (action == 0)
				objThis.model.prev();
			else if (action == 1) {
				if (objThis.model.currentState == NOKTU_STOPPED)
					objThis.model.play(0);
				else if (objThis.model.currentState == NOKTU_PAUSED)
					objThis.model.resume();
				else
					objThis.model.pause();
			}
			else if (action == 2)
				objThis.model.stop();
			else
				objThis.model.next();
			
			objThis.refreshPlaylist();
			objThis.refreshInterface();
		});
	};
	
///////////////////////////////////////////////////////////
//	Returns the value of the seeker range element.
//
	this.getSeekerValue = function() {
		return $("#" + this.model.config.seeker.elementId).val()
	};
	
///////////////////////////////////////////////////////////
//	Creates the seeker eleemnt in the actions element.
//
	this.getSeekerControl = function() {
		var	cfg = this.model.config;
		
		$("#" + cfg.actions.elementId).append('\
			<input \
				id="' + cfg.seeker.elementId + '" \
				class="' + cfg.seeker.elementClass + '" \
				type="range" min="0" max="1000" \
				value="0"\
			></input>\
		');
		
		$("#" + cfg.actions.elementId).on("change", function() {
			objThis.model.adjustSeeker(objThis.getSeekerValue());
		});
	};
	
///////////////////////////////////////////////////////////
//	Creates the colume control in the controls element.
//
	this.getVolumeControl = function() {
		var	cfg = this.model.config;
		
		$("#" + cfg.controls.elementId).append('\
			<input \
				id="' + cfg.volume.elementId + '" \
				class="' + cfg.volume.elementClass + '" \
				type="range" min="0" max="10" \
				value="' + (this.model.playerVolume * 10).toString() + '"\
			></input>\
		');
		
		$("#" + cfg.controls.elementId).on("change", function() {
			objThis.model.adjustVolume($("#" + cfg.volume.elementId).val() / 10);
		});
	};
	
///////////////////////////////////////////////////////////
//	Returns the player base elements (header, playlist,
//	actions, controls).
//
	this.getElement = function(element) {
		var	cfg = this.model.config;
		
		if (element == "playlist") {
			// The playlist element contains an inner
			// element.
			return '\
				<div \
					id="' + cfg[element].elementId + '" \
					class="' + cfg[element].elementClass + '"\
				><div \
						id="' + cfg[element].elementId + '-inner" \
						class="' + cfg[element].elementId + '-inner"\
					>&nbsp;</div>\
				</div>';
		}
		else {
			return '\
				<div \
					id="' + cfg[element].elementId + '" \
					class="' + cfg[element].elementClass + '"\
				></div>';
		}
	};
	
///////////////////////////////////////////////////////////
//	Creates the base header element.
//
	this.getHeader = function() {
		var	cfg = this.model.config;
		
		if (this.model.playerState == NOKTU_STOPPED) {
			$("#" + cfg.header.elementId).html(NOKTU_HEADER);
		}
	};
	
///////////////////////////////////////////////////////////
//	Builds the player interface and initialises the
//	playlist, actions and controls.
//
	this.getInterface = function() {
		var	cfg = this.model.config;
	
		// Create the base player element - all other
		// player elements go inside this.
		$("#" + cfg.parentId).html('\
			<div \
				id="' + cfg.player.elementId + '" \
				class="' + cfg.player.elementClass + '"\
			></div>');
		
		var	playerEl = $("#" + cfg.player.elementId);
		
		// Use the getElement() method to create the
		// base player elements.
		playerEl.html(this.getElement("header"));
		playerEl.append(this.getElement("playlist"));
		playerEl.append(this.getElement("actions"));
		playerEl.append(this.getElement("controls"));
		
		// Get and enable all actions/controls
		this.getButtons("action");
		this.enableActions();
		
		this.getButtons("control");
		this.enableControls();
		
		this.getHeader();
		
		this.getVolumeControl();
		this.getSeekerControl();
	
		this.refreshInterface();
	};
	
///////////////////////////////////////////////////////////
//	So each track in the playlist is made up of a bunch
//	of smaller child elements. This method returns those
//	child elements.
//
//	The elementName parameter is the element Id suffix for
//	a particular element type - for example if elementName
//	is "-length" then we're referring to the track length
//	field.
//
	this.getTrackElement = function(track, trackNo, elementName, elementData) {
		var	cfg = this.model.config;
		
		return '\
			<div \
				id="' + cfg.track.trackIdPrefix + trackNo.toString() + elementName + '"\
				class="' + cfg.track.elementClass + ' ' + cfg.track.elementClass + elementName + '" \
			>' + elementData + '\
			</div>\
		';
	}
	
///////////////////////////////////////////////////////////
//	Returns the HTML to show a single track in the
//	playlist.
//
	this.getTrack = function(trackNo, track) {
		var	cfg = this.model.config;
		var	trackNoPrefix = "0";
		
		var	outputString;
		
		if (trackNo >= 9)
			trackNoPrefix = "";
		
		outputString = this.getTrackElement(track, trackNo, "-no", trackNoPrefix + (trackNo + 1).toString());
		outputString += this.getTrackElement(track, trackNo, "-artist", track.artist);
		outputString += this.getTrackElement(track, trackNo, "-name", track.name);
		outputString += this.getTrackElement(track, trackNo, "-elapsed", "&nbsp;");
		outputString += this.getTrackElement(track, trackNo, "-length", objThis.model.getTrackLength(trackNo, track));
		
		return outputString;
	};
	
///////////////////////////////////////////////////////////
//	As well as passing the objPlaylist to the model, this
//	method will render the playlist display.
//
	this.loadPlaylist = function(objPlaylist) {
		this.model.objPlaylist = objPlaylist;
		
		var	cfg = this.model.config;
		var	innerEl = $("#" + cfg.playlist.elementId + "-inner");
		
		innerEl.html("");
		
		// We beuild each individual track element in the
		// playlist...
		//
		// Yes we all noktu!
		for (var t = 0; t < objPlaylist.tracks.length; t++) {
			innerEl.append('\
				<div \
					id="' + cfg.track.trackIdPrefix + t.toString() + '" \
					class="' + cfg.track.elementClass + ' yesweallnoktu"\
				></div>\
			');
			var	trackEl = $("#" + cfg.track.trackIdPrefix + t.toString());
			
			// Then we populate that individual track element
			// with child elements. We're breaking each track
			// down into columns of fields:
			//
			//	Field 0			1		2			4				5
			//	Track number	Artist	Track name	Elapsed time	Length
			//
			trackEl.append(this.getTrack(t, objPlaylist.tracks[t]));
		}
		
		// Yes, we all noktu!
		$("." + "yesweallnoktu").on("click", function() {
			objThis.updateSeeker(0);
			objThis.model.currentTrack = $(this).index();
			objThis.model.play($(this).index());
			objThis.refreshControls();
			objThis.refreshPlaylist();
		});
	};
	
///////////////////////////////////////////////////////////
//	Updates the track length field for a particular
//	track.
//
	this.updateTrackLength = function(duration, trackNo) {
		var	cfg = this.model.config;
		
		$("#" + cfg.track.trackIdPrefix + trackNo.toString() + "-length").html('\
			' + this.model.trackLengthToString(duration) + '\
		');
	};
	
///////////////////////////////////////////////////////////
//	Updates the remaining time for a particular track,
//	confusing that we're updating the "-elapsed" field,
//	this was the original intention, to show how long a
//	track had been playing...but that changed and I liked
//	the idea of showing how long a track had left, instead.
//
//	These things happen...
//
	this.updateRemainingTime = function(remaining, trackNo) {
		var	cfg = this.model.config;
		
		$("#" + cfg.track.trackIdPrefix + trackNo.toString() + "-elapsed").html('\
			' + this.model.trackLengthToString(remaining) + '\
		');
	};
	
///////////////////////////////////////////////////////////
//	Clear the elapsed time (!) fields for ALL tracks.
//
	this.clearElapsedTime = function() {
		$(".noktu-track-elapsed").html("");
	};
	
///////////////////////////////////////////////////////////
//	This is for when the model wants to update the
//	value of the seeker range element.
//
	this.updateSeeker = function(val) {
		$("#" + this.model.config.seeker.elementId).val(val);
	};
	
///////////////////////////////////////////////////////////
//	This is for when the model wants to reset the
//	value of the seeker range element.
//
	this.resetSeeker = function() {
		this.updateSeeker(0);
	};

///////////////////////////////////////////////////////////
//	This is for when the model wants to acqiore
//	information about a particular track.
//
//	It builds the marquee string that is displayed in the
//	header when a track is playing.
//
//	The marquee is made up of a format string where:
//
//		%t expands to current track number
//		%a expands to the artists name
//		%n expands to the track name
//		%l expands to the track link propert
//
//	These values are defined in the playlist (see the
//	../objects/objNoktuPlaylist.js file for an example)
//
	this.getTrackInfo = function() {
		var	cfg = this.model.config;
		
		var	trackNo = this.model.currentTrack;
		var	track = this.model.objPlaylist.tracks[trackNo];
		
		var	outputString = "";
		
		if (cfg.hasOwnProperty("marquisFmt"))
			var	fmtString = cfg.marquisFmt;
		else
			var	fmtString = this.model.marquisFmt;
		
		if (trackNo < 9)
			trackNo = "0" + (trackNo + 1).toString();
		else
			trackNo = trackNo.toString();
		
		for (var b = 0; b < fmtString.length; b++) {
			// Look for format identifiers...
			if (fmtString.substr(b, 1) == "%") {
				var	modifier = fmtString.substr((b + 1), 1);
				
				if (modifier == "t")
					outputString += trackNo;
				else if (modifier == "n")
					outputString += track.name;
				else if (modifier == "a")
					outputString += track.artist;
				else if (modifier == "l")
					outputString += track.link;
				else {
					// Doesn't match any format specifier
					// so we just add the initial % to the
					// output string.
					outputString += "%";
					continue;
				}
				
				b++;
			}
			else
				outputString += fmtString.substr(b, 1);
		}
		
		return outputString;
	};
	
	
///////////////////////////////////////////////////////////
//	Constructor code.
//
//	Nothing much - we call the getInterface() method to
//	build the player and make sure the refreshInterface()
//	method is being called on resize.
//
	var	objThis = this;
	
	this.getInterface();
	
	$(window).on("resize", function() {
		objThis.refreshInterface();
	});
	
};

