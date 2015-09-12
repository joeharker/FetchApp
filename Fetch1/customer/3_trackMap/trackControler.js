﻿/*global app */
app.controller('TrackControler', ['mapService', 'locationService', '$interval', '$http', 'ConfigSrvc', 'MemorySrvc', 'cameraService',
function (mapService, locationService, $interval, $http, ConfigSrvc, MemorySrvc, cameraService) {
	var c = this;
	var ticker = {};
	c.message = 'Finding your location';
	c.form = {};
	c.page = {};
	c.pickSrc = cameraService.transparent;
	c.dropSrc = cameraService.transparent;
	c.accept = false;

	c.init = function (form, page) {
		c.form = form;
		c.page = page;

		ticker = $interval(function () {
			$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
				.then(function (status) {
					//clear old markers
					mapService.clearPins();

					//update the driver location
					mapService.addPinLatLon(
						status.data.lat
						,status.data.lon
						, function () {
							//no click function for now
						}
					);

					switch(status.data.nextNeed) {
						case 2:
							c.message = 'Approaching pickup';
							break;
						case 3:
							c.message = 'Aproaching drop off';
							if (c.pickSrc === cameraService.transparent) {
								$http.get(ConfigSrvc.serviceUrl + '/api/pickup?deliveryId=' + c.form.data.deliveryId)
									.then(function (photo) {
										c.pickSrc = photo.data;
									}, function (x) {
										c.message = 'Internet connection error';
									});
							}
							break;
						case 4:
							c.message = 'Delivery has arived';
							if (c.dropSrc === cameraService.transparent) {
								c.accept = true;
								$http.get(ConfigSrvc.serviceUrl + '/api/drop?deliveryId=' + c.form.data.deliveryId)
									.then(function (photo) {
										c.dropSrc = photo.data;
									}, function (x) {
										c.message = 'Internet connection error';
									});
							}
							break;
						default:
							c.message = '';
					}

					//center map on driver
					mapService.centerMap(status.data.lat, status.data.lon);
				}, function (e) {
					c.message = 'Internet connection error';
				});
		}, 5000);
	};

	c.AcceptDelivery = function () {
		$http.get(ConfigSrvc.serviceUrl + '/api/complete?deliveryId=' + c.form.data.deliveryId);
		c.page.load('customer/4_deliveredVerification/deliveredVerification.html');
	};

	return c;
}]);