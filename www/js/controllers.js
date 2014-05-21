blissKom.controller("MainCtrl", function($scope, $rootScope, $window, $firebase, backupService, glossFactory, navPageService, dataServiceProvider) { 
//testa spara en fil...hmmm
//    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function() {  
//    }, function() {
//        alert('Lyckades inte få access till filsystemet');
//    });
    //var test = $rootScope.blissAuth;
    $rootScope.conversation = [];

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
        if (!$rootScope.navPage) {
            $rootScope.navPage = {
                 pageName: currentNavPage.pageName,
                 pageUrl: currentNavPage.pageUrl,
                 glossUnits: glossUnits,
                 pageCss: currentNavPage.pageCss,
                 unitStyles: unitStyles,
                 currentGlossUnit: null
            };
        }
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
            $rootScope.navPage.currentGlossUnit = jQuery.extend(true, {}, glossUnit); //deepcopy glossUnit
            $rootScope.navPage.currentGlossUnit.currentFilename = $rootScope.navPage.currentGlossUnit.filename;
            $rootScope.navPage.currentGlossUnit.currentPath = $rootScope.navPage.currentGlossUnit.path;
            $rootScope.navPage.currentGlossUnit.currentText = $rootScope.navPage.currentGlossUnit.text;
            $rootScope.navPage.currentGlossUnit.currentComment = $rootScope.navPage.currentGlossUnit.comment;
            $rootScope.navPage.currentGlossUnit.currentPartOfSpeech = $rootScope.navPage.currentGlossUnit.partOfSpeech;
            $rootScope.navPage.currentGlossUnit.currentPosition = 0;
        }
    };
    $scope.cancelEnlargedGlossUnit = function () {
        $scope.showEnlargedGlossUnit = false;
    }
    $scope.confirmEnlargedGlossUnit = function (text) {
        $scope.updateNavigationPage($rootScope.appSettings.defaultPageUrl);
        var gu = jQuery.extend(true, {}, $rootScope.navPage.currentGlossUnit);
        if (text) {
            gu.text = text;
        }
        $rootScope.conversation.push(gu);
        var pause = "";
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
    $scope.showLeftImageOfGlossUnit = function() {
        var cgu = $rootScope.navPage.currentGlossUnit;
        var pos = cgu.currentPosition;

        if (pos <= 0) {  
            if (cgu.glossSubUnitsLeft[-pos]) {
                cgu.currentFilename = cgu.glossSubUnitsLeft[-pos].filename;
                cgu.currentPath = cgu.glossSubUnitsLeft[-pos].path;
                cgu.currentText = cgu.glossSubUnitsLeft[-pos].text;
                cgu.currentComment = cgu.glossSubUnitsLeft[-pos].comment;
                cgu.currentPartOfSpeech = cgu.glossSubUnitsLeft[-pos].partOfSpeech;
                cgu.currentPosition--;
            }
        } else if (pos === 1) {
            cgu.currentFilename = cgu.filename;
            cgu.currentPath = cgu.path;
            cgu.currentText = cgu.text;
            cgu.currentComment = cgu.comment;
            cgu.currentPartOfSpeech = cgu.partOfSpeech;
            cgu.currentPosition--;
        } else if (pos > 1) {
            cgu.currentFilename = cgu.glossSubUnitsRight[pos-2].filename;
            cgu.currentPath = cgu.glossSubUnitsRight[pos-2].path;
            cgu.currentText = cgu.glossSubUnitsRight[pos-2].text;
            cgu.currentComment = cgu.glossSubUnitsRight[pos-2].comment;
            cgu.currentPartOfSpeech = cgu.glossSubUnitsRight[pos-2].partOfSpeech;
            cgu.currentPosition--;
        }
    };
    $scope.showRightImageOfGlossUnit = function() {
        var cgu = $rootScope.navPage.currentGlossUnit;
        var pos = cgu.currentPosition;

        if (pos >= 0) {
            if (cgu.glossSubUnitsRight[pos]) {
                cgu.currentFilename = cgu.glossSubUnitsRight[pos].filename;
                cgu.currentPath = cgu.glossSubUnitsRight[pos].path;
                cgu.currentText = cgu.glossSubUnitsRight[pos].text;
                cgu.currentComment = cgu.glossSubUnitsRight[pos].comment;
                cgu.currentPartOfSpeech = cgu.glossSubUnitsRight[pos].partOfSpeech;
                cgu.currentPosition++;
            }
        } else if (pos === -1) {
            cgu.currentFilename = cgu.filename;
            cgu.currentPath = cgu.path;
            cgu.currentText = cgu.text;
            cgu.currentComment = cgu.comment;
            cgu.currentPartOfSpeech = cgu.partOfSpeech;
            cgu.currentPosition++;
        } else if (pos < -1) {
            cgu.currentFilename = cgu.glossSubUnitsLeft[pos+2].filename;
            cgu.currentPath = cgu.glossSubUnitsLeft[pos+2].path;
            cgu.currentText = cgu.glossSubUnitsLeft[pos+2].text;
            cgu.currentComment = cgu.glossSubUnitsLeft[pos+2].comment;
            cgu.currentPartOfSpeech = cgu.glossSubUnitsLeft[pos+2].partOfSpeech;
            cgu.currentPosition++;
        }
    };
});

//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});