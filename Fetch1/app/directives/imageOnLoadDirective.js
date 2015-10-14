app.directive('imageonload', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
                alert("s="+ scope +" e="+ element +" a="+ attrs);
            });
        }
    };
});