///////////////////////////////////////////////////////////
// NoktuModel.js
//
// The main concern of the model is handling the tracks
// themselves as well as the configuration of the player.
//
// The modle figures out what tracks to play next, are
// we on repeat? Is a truck playing? How long has it been
// playing for?
//
// It's basically a data-store with simple functionality
// for playing, pausing, skipping and stopping tracks.
//
// Since it does a lot of work in finding out track
// info like length and duration, a direct handle to the
// controller is given t the model so that it can call
// on the view to update and refresh elements of the
// display - other than that it's pretty simple.
//
// M. Nealon, 2018.
//


// Current states = self explanitory.
//
const	NOKTU_STOPPED = 0;
const	NOKTU_PLAYING = 1;
const	NOKTU_PAUSED = 2;


// The model has one member:
//
//		playerActions = [];
//
// Which is nothing more than an array of 3 booleans.
//
// These boolean values specify whether a particular option
// is enabled or disabled, for example:
//
//		if (playerActions[NOKTU_REPEAT] == true)
//			// The current track is being repeater
//		if (playerActions[NUKTU_LOOP] == true)
//			// Loop back to track 1 when the last track ends
//		if (playerActions[NOKTU_RANDOM] == true)
//			// Playing random tracks
//
const	NOKTU_REPEAT = 0;
const	NOKTU_LOOP = 1;
const	NOKTU_RANDOM = 2;


// When nothing is playing this string is displayed
// in the player header.
//
const	NOKTU_HEADER = "<b>Noktu</b> Audio Player";


var	NoktuModel = function(noktuConfig, objCtr) {

	// That handle to the controller.
	//
	this.objCtr = objCtr;
	
	// The configuration object - see ../objects/objNoktuConfig
	// for an example.
	//
	// This is important, because it specifies the CSS classes
	// and ID's that will make up each element of the player.
	//
	this.config = noktuConfig;

	// These were described above where the NOKTU_REPEAT (0),
	// NOKTU_LOOP (1) and NOKTU_RANDOM (2) values were defined.
	//
	// By default the only option that's enabled is the
	// NUKTU_LOOP option.
	//
	this.playerActions = [
		false, true, false
	];
	
	this.currentState = NOKTU_STOPPED;
	this.currentTrack = -1;
	
	// This will be populated by the getTrackLength()
	// method.
	//
	this.trackLength = [];
	
	this.playerVolume = 0.99;
	
	this.objPlaylist;
	
	// This is the audio object used to play all tracks.
	//
	this.audio = null;

	// The ticker is just a simple little timer that will
	// keep track of how ong a particular track has been
	// playing.
	//
	this.ticker = 0;
	this.tickerTimeout = null;
	this.seekerTimeout = null;
	
	// Heh - see the DeSade.js abomination for more info.
	//
	this.marquis;
	this.marquisFmt = "Now playing track %t -- <b>%n</b> by <b>%a</b>";
	
	// Self reference.
	var	objThis = this;


///////////////////////////////////////////////////////////
//	What we get when we grab that handy audio.duration
//	is a weird floating point number that needs to be
//	translated into minutes and seconds.
//
//	This method does that for us, given the duration of
//	a track it will return a "MM:SS" format string.
//
//	It'll even add leading 0's to values < 10!
//
	this.trackLengthToString = function(duration) {
		var minutes = Math.floor(duration / 60);
		var seconds = Math.floor(duration - minutes * 60);

		if (minutes < 10) minutes = "0" + minutes.toString();
		else if (isNaN(minutes)) minutes = "";
		else minutes = minutes.toString();
		
		if (seconds < 10) seconds = "0" + seconds.toString();
		else if (isNaN(seconds)) seconds = "";
		else seconds = seconds.toString();
		
		return minutes + ":" + seconds;
	};
	
///////////////////////////////////////////////////////////
//	Loading the audio track alone doesn't tell us the
//	length of the track, no - we need to wait on some
//	guy called "loadedmetadata" to get his finger out
//	and provide us with that info.
//
//	So this function will wait for "loadedmetadata" to
//	do his/her bit before asking the view to update the
//	track length
//
	this.getTrackLength = function(trackNo, track) {
		var	audio = new Audio(track.path);	
		audio.addEventListener("loadedmetadata", function() {
			// Set the track length locally in the
			// trackLength[] array - that might be useful
			// later...
			objThis.trackLength[trackNo] = this.duration;
			// We don't really invoke the view directly,
			// no - we ask the controller to do it for us.
			// but it amounts to the same thing.
			objCtr.updateTrackLength(this.duration, trackNo);
		});
	};
	
///////////////////////////////////////////////////////////
//	The seeker is the range element that allows you to
//	change the current time/position of the track that's
//	currently playing.
//
//	The view will call this method any time the seeker is
//	adjusted by the user, the view is passing the value
//	of the range element (seeker) which we use to figure
//	out where to skip the audio to based on that.
//
	this.adjustSeeker = function(seeker) {
		if (this.audio == null)
			return;
	
		// See the seeker range element increments in
		// slices of 1,000...
		//
		this.audio.currentTime = ((this.audio.duration / 1000) * seeker);
	};
	
///////////////////////////////////////////////////////////
//	Enough said, really.
//
	this.adjustVolume = function(volume) {
		this.playerVolume = volume;
		
		if (this.audio == null)
			return;
		
		this.audio.volume = this.playerVolume;
	};
	
///////////////////////////////////////////////////////////
//	Turns out stopping a track involes a little more than
//	just calling this.audio.pause()...
//
	this.stop = function() {
		// Ask the controller to ask the view to clear
		// elapsed time...please.
		this.objCtr.clearElapsedTime();
		
		// Reset the seeker position to 0.
		this.objCtr.updateSeeker(0);
		
		// Is there even any audio playing?
		if (this.audio != null) {
			this.audio.pause();
			this.audio = null;
		}
		
		// We set the current track to -1 because we've
		// STOPPED!
		//
		this.currentTrack = -1;
		this.currentState = NOKTU_STOPPED;
		
		// Kill any running marquees (see DeSade.js).
		if (this.marquis != null) {
			this.marquis.stop();
			this.marquis = null;
		}
		
		// Kill any running tickers.
		if (this.tickerTimeout != null) {
			clearTimeout(this.tickerTimeout);
			this.tickerTimeout = null;
			this.ticker = 0;
		}
		
		// The seeker is essentially animated while a
		// track is playing, we need to kill that animation.
		if (this.seekerTimeout != null) {
			clearTimeout(this.seekerTimeout);
			this.seekerTimeout = null;
		}
	};
	
///////////////////////////////////////////////////////////
//	This basically figures out what track is to be played,
//	the play function will call this before trying to
//	load and play a track.
//
//	If the NOKTU_RANDOM option is enabled then we simply
//	get a random track number and play that.
//
//	If not, we play trackNo (if trackNo < 0 it defaults
//	to 0)
//
	this.setTrack = function(trackNo) {
		if (! this.playerActions[NOKTU_REPEAT] && this.playerActions[NOKTU_RANDOM]) {
			// Play a random track.
			//
			var	rand;
			var	tracks = this.objPlaylist.tracks.length;
				
			if (this.objPlaylist.tracks.length > 1) {
				// Loops until a random track value is found.
				//
				while (true) {
					rand = Math.floor(Math.random() * tracks);
					if (rand != this.currentTrack)
						break;
				}
				this.currentTrack = rand;
			} else 
				this.currentTrack = 0;
		}
		else {
			if (trackNo < 0)
				this.currentTrack = 0;
			else
				this.currentTrack = trackNo;
		}
	};

///////////////////////////////////////////////////////////
//	The play function.
//
	this.play = function(trackNo) {
		this.stop();
	
		// The setTrack will decide what the eventual value
		// of this.currentTrack will be.
		//
		this.setTrack(trackNo);
		
		this.audio = new Audio(this.objPlaylist.tracks[this.currentTrack].path);
		this.audio.volume = this.playerVolume;
		this.audio.type = this.objPlaylist.tracks[this.currentTrack].type;
		
		// Initialise the new marquee string - see DeSade.js
		// for more info.
		//
		this.marquis = new DeSade(this.config.header.elementId, "mds");
		this.marquis.newMarquis(objCtr.getTrackInfo(), 15000);
		
		// Get the current seeker poition from the view via
		// the controller.
		var	seeker = this.objCtr.getSeekerValue();
		
		// Adjust the current track time accordingly...
		if (this.seeker > 0)
			this.audio.currentTime = ((this.trackLength[this.currentTrack] / 1000) * seeker);
		
		this.audio.play();
		
		// Initialise the ticker and seeker. see initTicker()
		// and initSeeker() for more.
		this.ticker = 0;
		this.initTicker();
		this.initSeeker();
		
		this.currentState = NOKTU_PLAYING;
		
		// Listen for and handle track ending.
		this.audio.addEventListener("ended", function() {
			objThis.trackEnd();
		});
	};
	
///////////////////////////////////////////////////////////
//	What happens when a track ends? Do we stop? Skip to
//	the next track? Repeat?
//
//	This method will decide.
//
	this.trackEnd = function() {
		objCtr.resetSeeker();
		
		// Kill the ticker timer.
		if (objThis.tickerTimeout != null) {
			objThis.tickerTimeout = null;
			objThis.ticker = 0;
		}
		
		if (objThis.playerActions[NOKTU_REPEAT])
			// Repeat current track - easy.
			objThis.play(objThis.currentTrack);
		else {
			// Not on repeat - we have a few options
			// here.
			//
			// If the track that just ended was the last
			// track in the playlist, do we loop or
			// stop?
			if ((objThis.currentTrack + 1) >= objThis.objPlaylist.tracks.length) {
				// Last track...loop or stop?
				if (objThis.playerActions[NOKTU_LOOP])
					// Loop - simply play track 0
					objThis.play(0);
				else 
					// Stop!
					objThis.stop();
			}
			else 
				// We didn't just play the last track in
				// the playlist, so we advance to the next
				// and play that.
				objThis.play(objThis.currentTrack + 1);
		}
	};

///////////////////////////////////////////////////////////
//	Handles the pausing of the tracks.
//
	this.pause = function() {
		if (this.audio == null)
			return false;
		
		this.audio.pause();
		this.currentState = NOKTU_PAUSED;
	};

///////////////////////////////////////////////////////////
//	Handles the resuming of paused tracks.
//
	this.resume = function() {
		if (this.currentTrack < 0)
			this.currentTrack = 0;
		
		if (this.audio == null)
			return false;
		
		this.audio.play();
		this.currentState = NOKTU_PLAYING;
	};
	
///////////////////////////////////////////////////////////
//	The view invokes this method when the "previous"
//	control button is clicked.
//
	this.prev = function() {
		// reset the seker for the new track.
		this.objCtr.updateSeeker(0);
		
		// If currentTrack < 0 then we're currently in a
		// state of NOKTU_STOPPED, therefore clicking prev
		// selects the last track in the playlist by default.
		//
		if (this.currentTrack < 0)
			this.currentTrack = (this.objPlaylist.tracks.length - 1);
		
		// don't adjust currentTrack is repeat is enabled.
		if (! this.playerActions[NOKTU_REPEAT]) {
			if (this.currentTrack <= 0)
				this.currentTrack = (this.objPlaylist.tracks.length - 1);
			else
				this.currentTrack--;
		}
		
		this.play(this.currentTrack);
	};
	
///////////////////////////////////////////////////////////
//	An inversion of the prev() method.
//
	this.next = function() {
		// reset seeker for next track.
		this.objCtr.updateSeeker(0);
		
		if (! this.playerActions[NOKTU_REPEAT]) {
			if ((this.currentTrack + 1) >= this.objPlaylist.tracks.length)
				this.currentTrack = 0;
			else
				this.currentTrack++;
		}
	
		this.play(this.currentTrack);
	};
	
///////////////////////////////////////////////////////////
//	This little tick-tocker is used to update the
//	remaining time of the track that's currently playing.
//
	this.initTicker = function() {
		if (this.audio == null)
			return false;
		
		var cfg = this.config;
		var	track = this.currentTrack;
		
		// Figure out the time a track has left to play.
		//
		var duration = this.audio.duration;
		var	elapsed = this.audio.currentTime;	
		var	timeLeft = (duration - elapsed);
		
		// Call the view to update elapsed time for the
		// current track.
		objCtr.updateRemainingTime(timeLeft, track);
		
		// Init seeker "animates" the seeker in sync with the
		// track.
		//
		this.initSeeker();
		
		this.tickerTimeout = setTimeout(function() {
			objThis.ticker += 250;
			objThis.initTicker();
		}, 250);
	};
	
	this.initSeeker = function() {
		// Bail if the seeker is currently being interacted
		// with.
		if (this.audio.seeking)
			return false;
		
		var	currentTime = this.audio.currentTime;
		var	duration = this.trackLength[this.currentTrack];
		var	elapsed = (duration - currentTime);
		
		var	timeSlice = (duration / 1000);
		
		objCtr.updateSeeker(currentTime / timeSlice);
	};
	
};

