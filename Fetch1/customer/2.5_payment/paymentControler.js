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

	return c;
}]);