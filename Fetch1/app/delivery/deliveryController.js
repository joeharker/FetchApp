/*global app */
app.controller('DeliveryCtrl', ['DeliverySrvc',
  function (DeliverySrvc) {
    'use strict';
  	var c = this;

  	c.data = {};
  	c.data.pickup = DeliverySrvc.get('pickup');
  	c.data.delivery = DeliverySrvc.get('delivery');
  	c.data.weight = DeliverySrvc.get('weight');
  	c.data.content = DeliverySrvc.get('content');
  	c.data.instructions = DeliverySrvc.get('instructions');
  	c.data.price = DeliverySrvc.get('price');
  	c.data.customerRef = DeliverySrvc.get('customerRef');
  	c.data.driverRef = DeliverySrvc.get('driverRef');
  	c.data.pickUpLat = DeliverySrvc.get('pickUpLat');
  	c.data.pickUpLong = DeliverySrvc.get('pickUpLong');
  	c.data.dropLat = DeliverySrvc.get('dropLat');
  	c.data.dropLong = DeliverySrvc.get('dropLong');
  	c.data.size = (DeliverySrvc.get('size') === '') ? 'small' : DeliverySrvc.get('size');
  	c.myId = DeliverySrvc.get('myId');

  	c.setPickup = function () { DeliverySrvc.set('pickup', c.data.pickup); };
  	c.setDelivery = function () { DeliverySrvc.set('delivery', c.data.delivery); };
  	c.setWeight = function () { DeliverySrvc.set('weight', c.data.weight); };
  	c.setContent = function () { DeliverySrvc.set('content', c.data.content); };
  	c.setInstructions = function () { DeliverySrvc.set('instructions', c.data.instructions); };
  	c.setPrice = function () { DeliverySrvc.set('price', c.data.price); };
  	c.setCustomerRef = function () { DeliverySrvc.set('customerRef', c.data.customerRef); };
  	c.setDriverRef = function () { DeliverySrvc.set('driverRef', c.data.driverRef); };
  	c.setPickUpLat = function () { DeliverySrvc.set('pickUpLat', c.data.pickUpLat); };
  	c.setPickUpLong = function () { DeliverySrvc.set('pickUpLong', c.data.pickUpLong); };
  	c.setDropLat = function () { DeliverySrvc.set('dropLat', c.data.dropLat); };
  	c.setDropLong = function () { DeliverySrvc.set('dropLong', c.data.dropLong); };
  	c.setSize = function (size) { c.data.size = size; DeliverySrvc.set('size', size); };
  	c.setMyId = function () { DeliverySrvc.set('myId', c.myId); };

  	return c;
  }]);