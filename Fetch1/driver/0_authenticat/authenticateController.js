﻿/*global app */
app.controller('AuthCtrl', ['guidService', 'ConfigSrvc','DeliverySrvc','$interval','$http',
	//TODO turn into strip service
    function (guidService, ConfigSrvc, DeliverySrvc, $interval, $http) {
        'use strict';
        var c = this;
        var ticker;

        c.guid = guidService.guid();
        c.win = {};

        c.oauth = function (page) {
        	console.log('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=' + ConfigSrvc.stripeClientId + '&state=' + c.guid);
        	c.win = window.open('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=' + ConfigSrvc.stripeClientId + '&state=' + c.guid);

        	//wait for confirmation
        	ticker = $interval(function () {
        		$http.get(ConfigSrvc.serviceUrl + '/api/auth?guid=' + c.guid)
					.then(function (response) {
						console.log(response);
						if (response.data !== "") {
							$interval.cancel(ticker);
							DeliverySrvc.set('myId', response.data);
							c.win.close();
							page.load('driver/1_pickupMap/pickupMap.html');
						}
					}, function (e) {
						console.log(e);
				});
        	}, 1000);
        };

        c.test = function () {
        	c.win.close();
        };

        return c;
    }]);