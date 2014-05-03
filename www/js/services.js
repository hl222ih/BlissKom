blissKom.factory("glossFactory", function() {       
    //Constructor for GlossSubUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will become undefined.
    GlossSubUnit = function(data) {
        this.path = data.path;
        this.filename = data.filename;
        this.text = data.text;
        this.comment = data.comment; //valbart
    };

    //Constructor for GlossUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will be undefined.
    GlossUnit = function(data) {
        this.position = data.position;
        this.text = data.text;
        this.path = data.path;
        this.filename = data.filename;
        this.glossId = data.glossId;
        this.glossText = data.glossText;
        this.comment = data.comment; //valbart
        this.partOfSpeech = data.partOfSpeech;
        this.pageLinkUrl = data.pageLinkUrl; //endast för sidlänkar
        this.glossSubUnitsLeft = this.createArrayOfGlossSubUnits(data.glossSubUnitsLeft); //valbart
        this.glossSubUnitsRight = this.createArrayOfGlossSubUnits(data.glossSubUnitsRight); //valbart
    };

    GlossUnit.prototype = {
        isPageLink: !!this.pageUrl, //returns true if pageUrl is truthy
        hasModifiedText: this.glossText !== this.text,
        createArrayOfGlossSubUnits: function(arrayData) {
            var glossSubUnits = [],
                i = 0;

            if (arrayData) {
                for (; i < arrayData.length ; i = i+1) {
                    glossSubUnits.push(new GlossSubUnit(arrayData[i]));
                }
            }
            return glossSubUnits;
        }
    };

    //factory's all functions
    return { 
        //testfunktion.
        createGlossUnit: function(data) { 
            return new GlossUnit(data); 
        },
        createGlossUnits: function(data) { 
            var i = 0,
                glossUnits = [];
            
            for (;i < data.length; i++) {
                glossUnits.push(new GlossUnit(data[i]));
            }
            return glossUnits; 
        }
    };
});

blissKom.service("navPageService", function($http) {       
    
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

    this.getPageCss = function(cssTemplates, cssTemplateName) {
        var cssTemplate = cssTemplates.filter(function (tObj) {
            return tObj.name === cssTemplateName;
        })[0];
            
            
//            $scope.cssTemplates
//            var pageCssSettings = pageCssesSettings[pageCssName];
        var allCss = "";
//cssTemplate["settings"] ger undef
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
//        getPageCssName: function (pageId) {
//            var pageCssName
//            
//            return pageCssName;
//        }
//    };
});

blissKom.service("databaseService", function() {
    return {
        updateLocalBlissCollection: function() {
            var myBlissRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/bliss');
            //funkar inte som jag vill, måste ses över.
            var auth = new FirebaseSimpleLogin(myBlissRef, function(error, user) {
                if (error) {
//                    console.log("nånting gick fel");
                } else if (user) {
//                    console.log("redan inloggad");
                    myBlissRef.once('value', function(dataSnapshot) {
                        var mySnapShot = dataSnapshot;
                        var blissObjects = mySnapShot.val();
                        localStorage.setItem('testObject5', JSON.stringify(blissObjects));
                    });
                } else {
                    auth.login('password', {
                        email: 'test2@test.com',
                        password: 'test'
                    });
//                    console.log("Login now succeeded (email/userid): " );//+ user.email + " " + user.id);
                };
            });
        }
    };
});


