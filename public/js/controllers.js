'use strict';

var app = angular.module('myApp');

app.controller('loginCtrl', function($scope, $state, $auth, $rootScope, $http, $q) {
  console.log('loginCtrl!');

  $scope.login = () => {
      $auth.login($scope.user)
      .then(res =>{
        console.log("res: ", res);
        //$rootScope.currentUser = res.data;
        $state.go('profile');
      })
      .catch(err =>{
        console.log("err:", err);
      })
    };
});

app.controller('mainCtrl', function($scope, $state, $auth, $rootScope, $http, $q, User) {
  console.log('mainCtrl!');


  $rootScope.currentUser;
  $scope.stock;

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logout = () => {
    $auth.logout();
    $state.go('home');
  };

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
      .then(res => {
        $state.go('home');
      })
      .catch(err => {
        console.log('err:', err);
      })
  };

  $scope.getStock = (name)=>{

    $scope.showSelect = true;
    //console.log("in get stock: " , $scope.stock.name);
    console.log("in get stock: " , name);
    var url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${name}&callback=JSON_CALLBACK`
    console.log("url:" , url);
    $http.jsonp(url)
    .success(function(data) {
        console.log("data: ", data);
        $scope.stocky = data;
    })
    .error(function(err){
      console.log("err:", err);
    });
  }

  $scope.updateStocks = ()=>{
    console.log("update stock", $rootScope.currentUser)
    User.addStock($rootScope.currentUser, $scope.stocky.Symbol)
      .then(profile =>{
        console.log("profile:", profile);
      })
      .catch(err =>{
        console.log("err:", err);
      })
  }
});

app.controller('registerCtrl', function($scope, $state, $auth) {
  console.log('registerCtrl!');

  $scope.register = () => {
    if($scope.user.password !== $scope.user.password2){
      $scope.user.password = null;
      $scope.user.password2 = null;
      alert('Passwords must match!');
    }else{
      $auth.signup($scope.user)
      .then(res =>{
        console.log("res: ", res);
        $state.go('login');
      })
      .catch(err =>{
        console.log("err:", err);
      })
    }
  };
});

app.controller('feedCtrl', function($scope, $$state, $state, User) {
  console.log('feedCtrl!');

  var userPromise = User.getAll();
  console.log("userPromise:", userPromise);
  userPromise.then(
    function(result) {
       console.log(result.data);
       $scope.userFeed = result.data;
    });
});

app.controller('profileCtrl', function($scope, Profile, ProfileByID, $state, User, $rootScope, WallPost) {
  console.log('profileCtrl!');

  $rootScope.currentUser = Profile;
  $scope.curretStocks;

  $scope.user = ProfileByID || Profile;

  console.log("user:", $scope.user );
  console.log("curruser:", $rootScope.currentUser );

  for(var i =0; i< $rootScope.currentUser.stocks.length; i++){
      //console.log("in get stock: " , $scope.stock.name);
      let sym = $rootScope.currentUser.stocks[i];
      var url = `http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${sym}&callback=JSON_CALLBACK`
      $http.jsonp(url)
      .success(function(data) {
          console.log("data: ", data);
          $scope.curretStocks.push(data);
      })
      .error(function(err){
        console.log("err:", err);
      });
  }

  $scope.showdisplayNameForm = () =>{
    console.log("show form");
    $scope.displayNameForm = true;
  }

  $scope.updatedisplayName = () => {
    $scope.displayNameForm = false;
    $scope.user.displayName = $scope.newItem.displayName;
    User.updateProfile($scope.user._id, $scope.newItem)
      .then(profile =>{
        console.log("profile:", profile);
        $scope.newItem.displayName = '';
      })
      .catch(err =>{
        console.log("err:", err);
      })
  }

  $scope.canceldisplayName = () =>{
    $scope.usernameForm = true;
    $scope.newItem.displayName = '';
  }

//photo
  $scope.showPictureForm = () =>{
    console.log("show form");
    $scope.photoForm = true;
  }

  $scope.updatePicture = () => {
    $scope.photoForm = false;
    console.log("$state.current: ", $state.current);
    $scope.user.profileImage = $scope.newItem.profileImage;
    console.log("$scope.newItem:", $scope.newItem);
    User.updateProfile($scope.user._id, $scope.newItem)
      .then(profile =>{
        console.log("profile:", profile);
        $scope.newItem.profileImage = '';
      })
      .catch(err =>{
        console.log("err:", err);
      })
  }

  $scope.cancelPhotoUrl = () =>{
    $scope.photoForm = true;
    $scope.newItem.photoUrl = '';
  }

  
 $scope.addPicture = ()=>{
    Picture.addPicture($scope.newItem)
    .then(picture=>{
      console.log("added" , picture);
      Album.addPictureToAlbum($stateParams.albumId, picture._id);
    })
    .then($state.go($state.$current, null, { reload: true }))
    .catch(err=>{
      console.log("error: ", err );
    })
  }


});

