var languages;
var data;
var index;
var translationsAudioRef = "Translations Audio";
var storageRef;
var hits;

$(document).ready(function() {
	$('#select-place').dropdown('setting', 'onChange', placeChange);
	$("#language").dropdown({
		onChange: search
	});
	$("#category").dropdown({
		onChange: search
	});
	$("#phrase").on("input", function() {
		if($(".select-place .selected").html() !== undefined) {
			index.search($("#phrase").val(), function(err, content) {
				hits = content.hits;
				search();
			});
		}
	});
	storageRef = firebase.storage().ref().child(translationsAudioRef);

	var client = algoliasearch("E5CDWZR6TV", "8030ccf7e97fc8b0aec1cd14f6dd2201");
	index = client.initIndex('Translations');


	var database = firebase.database();
	data = database.ref("Translations/Data");
	languages = database.ref("Translations/Languages");

	data.once("value").then(function(snapshot) {
		$("#category .menu").append("<div class='item'>All Categories</div>");
		snapshot.forEach(function(category) {
			$("#category .menu").append("<div class='item'>" + category.key +"</div>");
		});
		$("#category .menu").append("<div class='item'>Starred</div>");
		$("#category .default.text").html("All Categories");
		$("#category").removeClass("disabled");
	});
});

function search() {
	if($(".select-place .selected").html() === undefined) {
		return;
	}
	data.once("value").then(function(categories) {
		$("#results").html("");
		var noFilter = $("#category .text").html() === "All Categories";
		categories.forEach(function(category) {
			var trans = "<div class='translation-category'><div><p class='category-name'>" + category.key +"</p></div>";
			if(noFilter || $("#category .text").html() == category.key) {
				var inserted = false;
				if(!$.isArray(hits)) {
					category.forEach(function(translation) {
						trans += "<div class='translation'><p class='original'>" + translation.key +"</p><div class='translated'>" 
									+ translation.val()[$("#language .text").html()] + "<span class='glyphicon glyphicon-volume-up' style='left:5px;'><div class='ui huge star rating'></div></div></div>";
						inserted = true;
					});
				} else {
					hits.forEach(function(hit) {
						if(hit.category == category.key) {
							trans += "<div class='translation'><p class='original'>" + hit.english +"</p><div class='translated'>" 
									+ category.val()[hit.english][$("#language .text").html()] + "<span class='glyphicon glyphicon-volume-up' style='left:5px;'><div class='ui huge star rating'></div></div></div>";
							inserted = true;
						}
					});
				}
				
				if(inserted) {
					$("#results").append(trans);
				}
			}
		});
		$(".translated").click(function(e) {
			var ref = storageRef.child($("#language").dropdown("get text")).child($(this).prev().html().replace("?", "") + ".ogg");
			ref.getDownloadURL().then(function(url) {
				(new Audio(url)).play();
			});
		});
		$(".rating").click(function(e) {
			e.stopPropagation();
		});
		if(user) {
			$(".rating").rating({
				maxRating: 1,
				onRate: function(value) {
					var english = $(this).parent().parent().prev().html();
					if(value === 1) {
						firebase.database().ref("Users/" + user.uid + "/Translations/" + english).set($("#language").dropdown("get text"));
					} else {
						firebase.database().ref("Users/" + user.uid + "/Translations/" + english).remove();
					}
				}
			});

			var savedRef = firebase.database().ref("Users/" + user.uid + "/Translations");
			savedRef.once("value").then(function(saved) {
				saved.forEach(function(trans) {
					if($("#language").dropdown("get text") === trans.val()) {
						$(".original:contains('"+trans.key+"')").next().find(".ui.rating").rating("set rating", 1);
					}
				});
			});
		}
	});
}

function placeChange(value, text, $element) {
	languages.once("value").then(function(snapshot) {
		snapshot.forEach(function(country) {
			if(country.key === $element.attr("id")) {
				country.forEach(function(language) {
					if(language.key.split("~")[1] === "Default") {
						$("#language .default.text").html(language.val());
					}
					$("#language .menu").append("<div class='item'>" + language.val() +"</div>");
				})
			}
		});
		search();
	});
}
