
var objPortfolio = [

	{
		"name": "Qubes",
		"thumb": "images/portfolio/Qubes.png",
		
		"description": 'Simple but addictive block-based puzzle game written in <b><font color="#1E90FF">HTML5</font></b> and <b><font color="#1E90FF">JavaScript</font>',
		
		"github": "https://github.com/MrMichaelNealon/Qubes.git",
		"demo": "https://rawgit.com/MrMichaelNealon/Qubes/master/index.html"
	},
	{
		"name": "Noktu",
		"thumb": "images/portfolio/Noktu.png",
		
		"description": "An audio player written in JavaScript",
		
		"github": "https://github.com/MrMichaelNealon/Noktu.git",
		"demo": "https://rawgit.com/MrMichaelNealon/Noktu/master/Demo/Noktu.html"
	}
	
	
];


function listSideItems(objItems) {
	$("#content-side").html("");
	
	for (var item = 0; item < objItems.length; item++) {
		$("#content-side").append('\
			<div \
				id="side-' + objItems[item].name + '" \
				class="content-side-el"\
			>\
				' + objItems[item].name + '\
			</div>\
		');
	}
};

function loadSideItem(objItems, item, itemEl) {
	$("#" + itemEl).load(objItems[item].page);
};

function findSideIndex(objItems, itemName) {
	for (var item = 0; item < objItems.length; item++) {
		if (itemName == objItems[item].name)
			return item;
	}

	return -1;
};

