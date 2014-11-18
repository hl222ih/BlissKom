blissKom.controller("HeaderCtrl", function ($scope, $state, appDataService) {
    $scope.settings = appDataService.appSettings;
    $scope.isLogging = function () { return $scope.settings.logging; };
    $scope.navTree = appDataService.navTree;
    $scope.isMenuVisible = false;
    $scope.isEditMode = function () { 
        return $scope.settings.editMode;
    };
    
    $scope.dim = appDataService.dimensions;
    $scope.isHeaderHidden = function () { return appDataService.isHeaderHidden(); };
    
    //activates/deactivates logging of communication.
    $scope.toggleLogging = function () {
        appDataService.toggleLogging();
    };

    $scope.toggleEditMode = function() {
        appDataService.toggleEditMode();
    };

    $scope.navToStartPage = function() {
        appDataService.setNavTreePosition(0);
        $state.go('main');
    };
    $scope.navToPage = function(position) {
        //if (tryUpdateNavPage(appDataService.navTree.treePageUrls[position])) {
            appDataService.setNavTreePosition(position);
            //$rootScope.currentNavTree.position = position;
            //$state.go('main');
        //}
    };
    
    $scope.loadAboutState = function() {
        $state.go('about');
    };
    $scope.loadTestState = function() {
        $state.go('test');
    };
    $scope.loadBackupState = function() {
        $state.go('backup');
    };
    $scope.loadConversationState = function() {
        $state.go('conversation');
    };
});

blissKom.controller("MainCtrl", function($log, $scope, $rootScope, $window, $timeout, $document, $state, $firebase, ngDialog, glossFactory, navPageFactory, backupService, navPageService, dataServiceProvider, appDataService) {
    $scope.settings = appDataService.appSettings;
    $scope.isLogging = function () { return $scope.settings.logging; };
    $scope.pos = appDataService.partOfSpeechColorsData;
    $scope.conversation = appDataService.getConversation;
    $scope.navTree = appDataService.navTree;
    $scope.isEditMode = function () { 
        return $scope.settings.editMode;
    };
    $scope.dim = appDataService.dimensions;
    $scope.isHeaderHidden = function () { return appDataService.isHeaderHidden(); };
    $scope.navBodyCss = appDataService.navBodyCss;
    $scope.$watch( function () { return appDataService.navTree.position; }, function (position) {
        tryUpdateNavPage(appDataService.navTree.pages[position].url);    
    });    


    $scope.restore = function () {
        $scope.showEnlargedGlossUnit = false;
        var dim = document.getElementsByClassName("dim")[0];
        var enlargedGroupElem = document.querySelectorAll("bk-unit-group")[0];
        $log.log("hej");
        $log.log(enlargedGroupElem);
        $scope.toggleGroupEnlargement($scope.currentGroup, $scope.currentGroupElement);
    };

    //used by bkUnitGroup directive
    $scope.toggleGroupEnlargement = function (group, elem) {
        $scope.currentGroup = group;
        $scope.currentGroupElement = elem;
        var dim = document.getElementsByClassName("dim")[0];
        if (!group.minifiedGroupCss) {
            group.minifiedGroupCss = {
                'z-index': 2
            };
            group.minifiedGroupCss = jQuery.extend({}, group.css);
        }
        if (!group.enlargedGroupCss) {
            group.enlargedGroupCss = {
                width: '80%',
                height: '80%',
                top: '10%',
                left: '10%',
                'z-index': 4
            };
        }
        if (!group.isBusy) {
            group.isBusy = true;
            if (group.isEnlarged) {
                group.minifiedGroupCss.zIndex = 4;
                $(dim).velocity(
                    {
                        opacity: 0
                    },
                    {
                        duration: 500,
                        easing: "linear"
                    });        
                $(elem).velocity(
                    {
                        width: group.minifiedGroupCss.width,
                        height: group.minifiedGroupCss.height,
                        top: group.minifiedGroupCss.top,
                        left: group.minifiedGroupCss.left,
                        'z-index': 2
                    },
                    {
                        duration: 500,
                        easing: "linear"
                    });
                var guElemsS = $(elem).find(".glossUnits");
                for (var i = 0; i < group.glossUnits.length; i++) {

                    if (group.glossUnits[i].smallCss) {
                        $(guElemsS[i]).velocity(
                            {
                                width: group.glossUnits[i].smallCss.width,
                                height: group.glossUnits[i].smallCss.height,
                                top: group.glossUnits[i].smallCss.top,
                                left: group.glossUnits[i].smallCss.left
                            },
                            {
                                duration: 500,
                                easing: "linear"
                            });
                        group.glossUnits[i].css = group.glossUnits[i].smallCss;
                    }
                }

                $timeout(function() {
                    group.css = jQuery.extend({}, group.minifiedGroupCss);
                }, 500);
                //timeout 500ms to not hide bk-gloss-unit element during transition
                //corresponds to css transition of same period of time. (.bk-gloss-unit).
                $timeout(function() {
                    group.css.zIndex = 2;
                    group.isEnlarged = false;
                    group.isBusy = false;
                    $(dim).css("visibility", "hidden");
                }, 500);
            } else {
                group.css.zIndex = 4;
                $(dim).css("visibility", "visible");
                $(dim).velocity(
                    {
                        opacity: 1
                    },
                    {
                        duration: 500,
                        easing: "linear"
                    });        
                $(elem).velocity(
                    {
                        width: group.enlargedGroupCss.width,
                        height: group.enlargedGroupCss.height,
                        top: group.enlargedGroupCss.top,
                        left: group.enlargedGroupCss.left
                    },
                    {
                        duration: 500,
                        easing: "linear"
                    });
                group.css = jQuery.extend({}, group.enlargedGroupCss);
                var guElemsS = $(elem).find(".glossUnits");
                for (var i = 0; i < group.glossUnits.length; i++) {
                    if (group.glossUnits[i].enlargedCss) {
                        $(guElemsS[i]).velocity(
                            {
                                width: group.glossUnits[i].enlargedCss.width,
                                height: group.glossUnits[i].enlargedCss.height,
                                top: group.glossUnits[i].enlargedCss.top,
                                left: group.glossUnits[i].enlargedCss.left
                            },
                            {
                                duration: 500,
                                easing: "linear"
                            });
                        group.glossUnits[i].smallCss = group.glossUnits[i].css;                    
                        group.glossUnits[i].css = group.glossUnits[i].enlargedCss;
                    }                
                }
                $timeout(function() {
                    group.isEnlarged = true;
                    group.isBusy = false;
                }, 500);
            }
        }
    };
    
    //Function which updates the content of a navigation page
    //based on the page-url.
    //Is normally invoked by a tap of a glossUnit-link or
    //a tap of an enlarged glossUnit image as confirmation.
    var tryUpdateNavPage = function(pageUrl) {
        var isNavigatingToNewPage = true;

        var dim = document.getElementsByClassName("dim")[0];
        $(dim).css({"visibility":"hidden","opacity":"0"});
        
        $scope.showEnlargedGlossUnit = false;
         
        if (!pageUrl && $scope.navPage) {
            pageUrl = $scope.navPage.pageUrl;
            isNavigatingToNewPage = false;
        }

        try {
            $scope.navPage = navPageFactory.createNavPage(pageUrl);
        } catch (error) {
            if (error.name === "PageNotFoundException") {
                isNavigatingToNewPage = false;
                $rootScope.showStatusMessage("Sidan saknas...");
            } else {
                throw error;
            }            
        }
                
        return isNavigatingToNewPage;
    };

    tryUpdateNavPage(appDataService.navTree.pages[appDataService.navTree.position].url);
    
    $scope.glossUnitClick = function (glossUnit) {
        if (glossUnit.isPageLink()) {
            if (tryUpdateNavPage(glossUnit.pageLinkUrl)) {
                appDataService.pushToNavTree(glossUnit.pageLinkUrl, glossUnit.text);
            } else {
            }
        } else {
            $scope.showEnlargedGlossUnit = true;
            $scope.navPage.currentGlossUnit = jQuery.extend(true, {}, glossUnit); //deepcopy glossUnit
            $scope.navPage.currentGlossUnit.currentFilename = $scope.navPage.currentGlossUnit.filename;
            $scope.navPage.currentGlossUnit.currentPath = $scope.navPage.currentGlossUnit.path;
            $scope.navPage.currentGlossUnit.currentText = $scope.navPage.currentGlossUnit.text;
            $scope.navPage.currentGlossUnit.currentComment = $scope.navPage.currentGlossUnit.comment;
            $scope.navPage.currentGlossUnit.currentPartOfSpeech = $scope.navPage.currentGlossUnit.partOfSpeech;
            $scope.navPage.currentGlossUnit.currentColorGlossBackgroundColorCode = $scope.navPage.currentGlossUnit.colorGlossBackgroundColorCode;
            $scope.navPage.currentGlossUnit.currentPosition = 0;
        }
    };
    $scope.cancelEnlargedGlossUnit = function () {
        $scope.showEnlargedGlossUnit = false;
    };
    $scope.confirmEnlargedGlossUnit = function (text) {
        if ($scope.isLogging()) {
            var gu = jQuery.extend(true, {}, $scope.navPage.currentGlossUnit);
            if (text) {
                gu.text = text;
            }
            appDataService.pushToConversation(gu);
        }
        //appDataService.resetNavTree();
        appDataService.navTree.position = 0;
        tryUpdateNavPage("startsida");
    };
    $scope.toggleMenu = function() { $scope.isMenuVisible = !$scope.isMenuVisible; };

    $scope.navToPrevPage = function() {
        var url = appDataService.getPreviousPageUrl();
        if (url && tryUpdateNavPage(url))
        {
            appDataService.navTree.position--;
        } else {
            $rootScope.showStatusMessage("Sidan saknas...");
        }
    };

    $scope.navToNextPage = function() {
        var url = appDataService.getNextPageUrl();
        if (url && tryUpdateNavPage(url)) {
            appDataService.navTree.position++;
        } else {
            $rootScope.showStatusMessage("Sidan saknas...");
        }
    };

    $scope.showHeader = function() {
        appDataService.showHeader();
    };
    $scope.hideHeader = function() {
        appDataService.hideHeader();
    };
    $scope.showLeftImageOfGlossUnit = function() {
        var cgu = $scope.navPage.currentGlossUnit;
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
    
    $rootScope.loadGlossUnitSettingsState = function(position) {
        $rootScope.settingGlossUnit = $rootScope.getGlossUnitByPosition(position);

        if (!$rootScope.settingGlossUnit) {
            var tempSettingGlossUnit = {
                "position": position,
                "text": "test",
                "path": "bliss",
                "filename": "",
                "glossId": new Date().getTime(),
                "glossText": "",
                "comment": "",
                "partOfSpeech": "noun",
                "pageLinkUrl": "",
                "glossSubUnitsLeft": [],
                "glossSubUnitsRight": []        
            };

            $rootScope.addGlossUnitByPosition(tempSettingGlossUnit, position); //add to navPages (not navPage)
            $scope.navPage.glossUnits.push(tempSettingGlossUnit); //add to navPage
            $rootScope.settingGlossUnit = tempSettingGlossUnit;
        };
        $state.go('glossunitsettings');
    };

    $scope.showRightImageOfGlossUnit = function() {
        var cgu = $scope.navPage.currentGlossUnit;
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
    $rootScope.showStatusMessage = function (message) {
        $rootScope.notification = message;
        var notElement = document.getElementsByClassName("notificationBar")[0];
        notElement.classList.remove("showForAWhile");
        notElement.offsetWidth = notElement.offsetWidth; //hack för att nollställa css-animation istället för att ta bort hela elementet och lägga till det igen...
        notElement.classList.add("showForAWhile");
    };

    $rootScope.getGlossUnitByPosition = function (position) { 
        var i = 0,
        gus = $scope.navPage.glossUnits;
        for (; i < gus.length; i++) {
            if (position === gus[i].position) {
                gus[i].pageUrl = $scope.navPage.pageUrl;
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
            tryUpdateNavPage();
            $rootScope.showStatusMessage("Rutans innehåll borttaget...");
        }
    });
    $rootScope.removeGlossUnitByPosition = function (position, pageUrl) {
        if (!pageUrl) {
            pageUrl = $scope.navPage.pageUrl;
        }
        var navPage = $scope.navPages.filter(function (np) {
            return np.pageUrl === pageUrl;
        })[0];
        var glossUnit = navPage.glossData.filter(function (gu) {
            return gu.position === position;
        })[0];
        var index = navPage.glossData.indexOf(glossUnit);
        if (index !== -1) {
            navPage.glossData.splice(index, 1);
        }
    };
    $rootScope.addGlossUnitByPosition = function (glossUnit, position, pageUrl) {
        if (!pageUrl) {
            pageUrl = $scope.navPage.pageUrl;
        }
        var navPage = $scope.navPages.filter(function (np) {
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
        tryUpdateNavPage();
    };
    $rootScope.pasteGlossUnit = function (position) {
        $rootScope.addGlossUnitByPosition(jQuery.extend(true, {}, $rootScope.copiedGlossUnit), position);
        tryUpdateNavPage();
    };
    $rootScope.getCurrentBackgroundColor = function () {
        //Varför anropas denna innan $rootScope.navPage har skapats??
        if ($scope.navPage.currentGlossUnit) {
            var cgu = $scope.navPage.currentGlossUnit;
            if (cgu.currentPosition > 0) {
                return $rootScope.partOfSpeechColors[cgu.glossSubUnitsRight[cgu.currentPosition-1].partOfSpeech];
            } else if (cgu.currentPosition < 0) {
                return $rootScope.partOfSpeechColors[cgu.glossSubUnitsLeft[-cgu.currentPosition-1].partOfSpeech];
            }
        }
    };
});

blissKom.controller("GlossUnitCtrl", function($scope, $rootScope, $state) {
    $scope.update = function () {
        $rootScope.sgu.activeText = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.text : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].text : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].text);
        $rootScope.sgu.activeComment = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.comment : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].comment : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].comment);
        $rootScope.sgu.activeFilename = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.filename : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].filename : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].filename);
        $rootScope.sgu.activePartOfSpeech = $rootScope.sgu.activeLeftRightPosition === 0 ? $rootScope.sgu.partOfSpeech : ($rootScope.sgu.activeLeftRightPosition < 0 ? $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].partOfSpeech : $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].partOfSpeech);
    };
    if (!$rootScope.settingGlossUnit.activeLeftRightPosition) {
        $rootScope.settingGlossUnit.activeLeftRightPosition = 0;
    }
    $rootScope.sgu = jQuery.extend(true, {}, $rootScope.settingGlossUnit);
    $scope.update();
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
    };
    $scope.addLeftImage = function () {
        if ($rootScope.sgu.glossSubUnitsLeft.length < 3) {        
            $rootScope.sgu.glossSubUnitsLeft.push({text: $rootScope.sgu.text, comment: ''});
            $scope.activateImage(-$rootScope.sgu.glossSubUnitsLeft.length);
        } else {
            $rootScope.showStatusMessage("Kan bara ha tre sidobilder...");
        }
    };
    $scope.activateImage = function (leftRightPosition) {
        $rootScope.sgu.activeLeftRightPosition = leftRightPosition;
        $scope.update();
    };
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
            return $scope.settings.onlineBlissUrl + $rootScope.sgu.activeFilename;
        } else if (gu.path === "rt") {
            return $scope.settings.onlineRtUrl + $rootScope.sgu.activeFilename;
        } else {
            return false; //shows web browsers standard "image missing" icon.
        }
    };
    $rootScope.chkPageLink = !!$rootScope.sgu.pageLinkUrl;
    $rootScope.toggleChkPageLink = function () {
        $rootScope.chkPageLink = !$rootScope.chkPageLink;
    };

    $scope.getActivePath = function () {
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            return $rootScope.sgu.path;
        } else if ($rootScope.sgu.activeLeftRightPosition < 0) {
            return $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].path;
        } else {
            return $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].path;
        }    
    };
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
            if ($rootScope.chkPageLink) {
                glossUnitsToUpdate[j].pageLinkUrl = $rootScope.sgu.pageLinkUrl;
            } else {
                glossUnitsToUpdate[j].pageLinkUrl = "";
            }
            if ($rootScope.sgu.newGlossId) {
                glossUnitsToUpdate[j].glossId = $rootScope.sgu.newGlossId;
            }
            glossUnitsToUpdate[j].filename = $rootScope.sgu.filename;
            glossUnitsToUpdate[j].path = $rootScope.sgu.path;
            
            //todo add glossText, aswell.

            glossUnitsToUpdate[j].partOfSpeech = $rootScope.sgu.partOfSpeech;
            glossUnitsToUpdate[j].glossSubUnitsLeft = jQuery.extend(true, [], $rootScope.sgu.glossSubUnitsLeft);
            glossUnitsToUpdate[j].glossSubUnitsRight = jQuery.extend(true, [], $rootScope.sgu.glossSubUnitsRight); //deepcopy array
        }
        $rootScope.sgu.newGlossId = null;
    });
    $scope.changePartOfSpeech = function (name) {
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            $rootScope.sgu.partOfSpeech = name;
        } else if ($rootScope.sgu.activeLeftRightPosition < 0) {
            $rootScope.sgu.glossSubUnitsLeft[-$rootScope.sgu.activeLeftRightPosition-1].partOfSpeech = name;
        } else {
            $rootScope.sgu.glossSubUnitsRight[$rootScope.sgu.activeLeftRightPosition-1].partOfSpeech = name;
        }
        $scope.update();
        $scope.updateSguText();
        $scope.updateSguComment();
    };
    $scope.changePageLinkUrl = function (chosenNavPage) {
        $rootScope.sgu.pageLinkUrl = chosenNavPage.pageUrl;
        if ($rootScope.sgu.activeLeftRightPosition === 0) {
            $rootScope.sgu.activeText = chosenNavPage.pageName;
        }
        $scope.updateSguText();
        $scope.updateSguComment();
    };
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
                $rootScope.settingGlossUnit.newGlossId = selectedBlissGlossUnit.gloss;
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
blissKom.controller("TestCtrl", function() {
    
});
blissKom.controller("BackupCtrl", function($scope, $rootScope, backupService) {
    $scope.doBackup = backupService.doBackup;
    backupService.retrieveListOfBackup();
    $scope.setActiveBackup = function (index) {
        $rootScope.activeBackup = $rootScope.backupDates[$rootScope.backupDates.length-1-index];
    };
    $scope.activateBackup = backupService.activateBackup;
});

blissKom.controller("ConversationCtrl", function($scope, $rootScope, appDataService) {
    $scope.settings = appDataService.appSettings;
    $scope.navBodyCss = appDataService.navBodyCss;
    $scope.conversation = appDataService.getConversation();
    $scope.isHeaderHidden = function () { return appDataService.isHeaderHidden(); };

});
//test, gör ingenting i nuläget...
blissKom.controller("DeviceCtrl", function() { console.log("hello");});