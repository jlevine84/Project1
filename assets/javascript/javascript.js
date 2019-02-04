$(document).ready(function() {
    var idCount=1;
    var slice = "/12351/";
    var articleSection = $("#articles");
    var articles = [];
    var yandexKey = "trnsl.1.1.20190130T012434Z.3dd2c347532d5fa2.316531bda0cbd1d627d27d686ed25ff9b2b799d7";
    var translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?";
    translateURL = translateURL + "key=" + yandexKey;
    var lang = "en";
    // lang = "en" to translate to english
    // text = "text" DONT ACTUALLY NEED QUOTES
    // callback= callbackFunction
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
            var url = $("<a>").text("read more").attr("href",articles[i].url)
            url.addClass("articleLink");
            var dateString = articles[i].publishedAt.split("T")[0];
            var date = $("<p>").text(dateString);
            date.addClass("date");
            var favorite = $("<i>");
            favorite.attr("id",i);
            favorite.addClass("far fa-heart")
            //check through favorites and find out if this is one of them; then add class loved/unloved
            favorite.addClass("unloved");
            article.append(favorite,title,snip,date,url);
            articleSection.append(article);
        }
    }
    function translateArticles() {
        translateAny(articles,articleSection);
        translateAny(favs,$("#fav-articles"));
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
        database.ref("/" +firebase.auth().currentUser.uid).set({
            favorites : favs
        });
    });
    $(document).on("click",".loved",function () {
        $(this).attr("class","fa-heart far unloved");
        var unlike = articles[$(this).attr("id")];
        for (var i =0 ; i < favs.length; i++) {
            if (unlike.url === favs[i].url) {
                favs.splice(i,1);
                break;
            }
        }
        database.ref("/" +firebase.auth().currentUser.uid).set({
            favorites : favs
        });
    })
    $("#submit").on("click",function(e) {
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
    })
    $('.dropdown-toggle').on("click", function() {
        $('.dropdown-toggle').dropdown()
    })
    $(".dropdown-item").on("click",function() {
        console.log("got to dropdown");
        lang = $(this).attr("value");
        // console.log(lang);
        translateArticles();
    })

    //Toggle favorites modal to show
    $("#btn-favorites").on("click", function() {

        $("#modal-favorites").modal("toggle")
        //user's favorites content goes in this element
    });
})
