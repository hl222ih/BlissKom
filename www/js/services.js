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
        for (var j = 0; j < navPageData.groups.length; j++) {
            for (var k = 0; k < navPageData.groups[j].glossData.length; k++) {
                var gd = navPageData.groups[j].glossData[k];
                var newData = $rootScope.allGlossUnits.filter(function (gu) {
                    return gu.id === gd.id;
                })[0];
                if (newData) {
                    newData = JSON.parse(JSON.stringify(newData));
                    newData.position = navPageData.groups[j].glossData[k].position;
                    navPageData.groups[j].glossData[k] = newData;
                };
            };            
        }

        this.pageName = navPageData.pageName;
        this.pageUrl = navPageData.pageUrl;
        this.cssTemplateData = getCssTemplateData(navPageData.pageCss);
        //this.unitStyles = getNavPageCss(this.cssTemplateData);
        this.glossUnits = glossFactory.createGlossUnits(navPageData.glossData);
        this.groups = [];
        for (var i = 0; i < navPageData.groups.length; i++) {
            this.groups[i] = {};
            this.groups[i].glossUnits = glossFactory.createGlossUnits(navPageData.groups[i].glossData);
            this.groups[i].position = navPageData.groups[i].position;
        }
        //add css to navPage's objects.
        for (var i = 0; i < this.groups.length; i++) {
            //vill ha css:en för varje grupp - 
            var that = this;
            var tempGroupCss = this.cssTemplateData.groups.filter(function (groupCssObj) {
                return groupCssObj.position === that.groups[i].position;
            })[0];
            //ge gruppobjektet grupp-cssen
            this.groups[i].css = {
                top: tempGroupCss.top + '%',
                left: tempGroupCss.left + '%',
                width: tempGroupCss.width + '%',
                height: tempGroupCss.height + '%'
            };
//            this.groups[i].top = tempCss.top;
//            this.groups[i].left = tempCss.left;
//            this.groups[i].width = tempCss.width;
//            this.groups[i].height = tempCss.height;
            //ge gruppobjectets ev. glossUnits gu-css:en
            for (var j = 0; j < this.groups[i].glossUnits.length; j++) {
                //vill ha css:en för varje glossUnit -
                var that = this;
                var tempGroupTemplateData = getCssTemplateData(this.cssTemplateData.groups[i].groupCss);

                var tempCss = tempGroupTemplateData.units.filter(function (cssObj) {
                    return cssObj.position === that.groups[i].glossUnits[j].position;
                })[0];
                //ge glossUnit-objektet unit-cssen
                if (tempCss) {
                    this.groups[i].glossUnits[j].css = {
                        top: tempCss.top + '%',
                        left: tempCss.left + '%',
                        width: tempCss.width + '%',
                        height: tempCss.height + '%'
                    };
                }
            }
        }
        //ge glossUnits på navPage gu-css:en
        for (var i = 0; i < this.glossUnits.length; i++) {
            //vill ha css:en för varje glossUnit -
            var that = this;
            var tempCss = this.cssTemplateData.units.filter(function (cssObj) {
                return cssObj.position === that.glossUnits[i].position;
            })[0];
            //ge glossUnit-objektet unit-cssen
            this.glossUnits[i].css = {
                top: tempCss.top + '%',
                left: tempCss.left + '%',
                width: tempCss.width + '%',
                height: tempCss.height + '%'
            };
//            this.glossUnits[i].css.top = tempCss.top + '%';
//            this.glossUnits[i].css.left = tempCss.left + '%';
//            this.glossUnits[i].css.width = tempCss.width + '%';
//            this.glossUnits[i].css.height = tempCss.height + '%';
        }
    };

    var getCssTemplateData = function (cssTemplateName) {
        var cssTemplateData = appDataService.cssTemplatesData.filter(function (cssObj) {
            return cssObj.name === cssTemplateName;
        })[0];
        return cssTemplateData;
    };
    var getNavPageCss = function(cssTemplateData) {
            cssCode = "",
            currentObj = {},
            partialCssCode = "",
            cssClass = "";

        for (var i = 0; i < cssTemplateData.groups.length; i++) {
            currentObj = cssTemplateData.groups[i];
            cssClass = ".group";

            partialCssCode = "\n    " + cssClass + currentObj.position + " {\n"
            + "        display: block;\n"
            + "        width: " + currentObj.width + "%;\n"
            + "        height: " + currentObj.height + "%;\n"
            + "        left: " + currentObj.left + "%;\n"
            + "        top: " + currentObj.top + "%;\n"
            + "        }\n";
            cssCode += partialCssCode;

            if (!cssTemplateData.groups[i].units) {
                cssTemplateData.groups[i].units = [];
            }
            for (var j = 0; j < cssTemplateData.groups[i].units.length; j++) {
                currentObj = cssTemplateData.groups[i].units[j];
                cssClass = ".unit"; //behöver ändras

                partialCssCode = "\n    " + cssClass + currentObj.position + " {\n"
                + "        display: block;\n"
                + "        width: " + currentObj.width + "%;\n"
                + "        height: " + currentObj.height + "%;\n"
                + "        left: " + currentObj.left + "%;\n"
                + "        top: " + currentObj.top + "%;\n"
                + "        }\n";
                cssCode += partialCssCode;
            };

        };
        
        for (var i = 0; i < cssTemplateData.units.length; i++) {
            currentObj = cssTemplateData.units[i];
            cssClass = ".unit";

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
        isPageLink: function() { 
            var isP = !!this.pageLinkUrl; 
            return isP;
        }, //returns true if pageLinkUrl is truthy
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

blissKom.service("appDataService", function ($rootScope, $window) {
    var conversation = [],  //array of glossUnits
    //position 0 = no group is zoomed in
        zoomedInGroup = {
            "position": 0,
            "top": 0,
            "left": 0,
            "width": 40,
            "height": 44                
        };


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
        },
        setDimensionsData: function () {
            //a few too many constants here
            var tempAppWidth = angular.element($window).width();
            var tempAppHeight = (angular.element($window).height() < angular.element($window).width()) ? angular.element($window).height() : angular.element($window).width();

            //forced landscape orientation for the time being...
            var appHeight = tempAppHeight < tempAppWidth ? tempAppHeight : tempAppWidth;
            var appWidth =  tempAppWidth > tempAppHeight ? tempAppWidth : tempAppHeight;
            var expandedHeaderHeight = 42;
            var bodyHeight = appHeight - 42;
            var menuHeight = Math.floor(bodyHeight * 0.1) * 8;
            var menuItemHeight = menuHeight / 8;

            this.dimensions = {
                "headerHeight": expandedHeaderHeight,
                "expandedHeaderHeight": expandedHeaderHeight,
                "collapsedHeaderHeight": 0,
                "appHeight": appHeight,
                "bodyHeight": bodyHeight,
                "bodyHeightMinusKeyboard": appHeight * 0.3,
                "menuHeight": menuHeight,
                "menuItemHeight": menuItemHeight,
                "menuItemFontSize": menuItemHeight * 0.5,
                "pageNavWidth": appWidth - 362,
                "bigArrowTop": bodyHeight / 2 - 62 - 0.05 * bodyHeight,
                "smallIconSize": Math.floor(appHeight / 160) * 10
            };
            this.navBodyCss = {
                'height': this.dimensions.bodyHeight + 'px',
                'top': this.dimensions.headerHeight + 'px'
            };
        },
        showHeader: function() {
            this.navBodyCss.top = this.dimensions.headerHeight = this.dimensions.expandedHeaderHeight;
            this.navBodyCss.height = this.dimensions.bodyHeight = this.dimensions.appHeight - this.dimensions.expandedHeaderHeight;
        },
        hideHeader: function() {
            this.navBodyCss.top = this.dimensions.headerHeight = this.dimensions.collapsedHeaderHeight;
            this.navBodyCss.height = this.dimensions.bodyHeight = this.dimensions.appHeight - this.dimensions.collapsedHeaderHeight;
        },
        isHeaderHidden: function() {
            return this.dimensions.headerHeight === this.dimensions.collapsedHeaderHeight;
        },
        zoomInGroup: function(groupNumber) {
            zoomedInGroup = {
                "position": groupNumber,
                "top": 0,
                "left": 0,
                "width": 40,
                "height": 44                
            };
            if (!zoomedInGroup.position) {
                this.navBodyCss.width = 100 + '%';
                this.navBodyCss.height = this.dimensions.bodyHeight + 'px';
                this.navBodyCss.top = this.dimensions.headerHeight + 'px';
            } else {
                this.navBodyCss.width = 100 / (zoomedInGroup.width * 0.01) * 0.9 + '%';
                this.navBodyCss.height = this.dimensions.bodyHeight / (zoomedInGroup.height * 0.01) * 0.9 + 'px';
                this.navBodyCss.top = this.dimensions.headerHeight + this.dimensions.bodyHeight * 0.05 + 'px';
                this.navBodyCss.left = '5%';
            };                
        }
    };
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
