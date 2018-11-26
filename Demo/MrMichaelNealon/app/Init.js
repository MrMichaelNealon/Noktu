///////////////////////////////////////////////////////////
// app/Init.js
//
// M. Nealon, 2018.
//


function Init() {
	$(window).on("resize", function() {
		autoScroll.refreshPage();
	});

	$("*").on("keypress", function(event) {
		var	e;
		
		var	attrID = $(this).attr("id");
		
	//	console.log("attrID = " + attrID);
	//	if (attrID == "page-feedback-reflection") {
	//		console.log("Patched a peach man");
	//		return false;
	//	}

		if ($("#page-feedback-reflection").css("display") == "block")
			return false;
		
		if (autoScroll.locked)
			return false;
		
		if (event == window.event)
			e = window.event;
		else
			e = event;
		
		if (e.keyCode == 38)
			autoScroll.prevPage();

		if (e.keyCode == 40)
			autoScroll.nextPage();
	});
		
	$(".nav-el").on("mouseover", function() {
		if (autoScroll.isLocked())
			return false;

		var	elID = $(this).attr("id");

		if ($("#" + elID).css("color") != "rgb(255, 255, 255)")
			return false;
			
		$("#" + elID).stop().animate({
			"opacity": "0.99"
		}, 500, "linear");
	});

	$(".nav-el").on("mouseout", function() {
		if (autoScroll.isLocked())
			return false;

		var	elID = $(this).attr("id");

		if ($("#" + elID).css("color") != "rgb(255, 255, 255)")
			return false;
			
		$("#" + elID).stop().animate({
			"opacity": "0.75"
		}, 500, "linear");
	});
	
	$(".nav-el").on("click", function() {
		if (autoScroll.isLocked())
			return false;

		var	elID = $(this).attr("id");
		var	elNo = parseInt(elID.substr(4, (elID.length - 4)));

		$(".page-content").stop().animate({
			"opacity": "0.01"
		}, 500, "linear", function() {
			autoScroll.gotoPage(elNo);
		});
	});

	putTitleString("header", "header-el", "MICHAEL NEALON");
	$("#header").append("<div id='subheader'></div>");
	putTitleString("subheader", "subheader-el", "WEB DESIGN & DEVELOPMENT");

	$(".nav-el").css("opacity", "0.01");
	popNavEl(0, 500);
	
	var	portfolioSlides = new Slides(
		"portfolio-slider", "portfolio-", "page-content-slide"
	);
	
	autoScroll.addPortfolioSlides(portfolioSlides);
	
	portfolioSlides.initSlides(objPortfolio);
	
	clientFeedback = new objFeedback();
//	clientFeedback.init();
	
	autoScroll.addClientFeedback(clientFeedback);
	
}

