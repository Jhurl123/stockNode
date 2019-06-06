/*
* File Name: app.js
* Main File that handles routing and database work(for now)
*
*
*/
var exports = module.exports = {};
var server = require('./server/server');
var express = require('express');
var bodyParser = require('body-parser');
var apiCalls = require('./server/stockApi');
var db       = require('./server/databaseMethods');
var displayStocks = require('./modules/displayStocks');

// Connect to the database and start server
 // whatever your database name is
db.connectDB();
server.app.listen(1000);
server.app.use('/static', express.static('static'));


//Here we are configuring express to use body-parser as middle-ware.\
//Allows express tho read the POST form data
server.app.use(bodyParser.urlencoded({ extended: false }));
server.app.use(bodyParser.json());


server.app.get('/dashboard', function(request, response) {
    
    // const apiMethod = {
    //     'function': 'GLOBAL_QUOTE',
    //     'Args': 'symbol'
    // };

    var buildParams = {}
    var callType = 'single';
    buildParams.title = 'Stock-X - Your Stocks Now';
    buildParams.stockArray = [];
    
    //gets All Objects from the database collection 'favorites'
    db.getFavorites();

    //event emitted when db get favorites returns
    db.events.once('endGetFavorites', function(results) {
        console.log("second dash");
        //calls this event for every favorites object in the db
        let stocksArray = results.map(result => {
            return result.Stock;
        });

        let stockList = stocksArray.join(',');
        
        console.log(callType);
        apiCalls.searchStocks(callType, stockList);

        //Stores results of call to the build params object
        buildParams.results = results;

    });

    //Event that renders the'/dashboard' route once onject to send has been built
    apiCalls.events.once('favorites', function(stocks) {
        displayStocks.renderDashboard(response, buildParams);
    });
        
    //Event that builds favorite stocks object, then emits 'favorites' event
    apiCalls.events.on('endSingle', function(stockList) {
    
        stockList['data'].forEach(stock => {
    
            //if stock data not correct throw error  here
            let stockPercentage = stock['change_pct'];
            let stockHigh       = stock['day_high'];
            stockHigh           = parseFloat(stockHigh, 10);

            let stockStats = {
                'symbol': stock['symbol'],
                'name':  stock['name'],
                'percentChange': stockPercentage,
                'high': stockHigh
            };

            //TODO loop throigh here and
            //populate stock array
            buildParams.stockArray.push(stockStats);
            console.log(buildParams.stockArray);

        });

        if(stockList) {
            if(buildParams.stockArray.length === buildParams.results.length) {
                apiCalls.events.emit('favorites', buildParams.stockArray);
            }

        }

    } );

});

// Sends Search query to api
//renders the results page
server.app.post('/results', function (request, response) {

    let callType = 'search';
    var buildParams = {};
    var favorites = {};

    //This call gathers search results
    apiCalls.searchStocks(callType, request.body.stock);

     //event called once the API search is complete
     apiCalls.events.once('endSearch', function(stocks) {
        db.getFavorites();
       // console.log(stocks);
        buildParams.results = stocks;
     });

    //event emitted by favorites db query
    db.events.once('endGetFavorites', function(results) {

        //Stores results of call to the build params object
        apiCalls.events.emit('renderMethod', results);

    });
    //event called once the API search is complete
    apiCalls.events.once('renderMethod', function(favorites) {

       // console.log(buildParams.results);
        // Get all favorites from the database     
         searchResults = buildParams.results['data'].map( stock => {
            return stock;
        });

        try {
            
            // TODO issue here pick up on 5/31
            // Just load the info on click of the card, not for every result at once
            // so ajax on click of a card
            buildParams.stock = searchResults;
            let present = [];   
            // determine if a stock that is searched for is already in the users' favorites
            for(let i = 0; i < buildParams.stock.length; i++) {
                for(let j = 0; j < favorites.length; j++){

                 
                    if(buildParams.stock[i]['symbol'] == favorites[j].Stock) {
                
                        present.push(favorites[j]);
                    }
                }
            }
            buildParams.title = 'Search Results';
            buildParams.present = present;
            response.render('results.ejs',{buildParams: buildParams});
            
        }
        catch(error) {
            response.end();
            console.log(error);
            return;
        }
        
    } );

    return;
});

//POST route that isn't a page
// Inserts the stock to DB
server.app.post('/addStock', function(request, response) {
  
    //Inserts to database "table"
    // Possibly insert position of card next?
    db.insertOne(request.body);

});

//Removes stock from favorites
server.app.post('/removeStock', function(request, response) {

    db.removeOne(request.body);
});

// View Stock Modal
// Means that the event will need to be put into sepatrate events module
server.app.post('/viewStock', function(request, response) {

    db.getFavorites('check');
    let callType = 'modal';
    var buildParams = {};
    db.events.once('endCheck', function(favorites) {
       
        buildParams.favorites = favorites;
        apiCalls.searchStocks(callType, request.body.Stock);
    });

    apiCalls.events.once('endModal', function(stock) {

        let stockPercentage = stock['data'][0]['change_pct'];
        let stockHigh       = stock['data'][0]['day_high'];
        stockHigh           = parseFloat(stockHigh, 10);

        let stockStats = {
            'symbol': stock['data'][0]['symbol'],
            'name':  stock['data'][0]['name'],
            'percentChange': stockPercentage,
            'high': stockHigh
        };

        //TODO loop throigh here and
        //populate stock array
       
        for(let i = 0; i < buildParams.favorites.length; i++) {
            if(stockStats['symbol'] == buildParams.favorites[i].Stock ) {
                stockStats.present = 'yes'
                break;
            }   
        }

        response.writeHead(200, { 'Content-Type': 'application/json' });  
        response.end(JSON.stringify(stockStats), "utf-8"); 

    })

});