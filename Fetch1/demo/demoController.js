/*global app */
app.controller('DemoCtrl', ['DemoSrvc',
  function (DemoSrvc) {
      'use strict';
  	var c = this;

  	c.pickup = DemoSrvc.get('pickup');
  	c.delivery = DemoSrvc.get('delivery');
  	c.price = DemoSrvc.get('price');

  	c.setPickup = function () {
  	    DemoSrvc.set('pickup', c.pickup);
  	};

  	c.setDelivery = function () {
  	    DemoSrvc.set('delivery', c.delivery);
  	};

  	c.setPrice = function () {
  	    DemoSrvc.set('price', c.price);
  	};

  	return c;
  }]);