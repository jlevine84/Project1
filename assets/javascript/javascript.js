$(document).ready(function() {
    var favs = [];
    var database;
    var idCount=1;
    var slice = "/12351/";
    var articleSection = $("#articles");
    var favSection = $("#fav-articles")
    var articles = [];
    var yandexKey = "trnsl.1.1.20190130T012434Z.3dd2c347532d5fa2.316531bda0cbd1d627d27d686ed25ff9b2b799d7";
    var translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?";
    translateURL = translateURL + "key=" + yandexKey;
    var lang = "en";
    //FIREBASE JAVASCRIPT
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
    database = firebase.database();
    
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
            $("#btn-favorites").show();
            var user = firebase.auth().currentUser;
            $("#doodad").text("You are logged in!")
            //Client's data goes here.

            //Set action listener once client is logged in
            database.ref("/" +user.uid).on("value",function(snapshot) {
                try {
                    favs = snapshot.val().favorites.favorites;
                    lang = snapshot.val().language.lang;
                    translateArticles();
                } catch (error) {
                    console.log("no favorites");
                    favs = [];
                }
            });
        } else {
            // No user is signed in.
            $("#btn-favorites").hide();
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
    //REST OF JAVASCRIPT
    function translate (language, text) {
        //CHECK FOR AMPERSANDS
        var transURL = translateURL+ "&lang="+ language +"&text=" +text;
        // console.log(transURL);
        $.get(transURL).then(function(response) {
            var answer = response.text[0].split(slice);
            // console.log(answer);
            $("#"+answer[0]).text(answer[1]);
        })

    }
    var newsKey = "&apiKey=bad2768f143a4bd39c2c92889b981643";
    var newsURL = "https://newsapi.org/v2/everything?"
    function translateAny(articles,articleSection) {
        console.log("got here");
        if (articles.length < 1) {
            articleSection.html("<p>No articles found</p>")
            return false;
        }
        limit = 10;
        articleSection.html("");
        for (var i = 0; i < articles.length;i++) {
            if (i >= limit) {
                break;
            }
            var article = $("<div>");
            article.addClass("article");
            var title = $("<h6>").attr("id",idCount);
            title.addClass("title");
            translate(lang,idCount + slice + articles[i].title);
            idCount++;
            var snip = $("<p>").attr("id",idCount);
            snip.addClass("snippet");
            translate(lang,idCount + slice +articles[i].description);
            idCount++;
            var urlData = articles[i].url;
            var url = $("<a>").text("read more").attr("href",urlData)
            url.addClass("articleLink");
            var dateString = articles[i].publishedAt.split("T")[0];
            var date = $("<p>").text(dateString);
            date.addClass("date");
            if (firebase.auth().currentUser) {  //if logged in
                var favorite = $("<i>");
                favorite.attr("id",i);
                favorite.attr("data-url",urlData);
                favorite.addClass("fa-heart")
                //check through favorites and find out if this is one of them; then add class loved/unloved
                var like = checkForFav(urlData);
                if (like < 0) {
                    favorite.addClass("far unloved");
                } else {
                    favorite.addClass("fas loved");
                }
                article.append(favorite);
            }
            
            article.append(title,snip,date,url);
            articleSection.append(article);
        }
    }
    function translateArticles() {
        translateAny(articles,articleSection);
        translateAny(favs,favSection);
    }
    function search(term,startDate,sources,sortBy) {
        var URL = newsURL + "q=" + term + "&from=" + startDate + "&sources=" + sources +"&sortBy=" + sortBy;
        URL = URL + newsKey;
        $.get(URL).then(function(response) {
            console.log(response);
            if (response.status !== "ok") {
                return false;
            }
            articles = response.articles;
            translateArticles();
        });
    }
    function getValue(element) {
        for (var i =0 ; i < element.length ; i++) {
            if (element[i].checked === true) {
                return element[i].value;
            }
        }
    }
    $(document).on("click",".unloved",function() {
        $(this).attr("class","fa-heart fas loved"); //change to solid heart
        favs.push(articles[$(this).attr("id")]);
        database.ref("/" +firebase.auth().currentUser.uid +"/favorites").set({
            favorites : favs
        });
        translateAny(favs,favSection);
    });
    function checkForFav(url) {
        for (var i =0 ; i < favs.length; i++) {
            if (url === favs[i].url) {
                return i;
            }
        }
        return -1;
    }
    $(document).on("click",".loved",function () {
        $(this).attr("class","fa-heart far unloved");
        var unlike = checkForFav($(this).attr("data-url"));
        if (unlike > -1) {
            favs.splice(unlike,1);
        }
        database.ref("/" +firebase.auth().currentUser.uid + "/favorites").set({
            favorites : favs
        });
        translateAny(favs,favSection);
    })
    $("#search").submit(function(e) {
        e.preventDefault();
        submit();
    });
    $("#submit").on("click",function() {
        submit();
    })
    function submit() {
        var subject =$("#subject").val();
        var dateSelect = getValue($("input[name='time']"));
        var date = "";
        switch (dateSelect) {
            case "day" :
                date = moment().startOf('day').format("YYYY-MM-DD");
                break;
            case "week" :
                date = moment().startOf('week').format("YYYY-MM-DD");
                break;
            case "month" :
                date = "";
        }
        console.log(date);
        var source = "";
        var sortBy = getValue($("input[name='sortBy'"));
        
        search(subject,date,"",sortBy);
    }
    // $('.dropdown-toggle').on("click", function() {
    //     $('.dropdown-toggle').dropdown()
    // })
    $(".dropdown-item").on("click",function() {
        console.log("got to dropdown");
        lang = $(this).attr("value");
        database.ref("/" +firebase.auth().currentUser.uid + "/language").set({
            language : lang
        });
        // console.log(lang);
        translateArticles();
    })

    //Toggle favorites modal to show
    // $("#btn-favorites").on("click", function() {

    //     $("#modal-favorites").modal("toggle")
    //     //user's favorites content goes in this element
    // });
})
