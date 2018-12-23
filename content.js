mode = 'prod';
if (mode === 'test') {
    host = 'http';
    api_address = 'localhost:1223'
} else {
    host = 'https';
    api_address = '*****:8000'
}

delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms)
    }
})();

function waitForElement(elementPath, callBack){
  window.setTimeout(function(){
    if($(elementPath).length){
      callBack(elementPath, $(elementPath));
    }else{
      waitForElement(elementPath, callBack);
    }
  },500)
}

var responseGlobal = {};
if (document.domain.indexOf('leboncoin') > -1 && location.pathname.indexOf('locations') > -1 && location.pathname.indexOf('offres') < 0) {
    getRent("leBonCoin")
}

if (document.domain.indexOf('pap') > -1 && location.pathname.indexOf('annonce') > -1){
    var title = document.getElementsByClassName("title")[0].innerHTML;

    if (title.indexOf("Location")>-1){
        getRent("pap")
    }
}

if (document.domain === 'www.explorimmo.com' && location.pathname.indexOf('annonce-') > -1) {
    h1 = document.getElementsByClassName("container-h1")[0].innerHTML;
    if (h1.indexOf('Location') > -1){
        getRent("explorimmo")
    }
}

if (document.domain === 'www.seloger.com' && location.pathname.indexOf('locations') > -1  && location.pathname.indexOf("/appartement/")>-1){
    waitForElement(".categorie",function(){
        getRent("seloger");
    });
}

if (document.domain === 'www.logic-immo.com' && location.pathname.indexOf('detail-location') > -1) {
    getRent("logicImmo")
}


if (document.domain.indexOf('leboncoin') > -1 && location.pathname.indexOf('ventes_immobilieres') > -1 && location.pathname.indexOf('offres') < 0) {
    getPrice("leBonCoin")
}

if (document.domain.indexOf('pap') > -1 && location.pathname.indexOf('annonce') > -1){
    var title = document.getElementsByClassName("title")[0].innerHTML;
    if (title.indexOf("Vente")>-1){
        getPrice("pap")
    }
}

if (document.domain === 'www.explorimmo.com' && location.pathname.indexOf('annonce-') > -1) {
    h1 = document.getElementsByClassName("container-h1")[0].innerHTML;
    if (h1.indexOf('Vente') > -1){
        getPrice("explorimmo")
    }
}

if (document.domain === 'www.seloger.com' && location.pathname.indexOf('achat') > -1) {
    getPrice("seloger")
}

if (document.domain === 'www.logic-immo.com' && location.pathname.indexOf('detail-vente') > -1) {
    getPrice("logicImmo")
}

function createPopupRent(response) {
    response['url'] = window.location.href
    responseGlobal = response
    var rentMinN = Math.round(response.rentPredWoUtilitiesMin)
    var rentRefN = Math.round(response.rentPredWoUtilitiesRef)
    var rentMaxN = Math.round(response.rentPredWoUtilitiesMax)
    if (response.filtered!="1"){
        if (response.warning.indexOf("utilitiesPredicted") >= 0) {
        var utilitiesV = response.utilitiesPred
        } else {
            var utilitiesV = response.utilitiesListing
        }

        if (response.rentWoUtilities < rentMinN){
            var color = 'blue'
        }
        else if (response.rentWoUtilities < rentRefN){
            var color = 'green'
        }
        else if (response.rentWoUtilities < rentMaxN){
            var color = 'orange'
        }
        else  if (response.rentWoUtilities >= rentMaxN) {
            var color = 'red'
        }
    }
    else {
        var color = 'na'
    }
    chrome.runtime.sendMessage({
        from:    'content',
        subject: 'badge',
        color:color,
        value: Math.round(response.rentPredWoUtilitiesRef + utilitiesV).toString()
    });
}

function createPopupBuy(response) {

    response['url'] = window.location.href
    responseGlobal = response
    
    var buyMinN = Math.round(response.buyPredMin)
    var buyRefN = Math.round(response.buyPredRef)
    var buyMaxN = Math.round(response.buyPredMax)


    if (response.buyListing < buyMinN){
        var color = 'blue'
    }
    else if (response.buyListing < buyRefN){
        var color = 'green'
    }
    else if (response.buyListing < buyMaxN){
        var color = 'orange'
    }
    else if (response.buyListing >= buyMaxN){
        var color = 'red'
    }
    else {
        var color = 'na'
    }

    buyPredRefString = Math.round(response.buyPredRef).toString()
    if (buyPredRefString.length == 6){
        buyPredRefString = buyPredRefString.substring(0,3) + "k"
    }
    else if (buyPredRefString.length > 6){
        buyPredRefString = buyPredRefString[0] + "." + buyPredRefString.substring(1,2)  + "m"

    }
    chrome.runtime.sendMessage({
        from:    'content',
        subject: 'badge',
        color:color,
        value: buyPredRefString
    });
}

function getRent(provider) {
    var data = {
        provider:provider,
        domain: document.domain,
        url: window.location.href,
        innerHtml:"",
        country:"fr",
        type:"realEstate",
        subtype:"rent",
        force:"False"
    };
    $.ajax({
        type: "POST",
        url: host + '://' + api_address + '/api/extension/getPrice',
        cache: true,
        data: data,
        dataType: "json",
        statusCode: {
            404: function(response) {
            }
        }
    }).success(function(response) {
        console.log(response)
        if (response.resp == '-1'){
            data['innerHtml'] = document.documentElement.innerHTML
            data['force'] = "True"
            $.ajax({
                type: "POST",
                url: host + '://' + api_address + '/api/extension/getPrice',
                cache: true,
                data: data,
                dataType: "json",
                statusCode: {
                    404: function(response) {
                    }
                }
            }).success(function(response){
                createPopupRent(response.resp)
            })
        }
        else{
            createPopupRent(response.resp)

        }
    })
}

function getPrice(provider) {
    var data = {
        provider:provider,
        domain: document.domain,
        url: window.location.href,
        innerHtml:"",
        country:"fr",
        type:"realEstate",
        subtype:"buy",
        force:"False"
    };
    $.ajax({
        type: "POST",
        url: host + '://' + api_address + '/api/extension/getPrice',
        cache: true,
        data: data,
        dataType: "json",
        statusCode: {
            404: function(response) {
            }
        }
    }).success(function(response) {
        if (typeof response.resp.url == 'undefined'){
            data['innerHtml'] = document.documentElement.innerHTML
            data['force'] = "True"
            $.ajax({
                type: "POST",
                url: host + '://' + api_address + '/api/extension/getPrice',
                cache: true,
                data: data,
                dataType: "json",
                statusCode: {
                    404: function(response) {
                    }
                }
            }).success(function(response){
                createPopupBuy(response.resp)
            })
        }
        else{
            createPopupBuy(response.resp)
        }
    })
}

chrome.runtime.sendMessage({
  from:    'content',
  subject: 'showPageAction'
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    var domInfo = responseGlobal ; 
    response(domInfo);
  }
});