/*global app */
app.factory('ConfigSrvc', [
function () {
    'use strict';
    var s = {};
    	
    s.stripeClientId = 'ca_5oSXm50hso4vFBv5IvDHVVklCiUkdP8R';
    s.serviceUrl = 'http://fetch001.azurewebsites.net';
    s.driverCut = 0.90;

    return s;
}]);