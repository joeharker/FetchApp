/*global app */
app.factory('ConfigSrvc', [
function () {
    'use strict';
    var s = {};
    	
    s.version = '1.0.29';

    //*/
    s.stripeClientId = 'ca_5oSXm50hso4vFBv5IvDHVVklCiUkdP8R';   //test
    s.stripeCheckoutKey = 'pk_test_LDonp15qE0gZigryIcfweU23';   //test
    /*/
    s.stripeClientId = 'ca_5oSXcUIhx35b9UvKR7juLkb4pbzeDTgz';   //prod
    s.stripeCheckoutKey = 'pk_live_05MT9JT8ZWe1Q4BethIbziTv';   //prod
    //*/

    s.serviceUrl = 'http://fetch001.azurewebsites.net';
    s.driverCut = 1.00;

    return s;
}]);