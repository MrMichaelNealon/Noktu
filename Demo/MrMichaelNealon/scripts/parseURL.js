

var	parseURL = function() {;
	
	var	routes = [
		{
			"link": "home",
			"page": "pages/home.html",
			"title": "Home page",
			"target": "content-inner"
		},
		{
			"link": "projects",
			"page": "pages/projects.html",
			"title": "Projects page",
			"target": "content-inner"
		}
	];
	
	var	error404 = {
		"link": "Page not found",
		"page": "pages/404.html",
		"title": "Requested page could not be found!",
		"target": "content-inner"
	};
	
	this.urlParams = null;
	
	var	navEl;
	
	var	navLinkPrefix = "nav-";
	var	navLinkClass = "header-nav-el";
	
	var	currentPage = "home";
	
	var	self = this;
	
	this.pageURL = "file://C:/Users/Michael/Desktop/MyProjects/Bricktop - Copy/index.html";
	
	
	this.parse = function(url) {
		if (url == null || url == "")
			url = window.location.href;
			
		var	urlParts = url.split("?");
		
		this.urlParams = [];
		
		if (typeof(urlParts[1]) === "undefined")
			urlParts[1] = "home";
		
		alert("Splitting: " + urlParts[1]);
		
		var	unfiltered = urlParts[1].split("/");
		
		for (var param = 0; param < unfiltered.length; param++) {
			if (typeof(unfiltered[param]) === "undefined")
				continue;
				
			this.urlParams.push(unfiltered[param]);
		}
	};
	
	this.getPage = function() {
		if (this.urlParams.length == 0 || typeof(this.urlParams[0]) === "undefined")
			return routes[0];
			
		for (var route = 0; route < routes.length; route++) {
			if (this.urlParams[0] == routes[route].link) {
				currentPage = this.urlParams[0];
				return routes[route];
			}
		}
		
		return error404;
	};
	
	this.getNavLink = function(link) {
		return '\
			<div \
				id="' + navLinkPrefix + routes[link].link + '" \
				class="' + navLinkClass + '" \
				title="' + routes[link].title + '"\
			>\
				' + routes[link].link + '\
			</div>\
		';
	};
	
	this.getPageName = function(linkID) {
		var	prefixLen = navLinkPrefix.length;
		var	linkIDLen = linkID.length;
		
		return linkID.substr(prefixLen, (linkIDLen - prefixLen));
	};
	
	this.loadPage = function() {
	//	urlParams[1] = currentPage;
		var	page = this.getPage();
		
		console.log("LoadPage: " + page.page);
		$("#" + page.target).load(page.page);
		
		this.refreshNav();
	};
	
	this.refreshNav = function() {
		$("." + navLinkClass).css(objLinks.mouseout.style);
		$("#" + navLinkPrefix + currentPage).stop().css(objLinks.selected.style);
	};
	
	this.enableNav = function() {
		$("." + navLinkClass).on("mouseover", function() {
			var	pageName = self.getPageName($(this).attr("id"));
			
			if (pageName == currentPage)
				return false;
			
			$("#" + navLinkPrefix + pageName).stop().animate(objLinks.mouseover.style, objLinks.mouseover.duration, objLinks.mouseover.easing);
		});
		
		$("." + navLinkClass).on("mouseout", function() {
			var	pageName = self.getPageName($(this).attr("id"));
			
			if (pageName == currentPage)
				return false;
			
			$("#" + navLinkPrefix + pageName).stop().animate(objLinks.mouseout.style, objLinks.mouseout.duration, objLinks.mouseout.easing);
		});
		
		$("." + navLinkClass).on("click", function() {
			var	pageName = self.getPageName($(this).attr("id"));
			
			if (pageName == currentPage)
				return false;
			
			currentPage = pageName;
			self.urlParams[0] = currentPage;
			
			self.loadPage();
			
			window.history.pushState(null, null, self.pageURL + "?" + currentPage);
		});
	};
	
	this.populateNav = function(
		element,
		linkPrefix,
		linkClass
	) {
		navEl = element;
		
		navLinkPrefix = linkPrefix;
		navLinkClass = linkClass;
		
		for (var link = 0; link < routes.length; link++) {
			$("#" + navEl).append(this.getNavLink(link));
		}
		
		this.enableNav();
	};
	
};

