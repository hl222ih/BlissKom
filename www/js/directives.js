//This is a directive for a unit with an image shown on a navigation page.
blissKom.directive("bkGlossUnitSmall", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/glossunit-small.html'
    };
});

//This is directive for dynamic css style information for a navigation page.
blissKom.directive("bkNavStyle", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/navstyle.html'
    };
});

blissKom.directive("bkGlossUnitBig", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/glossunit-big.html'
    };
});