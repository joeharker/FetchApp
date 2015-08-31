/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc','EnumSrvc','mapService','cameraService',
function (locationService, $interval, $http, ConfigSrvc, EnumSrvc, mapService, cameraService) {
	var c = this;
	var ticker = {};
	c.form = {};
	c.page = {};
	c.latLngUrl = "";
	c.addressMessage = '';
	c.pickup = false;
	c.drop = false;
	c.pickSrc = cameraService.transparent;
	c.dropSrc = cameraService.transparent;
	
	c.init = function (form, page) {
		c.form = form;
		c.page = page;
		c.addressMessage = 'Get directions to Pickup ' + c.form.data.pickup;

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
		cameraService.quality = 0;
		cameraService.takePhoto()
		.then(function (photo) {
			c.pickSrc = photo;
			c.pickup = false;
			c.drop = true;
			c.addressMessage = 'Get directions to Drop off ' + c.form.data.delivery;
			$http.post(ConfigSrvc.serviceUrl + '/api/pickup', { 'deliveryId': c.form.data.deliveryId, 'photo': photo });
		}, function (e) {
			c.message = e;
		});
	};

	c.dropPhoto = function () {
		cameraService.quality = 0;
		cameraService.takePhoto()
		.then(function (photo) {
			c.dropSrc = photo;
			c.pickup = false;
			c.drop = false;
			$http.post(ConfigSrvc.serviceUrl + '/api/drop', { 'deliveryId': c.form.data.deliveryId, 'photo': photo });
			c.message = 'Waiting for customer to confirm drop off';

			$interval.cancel(ticker);
			ticker = $interval(function () {
				$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
					.then(function (status) {
						if (status.data.nextNeed === EnumSrvc.NextNeed.Done) {
							$interval.cancel(ticker);
							c.page.load('../../customer/4_deliveredVerification/deliveredVerification.html');
						}
					}, function (x) {
						c.message = 'net work error';
					});
			}, 5000);
		}, function (e) {
			c.message = e;
		});
	};

	return c;
}]);