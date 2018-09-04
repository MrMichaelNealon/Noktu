Noktu.

I was thinking about writing games and thought it would be
neat if I had an audio player I could use to play a list
of tracks in the background - so I developed Noktu.

Why Noktu? God alone knows, I don't even think it's a real
word. Project needed a name and it just popped into my head.
Put it down to temporary demonic posession or perhaps a
simple flash of inspiration.


What exactly does Noktu do?

It creates and populates an audio player element,
it builds the player out of 4 simple sub-elements:

	Header		this displays current playing track
			information.
	Playlist	shows the list of track being played
	Actions		contains the track seeker range element as
			well as the repeat, loop and random
			options.
	Controls	Shows the common controls, previous
			track, play, stop, next track and
			pause as well as the volume control.

Noktu will create the main player element and populate
it with these sub-elements to build the player interface.

It will then load the playlist and allow the user to play,
pause, skip and stop tracks - simple enough.


How do I use Noktu?

There are 4 core files:

	NoktuModel.js
	NoktuViews.js
	NoktuController.js
	DeSade.js
	
The model deals with the actual tracks mainly, it has
functionality to play, skip, stop, etc. It is also a
storage area for the configuration of the player and
the playlist being played.

The view is concerned with what the user can see and
interact with. The controller instantiates both the
model and view locally, it is the messenger between
the two and is the main core application that handles
everything.

DeSade is a trivial application I wrote that allows us to
create a scrolling text marquee. This is used to display
the current playing track information in the player
header element.

So to use Noktu in our application we need to include
these 4 files:

	<script src="app/DeSade.js"></script>
	<script src="app/NoktuModel.js"></script>
	<script src="app/NoktuViews.js"></script>
	<script src="app/NoktuController.js"></script>
	
Then create a new instance of the controller:

	<script>
		$(document).ready(function() {
			var	ctr = new NoktuController(objConfig, objPlaylist)
		});
	</script>
	
That's pretty much all of the code that's needed. The player
is event-driven so little-to-no further interaction is
required in terms of code.
	

What about those objConfig and objPlaylist parameters?

Technically, Noktu runs without them but has no styling,
mouseover effects, icons or tracks to play!

The config object tells Noktu the id's and classes to
use when building the player elemets as well as how
to style everything, or what icons to use, how controls
and actions respond to mouse events, etc.

The playlist object defines the list of tracks to play
and information about those tracks.

As well as these objects you also need the relevant css
file - the css file must name the classes in respect to
the values specified in the config object.

To make it simpler the demo shows a live, working example.

The config and playlist objects can be found in:

	Demo/objects/objNoktuConfig.js
	Demo/objects/objNoktuPlaylist.js
	
The stylesheet used to build the player interface:

	Demo/styles/noktu.css
	
You can take the Demo directory and make a complete copy
of it then simply open the Noktu.html file in your
browser and run it locally. I've made this easier by
uploading a zipped version of the demo that you can easily
download:

	https://github.com/MrMichaelNealon/Noktu/blob/master/NoktuDemo.rar

Alternatively you can view the live demo at:

	https://rawgit.com/MrMichaelNealon/Noktu/master/Demo/Noktu.html
	

M. Nealon, 2018.

