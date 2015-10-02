/*global app */
app.controller('startControler', ['locationService', '$interval', '$http', 'ConfigSrvc', 'EnumSrvc', 'mapService', 'cameraService', 'ErrorService', 'DeviceSrvc','MemorySrvc',
function (/*                            */ locationService, $interval, $http, ConfigSrvc, EnumSrvc, mapService, cameraService, ErrorService, DeviceSrvc, MemorySrvc) {
	var c = this;
	var ticker = {};
	c.form = {};
	c.page = {};
	c.latLngUrl = '';
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

		ticker = $interval(function () {
			$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + c.form.data.deliveryId)
				.then(function (status) {
				    switch (status.data.nextNeed) {
				        case EnumSrvc.NextNeed.Driver:
				            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId=' + form.data.deliveryId + '&driverId=' + form.myId);
				            break;
				        case EnumSrvc.NextNeed.Payment:
				            c.message = 'Waiting for customer payment';
				            break;
				        case EnumSrvc.NextNeed.Pickup:
				            c.pickup = true;
				            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + c.form.myId + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
				            break;
				        case EnumSrvc.NextNeed.Dropoff:
				            //c.pickup = false;
				            //c.drop = true;
				            $http.get(ConfigSrvc.serviceUrl + '/api/delivery?driverId=' + c.form.myId + '&lat=' + locationService.position.latitude + '&lon=' + locationService.position.longitude);
				            break;
				        case EnumSrvc.NextNeed.Transfer:
				            //c.drop = false;
				            c.message = 'Waiting for customer to confirm drop off';
				            break;
				        case EnumSrvc.NextNeed.Done:
				            $interval.cancel(ticker);
				            c.page.load('customer/4_deliveredVerification/deliveredVerification.html');
				            break;
				        default:
				    }
				}, function (x) {
				    ErrorService.reportMessage("test photo error", x);
					c.message = 'net work error '+ x;
				});
		}, 5000);
	};

	c.pickPhoto = function () {
		mapService.getGeoUrl(c.form.data.delivery)
		.then(function (latLngUrl) {
			c.latLngUrl = latLngUrl;
		});

		cameraService.quality = 5;
		cameraService.takePhoto()
		.then(function (photo) {
		    ErrorService.reportMessage("photo length before", photo.length);
		    c.pickSrc = photo;
		    photo = cameraService.resizePhoto(document.getElementById("pickImg"), 100, 100);
		    ErrorService.reportMessage("photo length after", photo.length);
			$http.post(ConfigSrvc.serviceUrl + '/api/pickup', { 'deliveryId': c.form.data.deliveryId, 'photo': photo })
		    .then(function (response) {
		        c.pickup = false;
		        c.drop = true;
		        c.addressMessage = 'Get directions to Drop off ' + c.form.data.delivery;
		    }, function (e) {
		        c.message = e;
		        ErrorService.reportMessage("test photo error", e);
		        c.message = e;
			});
		}, function (x) {
		    ErrorService.reportMessage("test photo error", x);
			c.message = x;
		});
	};

	c.dropPhoto = function () {
		cameraService.takePhoto()
		.then(function (photo) {
			c.dropSrc = photo;
			c.pickup = false;
			c.drop = false;
			$http.post(ConfigSrvc.serviceUrl + '/api/drop', { 'deliveryId': c.form.data.deliveryId, 'photo': photo });
			c.message = 'Waiting for customer to confirm drop off';
		}, function (e) {
		    ErrorService.reportMessage("photo error", e);
			c.message = e;
		});
	};

	return c;
}]);