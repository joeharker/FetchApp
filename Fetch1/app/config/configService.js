/*global app */
app.factory('ConfigSrvc', [
function () {
    'use strict';
    var s = {};
    	
    s.version = '1.0.21';
    s.stripeClientId = 'ca_5oSXm50hso4vFBv5IvDHVVklCiUkdP8R';
    //s.stripeCheckoutKey = 'pk_test_LDonp15qE0gZigryIcfweU23';   //test
    s.stripeCheckoutKey = 'pk_live_05MT9JT8ZWe1Q4BethIbziTv';   //prod
    s.serviceUrl = 'http://fetch001.azurewebsites.net';
    s.driverCut = 0.90;

    return s;
}]);