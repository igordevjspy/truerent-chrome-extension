var currentUrl = ""
var typeListing = "realEstate"
var subtypeListing = ""

host = 'https';
api_address = '****'

function setDOMInfo(response){
    console.log(response)
    if ((typeof response == 'undefined') || (typeof response.url == 'undefined')){
        document.getElementById("otherWebsiteResponse").style.display= 'block' ;
        document.getElementById("filteredListingResponse").style.display= 'none' ;
        document.getElementById("supportedWebsiteResponse").style.display= 'none' ;  
        document.getElementById('contactTwitter').innerHTML = '<a target="_blank" href="https://twitter.com/intent/tweet?"><img src="img/twitter.png" class="share"></a>'
    }
    else if ((typeof response.filtered != 'undefined') && (response.filtered=="1")){
        document.getElementById("otherWebsiteResponse").style.display= 'none' ;
        document.getElementById("supportedWebsiteResponse").style.display= 'none' ;    
        document.getElementById("filteredListingResponse").style.display= 'block' ;
        document.getElementById('contactTwitterNotSupported').innerHTML = '<a target="_blank" href="https://twitter.com/intent/tweet?"><img src="img/twitter.png" class="share"></a>'
    }
    else{
        currentUrl = response.url
        subtypeListing = response.subtypeListing
        document.getElementById("filteredListingResponse").style.display= 'none' ;
        document.getElementById("otherWebsiteResponse").style.display= 'none' ;
        document.getElementById("supportedWebsiteResponse").style.display= 'block' ;
        document.getElementById('twitter').innerHTML = '<a target="_blank" href="https://twitter.com/intent/tweet?text=Found with @TrueRent' + '&url=' + response.url + '"><img src="img/twitter.png" class="share"></a>'
        document.getElementById('confidenceIndex').innerHTML = '<b><p align="right">Indice de Confiance : ' + response.confidenceIndex + '/10</p></b>'
        var gauge = '<canvas id="gauge"></canvas></br><label id="gaugeLabel" align="center"></label>'
        if (response.subtypeListing=="rent"){
            resp = setDOMInfoRent(response)
        }
        else if (response.subtypeListing=="buy"){
            resp = setDOMInfoBuy(response)
        }
    }
}

function setDOMInfoRent(response){
    document.getElementById('pricem2Value').innerHTML =  response.rentm2
    document.getElementById('priceValue').innerHTML   =  response.rentWoUtilities
    document.getElementById('truerentMin').innerHTML  = response.rentPredWoUtilitiesMin
    document.getElementById('truerentRef').innerHTML  = response.rentPredWoUtilitiesRef
    document.getElementById('truerentMax').innerHTML  = response.rentPredWoUtilitiesMax 
   
    if (response.warning.indexOf("utilitiesPredicted") >= 0) {
        document.getElementById('utilitiesLabel').innerHTML = "<b>Charges estimées</b>"
        document.getElementById('utilitiesValue').innerHTML = response.utilitiesPred

    } else {
        document.getElementById('utilitiesLabel').innerHTML = "<b>Charges</b>"
        document.getElementById('utilitiesValue').innerHTML = response.utilitiesListing
    }

    if (response.displayAlur == 1) {
        var tableRentAlur = '</br><table class="tg"><caption><b>Loyers autorisés (loi Alur ; h.c.)*</b></caption><tr><th class="tg-baqh"><b>Loyer Min</b></th><th class="tg-yw4l"><b>Loyer Ref</b></th><th class="tg-yw4l"><b>Loyer Max</b></th><tr><th class="tg-yw4l">' + response.alurRentMin + '</th><th class="tg-yw4l">' + response.alurRentRef + '</th><th class="tg-yw4l">' + response.alurRentMax + '</th></tr></TABLE>'
        document.getElementById('rentAlur').innerHTML  = tableRentAlur
    }
    createGauge(response,"rent")        
    createPrice2Market(response,"rent")
}

function setDOMInfoBuy(response){
    document.getElementById('pricem2Value').innerHTML =  Math.round(response.buym2)
    document.getElementById('priceValue').innerHTML   =  response.buyListing
    document.getElementById('confidenceIndex').innerHTML = '<b><p align="right">Indice de Confiance : ' + response.confidenceIndex + '/10</p></b>'
    document.getElementById('truerentMin').innerHTML = Math.round(response.buyPredMin)
    document.getElementById('truerentRef').innerHTML = Math.round(response.buyPredRef)
    document.getElementById('truerentMax').innerHTML = Math.round(response.buyPredMax)
    document.getElementById('twitter').innerHTML = '<a target="_blank" href="https://twitter.com/intent/tweet?text=Found with @TrueRent' + '&url=' + response.url + '"><img src="img/twitter.png" class="share"></a>'
    document.getElementById('priceMinLabel').innerHTML = "<b>Prix Min</b>"
    document.getElementById('priceRefLabel').innerHTML = "<b>Prix Estimé</b>"
    document.getElementById('priceMaxLabel').innerHTML = "<b>Prix Max</b>"
    document.getElementById('utilitiesLabel').style.display = "none"
    document.getElementById('utilitiesValue').style.display = "none"
    document.getElementById('pricePredHeader').innerHTML = "TruerenT Index*"
    document.getElementById('priceListing').innerHTML = "<b>Prix</b>"
    createGauge(response,"buy")
    createPrice2Market(response,"buy")
}

function createPrice2Market(response,typeListing){
    if (typeListing == "rent"){
        price2Market = (100*(response.rentListing/response.rentPredRef -1)).toFixed(2);
        if (response.rentListing < response.rentPredMin){
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(43,131,186);">'
            var sign = ""
        }
        else if (response.rentListing < response.rentPredRef){
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(38,114,38);">'
            var sign = ""
        }
        else if (response.rentListing < response.rentPredMax){
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(255,128,0)">'
            var sign = "+"
        }
        else {
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(215,25,28);">'
            var sign = "+"
        }
    }
    else if (typeListing =="buy"){
        price2Market =  (100*(response.buyListing/response.buyPredRef -1 )).toFixed(2);
        if (response.buyListing < response.buyPredMin){
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(43,131,186);">'
            var sign = ""
        }
        else if (response.buyListing < response.buyPredRef){
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(38,114,38);">'
            var sign = ""
        }
        else if (response.buyListing < response.buyPredMax){
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(255,128,0)">'
            var sign = "+"
        }
        else {
            var span = '<b><p align="right">Prix/marché : <span style="color:rgb(215,25,28);">'
            var sign = "+"
        }
    }
    document.getElementById('price2Market').innerHTML = span  + sign + price2Market + '%</span></p></b>'

}

function createGauge(response,typeListing){
    if (typeListing == "rent"){
        var maxPrice = Math.max(response.rentListing, response.rentPredMax)
        var minPrice = Math.min(response.rentListing, response.rentPredMin)
        var minPrice09 = Math.round(minPrice * 0.8)
        var maxPrice11 = Math.round(maxPrice * 1.1)
        var priceMinN = Math.round(response.rentPredMin)
        var priceRefN = Math.round(response.rentPredRef)
        var priceMaxN = Math.round(response.rentPredMax) 
        var priceListing = response.rentListing
    }
    else if (typeListing == "buy"){
        var maxPrice = Math.max(response.buyListing, response.buyPredMax)
        var minPrice = Math.min(response.buyListing, response.buyPredMin)
        var minPrice09 = Math.round(minPrice * 0.8)
        var maxPrice11 = Math.round(maxPrice * 1.1)
        var priceMinN = Math.round(response.buyPredMin)
        var priceRefN = Math.round(response.buyPredRef)
        var priceMaxN = Math.round(response.buyPredMax) 
        var priceListing = response.buyListing
    }

    var opts = {
        lines: 1,
        angle: 0,
        lineWidth: 0.2,
        pointer: {
            length: 0.5,
            strokeWidth: 0.035,
            color: '#ccc'
        },
        staticLabels: {
            font: "10px sans-serif",
            labels: [priceMinN, priceRefN, priceMaxN],
            color: "#000000",
            fractionDigits: 0
        },
        staticZones: [{
                strokeStyle: "#2b83ba",
                min: minPrice09,
                max: priceMinN
            },
            {
                strokeStyle: "#267226",
                min: priceMinN,
                max: priceRefN
            },
            {
                strokeStyle: "#ff8000",
                min: priceRefN,
                max: priceMaxN
            },
            {
                strokeStyle: "#d7191c",
                min: priceMaxN,
                max: maxPrice11
            },
        ],
        limitMax: 'false',
        strokeColor: '#E0E0E0',
        generateGradient: true
    };
    var target = document.getElementById('gauge');
    var gauge = new Gauge(target).setOptions(opts);
    gauge.minValue = minPrice09;
    gauge.maxValue = maxPrice11;
    gauge.animationSpeed = 8;
    gauge.set(priceListing);
    if (typeListing=="rent"){
        document.getElementById('gaugeLabel').innerHTML = priceListing + ' c.c';
    }
    else if (typeListing=="buy"){
        document.getElementById('gaugeLabel').innerHTML = priceListing;
    }
}

$(function () {
    $('#priceCorrect').click(function () {
        var data = {
            url: currentUrl,
            country:"fr",
            type:"realEstate",
            subtype:subtypeListing,
            typeError:"priceCorrect"
        };
        $.ajax({
            type: "POST",
            url: host + '://' + api_address + '/api/extension/errorPrice',
            cache: true,
            data: data,
            dataType: "json",
            statusCode: {
                404: function(response) {
                }
            }
        }).success(function(response) {
            $('#priceCorrect').prop('disabled', true);
            $('#priceTooHigh').prop('disabled', true);
            $('#priceTooLow').prop('disabled', true);
            document.getElementById('priceFeedback').innerHTML = "merci pour votre feedback";
        })
      });
});

$(function () {
    $('#priceTooLow').click(function () {
        var data = {
            url: currentUrl,
            country:"fr",
            type:"realEstate",
            subtype:subtypeListing,
            typeError:"priceTooLow"
        };
        $.ajax({
            type: "POST",
            url: host + '://' + api_address + '/api/extension/errorPrice',
            cache: true,
            data: data,
            dataType: "json",
            statusCode: {
                404: function(response) {
                }
            }
        }).success(function(response) {
            $('#priceCorrect').prop('disabled', true);
            $('#priceTooHigh').prop('disabled', true);
            $('#priceTooLow').prop('disabled', true); 
            document.getElementById('priceFeedback').innerHTML = "merci pour votre feedback";
        })
      });
});

$(function () {
    $('#priceTooHigh').click(function () {
        var data = {
            url: currentUrl,
            country:"fr",
            type:"realEstate",
            subtype:subtypeListing,
            typeError:"priceTooHigh"
        };
        $.ajax({
            type: "POST",
            url: host + '://' + api_address + '/api/extension/errorPrice',
            cache: true,
            data: data,
            dataType: "json",
            statusCode: {
                404: function(response) {
                }
            }
        }).success(function(response) {
            $('#priceCorrect').prop('disabled', true);
            $('#priceTooHigh').prop('disabled', true);
            $('#priceTooLow').prop('disabled', true);
            document.getElementById('priceFeedback').innerHTML = "merci pour votre feedback";
          })
      });
});

window.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        setDOMInfo);
  });
});
