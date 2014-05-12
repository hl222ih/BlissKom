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
        isPageLink: !!this.pageUrl, //returns true if pageUrl is truthy
        hasModifiedText: this.glossText !== this.text,
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
            var someCss = "\n    #unit" + currentObj["position"] + " {\n"
            + "        display: block;\n"
            + "        width: " + currentObj["width"] + "%;\n"
            + "        height: " + currentObj["height"] + "%;\n"
            + "        left: " + currentObj["left"] + "%;\n"
            + "        top: " + currentObj["top"] + "%;\n"
            + "    }\n";
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

blissKom.service("dataServiceProvider", function($http, $q) {
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
});

blissKom.service("backupService", function($rootScope) {
    this.doBackup = function() {
        var userRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/users/' + $rootScope.user.id);
        var appSettings = JSON.parse(JSON.stringify($rootScope.appSettings));
        appSettings.password = null;
        appSettings.email = null;

        userRef.push({ 
            "datetime": new Date().getTime(), 
            "cssTemplates" : $rootScope.cssTemplates,
            "posColors" : $rootScope.partOfSpeechColors,
            "navPages" : $rootScope.navPages,
            "appSettings" : appSettings
        });
    };
});