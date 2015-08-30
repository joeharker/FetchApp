/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc','EnumSrvc','mapService',
function (locationService, $interval, $http, ConfigSrvc, EnumSrvc, mapService) {
	var c = this;
	var ticker = {};
	c.form = {};
	c.page = {};
	c.latLngUrl = "";
	
	c.init = function (form, page) {
		c.form = form;
		c.page = page;

		mapService.getGeoUrl(form.data.pickup)
		.then(function (latLngUrl) {
			c.latLngUrl = latLngUrl;
		});

		$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + form.data.deliveryId + '&driverId=' + form.myId)
			.then(function (response) {
				c.message = 'Waiting for customer payment';

				ticker = $interval(function () {
					$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
						.then(function (status) {
							if (status.data.nextNeed === EnumSrvc.NextNeed.Pickup) {
								$interval.cancel(ticker);
								c.message = 'Payment is in holding account Please pick up the package';
								c.track();
							}
						});
				}, 5000);
			}, function (e) {
				c.message = 'An error has occured';
		});
	};

	c.track = function () {
		ticker = $interval(function () {
			$http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + c.form.myId + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
		}, 5000);
	};

	return c;
}]);