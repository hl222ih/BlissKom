//These directives are used to display application icons.
//The path draw codes are based on Dmitry Baranovskiy's icon set at http://raphaeljs.com/icons/
//which are released under MIT license: http://raphaeljs.com/license.html

blissKom.directive("bkIconOk", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-ok.html'
    };
});

blissKom.directive("bkIconCancel", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-cancel.html'
    };
});

blissKom.directive("bkIconConnected", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-connected.html'
    };
});

blissKom.directive("bkIconDisconnected", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-disconnected.html'
    };
});

blissKom.directive("bkIconSwipedown", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-swipedown.html'
    };
});

blissKom.directive("bkIconLeftarrow", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-leftarrow.html'
    };
});

blissKom.directive("bkIconRightarrow", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-rightarrow.html'
    };
});

blissKom.directive("bkIconMenu", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-menu.html'
    }
});

blissKom.directive("bkIconEditmode", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-editmode.html'
    }
});

blissKom.directive("bkIconBook", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-book.html'
    }
});

blissKom.directive("bkIconHome", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/icons/button-home.html'
    }
});
