/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("BlissKom", ["ngRoute"]).config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainController'
        })
        .when('/device', {
            templateUrl: 'views/device.html',
            controller: 'MainController'
        });
}).controller("MainController", function($scope) { 
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
        3: {
            name: '3',
            type: 'type3'
        }
    };
});
    
window.addEventListener("batterystatus", onBatteryStatus, false);

function onBatteryStatus(info) {
    window.alert("Level: " + info.level + " isPlugged: " + info.isPlugged);
    var testdiv = document.getElementById("test");
    testdiv.innerHTML = "Testet funkade!";
}



        

