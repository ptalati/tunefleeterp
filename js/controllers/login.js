(function () {
    var app = angular.module('login-controller', ['angular-loading-bar']);

    app.controller('LoginController', [
        '$window', '$scope', '$http', '$log', 'baseUrl', '$state',
        function ($window, $scope, $http, $log, baseUrl, $state) {
            $scope.login = {};
            $scope.error = {
                Status: false,
                Message: ''
            };
            $scope.success = {
                Status: false,
                Message: ''
            };
            $scope.ipAddress = '';

            $scope.loginUser = function (login) {
                $scope.error = {
                    Status: false,
                    Message: ''
                };
                $scope.success = {
                    Status: false,
                    Message: ''
                };
                
                $http.post(baseUrl + "api/account/auth", JSON.stringify(login)).then(function (res) {
        		    console.log('res', res);

        		    $scope.success = {
                        Status: true,
                        Message: 'User login successful'
                    };
		            
		            localStorage.setItem("TuneFleetUser", JSON.stringify(res.data));

                    console.log("User logged in.");

                    $state.go("dashboard");
		        }, function(res) {
		        	$scope.error = {
	                    Status: true,
	                    Message: res.data.ExceptionMessage
	                };
		        });
            };

            $scope.getClientIPAddress = function () {
                $.getJSON("http://jsonip.com/?callback=?", function (data) {
                    console.log(data);
                    $scope.ipAddress = data.ip;
                });
            };

            $scope.loadDefault = function () {
                //localStorage.clear();
                //console.log(localStorage);

                if (localStorage.getItem("TuneFleetUser")) {
                    $scope.success = {
                        Status: true,
                        Message: 'You are already logged in!'
                    };

                    $state.go("dashboard");
                }
            };

            $scope.getClientIPAddress();
            $scope.loadDefault();
        }
    ]);
})();