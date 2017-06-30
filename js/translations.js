var languages;
var data;

$(document).ready(function() {
	//$('#select-place').dropdown('setting', 'onChange', placeChange);
	$('#select-place').dropdown({
		onChange: placeChange
	});
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

	data.once("value").then(function(snapshot) {
		$("#category .menu").append("<div class='item'>All Categories</div>");
		snapshot.forEach(function(category) {
			$("#category .menu").append("<div class='item'>" + category.key +"</div>");
		});
		$("#category .default.text").html("All Categories");
		$("#category").removeClass("disabled");
	});
});

function search() {
	$("#results").html("");
	data.once("value").then(function(categories) {
		var noFilter = $("#category .text").html() === "All Categories";
		categories.forEach(function(category) {
			if(noFilter || $("#category .text").html() == category.key) {
				var trans = "<div class='translation-category'><div><p class='category-name'>" + category.key +"</p></div>";
				category.forEach(function(translation) {
					trans += "<div class='translation'><p class='original'>" + translation.key +"</p><p class='translated'>" 
								+ translation.val()[$("#language .text").html()] + "</p></div>";
				});
				trans += "</div>";
				$("#results").append(trans);
			}
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
