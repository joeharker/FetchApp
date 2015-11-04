/*global app */
app.controller('RequestDeliveryController', ['mapService',
function (mapService) {
	var c = this;
	c.win = {};

	var checkDistance = function (form) {
		mapService.calculateRoute(form.data.pickup, form.data.delivery)
		.then(function (rout) {
			form.data.distance = (rout.meters / 1609.34).toFixed(2) + ' miles';
		}, function (reason) {
			form.data.distance = '';
		});
	};

	c.cleanPickupAddress = function (form) {
	    if (form.pnumber !== undefined && form.pstreet !== undefined && form.pzip !== undefined
            && form.pnumber.length > 0 && form.pstreet.length > 0 && form.pzip.length > 4) {
	        mapService.cleanAddress(form.pnumber + ' ' + form.pstreet + ' ' + form.pzip + ' ' + form.pcity + ' ' + form.pstate + ' ' + form.pcountry)
	            .then(function(result) {
	                var results = result.split('|');
	                form.data.pickup = results[0];
	                form.data.pickUpLat = results[1];
	                form.data.pickUpLong = results[2];
	                checkDistance(form);

                    //                      number   street   city     state   zip      country
	                var regex = new RegExp('([0-9]+) ([^,]+), ([^,]+), ([^ ]+) ([^,]+), ([^|]+)', 'gi');
	                var matches = regex.exec(results[0]);
	                if (matches !== null) {
	                    form.pnumber = matches[1];
	                    form.pstreet = matches[2];
	                    form.pcity = matches[3];
	                    form.pstate = matches[4];
	                    form.pzip = matches[5];
	                    form.pcountry = matches[6];
	                }
	            }, function(reason) {
	                form.data.pickup = '';
	                form.data.pickUpLat = '';
	                form.data.pickUpLong = '';
	                checkDistance(form);
	            });
	    }
	};

	c.cleanDeliveryAddress = function (form) {
	    if (form.dnumber !== undefined && form.dstreet !== undefined && form.dzip !== undefined
	        && form.dnumber.length > 0 && form.dstreet.length > 0 && form.dzip.length > 4) {
	        mapService.cleanAddress(form.dnumber + ' ' + form.dstreet + ' ' + form.dzip + ' ' + form.dcity + ' ' + form.dstate + ' ' + form.dcountry)
	            .then(function(result) {
	                var results = result.split('|');
	                form.data.delivery = results[0];
	                form.data.dropLat = results[1];
	                form.data.dropLong = results[2];
	                checkDistance(form);

	                //                      number   street   city     state   zip      country
	                var regex = new RegExp('([0-9]+) ([^,]+), ([^,]+), ([^ ]+) ([^,]+), ([^|]+)', 'gi');
	                var matches = regex.exec(results[0]);
	                if (matches !== null) {
	                    form.dnumber = matches[1];
	                    form.dstreet = matches[2];
	                    form.dcity = matches[3];
	                    form.dstate = matches[4];
	                    form.dzip = matches[5];
	                    form.dcountry = matches[6];
	                }
	            }, function(reason) {
	                form.data.delivery = '';
	                form.data.dropLat = '';
	                form.data.dropLong = '';
	                checkDistance(form);
	            });
	    }
	};

	c.validateWeight = function (form) {
		if (parseFloat(form.data.weight) != form.data.weight)
		{
			form.data.weight = '';
		}
	};

	return c;
}]);