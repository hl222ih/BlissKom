//This is directive for dynamic css style information for a navigation page.
blissKom.directive("bkNavStyle", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/navstyle.html'
    };
});

//This is a directive for a unit with an image shown on a navigation page.
blissKom.directive("bkGlossUnitSmall", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/glossunit-small.html'
    };
});

blissKom.directive("bkGlossUnitBig", function() {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/glossunit-big.html'
    };
});

blissKom.directive("bkUnitGroup", function($window, $document, $log) {
    return {
        restrict: 'E',
        templateUrl: 'views/partials/unitgroup.html',
        link: function (scope, elem, attrs) {
            elem.bind("touchstart", function (e) {
                if (!scope.group.isBusy && e.target.parentElement === e.currentTarget) {
                    if (!$(elem).hasClass("groupborder")) {
                        elem.addClass("groupborder");
                        //var audio = new Audio('sounds/250537__oceanictrancer__short-click-hat.wav');
                        //audio.play();
                        scope.touchStartTarget = e.target;
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            });
            elem.bind("touchend", function (e) {
                if (!scope.group.isBusy && e.target.parentElement === e.currentTarget) {
                    if ($(elem).hasClass("groupborder")) {
                        elem.removeClass("groupborder");
                        //var audio = new Audio('sounds/250537__oceanictrancer__short-click-hat.wav');
                        //audio.play();
                        scope.toggleGroupEnlargement(scope.group, elem);
                        scope.$apply();                    
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            });
            elem.bind("touchmove", function (e) {                
                e.stopPropagation();
                e.preventDefault();
                
                if ($(elem).hasClass("groupborder")) {
                    var x = e.originalEvent.changedTouches[0].pageX  - $window.pageXOffset;
                    var y = e.originalEvent.changedTouches[0].pageY  - $window.pageYOffset;
                    var target = document.elementFromPoint(x, y);
                    if (scope.touchStartTarget !== target) {
                        elem.removeClass("groupborder");         
                    }
                }
            });
        }
    };
});

blissKom.directive('bkImgSrc', function(appDataService) {
    return {
        restrict: 'A',
        scope: { obj: '=' },
        link: function (scope, elem, attrs) {
             elem.attr('src', appDataService.getImageUrl(scope.obj));       
        }
    };
});

blissKom.directive("testglossunit", function($window, $document, $log) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.bind("touchstart", function (e) {
                if (!scope.group.isBusy && !$(elem).hasClass("glossborder")) {
                    elem.addClass("glossborder");
                    //var audio = new Audio('sounds/250537__oceanictrancer__short-click-hat.wav');
                    //audio.play();
                    scope.touchStartTarget = e.target;
                }
            });
            elem.bind("touchend", function (e) {
                if (!scope.group.isBusy && $(elem).hasClass("glossborder")) {
                    elem.removeClass("glossborder");
                    //var audio = new Audio('sounds/250537__oceanictrancer__short-click-hat.wav');
                    //audio.play();
                    scope.glossUnitClick(scope.glossUnit);
                    scope.$apply();                    
                }
            });
            elem.bind("touchmove", function (e) {
                if ($(elem).hasClass("glossborder")) {
                    var x = e.originalEvent.changedTouches[0].pageX  - $window.pageXOffset;
                    var y = e.originalEvent.changedTouches[0].pageY  - $window.pageYOffset;
                    var target = document.elementFromPoint(x, y);
                    if (scope.touchStartTarget !== target) {
                        elem.removeClass("glossborder");         
                    }
                }
            });
        }
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
    };
});