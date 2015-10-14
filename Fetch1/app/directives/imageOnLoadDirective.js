app.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                try {
                    alert(JSON.stringify(attrs.imageonloadfunction));
                    scope.$eval(attrs.imageonloadfunction);
                } catch (e) {
                    alert(e.message);
                }
            });
        }
    };
});