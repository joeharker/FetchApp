/*global app */
app.controller('AuthCtrl', ['GuidService', 'ConfigSrvc','DeliverySrvc','$interval','$http',
	//TODO turn into strip service
    function (GuidService, ConfigSrvc, DeliverySrvc, $interval, $http) {
        'use strict';
        var c = this;
        var ticker;

        c.guid = GuidService.guid();
        c.win = {};

        c.oauth = function (page) {
        	c.win = window.open('https://connect.stripe.com/oauth/authorize?response_type=code&scope=read_write&client_id=' + ConfigSrvc.stripeClientId + '&state=' + c.guid + '&stripe_user[business_name]=Neighborhood driver&stripe_user[business_type]=sole_prop&stripe_user[physical_product]=false&stripe_user[url]=http://www.fetch1.com/', '_blank');

        	//wait for confirmation
        	ticker = $interval(function () {
        		$http.get(ConfigSrvc.serviceUrl + '/api/auth?guid=' + c.guid)
					.then(function (response) {
						if (response.data !== "") {
							$interval.cancel(ticker);
							DeliverySrvc.set('myId', response.data);
							c.win.close();
							page.load('driver/1_pickupMap/pickupMap.html');
						}
					}, function (e) {
						//This happens first try if the service is sleeping
				});
        	}, 1000);
        };

        c.test = function () {
        	c.win.close();
        };

        return c;
    }]);