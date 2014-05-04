blissKom.controller("MainCtrl", function($scope, $rootScope, $firebase, glossFactory, databaseService, navPageService) { 
        $scope.cssTemplates = [];
        $scope.navPages = [];
        $scope.partOfSpeechColors = {};
        databaseService.updateLocalBlissCollection();
        navPageService.getNavPages()
            .then(function (response) {
                $scope.navPages = response.data;
                navPageService.getPosColors()
                    .then(function (response) {
                        $scope.partOfSpeechColors = response.data;
                        navPageService.getCssTemplates()
                            .then(function (response) {
                                $scope.cssTemplates = response.data;
                                $scope.updateNavigationPage('startsida');
                            }, function (response) {
                                alert("Ett fel inträffade. Kunde inte ladda sidornas stilmallar.");
                            });
                    }, function (response) {
                        alert("Ett fel inträffade. Kunde inte ladda färginställningarna.");
                    });
            }, function (response) {
                alert("Ett fel inträffade. Kunde inte ladda orduppsättningen.");
            });
                

        $scope.greeting = "hello world!";
        $scope.items = {
            1: {
                name: '1',
                type: 'type1'
            },
            2: {
                name: '2',
                type: 'type2'
            },
            4: {
                name: '5',
                type: 'type4'
            }
        };
        $scope.updateNavigationPage = function(pageUrl) {
            //if (pageId === 2) {
            //switchStyleSheet(pageId);
                if (!pageUrl) {
                    pageUrl = "startsida";
                }

            var currentNavPage = $scope.navPages.filter(function (nObj) {
                return nObj.pageUrl === pageUrl;
            })[0];

            if (!currentNavPage) {
                alert("Något gick fel. Sidan kunde inte hittas.");
                return;
            }


            $scope.unitStyles = navPageService.getPageCss($scope.cssTemplates, currentNavPage.pageCss);
            $scope.glossUnits = glossFactory.createGlossUnits(currentNavPage.glossData);
            $scope.navPage = {
                 pageName: "startsida",
                 pageUrl: "startsida",
                 glossUnits: $scope.glossUnits,
                 pageCss: "test-1"
            };

        };
        $scope.testColor = "#333";
        $scope.navPage = {
             pageName: "startsida",
             pageUrl: "startsida",
             glossUnits: $scope.glossUnits,
             pageCss: "test-1"
        };
        
    });

//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});