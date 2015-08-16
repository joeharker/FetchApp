/*global app */
app.controller('PayCtrl', ['$q',
function ($q) {
	var c = this;

	//TODO: get key from service
	Stripe.setPublishableKey('pk_test_LDonp15qE0gZigryIcfweU23');

	c.submit = function (card) {
		card.stripeToken = 'testing';
		console.log(['card', card]);

		Stripe.card.createToken(card, function (status, response)
		{
			//TODO: disable the submit
			console.log(['response', response]);
			console.log(['status', status]);

			if (status != 200) {
				alert(response.message);
			} else {
				card.stripeToken = response.id;
			}
		});
	};

	return c;
}]);