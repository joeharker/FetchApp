/*global app */
app.controller('PickupMapControler', ['mapService',
function (mapService) {
	var c = this;

	c.init = function (form, page) {
		mapService.addPin( 
			form.data.pickup
			, function() { 
				page.load('driver/takeDelivery/takeDelivery.html');
			}
		);
		mapService.addPin(
			form.data.delivery
			, function () {
				page.load('driver/takeDelivery/takeDelivery.html');
			}
		);
	};

	return c;
}]);