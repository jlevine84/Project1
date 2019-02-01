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
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
});

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);