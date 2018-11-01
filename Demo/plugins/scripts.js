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
	"white",
	"red",
	"green",
	"blue",
	"magenta",
	"cyan",
	"orange",
	"yellow",
	"pink",
	"silver",
	"purple"
];

// Animation effects, one of these will be selected at
// random for each individual line of text.
//			
var	effects = [
	"blind",
	"bounce",
	"explode",
	"fade",
	"fold",
	"drop",
	"puff",
	"pulsate",
	"shake",
	"slide"
];


$(document).ready(function(){
	
	// The line_count variable will keep track of the
	// current line.
	var	line_count = 0;
	
	var	text_effect = null;
	var	text_color = null;
	
	
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
		
		// Select a random color for the #text element.
		//
		if (text_color === null)
			text_color = colors[Math.floor(Math.random() * colors.length)];
		else {
			// Make sure we don't use the same color
			// twice in a row.
			//
			var new_color = text_color;
			while (new_color === text_color)
				new_color = colors[Math.floor(Math.random() * colors.length)];
			text_color = new_color;
		}
		
	//	console.log("text_color = " + text_color + "text_effect = " + text_effect);
	
		$("#text").toggle(text_effect, { times: 3 }, "slow" );
		$("#text").css("color", text_color);
		
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
			$("#text").html(text[line_count++]);
			showText();
		}, "slow");
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
	$("#text").toggle("blind");
	
	// Show the opening text.
	//
	$("#text").html("WELCOME TO THE SIMULATION");
	
	// Lastly - this will toggle/show the opening
	// "WELCOME TO THE SIMULATION" string.
	//
	showText();
	
});

