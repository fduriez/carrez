var lbcFile = require('./scrapeLBC.js');
var maFile = require('./scrapeMA.js');
var compareFile = require('./compare.js');

var express = require('express');
var app     = express();

var realty = {
    type : "",
    city : "",
    ZIP_code : 0,
    area : 0,
    price : 0 };

var agent = {
    yourPrice : 0,
    lowPrice : 0,
    averagePrice : 0,
    highPrice : 0 ,
    dealType : "" };

app.use(express.static(__dirname + '/views'));

//Maison sans agence
//url = 'https://www.leboncoin.fr/ventes_immobilieres/1052080390.htm?ca=12_s'; //Maison avec agence
//url = 'https://www.leboncoin.fr/ventes_immobilieres/1058287543.htm?ca=12_s'; //Appartement sans agence
//url = 'https://www.leboncoin.fr/ventes_immobilieres/1089921217.htm?ca=12_s'; //Appartement avec agence

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;
app.set('view engine', 'ejs');
app.get("/getdata",function(req,res) {
    url = req.query.url;
    
    lbcFile.leboncoin(res, url, realty, agent, function(res, url, realty, agent) {
        maFile.MeilleursAgents(res, url, realty, agent, function(res, realty, agent) {
            compareFile.Compare(res, realty, agent, function(res, agent) {
                res.render("test",{deal: agent});
            });
        });
    });
});

