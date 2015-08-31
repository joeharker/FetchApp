/*global app */
app.controller('TrackControler', ['mapService', 'locationService', '$interval', '$http', 'ConfigSrvc', 'DeliverySrvc','cameraService',
function (mapService, locationService, $interval, $http, ConfigSrvc, DeliverySrvc, cameraService) {
	var c = this;
	var ticker = {};
	c.message = 'Finding your location';
	c.mapMarkers = [];
	c.form = {};
	c.page = {};
	c.pickSrc = cameraService.transparent;
	c.dropSrc = cameraService.transparent;

	c.init = function (form, page) {
		c.form = form;
		c.page = page;

		ticker = $interval(function () {
			$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
				.then(function (status) {
					//clear old markers
					angular.forEach(c.mapMarkers, function (pin, i) {
						pin.setMap(null);
					});
					c.mapMarkers = [];

					//update the driver location
					c.mapMarkers.push(
						mapService.addPinLatLon(
							status.data.lat
							,status.data.lon
							, function () {
								//no click function for now
							}
						)
					);

					switch(status.data.nextNeed) {
						case 2:
							c.message = 'Aproaching pickup';
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
						default:
							c.page.load('customer/4_deliveredVerification/deliveredVerification.html');
					}

					//center map on driver
					mapService.centerMap(status.data.lat, status.data.lon);
				}, function (e) {
					c.message = 'Internet connection error';
				});
		}, 5000);
	};

	return c;
}]);