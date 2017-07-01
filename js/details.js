var map;
var detailsRef = "Details";

$(document).ready(function() {
	setTimeout(function(){$('#select-place').dropdown('setting', 'onChange', placeChange)}, 400);
	initMap();
	$(".atitle").hide();
	$("#carousel").hide();
	$("#weather-card").hide();
});

function placeChange(value, text ,$element) {
  var geocoder = new google.maps.Geocoder();
  var location = text;
  geocoder.geocode( { 'address': location }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.fitBounds(results[0].geometry.bounds);
      map.setZoom(getBoundsZoomLevel(results[0].geometry.bounds));
    } else {
        alert("Could not find location: " + location);
    }
  });

  var database = firebase.database();
  data = database.ref("Places").child($element.attr("id")).child(text).child(detailsRef);

  data.once("value").then(function(details) {
  	$("#info ul").empty();
  	$("#langs ul").append("<li class='lang'>" + details.val().Language + "</li>");
  	details.child("SOS").forEach(function(number) {
  		$("#sos ul").append("<li class='sosn'><b>" + number.key + ":</b> " + number.val() + "</li>");
  	});

  	$(".carousel-inner").empty();
  	var count = 0;
  	var carouselCount = 0;
  	details.child("Places").forEach(function(place) {
  		if(count++ % 4 === 0) {
  			$(".carousel-inner").append('<div class="item" id="carousel' + Math.floor(count/4) + 
  				'">' +
                '<ul class="thumbnails"></ul>' +
            '</div>');
            carouselCount = Math.floor(count/4);
  		}
  		$("#carousel" + carouselCount + " ul").append('<li class="col-sm-3">' +
                            '<div class="fff">' +
                                '<div class="ui card">' +
                                  '<div class="image">' +
                                    '<img src="' + place.val() +'">' +
                                  '</div>' +
                                  '<div class="content">' +
                                    '<a class="header">' + place.key +'</a>' +
                                '</div>' +
                            '</div>' +
                            '</div>' +
                        '</li>');
  	});
	$('.carousel').carousel({
      interval: 6000
    })

  	$("#carousel0").addClass("active");
  	$(".atitle").show();
  	$("#carousel").show();
  	$("#weather-card").show();
  });
}

function initMap() {
    options = {
      zoom: 4,
      center: {
      	lat: 20.1751393,
      	lng: 79.539658
      }
    };
    map = new google.maps.Map(document.getElementById('map'), {options});
}

function getBoundsZoomLevel(bounds) {
    var $mapDiv = $("#map");
    var mapDim = { height: $mapDiv.height() - 50, width: $mapDiv.width() - 50 };
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}
