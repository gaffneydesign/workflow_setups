// alert('Bar');
console.log('BS3 Nav has loaded');

var focusedLink = { 
	"text":"foo", 
	"parent":true,
	"index":-1,
	"siblings": 0
};
console.log(focusedLink.parent);

$('.parent').has('.selected').addClass('open');

linkActivate();

$('.parent > a').click(function(e) {
	var thisParent = $(this).closest('.parent');
	openThisMenu(thisParent);
	closeOtherMenus(thisParent);
});


$('#global-navigation a').keydown(function(e) {
	keyNav(e);
}).focus(function(e) {
	myNode = $(e.target).closest('li');
	focusedLink = {
		"el": $(e.target),
		"text":$(e.target).text(),
		"node": myNode,
		"parent": myNode.hasClass('parent'),
		"index": myNode.index(),
		"siblings": myNode.siblings('li').length,
		"lastItem": (myNode.index() == myNode.siblings('li').length),
	};
	console.log(focusedLink);
});


function linkActivate() {
	$('.parent').each(function(i) {
		if ($(this).hasClass('open')) {
			$(this).find('ul a').removeAttr('tabindex')
		} else {
			$(this).find('ul a').attr('tabindex', -1)
		};
	});
}



function keyNav(e) {

	keyPressed = e.keyCode;
	// console.log("Key: " + keyPressed);

	if (keyPressed > 36 && keyPressed < 41) {
		e.preventDefault();
	}

	switch(keyPressed) {
		case 40:
			if (focusedLink.parent) {
				if (myNode.hasClass('open')) {
					nextLink();
				} else {
					openThisMenu(myNode);
					closeOtherMenus(myNode);
				}
			} else {
				nextLink();
			};
		break;
		// case y:
		// code block
		break;
		default:
		// code block
	}
}

function nextLink(){
	switch (true) {
		case focusedLink.parent:
			// console.log("Opened top nav to submenu");
			$(focusedLink.el).next('ul').find('li:first-child a').focus();
			break;
		case focusedLink.lastItem:
			// console.log("Last subnav item to top nav");
			$(focusedLink.el).closest('.parent').next('li > a').focus();
			break;
		default:
			// console.log("Default");
			$(focusedLink.node).next('li').find('a').focus();
			break;
	}
}
function prevLink(){
	console.log("Go to prev");	
}

function openThisMenu(thisMenu) {
	var toClose = null;

	if (thisMenu.hasClass('open')) {
		console.log("Already Open");
		toClose = null;
	} else {
		console.log("Opening...");
		$(thisMenu).addClass('open')
			.find('ul a').removeAttr('tabindex');		
		toClose = thisMenu;
	}

	closeOtherMenus(toClose);
}

function closeOtherMenus(thisMenu) {
	$('.parent').not(thisMenu).removeClass('open')
		.find('ul a').attr('tabindex', -1);
	linkActivate();
}