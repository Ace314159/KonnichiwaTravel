var city;
var places;
var hotelsRef = "Hotels";
var okToSearch = false;
var hits;

$(document).ready(function() {
	$("#rating-filter .rating").rating({
		maxRating: 5,
		onRate: search
	});
	$("#money-filter .rating i").removeClass("icon").addClass("dollar icon");
	$('#select-place').dropdown('setting', 'onChange', placeChange);
	$("#phrase").on("input", function() {
		search();
	});

	$(".slider").slider({
		min: 0,
		max: 30000,
		value: [0, 30000]
	});

	$(".slider").on("slideStop", function(e) {
		search();
	});
	$("#phrase").on("input", function() {
		if($(".select-place .selected").html() !== undefined) {
			index.search($("#phrase").val(), function(err, content) {
				hits = content.hits;
				search();
			});
		}
	});

	var client = algoliasearch("E5CDWZR6TV", "8030ccf7e97fc8b0aec1cd14f6dd2201");
	index = client.initIndex('Hotels');

	var database = firebase.database();
	places = database.ref("Places");
});

function search() {
	if(!okToSearch) {
		return;
	}
	var priceRange = $(".slider:not(.slider-horizontal)").data("slider").getValue();
	city.once("value").then(function(hotels) {
		$("#results").empty();
		hotels.forEach(function(hotel) {
			if(hits !== undefined) {
				var match = false;
				hits.forEach(function(hit) {
					if(hit.name == hotel.key) {
						match = true;
					}
				});
				if(!match) {
					return;
				}
			}
			var minPrice = parseInt(hotel.val().Price.replace(",", "").split("-")[0]);
			var maxPrice = parseInt(hotel.val().Price.replace(",", "").replace(",", "").split("-")[1]);
			if(minPrice < priceRange[0] || maxPrice > priceRange[1]
				|| hotel.val().Rating[0] < $("#rating-filter").rating("get rating")) {
				return;
			}
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
                            "<span class='right floated'>₹" + hotel.val().Price +"</span>" +
                        "</div>" +
                    "</div>")
		});
		$(".card .rating").rating({
			maxRating: 5,
			interactive: false
		});
	});
}

function placeChange(value, text, $element) {
	okToSearch = true;
	city = places.child($element.attr("id")).child(text).child(hotelsRef);
	$("#phrase").attr("placeholder", "Search for hotels");
	search();
}
