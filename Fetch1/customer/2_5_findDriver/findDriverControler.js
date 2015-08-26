/*global app */
app.controller('FindDriverCtrl', ['$q', '$scope', '$http', '$interval','ConfigSrvc','DeliverySrvc',
function ($q, $scope, $http, $interval, ConfigSrvc, DeliverySrvc) {
	var c = this;

	c.message = 'Posting your request';
	c.ready = false;
	var ticker;

	c.init = function (json) {
		$http.post(ConfigSrvc.serviceUrl + '/api/delivery', json)
			.then(function (deliveryResponse) {
				c.message = 'Waiting for a Deliverer';
				DeliverySrvc.set('deliveryId', deliveryResponse.data);

				//wait for driver offer
				ticker = $interval(function () {
					$http.post(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId='+ deliveryResponse.data)
						.then(function (driverResponse) {
							console.log(driverResponse.data);
							if (driverResponse.data === 1) {	//TODO make an ENUM service
								$interval.cancel(ticker);
								c.message = 'A deliverer is ready. Please pay to start the delivery';
								c.ready = true;
							}
					});
				}, 5000);
			}, function (e) {
				c.message = 'An error has occured';
		});
	};

	var thisToken = {};
	var handler = StripeCheckout.configure({
		key: 'pk_test_LDonp15qE0gZigryIcfweU23',
		image: '../../resources/icon/icon.png',
		locale: 'auto',
		token: function (token) {
			thisToken = token;
		}
	});

	c.submit = function (description, cents, page) {
		handler.open({
			name: 'FETCH1 TRANSPORT LLC',
			description: description,
			zipCode: true,
			amount: cents
		});

		//wait for confirmation
		ticker = $interval(function () {
			if (thisToken.id !== undefined) {
				$interval.cancel(ticker);
				page.load('customer/3_trackMap/trackMap.html');
			}
		}, 1000);
	};

	return c;
}]);