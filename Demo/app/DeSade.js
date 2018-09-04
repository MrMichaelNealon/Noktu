///////////////////////////////////////////////////////////
// DeSade.js
//
// Yeah, so a while ago I wanted to create a simple
// marquee that would pause on mouseover so I created
// this DeSade.js thing.
//
// It's really very simple. I got a bit cheeky when I
// wrote it, adopting a cavalier and facetious attitude
// towards naming conventions for a laugh, it was all
// very petty but it works and that's what matters.
//
// Anyways - I took that and butchered it slightly to
// incorporate it in the Noktu audio player. It is
// used to create that scrolling marquee effect in the
// player header when a track is being played - nothing
// more.
//
// M. Nealon, 2018.
//

var	DeSade = function(parentElement, elementId) {

	this.parentElement = parentElement;	// The de-sade element goes in here
	this.elementId = elementId;			// ID for the de-sade element
	
	this.duration = 0;		// Duration of the animation.
	this.elapsed = 0;		// time the animation has been running.
	this.easing = "linear";
	
	// These are used to record the values returned
	// by setTimeout().
	//
	this.timeoutId = null;
	this.tickerTimeout = null;
	
	// this is the pause between completion of one animation
	// and the start of the next.
	//
	this.pause = 3000;
	
	var	objThis = this;
	
	
///////////////////////////////////////////////////////////
//	Creates the new de-sade class element within the
//	parent element.
//
	this.newMarquis = function(outputString, duration) {
		var	el = $("#" + this.parentElement);
		
		// Assuming the de-sade class has been defined.
		//
		el.html('\
			<div \
				id="' + this.elementId + '" \
				class="de-sade"\
			>\
				' + outputString + '\
			</div>\
		');
		
		// Record the width (in pixels) of both the parent
		// and element containers.
		//
		// These are required to figure out where the animation
		// begins and where it ends.
		//
		this.parentWidth = parseInt($("#" + this.parentElement).css("width").replace('px', ''));
		this.stringWidth = parseInt($("#" + this.elementId).css("width").replace('px', ''));
		
		this.begin(duration);
	};

///////////////////////////////////////////////////////////
//	Very descriptive name...we're all very surprised to
//	find you here!
//
	this.begin = function(duration) {
		this.duration = duration;
		this.elapsed = 0;
	
		// Push the text to the right so that it's just out
		// of view, the animation will scroll it to the left.
		//
		$("#" + this.elementId).css("margin-left", this.parentWidth.toString() + "px");
		
		// Initialise the ticker - this times how long an
		// animation has been running. 
		//
		// We need t do this, because if someone pauses the
		// animation with a mouseover I need to recalculate
		// the remaining time to reanimate from the current
		// position.
		//
		this.ticker();
		
		$("#" + this.elementId).animate({
			"margin-left": "-" + this.stringWidth.toString() + "px"
		}, this.duration, this.easing, function() {
			// It just keeps going!
			//
			objThis.timeoutId = setTimeout(function() {
				objThis.begin(duration);
			}, objThis.pause);
		});
	};
	
///////////////////////////////////////////////////////////
//	Stops a running animation - basic housekeeping stuff,
//	disables pending timeouts, etc.
//
	this.stop = function() {
		if (this.timeoutId != null) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
		
		$("#" + this.elementId).stop();
	};
	
///////////////////////////////////////////////////////////
//	Mouseover and mouseout event handlers.
//
//	A mouseover pauses the animation which requires that
//	the ticker is stopped, also. 
//
	$("#" + this.parentElement).on("mouseover", function() {
		if (objThis.tickerTimeout != null) {
			clearTimeout(objThis.tickerTimeout);
			objThis.tickerTimeout = null;
		}	
		objThis.stop();
	});

///////////////////////////////////////////////////////////
//	A mouseout restarts the animation from the current
//	position. It also restarts the ticker timer.
//
	$("#" + this.parentElement).on("mouseout", function() {
		var	timeLeft = (objThis.duration - objThis.elapsed);
		
		objThis.ticker();
		
		// Restart the animation from the current position.
		//
		$("#" + objThis.elementId).animate({
			"margin-left": "-" + objThis.stringWidth.toString() + "px"
		}, timeLeft, objThis.easing, function() {
			objThis.timeoutId = setTimeout(function() {
				objThis.begin(objThis.duration);
			}, objThis.pause);
		});
	});

///////////////////////////////////////////////////////////
//	The job of the ticker is to keep track of how long
//	an animation has been running.
//
	this.ticker = function() {
		// the ticker dies if the elapsed time is
		// greater or equal to the duration of the
		// animation.
		//
		if (this.elapsed >= this.duration) {
			this.elapsed = 0;
			return;
		}
		
		this.tickerTimeout = setTimeout(function() {
			objThis.elapsed += 200;
			objThis.ticker();
		}, 200);
	};
	
};

