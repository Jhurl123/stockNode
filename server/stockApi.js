/*
*
* File Name: StockApi.js
* Path: /server/stockApi.js
* Interact with user request and query the stock api
* Author: Justin Hurley
* Version: 1.0
*/

var https = require('https');
var events = require('events');
var request = require('request');
var emitter = new events();


 exports.events = emitter;

// exports.searchStocks = function(search, query) { 

//     var request = https.get(
//         `https://www.alphavantage.co/query?function=${search.function}&${search.Args}=${query}&apikey=74PSR63N4ICZB6OU`, function(response) {

//         if (response.statusCode !== 200) {
//             console.log("Something went wrong huhuh");
//             request.abort();
//         }
        
//         var body = '';
//         response.on('data', function (chunk) {
//             body += chunk;
//             // emitter.emit('data', body )
//         });

//         response.on('end', function () {
//             if(response.statusCode === 200) {
//                 try {
//                     //Parse the data
//                     var stock = JSON.parse(body);
//                     exports.stock = stock;  
//                     if(stock && search.function == 'SYMBOL_SEARCH') { 
//                         emitter.emit('endSearch', stock);
//                     }
//                     else if(stock && search.function == 'GLOBAL_QUOTE') {
//                         emitter.emit('endSingle', stock);
//                     }
//                     else {
//                         console.log(error);
//                     }
        
//                 } catch (error) {
//                     emitter.emit("error", error);
//                     console.error(error);
//                 }
//             }
//         }).on("error", function(error){
//             console.error("This is another error");
//         });
    
//     });

// }

exports.searchStocks = function(type, symbol) { 

    let args = {
        'search': `stock_search?search_term=${symbol}&search_by=symbol,name&limit=50&page=1&a`,
        'single': `stock?symbol=${symbol}`,
        'modal':  `stock?symbol=${symbol}`,
    }

    var request = https.get(
        `https://api.worldtradingdata.com/api/v1/${args[type]}&api_token=Qrh0oFcsI6UfO58uz1NThfXdD7strhOOhv1FnMWG7imb4Hm2TrhMZT61qR8J`, function(response) {

        if (response.statusCode !== 200) {
            console.log("Something went wrong huhuh");
            request.abort();
        }
        
        var body = '';
        response.on('data', function (chunk) {
            body += chunk;
            // emitter.emit('data', body )
        });

        response.on('end', function () {
            if(response.statusCode === 200) {
                try {
                    //Parse the data
                    var stock = JSON.parse(body);
                    exports.stock = stock;  
                
                    if(stock && type === 'search') { 
                        emitter.emit('endSearch', stock);
                    }
                    else if(stock && type == 'modal') {
                        emitter.emit('endModal', stock);
                    }
                    else if(stock && type  === 'single') {
                        console.log(stock);
                        emitter.emit('endSingle', stock);
                    }
                    else {
                        console.log('error');
                    }
        
                } catch (error) {
                    emitter.emit("error", error);
                    console.error(error);
                }
            }
        }).on("error", function(error){
            console.error("This is another error");
        });
    
    });

}


