//Constructor for GlossUnit objects.
//If the inserted data object includes erronous properties, they will be neglected.
//If the inserted data object lacks some properties, the corresponding properties
//will get a null value.
function GlossUnit(data) {
    var createArrayOfGlossSubUnits = function(arrayData) {
        var glossSubUnits = [],
            i = 0;
    
        if (arrayData) {
            for (i; i < arrayData.Length ; i = i+1) {
                glossSubUnits.push(new GlossSubUnit(arrayData[i]));
            }
        }
        return glossSubUnits;
    };
    this.filename = data.filename;
    this.glossSubUnitsLeft = createArrayOfGlossSubUnits(data.glossSubUnitsLeft);
    this.glossSubUnitsRight = createArrayOfGlossSubUnits(data.glossSubUnitsRight);
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

function GlossSubUnit(data) {
    this.filename = data.filename;
    this.text = data.text;
    this.comment = data.comment;
}

angular.module("blissKom", ["ui.router"])
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
    .controller("MainController", function($scope) { 
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
                $scope.glossUnits = [ new GlossUnit({filename: 'du.svg'}), new GlossUnit({filename: 'du.svg'}), new GlossUnit({filename: 'du.svg'}) ];
            }
            
        };
        $scope.updateNavigationPage();
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
}
