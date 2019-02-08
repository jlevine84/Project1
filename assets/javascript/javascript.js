var pageLang = "en"; //language all the buttons, etc. are displayed in
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
    var pageLang = "en";
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
                    //get user favorites and language preferences
                    lang = snapshot.val().language.language;
                    pageLang = snapshot.val().language.pageLanguage;
                } catch (error) {
                    //no set language
                    lang = "en";
                    pageLang = "en";
                    database.ref("/" +firebase.auth().currentUser.uid + "/language").set( {
                        language : lang,
                        pageLanguage : pageLang
                    })
                }
                try {
                    favs = snapshot.val().favorites.favorites;
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
            translate(lang,idCount+slice+"Read More");
            var url = $("<a>").attr("href",urlData)
            url.attr("id",idCount);
            idCount++;
            url.addClass("articleLink");
            //Full article modal
            var fullArticle = $("<button>").attr("id",idCount);
            translate(lang,idCount + slice + "Full Article");
            idCount++;
            fullArticle.addClass("full-article");
            fullArticle.attr("data-url",urlData);
            fullArticle.attr("data-toggle","modal");
            fullArticle.attr("data-target",".full-article-modal");
            var dateString = articles[i].publishedAt.split("T")[0];
            var date = $("<p>").text(dateString);
            date.addClass("date");
            article.append(title,snip,date,url,fullArticle);
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
            
            articleSection.append(article);
        }
    }
    function translateArticles() {
        translateAny(articles,articleSection);
        translateAny(favs,favSection);
        translatePage();
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
    //Full Article Link
    function findArticle(url) {
        for (var i =0; i < articles.length; i++) {
            if (url === articles[i].url) {
                return articles[i];
            }
        }
        for (var i =0; i < favs.length; i++) {
            if (url === favs[i].url) {
                return favs[i];
            }
        }
    }
    //show full article
    $(document).on("click",".full-article",function() {
        window.scrollTo(0, 0);  //scroll to top to see where modal pops up
        var toPrint = findArticle($(this).attr("data-url"));
        console.log("article to print",toPrint);
        var article = $("<div>");
        article.addClass("article");
        var title = $("<h6>").attr("id",idCount);
        title.addClass("title");
        translate(lang,idCount + slice + toPrint.title);
        idCount++;
        var content = $("<p>").attr("id",idCount);
        content.addClass("snippet");
        translate(lang,idCount + slice +toPrint.content);
        idCount++;
        var author = $("<h7>").attr("id",idCount);
        translate(lang,idCount + slice + "Author : " + toPrint.author);
        author.addClass("author");
        idCount++;
        var urlData = toPrint.url;
        var url = $("<a>").text("read more").attr("href",urlData)
        url.addClass("articleLink");
        var img = $("<img>").attr("alt",toPrint.urlToImage);
        img.addClass("article-picutre");
        img.attr("src",toPrint.urlToImage);
        var dateString = toPrint.publishedAt.split("T")[0];
        var date = $("<p>").text(dateString);
        date.addClass("date");
        article.append(title,date,author,img,content,url);
        if (firebase.auth().currentUser) {  //if logged in
            var favorite = $("<i>");
            // favorite.attr("id",i);
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
        console.log(article);
        $("#view-article").html("");
        $("#view-article").append(article);
    });

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
        window.pageLang = lang;
        console.log(window.pageLang);
        database.ref("/" +firebase.auth().currentUser.uid + "/language").set({
            language : lang,
            pageLanguage : window.pageLang
        });
        // console.log(lang);
        translateArticles();
        
    })
    function getURL(language,text) {
        return translateURL+ "&lang="+ language +"&text=" +text;
    }
    function translatePage() {
        //Translate Every element on the page
        $.get(getURL(pageLang, "Powered By")).then(function(response) {
            $("#yandex").text(response.text + " Yandex");
        });
        $.get(getURL(pageLang, "Sign-in Option")).then(function(response) {
            $("#dropdownMenuLink").text(response.text);
        });
        $.get(getURL(pageLang, "Email Address")).then(function(response) {
            $("#email-label").text(response.text);
            $("#email-label2").text(response.text);
        });
        $.get(getURL(pageLang, "password")).then(function(response) {
            $("#password-label").text(response.text);
            $("#password-label2").text(response.text);
        });
        $.get(getURL(pageLang, "Sign in")).then(function(response) {
            $("#sign-in").text(response.text);
        });
        $.get(getURL(pageLang, "Don't have a login? Sign Up!")).then(function(response) {
            $("#sign-up-label").text(response.text);
        });
        $.get(getURL(pageLang, "Sign Up")).then(function(response) {
            $("#sign-up").text(response.text);
        });
        $.get(getURL(pageLang, "Logout")).then(function(response) {
            $("#signout").text(response.text);
        });
        $.get(getURL(pageLang, "News Translator")).then(function(response) {
            $("#walkie-title").text("Walkie Talkie " + response.text);
        });
        $.get(getURL(pageLang, "Select Your Language")).then(function(response) {
            $("#select-lang-label").text(response.text);
        });
        $.get(getURL(pageLang, "Select")).then(function(response) {
            $("#dropdownMenuButton").text(response.text);
        });
        $.get(getURL(pageLang, "Select Your Parameters")).then(function(response) {
            $("#select-parameters").text(response.text);
        });
        $.get(getURL(pageLang, "Subject")).then(function(response) {
            $("#subject-label").html("<b>" + response.text + "</b>");
        });
        $.get(getURL(pageLang, "Articles in the Last")).then(function(response) {
            $("#articles-date-label").html("<b>" + response.text + "</b>");
        });
        $.get(getURL(pageLang, "Day")).then(function(response) {
            $("#day").text(response.text);
        });
        $.get(getURL(pageLang, "Month")).then(function(response) {
            $("#month").text(response.text);
        });
        $.get(getURL(pageLang, "Week")).then(function(response) {
            $("#week").text(response.text);
        });
        $.get(getURL(pageLang, "Return Results By")).then(function(response) {
            $("#result-label").html("<b>" + response.text + "</b>");
        });
        $.get(getURL(pageLang, "Relevancy")).then(function(response) {
            $("#relevance").text(response.text);
        });
        $.get(getURL(pageLang, "Popularity")).then(function(response) {
            $("#popularity").text(response.text);
        });
        $.get(getURL(pageLang, "Newest First")).then(function(response) {
            $("#newest-first").text(response.text);
        });
        $.get(getURL(pageLang, "Submit")).then(function(response) {
            $("#submit").text(response.text);
        });
        $.get(getURL(pageLang, "Translated Articles")).then(function(response) {
            $("#articles-header").text(response.text);
        });
        $.get(getURL(pageLang, "My Favorites")).then(function(response) {
            $("#favorites-title").text(response.text);
            $("#fav-footer").text(response.text);            
        });
        $.get(getURL(pageLang, "Submit")).then(function(response) {
            $("#submit").text(response.text);
        });


    }
})
