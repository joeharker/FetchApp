/*global app */
app.factory('DeliverySrvc', [
    function () {
        'use strict';
    	var s = {},
    		hashe = {};

    	s.set = function(key, val){
    		hashe[key] = val;
    	};

    	s.get = function (key) {
    		var val = '';

    		if (hashe[key] !== undefined) {
    			val = hashe[key];
    		}

    		return val;
    	};

        return s;
    }]);