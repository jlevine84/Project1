
var idCount=1;
var slice = "/12351/";
var articleSection = $("#log");
var articles = [];

$(document).ready(function()){

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

function translateArticles() {
    console.log("got here");
    if (articles.length < 1) {
        articleSection.html("<p>No articles found</p>")
        return false;

//New York Times API
var apiKey = "2uLSCfNAfY93MR1jQWuIUkNjuKASxxGD";
var articleSection = $("#log");
articleSection.html("<p>This should show up</p>");
function search1(term,language) {
    console.log("first language : " + language);
    search(term,10,1930,2019,language);
}
function search(term,limit,startYear,endYear,lang) {
    console.log("language = " +lang);
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json?"
    var dates = ""; 
    if (startYear < endYear) {
        dates= "&begin_date="+startYear+"0101&end_date=" +endYear+"1231";
    }
    limit = 10;
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
        article.append(favorite,title,snip,date,url);
        articleSection.append(article);
    }
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
search("trump","2019-01-14","","publishedAt")



        for (var i = 0; i < data.length;i++) {
            if (i >= limit) {
                break;
            }
            var article = $("<div>");
            article.addClass("article");
            var title = $("<h6>").attr("id",idCount);
            translate(lang,idCount + slice +data[i].headline.main);
            idCount++;
            var snip = $("<p>").attr("id",idCount);
            translate(lang,idCount + slice +data[i].snippet);
            idCount++;
            var url = $("<a>").text("read more").attr("href",data[i].web_url)
            var dateString = data[i].pub_date.split("T")[0];
            var date = $("<p>").text(dateString);
            article.append(title,snip,date,url);
            articleSection.append(article);
        }
    })
}
 search1("trump","fr");

 $('.dropdown-toggle').on("click", function() {
    $('.dropdown-toggle').dropdown()
})
})
