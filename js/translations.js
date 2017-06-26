var languages;
var data;

$(window).ready(function() {
	$("#language").dropdown({
		onChange: search
	});
	$("#category").dropdown({
		onChange: search
	});
	$("#phrase").on("input", function() {
		if($(".select-place .selected").html() !== undefined) {
			search();
		}
	});


	var database = firebase.database();
	data = database.ref("Translations/Data");
	languages = database.ref("Translations/Languages");
});

function search() {
	$("#results").html("");
	data.once("value").then(function(snapshot) {
		snapshot.forEach(function(category) {
			$("#category .menu").append("<div class='item'>" + category.key +"</div>");
			$("#results").append("<div><p class='category-name'>" + category.key +"</p></div>");
			category.forEach(function(translations) {
				if(translations.key == $("#language .text").html()) {
					translations.forEach(function(translation) {
						$("#results").append("<div class='translation'><p class='original'>" 
							+ translation.key +"</p><p class='translated'>" 
							+ translation.val() + "</p></div>");
					});
				}
			});
		});
	});
}

function placeChange(value, text) {
	languages.once("value").then(function(snapshot) {
		snapshot.forEach(function(country) {
			if(country.key === value) {
				country.forEach(function(language) {
					if(language.key.split("~")[1] === "Default") {
						$("#language .default.text").html(language.val());
					}
					$("#language .menu").append("<div class='item'>" + language.val() +"</div>");
				})
			}
		});
	});
	search();
}
