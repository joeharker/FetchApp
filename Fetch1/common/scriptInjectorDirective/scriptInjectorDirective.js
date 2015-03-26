/*global app */
app.directive('joeScript', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var tag = document.createElement('script');

            tag.src = attrs.src;

            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    };
});