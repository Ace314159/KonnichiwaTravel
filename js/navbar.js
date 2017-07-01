var provider;
var user;

$(document).ready(function() {

	var database = firebase.database();
	var places = database.ref("Places");
	provider = new firebase.auth.GoogleAuthProvider();

	places.on("value", function(snapshot) {
		$("#select-place div").not(":first").empty();
		$("#select-place .default.text").html("Where do you want to go?");
		snapshot.forEach(function(country) {
			country.forEach(function(city) {
				$("#select-place .menu").append("<div class='item' id='" + country.key +"'>" + city.key + "</div");
			});
		});
		$("#select-place").removeClass("disabled");
	});

	firebase.auth().onAuthStateChanged(function(u) {
	  if (u) {
	    // User is signed in.
	    user = u;
	    $("#login").hide();
	    // ...
	  } else {
	    // User is signed out.
	    user = undefined;
	  }
	});

});

function login() {
	firebase.auth().signInWithRedirect(provider);
	firebase.auth().getRedirectResult().then(function(result) {
	if (result.credential) {
		// This gives you a Google Access Token. You can use it to access the Google API.
		var token = result.credential.accessToken;
		// ...
	}
	// The signed-in user info.
	var user = result.user;
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	});
}
