blissKom.controller("MainCtrl", function($scope, $rootScope, $window, $state, $firebase, backupService, ngDialog, glossFactory, navPageService, dataServiceProvider) { 
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
        $rootScope.showEnlargedGlossUnit = false;
     
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
            $rootScope.showStatusMessage("Sidan saknas...");
            return false;
        }

        if ($rootScope.cssTemplates) {
            var currentCssTemplate = $rootScope.cssTemplates.filter(function (cssObj) {
                return cssObj.name === currentNavPage.pageCss;
            })[0];
        }

        //Generate navigation-page-specific CSS which will be automatically
        //loaded into the current navigation page. (navstyle.html)
        var unitStyles = navPageService.getPageCss(currentNavPage.pageCss);
        
        //From gloss-data array saved as JSON for the current navigation page, 
        //creating an array of full GlossUnit objects.
        var glossUnits = glossFactory.createGlossUnits(currentNavPage.glossData);
        
        //Create an object for the navigation page, with properties bindable
        //by the code.
        if (!$rootScope.navPage || $rootScope.navPage.pageUrl !== pageUrl) {
            $rootScope.navPage = {
                 pageName: currentNavPage.pageName,
                 pageUrl: currentNavPage.pageUrl,
                 glossUnits: glossUnits,
                 pageCss: currentNavPage.pageCss, //complete css insertable in html code.
                 cssTemplate: currentCssTemplate, //css template object
                 unitStyles: unitStyles,
                 currentGlossUnit: null
            };
        }
                
        return true;
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
            if ($scope.updateNavigationPage(glossUnit.pageLinkUrl)) {
                if ($rootScope.currentNavTree.treePageUrls[$rootScope.currentNavTree.position] === $rootScope.appSettings.defaultPageUrl) {
                    $rootScope.currentNavTree = {
                        "treePageUrls": [$rootScope.appSettings.defaultPageUrl],
                        "treePageNames": [$rootScope.appSettings.defaultPageName],
                        "position": 0
                    };                     
                }
                $rootScope.currentNavTree.treePageUrls.push(glossUnit.pageLinkUrl);
                $rootScope.currentNavTree.treePageNames.push(glossUnit.text);
                $rootScope.currentNavTree.position++;
            }
        } else {
            $rootScope.showEnlargedGlossUnit = true;
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
        $rootScope.showEnlargedGlossUnit = false;
        //$rootScope.navPage.currentGlossUnit.showComment = false;
    }
    $scope.confirmEnlargedGlossUnit = function (text) {
        $rootScope.currentNavTree.position = 0;
        $scope.updateNavigationPage($rootScope.appSettings.defaultPageUrl);
        //$rootScope.navPage.currentGlossUnit.showComment = false;
        var gu = jQuery.extend(true, {}, $rootScope.navPage.currentGlossUnit);
        if (text) {
            gu.text = text;
        }
        $rootScope.conversation.push(gu);
    }
    $scope.isMenuVisible = false;
    $scope.toggleMenu = function() { $scope.isMenuVisible = !$scope.isMenuVisible; };
    $scope.navToPrevPage = function() {
        if ($scope.updateNavigationPage($rootScope.currentNavTree.treePageUrls[$rootScope.currentNavTree.position - 1])) {
            $rootScope.currentNavTree.position--;
        }
    }

    $scope.navToNextPage = function() {
        if ($scope.updateNavigationPage($rootScope.currentNavTree.treePageUrls[$rootScope.currentNavTree.position + 1])) {
            $rootScope.currentNavTree.position++;
        }
    }

    $scope.navToPage = function(position) {
        if ($scope.updateNavigationPage($rootScope.currentNavTree.treePageUrls[position])) {
            $rootScope.currentNavTree.position = position;
            $state.go('main');
        }
    }

    $scope.showHeader = function() {
        $scope.isHeaderShown = true;
        var windowHeight = angular.element($window).height();
        $rootScope.headerHeight = 40;
        $rootScope.bodyHeight = windowHeight - 40;
    };
    $scope.hideHeader = function() {
        $scope.isHeaderShown = false;
        var windowHeight = angular.element($window).height();
        $rootScope.headerHeight = 0;
        $rootScope.bodyHeight = windowHeight;
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
    $scope.toggleLogActivity = function () {
        $rootScope.isLogActive = !$rootScope.isLogActive;
        if ($rootScope.isLogActive) {
            $rootScope.showStatusMessage("Anteckningar aktiverat...");
        } else {
            $rootScope.showStatusMessage("Anteckningar inaktiverat...");
        }
    };
    $rootScope.showStatusMessage = function (message) {
        var notElement = document.getElementsByClassName("notificationBar")[0];
        notElement.classList.remove("showForAWhile");
        notElement.offsetWidth = notElement.offsetWidth; //hack för att nollställa css-animation istället för att ta bort hela elementet och lägga till det igen...
        notElement.classList.add("showForAWhile");
        $rootScope.notification = message;
    };
    $rootScope.loadGlossUnitSettingsState = function(glossUnit){
        $rootScope.navPage.currentGlossUnit = glossUnit;
        $state.go('glossunitsettings');
    }
    $rootScope.editMode = false;
    $rootScope.toggleEditMode = function() {
        if ($rootScope.editMode) {
            $rootScope.editMode = false;
        } else {
            $rootScope.editMode = true;
        }
    };
    $rootScope.getGlossUnitByPosition = function (position) { 
        var i = 0,
        gus = $rootScope.navPage.glossUnits;
        for (; i < gus.length; i++) {
            if (position === gus[i].position) {
                return gus[i];
            }
        }
    };
    $rootScope.copyGlossUnit = function (position) {
        $rootScope.copiedGlossUnit = $rootScope.getGlossUnitByPosition(position);
        $rootScope.movedGlossUnit = null;
        $rootScope.showStatusMessage("Kopierat... Välj klistra in i valfri tom ruta...");
    };
    $rootScope.moveGlossUnit = function (position) {
        $rootScope.movedGlossUnit = $rootScope.getGlossUnitByPosition(position);
        $rootScope.copiedGlossUnit = null;
        $rootScope.showStatusMessage("Urklippt... Välj ruta att placera i och byta plats med...");
    };
    $rootScope.cancelMoveGlossUnit = function () {
        $rootScope.movedGlossUnit = null;
        $rootScope.showStatusMessage("Flytt avbruten...");
    };
    $rootScope.deleteGlossUnit = function () {
        ngDialog.open({
            template: 'views/partials/modalpopup.html', 
            scope: $scope,
            className: 'ngdialog-theme-default'
        });
    };
});

blissKom.controller("GlossUnitCtrl", function($scope, $rootScope) { 
    $scope.gu = jQuery.extend(true, {}, $rootScope.navPage.currentGlossUnit);
    var test = "";
});
//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});