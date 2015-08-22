/*global app */
app.controller('AuthCtrl', ['guidService',
	//TODO turn into strip service
    function (guidService) {
        'use strict';
        var c = this;

        c.clientId = 'ca_5oSXm50hso4vFBv5IvDHVVklCiUkdP8R';
        c.publishableKey = 'pk_test_LDonp15qE0gZigryIcfweU23';
        c.guid = guidService.guid();
        c.win = {};

        c.oauth = function () {
        	c.win = window.open('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=' + c.clientId + '&state=' + c.guid);
        	//TODO pull for the authenticated c.guid
			//then c.win.close();
        };

        c.test = function () {
        	c.win.close();
        };

        return c;
    }]);