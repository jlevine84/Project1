var yandexKey = "trnsl.1.1.20190130T012434Z.3dd2c347532d5fa2.316531bda0cbd1d627d27d686ed25ff9b2b799d7";
var translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate?";
translateURL = translateURL + "key=" + yandexKey;
// lang = "en" to translate to english
// text = "text" DONT ACTUALLY NEED QUOTES
// callback= callbackFunction
function translate (language, text) {
    //CHECK FOR AMPERSANDS
    transURL = translateURL+ "&lang="+ language +"&text=" +text;

    $.ajax({
        url: transURL,
        method : "GET"
    }).then(function(response) {
        console.log(response);
    });
}

