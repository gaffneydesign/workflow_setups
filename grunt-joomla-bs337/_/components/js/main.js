// JavaScript Document

// Tests foo
function foo() {
    console.log('foo');
}

// "Catches" Joomla functions that have been disabled (v.3.*)
function JCaption(param){
	console.log('The JCaption feature is not utilized in this template: "' + param + '" discarded.');
}
function popover(param){
	console.log('The "popover" feature is not utilized in this template: "' + param + '" discarded.');
}
