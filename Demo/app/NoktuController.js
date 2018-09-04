///////////////////////////////////////////////////////////
// NoktuController.js
//
// It's assumed that the NoktuModel.js and NoktuViews.js
// scritps have been included.
//
// The controller really takes care of everything, all you
// need to do is give it the config and playlist objects.
//
// It will render the player, load the playlist and handle
// ell events and communication between the model and view.
//
// M. Nealon, 2018.
//


var	NoktuController = function(noktuConfig, objPlaylist) {

	var	objThis = this;

	// The model gets the config and also a reference to
	// the controller so that it can issue requests - for
	// example refreshing the display which is done in
	// the view.
	//
	var	model = new NoktuModel(noktuConfig, objThis);
	
	// The view just gets a handle to the model, giving
	// it access to the config and playlist as well as
	// any other useful properties.
	//
	// Constructor code at the bottom of the view will
	// call the getInterface() method, we don't need
	// to do anything more than instantiate the view
	// to create the interface.
	//
	var	views = new NoktuViews(model);
	
	// Load the playlist.
	//
	views.loadPlaylist(objPlaylist);
	views.refreshPlaylist();
	
	
///////////////////////////////////////////////////////////
//	The model uses this to instruct the view to refresh
//	the display.
//
	this.refreshInterface = function() {
		views.refreshPlaylist();
		views.refreshActions();
		views.refreshControls();
	};
	
///////////////////////////////////////////////////////////
//	The model uses this to force the view to update the
//	track length.
//
	this.updateTrackLength = function(duration, trackNo) {
		views.updateTrackLength(duration, trackNo);
		this.refreshInterface();
	};
	
///////////////////////////////////////////////////////////
//	The model uses this to tell the view to update the
//	remaining time for the playing track.
//
	this.updateRemainingTime = function(remaining, trackNo) {
		views.updateRemainingTime(remaining, trackNo);
		this.refreshInterface();
	};
	
///////////////////////////////////////////////////////////
//	Model instructs view to clear the elapsed time fields
//	in the playlist.
//
	this.clearElapsedTime = function() {
		views.clearElapsedTime();
	};
	
///////////////////////////////////////////////////////////
//	The model uses this get the current position/value
//	of the seeker bar (the range elements used to skip
//	to certain parts of the playing track).
//
	this.getSeekerValue = function() {
		return views.getSeekerValue();
	};

///////////////////////////////////////////////////////////
//	Model tells view to update the seeker range element
//	with a new value/position.
//
	this.updateSeeker = function(val) {
		views.updateSeeker(val);
		this.refreshInterface();
	};
	
///////////////////////////////////////////////////////////
//	Model tells view to set the seeker range element
//	value/position to 0.
//
	this.resetSeeker = function() {
		views.resetSeeker();
		this.refreshInterface();
	};

///////////////////////////////////////////////////////////
//	Model uses this to acquire track information from the
//	view.
//
	this.getTrackInfo = function() {
		return views.getTrackInfo();
	};

};

