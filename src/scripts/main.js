// alert('Bar');
console.log('Main has loaded');


// Assigns a "label" to each cell in a .table-multicol
// based on the column header (<th>)
$('.table-multicol th').each(function(i) {
	var myLabel = $(this).text();

	$(this).closest('.table-multicol')
		.find('tbody tr td:nth-child(' + (i + 1) + ')')
		.attr('data-headlabel', myLabel);
});

// Form errors and validation
$('.inline_error').each(function(i) {
	$(this).closest('.form-group').addClass('has-error')
});

$('.has-error .form-control').each(function(i) {
	var theElement = $(this).prop('nodeName');

	if (theElement == 'INPUT') {
		$(this).focus(function(e) {
			removeError($(this));
		});
	} else if (theElement == 'SELECT') {
		$(this).change(function(e) {
			removeError($(this));
		});
	} 
});


function removeError(formElement) {
	formElement.closest('.form-group').removeClass('has-error')
		.find('.inline_error').remove();
}



// Dev tools
$("#toggle-grid").click(function(e) {
	console.log('Grid toggle');
	$('body').toggleClass('grid-underlay');
});