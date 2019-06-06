/*
*
* File Name: displayStocks.js
* Path: /server/displayStocks.js
*  Method that handle the rendering of HTML
* Author: Justin Hurley
* Version: 1.0
*/
exports.renderDashboard = function(response, buildParams) {

    response.render('dashboard.ejs',{buildParams: buildParams});

};

    
