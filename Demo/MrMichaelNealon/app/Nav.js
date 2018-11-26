///////////////////////////////////////////////////////////
// app/Nav.js
//
// M. Nealon, 2018.
//


function refreshNav() {
	var	currentPage = autoScroll.getCurrentPage();
	
	$("#nav-" + currentPage.toString()).animate({
		"color": "#1E90FF",
		"opacity": "0.99",
		"border-color": "#1E90FF"
	}, 500, "linear", function() {
		$("#page-content-" + currentPage.toString()).animate({
			"opacity": "0.99"
		}, 500, "linear", function() {
			autoScroll.unlock();
		});
	});
	
	console.log("Highlighting link " + currentPage);
	
	return true;
}

function popNavEl(linkNo, delay) {
	if (! linkNo)
		$(".page-content").css("opacity", "0.01");
		
	if ($("#nav-" + linkNo.toString()).length == 0) {
		refreshNav();
		return false;
	}
	
	setTimeout(function() {
		$("#nav-" + linkNo.toString()).animate({
			"opacity": "0.75",
			"border-color": "#FFF"
		}, delay, "linear", function() {
			popNavEl(linkNo + 1);
		});
		
	}, delay);
	
	return true;
}