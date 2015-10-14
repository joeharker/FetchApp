app.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                try {
                    scope.$eval(attrs.imageonloadfunction); //NOTE: this comes in all lowercase
                } catch (e) {
                    alert(e.message);
                }
            });
        }
    };
});