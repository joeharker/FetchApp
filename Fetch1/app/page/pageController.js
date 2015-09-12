/*global app */
app.controller('PageCtrl', ['ConfigSrvc', 'MemorySrvc',
    function (ConfigSrvc, MemorySrvc) {
    	'use strict';
    	var c = this,
            regex,
            match,
            history = [],
			root = window.location.href.replace(/index.html.*/, '');
    	;
    	c.ver = ConfigSrvc.version,
    	c.animateMore = '';
    	c.disableBack = true;
    	c.theme = '';
    	c.title = '';
    	c.template = '';

    	c.load = function (template, direction) {
    		if (direction !== undefined) {
    			c.animateMore = 'slide-' + direction;
    		} else {
    			c.animateMore = '';
    		}

    		history.push(MemorySrvc.get('pageTemplate'));
    		c.disableBack = false;
    		MemorySrvc.set('pageTemplate', template + '?version=' + c.ver);
    		c.template = MemorySrvc.get('pageTemplate');
    	};

    	c.back = function () {
    		if (history.length > 0) {
    			c.title = '';
    			c.animateMore = 'slide-back';
    			c.template = history[history.length - 1];
    			history.pop();
    		}
    		c.disableBack = (history.length <= 0);
    	};

    	//onload-complete load a template if listed in a jump url param or page one
    	regex = new RegExp('(?:\\?|&)jump=([^&]*)(?=&|$)', 'gi');
    	match = regex.exec(window.document.location.search);
    	if (match !== null) {
    		c.load(match[1]);
    	} else {
    		if (MemorySrvc.get('pageTemplate') !== '') {
    			c.load(MemorySrvc.get('pageTemplate'));
    		}else{
    			c.load(root + 'app/page/start.html?version=' + c.ver);
    		}
    	}

    	return c;
    }]);