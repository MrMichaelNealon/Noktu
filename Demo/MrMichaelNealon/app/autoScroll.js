///////////////////////////////////////////////////////////
// app/autoScroll.js
//
// M. Nealon, 2018.
//


var	autoScroll = (function() {

	var	pages = 5;
	
	var	currentPage = 0;
	var	locked = true;
	
	var	portfolioSlides = null;
	var	clientFeedback = null;
	
	
	var	addPortfolioSlides = function(slides) {
		portfolioSlides = slides;
	};
	
	
	var	addClientFeedback = function(feedback) {
		clientFeedback = feedback;
	};
	
	
	var	prevPage = function() {
		if (currentPage > 0) {
			$(".page-content").stop().animate({
				"opacity": "0.01"
			}, 500, "linear", function() {
				gotoPage(currentPage - 1);
			});
		}
	};
	
	
	var	nextPage = function() {
		if ((currentPage + 1) < pages) {
			$(".page-content").stop().animate({
				"opacity": "0.01"
			}, 500, "linear", function() {
				gotoPage(currentPage + 1);
			});
		}
	};
	
	
	var	gotoPage = function(pageNo) {
		if (locked)
			return false;
			
		locked = true;
		
		$("#nav-" + currentPage.toString()).stop().animate({
			"color": "#FFF",
			"opacity": "0.75",
			"border-color": "#FFF"
		}, 500, "linear");
		
		if (pageNo > currentPage) {
			$(".page-el").stop().stop().animate({
				"top": "-=" + ((pageNo - currentPage) * 100).toString() + "%"
			}, 1000, "swing", function() { locked = false; });
		}
		else if (currentPage > pageNo) {
			$(".page-el").stop().stop().animate({
				"top": "+=" + ((currentPage - pageNo) * 100).toString() + "%"
			}, 1000, "swing", function() { locked = false; });
		}
		
		currentPage = pageNo;
		setTimeout(function() {
			refreshNav();
		}, 1000);
		
		if (currentPage == 2) {
			if (portfolioSlides != null)
				portfolioSlides.stopClock();
			
			portfolioSlides = new Slides(
				"portfolio-slider", "portfolio-", "page-content-slide"
			);	
			
			//self.addPortfolioSlides(portfolioSlides);
			portfolioSlides.initSlides(objPortfolio);
			
			portfolioSlides.startSlides(10000, 2000);
		}
		else {
			if (portfolioSlides != null)
				portfolioSlides.stopClock();
		}
		
		if (currentPage == 3)
			clientFeedback.init();
		else
			clientFeedback.stopClock();
		
		if (window.innerWidth >= 540)
			refreshPageElements(500);
		else
			$("#header").css("top", "2%");
			
		console.log("current page " + currentPage);
	};
	
	
	var	refreshPageElements = function(delay) {
		if (window.innerWidth >= 540) {
			if (currentPage) {
				$("#header").stop().animate({
					"top": "5%", "left": "12%", "width": "76%"
				}, delay, "linear");
				$("#nav").stop().animate({
					"top": "40%", "left": "68%", "width": "27%"
				}, delay, "linear");
			} else {
				$("#header").stop().animate({
					"top": "14%", "left": "12%", "width": "76%"
				}, delay, "linear");
				$("#nav").stop().animate({
					"top": "40%", "left": "60%", "width": "27%"
				}, delay, "linear");
			}
		}
		else {
			$("#header").css({
				"top": "2%", "left": "2%", "width": "96%", "height": "14%" 
			});
			$("#nav").css({
				"top": "18%", "left": "2%", "width": "96%", "height": "auto" 
			});
		}
	};
	
	
	var	refreshPage = function() {
		refreshPageElements(0);
	};
	
	var	getCurrentPage = function() {
		return currentPage;
	};
	
	
	var	isLocked = function() {
		return locked;
	};
	
	
	var	lock = function() {
		locked = true;
	};
	
	
	var	unlock = function() {
		locked = false;
	};
	
	
	return {
		"gotoPage": gotoPage,
		"getCurrentPage": getCurrentPage,
		"isLocked": isLocked,
		"lock": lock,
		"unlock": unlock,
		"refreshPage": refreshPage,
		"prevPage": prevPage,
		"nextPage": nextPage,
		"addPortfolioSlides": addPortfolioSlides,
		"addClientFeedback": addClientFeedback
	};
	

})();