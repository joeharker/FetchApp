/*global app */
app.controller('DeliveryCtrl', ['MemorySrvc',
  function (MemorySrvc) {
    'use strict';
  	var c = this;

  	c.data = {};
  	c.data.deliveryId = MemorySrvc.get('deliveryId');
  	c.data.pickup = MemorySrvc.get('pickup');
  	c.data.delivery = MemorySrvc.get('delivery');
  	c.data.weight = MemorySrvc.get('weight');
  	c.data.content = MemorySrvc.get('content');
  	c.data.instructions = MemorySrvc.get('instructions');
  	c.data.price = MemorySrvc.get('price');
  	c.data.customerRef = MemorySrvc.get('customerRef');
  	c.data.driverRef = MemorySrvc.get('driverRef');
  	c.data.pickUpLat = MemorySrvc.get('pickUpLat');
  	c.data.pickUpLong = MemorySrvc.get('pickUpLong');
  	c.data.dropLat = MemorySrvc.get('dropLat');
  	c.data.dropLong = MemorySrvc.get('dropLong');
  	c.data.size = (MemorySrvc.get('size') === '') ? 'small' : MemorySrvc.get('size');

  	c.myId = MemorySrvc.get('myId');

  	c.setDeliveryId = function () { MemorySrvc.set('deliveryId', c.data.deliveryId); };
  	c.setPickup = function () { MemorySrvc.set('pickup', c.data.pickup); };
  	c.setDelivery = function () { MemorySrvc.set('delivery', c.data.delivery); };
  	c.setWeight = function () { MemorySrvc.set('weight', c.data.weight); };
  	c.setContent = function () { MemorySrvc.set('content', c.data.content); };
  	c.setInstructions = function () { MemorySrvc.set('instructions', c.data.instructions); };
  	c.setPrice = function () { MemorySrvc.set('price', c.data.price); };
  	c.setCustomerRef = function () { MemorySrvc.set('customerRef', c.data.customerRef); };
  	c.setDriverRef = function () { MemorySrvc.set('driverRef', c.data.driverRef); };
  	c.setPickUpLat = function () { MemorySrvc.set('pickUpLat', c.data.pickUpLat); };
  	c.setPickUpLong = function () { MemorySrvc.set('pickUpLong', c.data.pickUpLong); };
  	c.setDropLat = function () { MemorySrvc.set('dropLat', c.data.dropLat); };
  	c.setDropLong = function () { MemorySrvc.set('dropLong', c.data.dropLong); };
  	c.setSize = function (size) { c.data.size = size; MemorySrvc.set('size', size); };

  	c.setMyId = function () { MemorySrvc.set('myId', c.myId); };

  	return c;
  }]);