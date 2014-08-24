blissKom.factory("navPageFactory", function($rootScope, appDataService, glossFactory) {
    var PageNotFoundException = function (message) {
        this.message = message;
        this.name = "PageNotFoundException";
    };
    var NavPage = function(pageUrl) {
        var navPageData = appDataService.getNavPageData(pageUrl);
        if (!navPageData) {
            throw new PageNotFoundException("Could not find a page with location" + pageUrl);
        }
        if (!navPageData.glossData) {
            navPageData.glossData = [];
        }
        for (var i = 0; i < navPageData.glossData.length; i++) {
            var gd = navPageData.glossData[i];
            var newData = $rootScope.allGlossUnits.filter(function (gu) {
                return gu.id === gd.id;
            })[0];
            if (newData) {
                newData = JSON.parse(JSON.stringify(newData));
                newData.position = navPageData.glossData[i].position;
                navPageData.glossData[i] = newData;
            };
        };
        this.pageName = navPageData.pageName;
        this.pageUrl = navPageData.pageUrl;
        this.cssTemplateData = getCssTemplateData(navPageData.pageCss);
        this.unitStyles = getNavPageCss(this.cssTemplateData);
        this.glossUnits = glossFactory.createGlossUnits(navPageData.glossData);
    };

    var getCssTemplateData = function (cssTemplateName) {
        var cssTemplateData = appDataService.cssTemplatesData.filter(function (cssObj) {
            return cssObj.name === cssTemplateName;
        })[0];
        return cssTemplateData;
    };
    var getNavPageCss = function(cssTemplateData) {
        //var cssTemplateData = getCssTemplateData(cssTemplateName) || {"settings": []},
            cssCode = "",
            currentObj = {},
            partialCssCode = "",
            cssClass = "";
    
        for (var i = 0; i < cssTemplateData.settings.length; i++) {
            currentObj = cssTemplateData.settings[i];
            
            if (currentObj.group) {
                cssClass = ".unitGroup";
            } else {
                cssClass = ".unit";
            }

            partialCssCode = "\n    " + cssClass + currentObj.position + " {\n"
            + "        display: block;\n"
            + "        width: " + currentObj.width + "%;\n"
            + "        height: " + currentObj.height + "%;\n"
            + "        left: " + currentObj.left + "%;\n"
            + "        top: " + currentObj.top + "%;\n"
            + "        }\n";
            cssCode += partialCssCode;
        };
        return cssCode;        
    };

    return {
        createNavPage: function(pageUrl) {
            return new NavPage(pageUrl);
        }
    };
});

blissKom.factory("glossFactory", function() {       
    //Constructor for GlossSubUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will become undefined.
    var GlossSubUnit = function(data) {
        this.path = data.path;
        this.filename = data.filename;
        this.text = data.text;
        this.comment = data.comment; //optional
        this.partOfSpeech = data.partOfSpeech; //optional
    };

    //Constructor for GlossUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will be undefined.
    var GlossUnit = function(data) {
        this.id = data.id;
        this.position = data.position;
        this.text = data.text;
        this.path = data.path;
        this.filename = data.filename;
        this.glossId = data.glossId;
        this.glossText = data.glossText;
        this.comment = data.comment; //optional
        this.partOfSpeech = data.partOfSpeech;
        this.pageLinkUrl = data.pageLinkUrl; //only for pagelinks
        this.glossSubUnitsLeft = this.createArrayOfGlossSubUnits(data.glossSubUnitsLeft); //optional
        this.glossSubUnitsRight = this.createArrayOfGlossSubUnits(data.glossSubUnitsRight); //optional
    };

    GlossUnit.prototype = {
        isPageLink: function() { return !!this.pageLinkUrl; }, //returns true if pageLinkUrl is truthy
        hasModifiedText: function() { this.glossText !== this.text; },
        createArrayOfGlossSubUnits: function(dataArray) {
            var glossSubUnits = [],
                i = 0;

            if (dataArray) {
                for (; i < dataArray.length ; i = i+1) {
                    glossSubUnits.push(new GlossSubUnit(dataArray[i]));
                }
            }
            return glossSubUnits;
        }
    };

    //factory's all functions
    return {
        createGlossUnit: function(glossData) { 
            return new GlossUnit(glossData); 
        },
        createGlossUnits: function(glossDataArray) { 
            var i = 0,
                glossUnits = [];
            
            for (;i < glossDataArray.length; i++) {
                glossUnits.push(new GlossUnit(glossDataArray[i]));
            }
            return glossUnits; 
        }
    };
});

blissKom.service("navPageService", function($http, $rootScope, appDataService) {       
    return {
        //Creates and returns CSS based on cssTemplate
        getCssBasedOnTemplate: function(cssTemplate) {
            var allCss = "";
            for (var i = 0; i < cssTemplate.settings.length; i++) {
                var currentObj = cssTemplate.settings[i];
                var someCss = "\n    .unit" + currentObj.position + " {\n"
                + "        display: block;\n"
                + "        width: " + currentObj.width + "%;\n"
                + "        height: " + currentObj.height + "%;\n"
                + "        left: " + currentObj.left + "%;\n"
                + "        top: " + currentObj.top + "%;\n"
                + "        }\n";
                allCss += someCss;
            };
            return allCss;        
        }
    };
});

blissKom.service("appDataService", function ($rootScope) {
    //'logging' refers to logging of bliss conversations
    //to be able to save/print the conversation etc.
    //(it does not refer to logging app activity or similar)
    //Logging can be turned on/off tapping the "log" (pen in square) icon.
    
    var conversation = [];  //array of glossUnits
    
    return {
        toggleLogging: function() {
            this.appSettings.logging = !this.appSettings.logging;
            if (this.appSettings.logging) {
                $rootScope.showStatusMessage("Anteckningar aktiverat...");
            } else {
                $rootScope.showStatusMessage("Anteckningar inaktiverat...");
            };
        },
        toggleEditMode: function() {
            this.appSettings.editMode = !this.appSettings.editMode;
        },
        setAppSettingsData: function (data) {
            this.appSettings = {};
            angular.extend(this.appSettings, data);
        },
        setPartOfSpeechColorsData: function (data) {
            this.partOfSpeechColorsData = {};
            angular.extend(this.partOfSpeechColorsData, data);
        },
        setNavPagesData: function (data) {
            this.navPagesData = [];
            angular.extend(this.navPagesData, data);
        },
        getConversation: function () {
            return conversation;
        },
        pushToConversation: function (glossUnit) {
            conversation.push(glossUnit);
        },
        clearConversation: function () {
            conversation = [];
        },
        resetNavTree: function () {
            this.navTree = {
                "position": 0,
                "pages": [{
                    "url": this.appSettings.defaultPageUrl,
                    "name": this.appSettings.defaultPageName
                }]
            };
        },
        setNavTreePosition: function (position) {
            position = Math.floor(position);
            if (position >= 0 && position < this.navTree.pages.length) {
                this.navTree.position = position;                
            } else if (position < 0) {
                this.navTree.position = 0;
            } else {
                this.navTree.position = this.navTree.pages.length - 1;
            }
        },
        pushToNavTree: function (pageUrl, pageName) {
            if (pageUrl === this.navTree.pages[0].url) {
                this.resetNavTree();
            } else {
                this.navTree.pages.push({"url": pageUrl, "name": pageName});
                this.navTree.position++;
            }
        },
        getNextPageUrl: function () {
            var page = this.navTree.pages[this.navTree.position + 1];
            return page ? page.url : false;
        },
        getPreviousPageUrl: function () {
            var page = this.navTree.pages[this.navTree.position - 1];
            return page ? page.url : false;
        },
        setCssTemplatesData: function (data) {
            this.cssTemplatesData = [];
            angular.extend(this.cssTemplatesData, data);
        },
        getNavPageData: function (pageUrl) {
            var navPage = this.navPagesData.filter(function (nObj) {
                return nObj.pageUrl === pageUrl;
            })[0];
            return navPage;
        }
    };
    
//        $rootScope.notification = "";
//        $rootScope.headerHeight = 42;
//        $rootScope.appHeight = (angular.element($window).height() < angular.element($window).width()) ? angular.element($window).height() : angular.element($window).width();
//        $rootScope.bodyHeightMinusKeyboard = $rootScope.appHeight * 0.3;
//        $rootScope.bodyHeight = $rootScope.appHeight - 42;
//        $rootScope.menuHeight = Math.floor($rootScope.bodyHeight * 0.1) * 8;
//        $rootScope.menuItemHeight = $rootScope.menuHeight / 8;
//        $rootScope.menuItemFontSize = $rootScope.menuItemHeight * 0.5;
//        $rootScope.pageNavWidth = angular.element($window).width() - 362;
//        $rootScope.bigArrowTop = $rootScope.bodyHeight / 2 - 62 - 0.05 * $rootScope.bodyHeight;
//        $rootScope.smallIconSize = Math.floor($rootScope.appHeight / 160) * 10;

});

blissKom.service("databaseServiceProvider", function ($q, $rootScope) {
    this.createAuthAndLogin = function(email, password) {
        var blissRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/bliss');
        return $q.when($rootScope.blissAuth = new FirebaseSimpleLogin(blissRef, function(error, user) {
            if (error) {
                // an error occurred while attempting login, so, cancel attempt...
                // console.log(error);
                $rootScope.blissAuth = null;
            } else if (user) {
                // user authenticated with Firebase
                // console.log('User ID!: ' + user.uid + ', Provider: ' + user.provider);
                $rootScope.user = user;
                $rootScope.$apply();
            } else {
                // user is logged out, so, login...
                console.log("logged out, trying to login");
                $rootScope.blissAuth.login('password', {
                    email: email,
                    password: password
                });
            }
        }));
    };
});

blissKom.service("dataServiceProvider", function($rootScope, $http, $q) {
    return {
        getInitData: function() {
            return $q.all([
                $http.get('data/' + 'cssTemplates.json'),
                $http.get('data/' + 'navPages.json'),
                $http.get('data/' + 'posColors.json'),
                $http.get('data/' + 'appSettings.json'),
                $http.get('data/' + 'glossUnits.json')
            ]).then(function (responses) {        
                return {
                    cssTemplatesData: responses[0].data,
                    navPagesData: responses[1].data,
                    posColorsData: responses[2].data,
                    appSettingsData: responses[3].data,
                    glossUnitsData: responses[4].data
                };
            });
        },
        downloadBlissData: function() {
            var blissRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/bliss/');
            //alert("downloading blissdata");
            blissRef.once('value', function(blissSnapshot) {
                $rootScope.blissData = blissSnapshot.val();
                $rootScope.$apply();
                //alert("downloaded bliss-data!");
            });
        }
    };
});

blissKom.service("backupService", function($rootScope, appDataService) {
    var allSavedAppSettings = {};
    var that = this;
    this.doBackup = function() {
        $rootScope.showStatusMessage("Påbörjar säkerhetskopiering...");
        var userRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/users/' + $rootScope.user.id);
        //var appSettings = JSON.parse(JSON.stringify($rootScope.appSettings));
        var appSettings = angular.fromJson(angular.toJson(appDataService.appSettings));

        //login and password should not be saved on the server.
        appSettings.password = null;
        appSettings.email = null;
        appSettings = angular.copy(appSettings); //remove angular hashkey

        userRef.push({ 
            "datetime": new Date().getTime(), 
            "cssTemplates" : angular.fromJson(angular.toJson(appDataService.cssTemplatesData)),
            "posColors" : angular.fromJson(angular.toJson(appDataService.partOfSpeechColorsData)),
            "navPages" : angular.fromJson(angular.toJson(appDataService.navPagesData)),
            "appSettings" : angular.fromJson(angular.toJson(appSettings))
        }, function (error) {
            if (!error) {
                $rootScope.showStatusMessage("Säkerhetskopiering utförd...");
            } else {
                $rootScope.showStatusMessage("Säkerhetskopieringen misslyckades...");
            }
            that.retrieveListOfBackup();
            $rootScope.$digest();
        });
    };
    this.retrieveListOfBackup = function() {
        var userRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/users/' + $rootScope.user.id);
        userRef.once('value', function(appSettingsSnapshot) {
            allSavedAppSettings = appSettingsSnapshot.val();
            var dateTimes = [];
            for (var bkpObjKey in allSavedAppSettings) {
                dateTimes.push(new Date(allSavedAppSettings[bkpObjKey].datetime));
            }
            $rootScope.backupDates = dateTimes;
            $rootScope.$apply();

        });
    };
    this.activateBackup = function() {
        var allSavedAppSettingsArray = [];
        for (var setupObjKey in allSavedAppSettings) {
            allSavedAppSettingsArray.push(allSavedAppSettings[setupObjKey]);
        }
        var retrievedSettings = allSavedAppSettingsArray.filter(function (setupObj) {
            return $rootScope.activeBackup.getTime() === setupObj.datetime;
        })[0];
        if (retrievedSettings) {
            $rootScope.appSettings = retrievedSettings.appSettings;
            $rootScope.cssTemplates = retrievedSettings.cssTemplates;
            $rootScope.navPages = retrievedSettings.navPages;
            $rootScope.posColors = retrievedSettings.posColors;
            $rootScope.showStatusMessage("Återställning gjord...");
            $rootScope.$digest();
        } else {
            $rootScope.showStatusMessage("Återställning kunde inte utföras...");
            $rootScope.$digest();
        }
        
    };
});
