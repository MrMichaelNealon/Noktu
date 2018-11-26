
var objProjects = [

	{
		"name": "Qubes",
		"page": "pages/projects/Qubes.html",
		
		"description": "Simple but addictive block-based puzzle game",
		
		"github": "https://github.com/MrMichaelNealon/Qubes.git",
		"demo": "https://rawgit.com/MrMichaelNealon/Qubes/master/index.html"
	},
	{
		"name": "Noktu",
		"page": "pages/projects/Noktu.html",
		
		"description": "An audio player written in JavaScript",
		
		"github": "https://github.com/MrMichaelNealon/Noktu.git",
		"demo": "https://rawgit.com/MrMichaelNealon/Noktu/master/index.html"
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

