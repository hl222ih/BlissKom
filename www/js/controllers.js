blissKom.controller("MainCtrl", function($scope, $rootScope, $firebase, glossFactory, databaseService, navPageService) { 
        $scope.cssTemplates = [];
        //$scope.navPages = [];
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
                                $scope.updateNavigationPage();
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
        $scope.updateNavigationPage = function(pageName) {
            //if (pageId === 2) {
            //switchStyleSheet(pageId);
                if (!pageName) {
                    pageName = "startsida";
                }

            var currentNavPage = $scope.navPages.filter(function (nObj) {
                return nObj.pageName === pageName;
            })[0];

            if (!currentNavPage) {
                alert("Något gick fel. Sidan kunde inte hittas.");
                return;
            }


            $scope.unitStyles = navPageService.getPageCss($scope.cssTemplates, currentNavPage.pageCss);
            $scope.glossUnits = glossFactory.createGlossUnits(currentNavPage.glossData);
            $scope.navPage = {
                 pageName: "startsida",
                 glossUnits: $scope.glossUnits,
                 pageCss: "test-1"
            };

        };
        $scope.testColor = "purple";
        
    });

//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});

//flytta denna...
//function switchStyleSheet(pageId) {
//    var sheet = document.getElementById('pageStyle');
//    if (sheet)
//    {
//        sheet.innerHTML = "";
//        var unitStyles = getPageCssSettings(pageId);
//        for (var i = 0; i < unitStyles.length; i++) {
//            sheet.innerHTML += "#unit" + unitStyles[i].position + " {\n";
//            sheet.innerHTML += "display: block;\nposition: absolute;\n";
//            sheet.innerHTML += "left: " + unitStyles[i].left + "%;\n";        
//            sheet.innerHTML += "top: " + unitStyles[i].top + "%;\n";     
//            sheet.innerHTML += "width: " + unitStyles[i].width + "%;\n";     
//            sheet.innerHTML += "height: " + unitStyles[i].height + "%;\n";  
//            sheet.innerHTML += "background: red; border: 1px solid blue;\n";
//            sheet.innerHTML += "}\n";
//        }
//    }
//};

//flytta denna...
//function getPageCssSettings(pageId) {
//    var unitStyles = [];
//    //lite testdata
//    unitStyles.push({position: 1, width: 10, height: 10, left: 1, top: 1});
//    unitStyles.push({position: 2, width: 10, height: 10, left: 11, top: 11});
//    unitStyles.push({position: 3, width: 10, height: 10, left: 22, top: 22});
//    unitStyles.push({position: 4, width: 10, height: 10, left: 33, top: 33});
//    unitStyles.push({position: 5, width: 20, height: 20, left: 44, top: 44});
//    return unitStyles;
//}