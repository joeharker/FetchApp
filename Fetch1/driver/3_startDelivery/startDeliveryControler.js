/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc','EnumSrvc','mapService',
function (locationService, $interval, $http, ConfigSrvc, EnumSrvc, mapService) {
	var c = this;
	var ticker = {};

	c.latLngUrl = "";
	
	c.init = function (form) {
		mapService.getGeoUrl(form.data.delivery)
		.then(function (latLngUrl) {
			c.latLngUrl = latLngUrl;
		});

		$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + form.data.deliveryId + '&driverId=' + form.myId)
			.then(function (response) {
				c.message = 'Waiting for customer payment';

				ticker = $interval(function () {
					$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + form.data.deliveryId)
						.then(function (driverResponse) {
							if (driverResponse.data === EnumSrvc.NextNeed.Pickup) {
								$interval.cancel(ticker);
								c.message = 'Payment is in holding account Please pick up the package';
							}
						});
				}, 5000);
			}, function (e) {
				c.message = 'An error has occured';
		});
	};
	

	return c;
}]);