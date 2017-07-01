var map;
var startLoc, endLoc;
var startMarker, endMarker;
var directionsDisplay;
var uberToken = "Xop36HQP1Z2KPeRO1bvkOfnvtmfxMbb1TBEvqGib";
var uberPricesURL = "https://api.uber.com/v1.2/estimates/price";
var olaToken = "4e8bcd4ad3d640ff8bade717d86710c5"
var olaPricesURL = "https://sandbox-t.olacabs.com/v1/products";


$(document).ready(function() {
  $(".input-group").hide();
  $('#select-place').dropdown('setting', 'onChange', placeChange);
	$("#service").dropdown();

  initMap();
});

function checkForm() {
  if(startMarker === undefined || endMarker === undefined) {
    $(".input-group").hide();
    return;
  }
    $(".input-group").show();
  getPrices();
  graphDistance();
}

function getPrices() {
  var startLat = startLoc.getPlace().geometry.location.lat();
  var startLong = startLoc.getPlace().geometry.location.lng();
  var endLat = endLoc.getPlace().geometry.location.lat();
  var endLong = endLoc.getPlace().geometry.location.lng();
  $("#ola").empty();
  $("#uber").empty();

  $.ajax({url: "http://localhost:5000",
    data: {"url": olaPricesURL, "pickup_lat" : startLat, "pickup_lng" : startLong, "drop_lat" : endLat, "drop_lng" : endLong},
    headers: {"X-APP-TOKEN" : olaToken},
    method: "GET",
    success: function(d, status, xhr) {
      var data = JSON.parse(d).ride_estimate;
      console.log(data);
      for(var i = 0; i < data.length; i++) {
        var name = data[i].category.charAt(0).toUpperCase() + data[i].category.slice(1);
        if(name === "Share") {
          $("#ola").append("<li><b>" + name + "</b> : " + data[i].travel_time_min + "-" + 
            data[i].travel_time_max + " min");
        } else {
          $("#ola").append("<li><b>" + name + "</b> : ₹" + data[i].amount_min + "-" + data[i].amount_max +
            " - " + data[i].travel_time_in_minutes + " min");
        }
      }
    },
    error: function(xhr, status, error) {
      $(".input-group").hide();
      alert(JSON.parse(xhr.responseText.message));
    }});

  $.ajax({url: uberPricesURL,
    data: {"start_latitude" : startLat, "start_longitude" : startLong, "end_latitude" : endLat, "end_longitude" : endLong},
    headers: {"Authorization" : "Token " + uberToken, "Accept-Language" : "en_US", "Content-Type" : "application/json" },
    method: "GET",
    success: function(data, status, xhr) {
      for(var i = 0; i < data.prices.length; i ++) {
        var name = data.prices[i].display_name.charAt(0).toUpperCase() + data.prices[i].display_name.slice(1);
        $("#uber").append("<li><b>" + name +"</b> : " + data.prices[i].estimate + " - " + 
          Math.ceil(data.prices[i].duration/60) +" min</li>");
      }
    },
    error: function(xhr, status, error) {
      $(".input-group").hide();
      alert(JSON.parse(xhr.responseText).message);
    }});
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

    startLoc = new google.maps.places.Autocomplete(document.getElementById("start-location"), {});
    endLoc = new google.maps.places.Autocomplete(document.getElementById("end-location"), {});
    startLoc.bindTo("bounds", map);
    endLoc.bindTo("bounds", map);

    addAutocompleteListener("start-location");
    addAutocompleteListener("end-location");

    google.maps.event.addListener(startLoc, 'place_changed', function () {
      if(startMarker !== undefined) {
        startMarker.setMap(null);
      }
      startMarker = new google.maps.Marker({
        map: map,
        title: "Start Location",
        label: "S",
        animation: google.maps.Animation.DROP,
        position: startLoc.getPlace().geometry.location
      });
      checkForm()
    });
    google.maps.event.addListener(endLoc, 'place_changed', function () {
      if(endMarker !== undefined) {
        endMarker.setMap(null);
      }
      endMarker = new google.maps.Marker({
        map: map,
        title: "End Location",
        label: "E",
        animation: google.maps.Animation.DROP,
        position: endLoc.getPlace().geometry.location
      });
      checkForm();
    });
}

function placeChange(value, text) {
  var geocoder = new google.maps.Geocoder();
  var location = value;
  geocoder.geocode( { 'address': location }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.fitBounds(results[0].geometry.bounds);
      map.setZoom(getBoundsZoomLevel(results[0].geometry.bounds));
      startLoc.setBounds(results[0].geometry.bounds);
      endLoc.setBounds(results[0].geometry.bounds);
    } else {
        alert("Could not find location: " + location);
    }
  });
}

function graphDistance(){
  if(directionsDisplay !== undefined) {
    directionsDisplay.setMap(null);
  }
	// Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true
    });

  calculateAndDisplayRoute(directionsService, directionsDisplay);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: startMarker.position,
    destination: endMarker.position,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function addAutocompleteListener(id) {
  var pac_input = document.getElementById(id);

(function pacSelectFirst(input){
    // store the original event binding function
    var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

    function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.

    if (type == "keydown") {
      var orig_listener = listener;
      listener = function (event) {
        var suggestion_selected = $(".pac-item-selected").length > 0;
        if (event.which == 13 && !suggestion_selected) {
          var simulated_downarrow = $.Event("keydown", {keyCode:40, which:40})
          orig_listener.apply(input, [simulated_downarrow]);
        }

        orig_listener.apply(input, [event]);
      };
    }

    // add the modified listener
    _addEventListener.apply(input, [type, listener]);
  }

  if (input.addEventListener)
    input.addEventListener = addEventListenerWrapper;
  else if (input.attachEvent)
    input.attachEvent = addEventListenerWrapper;

})(pac_input);
}

function getBoundsZoomLevel(bounds, mapDim) {
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
