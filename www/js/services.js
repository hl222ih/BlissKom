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
    };

    //Constructor for GlossUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will be undefined.
    var GlossUnit = function(data) {
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

blissKom.service("navPageService", function($http, $rootScope) {       
    var getJson = function(jsonFile) {
        return $http.get('data/' + jsonFile);
    };
        
    this.getCssTemplates = function() { 
        return getJson('cssTemplates.json');
    };
    this.getNavPages = function() { 
        return getJson('navPages.json');
    };
    this.getPosColors = function() { 
        return getJson('posColors.json');
    };

    //Select CSS data for CSS template with the given name,
    //create CSS for the glossUnits presented on the navigation page
    //and return it.
    this.getPageCss = function(cssTemplateName) {
        var cssTemplate = $rootScope.cssTemplates.filter(function (tObj) {
            return tObj.name === cssTemplateName;
        })[0];
            
        //Create and return CSS according to data for given CSS-template.    
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
    this.getInitData = function() {
        return $q.all([
            $http.get('data/' + 'cssTemplates.json'),
            $http.get('data/' + 'navPages.json'),
            $http.get('data/' + 'posColors.json'),
            $http.get('data/' + 'appSettings.json')
        ]).then(function (responses) {
            return {
                cssTemplates: responses[0].data,
                navPages: responses[1].data,
                posColors: responses[2].data,
                appSettings: responses[3].data
            };
        });
    };
    this.downloadBlissData = function() {
        var blissRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/bliss/');
        //alert("downloading blissdata");
        blissRef.once('value', function(blissSnapshot) {
            $rootScope.blissData = blissSnapshot.val();
            $rootScope.$apply();
            //alert("downloaded bliss-data!");
        });
    };
});

blissKom.service("backupService", function($rootScope) {
    var allSavedAppSettings = {};
    this.doBackup = function() {
        var userRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/users/' + $rootScope.user.id);
        //var appSettings = JSON.parse(JSON.stringify($rootScope.appSettings));
        var appSettings = angular.fromJson(angular.toJson($rootScope.appSettings));

        //login and password should not be saved on the server.
        appSettings.password = null;
        appSettings.email = null;
        appSettings = angular.copy(appSettings); //remove angular hashkey

        userRef.push({ 
            "datetime": new Date().getTime(), 
            "cssTemplates" : angular.fromJson(angular.toJson($rootScope.cssTemplates)),
            "posColors" : angular.fromJson(angular.toJson($rootScope.partOfSpeechColors)),
            "navPages" : angular.fromJson(angular.toJson($rootScope.navPages)),
            "appSettings" : angular.fromJson(angular.toJson(appSettings))
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
            return $rootScope.activeBackup = setupObj.datetime;
        })[0];
        if (retrievedSettings) {
            $rootScope.appSettings = retrievedSettings.appSettings;
            $rootScope.cssTemplates = retrievedSettings.cssTemplates;
            $rootScope.navPages = retrievedSettings.navPages;
            $rootScope.posColors = retrievedSettings.posColors;
        }
    };
});
