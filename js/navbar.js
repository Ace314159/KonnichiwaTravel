$(window).ready(function() {
	$("#select-place").dropdown({
		onChange: placeChange
	});


	var database = firebase.database();
	var places = database.ref("Places");

	places.on("value", function(snapshot) {
		$("#select-place .default.text").html("Where do you want to go?");
		snapshot.forEach(function(country) {
			country.forEach(function(city) {
				$("#select-place .menu").append("<div class='item' data-value='" + country.key + "'>" + city.val() + "</div");
			});
		});
		$(".select-place").removeClass("disabled");
	});
});

function placeChange(value, text) {
	
}
