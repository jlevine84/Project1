$(document).ready(function() { 
    //Firebase configuration
    var config = {
        apiKey: "AIzaSyBrZxTKSoxBgzajy-ODqW2ZC2QhypYn6Pg",
        authDomain: "walkie-talkie-7f4d7.firebaseapp.com",
        databaseURL: "https://walkie-talkie-7f4d7.firebaseio.com",
        projectId: "walkie-talkie-7f4d7",
        storageBucket: "walkie-talkie-7f4d7.appspot.com",
        messagingSenderId: "965406599748"
    };
    firebase.initializeApp(config);

    // FirebaseUI config.
    var uiConfig = {
        signInSuccessUrl: 'https://jlevine84.github.io/Project1/',
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);

    //Checks online/offline status and displays the UI accordingly
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
           console.log("User Signed In")
            // User is signed in.
            //Change Login UI to sign out
            $("#logout").show();
            var user = firebase.auth().currentUser;
            $("#doodad").text("You are logged in!")
            //Client's data goes here.
            
        } else {
            // No user is signed in.
            $("#logout").hide();
            $("#doodad").text("Logged Out!");
            //Display public data when no user is signed in or signs out.
            
        }
    });

    //sign up function
    $("#sign-up").submit(function(event) {
        event.preventDefault();
        var email = $("#EMSUP").val();
        var password = $("#PWSUP").val();

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(function (error) {
            alert("Signup unsuccesful. Error Code: " + error)
        });
        $("#EMSUP").val("");
        $("#PWSUP").val("");
    });

    //sign in function
    $("#sign-in").submit(function(event) {
        event.preventDefault();
        var email = $("#EMSIN").val();
        var password = $("#PWSIN").val();
        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function () {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        }).catch(function(error) {
            alert("Sign-in unsuccesful. Error Code: " + error)
        });
        $("#EMSIN").val("");
        $("#PWSIN").val("");

    });

    //signout function
    $("#signout").on("click", function() {
        firebase.auth().signOut();
    });
});