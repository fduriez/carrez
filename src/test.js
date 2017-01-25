var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var json = {
    type : "",
    city : "",
    ZIP_code : 0,
    area : 0,
    price : 0 };

app.get('/scrape', function(req, res){
    // The URL we will scrape from - in our example Anchorman 2.

    url = 'https://www.leboncoin.fr/ventes_immobilieres/1076257949.htm?ca=12_s';
    //url = 'https://www.leboncoin.fr/ventes_immobilieres/1083561677.htm?ca=12_s';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html
    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            $('span.value:nth-child(3)').filter(function(){
                var price;
                var data = $(this);
                price = data.text();
                while (price[0] < 1 || price[0] >10){
                    price = price.slice(1);
                }
                price = price.slice(0, price.indexOf("€") + 1);
                json.price = price;
            })

            $('div.line:nth-child(6) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                var city;
                var ZIP_code;
                var data = $(this);
                city = data.text();
                ZIP_code = city.slice(city.indexOf(" ") + 1, city.indexOf(" ") + 6);
                city = city.slice(0, city.indexOf(" "));
                json.ZIP_code = ZIP_code;
                json.city = city;
            })

            $('div.line:nth-child(7) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                var type;
                var data = $(this);
                type = data.text();
                json.type = type;
            })

            $('div.line:nth-child(9) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                var area;
                var data = $(this);
                area = data.text();
                json.area = area;
            })
            console.log(json);
            /*url = 'https://www.meilleursagents.com/prix-immobilier/';
            url += json.city.toLowerCase();
            url += "-";
            url += json.ZIP_code;
            console.log(url);*/
        }
    })
    

    /*console.log(url);

    request(url, function(error, response, html){

        if(!error){

            var $ = cheerio.load(html);

        }
    })*/
})

app.listen('8080')
console.log('Magic happens on port 8080');
exports = module.exports = app;

console.log(json);

/*Exo 2*/
/*
var result = 0;

for (var i = 2; i < process.argv.length; i++) {
  result += Number(process.argv[i]);
}

console.log(result);
*/
