/*global app */
app.controller('PageCtrl', [
    function () {
        'use strict';
        var c = this,
            regex,
            match,
            ver = '?ver=' + new Date().getTime(),
            history = [],
			root = window.location.href.replace('index.html', '');
        ;
        
        c.template = '';
        c.animateMore = '';
        c.disableBack = true;
        c.theme = '';
        c.title = '';

        c.load = function (template, title, direction) {
            if (direction !== undefined) {
                c.animateMore = 'slide-' + direction;
            } else {
                c.animateMore = '';
            }

            if (title !== undefined) {
            	c.title = title;
            } else {
            	c.title = '';
            }

            history.push(c.template);
            c.disableBack = false;
            c.template = root + template + ver;
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
            c.template = match[1];
        } else {
        	c.template = root + 'app/clientType/clientType.html' + ver;
        }

        return c;
    }]);