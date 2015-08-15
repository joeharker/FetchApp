/*global app */
app.controller('RequestDeliveryController', ['mapService', '$q', 
function (mapService, $q) {
	var c = this;

	var checkDistance = function (form) {
		mapService.calculateRoute(form.pickup, form.delivery)
		.then(function (rout) {
			form.distance = (rout.meters / 1609.34).toFixed(2) + ' miles';
		}, function (reason) {
			form.distance = '';
		});
	};

	c.cleanPickupAddress = function (form) {
		mapService.cleanAddress(form.pickup)
		.then(function (clean) {
			form.pickup = clean;
		}, function (reason) {
			form.pickup = '';
		});

		checkDistance(form);
	};

	c.cleanDeliveryAddress = function (form) {
		mapService.cleanAddress(form.delivery)
		.then(function (clean) {
			form.delivery = clean;
		}, function (reason) {
			form.delivery = '';
		});

		checkDistance(form);
	};

	c.validateWeight = function (form) {
		if(parseFloat(form.weight) != form.weight)
		{
			form.weight = '';
		}
	};

	c.validatePage = function () {
		var result = document.getElementsByClassName('error');
		return result.length == 0;
	};

	return c;
}]);