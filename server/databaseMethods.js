/*
* File Name: databaseMethods.js
* Filed that contains database queries
* Author: Justin Hurley
*
*/
const MongoClient = require('mongodb').MongoClient;
var events = require('events');
var emitter = new events();
exports.events = emitter;

exports.connectDB = function() {
    MongoClient.connect('mongodb+srv://Justinel32p:TdTZFkpyHtRIoRYm@stockmarket-bgshw.mongodb.net/test?retryWrites=true', (err, client) => {
        if (err) return console.log(err);
        exports.db = client.db('stock-market');
    });
}

exports.getFavorites = function(check) {
    if(exports.db) {
        exports.db.collection('favorites').find({}).toArray(function(err, results) {
            if(!check) {
                exports.events.emit('endGetFavorites', results);
            }
            else {
                exports.events.emit('endCheck', results);
            }
        });
    }
}

exports.insertOne = function(body) {
    exports.db.collection('favorites').insertOne(body, (err, result) => {
        if (err) return console.log(err)
    
        console.log('saved to database')
    
      });
}

exports.removeOne = function(stock) {
    exports.db.collection('favorites').deleteOne(stock);
}