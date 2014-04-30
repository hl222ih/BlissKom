var blissKom = angular.module("blissKom", ["ui.router", "firebase"])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
        $stateProvider
            .state('main', {
                url: '/main',
                views: {
                    '': { 
                        templateUrl: 'views/main.html',
                        controller: 'MainController'
                    },
                    'extra': {
                        template: '<div>include some extra content</div>'
                    }
                }
            })
            .state('device', {
                url: '/device',
                templateUrl: 'views/device.html',
                controller: 'MainController'
            });
    });
            
//services (BLL-code and contact with database)

//alltså, vill få in mina "lösa" konstruktorer här på nåt sätt...
//blissKom.factory("GlossSubUnit", function() {
//    
//    function GlossSubUnit(data) {
//        this.filename = data.filename;
//        this.text = data.text;
//        this.comment = data.comment;
//    };
//    
//    return GlossSubUnit;
//});
//blissKom.service("glossService", function() {
    
    
blissKom.factory("glossFactory", function() {       
    //Constructor for GlossUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will be undefined.
    function GlossUnit(data) {
        this.filename = data.filename;
        this.glossSubUnitsLeft = this.createArrayOfGlossSubUnits(data.glossSubUnitsLeft);
        this.glossSubUnitsRight = this.createArrayOfGlossSubUnits(data.glossSubUnitsRight);
        this.glossText = data.glossText;
        this.glossId = data.glossId;
        this.text = data.text;
        this.partOfSpeech = data.partOfSpeech;
        this.comment = data.comment;
        this.pageLinkUrl = data.pageLinkUrl;
        this.backgroundColor = data.backGroundColor ? data.backGroundColor : '#FFFFFF';
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

    //Constructor for GlossSubUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will become undefined.
    function GlossSubUnit(data) {
        this.filename = data.filename;
        this.text = data.text;
        this.comment = data.comment;
    };

    //factory's all functions
    var gloss = { 
        //testfunktion.
        createGlossUnit: function(data) { 
            return new GlossUnit(data); 
        }
    };
    return gloss;

});

//controllers
blissKom.controller("MainController", function($scope, $firebase, glossFactory) { 
       // $scope.init().updateNavigationPage(2);
        $scope.greeting = "hello world!";
        $scope.items = {
            1: {
                name: '1',
                type: 'type1'
            },
            2: {
                name: '2',
                type: 'type2'
            },
            4: {
                name: '5',
                type: 'type4'
            }
        };
        $scope.updateNavigationPage = function(pageId) {
            if (pageId === 2) {
            switchStyleSheet(pageId);
            $scope.glossUnits = [
                //new GlossUnit(
                glossFactory.createGlossUnit({
                    filename: 'hej.svg',
                    glossSubUnitsLeft: [new GlossSubUnit({ filename: 'vad.svg', comment: ''})], //valbart 
                    glossSubUnitsRight: [],
                    glossText: 'hej-blabla',
                    glossId: 12,
                    text: 'hej',
                    comment: ''
                }),
                //new GlossUnit(
                glossFactory.createGlossUnit({
                    filename: 'heta.svg',
                    glossSubUnitsLeft: [],
                    glossSubUnitsRight: [new GlossSubUnit({ filename: 'du.svg', comment: ''})],
                    glossText: 'heta-blabla',
                    glossId: 16,
                    text: 'heta',
                    comment: ''
                }),
               //new GlossUnit(
                glossFactory.createGlossUnit({
                    filename: 'heta.svg',
                    glossSubUnitsLeft: [],
                    glossSubUnitsRight: [new GlossSubUnit({ filename: 'du.svg', comment: ''})],
                    glossText: 'egen-heta-blabla',
                    glossId: 1039,
                    text: 'heta',
                    partOfSpeech: 'verb',
                    comment: 'kategori',
                    pageLinkUrl: 'some state'
                })];
            } else {
                $scope.glossUnits = [ glossFactory.createGlossUnit({filename: 'du.svg', glossSubUnitsLeft: [{filename: 'test.svg'}]}), glossFactory.createGlossUnit({filename: 'du.svg'}), glossFactory.createGlossUnit({filename: 'hej.svg'}) ];
            }
            
        };
        $scope.updateNavigationPage();
        
        var myBlissRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/bliss');
        var auth = new FirebaseSimpleLogin(myBlissRef, function(error, user) {
            auth.createUser("test2@test.com", "test", function(error, user) {
                if (!error) {
                    console.log('User Id: ' + user.uid + ', Email: ' + user.email);
                } else {
                    console.log("creation failed");
                }
//                auth.login('password', {
//                    email: 'test@test.com',
//                    password: 'test'
//                });

                myBlissRef.once('value', function(dataSnapshot) {
                    $scope.mySnapShot = dataSnapshot;
                    $scope.blissObjects = $scope.mySnapShot.val();
                    test();
                    localStorage.setItem('testObject3', JSON.stringify($scope.blissObjects));
                });
                    
            });
        });
        //$scope.blissObjects = $firebase(myBlissRef);
    });

    
//filters
//


//directives
//
angular.module("blissKom")
    .directive("bkGlossUnitMini", function() {
        return {
            restrict: 'E',
            templateUrl: 'views/partials/glossunits-small.html'
        };
    });

//test-code
//just for testing, does the application react to battery status change?
window.addEventListener("batterystatus", onBatteryStatus, false);

function onBatteryStatus(info) {
    window.alert("Level: " + info.level + " isPlugged: " + info.isPlugged);
    var testdiv = document.getElementById("test");
    testdiv.innerHTML = "Testet funkade!";
};

function test() {  
//    var myBlissRef = new Firebase('https://incandescent-fire-1738.firebaseio.com');
//    myDataRef.set({name: "testnamn", text: "testtext"});
//    myDataRef.on('child_added', function(snapshot) {
//       console.log(snapshot)
//    });
};

function switchStyleSheet(pageId) {
    var sheet = document.getElementById('pageStyle');
//    var parentOfSheet = sheet.parentNode;
//    parentOfSheet.removeChild(sheet);
//    var newSheet = document.createElement('style');
    if (sheet)
    {
        sheet.innerHTML = "";
        var unitStyles = getPageCssSettings(pageId);
        for (var i = 0; i < unitStyles.length; i++) {
            sheet.innerHTML += "#unit" + unitStyles[i].position + " {\n";
            sheet.innerHTML += "display: block;\nposition: absolute;\n";
            sheet.innerHTML += "left: " + unitStyles[i].left + "%;\n";        
            sheet.innerHTML += "top: " + unitStyles[i].top + "%;\n";     
            sheet.innerHTML += "width: " + unitStyles[i].width + "%;\n";     
            sheet.innerHTML += "height: " + unitStyles[i].height + "%;\n";  
            sheet.innerHTML += "background: red; border: 1px solid blue;\n";
            sheet.innerHTML += "}\n";
        }
    }
//    parentOfSheet.appendChild(newSheet);
};

function getPageCssSettings(pageId) {
    var unitStyles = [];
    //lite testdata
    unitStyles.push({position: 1, width: 10, height: 10, left: 1, top: 1});
    unitStyles.push({position: 2, width: 10, height: 10, left: 11, top: 11});
    unitStyles.push({position: 3, width: 10, height: 10, left: 22, top: 22});
    unitStyles.push({position: 4, width: 10, height: 10, left: 33, top: 33});
    unitStyles.push({position: 5, width: 20, height: 20, left: 44, top: 44});
    return unitStyles;
}