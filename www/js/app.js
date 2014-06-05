var blissKom = angular.module("blissKom", ["ui.router", "firebase", "ngTouch", "angular-gestures", "ngDialog"])

    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('main');
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
//            .state('/device', {
//                url: 'device',
//                templateUrl: 'views/device.html',
//                controller: 'DeviceCtrl'
//            })
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
                        controller: 'GlossUnitCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('blisselection', {
                url: '/blisselection',
                views: {
                    '': { 
                        templateUrl: 'views/blisselection.html',
                        controller: 'SelectImageCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('about', {
                url: '/about',
                views: {
                    '': { 
                        templateUrl: 'views/about.html',
                        controller: 'AboutCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('backup', {
                url: '/backup',
                views: {
                    '': { 
                        templateUrl: 'views/backup.html',
                        controller: 'BackupCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'MainCtrl'
                    }
                }
            });
    })
    .run(function($rootScope,dataServiceProvider,databaseServiceProvider, $window) {
        //keep track of current navigation pages' url's/names

        $rootScope.isLogActive = true;
        $rootScope.notification = "";
        $rootScope.headerHeight = 42;
        $rootScope.appHeight = (angular.element($window).height() < angular.element($window).width()) ? angular.element($window).height() : angular.element($window).width();
        $rootScope.bodyHeightMinusKeyboard = $rootScope.appHeight * 0.3;
        $rootScope.bodyHeight = $rootScope.appHeight - 42;
        $rootScope.menuHeight = Math.floor($rootScope.bodyHeight * 0.1) * 8;
        $rootScope.menuItemHeight = $rootScope.menuHeight / 8;
        $rootScope.menuItemFontSize = $rootScope.menuItemHeight * 0.5;
        $rootScope.pageNavWidth = angular.element($window).width() - 362;
        $rootScope.bigArrowTop = $rootScope.bodyHeight / 2 - 62 - 0.05 * $rootScope.bodyHeight;
        $rootScope.smallIconSize = Math.floor($rootScope.appHeight / 160) * 10;

        dataServiceProvider.getInitData()
            .then(function(initData) {
                $rootScope.cssTemplates = initData.cssTemplates;
                $rootScope.navPages = initData.navPages;
                $rootScope.partOfSpeechColors = initData.posColors;
                $rootScope.appSettings = initData.appSettings;
                databaseServiceProvider.createAuthAndLogin($rootScope.appSettings.email, $rootScope.appSettings.password);

                $rootScope.currentNavTree = {
                    "treePageUrls": [$rootScope.appSettings.defaultPageUrl],
                    "treePageNames": [$rootScope.appSettings.defaultPageName],
                    "position": 0
                }; 
            }, function(){
                alert("Kunde inte ladda data.");
            });
        //check if changes are made and if user wants to use them or cancel them.
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
            var stateHeader = "";
            switch (toState.name) {
                case "about":
                    stateHeader = "Om BlissKom";
                    break;
                case "blisselection":
                    stateHeader = "Val från blissbibliotek";
                    break;
                case "glossunitsettings":
                    stateHeader = "Inställningar för betydelse";
                    break;
                case "backup":
                    stateHeader = "Säkerhetskopiering och återställning";
                    break;
                default:
                    stateHeader = "";
                    break;
            }
            $rootScope.stateHeaderText = stateHeader;
            //event.preventDefault();
        });

    });  

//test-code
//just for testing, does the application react to battery status change?
//window.addEventListener("batterystatus", onBatteryStatus, false);

//function onBatteryStatus(info) {
//    window.alert("Level: " + info.level + " isPlugged: " + info.isPlugged);
 //   var testdiv = document.getElementById("test");
  //  testdiv.innerHTML = "Testet funkade!";
//};

