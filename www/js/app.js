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
                        controller: 'HeaderCtrl'
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
                        controller: 'HeaderCtrl'
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
                        controller: 'HeaderCtrl'
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
                        controller: 'HeaderCtrl'
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
                        controller: 'HeaderCtrl'
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
                        controller: 'HeaderCtrl'
                    }
                }
            })
            .state('conversation', {
                url: '/conversation',
                views: {
                    '': { 
                        templateUrl: 'views/conversation.html',
                        controller: 'ConversationCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderCtrl'
                    }
                }
            })
            .state('test', {
                url: '/test',
                views: {
                    '': { 
                        templateUrl: 'views/test.html',
                        controller: 'TestCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderCtrl'
                    }
                }
            });
    })
    .run(function($rootScope, dataServiceProvider, databaseServiceProvider, $window, appDataService) {
        //keep track of current navigation pages' url's/names
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
                appDataService.setCssTemplatesData(initData.cssTemplatesData);
                $rootScope.allGlossUnits = initData.glossUnitsData;
                appDataService.setNavPagesData(initData.navPagesData);
                appDataService.setPartOfSpeechColorsData(initData.posColorsData);
                databaseServiceProvider.createAuthAndLogin(initData.appSettingsData.email, initData.appSettingsData.password);
                appDataService.setAppSettingsData(initData.appSettingsData);
                appDataService.resetNavTree();                
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
                case "conversation":
                    stateHeader = "Konversation";
                    break;
                default:
                    stateHeader = "";
                    break;
            }
            $rootScope.stateHeaderText = stateHeader;
            //event.preventDefault();
        });

    });