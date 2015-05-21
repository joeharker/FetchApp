/*global app */
app.controller('DemoCtrl', ['DemoSrvc',
  function (DemoSrvc) {
    'use strict';
  	var c = this;

  	c.pickup = DemoSrvc.get('pickup');
  	c.delivery = DemoSrvc.get('delivery');
  	c.weight = DemoSrvc.get('weight');
  	c.content = DemoSrvc.get('content');
  	c.instructions = DemoSrvc.get('instructions');
  	c.size = (DemoSrvc.get('size') === '') ? 'small' : DemoSrvc.get('size');

  	c.setPickup = function () { DemoSrvc.set('pickup', c.pickup); };
  	c.setDelivery = function () { DemoSrvc.set('delivery', c.delivery); };
  	c.setWeight = function () { DemoSrvc.set('weight', c.weight); };
  	c.setContent = function () { DemoSrvc.set('content', c.content); };
  	c.setInstructions = function () { DemoSrvc.set('instructions', c.instructions); };
  	c.setSize = function (size) { DemoSrvc.set('size', size); };

  	return c;
  }]);