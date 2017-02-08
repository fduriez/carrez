var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var realty = {
    type : "",
    city : "",
    ZIP_code : 0,
    area : 0,
    price : 0 };

var agent = {
    lowPrice : 0,
    averagePrice : 0,
    highPrice : 0 };

app.get('/scrape', function(req, res){
    // The URL we will scrape from - in our example Anchorman 2.
    console.log('****************** Début accès leboncoin **************************');

    url = 'https://www.leboncoin.fr/ventes_immobilieres/1087339301.htm?ca=12_s'; //Maison sans agence
    //url = 'https://www.leboncoin.fr/ventes_immobilieres/1052080390.htm?ca=12_s'; //Maison avec agence
    //url = 'https://www.leboncoin.fr/ventes_immobilieres/1058287543.htm?ca=12_s'; //Appartement sans agence
    //url = 'https://www.leboncoin.fr/ventes_immobilieres/1089921217.htm?ca=12_s'; //Appartement avec agence

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html
    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            //Récupère le prix
            $('span.value:nth-child(3)').filter(function(){
                var price;
                var data = $(this);
                price = data.text();
                while (price[0] < 1 || price[0] >10){
                    price = price.slice(1);
                }
                price = price.slice(0, price.indexOf("€") + 1);
                realty.price = price;
            })

            //Récupère la ville et le code postal
            $('div.line:nth-child(6) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                var city;
                var ZIP_code;
                var data = $(this);
                city = data.text();
                ZIP_code = city.slice(city.indexOf(" ") + 1, city.indexOf(" ") + 6);
                city = city.slice(0, city.indexOf(" "));
                realty.ZIP_code = ZIP_code;
                realty.city = city;
            })

            //Récupère le type de bien 
            $('div.line:nth-child(7) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                var type;
                var data = $(this);
                type = data.text();
                realty.type = type;
            })

            //Si vendeur pro realtyType peut contenir les frais d'agence au lieu du type de bien
            var pro = false;
            if((realty.type != "Maison") && (realty.type != "Appartement")) {
                $('div.line:nth-child(8) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                    var type;
                    var data = $(this);
                    type = data.text();
                    realty.type = type;
                })
                pro = true;
            }

            //Si vendeur pro le conteneur de la surface est décalé
            if(!pro) {
                $('div.line:nth-child(9) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                    var area;
                    var data = $(this);
                    area = data.text();
                    realty.area = area;
                })
            }
            else if(pro) {
                $('div.line:nth-child(10) > h2:nth-child(1) > span:nth-child(2)').filter(function(){
                    var area;
                    var data = $(this);
                    area = data.text();
                    realty.area = area;
                })
            }

            //Affiche les résultats
            console.log('Résultat : ');
            console.log(realty);

            //Gère l'url MeilleursAgents 
            url = 'https://www.meilleursagents.com/prix-immobilier/';
            url += realty.city.toLowerCase();
            url += "-";
            url += realty.ZIP_code;

            console.log(url);
            console.log('********************************************');

            MeilleursAgents(url);
        }
    })
})

app.listen('8080')
console.log('Magic happens on port 8080');
exports = module.exports = app;


function MeilleursAgents (url) {
    console.log('******************* Début accès Meilleurs Agents *************************');
    console.log('je suis dans ma fonction');
    console.log('url : ');
    console.log(url);
    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html
    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request
        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            if(realty.type == "Maison") {
                //Prix Bas m²
                $('div.medium-uncollapse:nth-child(3) > div:nth-child(2)').filter(function(){
                    var data = $(this);
                    var price = data.text();
                    while (price[0] < 1 || price[0] >10){
                        price = price.slice(1);
                    }
                    price = price.slice(0, price.indexOf("€") + 1);
                    agent.lowPrice = price;
                })

                //Prix Moyen m²
                $('div.medium-uncollapse:nth-child(3) > div:nth-child(3)').filter(function(){
                    var data = $(this);
                    var price = data.text();
                    while (price[0] < 1 || price[0] >10){
                        price = price.slice(1);
                    }
                    price = price.slice(0, price.indexOf("€") + 1);
                    agent.averagePrice = price;
                })

                //Prix Haut m²
                $('div.medium-uncollapse:nth-child(3) > div:nth-child(4)').filter(function(){
                    var data = $(this);
                    var price = data.text();
                    while (price[0] < 1 || price[0] >10){
                        price = price.slice(1);
                    }
                    price = price.slice(0, price.indexOf("€") + 1);
                    agent.highPrice = price;
                })
            }
            else if(realty.type == "Appartement") {
                //Prix Bas m²
                $('div.medium-uncollapse:nth-child(2) > div:nth-child(2)').filter(function(){
                    var data = $(this);
                    var price = data.text();
                    while (price[0] < 1 || price[0] >10){
                        price = price.slice(1);
                    }
                    price = price.slice(0, price.indexOf("€") + 1);
                    agent.lowPrice = price;
                })
                
                //Prix Moyen m²
                $('div.medium-uncollapse:nth-child(2) > div:nth-child(3)').filter(function(){
                    var data = $(this);
                    var price = data.text();
                    while (price[0] < 1 || price[0] >10){
                        price = price.slice(1);
                    }
                    price = price.slice(0, price.indexOf("€") + 1);
                    agent.averagePrice = price;
                })

                //Prix Haut m²
                $('div.medium-uncollapse:nth-child(2) > div:nth-child(4)').filter(function(){
                    var data = $(this);
                    var price = data.text();
                    while (price[0] < 1 || price[0] >10){
                        price = price.slice(1);
                    }
                    price = price.slice(0, price.indexOf("€") + 1);
                    agent.highPrice = price;
                })
            }
            console.log('Resultat : ');
            console.log(agent);
            console.log('********************************************');
        }
        Compare();
    })
    
}

function Compare () {
	var price = realty.price.replace(/\s/g,"");
    price = parseInt(price);
    var area = parseInt(realty.area);
    var areaPrice = price/area;
    
    console.log("price by m² : " + areaPrice);
    
    var lowPrice = agent.lowPrice.replace(/\s/g,"");
    lowPrice =parseInt(lowPrice);
    var averagePrice = agent.averagePrice.replace(/\s/g,"");
    averagePrice =parseInt(averagePrice);
    var highPrice = agent.highPrice.replace(/\s/g,"");
    highPrice =parseInt(highPrice);

    console.log(lowPrice);
    console.log(averagePrice);
    console.log(highPrice);

    if(areaPrice < lowPrice) {
    	console.log("Very Good Deal");
    }
    else if(areaPrice < lowPrice + (averagePrice - lowPrice)*(2/3)) {
    	console.log("Good Deal");
    }
    else if(areaPrice < averagePrice + (highPrice - averagePrice)*(1/3)) {
    	console.log("Reasonable Deal");
    }
    else if(areaPrice < highPrice) {
    	console.log("Bad Deal");
    }
    else if(areaPrice > highPrice) {
    	console.log("Very Bad Deal");
    }
    else {
    	console.log("Error Calcul");
    }
}
