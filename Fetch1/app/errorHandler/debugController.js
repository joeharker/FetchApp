/*global app */
app.controller('DebugCtrl', ['ErrorService',
  function (ErrorService) {
      'use strict';
      var c = this,
          onError;

      c.LastError = '';

      onError = function (message) {
          c.LastError = message;
      };
      ErrorService.registerOnErrorObserver(onError);

      return c;
  }]);