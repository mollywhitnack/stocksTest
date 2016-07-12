'use strict';

var app = angular.module('myApp', ['ui.router', 'satellizer']);

app.config(function($authProvider) {

  $authProvider.loginUrl = 'api/users/login';
  $authProvider.signupUrl = 'api/users/signup';

  $authProvider.facebook({
    clientId: '255060128209165',
    url: '/api/users/facebook'
  });

});

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', { url: '/', templateUrl: '/html/home.html' })
    .state('login', {
      url: '/login',
      templateUrl: '/html/login.html',
      controller: 'loginCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: '/html/register.html',
      controller: 'registerCtrl'
    })
    .state('profile', {
      url: '/profile/:userId',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl',
      resolve: {
        Profile: function(User) {
          return User.profile();
        },
        ProfileByID: function(User, $stateParams){
          return User.getProfile($stateParams.userId);
        }
      }
    })
    .state('feed', {
      url: '/feed',
      templateUrl: '/html/feed.html',
      controller: 'feedCtrl'/*,
      resolve: {
        Users: function(User) {
          return User.getAll();
        }
      }*/
    })
  $urlRouterProvider.otherwise('/');
});
