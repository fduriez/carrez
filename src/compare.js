exports.Compare = function (res, realty, agent, callback) {
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
    	agent.dealType = "Very Good Deal";
    }
    else if(areaPrice < lowPrice + (averagePrice - lowPrice)*(2/3)) {
    	agent.dealType = "Good Deal";
    }
    else if(areaPrice < averagePrice + (highPrice - averagePrice)*(1/3)) {
    	agent.dealType = "Reasonable Deal";
    }
    else if(areaPrice < highPrice) {
    	agent.dealType = "Bad Deal";
    }
    else if(areaPrice > highPrice) {
    	agent.dealType = "Very Bad Deal";
    }
    else {
    	agent.dealType = "Error Calcul";
    }

    console.log(agent.dealType);
    callback(res, agent);
}