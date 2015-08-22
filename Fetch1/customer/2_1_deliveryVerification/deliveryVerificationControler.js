/// <reference path="../3_trackMap/trackMap.html" />
/*global app */
app.controller('DeliveryVerificationCtrl', ['mapService', '$q', 'DemoSrvc', '$interval',
function (mapService, $q, DemoSrvc, $interval) {
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
					console.log('Unknown size: ' + form.size);
			}

			form.price = price.toFixed(2);
			DemoSrvc.set('price', form.price);
		}, function (reason) {
			console.log(['Failed', reason]);
		});
	};

	//c.init = function (page) {
	var thisToken = {};
		var	handler = StripeCheckout.configure({
				key: 'pk_test_LDonp15qE0gZigryIcfweU23',
				image: '../../resources/icon/icon.png',
				locale: 'auto',
				token: function (token) {
					// Use the token to create the charge with a server-side script.
					// You can access the token ID with `token.id`
					thisToken = token;
				}
			})
		;
	//};
		var ticker;

	c.submit = function (description, cents, page) {
		// Open Checkout with further options
		handler.open({
			name: 'FETCH1 TRANSPORT LLC',
			description: description,
			zipCode: true,
			amount: cents
		});

		ticker = $interval(function () {
			if (thisToken.id !== undefined) {
				$interval.cancel(ticker);
				console.log(thisToken);
				page.load('customer/3_trackMap/trackMap.html');
			}
		}, 1000);

		//page.load();
	};

	return c;
}]);