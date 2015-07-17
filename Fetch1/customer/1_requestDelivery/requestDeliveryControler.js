/*global app */
app.controller('RequestDeliveryController', ['mapService', '$q', '$scope',
function (mapService, $q, $scope) {
	var c = this;

	c.cleanPickupAddress = function (form) {
		mapService.cleanAddress(form.pickup)
		.then(function (clean) {
			console.log(clean);
			form.pickup = clean;
		}, function (reason) {
			form.pickup = '';
		});
	};

	c.cleanDeliveryAddress = function (form) {
		mapService.cleanAddress(form.delivery)
		.then(function (clean) {
			console.log(clean);
			form.delivery = clean;
		}, function (reason) {
			form.delivery = '';
		});
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