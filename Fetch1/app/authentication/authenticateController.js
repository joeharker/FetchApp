/*global app */
app.controller('AuthCtrl', [
    function () {
        'use strict';
        var c = this;

        c.clientId = 'ca_5oSXm50hso4vFBv5IvDHVVklCiUkdP8R';
        c.publishableKey = 'pk_test_LDonp15qE0gZigryIcfweU23';
        c.win = {};

        c.test = function () {
        	c.win = window.open('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=' + c.clientId);
        	//c.win = window.open(document.location.href);
        };

        c.show = function () {
        	console.log(c.win);
        	console.log(c.win.closed);
        };

        return c;
    }]);