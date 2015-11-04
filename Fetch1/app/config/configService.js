/*global app */
app.factory('ConfigSrvc', [
function () {
    'use strict';
    var s = {};
    	
    s.version = '1.0.15';
    s.stripeClientId = 'ca_5oSXm50hso4vFBv5IvDHVVklCiUkdP8R';
    s.stripeCheckoutKey = 'pk_test_LDonp15qE0gZigryIcfweU23';
    s.serviceUrl = 'http://fetch001.azurewebsites.net';
    s.driverCut = 0.90;

    return s;
}]);