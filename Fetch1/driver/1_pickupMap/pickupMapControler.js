/*global app */
app.controller('PickupMapControler', ['mapService',
function (mapService) {
	var c = this;

	c.init = function (form, page) {
		mapService.addPin( 
			form.pickup
			, function() { 
				page.load('driver/takeDelivery/takeDelivery.html');
			}
		);
		mapService.addPin(
			form.delivery
			, function () {
				page.load('driver/takeDelivery/takeDelivery.html');
			}
		);
	};

	return c;
}]);