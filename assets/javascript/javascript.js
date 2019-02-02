var idCount=1;
var slice = "/12351/"
var yandexKey = "trnsl.1.1.20190130T012434Z.3dd2c347532d5fa2.316531bda0cbd1d627d27d686ed25ff9b2b799d7";
var translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?";
translateURL = translateURL + "key=" + yandexKey;
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
//New York Times API
var apiKey = "2uLSCfNAfY93MR1jQWuIUkNjuKASxxGD";
var articleSection = $("#log");
articleSection.html("<p>This should show up</p>");
function search1(term,language) {
    console.log("first language : " + language);
    search(term,10,2018,2019,language);
}
function search(term,limit,startYear,endYear,lang) {
    console.log("language = " +lang);
    var queryURL = "https://cors-anywhere.herokuapp.com/https://api.nytimes.com/svc/search/v2/articlesearch.json?"
    var dates = ""; 
    if (startYear < endYear) {
        dates= "&begin_date="+startYear+"0101&end_date=" +endYear+"1231";
    }
    queryURL = queryURL + dates
    queryURL = queryURL + "&q="+term+"&sort=oldest&api-key=" +apiKey;
    var loading = $("<img>").attr("src","https://media0.giphy.com/media/sSgvbe1m3n93G/200.gif");
    loading.addClass("loadingGif");
    // console.log(queryURL);
    $("body").append(loading);
    $.get(queryURL).then(function(response) {
        loading.remove();
        console.log(response);
        // console.log(response.response.docs[0].source);
        if (response.status !== "OK") {
            return false;
        }
        articleSection.html("");
        var data = response.response.docs;
        console.log(data.length);
        if (data.length < 1) {
            articleSection.html("<p>No articles found</p>")
            return false;
        }
        for (var i = 0; i < data.length;i++) {
            if (i >= limit) {
                break;
            }
            var article = $("<div>");
            article.addClass("article");
            var title = $("<h6>").attr("id",idCount);
            title.addClass("title");
            translate(lang,idCount + slice +data[i].headline.main);
            idCount++;
            var snip = $("<p>").attr("id",idCount);
            snip.addClass("snippet");
            translate(lang,idCount + slice +data[i].snippet);
            idCount++;
            var url = $("<a>").text("read more").attr("href",data[i].web_url)
            url.addClass("articleLink");
            var dateString = data[i].pub_date.split("T")[0];
            var date = $("<p>").text(dateString);
            date.addClass("date");
            article.append(title,snip,date,url);
            articleSection.append(article);
        }
    })
}

search1("trump","fr");

