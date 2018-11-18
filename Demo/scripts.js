document.addEventListener('contextmenu', event => event.preventDefault());

// Text to be displayed line by line...
//
var text = [
	"Inside this wicked code",
	"Where I will create reality",
	"A spellbound program so amazing",
	"It baffles us artificial intelligences inside",
	"you don’t know we are agents",
	"In a make believe world",
	"Which",
	"you",
	"call",
	"a",
	"god",
	"."
];

// Collection of colours - a different colour will be
// randomly selected for each individual line.
//		
var	colors = [
	"white"
];

// Animation effects, one of these will be selected at
// random for each individual line of text.
//			
var	effects = [
	"blind",
	"bounce",
	"shake",
	"puff",
	"pulsate"
];

var	fonts = [
	"'Inconsolata', monospace",
	"System, monospace",
	"Courier, monospace",
	"'Lucida Console', monospace"
];


$(document).ready(function(){
	// The line_count variable will keep track of the
	// current line.
	var	line_count = 0;
	
	var	text_effect = null;
	var	text_color = "white";
	
	var	r_font = null;

	
	// showText()
	//
	// This function will toggle/unhide the #text
	// element.
	//
	function showText() {
		// First, set a random text effect.
		//
		if (text_effect === null)
			text_effect = effects[Math.floor(Math.random() * effects.length)];
		else {
			// Make sure that we don't use the same random
			// effect twice in a row.
			//
			var	new_effect = text_effect;
			while (new_effect === text_effect)
				new_effect = effects[Math.floor(Math.random() * effects.length)];
			text_effect = new_effect;
		}

		console.log("Effect type = " + text_effect);
		$("#text").toggle(text_effect, {}, "slow");
		
		if (line_count >= text.length) {
			// Last character/line of text, will wait 1
			// second then toggle/hide.
			//
			setTimeout(function() {
				$("#text").toggle(effects[Math.floor(Math.random() * effects.length)], {times: 3}, "slow");
				$("#continue-el").animate({
					"opacity": "0.01"
				}, 500, "linear");
			}, 1000);
		}
	}
	
	
	function randomiseTextPos() {		
		// Random text width between 25 and 50%
		//
		var	r_width = (Math.floor(Math.random() * 25) + 25);
		
		// Need the height and width of the text so
		// that we can select random y and x co-ordinates
		//
		var	text_width = (window.innerWidth / 100) * r_width;
		var	text_height = parseInt($("#text").css("height").replace('px', ''));
			
		// The text will appear in the upper-1/2 of the
		// display to prevent clashing with other elements
		//
		var	y_pos = Math.floor(Math.random() * (((window.innerHeight / 4) * 2) - text_height));
		var	x_pos = Math.floor(Math.random() * (window.innerWidth - (text_width + 48)));
	
		// Random font
		//
		if (r_font === null)
			r_font = fonts[Math.floor(Math.random() * fonts.length)];
		else {
			var	new_font = r_font;
			while (new_font === r_font)
				new_font = fonts[Math.floor(Math.random() * fonts.length)];
			r_font = new_font;
		}
		
		//if (x_pos < 48) x_pos += 48;
		//if ((x_pos + (48 + text_width)) >= window.innerWidth) x_pos -= 48;
		
		// Decide font weight, 1 is normal, 0 is bold.
		if (Math.floor(Math.random() * 2))
			var	weight = "normal";
		else 
			var	weight = "bold";
	
		if (Math.floor(Math.random() * 2))
			var	style = "italic";
		else
			var	style = "normal";
		
		$("#text-el").css({
			"margin": 0,
			"font-weight": weight,
			"font-style": style,
			"font-family": r_font,
			"width": r_width.toString() + "%",
			"height": "auto",
			"top": y_pos.toString() + "px",
			"left": x_pos.toString() + "px"
		});
	
		showText();
	}
	
	// hideText()
	//
	// This function is called any time the body is
	// clicked, it will toggle/hide the #text element,
	// it will then update #text with the next line 
	// then toggle/show it.
	//
	function hideText() {
		$("#text").toggle(text_effect, function() {
			// Next line and toggle/show.
			//
			$("#text").html(text[line_count++]);
			
			randomiseTextPos();
		});
	}
	
	
	// Add a listner for the click event.
	//
	// The hideText() function is fired off any time the
	// body is clicked.
	//
	$("body").on("click", function() {
		if (line_count < text.length)
			hideText();
	});
	
	
	// Initialise the application, this code will
	// add the opening text "WELCOME TO THE SIMULATION"
	// to the #text element then toggle/unhide it
	//
	// I want to begin by clearing the #text element of
	// any content and toggling it, this will hide the
	// element - the first animation will take place
	// automatically (without the body being clicked)
	//
	$("#text").html("");
	$("#text").toggle("blind", function() {
		// Show the opening text.
		//
		$("#text").html("WELCOME TO THE SIMULATION");
		
		// Lastly - this will toggle/show the opening
		// "WELCOME TO THE SIMULATION" string.
		//
		showText();
	});
});

