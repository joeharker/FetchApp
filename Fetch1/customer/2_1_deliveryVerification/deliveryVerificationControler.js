/// <reference path="../3_trackMap/trackMap.html" />
/*global app */
app.controller("DeliveryVerificationCtrl", ["mapService", "$q", "MemorySrvc", "ErrorService",
function (mapService, $q, MemorySrvc, ErrorService) {
	var c = this;

	c.calculateCost = function (form) {
		mapService.calculateRoute(form.data.pickup, form.data.delivery)
		.then(function (rout) {
			var price = 0.0;

			switch (form.data.size) {
				case "medium":
					price = 0.99;
					price += 0.0007 * rout.meters;
					price += 0.0025 * rout.seconds;
					price = price < 25 ? 25 : price;

					break;
				case "large":
					price = 0.99;
					price += 0.0021 * rout.meters;
					price += 0.0083 * rout.seconds;
					price = price < 75 ? 75 : price;

					break;
			    case "small":
			    default:
			        price = 0.99;
			        price += 0.0007 * rout.meters;
			        price += 0.0025 * rout.seconds;
			        price = price < 9.99 ? 9.99 : price;

			        break;
			}

			form.data.price = price.toFixed(2);
			form.data.suggested = form.data.price;

			form.saveData();
		}, function (reason) {
		    ErrorService.reportError("calculateCost Failed:", JSON.stringify(reason));
		});
	};

	c.validatePrice = function (val, form) {
	    if (
            val === undefined
	        || isNaN(parseFloat(val))
        ) {
	        form.data.price = "";
	    }
	};

	return c;
}]);