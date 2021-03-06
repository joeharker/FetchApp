﻿/*global app */
app.controller("FindDriverCtrl", ["$q", "$scope", "$http", "$interval", "ConfigSrvc", "MemorySrvc", "EnumSrvc","DeviceSrvc", "cameraService",
function ($q, $scope, $http, $interval, ConfigSrvc, MemorySrvc, EnumSrvc, DeviceSrvc, cameraService) {
	var c = this;

	c.message = "";
	c.ready = false;
	c.timmer = 1800;
	var ticker;

    //init for next page
	MemorySrvc.set("pickSrc", cameraService.transparent);
	MemorySrvc.set("dropSrc", cameraService.transparent);
	MemorySrvc.set("accept", false);

	var waitForDriver = function (page) {
		c.message = "Waiting for a Deliverer";
		ticker = $interval(function () {
		    if (MemorySrvc.get("deliveryId") !== "") {
                //get status
		        $http.get(ConfigSrvc.serviceUrl + "/api/delivery?deliveryId=" + MemorySrvc.get("deliveryId"))
		            .then(function(status) {

				        if (status.data.nextNeed === EnumSrvc.NextNeed.Payment) {
					        $interval.cancel(ticker);
					        c.message = "A deliverer is ready. Please pay to start the delivery";
					        page.title = 'PAYMENT';
					        c.ready = true;
					        DeviceSrvc.buzz();
				        } else {
				        	c.timmer = c.timmer - 5;
				        	if (c.timmer < 0) {
						        page.load('app/page/start.html');
					        }
				        }
			        }, function(e) {
		                c.message = "Finding Network";
		            });
		    }
		}, 5000);
	};

	c.init = function (json, page) {
	    if (MemorySrvc.get("deliveryId") === "") {
	        c.message = "Posting your request";
			$http.post(ConfigSrvc.serviceUrl + "/api/delivery", json)
				.then(function (deliveryResponse) {
					MemorySrvc.set("deliveryId", deliveryResponse.data);
					waitForDriver(page);
				}, function (e) {
					c.message = "An error has occured at post delivery";
				});
		} else {
	        waitForDriver(page);
		}
	};

	var thisToken = {};
	var handler = StripeCheckout.configure({
		key: ConfigSrvc.stripeCheckoutKey,
		image: "../../resources/icon/ios/icon-120.png",
		locale: "auto",
		token: function (token) {
			thisToken = token;
		}
	});

	c.submit = function (description, cents, page) {
		var payment = {};
		handler.open({
			name: "FETCH1 TRANSPORT LLC",
			description: description,
			zipCode: true,
			amount: cents
		});

		//wait for confirmation
		ticker = $interval(function () {
			if (thisToken.id !== undefined) {
				$interval.cancel(ticker);

				MemorySrvc.set("myId", thisToken.email);

				//record payment
				payment.id = thisToken.id;
				payment.deliveryId = MemorySrvc.get("deliveryId");
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
				$http.post(ConfigSrvc.serviceUrl + "/api/pay", payment)
				.then(function (payResponse) {
					page.load("customer/3_trackMap/trackMap.html");
				}, function (e) {
					c.message = "Finding Network";
				});
			}
		}, 1000);
	};

	return c;
}]);