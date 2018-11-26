///////////////////////////////////////////////////////////
// app/Slides.js
//
// M. Nealon, 2018.
//


var Slides = function(
	targetEl,
	slideElPrefix,
	slideElClass,
	objSlides
) {

	var	target = targetEl;
	var	elPrefix = slideElPrefix;
	var	elClass = slideElClass;
	
	var	slides = null;

	var	showfor = 10000;
	var	animFor = 1000;
	var	animID = null;
	var	animClock = 0;
	
	var	currentSlide;
	
	this.locked = false;
	
	var	self = this;
	
	
	this.initSlides = function(objSlides) {
		var	el = $("#" + target);
		
		slides = objSlides;
		
		for (var slide = 0; slide < slides.length; slide++) {
			el.append('\
				<div \
					id="' + elPrefix + slide.toString() + '" \
					class="' + elClass + '" \
					style="\
						left: ' + (slide * 100).toString() + '%; \
					"\
				>\
					<img \
						src="' + slides[slide].thumb + '" \
						class="page-slide-img" \
						height="100%" width="auto" \
					/>\
					<div id="' + elPrefix + '"inner-"' + slide.toString() + '" \
						class="page-slide-inner"\
					>\
						<div \
							id="' + elPrefix + "title-" + slide.toString() + '" \
							class="page-slide-title"\
						>\
							' + slides[slide].name + '\
						</div>\
						<div \
							id="' + elPrefix + "description-" + slide.toString() + '" \
							class="page-slide-description"\
						>\
							' + slides[slide].description + '\
						</div>\
						<div \
							id="' + elPrefix + "buttons-" + slide.toString() + '" \
							class="page-content-buttons" \
						>\
							<div \
								id="' + elPrefix + "demo-" + slide.toString() + '" \
								class="page-content-button" \
								title="View a live demo" \
								onclick=\'window.open("' +  slides[slide].demo + '", "", "_blank")\' \
							>\
								DEMO\
							</div>\
							<div \
								id="' + elPrefix + "repo-" + slide.toString() + '" \
								class="page-content-button" \
								title="View the Github repository" \
								onclick=\'window.open("' +  slides[slide].github + '", "", "_blank")\' \
							>\
								REPO\
							</div>\
						</div>\
					</div>\
				</div>\
			');
		}
		
		el.append('\
			<div \
				id="' + elPrefix + 'pages" \
				class="slide-pages"\
			>\
			</div>\
			<div \
				id="' + elPrefix + '"prev" \
				class="page-prev-slide" \
				title="Return to previous project"\
			>&nbsp;</div>\
			<div \
				id="' + elPrefix + '"prev-overlay" \
				class="page-prev-slide-overlay" \
				title="Return to previous project"\
			>&nbsp;</div>\
			<div \
				id="' + elPrefix + '"next" \
				class="page-next-slide" \
				title="Procees to next project"\
			>&nbsp;</div>\
			<div \
				id="' + elPrefix + '"next-overlay" \
				class="page-next-slide-overlay" \
				title="Procees to next project"\
			>&nbsp;</div>\
		');
		
		$(".page-prev-slide-overlay").on("click", function() {
			self.showPrev();
		});
		$(".page-next-slide-overlay").on("click", function() {
			self.showNext();
		});
		$("#" + target).on("mouseover", function() {
			if (self.locked)
				return false;
			
			self.stopClock();
			animClock = 0;
		});
		$("#" + target).on("mouseout", function() {
			if (self.locked)
				return false;
			
			self.tickClock();
		});
	};
	
	this.hideCurrentSlide = function(direction, distance, slideNo) {
		if (direction == "left") distance = "-=100%";
		else distance = "100%";
		
		$("#" + elPrefix + slideNo.toString()).animate({
			"left": distance,
			"opacity": "0.01"
		}, animFor, "swing");
		$("#" + elPrefix  + "pages").animate({
			"opacity": "0.01"
		}, 500, "linear", function() {	
			$("#" + elPrefix + "pages").html('\
				Project \
				<b><font color="#1E90FF">' + (slideNo + 1).toString() + '</font></b> \
				of \
				<b><font color="#1E90FF">' + slides.length.toString() + '</font></b>\
			');
		});
	};
	
	this.showPrev = function() {
		if (this.locked)
			return false;
		
		this.locked = true;
		
		this.stopClock();
		
		console.log("Prev: " + currentSlide);
		this.hideCurrentSlide("right", "+=100%", currentSlide);
		
		if (currentSlide <= 0)
			currentSlide = (slides.length - 1);
		else
			currentSlide--;
		
		$("#" + elPrefix + currentSlide.toString()).css({
			"left": "-100%",
			"opacity": "0.01"
		});
		
		$("#" + elPrefix + currentSlide.toString()).animate({
			"left": "0%",
			"opacity": "0.99"
		}, animFor, "swing", function() {
			$("#" + elPrefix + "pages").animate({
				"opacity": "0.99"
			}, 500, "linear", function() {
				self.tickClock();
				self.locked = false;
			});
		});
	};
	
	this.showNext = function() {
		if (this.locked)
			return false;
			
		this.locked = true;
		
		this.stopClock();
		
		console.log("Next: " + currentSlide);
		this.hideCurrentSlide("left", "-=100%", currentSlide);
		
		if ((currentSlide + 1) >= slides.length)
			currentSlide = 0;
		else
			currentSlide++;
		
		$("#" + elPrefix + currentSlide.toString()).css({
			"left": "100%",
			"opacity": "0.01"
		});
		
		$("#" + elPrefix + currentSlide.toString()).animate({
			"left": "0%",
			"opacity": "0.99"
		}, animFor, "swing", function() {
			$("#" + elPrefix + "pages").animate({
				"opacity": "0.99"
			}, 500, "linear", function() {
				self.tickClock();
				self.locked = false;
			});
		});
	};
	
	this.startSlides = function(showSlide, animationDuration) {
		showFor = showSlide;
		animFor = animationDuration;
		animClock = 0;
		
		currentSlide = 0;
		
		$("." + elClass).css({
			"left": "100%",
			"opacity": "0.01"
		});
		
		$("#" + elPrefix + "0").css({
			"left": "0%",
			"opacity": "0.99"
		});
		
		$("#" + elPrefix + "pages").html('\
			Project \
			<b><font color="#1E90FF">1</font></b> \
			of \
			<b><font color="#1E90FF">' + slides.length.toString() + '</font></b>\
		');
		
		this.tickClock();
	};
	
	this.nextSlide = function() {
		if (this.locked) return false;
		
		$("#" + elPrefix + currentSlide.toString()).animate({
			"left": "-100%",
			"opacity": "0.01"
		}, animFor, "swing");
		$("#" + elPrefix  + "pages").animate({
			"opacity": "0.01"
		}, 500, "linear", function() {	
			$("#" + elPrefix + "pages").html('\
				Project \
				<b><font color="#1E90FF">' + (currentSlide + 1).toString() + '</font></b> \
				of \
				<b><font color="#1E90FF">' + slides.length.toString() + '</font></b>\
			');
		});

		if ((currentSlide + 1) >= slides.length)
			currentSlide = 0;
		else
			currentSlide++;
		
		$("#" + elPrefix + currentSlide.toString()).css({
			"left": "100%",
			"opacity": "0.01"
		});
		
		$("#" + elPrefix + currentSlide.toString()).animate({
			"left": "0%",
			"opacity": "0.99"
		}, animFor, "swing", function() {
			$("#" + elPrefix + "pages").animate({
				"opacity": "0.99"
			}, 500, "linear", function() {
				self.locked = false;
			});
		});
		
	};
	
	this.tickClock = function() {
		animID = setTimeout(function() {
			animClock += 500;
			
			if (animClock >= showFor) {
				self.nextSlide();
				animClock = 0;
			}
			
			self.tickClock();
		}, 500);
	};
	
	this.stopClock = function() {
		if (animID != null) {
			clearTimeout(animID);
			animClock = 0;
			animID = null;
		}
	};
	
};

