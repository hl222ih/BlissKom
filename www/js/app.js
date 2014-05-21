var blissKom = angular.module("blissKom", ["ui.router", "firebase", "ngTouch", "angular-gestures"])

    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/main');
        $stateProvider
            .state('main', {
                url: '/main',
                views: {
                    '': { 
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('/device', {
                url: 'device',
                templateUrl: 'views/device.html',
                controller: 'DeviceCtrl'
            })
            .state('settings', {
                url: '/settings',
                views: {
                    '': { 
                        templateUrl: 'views/settings.html',
                        controller: 'MainCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('glossunitsettings', {
                url: '/glossunitsettings',
                views: {
                    '': { 
                        templateUrl: 'views/glossunitsettings.html',
                        controller: 'MainCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'MainCtrl'
                    }
                }
            });
    })
    .run(function($rootScope,dataServiceProvider,databaseServiceProvider) {
        //keep track of current navigation pages' url's/names
        
        dataServiceProvider.getInitData()
            .then(function(initData) {
                $rootScope.cssTemplates = initData.cssTemplates;
                $rootScope.navPages = initData.navPages;
                $rootScope.partOfSpeechColors = initData.posColors;
                $rootScope.appSettings = initData.appSettings;
                databaseServiceProvider.createAuthAndLogin($rootScope.appSettings.email, $rootScope.appSettings.password);
                $rootScope.currentNavTree = {
                    "treePageUrls": [$rootScope.appSettings.defaultPageUrl, "attgora", "hojto", "specialsida", "utflykter", "manader"],
                    "treePageNames": [$rootScope.appSettings.defaultPageName, "att göra", "hojto", "specialsida", "utflykter", "månader"],
                    "position": 1,
                }; 
            }, function(){
                alert("Kunde inte ladda data.");
            });            
    });  

//test-code
//just for testing, does the application react to battery status change?
window.addEventListener("batterystatus", onBatteryStatus, false);

function onBatteryStatus(info) {
    window.alert("Level: " + info.level + " isPlugged: " + info.isPlugged);
 //   var testdiv = document.getElementById("test");
  //  testdiv.innerHTML = "Testet funkade!";
};

