var city;
var places;
var hotelsRef = "Hotels";

$(document).ready(function() {
	$("#rating-filter .rating").rating({
		maxRating: 5,
		onRate: search
	});
	$("#money-filter .rating").rating({
		maxRating: 3,
		onRate: search
	});
	$("#money-filter .rating i").removeClass("icon").addClass("dollar icon");
	$('#select-place').dropdown('setting', 'onChange', placeChange);
	$("#phrase").on("input", function() {
		if($(".select-place .selected").html() !== undefined) {
			search();
		}
	});

	var database = firebase.database();
	places = database.ref("Places");
});

function search() {
	$(".card .rating").rating({
		maxRating: 5,
		interactive: false
	});
}

function placeChange(value, text, $element) {
	city = places.child($element.attr("id")).child(text).child(hotelsRef);
	city.once("value").then(function(hotels) {
		hotels.forEach(function(hotel) {
			$("#results").append("<div class='card'>" + 
                        "<div class='image'>" +
                            "<img src='" + hotel.val().Image + "' />" + 
                        "</div>" + 
                        "<div class='content'>" + 
                            "<div class='header'>" + hotel.key + "</div>" + 
                            "<div class='meta'>" + hotel.val().Location + "</div>" +
                        "</div>" +
                        "<div class='extra content'>" +
                            "<div class='ui huge star rating' data-rating='" + hotel.val().Rating[0] + "'></div>" +
                            "<i class='right floated green dollar icon'></i>" +
                            "<i class='right floated green dollar icon'></i>" +
                        "</div>" +
                    "</div>")
			console.log(hotel.val());
		});
	});
	search();
}
