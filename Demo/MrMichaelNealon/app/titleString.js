///////////////////////////////////////////////////////////
// app/titleString.js
//
// M. Nealon, 2018.
//


function putTitleString(titleEl, titleCharClass, titleString) {
	var	el = $("#" + titleEl);
	var	charWidth = (100 / titleString.length);
	
	for (var charNo = 0; charNo < titleString.length; charNo++) {
		var	character = titleString.substr(charNo, 1);
		
		if (character == " ")
			character = "&nbsp;";
		if (character == "&")
			character = "&amp;";
			
		el.append('\
			<div \
				id="' + titleCharClass + '-' + charNo.toString() + '" \
				class="' + titleCharClass + '" \
				style="\
					width: ' + charWidth.toString() + '%; \
				"\
			>\
				' + character + '\
			</div>\
		');
	}
}