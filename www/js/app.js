//Constructor for GlossUnit objects.
//If the inserted data object includes erronous properties, they will be neglected.
//If the inserted data object lacks some properties, the corresponding properties
//will get a null value.
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

GlossUnit.prototype.isPageLink = !!this.pageUrl; //returns true if pageUrl is truthy
GlossUnit.prototype.hasModifiedText = (this.glossText !== this.text);
GlossUnit.prototype.createArrayOfGlossSubUnits = function(arrayData) {
        var glossSubUnits = [],
            i = 0;
    
        if (arrayData) {
            for (; i < arrayData.length ; i = i+1) {
                glossSubUnits.push(new GlossSubUnit(arrayData[i]));
            }
        }
        return glossSubUnits;
    };

function GlossSubUnit(data) {
    this.filename = data.filename;
    this.text = data.text;
    this.comment = data.comment;
}

angular.module("blissKom", ["ui.router", "firebase"])
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

//controllers
angular.module("blissKom")
    .controller("MainController", function($scope, $firebase) { 
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
            $scope.glossUnits = [
                new GlossUnit(
                {
                    filename: 'hej.svg',
                    glossSubUnitsLeft: [new GlossSubUnit({ filename: 'vad.svg', comment: ''})], //valbart 
                    glossSubUnitsRight: [],
                    glossText: 'hej-blabla',
                    glossId: 12,
                    text: 'hej',
                    comment: ''
                }),
                new GlossUnit({
                    filename: 'heta.svg',
                    glossSubUnitsLeft: [],
                    glossSubUnitsRight: [new GlossSubUnit({ filename: 'du.svg', comment: ''})],
                    glossText: 'heta-blabla',
                    glossId: 16,
                    text: 'heta',
                    comment: ''
                }),
                new GlossUnit({
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
                $scope.glossUnits = [ new GlossUnit({filename: 'du.svg', glossSubUnitsLeft: [{filename: 'test.svg'}]}), new GlossUnit({filename: 'du.svg'}), new GlossUnit({filename: 'hej.svg'}) ];
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