/*global app */
app.controller('RequestDeliveryController', ['mapService', '$q', 
function (mapService, $q) {
	var c = this;
	c.win = {};

	var checkDistance = function (form) {
		mapService.calculateRoute(form.data.pickup, form.data.delivery)
		.then(function (rout) {
			form.data.distance = (rout.meters / 1609.34).toFixed(2) + ' miles';
		}, function (reason) {
			form.data.distance = '';
		});
	};

	c.getLatLng = function (address, lat, long) {
		mapService.getGeo(address)
		.then(function (latLng) {
			console.log(latLng);
			//lat = latLng;
			//long = latLng;
		});
	};

	c.cleanPickupAddress = function (form) {
		mapService.cleanAddress(form.data.pickup)
		.then(function (result) {
			var results = result.split('|');
			form.data.pickup = results[0];
			form.data.pickUpLat = results[1];
			form.data.pickUpLong = results[2];
			
			form.setPickUpLat();
			form.setPickUpLong();
		}, function (reason) {
			form.data.pickup = '';
			form.data.pickUpLat = '';
			form.data.pickUpLong = '';

			form.setPickUpLat();
			form.setPickUpLong();
		});

		checkDistance(form);
	};

	c.cleanDeliveryAddress = function (form) {
		mapService.cleanAddress(form.data.delivery)
		.then(function (result) {
			var results = result.split('|');
			form.data.delivery = results[0];
			form.data.dropLat = results[1];
			form.data.dropLong = results[2];

			form.setDropLat();
			form.setDropLong();
		}, function (reason) {
			form.data.delivery = '';
			form.data.dropLat = '';
			form.data.dropLong = '';

			form.setDropLat();
			form.setDropLong();
		});

		checkDistance(form);
	};

	c.validateWeight = function (form) {
		if (parseFloat(form.data.weight) != form.data.weight)
		{
			form.data.weight = '';
		}
	};

	c.validatePage = function () {
		var result = document.getElementsByClassName('error');
		return result.length == 0;
	};

	c.verifyWindow = function () {
		c.win = window.open('customer/2.5_payment/payment.html');
	};

	c.test = function () {
		console.log(c.win.location.href);
	};

	c.close = function () {
		c.win.close();
	};

	return c;
}]);