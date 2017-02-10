var lbcFile = require('./scrapeLBC.js');

var express = require('express');
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
    highPrice : 0 ,
    dealType : "" };

app.use(express.static(__dirname + '/public'));

url = 'https://www.leboncoin.fr/ventes_immobilieres/1087339301.htm?ca=12_s'; //Maison sans agence
//url = 'https://www.leboncoin.fr/ventes_immobilieres/1052080390.htm?ca=12_s'; //Maison avec agence
//url = 'https://www.leboncoin.fr/ventes_immobilieres/1058287543.htm?ca=12_s'; //Appartement sans agence
//url = 'https://www.leboncoin.fr/ventes_immobilieres/1089921217.htm?ca=12_s'; //Appartement avec agence

app.listen('8080')
console.log('Magic happens on port 8080');
exports = module.exports = app;

lbcFile.leboncoin(url, realty, agent);
