$(document).ready(function() {
	$(".card .rating").rating({
		maxRating: 5,
		interactive: false
	});

	$("#rating-filter .rating").rating({
		maxRating: 5
	});

	$("#money-filter .rating").rating({
		maxRating: 3
	});

	$("#money-filter .rating i").removeClass("icon").addClass("dollar icon");
});

function search() {
	
}
