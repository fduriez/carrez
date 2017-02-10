var request = require('request');
var cheerio = require('cheerio');

exports.MeilleursAgents = function (res, url, realty, agent, callback) {
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
        callback(res, realty,agent);
    })
    
}

