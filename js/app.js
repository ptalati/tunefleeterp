(function () {
    var app = angular.module('tuneFleetStore', [
        'ngRoute',
        'ngResource',
        'ui.router',
        'angular-loading-bar',
        'ngDialog',
        'ui.datepicker',
        'app.loading',
        'AngularChart',
        'login-controller'
    ]);

    app.constant('baseUrl', 'http://localhost:8092/');
    //app.constant('baseUrl', 'http://tunefleet.braindemo.com/');
    app.constant('isMobile', navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i));

    app.config([
        'cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = true;
            cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner"><img src="images/logo.png" /> Loading...</div></div>';
        }
    ]);

    app.config(['ngDialogProvider', function (ngDialogProvider) {
        ngDialogProvider.setDefaults({
            className: 'ngdialog-theme-default',
            plain: false,
            showClose: true,
            closeByDocument: true,
            closeByEscape: true,
            appendTo: false,
            preCloseCallback: function () {
                console.log('default pre-close callback');
            }
        });
    }]);

    app.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    ]);

    app.config([
        '$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider.state("login", {
                url: "/login",
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            }).state("logout", {
                url: "/logout",
                template: 'Logout',
                controller: function ($scope, baseUrl, $state) {
                    $scope.loadDefault = function () {
                        if (localStorage["TuneFleetUser"]) {
                            localStorage.removeItem("TuneFleetUser");
                            
                            $state.go("login");
                        }
                    };

                    $scope.loadDefault();
                }
            }).state("help", {
                url: "/help",
                templateUrl: 'templates/help.html'
            }).state("dashboard", {
                url: "/dashboard",
                templateUrl: 'templates/home.html'
            });

            $urlRouterProvider.otherwise(function ($injector, $location) {
                var $state = $injector.get("$state");
                
                console.log(localStorage.getItem("TuneFleetUser"));

                if (!localStorage.getItem("TuneFleetUser")) {
                    $state.go("login");
                } else {
                	$state.go("dashboard");
                }
            });
        }
    ]);

    app.controller('TuneFleetController', [
        '$scope', '$http', '$log', '$interval', 'baseUrl', '$location', '$state', '$rootScope',
        function ($scope, $http, $log, $interval, baseUrl, $location, $state, $rootScope) {
            $scope.loggedIn = false;
            $scope.showMenu = true;

            $scope.$on('$locationChangeStart', function (event) {
                console.log('Route changed');
                console.log($location.path());

                if ($location.path() === '/login') $scope.showMenu = false;
                else $scope.showMenu = true;

                $scope.fetchUser();
            });

            $scope.fetchUser = function () {
                if (localStorage.getItem("TuneFleetUser")) {
                    $scope.loggedIn = true;
                    $scope.showMenu = true;
                    
                    $scope.user = JSON.parse(localStorage.getItem("TuneFleetUser"));
                    console.log($scope.user.Email);
                }
            };

            $scope.fetchUser();
            
            var data = {"xData": ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],"yData":[{
                "name": "Tokyo",
                "data": [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }, {
                "name": "New York",
                "data": [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
            }, {
                "name": "Berlin",
                "data": [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
            }, {
                "name": "London",
                "data": [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]}
            
            $scope.lineChartYData=data.yData
            $scope.lineChartXData=data.xData
        }
    ]);
})();
