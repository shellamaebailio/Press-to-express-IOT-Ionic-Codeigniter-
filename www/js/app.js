// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    //Local Notification
         window.plugin.notification.local.onadd = function (id, state, json) {
            var notification = {
                id: id,
                state: state,
                json: json
            };
            $timeout(function() {
                $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
                window.alert("timeout");
            });
        };


  });
})



    .config(function($stateProvider, $urlRouterProvider) {

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'template/login.html',
            controller: 'loginCtrl'
        });
         $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'template/register.html',
            controller: 'registerCtrl'
        });
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: 'template/home.html',
            controller: 'homeCtrl'
        });
        $stateProvider.state('settings', {
            url: '/settings',
            templateUrl: 'template/settings.html',
            controller: 'settingsCtrl'
        });
       
         $stateProvider.state('accept_detail', {
            url: '/accept_detail',
            templateUrl: 'template/accept_details.html',
            controller: 'accept_detailCtrl'
        });

          $stateProvider.state('change_pass', {
            url: '/change_pass',
            templateUrl: 'template/change_pass.html',
            controller: 'change_passCtrl'
        });

           $stateProvider.state('no_details', {
            url: '/no_details',
            templateUrl: 'template/no_details.html',
            controller: 'no_detailsCtrl'
        });

        $urlRouterProvider.otherwise('/login');
    });



app.controller('settingsCtrl', function($scope,$rootScope,$http,$ionicModal,$ionicPopup,$state,$ionicHistory) {
    $state.go($state.current, {}, {reload: true});
    if(localStorage.getItem('id')){
        $scope.logout = function(){
            localStorage.clear();
            $ionicHistory.clearCache();
            var id =localStorage.getItem('id');
            var regData = {logged_in: 0};
                $http({
                    method: 'POST',
                    url: 'http://Localhost/pte/index.php/mobile_c/logged_out/'+id,
                    data: regData,
                    headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
                })
            localStorage.setItem('id',"");
            $state.go('login');
        }
        $scope.account = [];
        var id =localStorage.getItem('id');
        var data = 'http://Localhost/pte/index.php/caretaker_c/edit_accc/'+id; 
        $http.get(data).success(function(data){
              console.log(data);
              $scope.account = data;

        });
        $scope.showSelectValue = function(mySelect) {
            console.log(mySelect);
        }
        $scope.update = function(){
            var id =localStorage.getItem('id');
            var fname = document.getElementById("fname").value;
            var mname = document.getElementById("mname").value;
            var lname = document.getElementById("lname").value;
            var gender = document.getElementById("gender").value;
            var email = document.getElementById("email").value;
            var con = document.getElementById("con").value;
            var add = document.getElementById("add").value;
            if(gender == "female"){
                var regData = {fname: fname, mname: mname, lname: lname, gender: "female", email: email, contact_no: con, address: add};
            }else if(gender == "male"){
                var regData = {fname: fname, mname: mname, lname: lname, gender: "male", email: email, contact_no: con, address: add};
            }
            $http({
                method: 'POST',
                url: 'http://Localhost/pte/index.php/mobile_c/update/'+id,
                data: regData,
                headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
            }).success(function (res){
                var alertPopup = $ionicPopup.alert({
                title: '',
                template: 'You successfully updated your Account!'
            });     
            }).error(function(error){
                var alertPopup = $ionicPopup.alert({
                title: '',
                template: 'Your face is a Failure! hahaha :D'
                });     
            });
        }
        $scope.logout = function(){
            localStorage.clear();
            $ionicHistory.clearCache();
            var id = localStorage.getItem('id');
            var regData = {logged_in: 0};
            $http({
                method: 'POST',
                url: 'http://Localhost/pte/index.php/mobile_c/logged_out/'+id,
                data: regData,
                headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
            })
            localStorage.setItem('id',"");
            $state.go('login');
        }
        $scope.password = function(){
            $state.go('change_pass');
        }
    }else{
        $state.go('login');
    }
});

app.controller('homeCtrl', function($scope,$http,$state,$ionicModal,$ionicPopup,$cordovaLocalNotification,$ionicHistory) {
    $state.go($state.current, {}, {reload: true});
    if(localStorage.getItem('id')){
        var myVar = setInterval(function(){ online() }, 300);
        function online(){
            var id=localStorage.getItem('id');
            var data = {caretaker_id:id}
            $http({
                method: 'POST',
                url: 'http://Localhost/pte/index.php/mobile_c/online',
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
        }
        var myVar = setInterval(function(){ req() }, 1000);
        function req() {
            var url = 'http://Localhost/pte/index.php/mobile_c/get_request';
            $http.get(url).success(function (data) {
                console.log(data);
                $scope.gae = data;
                $scope.a = null;
                if(data){
                    $scope.gae.forEach(function(item){
                    $scope.a = item.trans_id;
                    })
                }

                // local
                if($scope.a!=null){
                    console.log('naa');
                    $cordovaLocalNotification.add({
                        id: "1234",
                        message: "There is a Request",
                        title: "exPress",
                        autoCancel: true,
                        icon: 'res://click.png',
                        sound: 'file://sound/beep.mp3'
                    }).then(function () {
                        console.log("The notification has been set");
                    });
                    $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
                        console.log("Notification 1234 Scheduled: " + isScheduled);
                    });
                } else {
                    console.log('wala');
                }
            });
        }       
        $scope.showmodal = function(tid){
            var id=localStorage.getItem('id');
            var data = {trans_id:tid,caretaker_id:id}
            $http({
                method: 'POST',
                url: 'http://Localhost/pte/index.php/mobile_c/accept_req',
                data: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}

            }).success(function (res){
                $state.go('no_details');
            }).error(function(error){
            });
        }
        $scope.logout = function(){
                localStorage.clear();
                $ionicHistory.clearCache();
                var id =localStorage.getItem('id');
                var regData = {logged_in: 0};
                $http({
                    method: 'POST',
                    url: 'http://Localhost/pte/index.php/mobile_c/logged_out/'+id,
                    data: regData,
                    headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
                })
                localStorage.setItem('id',"");
                 $state.go('login');
        }
    }else{
        $state.go('login');
    }
});

app.controller('change_passCtrl', function($scope,$rootScope,$state,$ionicPopup,$http,$ionicHistory) {
    $state.go($state.current, {}, {reload: true});
    if(localStorage.getItem('id')){
        $scope.logout = function(){
            localStorage.clear();
            $ionicHistory.clearCache();
            var id =localStorage.getItem('id');
            var regData = {logged_in: 0};
                $http({
                    method: 'POST',
                    url: 'http://Localhost/pte/index.php/mobile_c/logged_out/'+id,
                    data: regData,
                    headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
                })
            localStorage.setItem('id',"");
            $state.go('login');
        }
        $scope.account = [];
        var id =localStorage.getItem('id');
        var data = 'http://Localhost/pte/index.php/caretaker_c/edit_accc/'+id; 
        $http.get(data).success(function(data){
            console.log(data);
            $scope.account = data;
        });
        $scope.update_username = function(){
            var uname = document.getElementById("uname").value;
            var regData = {username: uname};
                $http({
                    method: 'POST',
                    url: 'http://Localhost/pte/index.php/mobile_c/update_uname/'+id,
                    data: regData,
                    headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
                }).success(function (res){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Update Username',
                        template: 'successfully Updated Username!'
                    });     
                }).error(function(error){
                });
            }
        $scope.update_password = function(pass){
             var regData = {password: pass.pass};
            $http({
                method: 'POST',
                url: 'http://Localhost/pte/index.php/mobile_c/update_pass/'+id,
                data: regData,
                headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
            }).success(function (res){
                var alertPopup = $ionicPopup.alert({
                    title: 'Update Username',
                    template: 'successfully Updated Password!'
                }); 
                }).error(function(error){
                });  
        }
    }else{
        $state.go('login');
    }    
});

app.controller('no_detailsCtrl', function($scope,$rootScope,$state,$ionicPopup,$http) {
    $state.go($state.current, {}, {reload: true});
    if(localStorage.getItem('id')){
        $scope.nodetail = [];
        var id=localStorage.getItem('id');
        var url1 = 'http://Localhost/pte/index.php/mobile_c/no_details_n/'+id;
        $http.get(url1).success(function (data) {
            console.log(data);
            $scope.nodetail = data;
        });
        $scope.get = function(id){
            var info = document.getElementById("info").value;
            var regData = {trans_id: id, details: info};
            $http({
                method: 'POST',
                url: 'http://Localhost/pte/index.php/mobile_c/add_details',
                data: regData,
                headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
            })
            $state.go('home');
        }
        $scope.cancel = function(id){
            var regData = {trans_id: id};
            $http({
                method: 'POST',
                url: 'http://Localhost/pte/index.php/mobile_c/cancel_req',
                data: regData,
                headers : { 'Content-Type' : ' application/x-www-form-urlencoded' }
            })
                $state.go('home');    
        }
    }else{
        $state.go('login');
    }
});



