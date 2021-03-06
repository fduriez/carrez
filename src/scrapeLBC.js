var request = require('request');
var cheerio = require('cheerio');

exports.leboncoin = function (res, url, realty, agent, callback) {
    console.log('****************** Début accès leboncoin **************************');
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

            callback(res, url, realty, agent, callback);
        }
    })
}
