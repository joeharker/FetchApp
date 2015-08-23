/*global app */
app.controller('TakeDeliveryCtrl', ['mapService', '$q',
function (mapService, $q) {
	var c = this;

	c.getLatLng = function (form) {
		mapService.getGeo(form.data.delivery)
		.then(function (latLng) {
			form.data.latLng = latLng;
			//console.log(latLng);
		});
	};

	return c;
}]);