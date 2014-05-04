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
    });

//test-code
//just for testing, does the application react to battery status change?
window.addEventListener("batterystatus", onBatteryStatus, false);

function onBatteryStatus(info) {
    window.alert("Level: " + info.level + " isPlugged: " + info.isPlugged);
 //   var testdiv = document.getElementById("test");
  //  testdiv.innerHTML = "Testet funkade!";
};

