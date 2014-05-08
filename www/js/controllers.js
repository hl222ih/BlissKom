blissKom.controller("MainCtrl", function($scope, $rootScope, $firebase, glossFactory, databaseService, navPageService, dataServiceProvider) { 
        databaseService.updateLocalBlissCollection();
        $rootScope.cssTemplates;  // = dataServiceProvider.cssTemplates;
        $rootScope.navPages; // = dataServiceProvider.navPages;
        $rootScope.partOfSpeechColors; // = dataServiceProvider.posColors;

//        $scope.greeting = "hello world!";
//        $scope.items = {
//            1: {
//                name: '1',
//                type: 'type1'
//            },
//            2: {
//                name: '2',
//                type: 'type2'
//            },
//            4: {
//                name: '5',
//                type: 'type4'
//            }
//        };
        $scope.updateNavigationPage = function(pageUrl) {
            //if (pageId === 2) {
            //switchStyleSheet(pageId);
                if (!pageUrl) {
                    pageUrl = "startsida";
                }

            if ($rootScope.navPages) {
                var currentNavPage = $rootScope.navPages.filter(function (nObj) {
                    return nObj.pageUrl === pageUrl;
                })[0];
            }
            if (!currentNavPage) {
                alert("Sidan kunde inte hittas.");
                return;
            }
            $scope.unitStyles = navPageService.getPageCss($rootScope.cssTemplates, currentNavPage.pageCss);
            var glossUnits = glossFactory.createGlossUnits(currentNavPage.glossData);
            $scope.testColor = "#333";
            $scope.navPage = {
                 pageName: currentNavPage.pageName,
                 pageUrl: currentNavPage.pageUrl,
                 glossUnits: glossUnits,
                 pageCss: currentNavPage.pageCss
            };

        };
        $scope.updateNavigationPage('startsida');
    });

//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});