$(window).ready(function() {
	$("#select-place").dropdown({
		onChange: placeChange
	});


	var database = firebase.database();
	var places = database.ref("Places");

	places.on("value", function(snapshot) {
		snapshot.forEach(function(country) {
			country.forEach(function(city) {
				$("#select-place").append("<option value='" + country.key + "'>" + city.val() + "</option");
			});
		});
	});
});