/*global app */
app.factory("MemorySrvc", [
    function () {
    	"use strict";
    	var s = {},
    		keys = [];

    	s.set = function (key, val) {
    		window.localStorage.setItem(key, val);
    	};

    	s.get = function (key) {
    		var val = window.localStorage.getItem(key);

    		if (val === null) {
    			val = '';
    		}

    		return val;
    	};

    	s.reset = function () {
    		window.localStorage.clear();
    	};

    	return s;
    }]);