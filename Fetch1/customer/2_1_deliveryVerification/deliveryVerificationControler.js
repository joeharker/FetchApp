﻿/// <reference path="../3_trackMap/trackMap.html" />
/*global app */
app.controller('DeliveryVerificationCtrl', ['mapService', '$q', 'DeliverySrvc', '$interval',
function (mapService, $q, DeliverySrvc, $interval) {
	var c = this;

	c.calculateCost = function (form) {
		mapService.calculateRoute(form.data.pickup, form.data.delivery)
		.then(function (rout) {
			var price = 0.0;

			switch (form.data.size) {
				case 'small':
					price = 0.99;
					price += 0.0007 * rout.meters;
					price += 0.0025 * rout.seconds;
					price = price < 9.99 ? 9.99 : price;

					break;
				case 'medium':
					price = 14.95;
					price += 0.0007 * rout.meters;
					price += 0.0025 * rout.seconds;
					price = price < 25 ? 25 : price;

					break;
				case 'large':
					price = 39.95;
					price += 0.0021 * rout.meters;
					price += 0.0083 * rout.seconds;
					price = price < 75 ? 75 : price;

					break;
				default:
					//TODO Error handler
					console.log('Unknown size: ' + form.data.size);
			}

			form.data.price = price.toFixed(2);
			DeliverySrvc.set('price', form.data.price);
		}, function (reason) {
			//TODO Error handler
			console.log(['Failed', reason]);
		});
	};

	return c;
}]);