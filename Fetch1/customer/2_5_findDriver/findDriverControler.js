/*global app */
app.controller('FindDriverCtrl', ['$q', '$scope', '$http', '$interval',
function ($q, $scope, $http, $interval) {
	var c = this;

	c.message = 'Waiting for a driver';

	c.init = function (json) {
		console.log(json);
		//$http.post('http://fetch001.azurewebsites.net/api/delivery', json)
		$http.post('http://localhost:3175/api/delivery', json)
			.then(function (response) {
				console.log(response);
			}, function (e) {
				console.log(e);
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
				console.log(thisToken);
				page.load('customer/3_trackMap/trackMap.html');
			}
		}, 1000);
	};

	return c;
}]);