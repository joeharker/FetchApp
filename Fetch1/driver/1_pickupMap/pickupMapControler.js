/*global app */
app.controller('PickupMapControler', ['mapService', 'locationService', '$interval', '$http', 'ConfigSrvc', 'MemorySrvc','DeviceSrvc',
function (mapService, locationService, $interval, $http, ConfigSrvc, MemorySrvc, DeviceSrvc) {
	var c = this;
	var ticker = {};
	c.form = {};
	c.page = {};
	c.message = 'Finding your location';
	c.mapMarkers = [];

	c.init = function (form, page) {
		c.form = form;
		c.page = page;
		ticker = $interval(function () {
			if (locationService.position.latitude !== locationService.initLat && locationService.position.longitude !== locationService.initLon) {
				$interval.cancel(ticker);
				c.message = 'Finding delivery opportunities';
				startUpdates();
			}
		}, 1000);
	};

	var startUpdates = function () {
	    var lastpincount = 0;
	    mapService.centerMap(locationService.position.latitude, locationService.position.longitude);
		ticker = $interval(function () {
			$http.get(ConfigSrvc.serviceUrl + '/api/delivery?lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude)
				.then(function (response) {
				    c.message = 'Click a pickup to view the request';

				    //buzz if there are new pins
				    if (response.data.length > lastpincount) {
			            DeviceSrvc.buzz();
				    }
				    lastpincount = response.data.length;

			        //clear old markers
					mapService.clearPins();

					//add new markers
					angular.forEach(response.data, function (pin, i) {
						mapService.addPinAddress(
							pin.pickup
							, function () {
								$interval.cancel(ticker);

								c.form.data = pin;
								c.form.saveData();
						        MemorySrvc.set("deliveryId", c.form.data.deliveryId);

								c.page.load('driver/2_viewDeliver/viewDelivery.html');
							}
						);
						
					});
				}, function (e) {
					c.message = 'Finding Network';
				});
		}, 5000);
	};

	return c;
}]);