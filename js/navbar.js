$(document).ready(function() {
	$("#select-place").dropdown();

	var database = firebase.database();
	var places = database.ref("Places");
	var provider = new firebase.auth.GoogleAuthProvider();

	places.on("value", function(snapshot) {
		$("#select-place .default.text").html("Where do you want to go?");
		snapshot.forEach(function(country) {
			country.forEach(function(city) {
				$("#select-place .menu").append("<div class='item' id='" + country.key +"'>" + city.key + "</div");
			});
		});
		$("#select-place").removeClass("disabled");
		$("#select-place").dropdown('refresh');
	});

	$("#login").click(function() {
			firebase.auth().signInWithPopup(provider).then(function(result) {
	      // This gives you a Google Access Token. You can use it to access the Google API.
	      var token = result.credential.accessToken;
	      console.log("signin done : " + token);

	      // The signed-in user info.
	      var user = result.user;
	      // ...
	    }).catch(function(error) {
	      // Handle Errors here.
	      var errorCode = error.code;
	      var errorMessage = error.message;
	      // The email of the user's account used.
	      var email = error.email;
	      // The firebase.auth.AuthCredential type that was used.
	      var credential = error.credential;
	      console.log("Error : " + errorMessage);

	      // ...
	    });
	});
});
