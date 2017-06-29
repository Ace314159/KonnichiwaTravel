var map;

$(window).ready(function() {
	$("#service").dropdown();
});

function initMap() {
    options = {
      zoom: 11,
      center: {
      	lat: 17.3850,
      	lng: 78.486
      }
    };
    map = new google.maps.Map(document.getElementById('map'), {options});

    startLoc = new google.maps.places.Autocomplete(document.getElementById("start-location"), {});
    endLoc = new google.maps.places.Autocomplete(document.getElementById("end-location"), {});
}

function graphDistance(pointA, pointB){
	// Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService,
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    }),
    markerA = new google.maps.Marker({
      position: pointA,
      title: "Start Location",
      label: "S",
      map: map
    }),
    markerB = new google.maps.Marker({
      position: pointB,
      title: "End Location",
      label: "E",
      map: map
    });
    // get route from A to B
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
}


function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
  directionsService.route({
    origin: pointA,
    destination: pointB,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
