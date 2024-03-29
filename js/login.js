$(document).ready(function() {
var provider = new firebase.auth.GoogleAuthProvider();

  $("#sign-in").click(function() {

    console.log("signin clicked");

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

// firebase.auth().signOut().then(function() {
//   // Sign-out successful.
// }).catch(function(error) {
//   // An error happened.
// });
});