blissKom.controller("MainCtrl", function($scope, $rootScope, $window, $firebase, backupService, glossFactory, navPageService, dataServiceProvider) { 
//testa spara en fil...hmmm
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function() {  
//    }, function() {
//        alert('Lyckades inte få access till filsystemet');
//    });
    //var test = $rootScope.blissAuth;

    //Function which updates the content of a navigation page
    //based on the page-url.
    //Is normally invoked by a tap of a glossUnit-link or
    //a tap of an enlarged glossUnit image as confirmation.
    $scope.updateNavigationPage = function(pageUrl) {
        $scope.showEnlargedGlossUnit = false;

        //Defaulting page-url to "startsida". 
        //Should not be hardcoded.
        if (!pageUrl) {
            pageUrl = "startsidaa";
        }
     
        //Get the navigation page with page-url from the collection of
        //all navigation pages.
        if ($rootScope.navPages) {
            var currentNavPage = $rootScope.navPages.filter(function (nObj) {
                return nObj.pageUrl === pageUrl;
            })[0];
        }
        //If no navigation page with given page-url was found, return
        //without doing anything. Show alert message.
        if (!currentNavPage) {
            alert("Sidan kunde inte hittas.");
            return;
        }

        //Generate navigation-page-specific CSS which will be automatically
        //loaded into the current navigation page. (navstyle.html)
        var unitStyles = navPageService.getPageCss(currentNavPage.pageCss);
        
        //From gloss-data array saved as JSON for the current navigation page, 
        //creating an array of full GlossUnit objects.
        var glossUnits = glossFactory.createGlossUnits(currentNavPage.glossData);
        
        //Create an object for the navigation page, with properties bindable
        //by the code.
        $rootScope.navPage = {
             pageName: currentNavPage.pageName,
             pageUrl: currentNavPage.pageUrl,
             glossUnits: glossUnits,
             pageCss: currentNavPage.pageCss,
             unitStyles: unitStyles,
             currentGlossUnit: null
        };
        $rootScope.headings = [];
    };

    //Displays the navigation page with url "startsida", the main navigation page.
    //Should remove the 'startsida' hard coding to allow several parallel
    //navigation setups.
    $scope.updateNavigationPage($rootScope.currentNavTree.treePageUrls[$rootScope.currentNavTree.position]);
    //$scope.login = function() {
    //    databaseServiceProvider.getServerBlissCollection()
    //    .then( function() {
    //        alert("finished!");
    //    });
    //}
    $scope.doBackup = backupService.doBackup;
    $scope.glossUnitClick = function (glossUnit) {
        if (glossUnit.isPageLink()) {
            $scope.updateNavigationPage(glossUnit.pageLinkUrl);
        } else {
            $scope.showEnlargedGlossUnit = true;
            $rootScope.navPage.currentGlossUnit = glossUnit;
        }
    };
    $scope.cancelEnlargedGlossUnit = function () {
        $scope.showEnlargedGlossUnit = false;
    }
    $scope.confirmEnlargedGlossUnit = function () {
        $scope.updateNavigationPage($rootScope.appSettings.defaultPageUrl);
    }
    $scope.isMenuVisible = false;
    $scope.toggleMenu = function() { $scope.isMenuVisible = !$scope.isMenuVisible; };
    $scope.navToPrevPage = function() {
        //till startsidan som test
        $scope.updateNavigationPage($rootScope.appSettings.defaultPageUrl);
    }
    $scope.showHeader = function() {
        $scope.isHeaderShown = true;
        $rootScope.headerHeight = 40;
    };
    $scope.hideHeader = function() {
        $scope.isHeaderShown = false;
        $rootScope.headerHeight = 0;
    };
});

//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});