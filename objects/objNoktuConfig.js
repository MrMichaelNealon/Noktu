///////////////////////////////////////////////////////////
// objNoktuConfig.js
//
// M. Nealon, 2018.
//


var	objNoktuConfig = {

	// The parentId is the ID of the element that
	// the player element will be created within.
	//
	"parentId": "inner",
	
	// We can define a cusom format string for the
	// scrolling marquee displayed on the header when
	// a track is playing. We can use format specifiers
	// to include relevant track information deifned
	// in the playlist obect.
	//
	//		$a - expands to artist name
	//		$n - expands to track name
	//		$l - expands to track link
	//		$t - expands to track number
	//	
	// We don't need to define this format string, if we
	// don't then the player will build a simple output
	// sttring - but the below will create a string that
	// features some links to youTube.
	//
	"marquisFmt": '\
		Now playing track (<b>%t</b>) -- \
		<div class="marquis-track-el marquis-track-name">%n</div> \
		by \
		<p class="marquis-track-el marquis-track-artist">%a</p> \
		-- You can view this track on \
		<p \
			id="youtube-link" \
			class="marquis-track-el marquis-youtube-link" \
			title="Go to YouTube" \
			onclick=\'window.open("http://www.youtube.com", "YouTube", "_blank");\'\
		>YouTube</p> \
		at \
		<p \
			id="track-link" \
			class="marquis-track-el marquis-track-link" \
			title="Listen to %n by %a on YouTube" \
			onclick=\'window.open("%l", "YouTube", "_blank");\'\
		>%l</p>\
	',
	
//	Player element id and class.
//
	"player": {
		"elementId": "noktu",
		"elementClass": "noktu"
	},
	
//	Header element id, class and height.
//
	"header": {
		"elementId": "noktu-header",
		"elementClass": "noktu-el noktu-header",
		"height": 24
	},
	
//	Playlist element id and class.
//
	"playlist": {
		"elementId": "noktu-playlist",
		"elementClass": "noktu-el noktu-playlist"
	},
	
//	Track element - a little more complex.
//
//	Since there can be more than one track then we
//	instead define an id prefix to which the track
//	number is appended.
//
//	The track reference is added as a class that we
//	can use to reference all tracks by class type.
//
	"track": {
		"trackIdPrefix": "noktu-track-",
		"elementClass": "noktu-el noktu-track",
		"trackReference": "noktu-track",
		
		// Deseleted is what the tracks look like when
		// the mouse isn't hovering over them.
		//
		"deselected": {
			"style": {
				"opacity": "0.70",
				"color": "#8FA"
			},
			"duration": 250,
			"easing": "linear"
		},
		// What the track that's being played (selected)
		// looks like in the playlist.
		"selected": {
			"style": {
				"opacity": "0.99",
				"color": "#FFF"
			},
			"duration": 250,
			"easing": "linear"
		},
		// When a track is hovered over in the playlist.
		"mouseover": {
			"style": {
				"border": "none",
				"opacity": "0.99",
				"color": "#8FA"
			},
			"duration": 250,
			"easing": "linear"
		},
	},
	
//	Actions are simple options that can be toggled
//	on and off - repeat, loop and tandom.
//
	"actions": {
		"elementId": "noktu-actions",
		"elementClass": "noktu-el noktu-actions",
		"height": 24,
		"actionClass": "noktu-el-action noktu-action",
		"referenceClass": "noktu-action",
		
		// Handle styling for mouseovers, etc.
		//
		"deselected": {
			"style": {
				"background-color": "#FFF",
				"opacity": "0.70"
			},
			"duration": 250,
			"easing": "linear"
		},
		"selected": {
			"style": {
				"background-color": "#0C1",
				"opacity": "0.70"
			}
		},
		"mouseover": {
			"style": {
				"background-color": "#0C1",
				"opacity": "0.99"
			},
			"duration": 250,
			"easing": "linear"
		}
	},
	
//	Controls are similar to actions in some ways - these
//	are the common controls -- previous track, play,
//	stop, next track and pause.
//
	"controls": {
		"elementId": "noktu-controls",
		"elementClass": "noktu-el noktu-controls",
		"height": 24,
		"controlClass": "noktu-el-action noktu-control",
		"referenceClass": "noktu-control",
	
		// Handle mouse effetcs.
		//
		"deselected": {
			"style": {
				"background-color": "#FFF"
			},
			"duration": 250,
			"easing": "linear"
		},
		"mouseover": {
			"style": {
				"background-color": "#0C1"
			},
			"duration": 250,
			"easing": "linear"
		}
	},
	
//	The seeker element is a range element that is used
//	to alter the current time/position of the track.
//
//	It goes inside the actions element.
//
	"seeker": {
		"elementId": "noktu-seker",
		"elementClass": "noktu-el-action noktu-seeker"
	},
	
//	The volume control goes in the controls element.
//
	"volume": {
		"elementId": "noktu-volume",
		"elementClass": "noktu-el-action noktu-volume"
	},
	
//	The action array defines each individual action.
//
	"action": [
		{
			// action[0] - the repeat action.
			"elementId": "noktu-repeat-track",
			"src": "images/RepeatTrack.png",
			"action": "Repeat",
			"title": "Repeat Track"
		},
		{
			// action[1] - the loop action.
			"elementId": "noktu-loop-tracks",
			"src": "images/LoopTracks.png",
			"action": "Loop",
			"title": "Loop tracks"
		},
		{
			// action[2] - the random action.
			"elementId": "noktu-random-track",
			"src": "images/RandomTrack.png",
			"action": "Random",
			"title": "Random track"
		}
	],
	
//	This is similar to the actions array only it defines
//	controls instead...
//
	"control": [
		{
			// control[0] - the "previous track" control.
			"elementId": "noktu-control-prev",
			"src": "images/PreviousTrack.png",
			"action": "Prev",
			"title": "Previous Track"
		},
		{
			// control[1] - the "play track" control.
			"elementId": "noktu-control-play",
			"src": "images/PlayTrack.png",
			"action": "Play",
			"title": "Play Track"
		},
		{
			// control[2] - the "stop track" control.
			"elementId": "noktu-control-stop",
			"src": "images/StopTrack.png",
			"action": "Stop",
			"title": "Stop Track"
		},
		{
			// control[3] - the "next track" control.
			"elementId": "noktu-control-prev",
			"src": "images/NextTrack.png",
			"action": "Next",
			"title": "Next Track"
		},
		{
			// control[4] - the "previous track" control.
			"elementId": "noktu-control-pause",
			"src": "images/PauseTrack.png",
			"action": "Pause",
			"title": "Pause Track"
		}
	]
	
};

