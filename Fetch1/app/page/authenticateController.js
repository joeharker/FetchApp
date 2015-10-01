/*global app */
app.controller('AuthCtrl', ['GuidService', 'ConfigSrvc', 'MemorySrvc', '$interval', '$http','DeviceSrvc',
	//TODO turn into strip service
    function (GuidService, ConfigSrvc, MemorySrvc, $interval, $http, DeviceSrvc) {
        'use strict';
        var c = this;
        var ticker;

        c.guid = GuidService.guid();
        c.win = {};
        c.newer = false;
        c.next = '';

        c.oauth = function (page) {
        	c.win = window.open('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&client_id=' + ConfigSrvc.stripeClientId + '&state=' + c.guid + '&stripe_user[business_name]=Neighborhood driver&stripe_user[business_type]=sole_prop&stripe_user[physical_product]=false&stripe_user[url]=http://www.fetch1.com/', '_blank');

        	//wait for confirmation
        	ticker = $interval(function () {
        		$http.get(ConfigSrvc.serviceUrl + '/api/auth?guid=' + c.guid)
					.then(function (response) {
						if (response.data !== "") {
							$interval.cancel(ticker);
							MemorySrvc.set('myId', response.data);
							c.win.close();
							page.load('driver/1_pickupMap/pickupMap.html');
						}
					}, function (e) {
						//This happens first try if the service is sleeping
				});
        	}, 1000);
        };

    	//check version
        c.checkVersion = function (ver) {
        	$http.get(ConfigSrvc.serviceUrl + '/api/app')
				.then(function (response) {
					if (response.data !== ver) {
						c.next = response.data;
						c.newer = true;
					}
				}, function (e) {
					//This happens first try if the service is sleeping
				}
			);
        };

        c.upgrade = function () {
            window.open('https://build.phonegap.com/apps/1076244/install', '_system');
            MemorySrvc.reset();
        	DeviceSrvc.exit();
        };

        return c;
    }]);