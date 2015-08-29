/*global app */
app.controller('FindDriverCtrl', ['$q', '$scope', '$http', '$interval','ConfigSrvc','DeliverySrvc','EnumSrvc',
function ($q, $scope, $http, $interval, ConfigSrvc, DeliverySrvc, EnumSrvc) {
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
					$http.get(ConfigSrvc.serviceUrl + '/api/delivery?deliveryId='+ deliveryResponse.data)
						.then(function (driverResponse) {
							if (driverResponse.data === EnumSrvc.NextNeed.Payment) {
								$interval.cancel(ticker);
								c.message = 'A deliverer is ready. Please pay to start the delivery';
								c.ready = true;
							}
						}, function (e) {
							c.message = 'An error has occured at wait for offer';
					});
				}, 5000);
			}, function (e) {
				c.message = 'An error has occured at post delivery';
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
		var payment = {};
		handler.open({
			name: 'FETCH1 TRANSPORT LLC',
			description: description,
			zipCode: true,
			amount: cents
		});

		//wait for confirmation
		ticker = $interval(function () {
			if (thisToken.id !== undefined) {
				console.log(thisToken);
				$interval.cancel(ticker);

				DeliverySrvc.set('myId', thisToken.email);

				//record payment
				payment.id = thisToken.id;
				payment.deliveryId = DeliverySrvc.get('deliveryId');
				payment.customerId = thisToken.email;
				payment.brand = thisToken.card.brand;
				payment.country = thisToken.card.country;
				payment.exp_month = thisToken.card.exp_month;
				payment.exp_year = thisToken.card.exp_year;
				payment.funding = thisToken.card.funding;
				payment.cardId = thisToken.card.id;
				payment.last4 = thisToken.card.last4;
				payment.name = thisToken.card.name;
				payment.client_ip = thisToken.client_ip;
				payment.created = new Date(thisToken.created);
				payment.email = thisToken.email;
				payment.livemode = thisToken.livemode;
				payment.type = thisToken.type;
				payment.used = thisToken.used;
				$http.post(/*ConfigSrvc.serviceUrl +*/ 'http://localhost:3175/api/pay', payment)
				.then(function (payResponse) {
					page.load('customer/3_trackMap/trackMap.html');
				}, function (e) {
					c.message = 'An error has occured at post payment';
				});
			}
		}, 1000);
	};

	return c;
}]);