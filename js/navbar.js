$(document).ready(function() {
	$("#select-place").dropdown();

	var database = firebase.database();
	var places = database.ref("Places");

	places.on("value", function(snapshot) {
		$("#select-place .default.text").html("Where do you want to go?");
		snapshot.forEach(function(country) {
			country.forEach(function(city) {
				$("#select-place .menu").append("<div class='item'>" + city.val() + "</div");
			});
		});
		$("#select-place").removeClass("disabled");
		$("#select-place").dropdown('refresh');
	});
});
