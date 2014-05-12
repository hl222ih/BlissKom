var blissKom = angular.module("blissKom", ["ui.router", "firebase"])

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
                    'extra': {
                        template: '<div>include some extra content</div>',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('/device', {
                url: 'device',
                templateUrl: 'views/device.html',
                controller: 'DeviceCtrl'
            });
    })
    .run(function($rootScope,dataServiceProvider,databaseServiceProvider) {
        dataServiceProvider.getInitData()
            .then(function(initData) {
                $rootScope.cssTemplates = initData.cssTemplates;
                $rootScope.navPages = initData.navPages;
                $rootScope.partOfSpeechColors = initData.posColors;
                $rootScope.appSettings = initData.appSettings;
                databaseServiceProvider.createAuthAndLogin($rootScope.appSettings.email, $rootScope.appSettings.password);
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

