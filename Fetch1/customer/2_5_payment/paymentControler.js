/*global app */
app.controller('PayCtrl', ['$q', '$scope', '$http',
function ($q, $scope, $http) {
	var c = this;

	//TODO: get key from service
	Stripe.setPublishableKey('pk_test_LDonp15qE0gZigryIcfweU23');

	c.submit = function (card) {
		//TODO: disable the submit

		Stripe.card.createToken(card, function (status, response)
		{
			if (status != 200) {
				alert(response.message);
			} else {
				card.stripeToken = response.id;
				$scope.$applyAsync();
				var url = 'http://fetch001.azurewebsites.net/api/pay?cents=' + card.amount + '&token=' + card.stripeToken + '&desc=' + card.content;
				console.log(url);
				$http.get(url)
				.then(function (r) {
					console.log(r);
				}, function (e) {
					console.log(e);
				});
			}
		});
	};

	//////////////////////////////////////////new/////////////////////////////////////

	var handler = StripeCheckout.configure({
		key: 'pk_test_LDonp15qE0gZigryIcfweU23',
		image: '../../resources/icon/icon.png',
		locale: 'auto',
		token: function (token) {
			alert(token.id);
			// Use the token to create the charge with a server-side script.
			// You can access the token ID with `token.id`
		}
	});

	c.submitnew = function () {
		// Open Checkout with further options
		handler.open({
			name: 'FETCH1 TRANSPORT LLC',
			description: '2 widgets',
			zipCode: true,
			amount: 2000
		});
	};

	return c;
}]);