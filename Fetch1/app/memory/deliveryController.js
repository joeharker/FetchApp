/*global app */
app.controller("DeliveryCtrl", ["MemorySrvc",
  function (MemorySrvc) {
    "use strict";
      var c = this,
          dataName = "deliverydata";

      c.data = MemorySrvc.get(dataName) === "" ? {} : JSON.parse(MemorySrvc.get(dataName));

      c.saveData = function () {
          MemorySrvc.set(dataName, JSON.stringify(c.data));
      };

      return c;
  }]);