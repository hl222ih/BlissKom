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

blissKom.directive("bkUnitGroup", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/unitgroup.html'
    };
});

blissKom.directive("testButton", function($rootScope) {
    return {
        //Jag vill att heightPercent osv. ska bindas. Hur gör jag det?
        //Som det är nu sätts storleken en gång och ändras inte när bodyHeight och bodyWidth ändras.
        scope: {
           'testval': attrs.heightPercent * $rootScope.bodyHeight / 100 + 'px' || '20px'
        },
        link: function(scope, element, attrs) {
            element.css({
                'display':'block',
                'background-color': 'blue', 
                'height': scope.testval,  //måste ange procent
                'width': attrs.widthPercent * $rootScope.bodyWidth / 100 + 'px' || 'auto',     //måste ange procent
                'left':'0', 
                'top':'0',
                'line-height': '100%',
                'padding': '0',
                'font-size': $rootScope.bodyHeight / attrs.fontSizeDivident + 'px' || '20px'
            });
        },
        restrict: 'A',
        templateUrl: 'views/partials/testbutton.html'
    }
});