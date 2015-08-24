/*global app */
app.controller('FindDriverCtrl', ['$q', '$scope', '$http', '$interval','ConfigSrvc',
function ($q, $scope, $http, $interval, ConfigSrvc) {
	var c = this;

	c.message = 'Posting your request';
	c.ready = false;

	c.init = function (json) {
		$http.post(ConfigSrvc.serviceUrl + '/api/delivery', json)
			.then(function (response) {
				c.message = 'Waiting for a Deliverer';
				//TODO interval wait for driver offer
														c.ready = true;
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
			// Use the token to create the charge with a server-side script.
			// You can access the token ID with 'token.id'
			thisToken = token;
		}
	})
	;
	var ticker;

	c.submit = function (description, cents, page) {
		// Open Checkout with further options
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