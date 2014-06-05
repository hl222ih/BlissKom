blissKom.controller("MainCtrl", function($scope, $rootScope, $window, $document, $state, $firebase, ngDialog, glossFactory, backupService, navPageService, dataServiceProvider) { 
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
        var isNavigatingToNewPage = true;
     
        if (!pageUrl && $rootScope.navPage) {
            pageUrl = $rootScope.navPage.pageUrl;
            isNavigatingToNewPage = false;
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
            isNavigatingToNewPage = false;
            return isNavigatingToNewPage;
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
        //if (!$rootScope.navPage || $rootScope.navPage.pageUrl !== pageUrl) {
            $rootScope.navPage = {
                 pageName: currentNavPage.pageName,
                 pageUrl: currentNavPage.pageUrl,
                 glossUnits: glossUnits,
                 pageCss: currentNavPage.pageCss, //complete css insertable in html code.
                 cssTemplate: currentCssTemplate, //css template object
                 unitStyles: unitStyles,
                 currentGlossUnit: null
            };
        //}
                
        return isNavigatingToNewPage;
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
            } else {
                $rootScope.showStatusMessage("Sidan saknas...");
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
        } else {
            $rootScope.showStatusMessage("Sidan saknas...");
        }
    };

    $scope.navToNextPage = function() {
        if ($scope.updateNavigationPage($rootScope.currentNavTree.treePageUrls[$rootScope.currentNavTree.position + 1])) {
            $rootScope.currentNavTree.position++;
        } else {
            $rootScope.showStatusMessage("Sidan saknas...");
        }
    };

    $scope.navToPage = function(position) {
        if ($scope.updateNavigationPage($rootScope.currentNavTree.treePageUrls[position])) {
            $rootScope.currentNavTree.position = position;
            $state.go('main');
        } else {
            $rootScope.showStatusMessage("Sidan saknas...");
        }
    };

    $rootScope.showHeader = function() {
        $rootScope.isHeaderHidden = false;
        var windowHeight = angular.element($window).height();
        $rootScope.headerHeight = 42;
        $rootScope.bodyHeight = windowHeight - 42;
    };
    $rootScope.hideHeader = function() {
        $rootScope.isHeaderHidden = true;
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
            cgu.currentFilename = cgu.glossSubUnitsLeft[-pos-2].filename;
            cgu.currentPath = cgu.glossSubUnitsLeft[-pos-2].path;
            cgu.currentText = cgu.glossSubUnitsLeft[-pos-2].text;
            cgu.currentComment = cgu.glossSubUnitsLeft[-pos-2].comment;
            cgu.currentPartOfSpeech = cgu.glossSubUnitsLeft[-pos-2].partOfSpeech;
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
    $rootScope.loadGlossUnitSettingsState = function(position) {
        $rootScope.settingGlossUnit = $rootScope.getGlossUnitByPosition(position);
        if (!$rootScope.settingGlossUnit) {
            $rootScope.settingGlossUnit = {};
        }
        $state.go('glossunitsettings');
    };
    $rootScope.loadAboutState = function() {
        $state.go('about');
    };
    $rootScope.loadBackupState = function() {
        $state.go('backup');
    };
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
                gus[i].pageUrl = $rootScope.navPage.pageUrl;
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
    $rootScope.deleteGlossUnit = function (position) {
        $rootScope.activePosition = position;
        $scope.message = 'Vill du verkligen radera rutans hela innehåll?';
        $scope.ok = function () {
            $rootScope.dialogResult = true;
        };
        $scope.cancel = function () {
            $rootScope.dialogResult = false;
        };
        ngDialog.open({
            template: 'views/partials/modalpopup.html', 
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.$on('ngDialog.closed', function(e, $dialog) {
        if ($rootScope.dialogResult) {
            $rootScope.removeGlossUnitByPosition($rootScope.activePosition);
            $scope.updateNavigationPage();
            $rootScope.showStatusMessage("Rutans innehåll borttaget...");
        }
    });
    $rootScope.removeGlossUnitByPosition = function (position, pageUrl) {
        if (!pageUrl) {
            pageUrl = $rootScope.navPage.pageUrl;
        }
        var navPage = $rootScope.navPages.filter(function (np) {
            return np.pageUrl === pageUrl;
        })[0];
        var glossUnit = navPage.glossData.filter(function (gu) {
            return gu.position === position;
        })[0];
        var index = navPage.glossData.indexOf(glossUnit);
        if (index != -1) {
            navPage.glossData.splice(index, 1);
        }
    };
    $rootScope.addGlossUnitByPosition = function (glossUnit, position, pageUrl) {
        if (!pageUrl) {
            pageUrl = $rootScope.navPage.pageUrl;
        }
        var navPage = $rootScope.navPages.filter(function (np) {
            return np.pageUrl === pageUrl;
        })[0];
        glossUnit.position = position;
        navPage.glossData.push(glossUnit);        
    };
    $rootScope.placeAndSwitchGlossUnit = function (position) {
        var fromPosition = $rootScope.movedGlossUnit.position;
        var toPosition = position;
        var fromPageUrl = $rootScope.movedGlossUnit.pageUrl;
        //var toPage not needed
        
        var movedGlossUnit = jQuery.extend(true, {}, $rootScope.movedGlossUnit);
        var switchGlossUnit = jQuery.extend(true, {}, $rootScope.getGlossUnitByPosition(toPosition));

        movedGlossUnit.position = toPosition;

        $rootScope.removeGlossUnitByPosition(toPosition);
        $rootScope.addGlossUnitByPosition(movedGlossUnit, toPosition);
        $rootScope.removeGlossUnitByPosition(fromPosition, fromPageUrl);
        if (JSON.stringify(switchGlossUnit) !== '{}') {
            switchGlossUnit.position = fromPosition;
            $rootScope.addGlossUnitByPosition(switchGlossUnit, fromPosition, fromPageUrl);
        }
        $rootScope.movedGlossUnit = null;
        $scope.updateNavigationPage();
    };
    $rootScope.pasteGlossUnit = function (position) {
        $rootScope.addGlossUnitByPosition(jQuery.extend(true, {}, $rootScope.copiedGlossUnit), position);
        $scope.updateNavigationPage();
    };
});

blissKom.controller("GlossUnitCtrl", function($scope, $rootScope, $state) {
    $scope.update = function () {
        $rootScope.sgu.activeText = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.text : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].text : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].text);
        $rootScope.sgu.activeComment = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.comment : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].comment : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].comment);
        $rootScope.sgu.activeFilename = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.filename : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].filename : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].filename);
        $rootScope.sgu.activePartOfSpeech = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.partOfSpeech : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].partOfSpeech : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].partOfSpeech);
    }
    if (!$rootScope.settingGlossUnit.activeLeftRightPosition) {
        $rootScope.settingGlossUnit.activeLeftRightPosition = 0;
    }
    $rootScope.sgu = jQuery.extend(true, {}, $rootScope.settingGlossUnit);
    $scope.update();
    var test = "";
    $scope.getSelectedValueFromDDL = function () {
        var posDdl = $document.getElementById("posDdl");
        var val = posDdl.options[posDdl.selectedIndex].value;
        return val;
    };
    $scope.selectBlissSymbol = function () {
        $rootScope.settingGlossUnit.activeLeftRightPosition = $rootScope.sgu.activeLeftRightPosition;
        $state.go('blisselection');
    };
    $scope.updateSguComment = function () {
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            $rootScope.sgu.comment = $rootScope.sgu.activeComment;
        } else if ($rootScope.sgu.activeLeftRightPosition < 0) {
            $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].comment = $rootScope.sgu.activeComment;
        } else {
            $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].comment = $rootScope.sgu.activeComment;
        }    
    };
    $scope.updateSguText = function () {
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            $rootScope.sgu.text = $rootScope.sgu.activeText;
        } else if ($rootScope.sgu.activeLeftRightPosition < 0) {
            $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].text = $rootScope.sgu.activeText;
        } else {
            $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].text = $rootScope.sgu.activeText;
        }    
    };
    $scope.updateSguFilename = function () {
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            $rootScope.sgu.filename = $rootScope.sgu.activeFilename;
        } else if ($rootScope.sgu.activeLeftRightPosition < 0) {
            $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].filename = $rootScope.sgu.activeFilename;
        } else {
            $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].filename = $rootScope.sgu.activeFilename;
        }    
    };
    $scope.addRightImage = function () {
        if ($rootScope.sgu.glossSubUnitsRight.length < 3) {
            $rootScope.sgu.glossSubUnitsRight.push({text: $rootScope.sgu.text, comment: ''});
            $scope.activateImage($rootScope.sgu.glossSubUnitsRight.length);
        } else {
            $rootScope.showStatusMessage("Kan bara ha tre sidobilder...");
        }
    }
    $scope.addLeftImage = function () {
        if ($rootScope.sgu.glossSubUnitsLeft.length < 3) {        
            $rootScope.sgu.glossSubUnitsLeft.push({text: $rootScope.sgu.text, comment: ''});
            $scope.activateImage(-$rootScope.sgu.glossSubUnitsLeft.length);
        } else {
            $rootScope.showStatusMessage("Kan bara ha tre sidobilder...");
        }
    }
    $scope.activateImage = function (leftRightPosition) {
        $rootScope.sgu.activeLeftRightPosition = leftRightPosition;
        $scope.update();
    }
    $scope.getActiveFullPath = function () {
        var gu = {};
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            gu = $rootScope.sgu;
        } else if ($rootScope.sgu.activeLeftRightPosition < 0) {
            gu = $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1];
        } else {
            gu = $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1];
        }    

        if (gu.path === "bliss") {
            return $rootScope.appSettings.onlineBlissUrl + $rootScope.sgu.activeFilename;
        } else if (gu.path === "rt") {
            return $rootScope.appSettings.onlineRtUrl + $rootScope.sgu.activeFilename;
        }
    }
    $scope.getActivePath = function () {
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            return $rootScope.sgu.path;
        } else if ($rootScope.sgu.activeLeftRightPosition < 0) {
            return $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].path;
        } else {
            return $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].path;
        }    
    }
    $scope.$on("$destroy", function(){
        var nps = $rootScope.navPages;
        var glossUnitsToUpdate = [];
        for (var i = 0; i < nps.length; i++) {
            var tempGus = nps[i].glossData.filter(function (gu) {
                return gu.glossId === $rootScope.sgu.glossId;
            });
            glossUnitsToUpdate = glossUnitsToUpdate.concat(tempGus);
        }
        for (var j = 0; j < glossUnitsToUpdate.length; j++) {
            glossUnitsToUpdate[j].text = $rootScope.sgu.text;
            glossUnitsToUpdate[j].comment = $rootScope.sgu.comment;
            glossUnitsToUpdate[j].pageLinkUrl = $rootScope.sgu.pageLinkUrl;
            glossUnitsToUpdate[j].partOfSpeech = $rootScope.sgu.partOfSpeech;
            glossUnitsToUpdate[j].glossSubUnitsLeft = jQuery.extend(true, [], $rootScope.sgu.glossSubUnitsLeft);
            glossUnitsToUpdate[j].glossSubUnitsRight = jQuery.extend(true, [], $rootScope.sgu.glossSubUnitsRight); //deepcopy array
        }
    });
    $scope.returnToNav = function () {
        $state.go('main');
    };
});

blissKom.controller("SelectImageCtrl", function($scope, $rootScope, $state, dataServiceProvider) {
    $scope.selectImage = function(glossId) {
        var selectedBlissGlossUnit = $rootScope.blissData.filter(function (bObj) {
                return bObj.gloss === glossId;
            })[0];
        if (selectedBlissGlossUnit) {
            if ($rootScope.settingGlossUnit.activeLeftRightPosition === 0) {
                $rootScope.settingGlossUnit.glossId = selectedBlissGlossUnit.gloss;
                $rootScope.settingGlossUnit.glossText = selectedBlissGlossUnit.glossText;
                $rootScope.settingGlossUnit.text = selectedBlissGlossUnit.glossText;
                $rootScope.settingGlossUnit.comment = "";
                $rootScope.settingGlossUnit.partOfSpeech = selectedBlissGlossUnit.partOfSpeech;
                $rootScope.settingGlossUnit.filename = selectedBlissGlossUnit.filename + '.svg';
                $rootScope.settingGlossUnit.path = "bliss";
            } else if ($rootScope.settingGlossUnit.activeLeftRightPosition < 0) {
                if (!$rootScope.settingGlossUnit.glossSubUnitsLeft[-$rootScope.settingGlossUnit.activeLeftRightPosition - 1]) {
                    $rootScope.settingGlossUnit.glossSubUnitsLeft.splice(-$rootScope.settingGlossUnit.activeLeftRightPosition - 1, 0, {});
                }
                $rootScope.settingGlossUnit.glossSubUnitsLeft[-$rootScope.settingGlossUnit.activeLeftRightPosition - 1].text = selectedBlissGlossUnit.glossText;
                $rootScope.settingGlossUnit.glossSubUnitsLeft[-$rootScope.settingGlossUnit.activeLeftRightPosition - 1].comment = "";
                $rootScope.settingGlossUnit.glossSubUnitsLeft[-$rootScope.settingGlossUnit.activeLeftRightPosition - 1].partOfSpeech = selectedBlissGlossUnit.partOfSpeech;
                $rootScope.settingGlossUnit.glossSubUnitsLeft[-$rootScope.settingGlossUnit.activeLeftRightPosition - 1].filename = selectedBlissGlossUnit.filename + '.svg';             
                $rootScope.settingGlossUnit.glossSubUnitsLeft[-$rootScope.settingGlossUnit.activeLeftRightPosition - 1].path = "bliss";
            } else { //$rootScope.settingGlossUnit.activeLeftRightPosition > 0
                if (!$rootScope.settingGlossUnit.glossSubUnitsRight[$rootScope.settingGlossUnit.activeLeftRightPosition - 1]) {
                    $rootScope.settingGlossUnit.glossSubUnitsRight.splice($rootScope.settingGlossUnit.activeLeftRightPosition - 1, 0, {});
                }
                $rootScope.settingGlossUnit.glossSubUnitsRight[$rootScope.settingGlossUnit.activeLeftRightPosition - 1].text = selectedBlissGlossUnit.glossText;
                $rootScope.settingGlossUnit.glossSubUnitsRight[$rootScope.settingGlossUnit.activeLeftRightPosition - 1].comment = "";
                $rootScope.settingGlossUnit.glossSubUnitsRight[$rootScope.settingGlossUnit.activeLeftRightPosition - 1].partOfSpeech = selectedBlissGlossUnit.partOfSpeech;
                $rootScope.settingGlossUnit.glossSubUnitsRight[$rootScope.settingGlossUnit.activeLeftRightPosition - 1].filename = selectedBlissGlossUnit.filename + '.svg';
                $rootScope.settingGlossUnit.glossSubUnitsRight[$rootScope.settingGlossUnit.activeLeftRightPosition - 1].path = "bliss";
            }
        }
        $state.go('glossunitsettings');
    };
    $scope.downloadBlissData = function() {
        if (!$rootScope.blissData) {
            $rootScope.showStatusMessage("Laddar ner blissdata... Kan ta en stund. ");
            dataServiceProvider.downloadBlissData();
        } else {
            $rootScope.showStatusMessage("Blissdata finns redan.");
        }
    };
});
blissKom.controller("AboutCtrl", function() {
});
blissKom.controller("BackupCtrl", function($scope, $rootScope, backupService) {
    $scope.doBackup = backupService.doBackup;
    backupService.retrieveListOfBackup();
    $scope.setActiveBackup = function (index) {
        $rootScope.activeBackup = $rootScope.backupDates[index];
    };
    $scope.activateBackup = backupService.activateBackup;
});
//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});