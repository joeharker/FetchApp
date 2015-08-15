/*global app */
app.controller('TakeDeliveryCtrl', ['mapService', '$q',
function (mapService, $q) {
	var c = this;

	c.getLatLng = function (form) {
		mapService.getGeo(form.delivery)
		.then(function (latLng) {
			form.latLng = latLng;
			console.log(latLng);
		});
	};

	return c;
}]);