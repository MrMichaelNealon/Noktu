///////////////////////////////////////////////////////////
// objects/objTestimonials.js
//
// M. Nealon, 2018.
//


var	objTestimonials = [
	{
		"project": "Volume Calculators",
		"feedback": '\
			Anyone can program. Very few can do it \
			correctly and think it through properly. \
			This complex project required zero revisions. \
			It was done right the first time.\
		',
		"reflection": '\
			I really enjoyed working with this client and \
			the project itself was a lot of fun.\
			<br />\
			<br />\
			The client had a website where he sold <b>Bonsai \
			trees</b>. He wanted some custom calculators on his \
			site that would allow his users to calculate the volumes \
			of the various types and sizes of pots that were available.\
			<br /><br />\
			The problem was there were various sizes and types of pot - \
			rectacular, round, oval, etc. In the end I wrote a \
			<b>MVC</b> application in <b><font color="#1E90FF">\
			JavaScript</font></b> that could easily be used to \
			build each calculator interface and perform the \
			necessary calculations.\
		'
	},
	{
		"project": "Mobile friendly HTML page",
		"feedback": '\
			Michael was great on the project. He communicated well \
			which made the project easy. I look forward to working \
			with Michael on future projects and would recommend him \
			to a prospective client.\
		',
		"reflection": '\
			Another fun little project and thoroughly nice client.\
			<br />\
			<br />\
			This chap was looking for a custom profile template for \
			his site.\
			<br />\
			<br />\
			Part of the project also involved the making of 2 icons -- a \
			speech-bubble and a telephone icon, it also featured a circular \
			cut-out style display for the profile image.\
			<br />\
			<br />\
			The project was completed using only <b><font color="#1E90FF">\
			HTML</font></b> and <b><font color="#1E90FF">JavaScript</font></b>\
			and was completely responsive.\
		'
	},
	{
		"project": "Mock-up website",
		"feedback": '\
			Excellent to work with. Very responsive to emails. I dont \
			think he ever sleeps!\
		',
		"reflection": '\
			Heh, I do sleep!\
			<br />\
			<br />\
			This was one of the first projects I did on <b><font color="#1E90FF">\
			Upwork</font></b>.\
			<br />\
			<br />\
			It was fairly simple - the client wanted a small, static site built \
			to demonstrate a particular idea to a student union in a University \
			in California.\
			<br />\
			<br />\
			It was a decent site with a few pages, I worked to a tight PSD \
			design and the site had to be pixel perfect as per the spec as well \
			as responsive.\
			<br />\
			<br />\
			The client was great - came with very clear requirements and designs, fond \
			memories of this one.\
		'
	},
	{
		"project": "Generation of 168 HTML files",
		"feedback": '\
			Michael did a fantastic job. He thought about how to solve \
			the problem in a smart way, and then executed brilliantly. \
			His communication is great, response time is fast and the \
			quality of his work is high.\
		',
		"reflection": '\
			This was my very first job on <b><font color="#1E90FF">\
			Upwork</font></b>!\
			<br />\
			<br />\
			It sounds more impressive than it really was. This chap had an \
			<b><font color="#1E90FF">Excel</font></b> spreadhseet containing \
			information relevant to a Chinese language course he was operating \
			in <b>Hong Kong</b>. The information in the spreadsheet had to be \
			extracted and written to individual <b><font color="#1E90FF">\
			HTML</font></b> files, each of which had the exact same structure...\
			<br />\
			<br />\
			I had a look at the spreadsheet and figured out a way to automate \
			the process, I then implemented the solution using <b><font color="#1E90FF">\
			VBA</font></b> - the code took an hour or two to write, the generation of \
			the files once coding was over was instantaneous! \
			<br /><br />\
			The client was very pleased with the speed of the process and the accuracy \
			of the results. I did a few other odd jobs for this client over the \
			years until he eventually left the organisation he represented. \
			<br />\
			<br />\
			Really nice guy though and definitely helped me to get more jobs \
			on <b><font color="#1E90FF">Upwork</font></b> by leaving very \
			nice feedback - much obliged, mr Caughey! \
		'
	}
];


var	objFeedback = (function() {
	
	var	currentItem;
	
	this.clockTimeout = null;
	this.clockTimer;
	this.clockTimeslice = 200;
	this.triggerTime = 10000;
	
	var	self = this;
	
	
	$("#page-content-feedback-0").on("mouseenter", function() {
		self.stopClock();
	});
	
	
	$("#page-content-feedback-0").on("mouseleave", function() {
		self.initClock();
	});
	
	$("#page-feedback-reflection-btn").on("click", function() {
		$("#page-feedback-reflection").css({
			"display": "block",
			"opacity": "0.01"
		});
		
		$("#page-feedback-reflection").animate({
			"opacity": "0.99",
			"top": "0%",
			"left": "0%",
			"width": "100%",
			"height": "65%"
		}, 500, "linear");
		
		self.stopClock();
	});
	
	$("#page-feedback-upwork").on("click", function() {
		window.open("https://www.upwork.com/freelancers/~015696440980088b28?viewMode=1", "", "_blank");
	});
	
	$("#page-feedback-reflection").on("mouseleave", function() {
		$("#page-feedback-reflection").stop().animate({
			"opacity": "0.01",
			"top": "50%",
			"left": "50%",
			"width": "0%",
			"height": "0%"
		}, 500, "linear", function() {
			$("#page-feedback-reflection").css("display", "none");
			self.initClock();
		});
	});
	
	
	this.init = function() {
		currentItem = -1;
	
		$("#page-content-feedback").css("opacity", "0.01");
		$("#page-feedback-reflection").css({
			"opacity": "0.01",
			"display": "none"
		});
		
		this.showFirst();
		this.initClock();
	};
	
	
	this.initClock = function() {
		if (this.clockTimeout != null)
			return false;
		
		this.clockTimer = 0;
		
		this.tickClock();
	};
	
	
	this.tickClock = function() {
		this.clockTimeout = setTimeout(function() {
			if (self.clockTimer >= self.triggerTime) {
				self.clockTimer = 0;
				self.showNext();
			}
			else
				self.clockTimer += self.clockTimeslice;
			
			self.tickClock();
		}, this.clockTimeslice);
	};
	
	
	this.stopClock = function() {
		if (this.clockTimeout == null)
			return false;
		
		clearTimeout(this.clockTimeout);
		
		this.clockTimeout = null;
		this.clockTimer = 0;
		
		return true;
	};
	
	
	this.getRandomItem = function() {
		var	items = objTestimonials.length;
		var	rnd;
		
		if (currentItem == -1)
			rnd = Math.floor(Math.random() * items);
		else {
			if (objTestimonials.length == 1)
				rnd = 0;
			
			while (true) {
				rnd = Math.floor(Math.random() * items);
				if (rnd != currentItem)
					break;
			}
		}
		
		currentItem = rnd;
		
		return rnd;
	};
	
	
	this.showNext = function() {
		$("#page-content-feedback-0").animate({
			"opacity": "0.01"
		}, 1000, "linear", function() {
			var	rnd = self.getRandomItem();
			
			$("#page-feedback-title").html(objTestimonials[rnd].project);
			$("#page-feedback-content").html(objTestimonials[rnd].feedback);
			$("#page-feedback-reflection").html(
				objTestimonials[rnd].reflection + '\
				<div title="Close" id="close-reflection" class="close-reflection">\
					X\
				</div>\
			');
		$("#close-reflection").unbind("click");
		$("#close-reflection").on("click", function() {
			$("#page-feedback-reflection").trigger("mouseleave");
		});
			
			$("#page-content-feedback-0").animate({
				"opacity": "0.99"
			}, 1000, "linear");
		});
	};
	
	this.showFirst = function() {
		var	rnd = self.getRandomItem();
		
		$("#page-content-feedback-0").css("opacity", "0.01");
			
		$("#page-feedback-title").html(objTestimonials[rnd].project);
		$("#page-feedback-content").html(objTestimonials[rnd].feedback);
		$("#page-feedback-reflection").html(
			objTestimonials[rnd].reflection + '\
			<div title="Close" id="close-reflection" class="close-reflection">\
				X\
			</div>\
		');
		$("#close-reflection").unbind("click");
		$("#close-reflection").on("click", function() {
			$("#page-feedback-reflection").trigger("mouseleave");
		});
		
		$("#page-content-feedback-0").animate({
			"opacity": "0.99"
		}, 1000, "linear");
	};
	
});

