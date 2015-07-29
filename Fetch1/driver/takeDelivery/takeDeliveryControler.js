/*global app */
app.controller('TakeDeliveryCtrl', ['mapService', '$q',
function (mapService, $q) {
	var c = this;

	c.calculateCost = function (form) {
		mapService.calculateRoute(form.pickup, form.delivery)
		.then(function (rout) {
			var price = 0.0;

			switch(form.size) {
				case 'small':
					price = 0.99;
					price += 0.0007 * rout.meters;
					price += 0.0025 * rout.seconds;
					price = price < 9.99 ? 9.99 : price;

					break;
				case 'medium':
					price = 14.95;
					price += 0.0021 * rout.meters;
					price += 0.0083 * rout.seconds;
					price = price < 25 ? 25 : price;

					break;
				case 'large':
					price = 39.95;
					price += 0.0021 * rout.meters;
					price += 0.0083 * rout.seconds;
					price = price < 75 ? 75 : price;

					break;
				default:
					console.log('Unknown size: ' + form.size);
			}

			form.price = price.toFixed(2);
		}, function (reason) {
			console.log(['Failed', reason]);
		});
	};

	c.getLatLng = function (form) {
		mapService.getGeo(form.delivery)
		.then(function (latLng) {
			form.latLng = latLng;
			console.log(latLng);
		});
	};

	return c;
}]);