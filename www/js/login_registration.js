var app = angular.module('starter');
app.controller('loginCtrl', function($scope,$ionicPopup, $state,$timeout,$ionicLoading,$http) {
$scope.datas = [];
$scope.login = function(log){
    var lin = {username: log.username, password: log.pass};
        $http({
            method: 'POST',
            url: 'http://Localhost/pte/index.php/mobile_c/login',
            data: lin,
            headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
        })
        .success(function(res){
			if(res==0){
				var alertPopup = $ionicPopup.alert({
                title: 'Login Failed',
                template: 'Please check your Account Info'
				});
			}else{
				localStorage.setItem('id',res);
                var id=localStorage.getItem('id');
                $scope.gae =[];
                var url1 = 'http://Localhost/pte/index.php/mobile_c/no_details/'+id;
                $http.get(url1).success(function (data) {
                    $scope.gae = data;  
                    if($scope.gae==1){
                        $state.go('no_details');
                    }else{
                        $state.go("home");
                    }
                });
			}
        }).error(function(error){
            var alertPopup = $ionicPopup.alert({
                title: 'Login Failed',
                template: 'Server Error'
            });
        });
    };
});

app.controller('registerCtrl', function($scope,$http,$ionicPopup,$state) {
    $scope.register = function(reg){
        var regData = {fname: reg.fname, lname: reg.lname, username: reg.username, password: reg.pass };
        $http({
            method: 'POST',
            url: 'http://Localhost/PTEBackend/index.php/Main_controller/register',
            data: regData,
            headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
        }).success(function (res){
            if(res==0){
                var alertPopup = $ionicPopup.alert({
                    title: 'Has account!',
                    template: 'You already have an account!'
                });
                $state.go('login');
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Dont have account!',
                    template: 'Succesful Signup!'
                });
                $state.go('login');
            }
            console.log(res);
        }).error(function(error){
            var alertPopup = $ionicPopup.alert({
                title: '',
                template: 'Error in Signing up!'
            });

        });

    };
});