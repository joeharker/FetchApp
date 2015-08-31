﻿/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc','EnumSrvc','mapService','cameraService',
function (locationService, $interval, $http, ConfigSrvc, EnumSrvc, mapService, cameraService) {
	var c = this;
	var ticker = {};
	c.form = {};
	c.page = {};
	c.latLngUrl = "";
	c.pickup = false;
	c.drop = false;
	c.pickSrc = "";
	c.dropSrc = "";
	
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
								c.track();
							}
						}, function (x) {
							c.message = 'net work error';
						});
				}, 5000);
			}, function (e) {
				c.message = 'net work error';
		});
	};

	c.track = function () {
		c.message = 'Payment is in holding account Please pick up the package';
		c.pickup = true;

		ticker = $interval(function () {
			$http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + c.form.myId + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
		}, 5000);
	};

	c.pickPhoto = function () {
		cameraService.takePhoto()
		.then(function (photo) {
			c.pickSrc = photo;
			c.pickup = false;
			c.drop = true;
		}, function (e) {
			c.message = e;
		});
	};

	return c;
}]);