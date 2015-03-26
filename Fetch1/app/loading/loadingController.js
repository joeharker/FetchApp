/*global app */
app.controller('loadingCtrl', [
  function () {
      'use strict';
      var c = this;

      c.loadApp = function (pageCtrl) {
          pageCtrl.template = 'app/clientType/clientType.html';
      };

      return c;
  }]);